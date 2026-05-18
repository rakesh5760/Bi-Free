from typing import List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timedelta

from app.models.exam import Exam, ExamAttempt, ExamAttemptStatus, MonitoringLog, MonitoringEventType, ExamSubmission, Question, QuestionType
from app.schemas.exam import MonitoringLogCreate, ExamSubmissionCreate

class ExamService:
    def __init__(self, db: Session):
        self.db = db

    def get_exam(self, exam_id: int) -> Exam:
        exam = self.db.query(Exam).filter(Exam.exam_id == exam_id).first()
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        return exam

    def start_attempt(self, student_id: int, exam_id: int) -> ExamAttempt:
        exam = self.get_exam(exam_id)
        
        # Check if already in progress
        existing_attempt = self.db.query(ExamAttempt).filter(
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.student_id == student_id,
            ExamAttempt.status == ExamAttemptStatus.IN_PROGRESS
        ).first()
        if existing_attempt:
            return existing_attempt

        # Create new attempt
        attempt = ExamAttempt(
            exam_id=exam_id,
            student_id=student_id,
            start_time=datetime.utcnow(),
            status=ExamAttemptStatus.IN_PROGRESS,
            tab_switch_count=0
        )
        self.db.add(attempt)
        self.db.commit()
        self.db.refresh(attempt)
        return attempt

    def ingest_monitoring_log(self, student_id: int, attempt_id: int, log_data: MonitoringLogCreate) -> MonitoringLog:
        attempt = self.db.query(ExamAttempt).filter(
            ExamAttempt.attempt_id == attempt_id,
            ExamAttempt.student_id == student_id,
            ExamAttempt.status == ExamAttemptStatus.IN_PROGRESS
        ).first()
        
        if not attempt:
            raise HTTPException(status_code=400, detail="Invalid or inactive exam attempt")

        log = MonitoringLog(
            attempt_id=attempt_id,
            event_type=log_data.event_type,
            description=log_data.description,
            timestamp=log_data.timestamp or datetime.utcnow()
        )
        self.db.add(log)
        
        # Update denormalized count for tab switches for quick mentor flagging
        if log_data.event_type == MonitoringEventType.TAB_SWITCH:
            attempt.tab_switch_count += 1

        self.db.commit()
        self.db.refresh(log)
        return log

    def submit_exam(self, student_id: int, attempt_id: int, submissions: List[ExamSubmissionCreate]) -> ExamAttempt:
        attempt = self.db.query(ExamAttempt).filter(
            ExamAttempt.attempt_id == attempt_id,
            ExamAttempt.student_id == student_id,
            ExamAttempt.status == ExamAttemptStatus.IN_PROGRESS
        ).first()
        
        if not attempt:
            raise HTTPException(status_code=400, detail="Invalid or inactive exam attempt")

        # Timer Validation
        now = datetime.utcnow()
        # Add a 5 minute grace period for latency
        max_end_time = attempt.start_time + timedelta(minutes=attempt.exam.duration_minutes + 5)
        
        if now > max_end_time:
            # Mark as submitted but flag as late (in a real app you might reject it or flag it)
            # We'll allow submission but maybe zero the score or add a flag
            pass 

        attempt.end_time = now
        attempt.status = ExamAttemptStatus.SUBMITTED
        total_score = 0
        requires_manual_review = False

        for sub in submissions:
            question = self.db.query(Question).filter(Question.question_id == sub.question_id).first()
            if not question:
                continue

            # Auto-grade MCQ
            marks_awarded = 0
            if question.question_type == QuestionType.MCQ:
                correct_answer = question.content.get("correct") if question.content else None
                # Assuming the answer payload contains {"choice": int}
                student_choice = sub.answer.get("choice") if isinstance(sub.answer, dict) else sub.answer
                if student_choice == correct_answer:
                    marks_awarded = question.marks
                total_score += marks_awarded
            else:
                requires_manual_review = True
                marks_awarded = None # Mentor must grade

            db_submission = ExamSubmission(
                attempt_id=attempt.attempt_id,
                question_id=question.question_id,
                answer=sub.answer,
                marks_awarded=marks_awarded
            )
            self.db.add(db_submission)

        if not requires_manual_review:
            attempt.score = total_score
            attempt.status = ExamAttemptStatus.GRADED
        else:
            attempt.status = ExamAttemptStatus.UNDER_REVIEW

        self.db.commit()
        self.db.refresh(attempt)
        return attempt
