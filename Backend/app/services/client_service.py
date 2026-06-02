from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.project import Project, ProjectStatus, QualityAssuranceSubmission, SubmissionStatus, ProjectAllocation
from app.models.core import Skill
from app.schemas.project import ProjectCreate

class ClientService:
    def __init__(self, db: Session):
        self.db = db

    def create_project(self, user_id: int, project_data: ProjectCreate) -> Project:
        """
        Client posts a new project requirement.
        """
        from app.models.profile import ClientProfile
        client_profile = self.db.query(ClientProfile).filter(ClientProfile.user_id == user_id).first()
        if not client_profile:
            raise HTTPException(status_code=404, detail="Client profile not found.")

        project = Project(
            client_id=client_profile.profile_id,
            domain_id=project_data.domain_id,
            title=project_data.title,
            description=project_data.description,
            budget=project_data.budget,
            status=ProjectStatus.PENDING,
            deadline=project_data.deadline
        )
        
        if project_data.skill_ids:
            skills = self.db.query(Skill).filter(Skill.skill_id.in_(project_data.skill_ids)).all()
            project.required_skills = skills
            
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def get_my_projects(self, user_id: int, page: int = 1, size: int = 50, search: Optional[str] = None):
        """
        Client fetches all their posted projects.
        """
        from app.models.profile import ClientProfile
        client_profile = self.db.query(ClientProfile).filter(ClientProfile.user_id == user_id).first()
        
        if not client_profile:
            return {
                "items": [],
                "total": 0,
                "page": page,
                "size": size,
                "pages": 0
            }

        query = self.db.query(Project).options(
            joinedload(Project.tasks),
            joinedload(Project.allocation).joinedload(ProjectAllocation.team_members),
            joinedload(Project.qa_submissions),
            joinedload(Project.progress_history)
        ).filter(Project.client_id == client_profile.profile_id)
        
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

    def approve_qa_submission(self, user_id: int, submission_id: int, approve: bool) -> QualityAssuranceSubmission:
        """
        Client performs the final review of a QA submission (Dual-stage approval).
        It must already be MENTOR_APPROVED.
        """
        from app.models.profile import ClientProfile
        client_profile = self.db.query(ClientProfile).filter(ClientProfile.user_id == user_id).first()
        if not client_profile:
            raise HTTPException(status_code=404, detail="Client profile not found.")

        submission = self.db.query(QualityAssuranceSubmission).filter(
            QualityAssuranceSubmission.submission_id == submission_id
        ).first()
        
        if not submission:
            raise HTTPException(status_code=404, detail="QA Submission not found.")
            
        if submission.project.client_id != client_profile.profile_id:
            raise HTTPException(status_code=403, detail="Not authorized to review this submission.")
            
        if submission.status != SubmissionStatus.MENTOR_APPROVED:
            raise HTTPException(status_code=400, detail="QA submission must be approved by Mentor first.")
            
        if approve:
            submission.status = SubmissionStatus.CLIENT_REVIEWED
            # Final state transition
            submission.project.status = ProjectStatus.COMPLETED
        else:
            submission.status = SubmissionStatus.REJECTED
            submission.project.status = ProjectStatus.IN_PROGRESS # Sent back to execution
            
        self.db.commit()
        self.db.refresh(submission)
        return submission

    def revoke_project(self, user_id: int, project_id: int, reason: str) -> Project:
        """
        Client revokes a pending project with a reason.
        """
        from app.models.profile import ClientProfile
        client_profile = self.db.query(ClientProfile).filter(ClientProfile.user_id == user_id).first()
        if not client_profile:
            raise HTTPException(status_code=404, detail="Client profile not found.")

        project = self.db.query(Project).filter(Project.project_id == project_id).first()
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found.")
            
        if project.client_id != client_profile.profile_id:
            raise HTTPException(status_code=403, detail="Not authorized to revoke this project.")
            
        if project.status in [ProjectStatus.COMPLETED, ProjectStatus.REVOKED]:
            raise HTTPException(status_code=400, detail=f"Cannot revoke project. Current status is {project.status}.")
            
        project.status = ProjectStatus.REVOKED
        project.revocation_reason = reason
        self.db.commit()
        self.db.refresh(project)
        return project
