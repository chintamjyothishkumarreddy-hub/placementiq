import json
from typing import Any, Optional
from sqlalchemy.orm import Session
from app.models import AuditLog, User

def log_audit_event(
    db: Session,
    user: Optional[User],
    action: str,
    entity_type: str,
    entity_id: Optional[str] = None,
    details: Optional[Any] = None,
    ip_address: Optional[str] = None
):
    try:
        username = user.username if user else "system"
        user_id = user.id if user else None
        
        details_str = None
        if details is not None:
            if isinstance(details, (dict, list)):
                details_str = json.dumps(details, default=str)
            else:
                details_str = str(details)
                
        log = AuditLog(
            user_id=user_id,
            username=username,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id) if entity_id is not None else None,
            details=details_str,
            ip_address=ip_address
        )
        db.add(log)
        db.commit()
    except Exception as e:
        print(f"Error logging audit event: {e}")
