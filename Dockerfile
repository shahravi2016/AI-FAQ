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