from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database.session import Base
from app.database.mixins import TimestampMixin, SoftDeleteMixin

student_skills = Table(
    "student_skills",
    Base.metadata,
    Column("student_id", Integer, ForeignKey("student_profiles.profile_id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.skill_id", ondelete="CASCADE"), primary_key=True)
)

class StudentProfile(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "student_profiles"

    profile_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    level_id = Column(Integer, ForeignKey("levels.level_id"), nullable=True, index=True)
    domain_id = Column(Integer, ForeignKey("domains.domain_id"), nullable=True, index=True)
    trust_score = Column(Numeric(5, 2), default=0.00)
    github_handle = Column(String(100))
    portfolio_url = Column(String(255))
    override_reason = Column(String(500), nullable=True)
    level_overridden = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="student_profile")
    level = relationship("Level")
    domain = relationship("Domain")
    skills = relationship("Skill", secondary=student_skills)
    team_memberships = relationship("TeamMember", back_populates="student")
    assigned_tasks = relationship("Task", back_populates="assigned_student")
    qa_submissions = relationship("QualityAssuranceSubmission", back_populates="submitted_student")

    @property
    def first_name(self) -> str:
        return self.user.first_name if self.user else ""

    @property
    def last_name(self) -> str:
        return self.user.last_name if self.user else ""
        
    @property
    def email(self) -> str:
        return self.user.email if self.user else ""



class MentorProfile(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "mentor_profiles"

    profile_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    domain_id = Column(Integer, ForeignKey("domains.domain_id"), nullable=True, index=True)
    rating = Column(Numeric(3, 2), default=0.00)
    total_reviews = Column(Integer, default=0)

    user = relationship("User", back_populates="mentor_profile")
    domain = relationship("Domain")
    allocations = relationship("ProjectAllocation", back_populates="mentor")


class ClientProfile(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "client_profiles"

    profile_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    domain_id = Column(Integer, ForeignKey("domains.domain_id"), nullable=True, index=True)
    company_name = Column(String(255), nullable=False)
    total_spent = Column(Numeric(10, 2), default=0.00)

    user = relationship("User", back_populates="client_profile")
    domain = relationship("Domain")
    projects = relationship("Project", back_populates="client")


class FacultyProfile(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "faculty_profiles"

    profile_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    department = Column(String(100))

    user = relationship("User", back_populates="faculty_profile")


class AdminProfile(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "admin_profiles"

    profile_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    department = Column(String(100))

    user = relationship("User", back_populates="admin_profile")
