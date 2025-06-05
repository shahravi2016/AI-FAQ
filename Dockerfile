FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    default-mysql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy migrations directory first
COPY migrations/ migrations/

# Copy alembic.ini
COPY alembic.ini .

# Copy the rest of the application
COPY . .

# Create startup script with migrations and health checks
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "Starting application..."\n\
\n\
# Function to check if port is available\n\
check_port() {\n\
    netstat -tuln | grep -q ":$1 "\n\
    return $?\n\
}\n\
\n\
# Wait for port 8000 to be available\n\
echo "Checking if port 8000 is available..."\n\
if check_port 8000; then\n\
    echo "Port 8000 is already in use"\n\
    exit 1\n\
fi\n\
\n\
# Run database migrations\n\
echo "Running database migrations..."\n\
alembic upgrade head || { echo "Migration failed"; exit 1; }\n\
echo "Migrations completed successfully"\n\
\n\
# Start the application with gunicorn for better production handling\n\
echo "Starting FastAPI application with gunicorn..."\n\
exec gunicorn main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --log-level debug --timeout 120 --keep-alive 5 --max-requests 1000 --max-requests-jitter 50' > /app/start.sh && \
chmod +x /app/start.sh

# Install gunicorn
RUN pip install gunicorn

# Command to run the application
CMD ["/app/start.sh"] 