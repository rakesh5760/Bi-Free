from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database.session import Base
from app.database.mixins import TimestampMixin, SoftDeleteMixin

class QuestionType(str, enum.Enum):
    MCQ = "MCQ"
    CODING = "Coding"

class ExamAttemptStatus(str, enum.Enum):
    IN_PROGRESS = "In Progress"
    SUBMITTED = "Submitted"
    UNDER_REVIEW = "Under Review"
    GRADED = "Graded"

class MonitoringEventType(str, enum.Enum):
    TAB_SWITCH = "Tab Switch"
    FULLSCREEN_EXIT = "Fullscreen Exit"
    FOCUS_LOST = "Focus Lost"
    MEDIA_DENIED = "Media Denied"

class Exam(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "exams"
    exam_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    domain_id = Column(Integer, ForeignKey("domains.domain_id"), nullable=False, index=True)
    duration_minutes = Column(Integer, default=60, nullable=False)
    passing_score = Column(Integer, default=50, nullable=False)
    
    questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan")
    attempts = relationship("ExamAttempt", back_populates="exam", cascade="all, delete-orphan")

class Question(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "questions"
    question_id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.exam_id", ondelete="CASCADE"), nullable=False, index=True)
    question_type = Column(Enum(QuestionType), default=QuestionType.MCQ, nullable=False)
    text = Column(Text, nullable=False)
    content = Column(JSON, nullable=True) # E.g., {"options": ["A", "B", "C"], "correct": 0} or {"template": "def solve():", "test_cases": []}
    marks = Column(Integer, default=1, nullable=False)

    exam = relationship("Exam", back_populates="questions")

class ExamAttempt(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "exam_attempts"
    attempt_id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.exam_id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.profile_id", ondelete="CASCADE"), nullable=False, index=True)
    start_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    end_time = Column(DateTime, nullable=True)
    score = Column(Integer, nullable=True)
    status = Column(Enum(ExamAttemptStatus), default=ExamAttemptStatus.IN_PROGRESS, index=True)
    tab_switch_count = Column(Integer, default=0) # Quick denormalized counter for flagging
    assigned_mentor_id = Column(Integer, ForeignKey("mentor_profiles.profile_id"), nullable=True, index=True)
    assigned_faculty_id = Column(Integer, ForeignKey("faculty_profiles.profile_id"), nullable=True, index=True)
    
    exam = relationship("Exam", back_populates="attempts")
    monitoring_logs = relationship("MonitoringLog", back_populates="attempt", cascade="all, delete-orphan")
    submissions = relationship("ExamSubmission", back_populates="attempt", cascade="all, delete-orphan")
    assigned_mentor = relationship("MentorProfile", foreign_keys=[assigned_mentor_id])
    assigned_faculty = relationship("FacultyProfile", foreign_keys=[assigned_faculty_id])

class MonitoringLog(Base, TimestampMixin): # Soft delete not heavily needed for logs
    __tablename__ = "monitoring_logs"
    log_id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("exam_attempts.attempt_id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(Enum(MonitoringEventType), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    description = Column(String(255), nullable=True)
    
    attempt = relationship("ExamAttempt", back_populates="monitoring_logs")

class ExamSubmission(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "exam_submissions"
    submission_id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("exam_attempts.attempt_id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("questions.question_id", ondelete="CASCADE"), nullable=False, index=True)
    answer = Column(JSON, nullable=False) # Store what the student submitted
    marks_awarded = Column(Integer, nullable=True)
    mentor_feedback = Column(Text, nullable=True)

    attempt = relationship("ExamAttempt", back_populates="submissions")
    question = relationship("Question")
