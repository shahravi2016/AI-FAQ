FROM python:3.9-slim

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

# Create a script to validate environment variables
RUN echo '#!/usr/bin/env python3\n\
import os\n\
import sys\n\
import logging\n\
\n\
logging.basicConfig(level=logging.INFO)\n\
logger = logging.getLogger(__name__)\n\
\n\
def validate_env():\n\
    required_vars = [\n\
        "MYSQL_URL",\n\
        "MYSQLHOST",\n\
        "MYSQLPORT",\n\
        "MYSQLUSER",\n\
        "MYSQLPASSWORD",\n\
        "MYSQLDATABASE"\n\
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
if __name__ == "__main__":\n\
    if not validate_env():\n\
        sys.exit(1)\n\
' > validate_env.py

RUN chmod +x validate_env.py

# Create a script to check database connection
RUN echo '#!/usr/bin/env python3\n\
import os\n\
import time\n\
import logging\n\
from sqlalchemy import create_engine\n\
from sqlalchemy.exc import OperationalError\n\
\n\
logging.basicConfig(level=logging.INFO)\n\
logger = logging.getLogger(__name__)\n\
\n\
def check_db():\n\
    max_attempts = 5  # Reduced to 5 attempts\n\
    attempt = 0\n\
    \n\
    # Get database URL from environment\n\
    db_url = os.getenv("MYSQL_URL")\n\
    if not db_url:\n\
        # Construct from individual components\n\
        host = os.getenv("MYSQLHOST")\n\
        port = os.getenv("MYSQLPORT")\n\
        user = os.getenv("MYSQLUSER")\n\
        password = os.getenv("MYSQLPASSWORD")\n\
        database = os.getenv("MYSQLDATABASE")\n\
        \n\
        if not all([host, port, user, password, database]):\n\
            logger.error("Missing required database configuration")\n\
            return False\n\
        \n\
        db_url = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"\n\
    \n\
    logger.info("Using database URL: %s", db_url)\n\
    \n\
    while attempt < max_attempts:\n\
        try:\n\
            logger.info("Attempting to connect to database (attempt %d/%d)", attempt + 1, max_attempts)\n\
            engine = create_engine(\n\
                db_url,\n\
                connect_args={\n\
                    "connect_timeout": 10,\n\
                    "use_pure": True,\n\
                    "auth_plugin": "mysql_native_password",\n\
                    "password": os.getenv("MYSQLPASSWORD")\n\
                }\n\
            )\n\
            with engine.connect() as conn:\n\
                conn.execute("SELECT 1")\n\
            logger.info("Database connection successful!")\n\
            return True\n\
        except Exception as e:\n\
            attempt += 1\n\
            logger.warning("Database connection attempt %d failed: %s", attempt, str(e))\n\
            if attempt < max_attempts:\n\
                time.sleep(2)\n\
            else:\n\
                logger.error("Max attempts reached. Could not connect to database.")\n\
                return False\n\
\n\
if __name__ == "__main__":\n\
    check_db()\n\
' > check_db.py

RUN chmod +x check_db.py

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "Validating environment variables..."\n\
python validate_env.py\n\
\n\
echo "Waiting for database to be ready..."\n\
python check_db.py\n\
\n\
echo "Running database migrations..."\n\
alembic upgrade head\n\
\n\
echo "Starting application..."\n\
exec uvicorn main:app --host 0.0.0.0 --port $PORT\n\
' > start.sh

RUN chmod +x start.sh

# Expose the port
EXPOSE $PORT

# Start the application
CMD ["./start.sh"] 