from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AuditLog, User
from app.schemas import AuditLogOut
from app.auth import get_current_user, require_roles

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])

@router.get("", response_model=dict)
def get_audit_logs(
    entity_type: Optional[str] = None,
    action: Optional[str] = None,
    username: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    query = db.query(AuditLog)

    if entity_type and entity_type != "All":
        query = query.filter(AuditLog.entity_type == entity_type)

    if action and action != "All":
        query = query.filter(AuditLog.action == action)

    if username:
        query = query.filter(AuditLog.username.ilike(f"%{username}%"))

    total = query.count()
    logs = query.order_by(AuditLog.timestamp.desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
        "data": [AuditLogOut.from_orm(l) for l in logs]
    }
