from typing import Optional, List
from pydantic import BaseModel
from datetime import date, datetime
from enum import Enum
from app.schemas.core import Skill, Domain

class ProjectStatus(str, Enum):
    PENDING = "Pending"
    ASSIGNED = "Assigned"
    IN_PROGRESS = "In Progress"
    MENTOR_QA = "Mentor QA"
    COMPLETED = "Completed"
    REVOKED = "Revoked"

class TaskStatus(str, Enum):
    TO_DO = "To Do"
    IN_PROGRESS = "In Progress"
    REVIEW = "Review"
    DONE = "Done"

class SubmissionStatus(str, Enum):
    PENDING = "Pending"
    MENTOR_APPROVED = "Mentor Approved"
    CLIENT_REVIEWED = "Client Reviewed"
    REJECTED = "Rejected"

class TaskPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

# Task
class TaskBase(BaseModel):
    title: str
    status: TaskStatus = TaskStatus.TO_DO
    priority: TaskPriority = TaskPriority.MEDIUM
    github_pr_url: Optional[str] = None

class TaskCreate(TaskBase):
    project_id: int
    assigned_to: Optional[int] = None

class Task(TaskBase):
    task_id: int
    project_id: int
    assigned_to: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Project
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    budget: float
    status: ProjectStatus = ProjectStatus.PENDING
    deadline: Optional[date] = None
    revocation_reason: Optional[str] = None

class ProjectCreate(ProjectBase):
    client_id: int
    domain_id: Optional[int] = None
    skill_ids: Optional[List[int]] = None

class ProjectRevokeRequest(BaseModel):
    reason: str

class Project(ProjectBase):
    project_id: int
    client_id: int
    domain: Optional[Domain] = None
    required_skills: List[Skill] = []
    created_at: datetime
    updated_at: datetime
    tasks: List[Task] = []
    allocation: Optional["ProjectAllocation"] = None
    qa_submissions: List["QualityAssuranceSubmission"] = []
    class Config:
        from_attributes = True

# Quality Assurance Submission
class QualityAssuranceSubmissionBase(BaseModel):
    title: str
    status: SubmissionStatus = SubmissionStatus.PENDING
    asset_url: Optional[str] = None

class QualityAssuranceSubmissionCreate(QualityAssuranceSubmissionBase):
    project_id: int
    submitted_by: int

class QualityAssuranceSubmission(QualityAssuranceSubmissionBase):
    submission_id: int
    project_id: int
    submitted_by: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Team Member
class TeamMemberBase(BaseModel):
    pass

class TeamMemberCreate(TeamMemberBase):
    allocation_id: int
    student_id: int

class TeamMember(TeamMemberBase):
    team_member_id: int
    allocation_id: int
    student_id: int
    student_name: Optional[str] = None
    student_email: Optional[str] = None
    student_phone: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Project Allocation
class ProjectAllocationBase(BaseModel):
    pass

class ProjectAllocationCreate(ProjectAllocationBase):
    project_id: int
    mentor_id: int

class ProjectAllocation(ProjectAllocationBase):
    allocation_id: int
    project_id: int
    mentor_id: int
    team_name: str
    mentor_name: Optional[str] = None
    mentor_email: Optional[str] = None
    mentor_phone: Optional[str] = None
    team_members: List[TeamMember] = []
    created_at: datetime
    class Config:
        from_attributes = True
