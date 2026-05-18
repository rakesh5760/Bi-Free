from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app import schemas
from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.utils.responses import success_response, StandardResponse
from app.services.learning_service import LearningService
from app.schemas.learning import LearningPath, StudentProgress

router = APIRouter()

student_checker = RoleChecker(["Student"])
mentor_checker = RoleChecker(["Mentor", "Faculty", "Admin"])

class AssignmentSubmission(BaseModel):
    submission_url: str

class AssignmentReview(BaseModel):
    student_id: int
    approve: bool
    feedback: str

@router.get("/paths", response_model=StandardResponse[List[LearningPath]])
def get_learning_paths(
    db: Session = Depends(get_db)
) -> Any:
    """
    Get all available learning paths. Accessible to anyone authenticated.
    """
    svc = LearningService(db)
    paths = svc.get_all_paths()
    return success_response(data=paths, message=f"Found {len(paths)} paths.")

@router.post("/assignments/{assignment_id}/submit", response_model=StandardResponse[StudentProgress])
def submit_assignment(
    assignment_id: int,
    request: AssignmentSubmission,
    current_user: User = Depends(student_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Student submits an assignment.
    """
    svc = LearningService(db)
    progress = svc.submit_assignment(current_user.user_id, assignment_id, request.submission_url)
    return success_response(data=progress, message="Assignment submitted successfully.")

@router.post("/assignments/{assignment_id}/review", response_model=StandardResponse[StudentProgress])
def review_assignment(
    assignment_id: int,
    request: AssignmentReview,
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Mentor reviews a student's assignment submission.
    """
    svc = LearningService(db)
    progress = svc.review_assignment(assignment_id, request.student_id, request.approve, request.feedback)
    return success_response(data=progress, message="Assignment reviewed.")

@router.get("/recommendations", response_model=StandardResponse[List[LearningPath]])
def get_recommendations(
    current_user: User = Depends(student_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get personalized learning path recommendations based on skill gaps.
    """
    svc = LearningService(db)
    recs = svc.get_recommendations(current_user.user_id)
    return success_response(data=recs, message=f"Generated {len(recs)} recommendations.")
