import sys
import os
import time

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.session import SessionLocal
from app.models.profile import StudentProfile
from app.models.learning import StudentProgress
from app.services.student_service import StudentService

def profile_complete_module():
    db = SessionLocal()
    try:
        # We'll profile the backend steps for a mock student (e.g. user_id matchingalex@student.edu)
        # Let's find a student
        print("1. Fetching student profile...")
        start = time.time()
        student_profile = db.query(StudentProfile).first()
        if not student_profile:
            print("No student profile found!")
            return
        user_id = student_profile.user_id
        print(f"   Found student profile_id={student_profile.profile_id}, user_id={user_id} in {time.time() - start:.4f}s")
        
        # Step 2: Query StudentProgress
        print("2. Querying student progress record...")
        start = time.time()
        ass_id = 1
        progress = db.query(StudentProgress).filter(
            StudentProgress.student_id == student_profile.profile_id,
            StudentProgress.item_id == ass_id,
            StudentProgress.item_type == "Assignment"
        ).first()
        print(f"   Progress query took {time.time() - start:.4f}s")
        
        # Step 3: Update progress
        print("3. Updating progress status to NOT_STARTED (reverting/initializing)...")
        start = time.time()
        if progress:
            progress.status = "NOT_STARTED"
        print(f"   Status change in-memory took {time.time() - start:.4f}s")
        
        # Step 4: Trust score increment
        print("4. Incrementing trust score in-memory...")
        start = time.time()
        student_profile.trust_score = float(student_profile.trust_score) + 10.0
        print(f"   Trust score increment in-memory took {time.time() - start:.4f}s")
        
        # Step 5: Evaluate level progression
        print("5. Evaluating level progression...")
        start = time.time()
        student_svc = StudentService(db)
        res = student_svc.evaluate_progression(user_id)
        print(f"   evaluate_progression returned: {res} in {time.time() - start:.4f}s")
        
        # Step 6: Commit transaction
        print("6. Committing transaction to DB...")
        start = time.time()
        db.commit()
        print(f"   db.commit() took {time.time() - start:.4f}s")
        
        # Step 7: Query completed keys
        print("7. Fetching completed keys...")
        start = time.time()
        rows = db.query(StudentProgress).filter(
            StudentProgress.student_id == student_profile.profile_id,
            StudentProgress.item_type == "Assignment",
            StudentProgress.status == "COMPLETED"
        ).all()
        print(f"   Fetching completed keys took {time.time() - start:.4f}s")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    profile_complete_module()
