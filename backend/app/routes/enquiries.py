import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.database import get_db
from app.models import Enquiry, AuditLog, User
from app.schemas import EnquiryCreate, EnquiryUpdate, EnquiryOut, EnquiryStats
from app.auth import get_current_user, require_roles

router = APIRouter(prefix="/enquiries", tags=["Enquiries & Support"])


@router.post("", status_code=status.HTTP_201_CREATED)
def submit_enquiry(
    enquiry_in: EnquiryCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Public Endpoint: Anyone visiting the landing page can submit an institutional inquiry or support request.
    """
    new_enquiry = Enquiry(
        name=enquiry_in.name.strip(),
        email=enquiry_in.email.strip().lower(),
        phone=enquiry_in.phone.strip() if enquiry_in.phone else None,
        subject=enquiry_in.subject.strip() if enquiry_in.subject else "General Institutional Inquiry",
        category=enquiry_in.category if enquiry_in.category else "General",
        message=enquiry_in.message.strip(),
        status="Pending",
        priority="Medium"
    )
    db.add(new_enquiry)
    db.commit()
    db.refresh(new_enquiry)

    # Optional Audit log recording guest submission
    client_ip = request.client.host if (request and request.client) else "unknown"
    audit = AuditLog(
        username="Public Visitor",
        action="SUBMIT_ENQUIRY",
        entity_type="Enquiry",
        entity_id=str(new_enquiry.id),
        details=f"Inquiry submitted by {new_enquiry.name} ({new_enquiry.email}) - {new_enquiry.subject}",
        ip_address=client_ip
    )
    db.add(audit)
    db.commit()

    return {
        "id": new_enquiry.id,
        "reference_no": f"ENQ-{new_enquiry.id:04d}",
        "message": "Thank you! Your institutional inquiry has been received. Our placement team will review and respond shortly.",
        "enquiry": {
            "id": new_enquiry.id,
            "name": new_enquiry.name,
            "email": new_enquiry.email,
            "subject": new_enquiry.subject,
            "status": new_enquiry.status,
            "created_at": new_enquiry.created_at
        }
    }


@router.get("")
def list_enquiries(
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    """
    Protected Endpoint: Administrators and Placement Officers can view, filter, and inspect inquiries.
    """
    query = db.query(Enquiry)

    # Calculate global statistics before filters
    total_count = db.query(Enquiry).count()
    pending_count = db.query(Enquiry).filter(Enquiry.status == "Pending").count()
    in_progress_count = db.query(Enquiry).filter(Enquiry.status == "In Progress").count()
    resolved_count = db.query(Enquiry).filter(Enquiry.status == "Resolved").count()

    stats = {
        "total": total_count,
        "pending": pending_count,
        "in_progress": in_progress_count,
        "resolved": resolved_count
    }

    if status_filter and status_filter.lower() != "all":
        query = query.filter(Enquiry.status.ilike(status_filter))

    if category and category.lower() != "all":
        query = query.filter(Enquiry.category.ilike(category))

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Enquiry.name.ilike(term),
                Enquiry.email.ilike(term),
                Enquiry.subject.ilike(term),
                Enquiry.message.ilike(term),
                Enquiry.resolution_notes.ilike(term)
            )
        )

    enquiries = query.order_by(desc(Enquiry.created_at)).all()

    return {
        "enquiries": enquiries,
        "stats": stats
    }


@router.get("/{enquiry_id}", response_model=EnquiryOut)
def get_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return enquiry


@router.put("/{enquiry_id}", response_model=EnquiryOut)
def update_or_resolve_enquiry(
    enquiry_id: int,
    enquiry_update: EnquiryUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    """
    Protected Endpoint: Update status, priority, or solve the enquiry with institutional resolution notes.
    """
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    if enquiry_update.status:
        prev_status = enquiry.status
        enquiry.status = enquiry_update.status

        # If marking as Resolved
        if enquiry_update.status.lower() == "resolved" and prev_status.lower() != "resolved":
            enquiry.resolved_by = current_user.username
            enquiry.resolved_at = datetime.datetime.utcnow()

    if enquiry_update.priority:
        enquiry.priority = enquiry_update.priority

    if enquiry_update.resolution_notes is not None:
        enquiry.resolution_notes = enquiry_update.resolution_notes.strip()

    enquiry.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(enquiry)

    # Audit log
    action_type = "RESOLVE_ENQUIRY" if enquiry.status == "Resolved" else "UPDATE_ENQUIRY"
    client_ip = request.client.host if (request and request.client) else "unknown"
    audit = AuditLog(
        user_id=current_user.id,
        username=current_user.username,
        action=action_type,
        entity_type="Enquiry",
        entity_id=str(enquiry.id),
        details=f"Inquiry #{enquiry.id} updated by {current_user.username}. Status: {enquiry.status}, Notes: {enquiry.resolution_notes or 'None'}",
        ip_address=client_ip
    )
    db.add(audit)
    db.commit()

    return enquiry


@router.delete("/{enquiry_id}")
def delete_enquiry(
    enquiry_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    """
    Admin Only: Delete an inquiry record.
    """
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    client_ip = request.client.host if (request and request.client) else "unknown"
    audit = AuditLog(
        user_id=current_user.id,
        username=current_user.username,
        action="DELETE_ENQUIRY",
        entity_type="Enquiry",
        entity_id=str(enquiry_id),
        details=f"Inquiry #{enquiry_id} ({enquiry.name} - {enquiry.subject}) deleted by admin {current_user.username}",
        ip_address=client_ip
    )
    db.add(audit)

    db.delete(enquiry)
    db.commit()

    return {"message": f"Inquiry #{enquiry_id} successfully deleted"}
