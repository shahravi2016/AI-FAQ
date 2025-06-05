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

# Create startup script with retry logic
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Function to check if database is ready\n\
check_db() {\n\
    mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD -e "SELECT 1" > /dev/null 2>&1\n\
    return $?\n\
}\n\
\n\
# Wait for database to be ready\n\
echo "Waiting for database to be ready..."\n\
for i in {1..30}; do\n\
    if check_db; then\n\
        echo "Database is ready!"\n\
        break\n\
    fi\n\
    echo "Attempt $i: Database not ready yet. Waiting..."\n\
    sleep 2\n\
    if [ $i -eq 30 ]; then\n\
        echo "Database connection timeout after 60 seconds"\n\
        exit 1\n\
    fi\n\
done\n\
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