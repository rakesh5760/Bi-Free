import os
import sys
from datetime import datetime, timedelta

# Add Backend dir to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database.session import SessionLocal, engine
from app.models.user import User, Role
from app.models.core import Domain, Skill, Level
from app.models.profile import StudentProfile, MentorProfile, FacultyProfile, ClientProfile
from app.models.project import Project, ProjectStatus, Task, TaskStatus, ProjectAllocation, TeamMember

def reset_database(db):
    print("Truncating tables...")
    # Disable foreign key checks for MySQL
    db.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
    
    tables = [
        "student_reviews", "monitoring_logs", "exam_submissions", "exam_attempts",
        "questions", "exams", "tasks", "team_members", "project_allocations",
        "quality_assurance_submissions", "project_skills", "projects",
        "student_progress", "quizzes", "assignments", "milestones", "learning_paths",
        "student_skills", "student_profiles", "mentor_profiles",
        "faculty_profiles", "client_profiles", "admin_profiles",
        "levels", "skills", "domains", "users", "roles"
    ]
    
    for table in tables:
        try:
            db.execute(text(f"TRUNCATE TABLE {table};"))
            print(f"Truncated {table}")
        except Exception as e:
            print(f"Skipping {table}: {e}")
            
    db.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
    db.commit()
    print("Database reset complete.")

def seed():
    env = os.getenv("ENVIRONMENT", "development")
    if env == "production":
        print("CRITICAL ERROR: Refusing to run seed script in production environment.")
        sys.exit(1)

    print("Starting database seed...")
    db = SessionLocal()

    try:
        reset_database(db)

        # 1. Core Lookups
        print("Seeding Domains, Skills, and Levels...")
        web_dev = Domain(name="Web Development", description="Frontend and Backend Engineering")
        ai = Domain(name="Artificial Intelligence", description="Machine Learning and AI Ops")
        db.add_all([web_dev, ai])
        db.commit()

        react_skill = Skill(name="React.js", domain_id=web_dev.domain_id)
        fastapi_skill = Skill(name="FastAPI", domain_id=web_dev.domain_id)
        python_skill = Skill(name="Python", domain_id=ai.domain_id)
        cyber_domain = Domain(name="Cyber Security", description="Information Security & Ethical Hacking")
        data_domain = Domain(name="Data Science", description="Data Analytics and Engineering")
        db.add_all([react_skill, fastapi_skill, python_skill, cyber_domain, data_domain])
        
        level_d = Level(name="Level D", required_trust_score=0.0)
        level_c = Level(name="Level C", required_trust_score=20.0)
        level_b = Level(name="Level B", required_trust_score=50.0)
        level_a = Level(name="Level A", required_trust_score=80.0)
        db.add_all([level_d, level_c, level_b, level_a])
        db.commit()

        # 2. Users & Profiles
        print("Seeding Roles and Users...")
        # Hardcoded bcrypt hash for 'password123' to avoid passlib/bcrypt4 compatibility issues in seed script
        pwd = "$2b$12$44kPYBfLLOChRaH8bunAzOtTSP1zo0u5miY3KNZEQQSqeXE7/Wssy"
        
        role_faculty = Role(role_name="Faculty")
        role_mentor = Role(role_name="Mentor")
        role_client = Role(role_name="Client")
        role_student = Role(role_name="Student")
        db.add_all([role_faculty, role_mentor, role_client, role_student])
        db.commit()
        
        faculty_user = User(email="faculty@skillforge.edu", password_hash=pwd, first_name="Alan", last_name="Turing", role_id=role_faculty.role_id, is_active=True)
        mentor_user = User(email="mentor@skillforge.edu", password_hash=pwd, first_name="Sarah", last_name="Mentor", role_id=role_mentor.role_id, is_active=True)
        mentor_ai = User(email="ai_mentor@skillforge.edu", password_hash=pwd, first_name="David", last_name="AI-Expert", role_id=role_mentor.role_id, is_active=True)
        mentor_cyber = User(email="cyber_mentor@skillforge.edu", password_hash=pwd, first_name="Eve", last_name="Hacker", role_id=role_mentor.role_id, is_active=True)
        
        client_user = User(email="client@skillforge.edu", password_hash=pwd, first_name="TechStart", last_name="Corp", role_id=role_client.role_id, is_active=True)
        student_a = User(email="alex@student.edu", password_hash=pwd, first_name="Alex", last_name="Developer", role_id=role_student.role_id, is_active=True)
        student_c = User(email="junior@student.edu", password_hash=pwd, first_name="Junior", last_name="Coder", role_id=role_student.role_id, is_active=True)
        student_fs1 = User(email="sam.fs@student.edu", password_hash=pwd, first_name="Sam", last_name="Fullstack", role_id=role_student.role_id, is_active=True)
        student_fs2 = User(email="mia.web@student.edu", password_hash=pwd, first_name="Mia", last_name="WebDev", role_id=role_student.role_id, is_active=True)
        student_fs3 = User(email="liam.stack@student.edu", password_hash=pwd, first_name="Liam", last_name="Stack", role_id=role_student.role_id, is_active=True)
        
        db.add_all([faculty_user, mentor_user, mentor_ai, mentor_cyber, client_user, student_a, student_c, student_fs1, student_fs2, student_fs3])
        db.commit()

        print("Seeding Profiles...")
        fac_prof = FacultyProfile(user_id=faculty_user.user_id, department="Computer Science")
        ment_prof = MentorProfile(user_id=mentor_user.user_id, domain_id=web_dev.domain_id, rating=4.9)
        ment_ai_prof = MentorProfile(user_id=mentor_ai.user_id, domain_id=ai.domain_id, rating=4.8)
        ment_cyber_prof = MentorProfile(user_id=mentor_cyber.user_id, domain_id=cyber_domain.domain_id, rating=5.0)
        
        client_prof = ClientProfile(user_id=client_user.user_id, company_name="TechStart Innovations", domain_id=web_dev.domain_id)
        
        # Student A is elite, ready for projects
        stu_a_prof = StudentProfile(user_id=student_a.user_id, level_id=level_a.level_id, trust_score=95.0)
        stu_a_prof.skills = [react_skill, fastapi_skill]
        
        # Student C is still learning
        stu_c_prof = StudentProfile(user_id=student_c.user_id, level_id=level_c.level_id, trust_score=45.0)
        stu_c_prof.skills = [python_skill]

        # New Fullstack Students
        stu_fs1_prof = StudentProfile(user_id=student_fs1.user_id, level_id=level_b.level_id, trust_score=75.0)
        stu_fs1_prof.skills = [react_skill, fastapi_skill]

        stu_fs2_prof = StudentProfile(user_id=student_fs2.user_id, level_id=level_a.level_id, trust_score=88.0)
        stu_fs2_prof.skills = [react_skill, fastapi_skill]

        stu_fs3_prof = StudentProfile(user_id=student_fs3.user_id, level_id=level_c.level_id, trust_score=35.0)
        stu_fs3_prof.skills = [react_skill, fastapi_skill]

        db.add_all([fac_prof, ment_prof, ment_ai_prof, ment_cyber_prof, client_prof, stu_a_prof, stu_c_prof, stu_fs1_prof, stu_fs2_prof, stu_fs3_prof])
        db.commit()
        
        # Refresh to get IDs
        db.refresh(client_prof)
        db.refresh(ment_prof)
        db.refresh(stu_a_prof)

        # 3. Projects and Allocations
        print("Seeding Active Ecosystem Projects...")
        project1 = Project(
            client_id=client_prof.profile_id,
            domain_id=web_dev.domain_id,
            title="SaaS Analytics Dashboard",
            description="Build a full-stack React and FastAPI dashboard for real-time metrics.",
            budget=5000.00,
            status=ProjectStatus.IN_PROGRESS,
            deadline=datetime.utcnow().date() + timedelta(days=30)
        )
        project1.required_skills = [react_skill, fastapi_skill]
        
        project2 = Project(
            client_id=client_prof.profile_id,
            domain_id=web_dev.domain_id,
            title="webdevelopment",
            description="Looking for a web development team.",
            budget=3000.00,
            status=ProjectStatus.PENDING,
            deadline=datetime.utcnow().date() + timedelta(days=45)
        )
        project2.required_skills = [react_skill, fastapi_skill]
        
        db.add_all([project1, project2])
        db.commit()
        db.refresh(project1)

        # 4. Allocations & Teams
        allocation = ProjectAllocation(
            project_id=project1.project_id,
            mentor_id=ment_prof.profile_id,
            team_name="Alpha Team"
        )
        db.add(allocation)
        db.commit()
        db.refresh(allocation)

        member = TeamMember(
            allocation_id=allocation.allocation_id,
            student_id=stu_a_prof.profile_id,
            role="Lead Frontend Engineer"
        )
        db.add(member)
        
        # 5. Tasks
        task1 = Task(
            project_id=project1.project_id,
            assigned_to=stu_a_prof.profile_id,
            title="Setup React Router and Auth Guards",
            status=TaskStatus.REVIEW,
            github_pr_url="https://github.com/TechStart/dashboard/pull/1"
        )
        task2 = Task(
            project_id=project1.project_id,
            assigned_to=stu_a_prof.profile_id,
            title="Design Dashboard Layout",
            status=TaskStatus.TO_DO
        )
        db.add_all([task1, task2])
        db.commit()

        print("Database Seeded Successfully! The platform is now ALIVE.")
        print("--- Demo Credentials ---")
        print("Faculty: faculty@skillforge.edu / password123")
        print("Mentor (Web): mentor@skillforge.edu / password123")
        print("Mentor (AI): ai_mentor@skillforge.edu / password123")
        print("Mentor (Cyber): cyber_mentor@skillforge.edu / password123")
        print("Client: client@skillforge.edu / password123")
        print("Student A (Level A): alex@student.edu / password123")
        print("Student Sam (Level B): sam.fs@student.edu / password123")
        print("Student Mia (Level A): mia.web@student.edu / password123")
        print("Student Liam (Level C): liam.stack@student.edu / password123")

    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
