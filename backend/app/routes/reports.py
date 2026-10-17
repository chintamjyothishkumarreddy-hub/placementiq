from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np

from app.database import get_db
from app.models import Student, Company, PlacementDrive, Offer, User
from app.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports & Analytics"])

@router.get("/comprehensive-summary")
def get_comprehensive_summary(
    academic_year: Optional[str] = None,
    graduation_year: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Student).filter(Student.is_deleted == False)
    if academic_year and academic_year != "All":
        query = query.filter(Student.academic_year == academic_year)
    if graduation_year:
        query = query.filter(Student.graduation_year == graduation_year)

    students = query.all()
    if not students:
        return {"message": "No student records found"}

    df = pd.DataFrame([{
        "id": s.id,
        "roll": s.roll_number,
        "dept": s.department,
        "cgpa": float(s.cgpa or 0.0),
        "backlogs": int(s.active_backlogs or 0),
        "eligibility": s.placement_eligibility,
        "status": s.placement_status,
        "company": s.selected_company_name or "Unplaced",
        "salary": float(s.offered_package_lpa or 0.0)
    } for s in students])

    total = len(df)
    placed_df = df[df["status"] == "Placed"]
    placed_count = len(placed_df)
    eligible_df = df[df["eligibility"] == "Eligible"]
    eligible_count = len(eligible_df)

    # Department breakdown
    dept_summary = []
    for dept, group in df.groupby("dept"):
        dept_tot = len(group)
        dept_elig = len(group[group["eligibility"] == "Eligible"])
        dept_pl = len(group[group["status"] == "Placed"])
        salaries = group[group["status"] == "Placed"]["salary"]
        dept_summary.append({
            "department": dept,
            "total_students": dept_tot,
            "eligible_students": dept_elig,
            "placed_students": dept_pl,
            "overall_placement_rate": round(dept_pl / dept_tot * 100, 1) if dept_tot else 0,
            "eligible_placement_rate": round(dept_pl / dept_elig * 100, 1) if dept_elig else 0,
            "highest_ctc": round(float(salaries.max()), 2) if len(salaries) > 0 and salaries.max() > 0 else 0.0,
            "average_ctc": round(float(salaries.mean()), 2) if len(salaries) > 0 and salaries.mean() > 0 else 0.0,
            "median_ctc": round(float(salaries.median()), 2) if len(salaries) > 0 and salaries.median() > 0 else 0.0,
        })

    # Tier Breakdown: Tier 1 (>15 LPA), Tier 2 (8-15 LPA), Tier 3 (4-8 LPA), Mass (<4 LPA)
    tier_counts = {"Tier 1 (>15 LPA)": 0, "Tier 2 (8-15 LPA)": 0, "Tier 3 (4-8 LPA)": 0, "Tier 4 (<4 LPA)": 0}
    for sal in placed_df["salary"]:
        if sal >= 15.0:
            tier_counts["Tier 1 (>15 LPA)"] += 1
        elif sal >= 8.0:
            tier_counts["Tier 2 (8-15 LPA)"] += 1
        elif sal >= 4.0:
            tier_counts["Tier 3 (4-8 LPA)"] += 1
        elif sal > 0:
            tier_counts["Tier 4 (<4 LPA)"] += 1

    tier_breakdown = [{"tier": k, "count": v} for k, v in tier_counts.items()]

    # CGPA Impact
    cgpa_groups = [
        {"bracket": "9.0 - 10.0 CGPA", "min": 9.0, "max": 10.1},
        {"bracket": "8.0 - 8.99 CGPA", "min": 8.0, "max": 9.0},
        {"bracket": "7.0 - 7.99 CGPA", "min": 7.0, "max": 8.0},
        {"bracket": "6.0 - 6.99 CGPA", "min": 6.0, "max": 7.0},
        {"bracket": "< 6.0 CGPA", "min": 0.0, "max": 6.0},
    ]
    cgpa_impact = []
    for g in cgpa_groups:
        sub = df[(df["cgpa"] >= g["min"]) & (df["cgpa"] < g["max"])]
        sub_tot = len(sub)
        sub_pl = len(sub[sub["status"] == "Placed"])
        sub_sal = sub[sub["status"] == "Placed"]["salary"]
        cgpa_impact.append({
            "bracket": g["bracket"],
            "total_students": sub_tot,
            "placed_students": sub_pl,
            "placement_rate": round(sub_pl / sub_tot * 100, 1) if sub_tot else 0,
            "avg_ctc": round(float(sub_sal.mean()), 2) if len(sub_sal) > 0 and sub_sal.mean() > 0 else 0.0
        })

    # Backlog Impact
    backlog_impact = []
    for b_count in [0, 1, 2, 3]:
        sub = df[df["backlogs"] == b_count] if b_count < 3 else df[df["backlogs"] >= 3]
        label = f"{b_count} Active Backlog(s)" if b_count < 3 else "3+ Active Backlogs"
        sub_tot = len(sub)
        sub_pl = len(sub[sub["status"] == "Placed"])
        backlog_impact.append({
            "backlogs": label,
            "total_students": sub_tot,
            "placed_students": sub_pl,
            "placement_rate": round(sub_pl / sub_tot * 100, 1) if sub_tot else 0
        })

    return {
        "overview": {
            "total_students": total,
            "eligible_students": eligible_count,
            "placed_students": placed_count,
            "overall_rate": round(placed_count / total * 100, 1) if total else 0,
            "eligible_rate": round(placed_count / eligible_count * 100, 1) if eligible_count else 0,
            "avg_ctc": round(float(placed_df["salary"].mean()), 2) if placed_count else 0.0,
            "highest_ctc": round(float(placed_df["salary"].max()), 2) if placed_count else 0.0
        },
        "departments": dept_summary,
        "tiers": tier_breakdown,
        "cgpa_impact": cgpa_impact,
        "backlog_impact": backlog_impact
    }
