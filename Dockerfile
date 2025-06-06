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
RUN echo '#!/usr/bin/env python3\n\
import os\n\
import time\n\
import mysql.connector\n\
import logging\n\
import sys\n\
\n\
# Configure logging\n\
logging.basicConfig(level=logging.INFO)\n\
logger = logging.getLogger(__name__)\n\
\n\
def validate_env():\n\
    """Validate that all required environment variables are set."""\n\
    # Check for either MYSQL_URL/DATABASE_URL or individual components\n\
    if os.getenv("MYSQL_URL") or os.getenv("DATABASE_URL"):\n\
        logger.info("Using MYSQL_URL/DATABASE_URL from environment")\n\
        return True\n\
        \n\
    # Check for individual components\n\
    required_vars = [\n\
        "MYSQL_HOST",\n\
        "MYSQL_PORT",\n\
        "MYSQL_USER",\n\
        "MYSQL_PASSWORD",\n\
        "MYSQL_DATABASE"\n\
    ]\n\
    \n\
    missing_vars = []\n\
    for var in required_vars:\n\
        if not os.getenv(var):\n\
            missing_vars.append(var)\n\
    \n\
    if missing_vars:\n\
        logger.error("Missing required environment variables: %s", ", ".join(missing_vars))\n\
        return False\n\
    \n\
    logger.info("All required environment variables are set")\n\
    return True\n\
\n\
def check_db():\n\
    """Check database connection with retry logic."""\n\
    max_attempts = 5  # Reduced to 5 retries\n\
    attempt = 0\n\
    \n\
    while attempt < max_attempts:\n\
        try:\n\
            # Get connection details\n\
            if os.getenv("MYSQL_URL") or os.getenv("DATABASE_URL"):\n\
                # Parse MYSQL_URL/DATABASE_URL\n\
                url = os.getenv("MYSQL_URL") or os.getenv("DATABASE_URL")\n\
                if url.startswith("mysql://"):\n\
                    url = url.replace("mysql://", "mysql+mysqlconnector://")\n\
                \n\
                # Extract components from URL\n\
                from urllib.parse import urlparse\n\
                parsed = urlparse(url)\n\
                host = parsed.hostname\n\
                port = parsed.port or 3306\n\
                user = parsed.username\n\
                password = parsed.password\n\
                database = parsed.path.lstrip("/")\n\
            else:\n\
                # Use individual environment variables\n\
                host = os.getenv("MYSQL_HOST")\n\
                port = int(os.getenv("MYSQL_PORT", "3306"))\n\
                user = os.getenv("MYSQL_USER")\n\
                password = os.getenv("MYSQL_PASSWORD")\n\
                database = os.getenv("MYSQL_DATABASE")\n\
            \n\
            logger.info("Attempting to connect to database at %s:%s", host, port)\n\
            \n\
            # Try to connect\n\
            conn = mysql.connector.connect(\n\
                host=host,\n\
                port=port,\n\
                user=user,\n\
                password=password,\n\
                database=database,\n\
                connect_timeout=10\n\
            )\n\
            \n\
            if conn.is_connected():\n\
                logger.info("Successfully connected to database")\n\
                conn.close()\n\
                return True\n\
            \n\
        except Exception as e:\n\
            attempt += 1\n\
            logger.warning("Database connection attempt %d failed: %s", attempt, str(e))\n\
            if attempt < max_attempts:\n\
                time.sleep(2)\n\
            else:\n\
                logger.error("Failed to connect to database after %d attempts", max_attempts)\n\
                return False\n\
    \n\
    return False\n\
\n\
if __name__ == "__main__":\n\
    logger.info("Validating environment variables...")\n\
    if not validate_env():\n\
        sys.exit(1)\n\
    \n\
    logger.info("Checking database connection...")\n\
    if not check_db():\n\
        sys.exit(1)\n\
    \n\
    logger.info("Database connection successful")\n\
' > /app/check_db.py

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