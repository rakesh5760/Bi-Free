from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.project import Project, ProjectStatus, Task, TaskStatus, QualityAssuranceSubmission, SubmissionStatus, ProjectAllocation, TeamMember
from app.utils.logger import logger

class ProjectService:
    def __init__(self, db: Session):
        self.db = db

    def student_submit_task(self, student_id: int, task_id: int, github_pr_url: str) -> Task:
        """
        Student submits a task for review.
        """
        task = self.db.query(Task).filter(Task.task_id == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
            
        if task.assigned_to != student_id:
            raise HTTPException(status_code=403, detail="Not authorized to submit this task.")
            
        task.github_pr_url = github_pr_url
        task.status = TaskStatus.REVIEW
        
        # Auto-advance project state if this is the first task being worked on
        if task.project.status == ProjectStatus.ASSIGNED:
            task.project.status = ProjectStatus.IN_PROGRESS
            
        self.db.commit()
        self.db.refresh(task)
        return task

    def mentor_review_task(self, mentor_id: int, task_id: int, approve: bool) -> Task:
        """
        Mentor reviews a task.
        """
        task = self.db.query(Task).filter(Task.task_id == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
            
        # Verify mentor authority
        allocation = self.db.query(ProjectAllocation).filter(
            ProjectAllocation.project_id == task.project_id,
            ProjectAllocation.mentor_id == mentor_id
        ).first()
        if not allocation:
            raise HTTPException(status_code=403, detail="Not authorized to review this project's tasks.")
            
        task.status = TaskStatus.DONE if approve else TaskStatus.IN_PROGRESS
        
        self.db.commit()
        self.db.refresh(task)
        return task

    def student_submit_qa(self, student_id: int, project_id: int, title: str, asset_url: str) -> QualityAssuranceSubmission:
        """
        Student submits a major milestone for QA.
        """
        # Ensure student is on the team
        allocation = self.db.query(ProjectAllocation).filter(ProjectAllocation.project_id == project_id).first()
        if not allocation:
            raise HTTPException(status_code=400, detail="Project is not allocated yet.")
            
        member = self.db.query(TeamMember).filter(
            TeamMember.allocation_id == allocation.allocation_id,
            TeamMember.student_id == student_id
        ).first()
        if not member:
            raise HTTPException(status_code=403, detail="Student is not a team member on this project.")
            
        submission = QualityAssuranceSubmission(
            project_id=project_id,
            submitted_by=student_id,
            title=title,
            asset_url=asset_url,
            status=SubmissionStatus.PENDING
        )
        self.db.add(submission)
        self.db.commit()
        self.db.refresh(submission)
        return submission

    def mentor_review_qa(self, mentor_id: int, submission_id: int, approve: bool) -> QualityAssuranceSubmission:
        """
        Mentor performs Stage 1 approval of QA milestone.
        """
        submission = self.db.query(QualityAssuranceSubmission).filter(
            QualityAssuranceSubmission.submission_id == submission_id
        ).first()
        
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
            
        allocation = self.db.query(ProjectAllocation).filter(
            ProjectAllocation.project_id == submission.project_id,
            ProjectAllocation.mentor_id == mentor_id
        ).first()
        
        if not allocation:
            raise HTTPException(status_code=403, detail="Not authorized.")
            
        submission.status = SubmissionStatus.MENTOR_APPROVED if approve else SubmissionStatus.REJECTED
        
        self.db.commit()
        self.db.refresh(submission)
        return submission

    def mentor_transition_project(self, mentor_id: int, project_id: int, new_status: ProjectStatus) -> Project:
        """
        Mentor explicitly clicks a button to advance the project state (e.g. to MENTOR_QA).
        """
        project = self.db.query(Project).filter(Project.project_id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
            
        allocation = self.db.query(ProjectAllocation).filter(
            ProjectAllocation.project_id == project_id,
            ProjectAllocation.mentor_id == mentor_id
        ).first()
        
        if not allocation:
            raise HTTPException(status_code=403, detail="Not authorized.")
            
        # Optional validation: Only allow advancing to MENTOR_QA if there's a pending/approved QA submission
        if new_status == ProjectStatus.MENTOR_QA:
            has_qa = any(qa for qa in project.qa_submissions if qa.status != SubmissionStatus.REJECTED)
            if not has_qa:
                raise HTTPException(status_code=400, detail="Cannot transition to QA without a valid QA submission.")
                
        project.status = new_status
        self.db.commit()
        self.db.refresh(project)
        
        logger.info(f"Project {project_id} transitioned to {new_status} by Mentor {mentor_id}")
        
        return project
