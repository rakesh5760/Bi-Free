from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User, Role
from app.models.reputation import ReviewerType
from app.utils.responses import success_response, StandardResponse
from app.services.reputation_service import ReputationService
from app.schemas.analytics import StudentReview, StudentReviewCreate

router = APIRouter()

mentor_or_client = RoleChecker(["Mentor", "Client", "Faculty", "Admin"])

@router.post("/students/{student_id}/reviews", response_model=StandardResponse[StudentReview])
def submit_review(
    student_id: int,
    request: StudentReviewCreate,
    current_user: User = Depends(mentor_or_client),
    db: Session = Depends(get_db)
) -> Any:
    """
    Mentor or Client submits a formal review of a student's performance.
    """
    svc = ReputationService(db)
    
    # Map User Role to ReviewerType
    reviewer_type = ReviewerType.MENTOR
    if current_user.role == Role.Client:
        reviewer_type = ReviewerType.CLIENT
        
    review = svc.submit_review(current_user.user_id, reviewer_type, student_id, request)
    return success_response(data=review, message="Review submitted and trust score updated.")

student_role_checker = RoleChecker(["Student"])

@router.get("/me/reviews", response_model=StandardResponse[List[StudentReview]])
def get_my_reviews(
    current_user: User = Depends(student_role_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get all reviews received by the currently logged-in student.
    """
    svc = ReputationService(db)
    reviews = svc.get_reviews(current_user.user_id)
    return success_response(data=reviews)

