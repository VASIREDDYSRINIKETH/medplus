"""
SQLAlchemy ORM model for the medicines table.
Matches the provided PostgreSQL schema exactly.
"""

from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    salt = Column(String(100), nullable=False)
    stock = Column(Integer, nullable=False)
    reorder_level = Column(Integer, nullable=False)
    expiry_date = Column(Date, nullable=False)
    supplier_email = Column(String(150), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
