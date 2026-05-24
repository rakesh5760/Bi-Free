from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app import schemas
from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.utils.responses import success_response, StandardResponse, PaginatedResponse
from app.services.mentor_service import MentorService
from app.schemas.project import Project, ProjectAllocation, TeamMember, Task

router = APIRouter()

# Restrict to Mentor (and Admin/Faculty)
mentor_checker = RoleChecker(["Mentor", "Faculty", "Admin"])

@router.get("/projects/global", response_model=PaginatedResponse[Project])
def get_global_projects(
    search: Optional[str] = Query(None, description="Search by project title"),
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    View all incoming client projects globally.
    """
    svc = MentorService(db)
    data = svc.get_global_projects(page, size, search)
    return PaginatedResponse(data=data)

@router.get("/allocations/me", response_model=StandardResponse[List[Project]])
def get_my_allocations(
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get all project allocations explicitly assigned to this mentor.
    """
    svc = MentorService(db)
    allocations = svc.get_my_allocations(current_user.user_id)
    return success_response(data=allocations, message=f"Found {len(allocations)} allocations.")

class RecruitStudentRequest(BaseModel):
    student_id: int

@router.post("/allocations/{allocation_id}/recruit", response_model=StandardResponse[TeamMember])
def recruit_student(
    allocation_id: int,
    request: RecruitStudentRequest,
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Mentor recruits a Level A student to their assigned team.
    """
    svc = MentorService(db)
    team_member = svc.recruit_student_to_team(current_user.user_id, allocation_id, request.student_id)
    return success_response(data=team_member, message="Student recruited to team.")

class CreateTaskRequest(BaseModel):
    title: str
    student_id: int

@router.post("/projects/{project_id}/tasks", response_model=StandardResponse[Task])
def delegate_task(
    project_id: int,
    request: CreateTaskRequest,
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Delegate a task strictly to an existing team member on a project managed by this mentor.
    """
    svc = MentorService(db)
    task = svc.create_task_for_team(current_user.user_id, project_id, request.title, request.student_id)
    return success_response(data=task, message="Task delegated successfully.")
