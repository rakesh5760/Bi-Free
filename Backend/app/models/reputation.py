from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, Numeric
from sqlalchemy.orm import relationship
import enum
from app.database.session import Base
from app.database.mixins import TimestampMixin, SoftDeleteMixin

class ReviewerType(str, enum.Enum):
    MENTOR = "Mentor"
    CLIENT = "Client"

class StudentReview(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "student_reviews"

    review_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.profile_id", ondelete="CASCADE"), nullable=False, index=True)
    
    # We store the user_id (or profile_id) of the reviewer. 
    reviewer_id = Column(Integer, nullable=False, index=True)
    reviewer_type = Column(Enum(ReviewerType), nullable=False)
    
    project_id = Column(Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=True, index=True)
    
    professionalism_score = Column(Numeric(3, 1), default=5.0) # 1.0 to 5.0
    reliability_score = Column(Numeric(3, 1), default=5.0)
    communication_score = Column(Numeric(3, 1), default=5.0)
    
    feedback = Column(Text, nullable=True)

    student = relationship("StudentProfile", backref="reviews")
    project = relationship("Project")
