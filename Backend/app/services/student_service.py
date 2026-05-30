from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.profile import StudentProfile
from app.models.core import Skill, Level
from app.models.project import Project, ProjectStatus

# Hardcoded Baseline Progression Rules
LEVEL_THRESHOLDS = {
    "Level D": {"min_trust": 0.0},
    "Level C": {"min_trust": 50.0},
    "Level B": {"min_trust": 75.0},
    "Level A": {"min_trust": 90.0},
}

class StudentService:
    def __init__(self, db: Session):
        self.db = db

    def get_profile(self, user_id: int) -> StudentProfile:
        profile = self.db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        return profile

    def update_skills(self, user_id: int, skill_ids: List[int]) -> StudentProfile:
        profile = self.get_profile(user_id)
        # Fetch requested skills
        skills = self.db.query(Skill).filter(Skill.skill_id.in_(skill_ids)).all()
        # Enforce that all requested skills exist
        if len(skills) != len(skill_ids):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="One or more skills are invalid")
        
        # Replace existing skills
        profile.skills = skills
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def evaluate_progression(self, user_id: int) -> dict:
        profile = self.get_profile(user_id)
        current_score = float(profile.trust_score)
        
        # Determine the level the student qualifies for based on trust score
        eligible_level_name = "Level D"
        for level_name, reqs in LEVEL_THRESHOLDS.items():
            if current_score >= reqs["min_trust"]:
                eligible_level_name = level_name
                
        # Find the eligible level in DB
        db_level = self.db.query(Level).filter(Level.name == eligible_level_name).first()
        
        if not db_level:
            return {
                "current_score": current_score,
                "eligible_level": eligible_level_name,
                "promoted": False,
                "message": "Levels not fully seeded in database."
            }

        # If faculty has overridden this student's level, only allow PROMOTION (never demote)
        if profile.level_overridden and profile.level_id is not None:
            current_level = self.db.query(Level).filter(Level.level_id == profile.level_id).first()
            if current_level:
                current_threshold = LEVEL_THRESHOLDS.get(current_level.name, {}).get("min_trust", 0.0)
                eligible_threshold = LEVEL_THRESHOLDS.get(eligible_level_name, {}).get("min_trust", 0.0)
                
                if eligible_threshold <= current_threshold:
                    # Would be a demotion — keep faculty-assigned level
                    return {
                        "current_score": current_score,
                        "eligible_level": current_level.name,
                        "promoted": False,
                        "message": f"Level maintained at {current_level.name} (faculty override protected)."
                    }

        promoted = False
        if profile.level_id != db_level.level_id:
            profile.level_id = db_level.level_id
            self.db.commit()
            promoted = True

        return {
            "current_score": current_score,
            "eligible_level": eligible_level_name,
            "promoted": promoted,
            "message": f"Successfully evaluated progression to {eligible_level_name}." if promoted else "Already at maximum eligible level."
        }

    def get_eligible_projects(self, user_id: int) -> List[Project]:
        profile = self.get_profile(user_id)
        
        # 1. Fetch pending projects
        available_projects = self.db.query(Project).filter(
            Project.status == ProjectStatus.PENDING
        ).all()

        eligible = []
        student_skill_ids = {s.skill_id for s in profile.skills}

        for project in available_projects:
            # Check skill match (Partial match OK for now - e.g. at least 50%)
            project_skill_ids = {s.skill_id for s in project.required_skills}
            
            if not project_skill_ids:
                eligible.append(project)
                continue
                
            intersection = student_skill_ids.intersection(project_skill_ids)
            match_percentage = len(intersection) / len(project_skill_ids)
            
            # Simple eligibility rule: Must have at least 50% of the skills to apply
            if match_percentage >= 0.5:
                eligible.append(project)

        return eligible

    def get_my_allocations(self, user_id: int):
        profile = self.get_profile(user_id)
        from app.models.project import ProjectAllocation, TeamMember
        
        # Find all allocations where this student is a team member
        allocations = self.db.query(ProjectAllocation).join(TeamMember).filter(
            TeamMember.student_id == profile.profile_id
        ).all()
        return [a.project for a in allocations]
