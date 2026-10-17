from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Company, JobRole, User
from app.schemas import (
    CompanyCreate, CompanyUpdate, CompanyOut,
    JobRoleBase, JobRoleCreate, JobRoleUpdate, JobRoleOut
)
from app.auth import get_current_user, require_roles
from app.audit import log_audit_event

router = APIRouter(prefix="/companies", tags=["Companies & Job Roles"])

@router.get("", response_model=List[CompanyOut])
def get_companies(
    status: Optional[str] = None,
    industry: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Company).filter(Company.is_deleted == False)

    if status and status != "All":
        query = query.filter(Company.status == status)

    if industry and industry != "All":
        query = query.filter(Company.industry == industry)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Company.name.ilike(pattern),
                Company.industry.ilike(pattern),
                Company.job_locations.ilike(pattern)
            )
        )

    companies = query.order_by(Company.name.asc()).all()
    return companies


@router.get("/{company_id}", response_model=CompanyOut)
def get_company(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = db.query(Company).filter(Company.id == company_id, Company.is_deleted == False).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.post("", response_model=CompanyOut)
def create_company(
    company_in: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    existing = db.query(Company).filter(Company.name == company_in.name, Company.is_deleted == False).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Company '{company_in.name}' already exists")

    company = Company(**company_in.dict())
    db.add(company)
    db.commit()
    db.refresh(company)

    log_audit_event(
        db, current_user, "CREATE", "Company", str(company.id),
        {"name": company.name, "industry": company.industry}
    )

    return company


@router.put("/{company_id}", response_model=CompanyOut)
def update_company(
    company_id: int,
    company_in: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    company = db.query(Company).filter(Company.id == company_id, Company.is_deleted == False).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    if company_in.name and company_in.name != company.name:
        existing = db.query(Company).filter(Company.name == company_in.name, Company.id != company_id, Company.is_deleted == False).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"Company name '{company_in.name}' is already taken")

    update_data = company_in.dict(exclude_unset=True)
    before_state = {k: getattr(company, k) for k in update_data.keys()}

    for field, value in update_data.items():
        setattr(company, field, value)

    db.commit()
    db.refresh(company)

    log_audit_event(
        db, current_user, "UPDATE", "Company", str(company.id),
        {"before": before_state, "after": update_data}
    )

    return company


@router.delete("/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    company = db.query(Company).filter(Company.id == company_id, Company.is_deleted == False).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    company.is_deleted = True
    db.commit()

    log_audit_event(
        db, current_user, "DELETE", "Company", str(company_id),
        {"name": company.name}
    )

    return {"message": "Company deleted successfully"}


# ---------------- Job Roles Endpoints ----------------
@router.post("/{company_id}/roles", response_model=JobRoleOut)
def add_job_role(
    company_id: int,
    role_in: JobRoleBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    company = db.query(Company).filter(Company.id == company_id, Company.is_deleted == False).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    role = JobRole(company_id=company_id, **role_in.dict())
    db.add(role)
    db.commit()
    db.refresh(role)

    log_audit_event(
        db, current_user, "CREATE", "JobRole", str(role.id),
        {"company": company.name, "role_title": role.role_title, "pkg": f"{role.min_package_lpa}-{role.max_package_lpa} LPA"}
    )

    return role


@router.put("/roles/{role_id}", response_model=JobRoleOut)
def update_job_role(
    role_id: int,
    role_in: JobRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Job role not found")

    update_data = role_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(role, field, value)

    db.commit()
    db.refresh(role)

    log_audit_event(
        db, current_user, "UPDATE", "JobRole", str(role.id),
        {"updates": update_data}
    )

    return role


@router.delete("/roles/{role_id}")
def delete_job_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Job role not found")

    role_title = role.role_title
    db.delete(role)
    db.commit()

    log_audit_event(
        db, current_user, "DELETE", "JobRole", str(role_id),
        {"role_title": role_title}
    )

    return {"message": "Job role deleted successfully"}
