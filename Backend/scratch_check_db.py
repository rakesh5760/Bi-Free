import sys
import os
import time

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.session import engine, SessionLocal
from sqlalchemy import text

def check_db():
    print("Connecting to DB...")
    with engine.connect() as conn:
        # Check overall count
        total_rows = conn.execute(text("SELECT COUNT(*) FROM student_progress")).scalar()
        print(f"Total rows in student_progress: {total_rows}")
        
        # Check duplicates: student_id, item_id, item_type
        dup_query = """
            SELECT student_id, item_id, item_type, COUNT(*) as cnt 
            FROM student_progress 
            GROUP BY student_id, item_id, item_type 
            HAVING cnt > 1
        """
        duplicates = conn.execute(text(dup_query)).fetchall()
        print(f"Number of groups with duplicates: {len(duplicates)}")
        if duplicates:
            print("Duplicate groups found (first 10):")
            for d in duplicates[:10]:
                print(f"  student_id: {d[0]}, item_id: {d[1]}, item_type: {d[2]}, Count: {d[3]}")
        
        # Check performance: time a simple select
        start = time.time()
        conn.execute(text("SELECT * FROM student_progress")).fetchall()
        duration = time.time() - start
        print(f"Time to fetch all rows: {duration:.4f} seconds")

        # Let's count student profiles
        total_profiles = conn.execute(text("SELECT COUNT(*) FROM student_profiles")).scalar()
        print(f"Total student profiles: {total_profiles}")

if __name__ == "__main__":
    check_db()
