import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def request(method, path, body=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            parsed = json.loads(content)
        except Exception:
            parsed = {"raw": content}
        return e.code, parsed

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
    with open(r"c:\google\frontend\src\pages\LoginPage.jsx", "r", encoding="utf-8") as f:
        login_code = f.read()
    assert_test("useState('')" in login_code or 'useState("")' in login_code, "LoginPage state starts with empty strings")
    assert_test("Fast Demo Login" not in login_code, "Fast Demo Login section completely removed from LoginPage")
    assert_test("handleQuickLogin" not in login_code, "handleQuickLogin removed from LoginPage")

    # 2. Inspect Navbar to ensure demo role switch is removed
    with open(r"c:\google\frontend\src\components\Navbar.jsx", "r", encoding="utf-8") as f:
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
    # GET /api/users
    status, users = request("GET", "/api/users", token=admin_token)
    assert_test(status == 200 and len(users) >= 3, "Admin can access /api/users")

    # GET /api/settings
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
