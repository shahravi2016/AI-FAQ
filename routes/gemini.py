from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from db.db import SessionLocal
from db.models import Question
from services.gemini_client import get_gemini_response
import json
import logging
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def categorize_question(question: str) -> tuple[str, float, int]:
    """
    Analyze the question content and return (category, importance, is_critical)
    """
    question = question.lower()
    
    categories = {
        'technical': ['how to', 'implement', 'code', 'programming', 'algorithm', 'technical', 'development'],
        'educational': ['explain', 'what is', 'define', 'learn', 'understand', 'basics', 'concept', 'teach'],
        'research': ['research', 'study', 'analysis', 'investigate', 'explore'],
        'security': ['security', 'secure', 'protect', 'vulnerability', 'attack', 'hack', 'get safe', 'safety'],
        'performance': ['performance', 'optimize', 'speed', 'efficient', 'scalability'],
        'database': ['database', 'storage', 'query', 'data', 'store'],
        'infrastructure': ['infrastructure', 'deploy', 'server', 'cloud', 'network'],
        'programming': ['programming', 'code', 'develop', 'software', 'application'],
        'business': ['business', 'market', 'industry', 'company', 'enterprise', 'advertise'],
        'system': ['system', 'architecture', 'design', 'structure']
    }
    
    critical_keywords = ['urgent', 'critical', 'important', 'emergency', 'security', 'vulnerability', 'destroy', 'crash', 'broke', 'broken', 'break']
    is_critical = any(keyword in question for keyword in critical_keywords)
    category = 'general'
    max_matches = 0
    
    for cat, keywords in categories.items():
        matches = sum(1 for keyword in keywords if keyword in question)
        if matches > max_matches:
            max_matches = matches
            category = cat
    
    importance = 5.0  # Default importance
    
    if is_critical:
        importance = 8.0
    
    if category in ['technical', 'educational']:
        importance = max(importance, 7.0)
    
    if 'security' in question or category == 'security':
        importance = max(importance, 9.0)
        is_critical = 1
    
    return category, importance, is_critical

@router.post("/ask")
async def ask_question(req: Request, db: Session = Depends(get_db)):
    try:
        data = await req.json()
        logger.info(f"Received question request: {data}")
    except json.JSONDecodeError:
        logger.error("Invalid JSON format in request body")
        raise HTTPException(status_code=400, detail="Invalid JSON format in request body")

    question = data.get("question", "")

    if not question:
        logger.error("Question is missing from request")
        raise HTTPException(status_code=400, detail="Question is required")

    # Categorize the question
    category, importance, is_critical = categorize_question(question)
    logger.info(f"Categorized question as: {category} (importance: {importance}, critical: {is_critical})")

    prompt = f"""
    You are an intelligent AI assistant for a web-based FAQ system. Answer questions clearly and helpfully based on any topic.
    If the user asks a question that matches the common FAQ style, provide a brief, accurate, and helpful response.
    If the question is vague or not directly answerable, respond politely and guide the user to rephrase or ask something more specific.
    Maintain a helpful, friendly, and professional tone. Do not invent information—respond with "I'm not sure, but I can look into it" when uncertain.

    Now, answer this question:

    {question}
    """

    try:
        logger.info("Getting response from Gemini API...")
        response = await get_gemini_response(prompt)
        logger.info("Successfully got response from Gemini API")
    except Exception as e:
        logger.error(f"Error getting Gemini response: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting Gemini response: {str(e)}")

    try:
        new_entry = Question(
            question=question,
            response=response,
            category=category,
            importance=importance,
            is_critical=is_critical
        )
        db.add(new_entry)
        db.commit()
        logger.info(f"Successfully saved question and response to database with category: {category}")
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"response": response}

@router.get("/questions")
def get_questions(db: Session = Depends(get_db)):
    try:
        results = db.query(Question).order_by(Question.created_at.desc()).limit(20).all()
        return [
            {
                "question": q.question,
                "response": q.response,
                "category": q.category,
                "importance": q.importance,
                "is_critical": q.is_critical,
                "created_at": q.created_at
            }
            for q in results
        ]
    except Exception as e:
        logger.error(f"Error fetching questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching questions: {str(e)}")
