import httpx
import json
import time
import random

BASE_URL = "http://127.0.0.1:8000/api"

def main():
    print("=== PlacementIQ End-to-End Verification ===")
    client = httpx.Client(base_url=BASE_URL, timeout=15.0)

    # 1. Login
    login_res = client.post("/auth/login", json={"username": "admin", "password": "admin123"})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] Admin login successful")

    # 2. Check initial Dashboard Stats
    dash_res = client.get("/dashboard/stats", headers=headers)
    assert dash_res.status_code == 200
    kpis = dash_res.json()["kpis"]
    print(f"[PASS] Dashboard stats loaded: Total Registered={kpis['total_registered']}, Placed={kpis['total_placed']}, Offers={kpis['total_offers']}, Peak={kpis['highest_salary']} LPA")

    # 3. Dynamic Cutoff Preview Simulation
    preview_res = client.post("/rules/preview", headers=headers, json={
        "rule": {
            "name": "Super Elite Dream Cutoff",
            "min_cgpa": 8.8,
            "max_active_backlogs": 0,
            "allow_active_backlogs": False,
            "internship_required": True
        }
    })
    assert preview_res.status_code == 200
    prev_data = preview_res.json()
    print(f"[PASS] Dynamic Cutoff Preview: Eligible={prev_data['Eligible']}, Ineligible={prev_data['Not Eligible']} out of {prev_data['Total']} students")

    # 4. Student CRUD & Auto Recalculation with unique roll
    unique_suffix = f"{int(time.time()) % 100000}"
    student_payload = {
        "roll_number": f"21TEST{unique_suffix}",
        "full_name": f"Test Verification Student {unique_suffix}",
        "email": f"test.verif{unique_suffix}@college.edu",
        "department": "CSE",
        "degree": "B.Tech",
        "academic_year": "2024-2025",
        "graduation_year": 2025,
        "cgpa": 5.4,
        "active_backlogs": 2,
        "skills": ["Python"]
    }
    create_st = client.post("/students", headers=headers, json=student_payload)
    assert create_st.status_code == 200, f"Create student failed: {create_st.text}"
    st_data = create_st.json()
    st_id = st_data["id"]
    assert st_data["placement_eligibility"] == "Not Eligible", "Low CGPA should be Not Eligible"
    print(f"[PASS] Created student #{st_id} with CGPA 5.4: status is '{st_data['placement_eligibility']}' (Reasons: {st_data['eligibility_reasons']})")

    # Edit student to high CGPA 9.1 and 0 backlogs -> verify auto recalculation to Eligible!
    update_st = client.put(f"/students/{st_id}", headers=headers, json={
        "cgpa": 9.1,
        "active_backlogs": 0
    })
    assert update_st.status_code == 200
    updated_st_data = update_st.json()
    assert updated_st_data["placement_eligibility"] == "Eligible", f"Expected Eligible, got: {updated_st_data['placement_eligibility']}"
    print(f"[PASS] Updated student #{st_id} to CGPA 9.1 & 0 backlogs: status automatically recalculated to '{updated_st_data['placement_eligibility']}'")

    # 5. Record an Accepted Offer -> verify student placement status changes to Placed
    comp_res = client.get("/companies", headers=headers)
    company_id = comp_res.json()[0]["id"]
    company_name = comp_res.json()[0]["name"]

    offer_payload = {
        "student_id": st_id,
        "company_id": company_id,
        "job_role": "AI Research Trainee",
        "ctc_lpa": 25.0,
        "fixed_salary_lpa": 20.0,
        "variable_salary_lpa": 5.0,
        "currency": "INR",
        "status": "Accepted"
    }
    offer_res = client.post("/offers", headers=headers, json=offer_payload)
    assert offer_res.status_code == 200

    # Verify student now Placed
    st_check = client.get(f"/students/{st_id}", headers=headers)
    assert st_check.json()["student"]["placement_status"] == "Placed"
    assert st_check.json()["student"]["offered_package_lpa"] == 25.0
    print(f"[PASS] Offer accepted: Student #{st_id} automatically synced to Placed with INR 25.0 LPA at {company_name}")

    # 6. Check Audit Logs
    audit_res = client.get("/audit-logs", headers=headers)
    assert audit_res.status_code == 200
    logs = audit_res.json()["data"]
    assert len(logs) > 0
    print(f"[PASS] Audit logs verified: {len(logs)} audit trail entries found")

    # 7. Clean up test student
    del_res = client.delete(f"/students/{st_id}", headers=headers)
    assert del_res.status_code == 200
    print(f"[PASS] Test student #{st_id} cleaned up successfully")

    print("\nALL VERIFICATION CHECKS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    main()
