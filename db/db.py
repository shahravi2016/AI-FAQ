from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
import urllib.parse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

def get_database_url():
    """Get and validate the database URL."""
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")

    logger.info(f"Original DATABASE_URL: {DATABASE_URL}")

    try:
        # Parse the DATABASE_URL to ensure it's in the correct format
        if DATABASE_URL.startswith('mysql://'):
            # Already in correct format
            return DATABASE_URL
        else:
            # Convert to SQLAlchemy format if needed
            parsed = urllib.parse.urlparse(DATABASE_URL)
            
            # Extract components
            username = parsed.username or os.getenv("MYSQL_USER", "root")
            password = parsed.password or os.getenv("MYSQL_PASSWORD", "")
            hostname = parsed.hostname or os.getenv("MYSQL_HOST", "localhost")
            port = parsed.port or os.getenv("MYSQL_PORT", "3306")
            database = parsed.path.lstrip('/') or os.getenv("MYSQL_DATABASE", "faq_db")

            # Construct the URL
            sqlalchemy_url = f"mysql+mysqlconnector://{username}:{password}@{hostname}:{port}/{database}"
            logger.info(f"Constructed SQLAlchemy URL: {sqlalchemy_url}")
            return sqlalchemy_url
    except Exception as e:
        logger.error(f"Error parsing DATABASE_URL: {str(e)}")
        raise

# Get the database URL
DATABASE_URL = get_database_url()

# Add additional connection parameters
if '?' not in DATABASE_URL:
    DATABASE_URL += "?charset=utf8mb4"

logger.info("Creating database engine...")
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=5,
    max_overflow=10,
    echo=True  # Enable SQL query logging
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
