from fastapi import APIRouter, Depends, HTTPException
from services.analytics import AnalyticsService
from db.db import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/analytics")
async def get_analytics(db: Session = Depends(get_db)):
    try:
        return {
            "mostAsked": [
                {"category": str(cat), "count": count}
                for cat, count in AnalyticsService.get_most_asked_questions(db)
            ],
            "leastAsked": [
                {"category": str(cat), "count": count}
                for cat, count in AnalyticsService.get_least_asked_questions(db)
            ],
            "mostImportant": [
                {"category": str(cat), "importance": float(imp)}
                for cat, imp in AnalyticsService.get_most_important_questions(db)
            ],
            "critical": [
                {"category": str(cat), "count": count}
                for cat, count in AnalyticsService.get_critical_questions(db)
            ],
            "basic": [
                {"category": str(cat), "count": count}
                for cat, count in AnalyticsService.get_basic_questions(db)
            ],
            "technical": [
                {"category": str(cat), "count": count}
                for cat, count in AnalyticsService.get_technical_questions(db)
            ]
        }
    except Exception as e:
        print(f"Error in analytics route: {str(e)}")  # Add logging
        raise HTTPException(status_code=500, detail=str(e)) 