from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.learning import LearningPath, Milestone, Assignment, Quiz, StudentProgress, ProgressStatus
from app.models.profile import StudentProfile, MentorProfile, FacultyProfile
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

        # Route to Mentor or Faculty
        domain_id = student_profile.domain_id
        assigned = False
        if domain_id:
            mentor = self.db.query(MentorProfile).filter(MentorProfile.domain_id == domain_id).first()
            if mentor:
                progress.assigned_mentor_id = mentor.profile_id
                progress.assigned_faculty_id = None
                assigned = True
        
        if not assigned:
            faculty = self.db.query(FacultyProfile).first()
            if faculty:
                progress.assigned_faculty_id = faculty.profile_id
                progress.assigned_mentor_id = None

        self.db.commit()
        self.db.refresh(progress)
        return progress

    def review_assignment(self, assignment_id: int, student_id: int, approve: bool, feedback: str, score: Optional[int] = None, reviewer_user_id: Optional[int] = None) -> StudentProgress:
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
        if score is not None:
            progress.score = score
        
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

    def get_pending_reviews_for_user(self, user_id: int) -> List[StudentProgress]:
        """
        Get all pending reviews assigned to this user's mentor or faculty profile.
        """
        mentor = self.db.query(MentorProfile).filter(MentorProfile.user_id == user_id).first()
        faculty = self.db.query(FacultyProfile).filter(FacultyProfile.user_id == user_id).first()
        
        query = self.db.query(StudentProgress).filter(StudentProgress.status == ProgressStatus.PENDING_REVIEW)
        
        filters = []
        if mentor:
            filters.append(StudentProgress.assigned_mentor_id == mentor.profile_id)
        if faculty:
            filters.append(StudentProgress.assigned_faculty_id == faculty.profile_id)
            
        if not filters:
            return []
            
        # Use OR to combine conditions if the user is somehow both
        from sqlalchemy import or_
        query = query.filter(or_(*filters))
        
        return query.all()
