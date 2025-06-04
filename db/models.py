from sqlalchemy import Column, Integer, Text, DateTime, String, Float, func
from db.db import Base
import enum

class QuestionCategory(enum.Enum):
    TECHNICAL = "technical"
    CREATIVE = "creative"
    EDUCATIONAL = "educational"
    RESEARCH = "research"
    PERSONAL = "personal"
    BUSINESS = "business"
    SYSTEM = "system"
    SECURITY = "security"
    PERFORMANCE = "performance"
    GENERAL = "general"
    FAQ = "faq"
    SUPPORT = "support"
    PROGRAMMING = "programming"
    INFRASTRUCTURE = "infrastructure"
    DATABASE = "database"

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    importance = Column(Float, default=5.0)  # Scale of 1-10
    is_critical = Column(Integer, default=0)  # 0 or 1
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
