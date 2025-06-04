from db.db import engine
from db.models import Base
from db.db import SessionLocal
from db.models import Question
from datetime import datetime

Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    try:
        questions = [   
            Question(
                question="How to implement authentication?",
                response="Use JWT tokens...",
                category="technical",
                importance=9.5,
                is_critical=1,
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            Question(
                question="What is machine learning?",
                response="Machine learning is...",
                category="educational",
                importance=8.5,
                is_critical=0,
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            Question(
                question="How to fix database connection?",
                response="Check your connection string...",
                category="database",
                importance=9.0,
                is_critical=1,
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            Question(
                question="What is the best way to learn programming?",
                response="Start with basics...",
                category="educational",
                importance=7.5,
                is_critical=0,
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            Question(
                question="How to optimize website performance?",
                response="Use caching...",
                category="performance",
                importance=8.0,
                is_critical=1,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        ]

        for question in questions:
            db.add(question)
        
        db.commit()
        print("Test data added successfully!")
    except Exception as e:
        print(f"Error adding test data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
