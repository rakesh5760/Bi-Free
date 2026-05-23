from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app import schemas
from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.utils.responses import success_response, StandardResponse, PaginatedResponse
from app.services.client_service import ClientService
from app.schemas.project import Project, ProjectCreate, ProjectRevokeRequest

router = APIRouter()

client_checker = RoleChecker(["Client"])

@router.post("/me/projects", response_model=StandardResponse[Project])
def post_project(
    request: ProjectCreate,
    current_user: User = Depends(client_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Client posts a new project requirement.
    """
    svc = ClientService(db)
    project = svc.create_project(current_user.user_id, request)
    return success_response(data=project, message="Project posted successfully. Awaiting faculty allocation.")

@router.get("/me/projects", response_model=PaginatedResponse[Project])
def get_my_projects(
    search: Optional[str] = Query(None, description="Search by project title"),
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    current_user: User = Depends(client_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Client fetches all their posted projects to track status.
    """
    svc = ClientService(db)
    data = svc.get_my_projects(current_user.user_id, page, size, search)
    return PaginatedResponse(data=data)

class ApproveQARequest(BaseModel):
    approve: bool

@router.post("/qa-submissions/{submission_id}/review", response_model=StandardResponse[Any])
def client_review_qa(
    submission_id: int,
    request: ApproveQARequest,
    current_user: User = Depends(client_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Client performs the final stage approval on a QA submission to move project to COMPLETED.
    """
    svc = ClientService(db)
    submission = svc.approve_qa_submission(current_user.user_id, submission_id, request.approve)
    return success_response(data=submission, message="Client QA review completed.")

@router.post("/me/projects/{project_id}/revoke", response_model=StandardResponse[Project])
def revoke_project(
    project_id: int,
    request: ProjectRevokeRequest,
    current_user: User = Depends(client_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Client revokes a pending project.
    """
    svc = ClientService(db)
    project = svc.revoke_project(current_user.user_id, project_id, request.reason)
    return success_response(data=project, message="Project has been revoked.")
