from fastapi import FastAPI, Depends, HTTPException
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
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://ai-faq-pied.vercel.app/").split(",")

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
async def health_check(db: Session = Depends(get_db)):
    try:
        logger.info("Health check started")
        
        # Check database connection
        try:
            db.execute(text("SELECT 1"))
            db.commit()
            logger.info("Database connection successful")
        except Exception as db_error:
            logger.error(f"Database connection failed: {str(db_error)}")
            logger.error(traceback.format_exc())
            raise HTTPException(
                status_code=503,
                detail=f"Database connection failed: {str(db_error)}"
            )

        return {
            "status": "healthy",
            "database": "connected",
            "version": "1.0.0",
            "environment": os.getenv("ENVIRONMENT", "production")
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Health check failed: {str(e)}"
        )

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
