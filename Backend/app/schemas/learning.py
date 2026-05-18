from typing import Optional, List, Any
from pydantic import BaseModel, HttpUrl
from datetime import datetime
from enum import Enum
from app.schemas.core import Domain, TimestampSchema
from app.models.learning import ResourceType, ProgressStatus, AssignmentType

# Learning Resource
class LearningResourceBase(BaseModel):
    title: str
    url: str
    resource_type: ResourceType = ResourceType.DOCUMENTATION

class LearningResourceCreate(LearningResourceBase):
    domain_id: int
    level_id: int

class LearningResource(LearningResourceBase, TimestampSchema):
    resource_id: int
    domain_id: int
    level_id: int
    class Config:
        from_attributes = True

# Assignment
class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    assignment_type: AssignmentType = AssignmentType.GITHUB_PR

class AssignmentCreate(AssignmentBase):
    milestone_id: int

class Assignment(AssignmentBase, TimestampSchema):
    assignment_id: int
    milestone_id: int
    class Config:
        from_attributes = True

# Quiz
class QuizBase(BaseModel):
    title: str
    passing_score: int = 80

class QuizCreate(QuizBase):
    milestone_id: int
    questions: List[Any]

class Quiz(QuizBase, TimestampSchema):
    quiz_id: int
    milestone_id: int
    questions: List[Any]
    class Config:
        from_attributes = True

# Milestone
class MilestoneBase(BaseModel):
    title: str
    order_index: int = 0

class MilestoneCreate(MilestoneBase):
    path_id: int
    resource_ids: List[int] = []

class Milestone(MilestoneBase, TimestampSchema):
    milestone_id: int
    path_id: int
    resources: List[LearningResource] = []
    assignments: List[Assignment] = []
    quizzes: List[Quiz] = []
    class Config:
        from_attributes = True

# Learning Path
class LearningPathBase(BaseModel):
    title: str
    description: Optional[str] = None

class LearningPathCreate(LearningPathBase):
    domain_id: int

class LearningPath(LearningPathBase, TimestampSchema):
    path_id: int
    domain_id: int
    domain: Optional[Domain] = None
    milestones: List[Milestone] = []
    class Config:
        from_attributes = True

# Student Progress
class StudentProgressBase(BaseModel):
    item_id: int
    item_type: str
    status: ProgressStatus = ProgressStatus.IN_PROGRESS
    score: Optional[int] = None
    submission_url: Optional[str] = None

class StudentProgressCreate(StudentProgressBase):
    pass

class StudentProgress(StudentProgressBase, TimestampSchema):
    progress_id: int
    student_id: int
    feedback: Optional[str] = None
    class Config:
        from_attributes = True
