# PlacementIQ — Comprehensive System Documentation & User Manual

**PlacementIQ: Student Placement Data Analysis & Management System**  
*Enterprise College Placement Operations, Dynamic Cutoff Intelligence & Real-Time Analytics*

---

## 1. System Overview & Purpose

PlacementIQ is a full-stack, enterprise-grade web application built to automate and streamline the campus placement ecosystem for colleges, universities, and technical institutions.

### Core Objectives:
1. **Dynamic Cutoff Engine**: Zero hardcoded eligibility rules. Administrators can define overall, company-specific, and department-specific CGPA thresholds, backlog tolerances, and skill requirements at any time. All student records are automatically recalculated in real time.
2. **Role-Based Workflows**: Separation of concerns between System Administrators, Placement Officers, and Institutional Viewers.
3. **Multi-Stage Recruitment Tracking**: Pipeline tracking from initial application through aptitude tests, technical rounds, HR interviews, offer letters, and salary acceptance.
4. **Institutional Analytics**: Real-time KPI cards, salary distribution histograms, branch-wise performance comparisons, and company hiring metrics.
5. **Data Import & Export**: Automated Excel (`.xlsx`) and CSV validation, bulk import with pre-commit integrity checks, and filtered analytical report exports.

---

## 2. Technology Stack & Architecture

```
┌────────────────────────────────────────────────────────┐
│             Client Layer (Browser / Mobile)            │
│  React 18 • Vite • Tailwind CSS • Recharts • Lucide    │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST JSON
┌───────────────────────────▼────────────────────────────┐
│              Application & API Server                  │
│       Python 3.13 • FastAPI • Uvicorn • Pydantic v2    │
│       JWT Auth (HS256) • Bcrypt Password Hashing       │
└───────────────────────────┬────────────────────────────┘
                            │ SQLAlchemy ORM
┌───────────────────────────▼────────────────────────────┐
│                    Data Persistence                    │
│      SQLite (placementiq.db) • SQLite WAL Mode         │
│      Foreign Key Constraints • Automated Seed Engine   │
└────────────────────────────────────────────────────────┘
```

* **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide React, Recharts.
* **Backend**: Python 3.13, FastAPI, Uvicorn, Pydantic v2, PyJWT, Bcrypt.
* **Database**: SQLite with SQLAlchemy ORM (compatible with PostgreSQL via `DATABASE_URL`).
* **Data Processing**: Pandas, NumPy, OpenPyXL.
* **Deployment**: Docker multi-stage container, Render Blueprint (`render.yaml`), Railway (`railway.json`).

---

## 3. Interactive API Documentation

FastAPI automatically generates interactive, OpenAPI-compliant documentation accessible directly in the browser:

| Interface | URL Path | Description |
| :--- | :--- | :--- |
| **Swagger UI** | `/docs` | Interactive API explorer. Allows executing requests, inspecting JSON payloads, testing bearer JWT tokens, and viewing response models. |
| **ReDoc** | `/redoc` | Clean, responsive technical reference documentation formatted for developers and integration partners. |
| **OpenAPI Schema** | `/openapi.json` | Raw OpenAPI 3.1 schema specification for generating SDKs or automated testing. |

---

## 4. Authentication & Security Specifications

### User Roles & Permissions Matrix

| Feature / Module | Administrator | Placement Officer | Institutional Viewer |
| :--- | :---: | :---: | :---: |
| **View Dashboard & KPIs** | Full Access | Full Access | Full Access (Read-Only) |
| **Student Profiles & Records** | View, Create, Edit, Delete, Bulk Update | View, Create, Edit, Bulk Update | View Only |
| **Company & Job Roles** | View, Create, Edit, Delete | View, Create, Edit | View Only |
| **Placement Drives & Stages** | View, Create, Edit, Delete | View, Create, Edit | View Only |
| **Eligibility Rules & Cutoffs** | View, Create, Edit, Delete, Toggle | View, Create, Edit, Toggle | View Only |
| **Offers & CTC Tracking** | View, Create, Edit, Delete | View, Create, Edit | View Only |
| **Bulk Import / Export** | Full Access | Full Access | Restricted |
| **System Settings** | Full Access | Restricted (403) | Restricted (403) |
| **User Account Management** | Full Access | Restricted (403) | Restricted (403) |
| **Audit Logs Inspection** | Full Access | View Only | Restricted (403) |

### Default System Accounts:
* **Admin**: `admin` / `admin123`
* **Placement Officer**: `officer` / `officer123`
* **Viewer**: `viewer` / `viewer123`

---

## 5. Student Documents & File Handling

In PlacementIQ, student documentation is managed directly through the student profile and verification workflow:

1. **Resumes & Portfolios**:
   - Each student profile contains a dedicated `resume_link` field.
   - Accepts cloud document links (Google Drive, Dropbox, LinkedIn, personal website, or campus storage).
   - Clickable directly from the **Student Management** table and **Full Profile Modal**.
2. **Certifications & Projects**:
   - Stored in the student profile under `certifications` and `projects`.
   - Included in profile previews, recruiter packets, and export reports.
3. **Internship Letters & Experience**:
   - Tracks whether internship experience is mandatory or verified (`internship_experience`: Yes/No).
   - Rich details stored in `internship_details` (company name, role, tenure).
4. **Offer Letters & Salary Packages**:
   - Managed in the **Offers & Salaries** module.
   - Records company name, job role, total CTC (LPA), fixed salary component, variable bonus, and acceptance status.

---

## 6. Data Import, Export & Template Documents

The application includes built-in spreadsheet documentation and import templates accessible under the **Data Import & Export** module:

### Downloadable Templates (`/api/import-export/template/{type}`):
1. **Students Template (`.csv` / `.xlsx`)**: Pre-configured with columns: `roll_number`, `full_name`, `email`, `phone`, `department`, `degree`, `academic_year`, `graduation_year`, `cgpa`, `percentage`, `active_backlogs`, `total_backlogs`, `skills`, `internship_experience`, `internship_details`, `resume_link`.
2. **Companies Template**: `name`, `industry`, `website`, `hr_name`, `hr_email`, `hr_phone`, `job_locations`, `work_arrangement`.
3. **Eligibility Rules Template**: `name`, `company_name`, `min_cgpa`, `max_backlogs`, `allow_active_backlogs`, `eligible_departments`, `requires_internship`.
4. **Offers Template**: `student_roll`, `company_name`, `job_role`, `ctc_lpa`, `fixed_salary_lpa`, `variable_salary_lpa`, `status`.

---

## 7. Operational Workflow Guide

### For Administrators:
1. Log in with `admin` / `admin123`.
2. **Configure Institutional Settings**: Open **System Settings** to set academic years, active departments, default salary units, and placement percentage calculation methods.
3. **Configure Cutoff Rules**: Open **Eligibility Rules & Cutoffs** to add dynamic criteria for visiting companies. Use the **Preview Impact** button to simulate how many students qualify before saving.
4. **Manage Staff Accounts**: Open **User Management** to create credentials for new Placement Officers and department Viewers.

### For Placement Officers:
1. Log in with `officer` / `officer123`.
2. **Schedule Drives**: Open **Placement Drives** to register visiting companies, registration deadlines, and hiring pipelines.
3. **Manage Pipeline**: Open **Applications & Interviews** to advance applicants through stages (*Aptitude → Technical Interview → HR Interview → Selected*).
4. **Record Offers**: Open **Offers & Salaries** to record job offers. When marked as `Accepted`, the student's status automatically updates to `Placed`.

### For Institutional Viewers:
1. Log in with `viewer` / `viewer123`.
2. Access executive KPIs on the **Dashboard**.
3. Inspect branch-wise placement percentages, salary distributions, and hiring partner metrics under **Placement Analytics**.
4. Generate print-ready institutional summaries under **Reports**.
