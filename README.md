# PlacementIQ — Student Placement Data Analysis and Management System

**PlacementIQ** is an enterprise-grade, responsive full-stack web application designed for comprehensive college campus recruitment management, real-time analytics, and dynamic cutoff calculations.

> **CRITICAL ARCHITECTURAL GUARANTEE**: Everything in PlacementIQ is **100% editable, configurable, and manageable through the web interface** without modifying source code or manually editing the database.

---

## 🌐 Live Web Deployment

The application is deployed and actively running on the public web with secure SSL / HTTPS:

- **Live Web Application**: [https://bar-closer-bond-pension.trycloudflare.com](https://bar-closer-bond-pension.trycloudflare.com)
- **Interactive REST API Documentation**: [https://bar-closer-bond-pension.trycloudflare.com/docs](https://bar-closer-bond-pension.trycloudflare.com/docs)
- **Local Unified Server**: [http://127.0.0.1:8000](http://127.0.0.1:8000)

*(Accessible globally across mobile devices, tablets, and desktop browsers with no local installation required).*

---

## 🌟 Key Capabilities & Modules

### 1. Fully Editable Admin Panel
- Real CRUD operations across every single entity in the application.
- All modifications immediately persist in the SQLite database and trigger real-time updates across the dashboard and analytics.
- Zero hardcoded student records, companies, salary packages, or cutoffs.

### 2. Student Management
- Comprehensive profile tracking: Roll number, Full Name, Email, Phone, Department (CSE, IT, ECE, EEE, Mechanical, Civil), Degree, Academic Year, Graduation Year, Semester Marks, CGPA, Academic Percentage, Active and Total Backlogs, Technical & Soft Skills, Certifications, Projects, Internship details, and Resume links.
- **Dynamic Auto-Recalculation**: Changing a student's CGPA, backlog count, or department immediately re-evaluates their eligibility across all configured rules.
- Detailed modal profile with tabbed history (Academics, Skills & Custom Fields, Applications, Offers).
- Bulk editing of selected students and soft deletion with confirmation dialogs.
- Duplicate roll number and email prevention.

### 3. Dynamic Eligibility Rules & Cutoff Management
- Complete control over:
  - Overall minimum CGPA cutoff
  - Company-specific minimum CGPA cutoff
  - Department-specific cutoff
  - Graduation-year-specific rules
  - Maximum allowed backlogs & active backlogs permitted toggle
  - Required skills and mandatory internship requirements
  - Degree and branch eligibility
- **Live Impact Preview**: Test hypothetical cutoff changes against the current student cohort to see exact counts of Eligible, Ineligible, and Needs Review students before saving changes!
- Real-time recalculation of all student records across the database upon rule mutation.

### 4. Company & Job Role Management
- Full company profiles: Name, Industry, Website, Recruiter Contact (Name, Email, Phone), Work Arrangement (Onsite/Hybrid/Remote), and Status.
- **Multi-Role Support**: Define multiple positions per company, each with distinct CTC brackets, CGPA cutoffs, vacancies, and department criteria.
- Protects historical offer records when company settings change.

### 5. Placement Drive & Pipeline Management
- Schedule placement drives with registration deadlines, vacancies, and eligible branches.
- **Configurable Recruitment Stages**: Define custom pipeline stages (e.g. *Applied → Aptitude Test → Technical Interview → HR Interview → Selected → Offer Accepted*).
- Add, rename, reorder, and remove stages.
- Track candidate status stage-by-stage and record interviewer scores and feedback.

### 6. Salary & Offer Management
- Multi-offer tracking: Record multiple offers per candidate.
- Detailed salary breakdown: Total Offered CTC (LPA), Fixed component, and Variable component.
- Clear separation between **Unique Placed Students** and **Total Offers Extended**.
- Automatically updates student placement status, company, and package upon offer acceptance.

### 7. Dynamic Real-Time Dashboard
- 12 real-time KPIs: Registered Students, Eligible Students, Placed Students, Unplaced Eligible, Placement Rate (Eligible), Placement Rate (Total), Highest CTC, Average CTC, Median CTC, Total Offers, Participating Companies, Active Drives.
- 6 Interactive Recharts visualizations:
  1. Department Performance (Total vs Eligible vs Placed)
  2. Salary Package Distribution (Histogram)
  3. Top Hiring Companies & Average Package
  4. CGPA Range vs Placement Rate
  5. Eligibility Compliance (Donut Chart)
  6. Batch Placement Trends (Area Chart)
- Instant multi-factor filtering: Department, Academic Year, Graduation Year, and Company.

### 8. Analytics & System Settings
- Configurable calculation rules: Choose between *Placed/Eligible* vs *Placed/Total Registered*.
- Configurable offer criteria (Accepted only vs Extended offers).
- Configurable currency symbols and units (LPA, USD, K).
- All preferences persisted in the database.

### 9. Bulk Import, Export & Pre-Commit Validation
- Download pre-formatted CSV and Excel (`.xlsx`) templates for Students, Companies, Rules, and Offers.
- Intelligent pre-commit validation engine: Highlights duplicate roll numbers, invalid emails, and schema mismatches with row-level error reporting.
- Transactional commit: Only verified valid records are saved to the database.
- Export filtered student, company, and offer records to CSV and Excel.
- Full audit log of past batch import jobs.

### 10. Role-Based Access Control (RBAC) & Audit Logs
- Three security tiers with server-side authorization:
  - **Admin**: Full access to all modules, system settings, and user management.
  - **Placement Officer**: Manage students, companies, drives, applications, and offers.
  - **Viewer**: Read-only access to dashboards, reports, and student directories.
- Immutable Audit Trail: Every creation, edit, deletion, and bulk update records the actor, timestamp, entity ID, and JSON before/after state diff.

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide React, Recharts, Axios.
- **Backend**: Python 3.13, FastAPI, Pydantic v2, Uvicorn, Passlib / Bcrypt, PyJWT.
- **Database**: SQLite with SQLAlchemy ORM.
- **Data Analysis**: Pandas & NumPy.
- **Spreadsheet Processing**: OpenPyXL & Pandas.

---

## 🚀 Quick Start Guide

### Default User Credentials

| Role | Username | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Full access + User management + Settings |
| **Placement Officer** | `officer` | `officer123` | Data management + Drives + Offers |
| **Viewer** | `viewer` | `viewer123` | Read-only dashboards and reports |

*(A 1-click quick-login role switcher is available directly on the login screen and navbar for fast evaluation).*

---

### Installation & Running

#### 1. Backend Setup
```bash
cd c:\google\backend

# Install dependencies
python -m pip install -r requirements.txt

# Seed the database with 110 fictional students & companies
python -m app.seed_data

# Start the FastAPI server (runs on http://127.0.0.1:8000)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Setup
```bash
cd c:\google\frontend

# Install node dependencies
npm install

# Start the Vite development server (runs on http://127.0.0.1:5173)
npm run dev
```

Open `http://127.0.0.1:5173` in your browser.

---

### Running Automated Test Suite

```bash
cd c:\google\backend

# Run pytest unit tests
python -m pytest app/tests

# Run live end-to-end database mutation & recalculation verification
python verify_system.py
```

---

## 📊 Sample Demonstration Data Notice

All student names, roll numbers, companies, packages, and recruiter contacts included in the initial seed are **fictional demonstration records** designed to simulate an authentic engineering institution. All data can be edited or deleted directly through the UI.
