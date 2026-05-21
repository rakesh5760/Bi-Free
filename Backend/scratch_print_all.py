import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.session import engine
from sqlalchemy import text

def print_all():
    with engine.connect() as conn:
        print("=== USERS (STUDENTS) ===")
        users = conn.execute(text(
            "SELECT u.user_id, u.email, u.first_name, u.last_name, r.role_name "
            "FROM users u JOIN roles r ON u.role_id = r.role_id "
            "WHERE r.role_name = 'Student'"
        )).fetchall()
        for u in users:
            print(f"User ID: {u[0]} | Email: {u[1]} | Name: {u[2]} {u[3]} | Role: {u[4]}")
            
        print("\n=== STUDENT PROFILES ===")
        profiles = conn.execute(text(
            "SELECT profile_id, user_id, trust_score, level_id FROM student_profiles"
        )).fetchall()
        for p in profiles:
            print(f"Profile ID: {p[0]} | User ID: {p[1]} | Trust Score: {p[2]} | Level ID: {p[3]}")
            
        print("\n=== STUDENT PROGRESS ===")
        progress = conn.execute(text(
            "SELECT progress_id, student_id, item_id, item_type, status FROM student_progress"
        )).fetchall()
        for pr in progress:
            print(f"Progress ID: {pr[0]} | Student ID (Profile ID field): {pr[1]} | Item ID: {pr[2]} | Type: {pr[3]} | Status: {pr[4]}")

if __name__ == "__main__":
    print_all()
