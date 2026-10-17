from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import EligibilityRule, User, Company
from app.schemas import (
    EligibilityRuleCreate, EligibilityRuleUpdate, EligibilityRuleOut, RulePreviewRequest
)
from app.auth import get_current_user, require_roles
from app.rules_engine import preview_rule_impact, recalculate_all_students_eligibility
from app.audit import log_audit_event

router = APIRouter(prefix="/rules", tags=["Eligibility Rules & Cutoffs"])

@router.get("", response_model=List[EligibilityRuleOut])
def get_rules(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rules = db.query(EligibilityRule).order_by(EligibilityRule.priority.desc(), EligibilityRule.id.asc()).all()
    return rules


@router.post("/preview")
def preview_rule(
    req: RulePreviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = preview_rule_impact(db, req.rule)
    return results


@router.post("", response_model=EligibilityRuleOut)
def create_rule(
    rule_in: EligibilityRuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    rule = EligibilityRule(**rule_in.dict())
    db.add(rule)
    db.commit()
    db.refresh(rule)

    # Automatically recalculate all students to reflect newly created rule
    recalc_summary = recalculate_all_students_eligibility(db)

    log_audit_event(
        db, current_user, "CREATE", "EligibilityRule", str(rule.id),
        {"name": rule.name, "min_cgpa": rule.min_cgpa, "recalc_summary": recalc_summary}
    )

    return rule


@router.put("/{rule_id}", response_model=EligibilityRuleOut)
def update_rule(
    rule_id: int,
    rule_in: EligibilityRuleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    rule = db.query(EligibilityRule).filter(EligibilityRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    update_data = rule_in.dict(exclude_unset=True)
    before_state = {k: getattr(rule, k) for k in update_data.keys()}

    for field, value in update_data.items():
        setattr(rule, field, value)

    db.commit()
    db.refresh(rule)

    # Recalculate all students automatically
    recalc_summary = recalculate_all_students_eligibility(db)

    log_audit_event(
        db, current_user, "UPDATE", "EligibilityRule", str(rule.id),
        {"before": before_state, "after": update_data, "recalc_summary": recalc_summary}
    )

    return rule


@router.post("/{rule_id}/toggle")
def toggle_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "placement_officer"]))
):
    rule = db.query(EligibilityRule).filter(EligibilityRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    rule.is_active = not rule.is_active
    db.commit()
    db.refresh(rule)

    recalc_summary = recalculate_all_students_eligibility(db)

    log_audit_event(
        db, current_user, "UPDATE", "EligibilityRule", str(rule.id),
        {"toggled_active": rule.is_active, "recalc_summary": recalc_summary}
    )

    return {"message": f"Rule '{rule.name}' is now {'Active' if rule.is_active else 'Disabled'}", "is_active": rule.is_active, "recalc_summary": recalc_summary}


@router.delete("/{rule_id}")
def delete_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    rule = db.query(EligibilityRule).filter(EligibilityRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    rule_name = rule.name
    db.delete(rule)
    db.commit()

    recalc_summary = recalculate_all_students_eligibility(db)

    log_audit_event(
        db, current_user, "DELETE", "EligibilityRule", str(rule_id),
        {"name": rule_name, "recalc_summary": recalc_summary}
    )

    return {"message": f"Rule '{rule_name}' deleted successfully", "recalc_summary": recalc_summary}
