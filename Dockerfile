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

# Create startup script with error handling
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Starting database migrations..."\n\
alembic upgrade head || { echo "Migration failed"; exit 1; }\n\
echo "Migrations completed successfully"\n\
echo "Starting FastAPI application..."\n\
exec uvicorn main:app --host 0.0.0.0 --port 8000 --log-level debug' > /app/start.sh && \
chmod +x /app/start.sh

# Command to run the application
CMD ["/app/start.sh"] 