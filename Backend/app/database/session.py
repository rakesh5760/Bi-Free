from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Create database engine
engine = create_engine(
    str(settings.SQLALCHEMY_DATABASE_URI),
    pool_pre_ping=True
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base for models
Base = declarative_base()


def safe_migrate():
    """
    Apply lightweight, additive schema migrations that are safe to run on
    every startup. Uses INFORMATION_SCHEMA checks for MySQL 5.7+ compatibility
    instead of 'IF NOT EXISTS' (which requires MySQL 8.0.3+).
    """
    db_name_query = "SELECT DATABASE();"
    
    # List of (table, column, column_definition) tuples to ensure exist
    columns_to_add = [
        ("users", "phone_number", "VARCHAR(20) NULL"),
        ("student_profiles", "level_overridden", "TINYINT(1) NOT NULL DEFAULT 0"),
    ]
    
    # List of CREATE TABLE ... statements (safe to run; checks table existence first)
    tables_to_create = [
        (
            "module_completions",
            """
            CREATE TABLE `module_completions` (
                `id`          INT NOT NULL AUTO_INCREMENT,
                `student_id`  INT NOT NULL,
                `module_key`  VARCHAR(100) NOT NULL,
                `completed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uq_student_module` (`student_id`, `module_key`),
                CONSTRAINT `fk_mc_user` FOREIGN KEY (`student_id`)
                    REFERENCES `users` (`user_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """
        ),
    ]
    
    with engine.connect() as conn:
        # Get the current database name
        result = conn.execute(text(db_name_query))
        db_name = result.scalar()
        
        # Ensure projects.status ENUM includes 'REVOKED'
        try:
            status_col_query = text(
                "SELECT COLUMN_TYPE FROM information_schema.COLUMNS "
                "WHERE TABLE_SCHEMA = :db AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'status'"
            )
            col_type = conn.execute(status_col_query, {"db": db_name}).scalar()
            if col_type and "REVOKED" not in col_type:
                print("[safe_migrate] Updating `projects.status` ENUM to include `REVOKED`...")
                conn.execute(text(
                    "ALTER TABLE projects MODIFY COLUMN status "
                    "ENUM('PENDING','ASSIGNED','IN_PROGRESS','MENTOR_QA','COMPLETED','REVOKED') "
                    "DEFAULT NULL"
                ))
                conn.commit()
                print("[safe_migrate] Successfully updated `projects.status` ENUM.")
        except Exception as e:
            conn.rollback()
            print(f"[safe_migrate] WARNING: Could not update `projects.status` ENUM: {e}")

        # ── Column additions ────────────────────────────────────────────────
        for table, column, col_def in columns_to_add:
            check_sql = text(
                "SELECT COUNT(*) FROM information_schema.COLUMNS "
                "WHERE TABLE_SCHEMA = :db AND TABLE_NAME = :tbl AND COLUMN_NAME = :col"
            )
            exists = conn.execute(check_sql, {"db": db_name, "tbl": table, "col": column}).scalar()
            if not exists:
                try:
                    conn.execute(text(f"ALTER TABLE `{table}` ADD COLUMN `{column}` {col_def};"))
                    conn.commit()
                    print(f"[safe_migrate] Added column `{column}` to `{table}`.")
                except Exception as e:
                    conn.rollback()
                    print(f"[safe_migrate] WARNING: Could not add `{column}` to `{table}`: {e}")
        
        # ── Table creations ─────────────────────────────────────────────────
        for table_name, create_sql in tables_to_create:
            check_table = text(
                "SELECT COUNT(*) FROM information_schema.TABLES "
                "WHERE TABLE_SCHEMA = :db AND TABLE_NAME = :tbl"
            )
            exists = conn.execute(check_table, {"db": db_name, "tbl": table_name}).scalar()
            if not exists:
                try:
                    conn.execute(text(create_sql))
                    conn.commit()
                    print(f"[safe_migrate] Created table `{table_name}`.")
                except Exception as e:
                    conn.rollback()
                    print(f"[safe_migrate] WARNING: Could not create `{table_name}`: {e}")

        # ── Seeding & Progress Initialization ───────────────────────────────
        try:
            # 1. Levels
            levels = [
                ("Level D", 0.0),
                ("Level C", 50.0),
                ("Level B", 75.0),
                ("Level A", 90.0)
            ]
            for name, score in levels:
                lev_exists = conn.execute(text("SELECT COUNT(*) FROM levels WHERE name = :name"), {"name": name}).scalar()
                if not lev_exists:
                    conn.execute(text(
                        "INSERT INTO levels (name, required_trust_score, description, is_deleted) "
                        "VALUES (:name, :score, :desc, 0)"
                    ), {
                        "name": name,
                        "score": score,
                        "desc": f"Threshold {score} trust score"
                    })
                    conn.commit()

            # 2. Domains
            domains = [
                ("Full Stack Web Development", "End to end web application development"),
                ("Frontend Engineering", "Stunning responsive interfaces and frameworks"),
                ("Backend & APIs", "Scalable servers, APIs, and data persistence")
            ]
            domain_ids = {}
            for name, desc in domains:
                row = conn.execute(text("SELECT domain_id FROM domains WHERE name = :name"), {"name": name}).fetchone()
                if not row:
                    conn.execute(text(
                        "INSERT INTO domains (name, description, is_deleted) "
                        "VALUES (:name, :desc, 0)"
                    ), {"name": name, "desc": desc})
                    conn.commit()
                    domain_id = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()
                else:
                    domain_id = row[0]
                domain_ids[name] = domain_id

            # 3. Learning Paths
            paths = [
                ("Full Stack Web Development Path", "Comprehensive Full Stack developer path", "Full Stack Web Development"),
                ("Frontend Engineering Path", "Complete frontend developer training", "Frontend Engineering"),
                ("Backend & APIs Path", "High-performance backend systems design", "Backend & APIs"),
                ("Cyber Security Path", "Advanced cyber security protocols and defense", "Cyber Security"),
                ("AI & Agents Path", "Machine learning and algorithms", "AI & Agents"),
                ("Data Science Path", "Data visualization and analytics", "Data Science")
            ]
            path_ids = {}
            for title, desc, domain_name in paths:
                row = conn.execute(text("SELECT path_id FROM learning_paths WHERE title = :title"), {"title": title}).fetchone()
                if not row:
                    conn.execute(text(
                        "INSERT INTO learning_paths (title, description, domain_id, is_deleted) "
                        "VALUES (:title, :desc, :dom_id, 0)"
                    ), {
                        "title": title,
                        "desc": desc,
                        "dom_id": domain_ids[domain_name]
                    })
                    conn.commit()
                    path_id = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()
                else:
                    path_id = row[0]
                path_ids[title] = path_id

            # 4. Milestones & 5. Assignments (with explicit IDs 1-8)
            assignments_to_seed = [
                (1, "Web Architecture & Principles", "Full Stack Web Development Path", "Design a Scalable System Architecture", "Create an architecture diagram for a scalable e-commerce platform."),
                (2, "Frontend & Backend Integration", "Full Stack Web Development Path", "React + FastAPI/Node.js Integration", "Build a frontend that consumes your backend REST API."),
                (3, "Database & Cloud Deployment", "Full Stack Web Development Path", "Cloud & DB Capstone", "Design schema, dockerize, and deploy."),
                (4, "Design & User Experience", "Frontend Engineering Path", "Accessible UI Implementation", "Build an accessible, WCAG-compliant form."),
                (5, "Core Engineering Tools", "Frontend Engineering Path", "TypeScript Integration", "Refactor a JS application to TypeScript."),
                (6, "Modern UI Development", "Frontend Engineering Path", "Frontend Frameworks Capstone", "Build a highly componentized Next.js/React view."),
                (7, "Database Architecture", "Backend & APIs Path", "PostgreSQL Modeling", "Create a robust relational schema for an API."),
                (8, "API Frameworks", "Backend & APIs Path", "FastAPI/Django Implementation", "Build a high-performance REST API."),
                (9, "Systems at Scale", "Backend & APIs Path", "Docker Orchestration", "Containerize a microservices architecture using Docker."),
                (10, "Foundations & Cryptography", "Cyber Security Path", "Implement Encryption", "Write scripts to encrypt and decrypt sensitive data."),
                (11, "Network & Defensive Security", "Cyber Security Path", "Wireshark Packet Analysis", "Analyze network traffic dumps to find anomalies."),
                (12, "Offensive Security & Tooling", "Cyber Security Path", "Security Assessment Capstone", "Find and exploit vulnerabilities using industry tools."),
                (13, "Mathematical Foundations", "Data Science Path", "Statistical Inference", "Perform A/B testing analysis on a provided dataset."),
                (14, "Data Processing & Visualization", "Data Science Path", "Data Wrangling & Analysis", "Clean, aggregate, and visualize a real-world dataset."),
                (15, "Machine Learning Integration", "Data Science Path", "Model Building with Scikit-learn", "Train and evaluate models for classification tasks."),
                (16, "AI Mathematics & Fundamentals", "AI & Agents Path", "Python & ML Basics", "Implement ML algorithms and evaluate baselines."),
                (17, "Deep Learning & NLP", "AI & Agents Path", "Deep Learning with PyTorch", "Build and train a neural network using PyTorch."),
                (18, "Advanced Agents & Systems", "AI & Agents Path", "Agent Workflows & RAG", "Orchestrate multi-agent tasks and implement document retrieval.")
            ]

            for ass_id, ms_title, path_title, ass_title, ass_desc in assignments_to_seed:
                # Check if milestone exists
                ms_row = conn.execute(text("SELECT milestone_id FROM milestones WHERE title = :title"), {"title": ms_title}).fetchone()
                if not ms_row:
                    conn.execute(text(
                        "INSERT INTO milestones (title, path_id, order_index, is_deleted) "
                        "VALUES (:title, :path_id, :idx, 0)"
                    ), {
                        "title": ms_title,
                        "path_id": path_ids[path_title],
                        "idx": ass_id
                    })
                    conn.commit()
                    ms_id = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()
                else:
                    ms_id = ms_row[0]

                # Check if assignment exists
                ass_exists = conn.execute(text("SELECT COUNT(*) FROM assignments WHERE assignment_id = :id"), {"id": ass_id}).scalar()
                if not ass_exists:
                    conn.execute(text(
                        "INSERT INTO assignments (assignment_id, milestone_id, title, description, assignment_type, is_deleted) "
                        "VALUES (:id, :ms_id, :title, :desc, 'GITHUB_PR', 0)"
                    ), {
                        "id": ass_id,
                        "ms_id": ms_id,
                        "title": ass_title,
                        "desc": ass_desc
                    })
                    conn.commit()

            # 6-8. One-time cleanup: correct IDs, deduplicate, add unique constraint
            #       Only runs if the unique constraint hasn't been created yet.
            idx_exists = conn.execute(text(
                "SELECT COUNT(*) FROM information_schema.STATISTICS "
                "WHERE TABLE_SCHEMA = :db AND TABLE_NAME = 'student_progress' AND INDEX_NAME = 'uq_student_item'"
            ), {"db": db_name}).scalar()

            if not idx_exists:
                # 6. Correct any mismatched student_ids (user_id stored instead of profile_id)
                try:
                    conn.execute(text(
                        "UPDATE student_progress sp "
                        "JOIN student_profiles p ON sp.student_id = p.user_id "
                        "SET sp.student_id = p.profile_id"
                    ))
                    conn.commit()
                except Exception as e:
                    conn.rollback()
                    print(f"[safe_migrate] WARNING: Could not correct mismatched student IDs: {e}")

                # 7. Deduplicate (keep COMPLETED or latest progress_id)
                try:
                    conn.execute(text(
                        "DELETE sp1 FROM student_progress sp1 "
                        "INNER JOIN student_progress sp2 "
                        "ON sp1.student_id = sp2.student_id "
                        "AND sp1.item_id = sp2.item_id "
                        "AND sp1.item_type = sp2.item_type "
                        "AND sp1.status != 'COMPLETED' "
                        "AND sp2.status = 'COMPLETED'"
                    ))
                    conn.commit()
                    conn.execute(text(
                        "DELETE sp1 FROM student_progress sp1 "
                        "INNER JOIN student_progress sp2 "
                        "ON sp1.student_id = sp2.student_id "
                        "AND sp1.item_id = sp2.item_id "
                        "AND sp1.item_type = sp2.item_type "
                        "AND sp1.progress_id < sp2.progress_id"
                    ))
                    conn.commit()
                except Exception as e:
                    conn.rollback()
                    print(f"[safe_migrate] WARNING: Dedup failed: {e}")

                # 8. Create unique constraint
                try:
                    conn.execute(text(
                        "ALTER TABLE `student_progress` "
                        "ADD UNIQUE KEY `uq_student_item` (`student_id`, `item_id`, `item_type`)"
                    ))
                    conn.commit()
                    print("[safe_migrate] Created UNIQUE index `uq_student_item` on `student_progress`.")
                except Exception as e:
                    conn.rollback()
                    print(f"[safe_migrate] WARNING: Could not create unique key: {e}")

            # 9. Initialize all existing students (Optimized via a single batch SELECT query and O(1) in-memory checks)
            student_profiles = conn.execute(text("SELECT profile_id FROM student_profiles")).fetchall()
            
            # Fetch all existing assignment progress entries at once
            existing_progress = conn.execute(text(
                "SELECT student_id, item_id FROM student_progress "
                "WHERE item_type = 'Assignment'"
            )).fetchall()
            existing_set = {(p[0], p[1]) for p in existing_progress}

            initialized_count = 0
            for (prof_id,) in student_profiles:
                for ass_id, *rest in assignments_to_seed:
                    if (prof_id, ass_id) not in existing_set:
                        conn.execute(text(
                            "INSERT INTO student_progress (student_id, item_id, item_type, status, is_deleted) "
                            "VALUES (:prof_id, :ass_id, 'Assignment', 'NOT_STARTED', 0)"
                        ), {"prof_id": prof_id, "ass_id": ass_id})
                        initialized_count += 1
            if initialized_count > 0:
                conn.commit()
                print(f"[safe_migrate] Initialized {initialized_count} student_progress rows for existing students.")

        except Exception as e:
            conn.rollback()
            print(f"[safe_migrate] WARNING: Failed to seed learning/progress data: {e}")
