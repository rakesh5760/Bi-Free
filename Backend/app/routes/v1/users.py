from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.models.profile import StudentProfile
from app.schemas.user import UserProfileUpdate, UserProfileResponse
from app.utils.responses import success_response, StandardResponse

router = APIRouter()


def _build_profile_response(user: User) -> UserProfileResponse:
    """Build a unified UserProfileResponse from a User ORM object."""
    student_profile = getattr(user, "student_profile", None)
    level_name = None
    if student_profile and student_profile.level:
        level_name = student_profile.level.name  # e.g. "Level A"

    return UserProfileResponse(
        user_id=user.user_id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone_number=getattr(user, "phone_number", None),
        role=user.role.role_name if user.role else "",
        github_handle=student_profile.github_handle if student_profile else None,
        portfolio_url=student_profile.portfolio_url if student_profile else None,
        trust_score=float(student_profile.trust_score) if student_profile else None,
        student_level=level_name,
    )


@router.get("/me", response_model=StandardResponse[schemas.User])
def read_user_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get current user (raw — used by auth flow)."""
    return success_response(data=schemas.User.model_validate(current_user))


@router.get("/me/profile", response_model=StandardResponse[UserProfileResponse])
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get the current user's full profile including student-specific fields.
    Works for all roles; student-specific fields are None for non-students.
    """
    return success_response(
        data=_build_profile_response(current_user),
        message="Profile retrieved successfully."
    )


@router.put("/me/profile", response_model=StandardResponse[UserProfileResponse])
def update_user_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update the current user's profile. Accepts name, phone, and (for students)
    GitHub handle and portfolio URL.
    """
    # Update User fields
    if payload.first_name is not None:
        current_user.first_name = payload.first_name
    if payload.last_name is not None:
        current_user.last_name = payload.last_name
    if payload.phone_number is not None:
        current_user.phone_number = payload.phone_number

    # Update StudentProfile fields (only if the user has a student profile)
    student_profile = getattr(current_user, "student_profile", None)
    if student_profile:
        if payload.github_handle is not None:
            student_profile.github_handle = payload.github_handle
        if payload.portfolio_url is not None:
            student_profile.portfolio_url = payload.portfolio_url
        db.add(student_profile)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return success_response(
        data=_build_profile_response(current_user),
        message="Profile updated successfully."
    )


@router.get("/admin-dashboard", response_model=StandardResponse)
def read_admin_dashboard(
    current_user: User = Depends(RoleChecker(["Admin", "Faculty"]))
) -> Any:
    """Get admin dashboard data. Strictly restricted to Admins and Faculty."""
    return success_response(
        message=f"Welcome to the restricted dashboard, {current_user.first_name}!",
        data={"secret_data": "This is highly classified institutional data."}
    )
