from typing import List, Dict, Any, Optional
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

    def start_attempt(self, user_id: int, exam_id: int) -> ExamAttempt:
        from app.models.profile import StudentProfile
        student = self.db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        if not student:
            raise HTTPException(status_code=400, detail="Student profile not found.")
            
        student_id = student.profile_id
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

    def ingest_monitoring_log(self, user_id: int, attempt_id: int, log_data: MonitoringLogCreate) -> MonitoringLog:
        from app.models.profile import StudentProfile
        student = self.db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        if not student:
            raise HTTPException(status_code=400, detail="Student profile not found.")
            
        student_id = student.profile_id

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

    def submit_exam(self, user_id: int, attempt_id: int, submissions: List[ExamSubmissionCreate]) -> ExamAttempt:
        from app.models.profile import StudentProfile
        student = self.db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        if not student:
            raise HTTPException(status_code=400, detail="Student profile not found.")
            
        student_id = student.profile_id

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
            
            # Route to Mentor or Faculty
            from app.models.profile import StudentProfile, MentorProfile, FacultyProfile
            student_profile = self.db.query(StudentProfile).filter(StudentProfile.profile_id == student_id).first()
            if student_profile:
                domain_id = student_profile.domain_id
                assigned = False
                if domain_id:
                    mentor = self.db.query(MentorProfile).filter(MentorProfile.domain_id == domain_id).first()
                    if mentor:
                        attempt.assigned_mentor_id = mentor.profile_id
                        attempt.assigned_faculty_id = None
                        assigned = True
                
                if not assigned:
                    faculty = self.db.query(FacultyProfile).first()
                    if faculty:
                        attempt.assigned_faculty_id = faculty.profile_id
                        attempt.assigned_mentor_id = None

        self.db.commit()
        self.db.refresh(attempt)
        return attempt

    def review_exam(self, attempt_id: int, student_id: int, approve: bool, feedback: str, score: int, question_scores: Optional[Dict[int, int]] = None) -> ExamAttempt:
        attempt = self.db.query(ExamAttempt).filter(
            ExamAttempt.attempt_id == attempt_id,
            ExamAttempt.student_id == student_id,
            ExamAttempt.status == ExamAttemptStatus.UNDER_REVIEW
        ).first()
        
        if not attempt:
            raise HTTPException(status_code=400, detail="Exam not pending review for this student.")
            
        final_score = score
        if question_scores:
            calculated_score = 0
            for sub in attempt.submissions:
                if sub.question_id in question_scores:
                    marks = question_scores[sub.question_id]
                    sub.marks_awarded = marks
                    calculated_score += marks
                else:
                    calculated_score += (sub.marks_awarded or 0)
            final_score = calculated_score

        attempt.status = ExamAttemptStatus.GRADED
        attempt.score = final_score
        # Using a general feedback string or attaching to submission is an option, we will just update the score for the attempt
        # In a real system, you might add a feedback column to ExamAttempt
        
        self.db.commit()
        self.db.refresh(attempt)
        return attempt

    def get_pending_exams_for_user(self, user_id: int) -> List[ExamAttempt]:
        from app.models.profile import MentorProfile, FacultyProfile
        mentor = self.db.query(MentorProfile).filter(MentorProfile.user_id == user_id).first()
        faculty = self.db.query(FacultyProfile).filter(FacultyProfile.user_id == user_id).first()
        
        query = self.db.query(ExamAttempt).filter(ExamAttempt.status == ExamAttemptStatus.UNDER_REVIEW)
        
        filters = []
        if mentor:
            filters.append(ExamAttempt.assigned_mentor_id == mentor.profile_id)
        if faculty:
            filters.append(ExamAttempt.assigned_faculty_id == faculty.profile_id)
            
        if not filters:
            return []
            
        from sqlalchemy import or_
        query = query.filter(or_(*filters))
        
        return query.all()
