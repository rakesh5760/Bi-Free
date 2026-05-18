from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.utils.responses import success_response, StandardResponse
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import StudentAnalytics, MentorAnalytics, AdminAnalytics

router = APIRouter()

student_checker = RoleChecker(["Student"])
mentor_checker = RoleChecker(["Mentor"])
admin_checker = RoleChecker(["Admin", "Faculty"])

@router.get("/student/me", response_model=StandardResponse[StudentAnalytics])
def get_student_metrics(
    current_user: User = Depends(student_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get personal dashboard analytics for a student.
    """
    svc = AnalyticsService(db)
    data = svc.get_student_analytics(current_user.user_id)
    return success_response(data=data)

@router.get("/mentor/me", response_model=StandardResponse[MentorAnalytics])
def get_mentor_metrics(
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get personal dashboard analytics for a mentor.
    """
    svc = AnalyticsService(db)
    data = svc.get_mentor_analytics(current_user.user_id)
    return success_response(data=data)

@router.get("/institutional", response_model=StandardResponse[AdminAnalytics])
def get_institutional_metrics(
    current_user: User = Depends(admin_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get global platform analytics for admins/faculty.
    """
    svc = AnalyticsService(db)
    data = svc.get_admin_analytics()
    return success_response(data=data)
