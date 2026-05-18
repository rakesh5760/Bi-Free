from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, JSON, Table
from sqlalchemy.orm import relationship
from app.database.session import Base
from app.database.mixins import TimestampMixin, SoftDeleteMixin
import enum

class ResourceType(str, enum.Enum):
    VIDEO = "Video"
    ARTICLE = "Article"
    COURSE = "Course"
    DOCUMENTATION = "Documentation"

class ProgressStatus(str, enum.Enum):
    NOT_STARTED = "Not Started"
    IN_PROGRESS = "In Progress"
    PENDING_REVIEW = "Pending Review"
    COMPLETED = "Completed"
    REJECTED = "Rejected"

class AssignmentType(str, enum.Enum):
    GITHUB_PR = "GitHub PR"
    FILE_UPLOAD = "File Upload"
    EXTERNAL_LINK = "External Link"

milestone_resources = Table(
    "milestone_resources",
    Base.metadata,
    Column("milestone_id", Integer, ForeignKey("milestones.milestone_id", ondelete="CASCADE"), primary_key=True),
    Column("resource_id", Integer, ForeignKey("learning_resources.resource_id", ondelete="CASCADE"), primary_key=True)
)

class LearningResource(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "learning_resources"
    resource_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    resource_type = Column(Enum(ResourceType), default=ResourceType.DOCUMENTATION)
    domain_id = Column(Integer, ForeignKey("domains.domain_id"), nullable=False, index=True)
    level_id = Column(Integer, ForeignKey("levels.level_id"), nullable=False, index=True)

    domain = relationship("Domain")
    level = relationship("Level")


class LearningPath(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "learning_paths"
    path_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    domain_id = Column(Integer, ForeignKey("domains.domain_id"), nullable=False, index=True)
    
    domain = relationship("Domain")
    milestones = relationship("Milestone", back_populates="learning_path", cascade="all, delete-orphan")


class Milestone(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "milestones"
    milestone_id = Column(Integer, primary_key=True, index=True)
    path_id = Column(Integer, ForeignKey("learning_paths.path_id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    order_index = Column(Integer, default=0)

    learning_path = relationship("LearningPath", back_populates="milestones")
    resources = relationship("LearningResource", secondary=milestone_resources)
    assignments = relationship("Assignment", back_populates="milestone", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="milestone", cascade="all, delete-orphan")


class Assignment(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "assignments"
    assignment_id = Column(Integer, primary_key=True, index=True)
    milestone_id = Column(Integer, ForeignKey("milestones.milestone_id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assignment_type = Column(Enum(AssignmentType), default=AssignmentType.GITHUB_PR)
    
    milestone = relationship("Milestone", back_populates="assignments")


class Quiz(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "quizzes"
    quiz_id = Column(Integer, primary_key=True, index=True)
    milestone_id = Column(Integer, ForeignKey("milestones.milestone_id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    passing_score = Column(Integer, default=80)
    questions = Column(JSON) # JSON array of { question: str, options: list[str], correct_index: int }
    
    milestone = relationship("Milestone", back_populates="quizzes")


class StudentProgress(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "student_progress"
    progress_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.profile_id", ondelete="CASCADE"), nullable=False, index=True)
    item_id = Column(Integer, nullable=False, index=True) # polymorphic ID (assignment_id, quiz_id, or path_id depending on type)
    item_type = Column(String(50), nullable=False, index=True) # "Assignment", "Quiz", "LearningPath"
    status = Column(Enum(ProgressStatus), default=ProgressStatus.NOT_STARTED, index=True)
    score = Column(Integer, nullable=True) # For quizzes
    submission_url = Column(String(500), nullable=True) # For assignments
    feedback = Column(Text, nullable=True) # Mentor feedback
    
    student = relationship("StudentProfile")
