from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.schemas.core import TimestampSchema
from app.models.reputation import ReviewerType

# Reputation Schemas
class StudentReviewBase(BaseModel):
    project_id: Optional[int] = None
    professionalism_score: float
    reliability_score: float
    communication_score: float
    feedback: Optional[str] = None

class StudentReviewCreate(StudentReviewBase):
    pass

class StudentReview(StudentReviewBase, TimestampSchema):
    review_id: int
    student_id: int
    reviewer_id: int
    reviewer_type: ReviewerType
    class Config:
        from_attributes = True

# Analytics Schemas (Static Aggregates)
class StudentAnalytics(BaseModel):
    total_projects_assigned: int
    total_projects_completed: int
    total_exams_taken: int
    average_exam_score: float
    current_trust_score: float
    level_name: str

class MentorAnalytics(BaseModel):
    total_active_allocations: int
    total_completed_allocations: int
    total_tasks_reviewed: int
    total_reviews_given: int

class AdminAnalytics(BaseModel):
    total_students: int
    total_mentors: int
    total_clients: int
    active_projects: int
    completed_projects: int
    total_revenue_pipeline: float
