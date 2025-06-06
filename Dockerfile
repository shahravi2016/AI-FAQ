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
    max_attempts = 30\n\
    attempt = 0\n\
    while attempt < max_attempts:\n\
        try:\n\
            # Get database URL from environment\n\
            db_url = os.getenv("MYSQL_URL")\n\
            logger.info("MYSQL_URL from env: %s", db_url)\n\
            \n\
            if not db_url:\n\
                # Construct from individual components\n\
                host = os.getenv("MYSQLHOST", "mysql.railway.internal")\n\
                port = os.getenv("MYSQLPORT", "3306")\n\
                user = os.getenv("MYSQLUSER", "root")\n\
                password = os.getenv("MYSQLPASSWORD", "")\n\
                database = os.getenv("MYSQLDATABASE", "railway")\n\
                \n\
                logger.info("Constructing URL from components:")\n\
                logger.info("Host: %s", host)\n\
                logger.info("Port: %s", port)\n\
                logger.info("User: %s", user)\n\
                logger.info("Database: %s", database)\n\
                \n\
                db_url = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"\n\
            \n\
            logger.info("Attempting to connect to database (attempt %d/%d)", attempt + 1, max_attempts)\n\
            engine = create_engine(\n\
                db_url,\n\
                connect_args={\n\
                    "connect_timeout": 10,\n\
                    "use_pure": True,\n\
                    "auth_plugin": "mysql_native_password",\n\
                    "password": os.getenv("MYSQLPASSWORD", "")\n\
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
\n\
# Wait for database to be ready\n\
python check_db.py\n\
\n\
# Run migrations\n\
alembic upgrade head\n\
\n\
# Start the application\n\
exec uvicorn main:app --host 0.0.0.0 --port $PORT\n\
' > start.sh

RUN chmod +x start.sh

# Expose the port
EXPOSE $PORT

# Start the application
CMD ["./start.sh"] 