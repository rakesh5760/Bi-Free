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
    is_active: Optional[bool] = True

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: str
    domain: Optional[str] = None
    company_name: Optional[str] = None

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
