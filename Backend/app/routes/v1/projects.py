from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app import schemas
from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.utils.responses import success_response, StandardResponse
from app.services.project_service import ProjectService
from app.schemas.project import Project, Task, ProjectStatus, TaskStatus, TaskPriority

router = APIRouter()

@router.get("/assigned", response_model=StandardResponse[List[Project]])
def get_assigned_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get all projects assigned to the current user."""
    svc = ProjectService(db)
    projects = svc.get_assigned_projects(current_user.user_id, current_user.role.role_name)
    return success_response(data=projects)

@router.get("/{project_id}", response_model=StandardResponse[Project])
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get project details including tasks."""
    svc = ProjectService(db)
    project = svc.get_project(project_id)
    return success_response(data=project)

class CreateTaskRequest(BaseModel):
    title: str
    priority: TaskPriority

@router.post("/{project_id}/tasks", response_model=StandardResponse[Task])
def create_project_task(
    project_id: int,
    request: CreateTaskRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Create a new task in a project."""
    svc = ProjectService(db)
    task = svc.create_task(project_id, request.title, request.priority)
    return success_response(data=task, message="Task created successfully.")

class UpdateTaskStatusRequest(BaseModel):
    status: TaskStatus

@router.patch("/tasks/{task_id}/status", response_model=StandardResponse[Task])
def update_task_status(
    task_id: int,
    request: UpdateTaskStatusRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update a task's status (e.g. move from TO_DO to IN_PROGRESS)."""
    svc = ProjectService(db)
    task = svc.update_task_status(task_id, request.status)
    return success_response(data=task, message=f"Task moved to {request.status}.")

student_checker = RoleChecker(["Student"])
mentor_checker = RoleChecker(["Mentor", "Faculty", "Admin"])

class SubmitTaskRequest(BaseModel):
    github_pr_url: str

@router.patch("/tasks/{task_id}/submit", response_model=StandardResponse[Task])
def submit_task(
    task_id: int,
    request: SubmitTaskRequest,
    current_user: User = Depends(student_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Student submits a task by providing a GitHub PR URL.
    """
    svc = ProjectService(db)
    task = svc.student_submit_task(current_user.user_id, task_id, request.github_pr_url)
    return success_response(data=task, message="Task submitted for review.")

class MentorReviewTaskRequest(BaseModel):
    approve: bool

@router.post("/tasks/{task_id}/review", response_model=StandardResponse[Task])
def mentor_review_task(
    task_id: int,
    request: MentorReviewTaskRequest,
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Mentor approves or rejects a task PR.
    """
    svc = ProjectService(db)
    task = svc.mentor_review_task(current_user.user_id, task_id, request.approve)
    return success_response(data=task, message="Task reviewed.")

class QASubmissionRequest(BaseModel):
    title: str
    asset_url: str

@router.post("/{project_id}/qa-submissions", response_model=StandardResponse[Any])
def submit_qa_milestone(
    project_id: int,
    request: QASubmissionRequest,
    current_user: User = Depends(student_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Student submits a major milestone asset.
    """
    svc = ProjectService(db)
    sub = svc.student_submit_qa(current_user.user_id, project_id, request.title, request.asset_url)
    return success_response(data=sub, message="QA milestone submitted.")

class MentorReviewQARequest(BaseModel):
    approve: bool

@router.post("/qa-submissions/{submission_id}/mentor-review", response_model=StandardResponse[Any])
def mentor_review_qa(
    submission_id: int,
    request: MentorReviewQARequest,
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Mentor performs Stage 1 approval of a QA milestone.
    """
    svc = ProjectService(db)
    sub = svc.mentor_review_qa(current_user.user_id, submission_id, request.approve)
    return success_response(data=sub, message="Mentor QA review completed.")

class ProjectTransitionRequest(BaseModel):
    status: ProjectStatus

@router.post("/{project_id}/transition", response_model=StandardResponse[Project])
def transition_project(
    project_id: int,
    request: ProjectTransitionRequest,
    current_user: User = Depends(mentor_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Mentor manually advances the Project Status (e.g., IN_PROGRESS to MENTOR_QA).
    """
    svc = ProjectService(db)
    proj = svc.mentor_transition_project(current_user.user_id, project_id, request.status)
    return success_response(data=proj, message=f"Project transitioned to {request.status}.")
