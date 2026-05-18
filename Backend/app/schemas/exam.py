from typing import Optional, List, Any
from pydantic import BaseModel
from datetime import datetime
from app.schemas.core import TimestampSchema
from app.models.exam import QuestionType, ExamAttemptStatus, MonitoringEventType

# Question
class QuestionBase(BaseModel):
    text: str
    question_type: QuestionType
    content: Optional[Any] = None
    marks: int = 1

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase, TimestampSchema):
    question_id: int
    exam_id: int
    class Config:
        from_attributes = True

# Exam
class ExamBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration_minutes: int = 60
    passing_score: int = 50

class ExamCreate(ExamBase):
    domain_id: int

class Exam(ExamBase, TimestampSchema):
    exam_id: int
    domain_id: int
    questions: List[Question] = []
    class Config:
        from_attributes = True

# Monitoring Log
class MonitoringLogBase(BaseModel):
    event_type: MonitoringEventType
    description: Optional[str] = None
    timestamp: Optional[datetime] = None

class MonitoringLogCreate(MonitoringLogBase):
    pass

class MonitoringLog(MonitoringLogBase):
    log_id: int
    attempt_id: int
    timestamp: datetime
    class Config:
        from_attributes = True

# Exam Submission
class ExamSubmissionBase(BaseModel):
    question_id: int
    answer: Any

class ExamSubmissionCreate(ExamSubmissionBase):
    pass

class ExamSubmission(ExamSubmissionBase, TimestampSchema):
    submission_id: int
    attempt_id: int
    marks_awarded: Optional[int] = None
    mentor_feedback: Optional[str] = None
    class Config:
        from_attributes = True

# Exam Attempt
class ExamAttemptBase(BaseModel):
    pass

class ExamAttempt(ExamAttemptBase, TimestampSchema):
    attempt_id: int
    exam_id: int
    student_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    score: Optional[int] = None
    status: ExamAttemptStatus
    tab_switch_count: int
    submissions: List[ExamSubmission] = []
    class Config:
        from_attributes = True
