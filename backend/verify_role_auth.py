import os
import sys
import json

# Ensure backend directory is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import app  # triggers compatibility loader in app/__init__.py
from fastapi.testclient import TestClient
from app.main import app as fastapi_app

client = TestClient(fastapi_app)

def request(method, path, body=None, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    if method == "GET":
        resp = client.get(path, headers=headers)
    elif method == "POST":
        resp = client.post(path, json=body, headers=headers)
    elif method == "PUT":
        resp = client.put(path, json=body, headers=headers)
    elif method == "DELETE":
        resp = client.delete(path, headers=headers)
    else:
        resp = client.request(method, path, json=body, headers=headers)
    
    try:
        data = resp.json()
    except Exception:
        data = resp.text
    return resp.status_code, data

def run_tests():
    print("=" * 60)
    print("PlacementIQ — Role-Based Authentication & Verification Suite")
    print("=" * 60)
    
    passed = 0
    total = 0

    def assert_test(condition, name, detail=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f" [PASS] Test {total}: {name}")
        else:
            print(f" [FAIL] Test {total}: {name} - {detail}")

    # 1. Inspect source files to ensure no default credentials in LoginPage
    login_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "pages", "LoginPage.jsx"))
    with open(login_path, "r", encoding="utf-8") as f:
        login_code = f.read()
    assert_test("useState('')" in login_code or 'useState("")' in login_code, "LoginPage state starts with empty strings")
    assert_test("Fast Demo Login" not in login_code, "Fast Demo Login section completely removed from LoginPage")
    assert_test("handleQuickLogin" not in login_code, "handleQuickLogin removed from LoginPage")

    # 2. Inspect Navbar to ensure demo role switch is removed
    navbar_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "components", "Navbar.jsx"))
    with open(navbar_path, "r", encoding="utf-8") as f:
        navbar_code = f.read()
    assert_test("handleRoleSelect" not in navbar_code, "Demo role selector removed from Navbar")
    assert_test("<select" not in navbar_code, "Role switch select dropdown removed from Navbar")

    # 3. Test Invalid Credentials
    status, res = request("POST", "/api/auth/login", {"username": "admin", "password": "wrongpassword"})
    assert_test(status == 401, "Invalid password rejected with 401 Unauthorized", str(res))

    status, res = request("POST", "/api/auth/login", {"username": "nonexistent_user", "password": "password123"})
    assert_test(status == 401, "Nonexistent user rejected with 401 Unauthorized", str(res))

    # 4. Test Valid Admin Login
    status, res = request("POST", "/api/auth/login", {"username": "admin", "password": "admin123"})
    assert_test(status == 200 and res.get("user", {}).get("role") == "admin", "Admin login successful with 'admin' role")
    admin_token = res.get("access_token")

    # 5. Test Admin Privileges (Full Access)
    status, users = request("GET", "/api/users", token=admin_token)
    assert_test(status == 200 and len(users) >= 3, "Admin can access /api/users")

    status, settings = request("GET", "/api/settings", token=admin_token)
    assert_test(status == 200, "Admin can access /api/settings")

    # 6. Test Valid Placement Officer Login
    status, res = request("POST", "/api/auth/login", {"username": "officer", "password": "officer123"})
    assert_test(status == 200 and res.get("user", {}).get("role") == "placement_officer", "Placement Officer login successful with 'placement_officer' role")
    officer_token = res.get("access_token")

    # 7. Test Placement Officer Restrictions & Permissions
    # Placement Officer blocked from /api/users (403 Forbidden)
    status, res = request("GET", "/api/users", token=officer_token)
    assert_test(status == 403, "Placement Officer blocked from /api/users (403 Forbidden)", str(res))

    # Placement Officer blocked from PUT /api/settings (403 Forbidden)
    status, res = request("PUT", "/api/settings/currency_symbol", {"value": "$"}, token=officer_token)
    assert_test(status == 403, "Placement Officer blocked from updating system settings (403 Forbidden)", str(res))

    # Placement Officer allowed on placement modules
    status, drives = request("GET", "/api/drives", token=officer_token)
    assert_test(status == 200, "Placement Officer allowed to access /api/drives")

    status, students = request("GET", "/api/students?limit=5", token=officer_token)
    assert_test(status == 200 and students.get("total", 0) > 0, "Placement Officer allowed to access /api/students")

    # 8. Test Valid Viewer Login
    status, res = request("POST", "/api/auth/login", {"username": "viewer", "password": "viewer123"})
    assert_test(status == 200 and res.get("user", {}).get("role") == "viewer", "Viewer login successful with 'viewer' role")
    viewer_token = res.get("access_token")

    # 9. Test Viewer Read-Only Permissions & Mutation Restrictions
    # Viewer allowed read access
    status, res = request("GET", "/api/dashboard/stats", token=viewer_token)
    assert_test(status == 200 and "kpis" in res, "Viewer allowed to read /api/dashboard/stats")

    status, res = request("GET", "/api/students?limit=5", token=viewer_token)
    assert_test(status == 200 and res.get("total", 0) > 0, "Viewer allowed to read /api/students")

    # Viewer forbidden from mutating students (POST /api/students -> 403)
    dummy_student = {
        "roll_number": "TEST999",
        "full_name": "Test Student",
        "email": "test999@college.edu",
        "department": "CSE",
        "degree": "B.Tech",
        "academic_year": "2024-2025",
        "graduation_year": 2025,
        "cgpa": 8.0,
        "percentage": 75.0,
        "active_backlogs": 0,
        "total_backlogs": 0
    }
    status, res = request("POST", "/api/students", dummy_student, token=viewer_token)
    assert_test(status == 403, "Viewer forbidden from creating student (403 Forbidden)", str(res))

    # Viewer forbidden from creating companies (POST /api/companies -> 403)
    status, res = request("POST", "/api/companies", {"name": "HackerCorp"}, token=viewer_token)
    assert_test(status == 403, "Viewer forbidden from creating company (403 Forbidden)", str(res))

    # Viewer forbidden from creating rules (POST /api/rules -> 403)
    status, res = request("POST", "/api/rules", {"name": "Rogue Rule"}, token=viewer_token)
    assert_test(status == 403, "Viewer forbidden from creating rules (403 Forbidden)", str(res))

    # Viewer forbidden from deleting student (DELETE /api/students/1 -> 403)
    status, res = request("DELETE", "/api/students/1", token=viewer_token)
    assert_test(status == 403, "Viewer forbidden from deleting student (403 Forbidden)", str(res))

    # 10. Test Unauthenticated Access
    status, res = request("GET", "/api/students")
    assert_test(status == 401, "Unauthenticated request to /api/students rejected with 401 Unauthorized")

    status, res = request("GET", "/api/users")
    assert_test(status == 401, "Unauthenticated request to /api/users rejected with 401 Unauthorized")

    # 11. Verify Database Data Integrity
    status, res = request("GET", "/api/students", token=admin_token)
    student_count = res.get("total", 0)
    assert_test(student_count >= 110, f"Database records fully preserved: {student_count} students present")

    print("=" * 60)
    print(f"Results: {passed} / {total} tests passed ({passed/total*100:.1f}%)")
    print("=" * 60)

    if passed == total:
        print("ALL VERIFICATION CHECKS PASSED PERFECTLY!")
        sys.exit(0)
    else:
        print("SOME CHECKS FAILED.")
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
