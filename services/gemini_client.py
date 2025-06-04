import google.generativeai as genai
from dotenv import load_dotenv
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")  # Using gemini-pro instead of gemini-2.0-flash
except Exception as e:
    logger.error(f"Error configuring Gemini API: {str(e)}")
    raise

async def get_gemini_response(prompt: str) -> str:
    try:
        logger.info("Generating response from Gemini API...")
        response = model.generate_content(prompt)
        if not response or not response.text:
            logger.error("Empty response from Gemini API")
            return "I apologize, but I couldn't generate a response. Please try again."
        return response.text
    except Exception as e:
        logger.error(f"Error getting Gemini response: {str(e)}")
        return "I apologize, but I encountered an error. Please try again later."
