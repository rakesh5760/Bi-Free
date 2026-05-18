from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database.session import Base
from app.database.mixins import TimestampMixin, SoftDeleteMixin
import enum



class Domain(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "domains"

    domain_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text)

    skills = relationship("Skill", back_populates="domain", cascade="all, delete-orphan")
    # relationships to mentor/client profiles and projects will be established in their respective models


class Skill(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "skills"

    skill_id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey("domains.domain_id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)

    domain = relationship("Domain", back_populates="skills")
    # relationships to student_skills and project_skills will be established via association tables


class Level(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "levels"

    level_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)  # e.g. "Level D", "Level A"
    description = Column(Text)
    required_trust_score = Column(Numeric(5, 2), default=0.00)

    required_trust_score = Column(Numeric(5, 2), default=0.00)

    # relationship to StudentProfile will be established in profile.py



