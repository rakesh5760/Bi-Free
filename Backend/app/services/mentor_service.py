from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.project import Project, ProjectAllocation, Task, TeamMember
from app.models.profile import StudentProfile
from app.models.core import Level

class MentorService:
    def __init__(self, db: Session):
        self.db = db

    def get_global_projects(self, page: int = 1, size: int = 50, search: Optional[str] = None):
        """
        Mentors can view all client requests globally.
        """
        query = self.db.query(Project).options(
            joinedload(Project.tasks),
            joinedload(Project.qa_submissions),
            joinedload(Project.required_skills)
        )
        
        if search:
            query = query.filter(Project.title.ilike(f"%{search}%"))
            
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

    def get_my_allocations(self, mentor_id: int) -> List[ProjectAllocation]:
        """
        Get all project allocations explicitly assigned to this mentor.
        """
        return self.db.query(ProjectAllocation).filter(ProjectAllocation.mentor_id == mentor_id).all()

    def recruit_student_to_team(self, mentor_id: int, allocation_id: int, student_id: int) -> TeamMember:
        """
        Mentor recruits a Level A student to their assigned team.
        """
        allocation = self.db.query(ProjectAllocation).filter(
            ProjectAllocation.allocation_id == allocation_id,
            ProjectAllocation.mentor_id == mentor_id
        ).first()
        
        if not allocation:
            raise HTTPException(status_code=403, detail="Not authorized to manage this allocation.")

        # Strict Level A check
        level_a = self.db.query(Level).filter(Level.name.ilike("%Level A%")).first()
        student = self.db.query(StudentProfile).filter(StudentProfile.profile_id == student_id).first()
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found.")
        if not level_a or student.level_id != level_a.level_id:
            raise HTTPException(status_code=403, detail="Student is not Level A. Cannot be recruited for client work.")
            
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

    def create_task_for_team(self, mentor_id: int, project_id: int, title: str, student_id: int) -> Task:
        """
        Delegate a task strictly to an existing team member on a project managed by this mentor.
        """
        allocation = self.db.query(ProjectAllocation).filter(
            ProjectAllocation.project_id == project_id,
            ProjectAllocation.mentor_id == mentor_id
        ).first()
        
        if not allocation:
            raise HTTPException(status_code=403, detail="Not authorized to manage tasks for this project.")
            
        # Ensure student is a team member
        member = self.db.query(TeamMember).filter(
            TeamMember.allocation_id == allocation.allocation_id,
            TeamMember.student_id == student_id
        ).first()
        
        if not member:
            raise HTTPException(status_code=400, detail="Student is not a member of this project team.")
            
        task = Task(
            project_id=project_id,
            title=title,
            assigned_to=student_id
        )
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task
