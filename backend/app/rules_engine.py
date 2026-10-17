from typing import List, Tuple, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import Student, EligibilityRule, Company

def evaluate_student_against_rule(student: Student, rule: EligibilityRule) -> Tuple[str, List[str]]:
    """
    Evaluates a single student against a single eligibility rule.
    Returns: (status, reasons) where status in ["Eligible", "Not Eligible", "Needs Review"]
    """
    reasons = []
    failed = False
    needs_review = False

    # 1. Department Check
    if rule.allowed_departments and len(rule.allowed_departments) > 0:
        if student.department not in rule.allowed_departments:
            failed = True
            reasons.append(f"Department '{student.department}' is not in allowed departments ({', '.join(rule.allowed_departments)})")

    # 2. Degree Check
    if rule.allowed_degrees and len(rule.allowed_degrees) > 0:
        if student.degree not in rule.allowed_degrees:
            failed = True
            reasons.append(f"Degree '{student.degree}' is not in allowed degrees ({', '.join(rule.allowed_degrees)})")

    # 3. CGPA Check
    student_cgpa = float(student.cgpa or 0.0)
    rule_min_cgpa = float(rule.min_cgpa or 0.0)
    if student_cgpa < rule_min_cgpa:
        failed = True
        reasons.append(f"CGPA {student_cgpa:.2f} is below minimum cutoff {rule_min_cgpa:.2f}")

    # 4. Percentage Check (if applicable)
    if rule.min_percentage and rule.min_percentage > 0:
        student_pct = float(student.percentage or 0.0)
        rule_pct = float(rule.min_percentage)
        if student_pct > 0 and student_pct < rule_pct:
            failed = True
            reasons.append(f"Percentage {student_pct:.1f}% is below minimum cutoff {rule_pct:.1f}%")

    # 5. Active Backlogs Check
    active_backlogs = int(student.active_backlogs or 0)
    if not rule.allow_active_backlogs and active_backlogs > 0:
        failed = True
        reasons.append(f"Has {active_backlogs} active backlog(s), but active backlogs are not allowed")
    elif active_backlogs > int(rule.max_active_backlogs or 0):
        failed = True
        reasons.append(f"Active backlogs ({active_backlogs}) exceed maximum allowed ({rule.max_active_backlogs})")

    # 6. Total Backlogs Check
    total_backlogs = int(student.total_backlogs or 0)
    if rule.max_total_backlogs is not None and total_backlogs > int(rule.max_total_backlogs):
        failed = True
        reasons.append(f"Total backlogs ({total_backlogs}) exceed maximum allowed ({rule.max_total_backlogs})")

    # 7. Internship Check
    if rule.internship_required and not student.internship_experience:
        failed = True
        reasons.append("Prior internship experience is required")

    # 8. Required Skills Check
    if rule.required_skills and len(rule.required_skills) > 0:
        student_skills = [str(s).strip().lower() for s in (student.skills or [])]
        missing_skills = []
        for req in rule.required_skills:
            req_clean = str(req).strip().lower()
            if not any(req_clean in s for s in student_skills):
                missing_skills.append(req)
        if missing_skills:
            # If missing skills, mark as Needs Review or Not Eligible depending on rule
            needs_review = True
            reasons.append(f"Missing required skills: {', '.join(missing_skills)}")

    if failed:
        return "Not Eligible", reasons
    if needs_review:
        return "Needs Review", reasons
    return "Eligible", ["Meets all criteria for rule: " + (rule.name or "Unnamed Rule")]


def evaluate_student_eligibility(db: Session, student: Student, company_id: Optional[int] = None) -> Tuple[str, List[str]]:
    """
    Evaluates student eligibility across active rules.
    If company_id is provided, first checks company-specific rules.
    Otherwise checks global rules and department rules.
    """
    query = db.query(EligibilityRule).filter(EligibilityRule.is_active == True)
    
    if company_id:
        company_rules = query.filter(EligibilityRule.company_id == company_id).all()
        if company_rules:
            # Evaluate against company rules
            for rule in company_rules:
                status, reasons = evaluate_student_against_rule(student, rule)
                if status != "Eligible":
                    return status, reasons
            return "Eligible", ["Meets all company-specific requirements"]

    # Global and department rules
    rules = query.filter(
        (EligibilityRule.company_id == None) | (EligibilityRule.company_id == 0)
    ).order_by(EligibilityRule.priority.desc()).all()

    if not rules:
        # Default baseline if no rules configured: CGPA >= 6.0 and no active backlogs
        cgpa = float(student.cgpa or 0.0)
        backlogs = int(student.active_backlogs or 0)
        reasons = []
        if cgpa < 6.0:
            reasons.append(f"CGPA {cgpa:.2f} is below standard baseline cutoff 6.0")
        if backlogs > 0:
            reasons.append(f"Has {backlogs} active backlog(s)")
        if reasons:
            return "Not Eligible", reasons
        return "Eligible", ["Meets default baseline criteria"]

    for rule in rules:
        # If rule targets specific department and student is in different dept, skip
        if rule.department and rule.department != student.department:
            continue
        # If rule targets specific graduation year and student has different year, skip
        if rule.graduation_year and rule.graduation_year != student.graduation_year:
            continue

        status, reasons = evaluate_student_against_rule(student, rule)
        if status == "Not Eligible":
            return "Not Eligible", reasons
        if status == "Needs Review":
            return "Needs Review", reasons

    return "Eligible", ["Satisfies all active eligibility rules"]


def recalculate_all_students_eligibility(db: Session) -> Dict[str, int]:
    """
    Recalculates eligibility for all non-deleted students in the database.
    Updates student.placement_eligibility and student.eligibility_reasons.
    Returns summary counts.
    """
    students = db.query(Student).filter(Student.is_deleted == False).all()
    counts = {"Eligible": 0, "Not Eligible": 0, "Needs Review": 0, "Total": len(students)}

    for s in students:
        status, reasons = evaluate_student_eligibility(db, s)
        s.placement_eligibility = status
        s.eligibility_reasons = reasons
        counts[status] = counts.get(status, 0) + 1

    db.commit()
    return counts


def preview_rule_impact(db: Session, rule_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulates applying a rule (new or modified) across existing students
    without saving to database.
    Returns student counts and breakdown.
    """
    # Create a transient rule object in memory
    mock_rule = EligibilityRule(
        name=rule_data.get("name", "Preview Rule"),
        rule_type=rule_data.get("rule_type", "Global"),
        company_id=rule_data.get("company_id"),
        department=rule_data.get("department"),
        graduation_year=rule_data.get("graduation_year"),
        min_cgpa=float(rule_data.get("min_cgpa") or 6.0),
        min_percentage=float(rule_data.get("min_percentage") or 0.0),
        max_active_backlogs=int(rule_data.get("max_active_backlogs") or 0),
        allow_active_backlogs=bool(rule_data.get("allow_active_backlogs", False)),
        max_total_backlogs=int(rule_data.get("max_total_backlogs") or 5),
        required_skills=rule_data.get("required_skills", []),
        internship_required=bool(rule_data.get("internship_required", False)),
        allowed_departments=rule_data.get("allowed_departments", []),
        allowed_degrees=rule_data.get("allowed_degrees", ["B.Tech", "M.Tech", "MCA"]),
        is_active=True
    )

    students = db.query(Student).filter(Student.is_deleted == False).all()
    results = {"Eligible": 0, "Not Eligible": 0, "Needs Review": 0, "Total": len(students), "sample_affected": []}

    for s in students:
        status, reasons = evaluate_student_against_rule(s, mock_rule)
        results[status] = results.get(status, 0) + 1
        if status != "Eligible" and len(results["sample_affected"]) < 5:
            results["sample_affected"].append({
                "roll_number": s.roll_number,
                "name": s.full_name,
                "department": s.department,
                "cgpa": s.cgpa,
                "active_backlogs": s.active_backlogs,
                "reasons": reasons
            })

    return results
