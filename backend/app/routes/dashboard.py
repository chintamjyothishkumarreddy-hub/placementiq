from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np

from app.database import get_db
from app.models import Student, Company, PlacementDrive, Offer, User
from app.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    academic_year: Optional[str] = None,
    department: Optional[str] = None,
    company_id: Optional[int] = None,
    graduation_year: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Base Query for Students
    student_query = db.query(Student).filter(Student.is_deleted == False)

    if academic_year and academic_year != "All":
        student_query = student_query.filter(Student.academic_year == academic_year)
    if department and department != "All":
        student_query = student_query.filter(Student.department == department)
    if graduation_year:
        student_query = student_query.filter(Student.graduation_year == graduation_year)
    if company_id:
        student_query = student_query.filter(Student.selected_company_id == company_id)

    students = student_query.all()
    total_registered = len(students)

    # 2. Offers query
    offer_query = db.query(Offer).filter(Offer.is_deleted == False)
    if company_id:
        offer_query = offer_query.filter(Offer.company_id == company_id)

    all_offers = offer_query.all()

    # Filter offers matching student scope if student filters are applied
    student_ids_set = {s.id for s in students}
    scope_offers = [o for o in all_offers if o.student_id in student_ids_set]

    # Calculate metrics
    eligible_students = [s for s in students if s.placement_eligibility == "Eligible"]
    total_eligible = len(eligible_students)

    placed_students = [s for s in students if s.placement_status == "Placed"]
    total_placed = len(placed_students)

    placed_eligible = [s for s in eligible_students if s.placement_status == "Placed"]
    unplaced_eligible = total_eligible - len(placed_eligible)

    placement_rate_eligible = round((len(placed_eligible) / total_eligible * 100), 1) if total_eligible > 0 else 0.0
    placement_rate_total = round((total_placed / total_registered * 100), 1) if total_registered > 0 else 0.0

    # Companies count
    total_companies = db.query(Company).filter(Company.is_deleted == False).count()
    active_drives = db.query(PlacementDrive).filter(
        PlacementDrive.is_deleted == False,
        PlacementDrive.status.in_(["Upcoming", "Registration Open", "In Progress"])
    ).count()

    # Salary Stats
    accepted_offers = [o for o in scope_offers if o.status == "Accepted"]
    salary_list = [float(o.ctc_lpa) for o in accepted_offers if o.ctc_lpa and o.ctc_lpa > 0]
    
    if not salary_list:
        # Fallback to offered packages from placed students if any
        salary_list = [float(s.offered_package_lpa) for s in placed_students if s.offered_package_lpa and s.offered_package_lpa > 0]

    if salary_list:
        np_salaries = np.array(salary_list)
        highest_salary = round(float(np.max(np_salaries)), 2)
        average_salary = round(float(np.mean(np_salaries)), 2)
        median_salary = round(float(np.median(np_salaries)), 2)
    else:
        highest_salary = 0.0
        average_salary = 0.0
        median_salary = 0.0

    total_offers = len(scope_offers)

    # 3. Department-wise Breakdown
    dept_map = {}
    for s in students:
        d = s.department
        if d not in dept_map:
            dept_map[d] = {"department": d, "total": 0, "eligible": 0, "placed": 0}
        dept_map[d]["total"] += 1
        if s.placement_eligibility == "Eligible":
            dept_map[d]["eligible"] += 1
        if s.placement_status == "Placed":
            dept_map[d]["placed"] += 1

    department_stats = []
    for d, data in sorted(dept_map.items()):
        rate = round((data["placed"] / data["eligible"] * 100), 1) if data["eligible"] > 0 else 0.0
        department_stats.append({
            "department": d,
            "total": data["total"],
            "eligible": data["eligible"],
            "placed": data["placed"],
            "placement_rate": rate
        })

    # 4. Salary Distribution Histogram
    salary_bins = [
        {"range": "< 4 LPA", "min": 0, "max": 4, "count": 0},
        {"range": "4 - 7 LPA", "min": 4, "max": 7, "count": 0},
        {"range": "7 - 12 LPA", "min": 7, "max": 12, "count": 0},
        {"range": "12 - 20 LPA", "min": 12, "max": 20, "count": 0},
        {"range": "20+ LPA", "min": 20, "max": 9999, "count": 0},
    ]
    for sal in salary_list:
        for b in salary_bins:
            if b["min"] <= sal < b["max"]:
                b["count"] += 1
                break

    # 5. Company-wise Selections Top 10
    comp_selections = {}
    for o in scope_offers:
        if o.status in ["Offered", "Accepted"]:
            cname = o.company.name if o.company else "Unknown"
            if cname not in comp_selections:
                comp_selections[cname] = {"company": cname, "selections": 0, "salaries": []}
            comp_selections[cname]["selections"] += 1
            if o.ctc_lpa:
                comp_selections[cname]["salaries"].append(o.ctc_lpa)

    company_stats = []
    for cname, cdata in sorted(comp_selections.items(), key=lambda x: x[1]["selections"], reverse=True)[:10]:
        avg_pkg = round(float(np.mean(cdata["salaries"])), 2) if cdata["salaries"] else 0.0
        company_stats.append({
            "company": cname,
            "selections": cdata["selections"],
            "avg_ctc": avg_pkg
        })

    # 6. CGPA Range vs Placement
    cgpa_ranges = [
        {"range": "< 6.0", "placed": 0, "unplaced": 0},
        {"range": "6.0 - 7.0", "placed": 0, "unplaced": 0},
        {"range": "7.0 - 8.0", "placed": 0, "unplaced": 0},
        {"range": "8.0 - 9.0", "placed": 0, "unplaced": 0},
        {"range": "9.0 - 10.0", "placed": 0, "unplaced": 0},
    ]
    for s in students:
        c = float(s.cgpa or 0.0)
        idx = 0
        if c >= 9.0:
            idx = 4
        elif c >= 8.0:
            idx = 3
        elif c >= 7.0:
            idx = 2
        elif c >= 6.0:
            idx = 1
        else:
            idx = 0

        if s.placement_status == "Placed":
            cgpa_ranges[idx]["placed"] += 1
        else:
            cgpa_ranges[idx]["unplaced"] += 1

    # 7. Eligibility Breakdown
    elig_counts = {"Eligible": 0, "Not Eligible": 0, "Needs Review": 0}
    for s in students:
        stat = s.placement_eligibility or "Eligible"
        elig_counts[stat] = elig_counts.get(stat, 0) + 1

    eligibility_breakdown = [
        {"status": "Eligible", "count": elig_counts.get("Eligible", 0), "color": "#10b981"},
        {"status": "Not Eligible", "count": elig_counts.get("Not Eligible", 0), "color": "#ef4444"},
        {"status": "Needs Review", "count": elig_counts.get("Needs Review", 0), "color": "#f59e0b"}
    ]

    # 8. Graduation Year Trends
    year_map = {}
    for s in students:
        yr = s.graduation_year or 2025
        if yr not in year_map:
            year_map[yr] = {"year": str(yr), "total": 0, "placed": 0, "salaries": []}
        year_map[yr]["total"] += 1
        if s.placement_status == "Placed":
            year_map[yr]["placed"] += 1
            if s.offered_package_lpa:
                year_map[yr]["salaries"].append(s.offered_package_lpa)

    year_trends = []
    for yr in sorted(year_map.keys()):
        data = year_map[yr]
        avg_sal = round(float(np.mean(data["salaries"])), 2) if data["salaries"] else 0.0
        year_trends.append({
            "year": data["year"],
            "total": data["total"],
            "placed": data["placed"],
            "avg_salary": avg_sal
        })

    # Available filter values
    all_depts = sorted(list({s.department for s in db.query(Student.department).filter(Student.is_deleted == False).distinct() if s.department}))
    all_years = sorted(list({s.academic_year for s in db.query(Student.academic_year).filter(Student.is_deleted == False).distinct() if s.academic_year}))
    all_grad_years = sorted(list({s.graduation_year for s in db.query(Student.graduation_year).filter(Student.is_deleted == False).distinct() if s.graduation_year}))
    all_companies = [{"id": c.id, "name": c.name} for c in db.query(Company.id, Company.name).filter(Company.is_deleted == False).order_by(Company.name).all()]

    return {
        "kpis": {
            "total_registered": total_registered,
            "total_eligible": total_eligible,
            "total_placed": total_placed,
            "unplaced_eligible": unplaced_eligible,
            "placement_rate_eligible": placement_rate_eligible,
            "placement_rate_total": placement_rate_total,
            "total_companies": total_companies,
            "active_drives": active_drives,
            "total_offers": total_offers,
            "highest_salary": highest_salary,
            "average_salary": average_salary,
            "median_salary": median_salary
        },
        "charts": {
            "department_stats": department_stats,
            "salary_distribution": salary_bins,
            "company_selections": company_stats,
            "cgpa_ranges": cgpa_ranges,
            "eligibility_breakdown": eligibility_breakdown,
            "year_trends": year_trends
        },
        "filter_options": {
            "departments": all_depts,
            "academic_years": all_years,
            "graduation_years": all_grad_years,
            "companies": all_companies
        }
    }
