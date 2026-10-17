import io
import json
import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Response, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import pandas as pd

from app.database import get_db
from app.models import Student, Company, EligibilityRule, Offer, ImportHistory, User
from app.auth import get_current_user, require_roles
from app.rules_engine import evaluate_student_eligibility
from app.audit import log_audit_event

router = APIRouter(prefix="/import-export", tags=["Bulk Import & Export"])

SAMPLE_TEMPLATES = {
    "students": [
        {
            "roll_number": "21CS001",
            "full_name": "Aarav Sharma",
            "email": "aarav.sharma@college.edu",
            "phone": "+91 9876543210",
            "department": "CSE",
            "degree": "B.Tech",
            "academic_year": "2024-2025",
            "graduation_year": 2025,
            "cgpa": 8.75,
            "percentage": 82.5,
            "active_backlogs": 0,
            "total_backlogs": 0,
            "skills": "Python, React, SQL, Machine Learning",
            "internship_experience": "Yes",
            "internship_details": "6-month SDE Intern at CloudTech",
            "resume_link": "https://example.com/resumes/21cs001.pdf",
            "placement_status": "Unplaced"
        },
        {
            "roll_number": "21IT002",
            "full_name": "Ananya Patel",
            "email": "ananya.patel@college.edu",
            "phone": "+91 9876543211",
            "department": "IT",
            "degree": "B.Tech",
            "academic_year": "2024-2025",
            "graduation_year": 2025,
            "cgpa": 7.40,
            "percentage": 71.0,
            "active_backlogs": 1,
            "total_backlogs": 1,
            "skills": "Java, Spring Boot, MySQL",
            "internship_experience": "No",
            "internship_details": "",
            "resume_link": "",
            "placement_status": "Unplaced"
        }
    ],
    "companies": [
        {
            "name": "Tata Consultancy Services",
            "industry": "IT Services",
            "website": "https://www.tcs.com",
            "hr_name": "Rajesh Verma",
            "hr_email": "rajesh.v@tcs.com",
            "hr_phone": "+91 9988776655",
            "job_locations": "PAN India",
            "work_arrangement": "Hybrid",
            "status": "Active",
            "notes": "Mass recruitment drive"
        },
        {
            "name": "Microsoft India",
            "industry": "Software & Cloud",
            "website": "https://www.microsoft.com",
            "hr_name": "Pooja Reddy",
            "hr_email": "pooja.r@microsoft.com",
            "hr_phone": "+91 9123456789",
            "job_locations": "Bangalore, Hyderabad",
            "work_arrangement": "Hybrid",
            "status": "Active",
            "notes": "Product development role"
        }
    ],
    "rules": [
        {
            "name": "General Tech Tier-1 Minimum Cutoff",
            "rule_type": "Global",
            "min_cgpa": 7.5,
            "min_percentage": 70.0,
            "max_active_backlogs": 0,
            "allow_active_backlogs": "No",
            "max_total_backlogs": 1,
            "required_skills": "Data Structures, Algorithms",
            "internship_required": "No",
            "allowed_departments": "CSE, IT, ECE",
            "is_active": "Yes",
            "priority": 10
        }
    ],
    "offers": [
        {
            "student_roll_number": "21CS001",
            "company_name": "Microsoft India",
            "job_role": "Software Engineer",
            "ctc_lpa": 16.5,
            "fixed_salary_lpa": 14.0,
            "variable_salary_lpa": 2.5,
            "currency": "INR",
            "status": "Accepted",
            "offer_date": "2024-11-15",
            "joining_date": "2025-07-01",
            "remarks": "Direct campus selection"
        }
    ]
}


@router.get("/template/{entity_type}")
def download_template(entity_type: str, format: str = "csv"):
    if entity_type not in SAMPLE_TEMPLATES:
        raise HTTPException(status_code=400, detail=f"Invalid entity type '{entity_type}'")

    data = SAMPLE_TEMPLATES[entity_type]
    df = pd.DataFrame(data)

    if format.lower() == "excel" or format.lower() == "xlsx":
        buffer = io.BytesIO()
        with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name=entity_type.capitalize())
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=placementiq_{entity_type}_template.xlsx"}
        )
    else:
        csv_str = df.to_csv(index=False)
        return Response(
            content=csv_str,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=placementiq_{entity_type}_template.csv"}
        )


@router.post("/preview")
async def preview_import(
    file: UploadFile = File(...),
    entity_type: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    if entity_type not in ["students", "companies", "rules", "offers"]:
        raise HTTPException(status_code=400, detail="Invalid entity type for import")

    content = await file.read()
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="File must be CSV or Excel (.xlsx)")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    # Clean DataFrame
    df = df.fillna("")
    rows = df.to_dict(orient="records")

    preview_rows = []
    valid_count = 0
    error_count = 0
    duplicate_count = 0

    existing_rolls = {s[0] for s in db.query(Student.roll_number).filter(Student.is_deleted == False).all()}
    existing_emails = {s[0] for s in db.query(Student.email).filter(Student.is_deleted == False).all()}
    existing_companies = {c[0].lower() for c in db.query(Company.name).filter(Company.is_deleted == False).all()}

    for idx, r in enumerate(rows):
        errors = []
        is_dup = False

        if entity_type == "students":
            roll = str(r.get("roll_number", "")).strip()
            name = str(r.get("full_name", "")).strip()
            email = str(r.get("email", "")).strip()
            dept = str(r.get("department", "")).strip()

            if not roll:
                errors.append("Roll number is required")
            elif roll in existing_rolls:
                is_dup = True
                errors.append(f"Roll number '{roll}' already exists in database")

            if not name:
                errors.append("Full name is required")

            if not email:
                errors.append("Email is required")
            elif email in existing_emails:
                is_dup = True
                errors.append(f"Email '{email}' already registered in database")

            if not dept:
                errors.append("Department is required")

        elif entity_type == "companies":
            cname = str(r.get("name", "")).strip()
            if not cname:
                errors.append("Company name is required")
            elif cname.lower() in existing_companies:
                is_dup = True
                errors.append(f"Company '{cname}' already exists")

        elif entity_type == "offers":
            sroll = str(r.get("student_roll_number", "")).strip()
            cname = str(r.get("company_name", "")).strip()
            role = str(r.get("job_role", "")).strip()
            if not sroll:
                errors.append("Student roll number is required")
            elif sroll not in existing_rolls:
                errors.append(f"Student roll '{sroll}' not found")
            if not cname:
                errors.append("Company name is required")
            if not role:
                errors.append("Job role is required")

        status_flag = "VALID"
        if errors:
            status_flag = "ERROR" if not is_dup else "DUPLICATE"
            error_count += 1
            if is_dup:
                duplicate_count += 1
        else:
            valid_count += 1

        preview_rows.append({
            "row_index": idx + 1,
            "data": r,
            "status": status_flag,
            "errors": errors
        })

    return {
        "filename": file.filename,
        "total_rows": len(rows),
        "valid_count": valid_count,
        "error_count": error_count,
        "duplicate_count": duplicate_count,
        "columns": list(df.columns),
        "preview_rows": preview_rows
    }


@router.post("/commit")
def commit_import(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    entity_type = payload.get("entity_type")
    rows = payload.get("rows", [])
    filename = payload.get("filename", "uploaded_file")

    if not rows:
        raise HTTPException(status_code=400, detail="No rows provided to commit")

    success_count = 0
    error_list = []

    try:
        if entity_type == "students":
            for r in rows:
                row_data = r.get("data", r)
                skills_val = row_data.get("skills", "")
                skills_list = [s.strip() for s in str(skills_val).split(",") if s.strip()] if isinstance(skills_val, str) else list(skills_val)
                intern_val = str(row_data.get("internship_experience", "")).lower() in ["true", "yes", "1"]

                student = Student(
                    roll_number=str(row_data.get("roll_number", "")).strip(),
                    full_name=str(row_data.get("full_name", "")).strip(),
                    email=str(row_data.get("email", "")).strip(),
                    phone=str(row_data.get("phone", "")).strip() or None,
                    department=str(row_data.get("department", "CSE")).strip(),
                    degree=str(row_data.get("degree", "B.Tech")).strip(),
                    academic_year=str(row_data.get("academic_year", "2024-2025")).strip(),
                    graduation_year=int(row_data.get("graduation_year") or 2025),
                    cgpa=float(row_data.get("cgpa") or 0.0),
                    percentage=float(row_data.get("percentage") or 0.0),
                    active_backlogs=int(row_data.get("active_backlogs") or 0),
                    total_backlogs=int(row_data.get("total_backlogs") or 0),
                    skills=skills_list,
                    internship_experience=intern_val,
                    internship_details=str(row_data.get("internship_details", "")).strip() or None,
                    resume_link=str(row_data.get("resume_link", "")).strip() or None,
                    placement_status=str(row_data.get("placement_status", "Unplaced")).strip()
                )
                # Compute eligibility
                stat, reasons = evaluate_student_eligibility(db, student)
                student.placement_eligibility = stat
                student.eligibility_reasons = reasons
                db.add(student)
                success_count += 1

        elif entity_type == "companies":
            for r in rows:
                row_data = r.get("data", r)
                comp = Company(
                    name=str(row_data.get("name", "")).strip(),
                    industry=str(row_data.get("industry", "IT")).strip(),
                    website=str(row_data.get("website", "")).strip() or None,
                    hr_name=str(row_data.get("hr_name", "")).strip() or None,
                    hr_email=str(row_data.get("hr_email", "")).strip() or None,
                    hr_phone=str(row_data.get("hr_phone", "")).strip() or None,
                    job_locations=str(row_data.get("job_locations", "PAN India")).strip(),
                    work_arrangement=str(row_data.get("work_arrangement", "Onsite")).strip(),
                    status=str(row_data.get("status", "Active")).strip(),
                    notes=str(row_data.get("notes", "")).strip() or None
                )
                db.add(comp)
                success_count += 1

        db.commit()

        # Log import history
        hist = ImportHistory(
            user_id=current_user.id,
            username=current_user.username,
            entity_type=entity_type,
            filename=filename,
            total_rows=len(rows),
            success_rows=success_count,
            error_rows=len(error_list),
            status="Completed" if not error_list else "Partial",
            error_details=json.dumps(error_list) if error_list else None
        )
        db.add(hist)
        db.commit()

        log_audit_event(
            db, current_user, "IMPORT", entity_type.capitalize(), filename,
            {"success_count": success_count, "total_rows": len(rows)}
        )

        return {
            "message": f"Successfully imported {success_count} records into {entity_type}",
            "success_count": success_count,
            "error_count": len(error_list)
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database commit error: {str(e)}")


@router.get("/export/{entity_type}")
def export_data(
    entity_type: str,
    format: str = "csv",
    department: Optional[str] = None,
    placement_status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if entity_type == "students":
        q = db.query(Student).filter(Student.is_deleted == False)
        if department and department != "All":
            q = q.filter(Student.department == department)
        if placement_status and placement_status != "All":
            q = q.filter(Student.placement_status == placement_status)
        data = [{
            "Roll Number": s.roll_number,
            "Full Name": s.full_name,
            "Email": s.email,
            "Phone": s.phone,
            "Department": s.department,
            "Degree": s.degree,
            "Academic Year": s.academic_year,
            "Graduation Year": s.graduation_year,
            "CGPA": s.cgpa,
            "Percentage": s.percentage,
            "Active Backlogs": s.active_backlogs,
            "Total Backlogs": s.total_backlogs,
            "Eligibility": s.placement_eligibility,
            "Placement Status": s.placement_status,
            "Company": s.selected_company_name,
            "Job Role": s.job_role,
            "Package (LPA)": s.offered_package_lpa,
            "Skills": ", ".join(s.skills) if s.skills else ""
        } for s in q.all()]

    elif entity_type == "companies":
        q = db.query(Company).filter(Company.is_deleted == False)
        data = [{
            "Company Name": c.name,
            "Industry": c.industry,
            "Website": c.website,
            "HR Name": c.hr_name,
            "HR Email": c.hr_email,
            "HR Phone": c.hr_phone,
            "Locations": c.job_locations,
            "Work Arrangement": c.work_arrangement,
            "Status": c.status
        } for c in q.all()]

    elif entity_type == "offers":
        q = db.query(Offer).filter(Offer.is_deleted == False)
        data = [{
            "Student Name": o.student.full_name if o.student else "",
            "Roll Number": o.student.roll_number if o.student else "",
            "Department": o.student.department if o.student else "",
            "Company": o.company.name if o.company else "",
            "Job Role": o.job_role,
            "CTC (LPA)": o.ctc_lpa,
            "Fixed LPA": o.fixed_salary_lpa,
            "Variable LPA": o.variable_salary_lpa,
            "Status": o.status,
            "Offer Date": str(o.offer_date) if o.offer_date else ""
        } for o in q.all()]
    else:
        raise HTTPException(status_code=400, detail="Invalid export entity")

    df = pd.DataFrame(data)

    if format.lower() in ["excel", "xlsx"]:
        buffer = io.BytesIO()
        with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name=entity_type.capitalize())
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=placementiq_{entity_type}_export.xlsx"}
        )
    else:
        csv_str = df.to_csv(index=False)
        return Response(
            content=csv_str,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=placementiq_{entity_type}_export.csv"}
        )


@router.get("/history")
def get_import_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ImportHistory).order_by(ImportHistory.created_at.desc()).limit(50).all()
