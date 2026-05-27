from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.profile import StudentProfile, MentorProfile
from app.models.project import Project, ProjectStatus, ProjectAllocation, TeamMember
from app.models.core import Level

class FacultyService:
    def __init__(self, db: Session):
        self.db = db

    def get_eligible_level_a_students(self, domain_id: Optional[int] = None, page: int = 1, size: int = 50, search: Optional[str] = None):
        """
        Filters the database to find ONLY students who have reached Level A.
        Optionally filters by the domain of their skills and search query.
        """
        # Find Level A
        level_a = self.db.query(Level).filter(Level.name.ilike("%Level A%")).first()
        if not level_a:
            raise HTTPException(status_code=500, detail="Level A not configured in database.")

        query = self.db.query(StudentProfile).filter(StudentProfile.level_id == level_a.level_id)
        
        # If domain filter provided, filter by skills belonging to that domain
        # If search provided, filter by user's full name
        if search:
            from app.models.user import User
            query = query.join(User).filter(User.full_name.ilike(f"%{search}%"))
            
        total = query.count()
        items = query.offset((page - 1) * size).limit(size).all()
        
        pages = (total + size - 1) // size
        return {
            "items": items,
            "total": total,
            "page": page,
            "size": size,
            "pages": pages
        }

    def allocate_mentor_to_project(self, project_id: int, mentor_id: int) -> ProjectAllocation:
        """
        Binds a Mentor to a Client Project.
        """
        project = self.db.query(Project).filter(Project.project_id == project_id).first()
        mentor = self.db.query(MentorProfile).filter(MentorProfile.user_id == mentor_id).first()
        
        if not project or not mentor:
            raise HTTPException(status_code=404, detail="Project or Mentor not found.")
            
        existing_allocation = self.db.query(ProjectAllocation).filter(
            ProjectAllocation.project_id == project_id,
            ProjectAllocation.mentor_id == mentor.profile_id
        ).first()
        
        if existing_allocation:
            raise HTTPException(status_code=400, detail="Mentor is already allocated to this project.")
            
        allocation = ProjectAllocation(
            project_id=project_id,
            mentor_id=mentor.profile_id,
            team_name=f"Team {project_id}-{mentor.profile_id}"
        )
        self.db.add(allocation)
        project.status = ProjectStatus.ASSIGNED
        self.db.commit()
        self.db.refresh(allocation)
        return allocation

    def add_student_to_team(self, allocation_id: int, student_id: int) -> TeamMember:
        """
        Faculty explicitly assigns a Level A student to a project allocation team.
        """
        allocation = self.db.query(ProjectAllocation).filter(ProjectAllocation.allocation_id == allocation_id).first()
        if not allocation:
            raise HTTPException(status_code=404, detail="Allocation not found.")
            
        # Strict Level A check
        level_a = self.db.query(Level).filter(Level.name.ilike("%Level A%")).first()
        student = self.db.query(StudentProfile).filter(StudentProfile.profile_id == student_id).first()
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found.")
        if not level_a or student.level_id != level_a.level_id:
            raise HTTPException(status_code=403, detail="Student is not Level A. Operation denied.")
            
        # Ensure not already on team
        existing_member = self.db.query(TeamMember).filter(
            TeamMember.allocation_id == allocation_id,
            TeamMember.student_id == student_id
        ).first()
        
        if existing_member:
            raise HTTPException(status_code=400, detail="Student is already on this team.")
            
        team_member = TeamMember(
            allocation_id=allocation_id,
            student_id=student_id
        )
        self.db.add(team_member)
        self.db.commit()
        self.db.refresh(team_member)
        return team_member

    def revoke_project_allocation(self, allocation_id: int):
        """
        Faculty revokes an entire project allocation, resetting project to PENDING.
        """
        allocation = self.db.query(ProjectAllocation).filter(ProjectAllocation.allocation_id == allocation_id).first()
        if not allocation:
            raise HTTPException(status_code=404, detail="Allocation not found.")
        
        # Reset project status
        project = self.db.query(Project).filter(Project.project_id == allocation.project_id).first()
        if project:
            from app.models.project import ProjectStatus
            project.status = ProjectStatus.PENDING
            
        self.db.delete(allocation)
        self.db.commit()
        return {"success": True, "message": "Allocation revoked successfully."}

    def remove_student_from_team(self, allocation_id: int, student_id: int):
        """
        Faculty removes a specific student from a team.
        """
        team_member = self.db.query(TeamMember).filter(
            TeamMember.allocation_id == allocation_id,
            TeamMember.student_id == student_id
        ).first()
        
        if not team_member:
            raise HTTPException(status_code=404, detail="Student is not on this team.")
            
        self.db.delete(team_member)
        self.db.commit()
        return {"success": True, "message": "Student removed from team."}

    def override_student_profile(self, user_id: int, level_id: int, domain_id: int, reason: Optional[str] = None):
        """
        Directly updates the student's level and domain.
        """
        student = self.db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found.")
            
        student.level_id = level_id
        student.domain_id = domain_id
        if reason:
            student.override_reason = reason
            
        self.db.commit()
        self.db.refresh(student)
        return student
