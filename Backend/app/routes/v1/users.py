from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas
from app.auth.deps import get_current_user
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.utils.responses import success_response, StandardResponse

router = APIRouter()

@router.get("/me", response_model=StandardResponse[schemas.User])
def read_user_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user.
    """
    return success_response(data=schemas.User.model_validate(current_user))

@router.get("/admin-dashboard", response_model=StandardResponse)
def read_admin_dashboard(
    current_user: User = Depends(RoleChecker(["Admin", "Faculty"]))
) -> Any:
    """
    Get admin dashboard data. Strictly restricted to Admins and Faculty.
    """
    return success_response(
        message=f"Welcome to the restricted dashboard, {current_user.first_name}!",
        data={"secret_data": "This is highly classified institutional data."}
    )
