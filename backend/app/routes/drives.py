from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import PlacementDrive, RecruitmentStage, Company, Application, User
from app.schemas import (
    DriveCreate, DriveUpdate, DriveOut,
    RecruitmentStageBase, RecruitmentStageCreate, RecruitmentStageUpdate, RecruitmentStageOut
)
from app.auth import get_current_user, require_roles
from app.audit import log_audit_event

router = APIRouter(prefix="/drives", tags=["Placement Drives"])

DEFAULT_STAGES = [
    "Applied",
    "Aptitude Test",
    "Technical Interview",
    "HR Interview",
    "Selected",
    "Offer Accepted"
]

@router.get("", response_model=List[DriveOut])
def get_drives(
    status: Optional[str] = None,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(PlacementDrive).filter(PlacementDrive.is_deleted == False)

    if status and status != "All":
        query = query.filter(PlacementDrive.status == status)

    if academic_year and academic_year != "All":
        query = query.filter(PlacementDrive.academic_year == academic_year)

    drives = query.order_by(PlacementDrive.drive_date.desc()).all()
    
    result = []
    for d in drives:
        out = DriveOut.from_orm(d)
        out.company_name = d.company.name if d.company else "Unknown"
        result.append(out)

    return result


@router.get("/{drive_id}", response_model=DriveOut)
def get_drive(drive_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    drive = db.query(PlacementDrive).filter(PlacementDrive.id == drive_id, PlacementDrive.is_deleted == False).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Placement drive not found")
    
    out = DriveOut.from_orm(drive)
    out.company_name = drive.company.name if drive.company else "Unknown"
    return out


@router.post("", response_model=DriveOut)
def create_drive(
    drive_in: DriveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    company = db.query(Company).filter(Company.id == drive_in.company_id, Company.is_deleted == False).first()
    if not company:
        raise HTTPException(status_code=404, detail="Selected company does not exist")

    drive = PlacementDrive(**drive_in.dict())
    db.add(drive)
    db.commit()
    db.refresh(drive)

    # Initialize default recruitment stages
    for idx, stage_name in enumerate(DEFAULT_STAGES):
        stage = RecruitmentStage(
            drive_id=drive.id,
            stage_name=stage_name,
            stage_order=idx + 1,
            is_mandatory=True,
            is_active=True
        )
        db.add(stage)
    db.commit()
    db.refresh(drive)

    log_audit_event(
        db, current_user, "CREATE", "PlacementDrive", str(drive.id),
        {"title": drive.title, "company": company.name, "academic_year": drive.academic_year}
    )

    out = DriveOut.from_orm(drive)
    out.company_name = company.name
    return out


@router.put("/{drive_id}", response_model=DriveOut)
def update_drive(
    drive_id: int,
    drive_in: DriveUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    drive = db.query(PlacementDrive).filter(PlacementDrive.id == drive_id, PlacementDrive.is_deleted == False).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Placement drive not found")

    update_data = drive_in.dict(exclude_unset=True)
    before_state = {k: getattr(drive, k) for k in update_data.keys()}

    for field, value in update_data.items():
        setattr(drive, field, value)

    db.commit()
    db.refresh(drive)

    log_audit_event(
        db, current_user, "UPDATE", "PlacementDrive", str(drive.id),
        {"before": before_state, "after": update_data}
    )

    out = DriveOut.from_orm(drive)
    out.company_name = drive.company.name if drive.company else "Unknown"
    return out


@router.delete("/{drive_id}")
def delete_drive(
    drive_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    drive = db.query(PlacementDrive).filter(PlacementDrive.id == drive_id, PlacementDrive.is_deleted == False).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Placement drive not found")

    drive.is_deleted = True
    db.commit()

    log_audit_event(
        db, current_user, "DELETE", "PlacementDrive", str(drive_id),
        {"title": drive.title}
    )

    return {"message": "Drive deleted successfully"}


# ---------------- Stages Management ----------------
@router.post("/{drive_id}/stages", response_model=RecruitmentStageOut)
def add_stage(
    drive_id: int,
    stage_in: RecruitmentStageBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    drive = db.query(PlacementDrive).filter(PlacementDrive.id == drive_id, PlacementDrive.is_deleted == False).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Placement drive not found")

    # Get max current order
    max_order = len(drive.stages)
    stage = RecruitmentStage(
        drive_id=drive_id,
        stage_name=stage_in.stage_name,
        stage_order=stage_in.stage_order if stage_in.stage_order else max_order + 1,
        is_mandatory=stage_in.is_mandatory,
        is_active=stage_in.is_active
    )
    db.add(stage)
    db.commit()
    db.refresh(stage)

    log_audit_event(
        db, current_user, "CREATE", "RecruitmentStage", str(stage.id),
        {"drive_id": drive_id, "stage_name": stage.stage_name}
    )

    return stage


@router.put("/stages/{stage_id}", response_model=RecruitmentStageOut)
def update_stage(
    stage_id: int,
    stage_in: RecruitmentStageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    stage = db.query(RecruitmentStage).filter(RecruitmentStage.id == stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")

    update_data = stage_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(stage, field, value)

    db.commit()
    db.refresh(stage)

    log_audit_event(
        db, current_user, "UPDATE", "RecruitmentStage", str(stage.id),
        {"updates": update_data}
    )

    return stage


@router.delete("/stages/{stage_id}")
def delete_stage(
    stage_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    stage = db.query(RecruitmentStage).filter(RecruitmentStage.id == stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")

    stage_name = stage.stage_name
    db.delete(stage)
    db.commit()

    log_audit_event(
        db, current_user, "DELETE", "RecruitmentStage", str(stage_id),
        {"stage_name": stage_name}
    )

    return {"message": "Stage deleted successfully"}


@router.post("/{drive_id}/stages/reorder")
def reorder_stages(
    drive_id: int,
    stage_orders: List[Dict[str, int]],  # [{"stage_id": 1, "stage_order": 1}, ...]
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    for item in stage_orders:
        s_id = item.get("stage_id")
        s_order = item.get("stage_order")
        if s_id and s_order is not None:
            stage = db.query(RecruitmentStage).filter(RecruitmentStage.id == s_id, RecruitmentStage.drive_id == drive_id).first()
            if stage:
                stage.stage_order = s_order

    db.commit()

    log_audit_event(
        db, current_user, "UPDATE", "RecruitmentStage", f"Drive {drive_id}",
        {"reordered_stages": stage_orders}
    )

    return {"message": "Stages reordered successfully"}
