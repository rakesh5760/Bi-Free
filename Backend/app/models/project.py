from sqlalchemy import Column, Integer, String, Text, Numeric, Date, ForeignKey, Enum, Table
from sqlalchemy.orm import relationship
from app.database.session import Base
from app.database.mixins import TimestampMixin, SoftDeleteMixin
import enum

class ProjectStatus(str, enum.Enum):
    PENDING = "Pending"
    ASSIGNED = "Assigned"
    IN_PROGRESS = "In Progress"
    MENTOR_QA = "Mentor QA"
    COMPLETED = "Completed"

class TaskStatus(str, enum.Enum):
    TO_DO = "To Do"
    IN_PROGRESS = "In Progress"
    REVIEW = "Review"
    DONE = "Done"

class TaskPriority(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class SubmissionStatus(str, enum.Enum):
    PENDING = "Pending"
    MENTOR_APPROVED = "Mentor Approved"
    CLIENT_REVIEWED = "Client Reviewed"
    REJECTED = "Rejected"

project_skills = Table(
    "project_skills",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.skill_id", ondelete="CASCADE"), primary_key=True)
)

class Project(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("client_profiles.profile_id"), nullable=False, index=True)
    domain_id = Column(Integer, ForeignKey("domains.domain_id"), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    budget = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PENDING, index=True)
    deadline = Column(Date)

    client = relationship("ClientProfile", back_populates="projects")
    domain = relationship("Domain")
    required_skills = relationship("Skill", secondary=project_skills)
    allocation = relationship("ProjectAllocation", back_populates="project", uselist=False, cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    qa_submissions = relationship("QualityAssuranceSubmission", back_populates="project", cascade="all, delete-orphan")


class ProjectAllocation(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "project_allocations"

    allocation_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    mentor_id = Column(Integer, ForeignKey("mentor_profiles.profile_id"), nullable=False, index=True)
    team_name = Column(String(100), nullable=False)

    project = relationship("Project", back_populates="allocation")
    mentor = relationship("MentorProfile", back_populates="allocations")
    team_members = relationship("TeamMember", back_populates="allocation", cascade="all, delete-orphan")

    @property
    def mentor_name(self) -> str:
        if self.mentor and self.mentor.user:
            return f"{self.mentor.user.first_name} {self.mentor.user.last_name}"
        return "Unknown"

    @property
    def mentor_email(self) -> str:
        if self.mentor and self.mentor.user:
            return self.mentor.user.email
        return "NIL"
        
    @property
    def mentor_phone(self) -> str:
        if self.mentor and self.mentor.user and self.mentor.user.phone_number:
            return self.mentor.user.phone_number
        return "NIL"



class TeamMember(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "team_members"

    team_member_id = Column(Integer, primary_key=True, index=True)
    allocation_id = Column(Integer, ForeignKey("project_allocations.allocation_id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.profile_id"), nullable=False, index=True)
    role = Column(String(100))

    allocation = relationship("ProjectAllocation", back_populates="team_members")
    student = relationship("StudentProfile", back_populates="team_memberships")

    @property
    def student_name(self) -> str:
        if self.student and self.student.user:
            return f"{self.student.user.first_name} {self.student.user.last_name}"
        return "Unknown"

    @property
    def student_email(self) -> str:
        if self.student and self.student.user:
            return self.student.user.email
        return "NIL"
        
    @property
    def student_phone(self) -> str:
        if self.student and self.student.user and self.student.user.phone_number:
            return self.student.user.phone_number
        return "NIL"



class Task(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_to = Column(Integer, ForeignKey("student_profiles.profile_id"), index=True)
    title = Column(String(255), nullable=False)
    status = Column(Enum(TaskStatus), default=TaskStatus.TO_DO, index=True)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    github_pr_url = Column(String(255))

    project = relationship("Project", back_populates="tasks")
    assigned_student = relationship("StudentProfile", back_populates="assigned_tasks")


class QualityAssuranceSubmission(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "quality_assurance_submissions"

    submission_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False, index=True)
    submitted_by = Column(Integer, ForeignKey("student_profiles.profile_id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    status = Column(Enum(SubmissionStatus), default=SubmissionStatus.PENDING, index=True)
    asset_url = Column(String(255))

    project = relationship("Project", back_populates="qa_submissions")
    submitted_student = relationship("StudentProfile", back_populates="qa_submissions")
