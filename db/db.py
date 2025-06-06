from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
import urllib.parse
import logging
from sqlalchemy.exc import OperationalError, SQLAlchemyError
import time
import sys

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

def validate_env():
    """Validate that all required environment variables are set."""
    required_vars = [
        "MYSQL_URL",
        "MYSQLHOST",
        "MYSQLPORT",
        "MYSQLUSER",
        "MYSQLPASSWORD",
        "MYSQLDATABASE"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.error("Missing required environment variables: %s", ", ".join(missing_vars))
        return False
    
    logger.info("All required environment variables are set")
    return True

def get_database_url():
    """Get and validate the database URL."""
    # Validate environment variables first
    if not validate_env():
        raise ValueError("Missing required environment variables")

    # Try to get the internal MYSQL_URL first (for Railway deployment)
    DATABASE_URL = os.getenv("MYSQL_URL")
    logger.info("Using MYSQL_URL from environment")
    
    # If MYSQL_URL is not set, construct it from individual components
    if not DATABASE_URL:
        host = os.getenv("MYSQLHOST")
        port = os.getenv("MYSQLPORT")
        user = os.getenv("MYSQLUSER")
        password = os.getenv("MYSQLPASSWORD")
        database = os.getenv("MYSQLDATABASE")
        
        if not all([host, port, user, password, database]):
            raise ValueError("Missing required database configuration")
        
        # URL encode the password to handle special characters
        password = urllib.parse.quote_plus(password)
        
        DATABASE_URL = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
    
    logger.info("Database URL configured successfully")

    try:
        # Parse the DATABASE_URL to ensure it's in the correct format
        if DATABASE_URL.startswith('mysql://'):
            # Convert to SQLAlchemy format
            parsed = urllib.parse.urlparse(DATABASE_URL)
            
            # Extract components
            username = parsed.username or os.getenv("MYSQLUSER")
            password = parsed.password or os.getenv("MYSQLPASSWORD")
            # URL encode the password
            password = urllib.parse.quote_plus(password)
            hostname = parsed.hostname or os.getenv("MYSQLHOST")
            port = parsed.port or os.getenv("MYSQLPORT")
            database = parsed.path.lstrip('/') or os.getenv("MYSQLDATABASE")

            # Construct the URL
            sqlalchemy_url = f"mysql+mysqlconnector://{username}:{password}@{hostname}:{port}/{database}"
            logger.info("SQLAlchemy URL constructed successfully")
            return sqlalchemy_url
    except Exception as e:
        logger.error("Error parsing DATABASE_URL: %s", str(e))
        raise

# Get the database URL
try:
    DATABASE_URL = get_database_url()
except Exception as e:
    logger.error("Failed to configure database URL: %s", str(e))
    sys.exit(1)

# Add additional connection parameters
if '?' not in DATABASE_URL:
    DATABASE_URL += "?charset=utf8mb4"

logger.info("Creating database engine...")
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Enable connection health checks
    pool_recycle=3600,   # Recycle connections after 1 hour
    pool_size=5,         # Maintain a pool of 5 connections
    max_overflow=10,     # Allow up to 10 additional connections
    pool_timeout=30,     # Wait up to 30 seconds for a connection from the pool
    echo=True,           # Enable SQL query logging
    connect_args={
        "connect_timeout": 10,  # 10 seconds timeout
        "use_pure": True,       # Use pure Python implementation
        "auth_plugin": "mysql_native_password",  # Use native password authentication
        "password": os.getenv("MYSQLPASSWORD"),  # Explicitly pass password
        "autocommit": True,     # Enable autocommit
        "charset": "utf8mb4"    # Use UTF-8 encoding
    }
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def get_db():
    """Get database session with retry logic."""
    max_retries = 5  # Reduced to 5 retries
    retry_delay = 1  # seconds
    
    for attempt in range(max_retries):
        try:
            db = SessionLocal()
            # Test the connection
            db.execute(text("SELECT 1"))
            return db
        except (OperationalError, SQLAlchemyError) as e:
            logger.warning("Database connection attempt %d failed: %s", attempt + 1, str(e))
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
                continue
            raise
        except Exception as e:
            logger.error("Unexpected error during database connection: %s", str(e))
            raise
