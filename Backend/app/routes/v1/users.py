from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.models.profile import StudentProfile, MentorProfile, ClientProfile, FacultyProfile
from app.models.project import TeamMember, ProjectAllocation
from app.schemas.user import UserProfileUpdate, UserProfileResponse, AdminUserDetail, AdminUsersResponse, UpdatePasswordRequest
from app.utils.responses import success_response, StandardResponse
from app.auth import security

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


@router.post("/me/password", response_model=StandardResponse)
def update_password(
    payload: UpdatePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Update current user password."""
    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="New passwords do not match")
        
    if payload.old_password == payload.new_password:
        raise HTTPException(status_code=400, detail="New password cannot be the same as the old password")
    
    if not security.verify_password(payload.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect old password")
        
    current_user.password_hash = security.get_password_hash(payload.new_password)
    db.commit()
    
    return success_response(message="Password updated successfully.")


@router.get("/admin-dashboard", response_model=StandardResponse)
def read_admin_dashboard(
    current_user: User = Depends(RoleChecker(["Admin", "Faculty"]))
) -> Any:
    """Get admin dashboard data. Strictly restricted to Admins and Faculty."""
    return success_response(
        message=f"Welcome to the restricted dashboard, {current_user.first_name}!",
        data={"secret_data": "This is highly classified institutional data."}
    )


@router.get("/admin/users", response_model=StandardResponse[AdminUsersResponse])
def get_admin_users(
    current_user: User = Depends(RoleChecker(["Admin", "Faculty"])),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get detailed user directories grouped by role. Restricted to Admin and Faculty.
    """
    # Query all users with roles and profile relationships
    users = db.query(User).all()
    
    students_list = []
    mentors_list = []
    faculty_list = []
    clients_list = []
    
    for u in users:
        role_name = u.role.role_name if u.role else "Unknown"
        
        # Build base admin user detail
        detail = {
            "user_id": u.user_id,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "email": u.email,
            "role": role_name,
            "created_at": u.created_at,
            "is_active": u.is_active,
            "details": {}
        }
        
        if role_name == "Student":
            sp = u.student_profile
            level_name = sp.level.name if sp and sp.level else "Unknown"
            trust_score = float(sp.trust_score) if sp else 0.0
            detail["details"] = {
                "level": level_name.replace("Level ", "") if level_name.startswith("Level ") else level_name,
                "trust_score": trust_score,
                "github_handle": sp.github_handle if sp else None,
                "portfolio_url": sp.portfolio_url if sp else None,
                "joined": u.created_at.strftime("%b %Y") if u.created_at else "Unknown"
            }
            students_list.append(detail)
            
        elif role_name == "Mentor":
            mp = u.mentor_profile
            rating = float(mp.rating) if mp else 0.0
            
            # count students assigned to mentor
            student_count = 0
            if mp:
                student_count = db.query(TeamMember).join(ProjectAllocation).filter(
                    ProjectAllocation.mentor_id == mp.profile_id
                ).count()
                
            detail["details"] = {
                "rating": rating,
                "students": student_count,
                "domain": mp.domain.name if mp and mp.domain else "Unknown",
                "joined": u.created_at.strftime("%b %Y") if u.created_at else "Unknown"
            }
            mentors_list.append(detail)
            
        elif role_name == "Faculty":
            fp = u.faculty_profile
            detail["details"] = {
                "department": fp.department if fp else "General",
                "joined": u.created_at.strftime("%b %Y") if u.created_at else "Unknown"
            }
            faculty_list.append(detail)
            
        elif role_name == "Client":
            cp = u.client_profile
            detail["details"] = {
                "company_name": cp.company_name if cp else "Freelance",
                "domain": cp.domain.name if cp and cp.domain else "Unknown",
                "total_spent": float(cp.total_spent) if cp else 0.0,
                "joined": u.created_at.strftime("%b %Y") if u.created_at else "Unknown"
            }
            clients_list.append(detail)
            
    response_data = AdminUsersResponse(
        students=students_list,
        mentors=mentors_list,
        faculty=faculty_list,
        clients=clients_list
    )
    return success_response(
        data=response_data,
        message="User directories retrieved successfully."
    )

