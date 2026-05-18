from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.models.reputation import StudentReview, ReviewerType
from app.models.profile import StudentProfile
from app.schemas.analytics import StudentReviewCreate

class ReputationService:
    def __init__(self, db: Session):
        self.db = db

    def submit_review(self, reviewer_id: int, reviewer_type: ReviewerType, student_id: int, review_data: StudentReviewCreate) -> StudentReview:
        """
        Submit a formal review and recalculate the student's trust score.
        """
        student = self.db.query(StudentProfile).filter(StudentProfile.profile_id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found.")

        review = StudentReview(
            student_id=student_id,
            reviewer_id=reviewer_id,
            reviewer_type=reviewer_type,
            project_id=review_data.project_id,
            professionalism_score=review_data.professionalism_score,
            reliability_score=review_data.reliability_score,
            communication_score=review_data.communication_score,
            feedback=review_data.feedback
        )
        self.db.add(review)
        self.db.commit()
        
        self.recalculate_trust_score(student_id)
        
        self.db.refresh(review)
        return review

    def recalculate_trust_score(self, student_id: int) -> float:
        """
        Recalculates the overarching trust score based on all reviews.
        (In a real app, this would also factor in exam scores, assignment completions, etc.)
        """
        student = self.db.query(StudentProfile).filter(StudentProfile.profile_id == student_id).first()
        if not student:
            return 0.0

        # Calculate average of all 3 metrics across all reviews
        metrics = self.db.query(
            func.avg(StudentReview.professionalism_score).label("avg_prof"),
            func.avg(StudentReview.reliability_score).label("avg_rel"),
            func.avg(StudentReview.communication_score).label("avg_comm")
        ).filter(StudentReview.student_id == student_id).first()

        if metrics and metrics.avg_prof:
            # Simple average of the 3 averages
            new_trust_score = (float(metrics.avg_prof) + float(metrics.avg_rel) + float(metrics.avg_comm)) / 3.0
            
            # Optionally scale it if trust_score is 0-100 instead of 1-5
            # new_trust_score = new_trust_score * 20.0
            
            student.trust_score = round(new_trust_score, 2)
            self.db.commit()
            return student.trust_score
        
        return float(student.trust_score)
