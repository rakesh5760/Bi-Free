from typing import Optional, List
from pydantic import BaseModel, HttpUrl
from datetime import datetime
from enum import Enum

class TimestampSchema(BaseModel):
    created_at: datetime
    updated_at: datetime

# Domain
class DomainBase(BaseModel):
    name: str
    description: Optional[str] = None

class DomainCreate(DomainBase):
    pass

class Domain(DomainBase, TimestampSchema):
    domain_id: int
    class Config:
        from_attributes = True

# Skill
class SkillBase(BaseModel):
    name: str

class SkillCreate(SkillBase):
    domain_id: int

class Skill(SkillBase, TimestampSchema):
    skill_id: int
    domain_id: int
    class Config:
        from_attributes = True

# Level
class LevelBase(BaseModel):
    name: str
    description: Optional[str] = None
    required_trust_score: float = 0.0

class LevelCreate(LevelBase):
    pass

class Level(LevelBase, TimestampSchema):
    level_id: int
    class Config:
        from_attributes = True


