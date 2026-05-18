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
from app.schemas.project import Project, Task, ProjectStatus

router = APIRouter()

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
