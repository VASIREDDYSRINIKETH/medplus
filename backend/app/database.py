"""
Database connection and session management.
Uses SQLAlchemy with PostgreSQL via psycopg2.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# PostgreSQL connection string
# Format: postgresql://user:password@host:port/dbname
DATABASE_URL = "postgresql://postgres:12345@localhost:5432/medplus"

engine = create_engine(DATABASE_URL, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    Dependency that provides a database session per request.
    Ensures the session is closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
