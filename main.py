from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from routes import gemini, analytics
from sqlalchemy.orm import Session
from db.db import SessionLocal, engine
from sqlalchemy import text
import logging
import sys
import traceback
import os
from dotenv import load_dotenv
import time
from typing import Optional

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Get allowed origins from environment variable or use default
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "https://ai-faq-pied.vercel.app/").split(",")

app = FastAPI(
    title="FAQ API",
    description="API for FAQ system with Gemini integration",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {
        "message": "FAQ API is running",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint that verifies database connection."""
    try:
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unavailable")

# Include routers without /api prefix since it's already in the route definitions
app.include_router(gemini.router)
app.include_router(analytics.router)

# Add startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Application startup")
    try:
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection successful on startup")
    except Exception as e:
        logger.error(f"Database connection failed on startup: {str(e)}")
        logger.error(traceback.format_exc())
        raise

# Add shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutdown")

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time to response headers."""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests and responses."""
    logger.info(f"Request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request failed: {str(e)}")
        raise

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler."""
    logger.error(f"Unhandled exception: {str(exc)}")
    return {"error": "Internal server error", "detail": str(exc)}

# Database connection error handler
@app.exception_handler(Exception)
async def database_exception_handler(request: Request, exc: Exception):
    """Handle database connection errors."""
    if "database" in str(exc).lower():
        logger.error(f"Database error: {str(exc)}")
        return {"error": "Database error", "detail": str(exc)}
    raise exc
