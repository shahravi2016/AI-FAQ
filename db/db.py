from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
import urllib.parse

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Parse the DATABASE_URL to ensure it's in the correct format
if DATABASE_URL.startswith('mysql://'):
    # Already in correct format
    pass
else:
    # Convert to SQLAlchemy format if needed
    parsed = urllib.parse.urlparse(DATABASE_URL)
    DATABASE_URL = f"mysql+mysqlconnector://{parsed.username}:{parsed.password}@{parsed.hostname}:{parsed.port}{parsed.path}"

# Add additional connection parameters
DATABASE_URL += "?charset=utf8mb4"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=5,
    max_overflow=10
)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()
