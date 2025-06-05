FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create database check script
RUN echo 'import time\n\
import os\n\
from sqlalchemy import create_engine, text\n\
from sqlalchemy.exc import OperationalError\n\
\n\
def check_db():\n\
    try:\n\
        engine = create_engine(os.getenv("DATABASE_URL"))\n\
        with engine.connect() as conn:\n\
            conn.execute(text("SELECT 1"))\n\
            conn.commit()\n\
        return True\n\
    except Exception as e:\n\
        print(f"Database connection failed: {str(e)}")\n\
        return False\n\
\n\
print("Waiting for database to be ready...")\n\
for i in range(30):\n\
    if check_db():\n\
        print("Database is ready!")\n\
        exit(0)\n\
    print(f"Attempt {i+1}: Database not ready yet. Waiting...")\n\
    time.sleep(2)\n\
\n\
print("Database connection timeout after 60 seconds")\n\
exit(1)' > /app/check_db.py

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "Checking database connection..."\n\
python /app/check_db.py || exit 1\n\
\n\
echo "Starting database migrations..."\n\
alembic upgrade head || { echo "Migration failed"; exit 1; }\n\
echo "Migrations completed successfully"\n\
\n\
echo "Starting FastAPI application..."\n\
exec uvicorn main:app --host 0.0.0.0 --port 8000 --log-level debug' > /app/start.sh && \
chmod +x /app/start.sh

# Command to run the application
CMD ["/app/start.sh"] 