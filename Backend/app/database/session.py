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
    ]
    
    with engine.connect() as conn:
        # Get the current database name
        result = conn.execute(text(db_name_query))
        db_name = result.scalar()
        
        for table, column, col_def in columns_to_add:
            # Check if column already exists via INFORMATION_SCHEMA
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
