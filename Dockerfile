FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create a script to check database connection
COPY <<'EOF' /app/check_db.py
#!/usr/bin/env python3
import os
import time
import mysql.connector
import logging
import sys
from urllib.parse import urlparse, unquote

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def validate_env():
    """Validate that all required environment variables are set."""
    # Check for MYSQL_URL first
    if os.getenv("MYSQL_URL"):
        logger.info("Using MYSQL_URL from environment")
        return True
        
    # Check for Railway format variables
    required_vars = [
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

def parse_mysql_url(url):
    """Parse MySQL URL and return connection parameters."""
    if not url.startswith("mysql://"):
        raise ValueError("Invalid MYSQL_URL format. Must start with mysql://")
    
    parsed = urlparse(url)
    
    # URL decode the password to handle special characters
    password = unquote(parsed.password) if parsed.password else ""
    
    return {
        "host": parsed.hostname,
        "port": parsed.port or 3306,
        "user": parsed.username,
        "password": password,
        "database": parsed.path.lstrip("/")
    }

def check_db():
    """Check database connection with retry logic."""
    max_attempts = 5  # Reduced to 5 retries
    attempt = 0
    
    while attempt < max_attempts:
        try:
            # Get connection details
            if os.getenv("MYSQL_URL"):
                # Parse MYSQL_URL
                url = os.getenv("MYSQL_URL")
                try:
                    conn_params = parse_mysql_url(url)
                    logger.info("Successfully parsed MYSQL_URL")
                except ValueError as e:
                    logger.error("Failed to parse MYSQL_URL: %s", str(e))
                    return False
            else:
                # Use Railway format variables
                conn_params = {
                    "host": os.getenv("MYSQLHOST"),
                    "port": int(os.getenv("MYSQLPORT", "3306")),
                    "user": os.getenv("MYSQLUSER"),
                    "password": os.getenv("MYSQLPASSWORD"),
                    "database": os.getenv("MYSQLDATABASE")
                }
                logger.info("Using Railway format variables")
            
            logger.info("Attempting to connect to database at %s:%s as user %s", 
                       conn_params["host"], conn_params["port"], conn_params["user"])
            
            # Try to connect
            conn = mysql.connector.connect(
                **conn_params,
                connect_timeout=10,
                auth_plugin='mysql_native_password'
            )
            
            if conn.is_connected():
                logger.info("Successfully connected to database")
                conn.close()
                return True
            
        except Exception as e:
            attempt += 1
            logger.warning("Database connection attempt %d failed: %s", attempt, str(e))
            if attempt < max_attempts:
                time.sleep(2)
            else:
                logger.error("Failed to connect to database after %d attempts", max_attempts)
                return False
    
    return False

if __name__ == "__main__":
    logger.info("Validating environment variables...")
    if not validate_env():
        sys.exit(1)
    
    logger.info("Checking database connection...")
    if not check_db():
        sys.exit(1)
    
    logger.info("Database connection successful")
EOF

# Make the script executable
RUN chmod +x /app/check_db.py

# Create startup script
RUN echo '#!/bin/bash\n\
\n\
# Run database check\n\
python /app/check_db.py\n\
if [ $? -ne 0 ]; then\n\
    echo "Database check failed"\n\
    exit 1\n\
fi\n\
\n\
# Run migrations\n\
alembic upgrade head\n\
\n\
# Start the application\n\
exec gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120 --keep-alive 5 --log-level info\n\
' > /app/start.sh

# Make startup script executable
RUN chmod +x /app/start.sh

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Expose the port
EXPOSE $PORT

# Run the startup script
CMD ["/app/start.sh"] 