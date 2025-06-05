from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes import gemini, analytics
from sqlalchemy.orm import Session
from db.db import SessionLocal, engine
from sqlalchemy import text
import logging
import sys
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(title="FAQ API", description="API for FAQ system with Gemini integration")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
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
    return {"message": "FAQ API is running"}

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
            "version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Health check failed: {str(e)}"
        )

# Include routers
app.include_router(gemini.router)
app.include_router(analytics.router, prefix="/api")

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
