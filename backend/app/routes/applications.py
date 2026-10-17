from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Application, InterviewRound, Student, PlacementDrive, RecruitmentStage, User
from app.schemas import (
    ApplicationCreate, ApplicationUpdate, ApplicationOut,
    InterviewRoundBase, InterviewRoundCreate, InterviewRoundUpdate, InterviewRoundOut
)
from app.auth import get_current_user, require_roles
from app.audit import log_audit_event

router = APIRouter(prefix="/applications", tags=["Applications & Interviews"])

@router.get("", response_model=List[ApplicationOut])
def get_applications(
    drive_id: Optional[int] = None,
    student_id: Optional[int] = None,
    company_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Application)

    if drive_id:
        query = query.filter(Application.drive_id == drive_id)

    if student_id:
        query = query.filter(Application.student_id == student_id)

    if company_id:
        query = query.filter(Application.company_id == company_id)

    if status and status != "All":
        query = query.filter(Application.status == status)

    apps = query.order_by(Application.applied_date.desc()).all()

    result = []
    for a in apps:
        out = ApplicationOut.from_orm(a)
        out.student_name = a.student.full_name if a.student else "Unknown"
        out.student_roll = a.student.roll_number if a.student else "Unknown"
        out.student_department = a.student.department if a.student else "Unknown"
        out.student_cgpa = a.student.cgpa if a.student else 0.0
        out.company_name = a.company.name if a.company else "Unknown"
        out.drive_title = a.drive.title if a.drive else "Unknown"
        out.role_title = a.job_role.role_title if a.job_role else "N/A"
        out.current_stage_name = a.current_stage.stage_name if a.current_stage else "Applied"
        out.rounds = [InterviewRoundOut.from_orm(r) for r in a.rounds]
        result.append(out)

    return result


@router.post("", response_model=ApplicationOut)
def create_application(
    app_in: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    student = db.query(Student).filter(Student.id == app_in.student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    drive = db.query(PlacementDrive).filter(PlacementDrive.id == app_in.drive_id, PlacementDrive.is_deleted == False).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")

    # Check if student already applied to this drive
    existing = db.query(Application).filter(Application.student_id == app_in.student_id, Application.drive_id == app_in.drive_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student has already applied to this placement drive")

    # Default to first stage of the drive
    first_stage = db.query(RecruitmentStage).filter(RecruitmentStage.drive_id == app_in.drive_id).order_by(RecruitmentStage.stage_order.asc()).first()
    current_stage_id = app_in.current_stage_id or (first_stage.id if first_stage else None)

    app_obj = Application(
        student_id=app_in.student_id,
        drive_id=app_in.drive_id,
        company_id=app_in.company_id,
        job_role_id=app_in.job_role_id,
        current_stage_id=current_stage_id,
        status=app_in.status or "Applied",
        remarks=app_in.remarks
    )
    db.add(app_obj)

    # If student status was Unplaced, mark as In Process
    if student.placement_status == "Unplaced":
        student.placement_status = "In Process"

    db.commit()
    db.refresh(app_obj)

    log_audit_event(
        db, current_user, "CREATE", "Application", str(app_obj.id),
        {"student": student.full_name, "roll": student.roll_number, "drive": drive.title}
    )

    out = ApplicationOut.from_orm(app_obj)
    out.student_name = student.full_name
    out.student_roll = student.roll_number
    out.student_department = student.department
    out.student_cgpa = student.cgpa
    out.company_name = app_obj.company.name if app_obj.company else "Unknown"
    out.drive_title = drive.title
    out.role_title = app_obj.job_role.role_title if app_obj.job_role else "N/A"
    out.current_stage_name = app_obj.current_stage.stage_name if app_obj.current_stage else "Applied"
    return out


@router.put("/{application_id}", response_model=ApplicationOut)
def update_application(
    application_id: int,
    app_in: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    app_obj = db.query(Application).filter(Application.id == application_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")

    update_data = app_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(app_obj, field, value)

    db.commit()
    db.refresh(app_obj)

    log_audit_event(
        db, current_user, "UPDATE", "Application", str(app_obj.id),
        {"updates": update_data}
    )

    out = ApplicationOut.from_orm(app_obj)
    out.student_name = app_obj.student.full_name if app_obj.student else "Unknown"
    out.student_roll = app_obj.student.roll_number if app_obj.student else "Unknown"
    out.student_department = app_obj.student.department if app_obj.student else "Unknown"
    out.student_cgpa = app_obj.student.cgpa if app_obj.student else 0.0
    out.company_name = app_obj.company.name if app_obj.company else "Unknown"
    out.drive_title = app_obj.drive.title if app_obj.drive else "Unknown"
    out.role_title = app_obj.job_role.role_title if app_obj.job_role else "N/A"
    out.current_stage_name = app_obj.current_stage.stage_name if app_obj.current_stage else "Applied"
    out.rounds = [InterviewRoundOut.from_orm(r) for r in app_obj.rounds]
    return out


# ---------------- Interview Rounds Endpoints ----------------
@router.post("/{application_id}/rounds", response_model=InterviewRoundOut)
def add_interview_round(
    application_id: int,
    round_in: InterviewRoundBase,
    stage_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    app_obj = db.query(Application).filter(Application.id == application_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")

    round_obj = InterviewRound(
        application_id=application_id,
        stage_id=stage_id,
        round_name=round_in.round_name,
        round_date=round_in.round_date,
        interviewer_name=round_in.interviewer_name,
        status=round_in.status,
        score=round_in.score,
        feedback=round_in.feedback
    )
    db.add(round_obj)
    db.commit()
    db.refresh(round_obj)

    log_audit_event(
        db, current_user, "CREATE", "InterviewRound", str(round_obj.id),
        {"application_id": application_id, "round_name": round_obj.round_name, "status": round_obj.status}
    )

    return round_obj


@router.put("/rounds/{round_id}", response_model=InterviewRoundOut)
def update_interview_round(
    round_id: int,
    round_in: InterviewRoundUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    round_obj = db.query(InterviewRound).filter(InterviewRound.id == round_id).first()
    if not round_obj:
        raise HTTPException(status_code=404, detail="Interview round not found")

    update_data = round_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(round_obj, field, value)

    db.commit()
    db.refresh(round_obj)

    log_audit_event(
        db, current_user, "UPDATE", "InterviewRound", str(round_obj.id),
        {"updates": update_data}
    )

    return round_obj
