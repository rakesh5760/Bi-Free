import os
import sys

# Add Backend dir to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database.session import SessionLocal
from app.models.user import User, Role
from app.models.core import Level
from app.models.profile import StudentProfile
from app.models.learning import StudentProgress, Assignment

def seed_mock_students():
    print("Starting seeding of mock student credentials...")
    db = SessionLocal()
    try:
        # 1. Get Student role
        student_role = db.query(Role).filter(Role.role_name.ilike('Student')).first()
        if not student_role:
            print("ERROR: 'Student' role not found in database!")
            return
            
        # 2. Get Levels
        levels = {level.name: level for level in db.query(Level).all()}
        for l_name in ["Level D", "Level C", "Level B", "Level A"]:
            if l_name not in levels:
                print(f"ERROR: Level '{l_name}' not found in database!")
                return
                
        # 3. Get all assignments for seeding progress
        assignments = db.query(Assignment).all()
        print(f"Found {len(assignments)} assignments in the database.")
        
        # Hardcoded bcrypt hash for 'password123'
        pwd = "$2b$12$44kPYBfLLOChRaH8bunAzOtTSP1zo0u5miY3KNZEQQSqeXE7/Wssy"
        
        students_data = [
            {
                "email": "dan@student.edu",
                "first_name": "Dan",
                "last_name": "Beginner",
                "level_name": "Level D",
                "trust_score": 0.0,
                "completed_assignments": []
            },
            {
                "email": "charlie@student.edu",
                "first_name": "Charlie",
                "last_name": "Learner",
                "level_name": "Level C",
                "trust_score": 50.0,
                "completed_assignments": [1, 2]
            },
            {
                "email": "bob@student.edu",
                "first_name": "Bob",
                "last_name": "Advanced",
                "level_name": "Level B",
                "trust_score": 75.0,
                "completed_assignments": [1, 2, 3, 4]
            },
            {
                "email": "alice@student.edu",
                "first_name": "Alice",
                "last_name": "Expert",
                "level_name": "Level A",
                "trust_score": 95.0,
                "completed_assignments": [1, 2, 3, 4, 5, 6, 7]
            }
        ]
        
        for data in students_data:
            # Clean up existing user if any
            existing_user = db.query(User).filter(User.email == data["email"]).first()
            if existing_user:
                print(f"Removing existing user {data['email']} to re-seed cleanly...")
                # Delete corresponding progress first
                profile = db.query(StudentProfile).filter(StudentProfile.user_id == existing_user.user_id).first()
                if profile:
                    db.query(StudentProgress).filter(StudentProgress.student_id == profile.profile_id).delete()
                    db.delete(profile)
                db.delete(existing_user)
                db.commit()
                
            # Create user
            user = User(
                email=data["email"],
                password_hash=pwd,
                first_name=data["first_name"],
                last_name=data["last_name"],
                role_id=student_role.role_id,
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            # Create profile
            level = levels[data["level_name"]]
            profile = StudentProfile(
                user_id=user.user_id,
                level_id=level.level_id,
                trust_score=data["trust_score"]
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
            
            # Initialize progress for assignments
            progress_count = 0
            for assignment in assignments:
                status = "COMPLETED" if assignment.assignment_id in data["completed_assignments"] else "NOT_STARTED"
                progress = StudentProgress(
                    student_id=profile.profile_id,
                    item_id=assignment.assignment_id,
                    item_type="Assignment",
                    status=status,
                    is_deleted=0
                )
                db.add(progress)
                progress_count += 1
            db.commit()
            print(f"Seeded student {data['email']} ({data['level_name']}) with trust_score={data['trust_score']} and {progress_count} progress records.")
            
        print("Mock student seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding mock students: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_mock_students()
