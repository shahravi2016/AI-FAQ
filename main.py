from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import gemini, analytics

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gemini.router)
app.include_router(analytics.router, prefix="/api")
