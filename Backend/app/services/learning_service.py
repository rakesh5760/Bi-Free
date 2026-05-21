from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.learning import LearningPath, Milestone, Assignment, Quiz, StudentProgress, ProgressStatus
from app.models.profile import StudentProfile
from app.services.student_service import StudentService

class LearningService:
    def __init__(self, db: Session):
        self.db = db
        self.student_svc = StudentService(db)

    def get_all_paths(self) -> List[LearningPath]:
        return self.db.query(LearningPath).all()

    def submit_assignment(self, student_id: int, assignment_id: int, submission_url: str) -> StudentProgress:
        """
        Student submits an assignment.
        """
        assignment = self.db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")
            
        # student_id argument is user_id in code, retrieve profile_id
        student_profile = self.student_svc.get_profile(student_id)
        profile_id = student_profile.profile_id
            
        progress = self.db.query(StudentProgress).filter(
            StudentProgress.student_id == profile_id,
            StudentProgress.item_id == assignment_id,
            StudentProgress.item_type == "Assignment"
        ).first()
        
        if not progress:
            progress = StudentProgress(
                student_id=profile_id,
                item_id=assignment_id,
                item_type="Assignment"
            )
            self.db.add(progress)
            
        progress.status = ProgressStatus.PENDING_REVIEW
        progress.submission_url = submission_url
        self.db.commit()
        self.db.refresh(progress)
        return progress

    def review_assignment(self, assignment_id: int, student_id: int, approve: bool, feedback: str) -> StudentProgress:
        """
        Mentor reviews an assignment.
        """
        # student_id argument is user_id in code, retrieve profile_id
        student_profile = self.student_svc.get_profile(student_id)
        profile_id = student_profile.profile_id

        progress = self.db.query(StudentProgress).filter(
            StudentProgress.student_id == profile_id,
            StudentProgress.item_id == assignment_id,
            StudentProgress.item_type == "Assignment"
        ).first()
        
        if not progress or progress.status != ProgressStatus.PENDING_REVIEW:
            raise HTTPException(status_code=400, detail="Assignment not pending review for this student.")
            
        progress.status = ProgressStatus.COMPLETED if approve else ProgressStatus.REJECTED
        progress.feedback = feedback
        
        if approve:
            # Add a trust score boost for completing an assignment
            student_profile.trust_score = float(student_profile.trust_score) + 5.0
            
            # Re-evaluate level progression automatically (expects user_id)
            self.student_svc.evaluate_progression(student_id)
            
        self.db.commit()
        self.db.refresh(progress)
        return progress

    def get_recommendations(self, student_id: int) -> List[LearningPath]:
        """
        Simple recommendation engine: Recommend paths in domains where the student lacks skills.
        """
        profile = self.student_svc.get_profile(student_id)
        student_domain_ids = {skill.domain_id for skill in profile.skills}
        
        # Recommend paths in domains the student HAS NOT started acquiring skills in
        recommended_paths = self.db.query(LearningPath).filter(
            ~LearningPath.domain_id.in_(student_domain_ids) if student_domain_ids else True
        ).all()
        
        return recommended_paths
