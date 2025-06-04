from sqlalchemy import func, desc
from db.db import SessionLocal
from db.models import Question
from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AnalyticsService:
    @staticmethod
    def get_most_asked_questions(db: Session):
        return db.query(
            Question.category,
            func.count(Question.id).label('count')
        ).group_by(Question.category).order_by(desc('count')).limit(3).all()

    @staticmethod
    def get_least_asked_questions(db: Session):
        return db.query(
            Question.category,
            func.count(Question.id).label('count')
        ).group_by(Question.category).order_by('count').limit(3).all()

    @staticmethod
    def get_most_important_questions(db: Session):
        return db.query(
            Question.category,
            func.avg(Question.importance).label('importance')
        ).group_by(Question.category).order_by(desc('importance')).limit(3).all()

    @staticmethod
    def get_critical_questions(db: Session):
        return db.query(
            Question.category,
            func.count(Question.id).label('count')
        ).filter(Question.is_critical == 1).group_by(Question.category).order_by(desc('count')).limit(3).all()

    @staticmethod
    def get_basic_questions(db: Session):
        return db.query(
            Question.category,
            func.count(Question.id).label('count')
        ).filter(Question.importance <= 5).group_by(Question.category).order_by(desc('count')).limit(3).all()

    @staticmethod
    def get_technical_questions(db: Session):
        technical_categories = [
            'technical',
            'programming',
            'infrastructure',
            'database'
        ]
        return db.query(
            Question.category,
            func.count(Question.id).label('count')
        ).filter(Question.category.in_(technical_categories)).group_by(Question.category).order_by(desc('count')).limit(3).all()

    @staticmethod
    def get_all_analytics():
        db = next(get_db())
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
        finally:
            db.close() 