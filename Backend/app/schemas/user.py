from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.schemas.profile import StudentProfile, MentorProfile, ClientProfile

class RoleBase(BaseModel):
    role_id: int
    role_name: str

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = True

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: str
    phone_number: Optional[str] = None
    domain: Optional[str] = None
    company_name: Optional[str] = None
    level: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    role_id: int

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    user_id: int
    role_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class User(UserInDBBase):
    role: RoleBase
    student_profile: Optional[StudentProfile] = None
    mentor_profile: Optional[MentorProfile] = None
    client_profile: Optional[ClientProfile] = None

class UserInDB(UserInDBBase):
    password_hash: str

# ── Profile update / response schemas ────────────────────────
class UserProfileUpdate(BaseModel):
    """Fields a user can update on their own profile."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    # Student-specific (ignored for non-students)
    github_handle: Optional[str] = None
    portfolio_url: Optional[str] = None

class UpdatePasswordRequest(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str

class UserProfileResponse(BaseModel):
    """Combined user + student-profile data returned by the profile endpoints."""
    user_id: int
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str] = None
    role: str
    # Student-specific fields (None for non-students)
    github_handle: Optional[str] = None
    portfolio_url: Optional[str] = None
    trust_score: Optional[float] = None
    student_level: Optional[str] = None

    class Config:
        from_attributes = True


class AdminUserDetail(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    email: str
    role: str
    created_at: datetime
    is_active: bool
    details: dict

    class Config:
        from_attributes = True


class AdminUsersResponse(BaseModel):
    students: List[AdminUserDetail]
    mentors: List[AdminUserDetail]
    faculty: List[AdminUserDetail]
    clients: List[AdminUserDetail]


