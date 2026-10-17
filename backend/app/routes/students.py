import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Student, User, Application, Offer
from app.schemas import StudentCreate, StudentUpdate, StudentOut, BulkUpdateStudentsRequest
from app.auth import get_current_user, require_roles
from app.rules_engine import evaluate_student_eligibility, recalculate_all_students_eligibility
from app.audit import log_audit_event

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("", response_model=dict)
def get_students(
    search: Optional[str] = None,
    department: Optional[str] = None,
    graduation_year: Optional[int] = None,
    placement_eligibility: Optional[str] = None,
    placement_status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    sort_by: str = "roll_number",
    sort_dir: str = "asc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Student).filter(Student.is_deleted == False)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Student.roll_number.ilike(search_pattern),
                Student.full_name.ilike(search_pattern),
                Student.email.ilike(search_pattern),
                Student.department.ilike(search_pattern),
                Student.job_role.ilike(search_pattern)
            )
        )

    if department and department != "All":
        query = query.filter(Student.department == department)

    if graduation_year:
        query = query.filter(Student.graduation_year == graduation_year)

    if placement_eligibility and placement_eligibility != "All":
        query = query.filter(Student.placement_eligibility == placement_eligibility)

    if placement_status and placement_status != "All":
        query = query.filter(Student.placement_status == placement_status)

    total = query.count()

    # Sorting
    if hasattr(Student, sort_by):
        attr = getattr(Student, sort_by)
        query = query.order_by(attr.desc() if sort_dir.lower() == "desc" else attr.asc())
    else:
        query = query.order_by(Student.roll_number.asc())

    students = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
        "data": [StudentOut.from_orm(s) for s in students]
    }


@router.get("/{student_id}", response_model=dict)
def get_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Fetch student applications and offers
    apps = db.query(Application).filter(Application.student_id == student_id).all()
    offers = db.query(Offer).filter(Offer.student_id == student_id, Offer.is_deleted == False).all()

    app_list = []
    for app in apps:
        app_list.append({
            "id": app.id,
            "company_name": app.company.name if app.company else "Unknown",
            "drive_title": app.drive.title if app.drive else "Unknown",
            "role_title": app.job_role.role_title if app.job_role else "N/A",
            "current_stage": app.current_stage.stage_name if app.current_stage else "Applied",
            "status": app.status,
            "applied_date": app.applied_date.isoformat() if app.applied_date else None,
            "rounds": [{
                "round_name": r.round_name,
                "status": r.status,
                "score": r.score,
                "feedback": r.feedback
            } for r in app.rounds]
        })

    offer_list = [{
        "id": o.id,
        "company_name": o.company.name if o.company else "Unknown",
        "job_role": o.job_role,
        "ctc_lpa": o.ctc_lpa,
        "fixed_salary_lpa": o.fixed_salary_lpa,
        "variable_salary_lpa": o.variable_salary_lpa,
        "currency": o.currency,
        "offer_date": o.offer_date.isoformat() if o.offer_date else None,
        "status": o.status
    } for o in offers]

    return {
        "student": StudentOut.from_orm(student),
        "applications": app_list,
        "offers": offer_list
    }


@router.post("", response_model=StudentOut)
def create_student(
    student_in: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    # Check duplicate roll_number
    existing_roll = db.query(Student).filter(Student.roll_number == student_in.roll_number, Student.is_deleted == False).first()
    if existing_roll:
        raise HTTPException(status_code=400, detail=f"Roll number '{student_in.roll_number}' already exists")

    # Check duplicate email
    existing_email = db.query(Student).filter(Student.email == student_in.email, Student.is_deleted == False).first()
    if existing_email:
        raise HTTPException(status_code=400, detail=f"Email '{student_in.email}' is already registered")

    student_data = student_in.dict()
    student = Student(**student_data)
    
    # Calculate initial eligibility
    status_result, reasons = evaluate_student_eligibility(db, student)
    student.placement_eligibility = status_result
    student.eligibility_reasons = reasons

    db.add(student)
    db.commit()
    db.refresh(student)

    log_audit_event(
        db, current_user, "CREATE", "Student", str(student.id),
        {"roll_number": student.roll_number, "name": student.full_name, "dept": student.department}
    )

    return StudentOut.from_orm(student)


@router.put("/{student_id}", response_model=StudentOut)
def update_student(
    student_id: int,
    student_in: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    student = db.query(Student).filter(Student.id == student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Check duplicate roll_number if changed
    if student_in.roll_number and student_in.roll_number != student.roll_number:
        existing = db.query(Student).filter(Student.roll_number == student_in.roll_number, Student.id != student_id, Student.is_deleted == False).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"Roll number '{student_in.roll_number}' already in use")

    # Check duplicate email if changed
    if student_in.email and student_in.email != student.email:
        existing = db.query(Student).filter(Student.email == student_in.email, Student.id != student_id, Student.is_deleted == False).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"Email '{student_in.email}' already in use")

    update_data = student_in.dict(exclude_unset=True)
    before_state = {k: getattr(student, k) for k in update_data.keys()}

    for field, value in update_data.items():
        setattr(student, field, value)

    # Recalculate eligibility
    status_result, reasons = evaluate_student_eligibility(db, student)
    student.placement_eligibility = status_result
    student.eligibility_reasons = reasons

    db.commit()
    db.refresh(student)

    log_audit_event(
        db, current_user, "UPDATE", "Student", str(student.id),
        {"before": before_state, "after": update_data}
    )

    return StudentOut.from_orm(student)


@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    student = db.query(Student).filter(Student.id == student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.is_deleted = True
    db.commit()

    log_audit_event(
        db, current_user, "DELETE", "Student", str(student_id),
        {"roll_number": student.roll_number, "name": student.full_name}
    )

    return {"message": "Student successfully deleted"}


@router.post("/bulk-update")
def bulk_update_students(
    req: BulkUpdateStudentsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    if not req.student_ids:
        raise HTTPException(status_code=400, detail="No students selected")

    students = db.query(Student).filter(Student.id.in_(req.student_ids), Student.is_deleted == False).all()
    count = 0
    for s in students:
        for k, v in req.updates.items():
            if hasattr(s, k) and k not in ["id", "roll_number", "created_at"]:
                setattr(s, k, v)
        status_result, reasons = evaluate_student_eligibility(db, s)
        s.placement_eligibility = status_result
        s.eligibility_reasons = reasons
        count += 1

    db.commit()

    log_audit_event(
        db, current_user, "BULK_UPDATE", "Student", f"{count} students",
        {"updates": req.updates, "affected_ids": req.student_ids}
    )

    return {"message": f"Successfully updated {count} students", "updated_count": count}


@router.post("/recalculate-all")
def recalculate_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    results = recalculate_all_students_eligibility(db)
    log_audit_event(db, current_user, "RECALCULATE", "Student", "ALL", results)
    return {"message": "Eligibility successfully recalculated for all students", "results": results}
