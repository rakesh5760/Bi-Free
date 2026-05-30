from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app import schemas
from app.auth.deps import get_current_user, get_db
from app.auth.permissions import RoleChecker
from app.models.user import User
from app.utils.responses import success_response, StandardResponse, PaginatedResponse
from app.services.faculty_service import FacultyService
from app.schemas.profile import StudentProfile
from app.schemas.project import ProjectAllocation, TeamMember

router = APIRouter()

# Restrict to Faculty and Admin
faculty_checker = RoleChecker(["Faculty", "Admin"])

@router.get("/students/level-a", response_model=PaginatedResponse[StudentProfile])
def get_level_a_students(
    domain_id: Optional[int] = Query(None, description="Filter by Domain ID"),
    search: Optional[str] = Query(None, description="Search by student name"),
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    current_user: User = Depends(faculty_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Search for exclusively Level A students, optionally filtered by a specific domain.
    """
    svc = FacultyService(db)
    data = svc.get_eligible_level_a_students(domain_id, page, size, search)
    return PaginatedResponse(data=data)

class AllocateMentorRequest(BaseModel):
    mentor_id: int

@router.post("/projects/{project_id}/allocate-mentor", response_model=StandardResponse[ProjectAllocation])
def allocate_mentor(
    project_id: int,
    request: AllocateMentorRequest,
    current_user: User = Depends(faculty_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Bind a Mentor to a Client Project.
    """
    svc = FacultyService(db)
    allocation = svc.allocate_mentor_to_project(project_id, request.mentor_id)
    return success_response(data=allocation, message="Mentor allocated successfully.")

class AddTeamMemberRequest(BaseModel):
    student_id: int

@router.post("/allocations/{allocation_id}/add-student", response_model=StandardResponse[TeamMember])
def add_student_to_team(
    allocation_id: int,
    request: AddTeamMemberRequest,
    current_user: User = Depends(faculty_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Assign a Level A student to a project allocation team.
    """
    svc = FacultyService(db)
    team_member = svc.add_student_to_team(allocation_id, request.student_id)
    return success_response(data=team_member, message="Student added to team.")

@router.delete("/allocations/{allocation_id}", response_model=StandardResponse)
def revoke_allocation(
    allocation_id: int,
    current_user: User = Depends(faculty_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Revoke an entire project allocation.
    """
    svc = FacultyService(db)
    res = svc.revoke_project_allocation(allocation_id)
    return success_response(message=res["message"])

@router.delete("/allocations/{allocation_id}/students/{student_id}", response_model=StandardResponse)
def remove_student(
    allocation_id: int,
    student_id: int,
    current_user: User = Depends(faculty_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Remove a student from a team.
    """
    svc = FacultyService(db)
    res = svc.remove_student_from_team(allocation_id, student_id)
    return success_response(message=res["message"])

class StudentOverrideRequest(BaseModel):
    level_id: int
    domain_id: Optional[int] = None
    reason: Optional[str] = None

@router.put("/students/{user_id}/override", response_model=StandardResponse)
def override_student_profile(
    user_id: int,
    request: StudentOverrideRequest,
    current_user: User = Depends(faculty_checker),
    db: Session = Depends(get_db)
) -> Any:
    """
    Directly update a student's level and domain.
    """
    svc = FacultyService(db)
    svc.override_student_profile(user_id, request.level_id, request.domain_id, request.reason)
    return success_response(message="Student profile overridden successfully.")
