import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Date, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="viewer", nullable=False)  # admin, placement_officer, viewer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    audit_logs = relationship("AuditLog", back_populates="user")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    department = Column(String(100), index=True, nullable=False)  # CSE, IT, ECE, EEE, Mechanical, Civil
    degree = Column(String(100), default="B.Tech")
    academic_year = Column(String(50), default="2024-2025")
    graduation_year = Column(Integer, index=True, default=2025)
    
    # Academics
    semester_marks = Column(JSON, default=dict)  # {"sem1": 8.0, "sem2": 8.2, ...}
    cgpa = Column(Float, index=True, default=0.0)
    percentage = Column(Float, default=0.0)
    active_backlogs = Column(Integer, default=0)
    total_backlogs = Column(Integer, default=0)
    backlog_history = Column(Text, nullable=True)

    # Skills & Projects
    skills = Column(JSON, default=list)  # ["Python", "SQL", "React"]
    soft_skills = Column(JSON, default=list)
    certifications = Column(JSON, default=list)
    projects = Column(JSON, default=list)
    internship_experience = Column(Boolean, default=False)
    internship_details = Column(Text, nullable=True)
    resume_link = Column(String(500), nullable=True)

    # Placement Status & Calculated Eligibility
    placement_eligibility = Column(String(50), default="Eligible", index=True)  # Eligible, Not Eligible, Needs Review
    eligibility_reasons = Column(JSON, default=list)
    placement_status = Column(String(50), default="Unplaced", index=True)  # Unplaced, Placed, In Process, Opted Out
    
    # Selected Company Details
    selected_company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)
    selected_company_name = Column(String(255), nullable=True)
    job_role = Column(String(255), nullable=True)
    offered_package_lpa = Column(Float, nullable=True)
    offer_acceptance_status = Column(String(50), nullable=True)  # Pending, Accepted, Rejected
    placement_date = Column(Date, nullable=True)
    remarks = Column(Text, nullable=True)

    # Dynamic fields
    custom_fields = Column(JSON, default=dict)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    offers = relationship("Offer", back_populates="student", cascade="all, delete-orphan")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    industry = Column(String(100), index=True, nullable=True)
    website = Column(String(255), nullable=True)
    hr_name = Column(String(255), nullable=True)
    hr_email = Column(String(255), nullable=True)
    hr_phone = Column(String(50), nullable=True)
    job_locations = Column(String(255), default="PAN India")
    work_arrangement = Column(String(50), default="Onsite")  # Onsite, Hybrid, Remote
    status = Column(String(50), default="Active", index=True)  # Active, Upcoming, Completed, Archived, Blacklisted
    notes = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    job_roles = relationship("JobRole", back_populates="company", cascade="all, delete-orphan")
    drives = relationship("PlacementDrive", back_populates="company", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="company")
    offers = relationship("Offer", back_populates="company")
    rules = relationship("EligibilityRule", back_populates="company")


class JobRole(Base):
    __tablename__ = "job_roles"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    role_title = Column(String(255), nullable=False)
    job_description = Column(Text, nullable=True)
    min_package_lpa = Column(Float, default=3.5)
    max_package_lpa = Column(Float, default=6.0)
    currency = Column(String(10), default="INR")
    job_location = Column(String(255), default="PAN India")
    work_arrangement = Column(String(50), default="Onsite")
    vacancies = Column(Integer, default=5)
    eligible_departments = Column(JSON, default=list)  # ["CSE", "IT"]
    min_cgpa = Column(Float, default=6.5)
    max_backlogs = Column(Integer, default=0)
    required_skills = Column(JSON, default=list)
    internship_required = Column(Boolean, default=False)
    graduation_years = Column(JSON, default=lambda: [2025])
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="job_roles")
    applications = relationship("Application", back_populates="job_role")
    offers = relationship("Offer", back_populates="job_role_rel")


class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    rule_type = Column(String(50), default="Global")  # Global, Company, Department, GraduationYear
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=True)
    department = Column(String(100), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    min_cgpa = Column(Float, default=6.0)
    min_percentage = Column(Float, default=60.0)
    max_active_backlogs = Column(Integer, default=0)
    allow_active_backlogs = Column(Boolean, default=False)
    max_total_backlogs = Column(Integer, default=2)
    required_skills = Column(JSON, default=list)
    internship_required = Column(Boolean, default=False)
    allowed_departments = Column(JSON, default=list)  # Empty means all departments
    allowed_degrees = Column(JSON, default=lambda: ["B.Tech", "M.Tech", "MCA"])
    is_active = Column(Boolean, default=True)
    priority = Column(Integer, default=1)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="rules")


class PlacementDrive(Base):
    __tablename__ = "placement_drives"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    academic_year = Column(String(50), default="2024-2025")
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    drive_date = Column(Date, nullable=False)
    application_deadline = Column(Date, nullable=True)
    status = Column(String(50), default="Registration Open", index=True)  # Upcoming, Registration Open, In Progress, Completed, Cancelled
    vacancies = Column(Integer, default=10)
    eligible_departments = Column(JSON, default=list)
    graduation_years = Column(JSON, default=lambda: [2025])
    min_cgpa = Column(Float, default=6.5)
    max_backlogs = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="drives")
    stages = relationship("RecruitmentStage", back_populates="drive", cascade="all, delete-orphan", order_by="RecruitmentStage.stage_order")
    applications = relationship("Application", back_populates="drive", cascade="all, delete-orphan")


class RecruitmentStage(Base):
    __tablename__ = "recruitment_stages"

    id = Column(Integer, primary_key=True, index=True)
    drive_id = Column(Integer, ForeignKey("placement_drives.id", ondelete="CASCADE"), nullable=False, index=True)
    stage_name = Column(String(100), nullable=False)  # Applied, Aptitude Test, Technical Interview, HR Interview, Selected, Offer Accepted
    stage_order = Column(Integer, default=1)
    is_mandatory = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    drive = relationship("PlacementDrive", back_populates="stages")
    applications = relationship("Application", back_populates="current_stage")
    interview_rounds = relationship("InterviewRound", back_populates="stage")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    drive_id = Column(Integer, ForeignKey("placement_drives.id", ondelete="CASCADE"), nullable=False, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    job_role_id = Column(Integer, ForeignKey("job_roles.id", ondelete="SET NULL"), nullable=True)
    current_stage_id = Column(Integer, ForeignKey("recruitment_stages.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="Applied", index=True)  # Applied, Under Review, Shortlisted, In Interview, Selected, Rejected, Withdrawn
    applied_date = Column(DateTime, default=datetime.datetime.utcnow)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="applications")
    drive = relationship("PlacementDrive", back_populates="applications")
    company = relationship("Company", back_populates="applications")
    job_role = relationship("JobRole", back_populates="applications")
    current_stage = relationship("RecruitmentStage", back_populates="applications")
    rounds = relationship("InterviewRound", back_populates="application", cascade="all, delete-orphan")


class InterviewRound(Base):
    __tablename__ = "interview_rounds"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    stage_id = Column(Integer, ForeignKey("recruitment_stages.id", ondelete="SET NULL"), nullable=True)
    round_name = Column(String(100), nullable=False)
    round_date = Column(DateTime, nullable=True)
    interviewer_name = Column(String(255), nullable=True)
    status = Column(String(50), default="Scheduled")  # Scheduled, Cleared, Failed, Absent, On Hold
    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("Application", back_populates="rounds")
    stage = relationship("RecruitmentStage", back_populates="interview_rounds")


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    job_role_id = Column(Integer, ForeignKey("job_roles.id", ondelete="SET NULL"), nullable=True)
    drive_id = Column(Integer, ForeignKey("placement_drives.id", ondelete="SET NULL"), nullable=True)
    job_role = Column(String(255), nullable=False)
    ctc_lpa = Column(Float, nullable=False)
    fixed_salary_lpa = Column(Float, default=0.0)
    variable_salary_lpa = Column(Float, default=0.0)
    currency = Column(String(10), default="INR")
    offer_date = Column(Date, default=datetime.date.today)
    joining_date = Column(Date, nullable=True)
    status = Column(String(50), default="Offered", index=True)  # Offered, Accepted, Rejected, Revoked
    offer_letter_link = Column(String(500), nullable=True)
    remarks = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="offers")
    company = relationship("Company", back_populates="offers")
    job_role_rel = relationship("JobRole", back_populates="offers")


class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)  # JSON or text string
    description = Column(String(255), nullable=True)
    category = Column(String(50), default="general")  # analytics, general, currency, rules
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    username = Column(String(100), index=True, nullable=False)
    action = Column(String(50), nullable=False)  # CREATE, UPDATE, DELETE, IMPORT, BULK_UPDATE, RECALCULATE
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)  # JSON string of changes
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="audit_logs")


class ImportHistory(Base):
    __tablename__ = "import_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    username = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    filename = Column(String(255), nullable=False)
    total_rows = Column(Integer, default=0)
    success_rows = Column(Integer, default=0)
    error_rows = Column(Integer, default=0)
    status = Column(String(50), default="Completed")
    error_details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
