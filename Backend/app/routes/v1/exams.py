from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app import schemas
from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.utils.responses import success_response, StandardResponse
from app.services.exam_service import ExamService
from app.schemas.exam import Exam, ExamAttempt, MonitoringLog, MonitoringLogCreate, ExamSubmissionCreate

router = APIRouter()
student_checker = RoleChecker(["Student"])
mentor_checker = RoleChecker(["Mentor", "Faculty", "Admin"])

from typing import Optional, Dict

class ExamReview(BaseModel):
    student_id: int
    approve: bool
    feedback: str
    score: int
    question_scores: Optional[Dict[int, int]] = None

@router.get("/pending-reviews", response_model=StandardResponse[List[ExamAttempt]])
def get_pending_reviews(
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get exams pending review for the current mentor or faculty.
    """
    svc = ExamService(db)
    reviews = svc.get_pending_exams_for_user(current_user.user_id)
    return success_response(data=reviews, message=f"Found {len(reviews)} pending exams.")

@router.get("/{exam_id}", response_model=StandardResponse[Exam])
def get_exam_details(
    exam_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get exam metadata and questions.
    """
    svc = ExamService(db)
    exam = svc.get_exam(exam_id)
    return success_response(data=exam)

@router.post("/{exam_id}/start", response_model=StandardResponse[ExamAttempt])
def start_exam(
    exam_id: int,
    current_user: User = Depends(student_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Start an exam attempt. Starts the server-side timer.
    """
    svc = ExamService(db)
    attempt = svc.start_attempt(current_user.user_id, exam_id)
    return success_response(data=attempt, message="Exam started successfully.")

@router.post("/attempts/{attempt_id}/monitor", response_model=StandardResponse[MonitoringLog])
def log_monitoring_event(
    attempt_id: int,
    request: MonitoringLogCreate,
    current_user: User = Depends(student_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Ingest a security monitoring event (tab switch, etc).
    """
    svc = ExamService(db)
    log = svc.ingest_monitoring_log(current_user.user_id, attempt_id, request)
    return success_response(data=log, message="Monitoring event logged.")

@router.post("/attempts/{attempt_id}/submit", response_model=StandardResponse[ExamAttempt])
def submit_exam(
    attempt_id: int,
    request: List[ExamSubmissionCreate],
    current_user: User = Depends(student_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Submit exam answers and calculate results (or flag for manual grading).
    """
    svc = ExamService(db)
    attempt = svc.submit_exam(current_user.user_id, attempt_id, request)
    return success_response(data=attempt, message="Exam submitted successfully.")


@router.post("/attempts/{attempt_id}/review", response_model=StandardResponse[ExamAttempt])
def review_exam(
    attempt_id: int,
    request: ExamReview,
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Mentor reviews an exam submission.
    """
    svc = ExamService(db)
    attempt = svc.review_exam(
        attempt_id=attempt_id,
        student_id=request.student_id,
        approve=request.approve,
        feedback=request.feedback,
        score=request.score,
        question_scores=request.question_scores
    )
    return success_response(data=attempt, message="Exam reviewed successfully.")
