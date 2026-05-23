import sys, os
sys.path.append(os.path.abspath('.'))
from app.database.session import SessionLocal
from app.models.project import ProjectAllocation, TeamMember
from app.models.profile import MentorProfile, StudentProfile
from app.models.user import User

db = SessionLocal()
allocs = db.query(ProjectAllocation).all()
print('Allocations:')
for a in allocs:
    mp = db.query(MentorProfile).filter(MentorProfile.profile_id==a.mentor_id).first()
    m = db.query(User).filter(User.user_id == mp.user_id).first()
    print(f'  Project {a.project_id} -> Mentor: {m.email}')

print('Team Members:')
members = db.query(TeamMember).all()
for mem in members:
    sp = db.query(StudentProfile).filter(StudentProfile.profile_id==mem.student_id).first()
    s = db.query(User).filter(User.user_id == sp.user_id).first()
    print(f'  Allocation {mem.allocation_id} -> Student: {s.email}')
