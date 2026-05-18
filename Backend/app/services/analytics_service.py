from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.profile import StudentProfile, MentorProfile, ClientProfile
from app.models.project import Project, ProjectStatus, ProjectAllocation, TeamMember, Task, TaskStatus
from app.models.exam import ExamAttempt, ExamAttemptStatus
from app.models.reputation import StudentReview
from app.schemas.analytics import StudentAnalytics, MentorAnalytics, AdminAnalytics

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_student_analytics(self, student_id: int) -> StudentAnalytics:
        student = self.db.query(StudentProfile).filter(StudentProfile.profile_id == student_id).first()
        level_name = student.level.name if student and student.level else "Unknown"
        trust_score = float(student.trust_score) if student else 0.0

        # Projects via TeamMember
        total_assigned = self.db.query(TeamMember).filter(TeamMember.student_id == student_id).count()
        total_completed = self.db.query(TeamMember).join(ProjectAllocation).join(Project).filter(
            TeamMember.student_id == student_id,
            Project.status == ProjectStatus.COMPLETED
        ).count()

        # Exams
        exam_stats = self.db.query(
            func.count(ExamAttempt.attempt_id).label("total"),
            func.avg(ExamAttempt.score).label("avg_score")
        ).filter(
            ExamAttempt.student_id == student_id,
            ExamAttempt.status == ExamAttemptStatus.GRADED
        ).first()

        return StudentAnalytics(
            total_projects_assigned=total_assigned,
            total_projects_completed=total_completed,
            total_exams_taken=exam_stats.total or 0,
            average_exam_score=float(exam_stats.avg_score or 0.0),
            current_trust_score=trust_score,
            level_name=level_name
        )

    def get_mentor_analytics(self, mentor_id: int) -> MentorAnalytics:
        active_allocs = self.db.query(ProjectAllocation).join(Project).filter(
            ProjectAllocation.mentor_id == mentor_id,
            Project.status.in_([ProjectStatus.ASSIGNED, ProjectStatus.IN_PROGRESS, ProjectStatus.MENTOR_QA])
        ).count()

        completed_allocs = self.db.query(ProjectAllocation).join(Project).filter(
            ProjectAllocation.mentor_id == mentor_id,
            Project.status == ProjectStatus.COMPLETED
        ).count()

        tasks_reviewed = self.db.query(Task).join(Project).join(ProjectAllocation).filter(
            ProjectAllocation.mentor_id == mentor_id,
            Task.status == TaskStatus.DONE
        ).count()

        reviews_given = self.db.query(StudentReview).filter(StudentReview.reviewer_id == mentor_id).count()

        return MentorAnalytics(
            total_active_allocations=active_allocs,
            total_completed_allocations=completed_allocs,
            total_tasks_reviewed=tasks_reviewed,
            total_reviews_given=reviews_given
        )

    def get_admin_analytics(self) -> AdminAnalytics:
        students = self.db.query(StudentProfile).count()
        mentors = self.db.query(MentorProfile).count()
        clients = self.db.query(ClientProfile).count()

        active_projs = self.db.query(Project).filter(
            Project.status.in_([ProjectStatus.PENDING, ProjectStatus.ASSIGNED, ProjectStatus.IN_PROGRESS, ProjectStatus.MENTOR_QA])
        ).count()

        comp_projs = self.db.query(Project).filter(Project.status == ProjectStatus.COMPLETED).count()

        revenue = self.db.query(func.sum(Project.budget)).filter(Project.status != ProjectStatus.COMPLETED).scalar()

        return AdminAnalytics(
            total_students=students,
            total_mentors=mentors,
            total_clients=clients,
            active_projects=active_projs,
            completed_projects=comp_projs,
            total_revenue_pipeline=float(revenue or 0.0)
        )
