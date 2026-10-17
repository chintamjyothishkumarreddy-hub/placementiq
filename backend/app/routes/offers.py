from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Offer, Student, Company, User
from app.schemas import OfferCreate, OfferUpdate, OfferOut
from app.auth import get_current_user, require_roles
from app.audit import log_audit_event

router = APIRouter(prefix="/offers", tags=["Offers & Salaries"])

@router.get("", response_model=List[OfferOut])
def get_offers(
    student_id: Optional[int] = None,
    company_id: Optional[int] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Offer).filter(Offer.is_deleted == False)

    if student_id:
        query = query.filter(Offer.student_id == student_id)

    if company_id:
        query = query.filter(Offer.company_id == company_id)

    if status and status != "All":
        query = query.filter(Offer.status == status)

    offers = query.order_by(Offer.offer_date.desc()).all()

    result = []
    for o in offers:
        if search:
            st_name = o.student.full_name if o.student else ""
            st_roll = o.student.roll_number if o.student else ""
            comp_name = o.company.name if o.company else ""
            p = search.lower()
            if p not in st_name.lower() and p not in st_roll.lower() and p not in comp_name.lower() and p not in o.job_role.lower():
                continue

        out = OfferOut.from_orm(o)
        out.student_name = o.student.full_name if o.student else "Unknown"
        out.student_roll = o.student.roll_number if o.student else "Unknown"
        out.student_department = o.student.department if o.student else "Unknown"
        out.company_name = o.company.name if o.company else "Unknown"
        result.append(out)

    return result


@router.post("", response_model=OfferOut)
def create_offer(
    offer_in: OfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    student = db.query(Student).filter(Student.id == offer_in.student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    company = db.query(Company).filter(Company.id == offer_in.company_id, Company.is_deleted == False).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    offer = Offer(**offer_in.dict())
    db.add(offer)

    # If offer is Accepted, reflect on student record
    if offer.status == "Accepted":
        student.placement_status = "Placed"
        student.selected_company_id = company.id
        student.selected_company_name = company.name
        student.job_role = offer.job_role
        student.offered_package_lpa = offer.ctc_lpa
        student.offer_acceptance_status = "Accepted"
        student.placement_date = offer.offer_date

    db.commit()
    db.refresh(offer)

    log_audit_event(
        db, current_user, "CREATE", "Offer", str(offer.id),
        {"student": student.full_name, "company": company.name, "ctc_lpa": offer.ctc_lpa, "status": offer.status}
    )

    out = OfferOut.from_orm(offer)
    out.student_name = student.full_name
    out.student_roll = student.roll_number
    out.student_department = student.department
    out.company_name = company.name
    return out


@router.put("/{offer_id}", response_model=OfferOut)
def update_offer(
    offer_id: int,
    offer_in: OfferUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    offer = db.query(Offer).filter(Offer.id == offer_id, Offer.is_deleted == False).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    update_data = offer_in.dict(exclude_unset=True)
    before_state = {k: getattr(offer, k) for k in update_data.keys()}

    for field, value in update_data.items():
        setattr(offer, field, value)

    # Sync student placement status
    student = db.query(Student).filter(Student.id == offer.student_id).first()
    if student:
        if offer.status == "Accepted":
            student.placement_status = "Placed"
            student.selected_company_id = offer.company_id
            student.selected_company_name = offer.company.name if offer.company else ""
            student.job_role = offer.job_role
            student.offered_package_lpa = offer.ctc_lpa
            student.offer_acceptance_status = "Accepted"
            student.placement_date = offer.offer_date
        elif offer.status in ["Rejected", "Revoked"]:
            # Check if student has other accepted offers
            other_accepted = db.query(Offer).filter(
                Offer.student_id == student.id,
                Offer.id != offer.id,
                Offer.status == "Accepted",
                Offer.is_deleted == False
            ).first()
            if other_accepted:
                student.placement_status = "Placed"
                student.selected_company_id = other_accepted.company_id
                student.selected_company_name = other_accepted.company.name if other_accepted.company else ""
                student.job_role = other_accepted.job_role
                student.offered_package_lpa = other_accepted.ctc_lpa
                student.offer_acceptance_status = "Accepted"
            else:
                student.placement_status = "In Process"
                student.selected_company_id = None
                student.selected_company_name = None
                student.job_role = None
                student.offered_package_lpa = None
                student.offer_acceptance_status = None

    db.commit()
    db.refresh(offer)

    log_audit_event(
        db, current_user, "UPDATE", "Offer", str(offer.id),
        {"before": before_state, "after": update_data}
    )

    out = OfferOut.from_orm(offer)
    out.student_name = offer.student.full_name if offer.student else "Unknown"
    out.student_roll = offer.student.roll_number if offer.student else "Unknown"
    out.student_department = offer.student.department if offer.student else "Unknown"
    out.company_name = offer.company.name if offer.company else "Unknown"
    return out


@router.delete("/{offer_id}")
def delete_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    offer = db.query(Offer).filter(Offer.id == offer_id, Offer.is_deleted == False).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    offer.is_deleted = True
    db.commit()

    log_audit_event(
        db, current_user, "DELETE", "Offer", str(offer_id),
        {"student_id": offer.student_id, "job_role": offer.job_role}
    )

    return {"message": "Offer deleted successfully"}
