import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# ----------------- Auth & Users -----------------
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    username: str
    password: str

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    role: str = "viewer"  # admin, placement_officer, viewer
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# ----------------- Students -----------------
class StudentBase(BaseModel):
    roll_number: str
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    department: str
    degree: str = "B.Tech"
    academic_year: str = "2024-2025"
    graduation_year: int = 2025
    semester_marks: Optional[Dict[str, float]] = None
    cgpa: float = 0.0
    percentage: float = 0.0
    active_backlogs: int = 0
    total_backlogs: int = 0
    backlog_history: Optional[str] = None
    skills: List[str] = []
    soft_skills: List[str] = []
    certifications: List[Any] = []
    projects: List[Any] = []
    internship_experience: bool = False
    internship_details: Optional[str] = None
    resume_link: Optional[str] = None
    placement_status: str = "Unplaced"  # Unplaced, Placed, In Process, Opted Out
    selected_company_id: Optional[int] = None
    selected_company_name: Optional[str] = None
    job_role: Optional[str] = None
    offered_package_lpa: Optional[float] = None
    offer_acceptance_status: Optional[str] = None
    placement_date: Optional[datetime.date] = None
    remarks: Optional[str] = None
    custom_fields: Optional[Dict[str, Any]] = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    roll_number: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    degree: Optional[str] = None
    academic_year: Optional[str] = None
    graduation_year: Optional[int] = None
    semester_marks: Optional[Dict[str, float]] = None
    cgpa: Optional[float] = None
    percentage: Optional[float] = None
    active_backlogs: Optional[int] = None
    total_backlogs: Optional[int] = None
    backlog_history: Optional[str] = None
    skills: Optional[List[str]] = None
    soft_skills: Optional[List[str]] = None
    certifications: Optional[List[Any]] = None
    projects: Optional[List[Any]] = None
    internship_experience: Optional[bool] = None
    internship_details: Optional[str] = None
    resume_link: Optional[str] = None
    placement_status: Optional[str] = None
    selected_company_id: Optional[int] = None
    selected_company_name: Optional[str] = None
    job_role: Optional[str] = None
    offered_package_lpa: Optional[float] = None
    offer_acceptance_status: Optional[str] = None
    placement_date: Optional[datetime.date] = None
    remarks: Optional[str] = None
    custom_fields: Optional[Dict[str, Any]] = None

class StudentOut(StudentBase):
    id: int
    placement_eligibility: str
    eligibility_reasons: List[str] = []
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class BulkUpdateStudentsRequest(BaseModel):
    student_ids: List[int]
    updates: Dict[str, Any]


# ----------------- Eligibility Rules -----------------
class EligibilityRuleBase(BaseModel):
    name: str
    rule_type: str = "Global"  # Global, Company, Department, GraduationYear
    company_id: Optional[int] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None
    min_cgpa: float = 6.0
    min_percentage: float = 60.0
    max_active_backlogs: int = 0
    allow_active_backlogs: bool = False
    max_total_backlogs: int = 2
    required_skills: List[str] = []
    internship_required: bool = False
    allowed_departments: List[str] = []
    allowed_degrees: List[str] = ["B.Tech", "M.Tech", "MCA"]
    is_active: bool = True
    priority: int = 1
    notes: Optional[str] = None

class EligibilityRuleCreate(EligibilityRuleBase):
    pass

class EligibilityRuleUpdate(BaseModel):
    name: Optional[str] = None
    rule_type: Optional[str] = None
    company_id: Optional[int] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None
    min_cgpa: Optional[float] = None
    min_percentage: Optional[float] = None
    max_active_backlogs: Optional[int] = None
    allow_active_backlogs: Optional[bool] = None
    max_total_backlogs: Optional[int] = None
    required_skills: Optional[List[str]] = None
    internship_required: Optional[bool] = None
    allowed_departments: Optional[List[str]] = None
    allowed_degrees: Optional[List[str]] = None
    is_active: Optional[bool] = None
    priority: Optional[int] = None
    notes: Optional[str] = None

class EligibilityRuleOut(EligibilityRuleBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class RulePreviewRequest(BaseModel):
    rule: Dict[str, Any]


# ----------------- Companies & Job Roles -----------------
class JobRoleBase(BaseModel):
    role_title: str
    job_description: Optional[str] = None
    min_package_lpa: float = 3.5
    max_package_lpa: float = 6.0
    currency: str = "INR"
    job_location: str = "PAN India"
    work_arrangement: str = "Onsite"
    vacancies: int = 5
    eligible_departments: List[str] = []
    min_cgpa: float = 6.5
    max_backlogs: int = 0
    required_skills: List[str] = []
    internship_required: bool = False
    graduation_years: List[int] = [2025]
    is_active: bool = True

class JobRoleCreate(JobRoleBase):
    company_id: int

class JobRoleUpdate(BaseModel):
    role_title: Optional[str] = None
    job_description: Optional[str] = None
    min_package_lpa: Optional[float] = None
    max_package_lpa: Optional[float] = None
    currency: Optional[str] = None
    job_location: Optional[str] = None
    work_arrangement: Optional[str] = None
    vacancies: Optional[int] = None
    eligible_departments: Optional[List[str]] = None
    min_cgpa: Optional[float] = None
    max_backlogs: Optional[int] = None
    required_skills: Optional[List[str]] = None
    internship_required: Optional[bool] = None
    graduation_years: Optional[List[int]] = None
    is_active: Optional[bool] = None

class JobRoleOut(JobRoleBase):
    id: int
    company_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    hr_name: Optional[str] = None
    hr_email: Optional[str] = None
    hr_phone: Optional[str] = None
    job_locations: Optional[str] = "PAN India"
    work_arrangement: Optional[str] = "Onsite"
    status: str = "Active"  # Active, Upcoming, Completed, Archived, Blacklisted
    notes: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    hr_name: Optional[str] = None
    hr_email: Optional[str] = None
    hr_phone: Optional[str] = None
    job_locations: Optional[str] = None
    work_arrangement: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class CompanyOut(CompanyBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    job_roles: List[JobRoleOut] = []

    class Config:
        from_attributes = True


# ----------------- Placement Drives & Stages -----------------
class RecruitmentStageBase(BaseModel):
    stage_name: str
    stage_order: int = 1
    is_mandatory: bool = True
    is_active: bool = True

class RecruitmentStageCreate(RecruitmentStageBase):
    drive_id: int

class RecruitmentStageUpdate(BaseModel):
    stage_name: Optional[str] = None
    stage_order: Optional[int] = None
    is_mandatory: Optional[bool] = None
    is_active: Optional[bool] = None

class RecruitmentStageOut(RecruitmentStageBase):
    id: int
    drive_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class DriveBase(BaseModel):
    title: str
    academic_year: str = "2024-2025"
    company_id: int
    drive_date: datetime.date
    application_deadline: Optional[datetime.date] = None
    status: str = "Registration Open"
    vacancies: int = 10
    eligible_departments: List[str] = []
    graduation_years: List[int] = [2025]
    min_cgpa: float = 6.5
    max_backlogs: int = 0
    notes: Optional[str] = None

class DriveCreate(DriveBase):
    pass

class DriveUpdate(BaseModel):
    title: Optional[str] = None
    academic_year: Optional[str] = None
    company_id: Optional[int] = None
    drive_date: Optional[datetime.date] = None
    application_deadline: Optional[datetime.date] = None
    status: Optional[str] = None
    vacancies: Optional[int] = None
    eligible_departments: Optional[List[str]] = None
    graduation_years: Optional[List[int]] = None
    min_cgpa: Optional[float] = None
    max_backlogs: Optional[int] = None
    notes: Optional[str] = None

class DriveOut(DriveBase):
    id: int
    company_name: Optional[str] = None
    stages: List[RecruitmentStageOut] = []
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True


# ----------------- Applications & Rounds -----------------
class InterviewRoundBase(BaseModel):
    round_name: str
    round_date: Optional[datetime.datetime] = None
    interviewer_name: Optional[str] = None
    status: str = "Scheduled"
    score: Optional[float] = None
    feedback: Optional[str] = None

class InterviewRoundCreate(InterviewRoundBase):
    application_id: int
    stage_id: Optional[int] = None

class InterviewRoundUpdate(BaseModel):
    round_name: Optional[str] = None
    round_date: Optional[datetime.datetime] = None
    interviewer_name: Optional[str] = None
    status: Optional[str] = None
    score: Optional[float] = None
    feedback: Optional[str] = None

class InterviewRoundOut(InterviewRoundBase):
    id: int
    application_id: int
    stage_id: Optional[int] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    student_id: int
    drive_id: int
    company_id: int
    job_role_id: Optional[int] = None
    current_stage_id: Optional[int] = None
    status: str = "Applied"
    remarks: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    current_stage_id: Optional[int] = None
    status: Optional[str] = None
    remarks: Optional[str] = None

class ApplicationOut(ApplicationBase):
    id: int
    applied_date: datetime.datetime
    student_name: Optional[str] = None
    student_roll: Optional[str] = None
    student_department: Optional[str] = None
    student_cgpa: Optional[float] = None
    company_name: Optional[str] = None
    drive_title: Optional[str] = None
    role_title: Optional[str] = None
    current_stage_name: Optional[str] = None
    rounds: List[InterviewRoundOut] = []
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# ----------------- Offers & Salaries -----------------
class OfferBase(BaseModel):
    student_id: int
    company_id: int
    job_role_id: Optional[int] = None
    drive_id: Optional[int] = None
    job_role: str
    ctc_lpa: float
    fixed_salary_lpa: float = 0.0
    variable_salary_lpa: float = 0.0
    currency: str = "INR"
    offer_date: datetime.date = Field(default_factory=datetime.date.today)
    joining_date: Optional[datetime.date] = None
    status: str = "Offered"  # Offered, Accepted, Rejected, Revoked
    offer_letter_link: Optional[str] = None
    remarks: Optional[str] = None

class OfferCreate(OfferBase):
    pass

class OfferUpdate(BaseModel):
    job_role: Optional[str] = None
    ctc_lpa: Optional[float] = None
    fixed_salary_lpa: Optional[float] = None
    variable_salary_lpa: Optional[float] = None
    currency: Optional[str] = None
    offer_date: Optional[datetime.date] = None
    joining_date: Optional[datetime.date] = None
    status: Optional[str] = None
    offer_letter_link: Optional[str] = None
    remarks: Optional[str] = None

class OfferOut(OfferBase):
    id: int
    student_name: Optional[str] = None
    student_roll: Optional[str] = None
    student_department: Optional[str] = None
    company_name: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True


# ----------------- Settings & Audit -----------------
class SystemSettingBase(BaseModel):
    key: str
    value: str
    description: Optional[str] = None
    category: str = "general"

class SystemSettingCreate(SystemSettingBase):
    pass

class SystemSettingUpdate(BaseModel):
    value: str
    description: Optional[str] = None

class SystemSettingOut(SystemSettingBase):
    id: int
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class AuditLogOut(BaseModel):
    id: int
    username: str
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    details: Optional[str] = None
    ip_address: Optional[str] = None
    timestamp: datetime.datetime

    class Config:
        from_attributes = True
