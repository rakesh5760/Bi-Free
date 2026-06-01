from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.schemas.core import Skill, Level, Domain

class ProfileTimestamp(BaseModel):
    created_at: datetime
    updated_at: datetime

# Student Profile
class StudentProfileBase(BaseModel):
    trust_score: float = 0.0
    github_handle: Optional[str] = None
    portfolio_url: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    user_id: int
    level_id: Optional[int] = None
    skill_ids: Optional[List[int]] = None

class StudentProfile(StudentProfileBase, ProfileTimestamp):
    profile_id: int
    user_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    level: Optional[Level] = None
    domain: Optional[Domain] = None
    skills: List[Skill] = []
    class Config:
        from_attributes = True

class StudentSkillUpdate(BaseModel):
    skill_ids: List[int]

# Mentor Profile
class MentorProfileBase(BaseModel):
    rating: float = 0.0
    total_reviews: int = 0

class MentorProfileCreate(MentorProfileBase):
    user_id: int
    domain_id: Optional[int] = None

class MentorProfile(MentorProfileBase, ProfileTimestamp):
    profile_id: int
    user_id: int
    domain: Optional[Domain] = None
    class Config:
        from_attributes = True

# Client Profile
class ClientProfileBase(BaseModel):
    company_name: str
    total_spent: float = 0.0

class ClientProfileCreate(ClientProfileBase):
    user_id: int
    domain_id: Optional[int] = None

class ClientProfile(ClientProfileBase, ProfileTimestamp):
    profile_id: int
    user_id: int
    domain: Optional[Domain] = None
    class Config:
        from_attributes = True
