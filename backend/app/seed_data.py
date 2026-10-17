import random
import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import (
    User, Student, Company, JobRole, PlacementDrive, RecruitmentStage,
    Application, InterviewRound, Offer, EligibilityRule, SystemSetting, AuditLog
)
from app.auth import get_password_hash
from app.rules_engine import evaluate_student_eligibility

# Department distribution
DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil"]

FIRST_NAMES = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Shaurya", "Dhruv", "Kabir", "Rohan", "Ananya", "Diya", "Isha", "Saanvi", "Aanya", "Aadhya",
    "Myra", "Sneha", "Pooja", "Meera", "Tanvi", "Riya", "Kavya", "Pranav", "Nikhil", "Rahul",
    "Varun", "Karthik", "Abhishek", "Manish", "Gautam", "Suresh", "Ramesh", "Deepak", "Vikram", "Neha",
    "Priya", "Anushka", "Shreya", "Aditi", "Simran", "Preeti", "Komal", "Shruti", "Divya", "Swati"
]

LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Reddy", "Rao", "Nair", "Iyer", "Gupta", "Singh", "Kumar",
    "Mishra", "Joshi", "Choudhury", "Bose", "Das", "Banerjee", "Deshmukh", "Kulkarni", "Patil", "Mehta",
    "Shah", "Agarwal", "Bhatia", "Malhotra", "Kapoor", "Chatterjee", "Pillai", "Menon", "Bhardwaj", "Pandey"
]

TECH_SKILLS_BY_DEPT = {
    "CSE": ["Python", "Java", "C++", "React", "Node.js", "SQL", "Docker", "AWS", "Machine Learning", "Git"],
    "IT": ["JavaScript", "Python", "SQL", "HTML/CSS", "React", "Cloud Computing", "REST APIs", "Cybersecurity", "MongoDB"],
    "ECE": ["Embedded C", "MATLAB", "Verilog", "VLSI", "Microcontrollers", "Python", "IoT", "PCB Design", "Digital Signal Processing"],
    "EEE": ["MATLAB", "Power Systems", "PLC/SCADA", "Circuit Design", "Simulink", "C Programming", "Electrical Machines", "IoT"],
    "Mechanical": ["AutoCAD", "SolidWorks", "ANSYS", "Thermodynamics", "CATIA", "Manufacturing", "Robotics", "Python"],
    "Civil": ["AutoCAD", "STAAD Pro", "Revit", "Structural Analysis", "Surveying", "Project Management", "GIS", "Concrete Technology"]
}

def seed_database():
    print("Dropping existing tables and recreating schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        print("1. Seeding Users (Admin, Placement Officer, Viewer)...")
        users = [
            User(
                username="admin",
                email="admin@placementiq.edu",
                hashed_password=get_password_hash("admin123"),
                full_name="Dr. Rajesh Raman (Admin)",
                role="admin",
                is_active=True
            ),
            User(
                username="officer",
                email="officer@placementiq.edu",
                hashed_password=get_password_hash("officer123"),
                full_name="Prof. Sunita Deshmukh (Placement Officer)",
                role="placement_officer",
                is_active=True
            ),
            User(
                username="viewer",
                email="viewer@placementiq.edu",
                hashed_password=get_password_hash("viewer123"),
                full_name="Guest Department Viewer",
                role="viewer",
                is_active=True
            )
        ]
        db.add_all(users)
        db.commit()

        print("2. Seeding Default System Settings...")
        settings = [
            SystemSetting(key="academic_years_included", value='["2023-2024", "2024-2025", "2025-2026"]', description="Academic years in reports", category="analytics"),
            SystemSetting(key="departments_displayed", value='["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil"]', description="Active departments", category="general"),
            SystemSetting(key="currency_symbol", value="₹", description="Default currency symbol", category="currency"),
            SystemSetting(key="salary_display_unit", value="LPA", description="Default salary unit", category="currency"),
            SystemSetting(key="placement_rate_method", value="eligible_only", description="Headline placement rate basis", category="analytics"),
            SystemSetting(key="placement_offer_criteria", value='["Accepted"]', description="Statuses counted as placed", category="analytics"),
            SystemSetting(key="eligibility_rule_mode", value="global_priority", description="Rule calculation mode", category="rules")
        ]
        db.add_all(settings)
        db.commit()

        print("3. Seeding Companies and Job Roles...")
        companies_data = [
            {
                "name": "Google India",
                "industry": "Internet & Cloud",
                "website": "https://careers.google.com",
                "hr_name": "Arun Swaminathan",
                "hr_email": "arun.s@google.com",
                "hr_phone": "+91 9845012345",
                "job_locations": "Bangalore, Hyderabad",
                "work_arrangement": "Hybrid",
                "status": "Active",
                "roles": [
                    {
                        "role_title": "Software Engineer (L3)",
                        "job_description": "Work on distributed storage, cloud services, and search infrastructure.",
                        "min_package_lpa": 32.0,
                        "max_package_lpa": 42.0,
                        "vacancies": 4,
                        "eligible_departments": ["CSE", "IT", "ECE"],
                        "min_cgpa": 8.5,
                        "max_backlogs": 0,
                        "required_skills": ["Data Structures", "Algorithms", "System Design"],
                        "internship_required": True
                    }
                ]
            },
            {
                "name": "Microsoft India",
                "industry": "Software & AI",
                "website": "https://careers.microsoft.com",
                "hr_name": "Pooja Reddy",
                "hr_email": "pooja.r@microsoft.com",
                "hr_phone": "+91 9876543201",
                "job_locations": "Hyderabad, Bangalore, Noida",
                "work_arrangement": "Hybrid",
                "status": "Active",
                "roles": [
                    {
                        "role_title": "Software Development Engineer",
                        "job_description": "Build scalable cloud infrastructure for Azure and enterprise productivity tools.",
                        "min_package_lpa": 24.0,
                        "max_package_lpa": 30.0,
                        "vacancies": 6,
                        "eligible_departments": ["CSE", "IT", "ECE"],
                        "min_cgpa": 8.0,
                        "max_backlogs": 0,
                        "required_skills": ["C++", "Java", "Cloud Computing"],
                        "internship_required": False
                    }
                ]
            },
            {
                "name": "Amazon",
                "industry": "E-Commerce & Cloud",
                "website": "https://amazon.jobs",
                "hr_name": "Karan Malhotra",
                "hr_email": "karan.m@amazon.com",
                "hr_phone": "+91 9811223344",
                "job_locations": "Bangalore, Chennai, Hyderabad",
                "work_arrangement": "Onsite",
                "status": "Active",
                "roles": [
                    {
                        "role_title": "SDE-1",
                        "job_description": "Deliver high performance software services with low latency customer interfaces.",
                        "min_package_lpa": 20.0,
                        "max_package_lpa": 26.0,
                        "vacancies": 8,
                        "eligible_departments": ["CSE", "IT", "ECE", "EEE"],
                        "min_cgpa": 7.8,
                        "max_backlogs": 0,
                        "required_skills": ["Java", "SQL", "Algorithms"],
                        "internship_required": False
                    }
                ]
            },
            {
                "name": "Tata Consultancy Services (TCS)",
                "industry": "IT Services & Consulting",
                "website": "https://www.tcs.com",
                "hr_name": "Siddharth Sen",
                "hr_email": "siddharth.sen@tcs.com",
                "hr_phone": "+91 9771122334",
                "job_locations": "PAN India",
                "work_arrangement": "Hybrid",
                "status": "Active",
                "roles": [
                    {
                        "role_title": "TCS Digital Cadre",
                        "job_description": "High value projects involving AI, IoT, Big Data, and Cloud solutions.",
                        "min_package_lpa": 7.0,
                        "max_package_lpa": 8.5,
                        "vacancies": 25,
                        "eligible_departments": ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil"],
                        "min_cgpa": 7.0,
                        "max_backlogs": 0,
                        "required_skills": ["Python", "Java", "SQL"],
                        "internship_required": False
                    },
                    {
                        "role_title": "TCS Ninja Cadre",
                        "job_description": "Foundational enterprise application development and operations.",
                        "min_package_lpa": 3.6,
                        "max_package_lpa": 4.0,
                        "vacancies": 40,
                        "eligible_departments": ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil"],
                        "min_cgpa": 6.0,
                        "max_backlogs": 1,
                        "required_skills": ["Basic Programming"],
                        "internship_required": False
                    }
                ]
            },
            {
                "name": "Infosys",
                "industry": "IT Services",
                "website": "https://www.infosys.com",
                "hr_name": "Meenakshi Sundaram",
                "hr_email": "m.sundaram@infosys.com",
                "hr_phone": "+91 9665544332",
                "job_locations": "Bangalore, Pune, Mysore",
                "work_arrangement": "Hybrid",
                "status": "Active",
                "roles": [
                    {
                        "role_title": "Specialist Programmer (SP)",
                        "job_description": "Advanced competitive programmer role tackling complex system engineering.",
                        "min_package_lpa": 9.5,
                        "max_package_lpa": 11.0,
                        "vacancies": 12,
                        "eligible_departments": ["CSE", "IT", "ECE"],
                        "min_cgpa": 7.5,
                        "max_backlogs": 0,
                        "required_skills": ["Competitive Coding", "Data Structures"],
                        "internship_required": False
                    },
                    {
                        "role_title": "Systems Engineer",
                        "job_description": "Design, develop, and maintain IT solutions for Fortune 500 clients.",
                        "min_package_lpa": 3.8,
                        "max_package_lpa": 4.2,
                        "vacancies": 35,
                        "eligible_departments": ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil"],
                        "min_cgpa": 6.0,
                        "max_backlogs": 1,
                        "required_skills": ["Programming Fundamentals"],
                        "internship_required": False
                    }
                ]
            },
            {
                "name": "Texas Instruments",
                "industry": "Semiconductors & Electronics",
                "website": "https://www.ti.com",
                "hr_name": "Girish Hegde",
                "hr_email": "girish.h@ti.com",
                "hr_phone": "+91 9554433221",
                "job_locations": "Bangalore",
                "work_arrangement": "Onsite",
                "status": "Active",
                "roles": [
                    {
                        "role_title": "Embedded Systems Engineer",
                        "job_description": "Firmware and analog microcontroller driver architecture.",
                        "min_package_lpa": 17.0,
                        "max_package_lpa": 22.0,
                        "vacancies": 5,
                        "eligible_departments": ["ECE", "EEE"],
                        "min_cgpa": 7.8,
                        "max_backlogs": 0,
                        "required_skills": ["Embedded C", "Microcontrollers", "VLSI"],
                        "internship_required": False
                    }
                ]
            },
            {
                "name": "L&T Technology Services",
                "industry": "Engineering R&D",
                "website": "https://www.ltts.com",
                "hr_name": "Ritu Saxena",
                "hr_email": "ritu.saxena@ltts.com",
                "hr_phone": "+91 9443322110",
                "job_locations": "Vadodara, Chennai, Bangalore",
                "work_arrangement": "Onsite",
                "status": "Active",
                "roles": [
                    {
                        "role_title": "Design & Automation Engineer",
                        "job_description": "CAD/CAM automation, plant engineering, and industrial robotics.",
                        "min_package_lpa": 6.0,
                        "max_package_lpa": 7.5,
                        "vacancies": 15,
                        "eligible_departments": ["Mechanical", "EEE", "Civil"],
                        "min_cgpa": 6.5,
                        "max_backlogs": 0,
                        "required_skills": ["AutoCAD", "SolidWorks", "ANSYS"],
                        "internship_required": False
                    }
                ]
            },
            {
                "name": "Deloitte USI",
                "industry": "Consulting & Technology",
                "website": "https://www2.deloitte.com",
                "hr_name": "Farhan Akhtar",
                "hr_email": "farhan.a@deloitte.com",
                "hr_phone": "+91 9332211009",
                "job_locations": "Hyderabad, Bangalore, Mumbai",
                "work_arrangement": "Hybrid",
                "status": "Active",
                "roles": [
                    {
                        "role_title": "Analyst - Technology Consulting",
                        "job_description": "Enterprise business transformation, CRM, and cloud analytics.",
                        "min_package_lpa": 7.5,
                        "max_package_lpa": 8.5,
                        "vacancies": 18,
                        "eligible_departments": ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil"],
                        "min_cgpa": 6.8,
                        "max_backlogs": 0,
                        "required_skills": ["SQL", "Analytics", "Communication"],
                        "internship_required": False
                    }
                ]
            },
            {
                "name": "Mahindra & Mahindra",
                "industry": "Automotive & Manufacturing",
                "website": "https://www.mahindra.com",
                "hr_name": "Venkatesh Prasad",
                "hr_email": "prasad.v@mahindra.com",
                "hr_phone": "+91 9221100998",
                "job_locations": "Pune, Chennai, Zaheerabad",
                "work_arrangement": "Onsite",
                "status": "Active",
                "roles": [
                    {
                        "role_title": "Graduate Engineer Trainee (GET)",
                        "job_description": "Vehicle dynamics, powertrain testing, and electric vehicle powertrain.",
                        "min_package_lpa": 6.5,
                        "max_package_lpa": 7.5,
                        "vacancies": 12,
                        "eligible_departments": ["Mechanical", "EEE"],
                        "min_cgpa": 6.5,
                        "max_backlogs": 0,
                        "required_skills": ["Automotive", "CATIA", "Manufacturing"],
                        "internship_required": False
                    }
                ]
            },
            {
                "name": "Larsen & Toubro (L&T Construction)",
                "industry": "Infrastructure & Construction",
                "website": "https://www.lntecc.com",
                "hr_name": "Kishore Kumar",
                "hr_email": "kishore.k@lntecc.com",
                "hr_phone": "+91 9110099887",
                "job_locations": "Project Sites PAN India",
                "work_arrangement": "Onsite",
                "status": "Active",
                "roles": [
                    {
                        "role_title": "Site Project Engineer",
                        "job_description": "Smart cities, metro rail viaducts, and heavy civil construction projects.",
                        "min_package_lpa": 6.2,
                        "max_package_lpa": 7.0,
                        "vacancies": 14,
                        "eligible_departments": ["Civil", "Mechanical", "EEE"],
                        "min_cgpa": 6.2,
                        "max_backlogs": 1,
                        "required_skills": ["STAAD Pro", "AutoCAD", "Surveying"],
                        "internship_required": False
                    }
                ]
            }
        ]

        created_companies = []
        for cdata in companies_data:
            roles = cdata.pop("roles")
            comp = Company(**cdata)
            db.add(comp)
            db.commit()
            db.refresh(comp)
            created_companies.append(comp)

            for rdata in roles:
                role = JobRole(company_id=comp.id, **rdata)
                db.add(role)
            db.commit()

        print("4. Seeding Eligibility Rules...")
        rules_data = [
            {
                "name": "Tier-1 Super Dream Cutoff (Overall Top Tier)",
                "rule_type": "Global",
                "min_cgpa": 8.0,
                "min_percentage": 75.0,
                "max_active_backlogs": 0,
                "allow_active_backlogs": False,
                "max_total_backlogs": 1,
                "required_skills": [],
                "internship_required": False,
                "allowed_departments": ["CSE", "IT", "ECE"],
                "is_active": True,
                "priority": 100,
                "notes": "Applies to high-tier dream offers"
            },
            {
                "name": "General Placement Baseline Cutoff",
                "rule_type": "Global",
                "min_cgpa": 6.0,
                "min_percentage": 60.0,
                "max_active_backlogs": 0,
                "allow_active_backlogs": False,
                "max_total_backlogs": 3,
                "required_skills": [],
                "internship_required": False,
                "allowed_departments": ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil"],
                "is_active": True,
                "priority": 50,
                "notes": "Standard college campus placement qualification criteria"
            },
            {
                "name": "Core Engineering Backlog Tolerance Rule",
                "rule_type": "Department",
                "department": "Mechanical",
                "min_cgpa": 6.0,
                "min_percentage": 58.0,
                "max_active_backlogs": 1,
                "allow_active_backlogs": True,
                "max_total_backlogs": 4,
                "required_skills": [],
                "internship_required": False,
                "allowed_departments": ["Mechanical", "Civil"],
                "is_active": True,
                "priority": 25,
                "notes": "Permits 1 active backlog for core branch recruitment drives"
            }
        ]
        created_rules = []
        for rdata in rules_data:
            rule = EligibilityRule(**rdata)
            db.add(rule)
            db.commit()
            db.refresh(rule)
            created_rules.append(rule)

        print("5. Seeding Placement Drives & Stages...")
        drives_data = [
            {
                "title": "Microsoft Campus Recruitment Drive 2025",
                "company_id": created_companies[1].id,  # Microsoft
                "academic_year": "2024-2025",
                "drive_date": datetime.date(2024, 10, 15),
                "application_deadline": datetime.date(2024, 10, 10),
                "status": "Completed",
                "vacancies": 6,
                "eligible_departments": ["CSE", "IT", "ECE"],
                "min_cgpa": 8.0,
                "max_backlogs": 0
            },
            {
                "title": "TCS National Qualifier & Digital Drive 2025",
                "company_id": created_companies[3].id,  # TCS
                "academic_year": "2024-2025",
                "drive_date": datetime.date(2024, 11, 20),
                "application_deadline": datetime.date(2024, 11, 15),
                "status": "In Progress",
                "vacancies": 65,
                "eligible_departments": ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil"],
                "min_cgpa": 6.0,
                "max_backlogs": 1
            },
            {
                "title": "Texas Instruments Core Hardware Hiring 2025",
                "company_id": created_companies[5].id,  # TI
                "academic_year": "2024-2025",
                "drive_date": datetime.date(2024, 12, 5),
                "application_deadline": datetime.date(2024, 11, 28),
                "status": "Registration Open",
                "vacancies": 5,
                "eligible_departments": ["ECE", "EEE"],
                "min_cgpa": 7.8,
                "max_backlogs": 0
            },
            {
                "title": "L&T Infrastructure Annual Campus Drive",
                "company_id": created_companies[9].id,  # L&T
                "academic_year": "2024-2025",
                "drive_date": datetime.date(2025, 1, 15),
                "application_deadline": datetime.date(2025, 1, 5),
                "status": "Upcoming",
                "vacancies": 14,
                "eligible_departments": ["Civil", "Mechanical", "EEE"],
                "min_cgpa": 6.2,
                "max_backlogs": 1
            }
        ]

        created_drives = []
        default_stages = ["Applied", "Aptitude Test", "Technical Interview", "HR Interview", "Selected", "Offer Accepted"]
        for ddata in drives_data:
            drv = PlacementDrive(**ddata)
            db.add(drv)
            db.commit()
            db.refresh(drv)
            created_drives.append(drv)

            for s_idx, st_name in enumerate(default_stages):
                stg = RecruitmentStage(
                    drive_id=drv.id,
                    stage_name=st_name,
                    stage_order=s_idx + 1,
                    is_mandatory=True,
                    is_active=True
                )
                db.add(stg)
            db.commit()

        print("6. Generating 110 Realistic Fictional Students across 6 Departments...")
        random.seed(42)  # For reproducible realistic benchmark

        students_created = []
        roll_counters = {dept: 1 for dept in DEPARTMENTS}

        total_students_to_generate = 110
        for i in range(total_students_to_generate):
            dept = DEPARTMENTS[i % len(DEPARTMENTS)]
            idx_num = roll_counters[dept]
            roll_counters[dept] += 1
            roll_no = f"21{dept[:2].upper()}{idx_num:03d}"

            fname = random.choice(FIRST_NAMES)
            lname = random.choice(LAST_NAMES)
            fullname = f"{fname} {lname}"
            email = f"{fname.lower()}.{lname.lower()}{idx_num}@college.edu"
            phone = f"+91 9{random.randint(100000000, 999999999)}"

            # Realistic CGPA distribution: mostly 6.5 to 8.8, few >9.0, few <6.0
            r = random.random()
            if r < 0.12:
                cgpa = round(random.uniform(9.0, 9.85), 2)
                active_backlogs = 0
                total_backlogs = 0
            elif r < 0.45:
                cgpa = round(random.uniform(7.8, 8.95), 2)
                active_backlogs = 0
                total_backlogs = random.choice([0, 0, 1])
            elif r < 0.80:
                cgpa = round(random.uniform(6.5, 7.79), 2)
                active_backlogs = random.choice([0, 0, 0, 1])
                total_backlogs = active_backlogs + random.choice([0, 1])
            else:
                cgpa = round(random.uniform(5.4, 6.45), 2)
                active_backlogs = random.choice([0, 1, 2])
                total_backlogs = active_backlogs + random.choice([0, 1, 2])

            percentage = round((cgpa * 9.5) - random.uniform(0.5, 2.5), 1)

            # Department skills
            dept_skills = TECH_SKILLS_BY_DEPT.get(dept, ["Python", "SQL"])
            k_count = random.randint(3, min(6, len(dept_skills)))
            student_skills = random.sample(dept_skills, k=k_count)

            has_internship = True if cgpa >= 7.5 and random.random() > 0.3 else (random.random() > 0.7)
            intern_desc = f"3-month technical intern in {student_skills[0]}" if has_internship else None

            # Semester marks breakdown
            sem_marks = {
                f"sem{s}": round(max(5.0, min(10.0, cgpa + random.uniform(-0.4, 0.4))), 2)
                for s in range(1, 8)
            }

            student = Student(
                roll_number=roll_no,
                full_name=fullname,
                email=email,
                phone=phone,
                department=dept,
                degree="B.Tech",
                academic_year="2024-2025",
                graduation_year=2025,
                semester_marks=sem_marks,
                cgpa=cgpa,
                percentage=percentage,
                active_backlogs=active_backlogs,
                total_backlogs=total_backlogs,
                backlog_history=f"Cleared {total_backlogs - active_backlogs} subject(s)" if total_backlogs > active_backlogs else "None",
                skills=student_skills,
                soft_skills=["Communication", "Teamwork", "Problem Solving"],
                certifications=[f"Certified in {student_skills[0]}"] if random.random() > 0.5 else [],
                projects=[f"{dept} Automated System using {student_skills[0]}"],
                internship_experience=has_internship,
                internship_details=intern_desc,
                resume_link=f"https://placementiq.edu/resumes/{roll_no.lower()}.pdf",
                placement_status="Unplaced",
                custom_fields={"Hostel_Resident": random.choice(["Yes", "No"]), "Attendance_Pct": random.randint(75, 96)}
            )

            # Compute initial eligibility
            elig_status, reasons = evaluate_student_eligibility(db, student)
            student.placement_eligibility = elig_status
            student.eligibility_reasons = reasons

            db.add(student)
            students_created.append(student)

        db.commit()

        print("7. Seeding Applications, Interview Rounds, and Offers...")
        # Now let's place students with realistic offers
        # Higher CGPA students get higher packages
        for student in students_created:
            db.refresh(student)
            if student.placement_eligibility != "Eligible":
                continue

            # Eligible students have a chance to be placed or in process
            if student.cgpa >= 9.0:
                # Top tier placement (Google, Microsoft, Amazon)
                target_comp = random.choice([created_companies[0], created_companies[1], created_companies[2]])
                pkg = round(random.uniform(22.0, 38.0), 2)
                fixed_sal = round(pkg * 0.82, 2)
                var_sal = round(pkg - fixed_sal, 2)
                job_title = "Software Development Engineer"

                # Create offer
                offer = Offer(
                    student_id=student.id,
                    company_id=target_comp.id,
                    job_role=job_title,
                    ctc_lpa=pkg,
                    fixed_salary_lpa=fixed_sal,
                    variable_salary_lpa=var_sal,
                    currency="INR",
                    offer_date=datetime.date(2024, 11, random.randint(1, 28)),
                    joining_date=datetime.date(2025, 7, 1),
                    status="Accepted",
                    remarks="Fictional top campus hire"
                )
                db.add(offer)

                # Update student
                student.placement_status = "Placed"
                student.selected_company_id = target_comp.id
                student.selected_company_name = target_comp.name
                student.job_role = job_title
                student.offered_package_lpa = pkg
                student.offer_acceptance_status = "Accepted"
                student.placement_date = offer.offer_date

                # Also give some top students a second offer (multi-offer support)
                if random.random() > 0.4:
                    sec_comp = created_companies[3]  # TCS Digital
                    sec_offer = Offer(
                        student_id=student.id,
                        company_id=sec_comp.id,
                        job_role="TCS Digital Lead",
                        ctc_lpa=7.5,
                        fixed_salary_lpa=6.8,
                        variable_salary_lpa=0.7,
                        currency="INR",
                        offer_date=datetime.date(2024, 10, 20),
                        status="Rejected",
                        remarks="Declined for higher dream offer"
                    )
                    db.add(sec_offer)

            elif student.cgpa >= 7.5:
                # Mid-tier placement (TCS Digital, Infosys SP, Deloitte, TI, LTTS)
                if random.random() < 0.75:
                    if student.department in ["CSE", "IT"]:
                        target_comp = random.choice([created_companies[3], created_companies[4], created_companies[7]])
                        pkg = round(random.uniform(7.0, 11.0), 2)
                        job_title = "Specialist Programmer / Consultant"
                    elif student.department in ["ECE", "EEE"]:
                        target_comp = random.choice([created_companies[5], created_companies[6], created_companies[7]])
                        pkg = round(random.uniform(7.0, 18.0), 2)
                        job_title = "Hardware / Systems Engineer"
                    else:
                        target_comp = random.choice([created_companies[6], created_companies[8], created_companies[9]])
                        pkg = round(random.uniform(6.0, 7.5), 2)
                        job_title = "Graduate Engineer Trainee"

                    fixed_sal = round(pkg * 0.85, 2)
                    var_sal = round(pkg - fixed_sal, 2)

                    offer = Offer(
                        student_id=student.id,
                        company_id=target_comp.id,
                        job_role=job_title,
                        ctc_lpa=pkg,
                        fixed_salary_lpa=fixed_sal,
                        variable_salary_lpa=var_sal,
                        currency="INR",
                        offer_date=datetime.date(2024, 11, random.randint(5, 30)),
                        status="Accepted",
                        remarks="Direct selection from drive"
                    )
                    db.add(offer)

                    student.placement_status = "Placed"
                    student.selected_company_id = target_comp.id
                    student.selected_company_name = target_comp.name
                    student.job_role = job_title
                    student.offered_package_lpa = pkg
                    student.offer_acceptance_status = "Accepted"
                    student.placement_date = offer.offer_date
                else:
                    student.placement_status = "In Process"

            elif student.cgpa >= 6.0 and student.active_backlogs == 0:
                # Baseline tier (TCS Ninja, Infosys SE, L&T Site)
                if random.random() < 0.55:
                    target_comp = random.choice([created_companies[3], created_companies[4], created_companies[9]])
                    pkg = round(random.uniform(3.8, 5.5), 2)
                    job_title = "Associate Software Engineer / GET"
                    offer = Offer(
                        student_id=student.id,
                        company_id=target_comp.id,
                        job_role=job_title,
                        ctc_lpa=pkg,
                        fixed_salary_lpa=pkg,
                        variable_salary_lpa=0.0,
                        currency="INR",
                        offer_date=datetime.date(2024, 12, random.randint(1, 20)),
                        status="Accepted",
                        remarks="Standard campus offer"
                    )
                    db.add(offer)

                    student.placement_status = "Placed"
                    student.selected_company_id = target_comp.id
                    student.selected_company_name = target_comp.name
                    student.job_role = job_title
                    student.offered_package_lpa = pkg
                    student.offer_acceptance_status = "Accepted"
                    student.placement_date = offer.offer_date
                else:
                    student.placement_status = "In Process"
            else:
                student.placement_status = "Unplaced"

        db.commit()

        # Seed Drive Applications for active drives
        print("8. Seeding Applications and Interview Rounds for Drives...")
        tcs_drive = created_drives[1]
        tcs_stages = tcs_drive.stages
        for s in students_created[:45]:
            app = Application(
                student_id=s.id,
                drive_id=tcs_drive.id,
                company_id=tcs_drive.company_id,
                status="In Interview" if s.placement_status != "Placed" else "Selected",
                remarks="Applied through portal"
            )
            if tcs_stages:
                app.current_stage_id = tcs_stages[min(2, len(tcs_stages)-1)].id
            db.add(app)
            db.commit()
            db.refresh(app)

            # Add interview round
            rnd = InterviewRound(
                application_id=app.id,
                stage_id=app.current_stage_id,
                round_name="Technical Screening & Aptitude",
                round_date=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(1, 10)),
                interviewer_name="TCS Technical Panel 4",
                status="Cleared" if s.placement_status == "Placed" else "Scheduled",
                score=round(random.uniform(65.0, 95.0), 1) if s.placement_status == "Placed" else None,
                feedback="Strong technical aptitude and problem solving." if s.placement_status == "Placed" else "Awaiting interview slot."
            )
            db.add(rnd)

        db.commit()

        # Log system seed audit event
        audit = AuditLog(
            username="system",
            action="CREATE",
            entity_type="System",
            entity_id="SEED",
            details="Database populated with 110 fictional students, 10 companies, cutoffs, drives, and offers."
        )
        db.add(audit)
        db.commit()

        print("Demonstration sample data seeded successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
