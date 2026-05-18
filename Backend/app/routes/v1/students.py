from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schemas
from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.utils.responses import success_response, StandardResponse
from app.services.student_service import StudentService
from app.schemas.profile import StudentSkillUpdate, StudentProfile

router = APIRouter()

# Restrict all routes in this file to users with the "Student" role.
student_role_checker = RoleChecker(["Student"])

@router.get("/me/profile", response_model=StandardResponse[StudentProfile])
def get_student_profile(
    current_user: User = Depends(student_role_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve the logged-in student's complete profile.
    """
    svc = StudentService(db)
    profile = svc.get_profile(current_user.user_id)
    return success_response(data=profile, message="Profile retrieved successfully.")

@router.put("/me/skills", response_model=StandardResponse[StudentProfile])
def update_student_skills(
    request: StudentSkillUpdate,
    current_user: User = Depends(student_role_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Update the student's skill matrix.
    """
    svc = StudentService(db)
    profile = svc.update_skills(current_user.user_id, request.skill_ids)
    return success_response(data=profile, message="Skills updated successfully.")

@router.post("/me/evaluate-progression", response_model=StandardResponse)
def evaluate_student_progression(
    current_user: User = Depends(student_role_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Trigger the progression algorithm to check if the student qualifies for a level promotion.
    """
    svc = StudentService(db)
    result = svc.evaluate_progression(current_user.user_id)
    return success_response(data=result, message=result["message"])

@router.get("/me/eligible-projects", response_model=StandardResponse[List[schemas.Project]])
def get_eligible_projects(
    current_user: User = Depends(student_role_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a list of all pending projects that the student is technically eligible to apply for based on their current skills.
    """
    svc = StudentService(db)
    projects = svc.get_eligible_projects(current_user.user_id)
    return success_response(data=projects, message=f"Found {len(projects)} eligible projects.")
