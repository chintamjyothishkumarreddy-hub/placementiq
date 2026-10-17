import json
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import SystemSetting, User
from app.schemas import SystemSettingOut, SystemSettingUpdate
from app.auth import get_current_user, require_roles
from app.audit import log_audit_event

router = APIRouter(prefix="/settings", tags=["System Settings & Analytics"])

DEFAULT_SETTINGS = [
    {
        "key": "academic_years_included",
        "value": '["2023-2024", "2024-2025", "2025-2026"]',
        "description": "Academic years included in analytical reports and filters",
        "category": "analytics"
    },
    {
        "key": "departments_displayed",
        "value": '["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil"]',
        "description": "Active college departments displayed in the system",
        "category": "general"
    },
    {
        "key": "currency_symbol",
        "value": "₹",
        "description": "Currency symbol used in salary displays",
        "category": "currency"
    },
    {
        "key": "salary_display_unit",
        "value": "LPA",
        "description": "Default unit for salary packages (LPA, USD, K, etc.)",
        "category": "currency"
    },
    {
        "key": "placement_rate_method",
        "value": "eligible_only",  # "eligible_only" or "total_registered"
        "description": "Calculation method for headline placement percentage",
        "category": "analytics"
    },
    {
        "key": "placement_offer_criteria",
        "value": '["Accepted"]',  # or ["Offered", "Accepted"]
        "description": "Offer statuses that count towards officially placed numbers",
        "category": "analytics"
    },
    {
        "key": "eligibility_rule_mode",
        "value": "global_priority",  # "global_priority" or "company_strict"
        "description": "Default evaluation mode when matching students to drives",
        "category": "rules"
    },
    {
        "key": "default_chart_type",
        "value": "bar",
        "description": "Preferred default chart representation",
        "category": "analytics"
    },
    {
        "key": "auto_recalculate_eligibility",
        "value": "true",
        "description": "Automatically trigger background recalculation on student changes",
        "category": "rules"
    }
]

@router.get("", response_model=List[SystemSettingOut])
def get_settings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    settings = db.query(SystemSetting).all()
    if not settings:
        # Initialize defaults
        for s in DEFAULT_SETTINGS:
            obj = SystemSetting(**s)
            db.add(obj)
        db.commit()
        settings = db.query(SystemSetting).all()
    return settings


@router.get("/as-dict")
def get_settings_as_dict(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    settings = db.query(SystemSetting).all()
    if not settings:
        for s in DEFAULT_SETTINGS:
            obj = SystemSetting(**s)
            db.add(obj)
        db.commit()
        settings = db.query(SystemSetting).all()

    res = {}
    for s in settings:
        try:
            res[s.key] = json.loads(s.value)
        except Exception:
            res[s.key] = s.value
    return res


@router.put("/{key}", response_model=SystemSettingOut)
def update_setting(
    key: str,
    setting_in: SystemSettingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    setting = db.query(SystemSetting).filter(SystemSetting.key == key).first()
    if not setting:
        setting = SystemSetting(key=key, value=setting_in.value, description=setting_in.description)
        db.add(setting)
    else:
        setting.value = setting_in.value
        if setting_in.description:
            setting.description = setting_in.description

    db.commit()
    db.refresh(setting)

    log_audit_event(
        db, current_user, "UPDATE", "SystemSetting", key,
        {"value": setting.value}
    )

    return setting


@router.post("/bulk-update")
def bulk_update_settings(
    settings_dict: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    for key, val in settings_dict.items():
        setting = db.query(SystemSetting).filter(SystemSetting.key == key).first()
        val_str = json.dumps(val) if isinstance(val, (dict, list, bool)) else str(val)
        if not setting:
            setting = SystemSetting(key=key, value=val_str)
            db.add(setting)
        else:
            setting.value = val_str

    db.commit()

    log_audit_event(
        db, current_user, "BULK_UPDATE", "SystemSetting", "ALL",
        settings_dict
    )

    return {"message": "Settings updated successfully"}
