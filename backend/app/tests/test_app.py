import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Student, EligibilityRule, Company, Offer

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert "PlacementIQ" in res.json()["name"]

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"

def test_login_success_and_failure():
    # Valid login
    res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

    # Invalid login
    bad = client.post("/api/auth/login", json={"username": "admin", "password": "wrongpassword"})
    assert bad.status_code == 401

def test_get_dashboard_stats():
    res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    dash = client.get("/api/dashboard/stats", headers=headers)
    assert dash.status_code == 200
    data = dash.json()
    assert "kpis" in data
    assert "charts" in data
    assert data["kpis"]["total_registered"] >= 100
    assert data["kpis"]["total_companies"] >= 5
    assert data["kpis"]["highest_salary"] > 0
    assert "department_stats" in data["charts"]

def test_rules_engine_preview_and_toggle():
    res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Preview impact of high cutoff: CGPA >= 9.0
    preview_res = client.post("/api/rules/preview", headers=headers, json={
        "rule": {
            "name": "Super Elite Cutoff",
            "min_cgpa": 9.0,
            "max_active_backlogs": 0,
            "allow_active_backlogs": False
        }
    })
    assert preview_res.status_code == 200
    pdata = preview_res.json()
    assert "Eligible" in pdata
    assert "Not Eligible" in pdata
    assert pdata["Total"] >= 100
    # CGPA >= 9.0 should have fewer eligible students than not eligible
    assert pdata["Eligible"] < pdata["Not Eligible"]

def test_student_duplicate_prevention():
    res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Attempt to create student with an existing roll number
    dup_res = client.post("/api/students", headers=headers, json={
        "roll_number": "21CS001",
        "full_name": "Duplicate Student",
        "email": "unique.email@college.edu",
        "department": "CSE",
        "degree": "B.Tech",
        "cgpa": 8.5
    })
    assert dup_res.status_code == 400
    assert "already exists" in dup_res.json()["detail"]

def test_import_templates():
    for entity in ["students", "companies", "rules", "offers"]:
        res = client.get(f"/api/import-export/template/{entity}?format=csv")
        assert res.status_code == 200
        assert len(res.text) > 20
