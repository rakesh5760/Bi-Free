from typing import List
from fastapi import Depends, HTTPException, status
from app.models.user import User
from app.auth.deps import get_current_user

class RoleChecker:
    """
    Dependency class to strictly enforce role-based access control on endpoints.
    Usage:
        @router.get("/admin-only", dependencies=[Depends(RoleChecker(["Admin"]))])
    """
    def __init__(self, allowed_roles: List[str]):
        # Store roles in lowercase for case-insensitive matching
        self.allowed_roles = [role.lower() for role in allowed_roles]

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if not current_user.role or current_user.role.role_name.lower() not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action"
            )
        return current_user
