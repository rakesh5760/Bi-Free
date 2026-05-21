from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel

from app import schemas
from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.utils.responses import success_response, StandardResponse
from app.services.learning_service import LearningService
from app.schemas.learning import LearningPath, StudentProgress

from app.models.profile import StudentProfile
from app.models.learning import StudentProgress as StudentProgressModel

router = APIRouter()

student_checker = RoleChecker(["Student"])
mentor_checker = RoleChecker(["Mentor", "Faculty", "Admin"])

class AssignmentSubmission(BaseModel):
    submission_url: str

class AssignmentReview(BaseModel):
    student_id: int
    approve: bool
    feedback: str


# ── Module completion mapping ──────────────────────────────────────────────────

MODULE_ASSIGNMENT_MAP = {
    "fs-mod-1": 1,
    "fs-mod-2": 2,
    "fs-mod-3": 3,
    "fe-mod-1": 4,
    "fe-mod-2": 5,
    "be-mod-1": 6,
    "be-mod-2": 7
}

REVERSE_MAP = {v: k for k, v in MODULE_ASSIGNMENT_MAP.items()}


# ── Module completion endpoints ───────────────────────────────────────────────

@router.get("/my-modules", response_model=StandardResponse[List[str]])
def get_my_completed_modules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Return a list of module_key strings that the current user has completed.
    """
    student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.user_id).first()
    if not student_profile:
        return success_response(data=[], message="No student profile found for this user.")

    rows = db.query(StudentProgressModel).filter(
        StudentProgressModel.student_id == student_profile.profile_id,
        StudentProgressModel.item_type == "Assignment",
        StudentProgressModel.status == "COMPLETED"
    ).all()
    
    completed_keys = [REVERSE_MAP[r.item_id] for r in rows if r.item_id in REVERSE_MAP]
    return success_response(
        data=completed_keys,
        message=f"Found {len(completed_keys)} completed modules."
    )


@router.post("/my-modules/{module_key}/complete", response_model=StandardResponse[List[str]])
def complete_module(
    module_key: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Mark a module as completed for the current user and evaluate level progression dynamically.
    """
    if module_key not in MODULE_ASSIGNMENT_MAP:
        raise HTTPException(status_code=400, detail="Invalid module key specified")
    
    ass_id = MODULE_ASSIGNMENT_MAP[module_key]
    
    student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.user_id).first()
    if not student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    # Check or update progress record
    progress = db.query(StudentProgressModel).filter(
        StudentProgressModel.student_id == student_profile.profile_id,
        StudentProgressModel.item_id == ass_id,
        StudentProgressModel.item_type == "Assignment"
    ).first()
    
    if not progress:
        progress = StudentProgressModel(
            student_id=student_profile.profile_id,
            item_id=ass_id,
            item_type="Assignment",
            status="COMPLETED",
            is_deleted=0
        )
        db.add(progress)
    else:
        if progress.status != "COMPLETED":
            progress.status = "COMPLETED"
            
    # Perform trust score boost + evaluate level progression
    # Each completed module earns a student 10.0 points of trust score!
    student_profile.trust_score = float(student_profile.trust_score) + 10.0
    
    # Re-evaluate level progression dynamically!
    from app.services.student_service import StudentService
    student_svc = StudentService(db)
    student_svc.evaluate_progression(current_user.user_id)
    
    db.commit()
    
    # Return the updated full list of completed module keys
    rows = db.query(StudentProgressModel).filter(
        StudentProgressModel.student_id == student_profile.profile_id,
        StudentProgressModel.item_type == "Assignment",
        StudentProgressModel.status == "COMPLETED"
    ).all()
    completed_keys = [REVERSE_MAP[r.item_id] for r in rows if r.item_id in REVERSE_MAP]

    return success_response(
        data=completed_keys,
        message="Module marked as complete, trust score updated, and level progression evaluated."
    )


# ── Existing endpoints ────────────────────────────────────────────────────────

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
