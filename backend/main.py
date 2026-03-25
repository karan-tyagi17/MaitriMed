"""
MaitriMed — FastAPI Backend
Run: uvicorn main:app --reload --port 8000
"""

import os
import sqlite3
import uuid
from datetime import datetime
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from rag import query_rag
from symptom_check import check_symptoms

load_dotenv()


# ── Database setup ──────────────────────────────────────────────────────────

def init_db():
    conn = sqlite3.connect("maitri_med.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS chat_logs (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            query TEXT,
            answer TEXT,
            language TEXT,
            rating INTEGER,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()


def log_chat(session_id: str, query: str, answer: str, language: str = "en"):
    conn = sqlite3.connect("maitri_med.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO chat_logs VALUES (?,?,?,?,?,?,?)",
        (str(uuid.uuid4()), session_id, query, answer, language, None, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()


def get_stats():
    conn = sqlite3.connect("maitri_med.db")
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM chat_logs")
    total = c.fetchone()[0]
    c.execute("SELECT language, COUNT(*) FROM chat_logs GROUP BY language")
    by_lang = dict(c.fetchall())
    conn.close()
    return {"total_queries": total, "by_language": by_lang}


# ── Lifespan ────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("[✓] MaitriMed backend started")
    yield


# ── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="MaitriMed API",
    description="AI-Driven Public Health Chatbot for Disease Awareness — SIH25049",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ──────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    language: Optional[str] = "en"


class ChatResponse(BaseModel):
    answer: str
    sources: list
    session_id: str


class SymptomRequest(BaseModel):
    primary_symptom: str
    duration_days: int
    severity: str
    extra_symptoms: Optional[str] = None


class FeedbackRequest(BaseModel):
    session_id: str
    rating: int


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "app": "MaitriMed",
        "tagline": "Your friendly health companion, in your language.",
        "ps": "SIH25049",
        "status": "running",
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    session_id = req.session_id or str(uuid.uuid4())

    try:
        result = query_rag(req.message)
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Knowledge base not ready. Run: python ingest.py",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG error: {str(e)}")

    log_chat(session_id, req.message, result["answer"], req.language or "en")

    return ChatResponse(
        answer=result["answer"],
        sources=result["sources"],
        session_id=session_id,
    )


@app.post("/symptom-check")
async def symptom_check(req: SymptomRequest):
    if req.severity not in ["mild", "moderate", "severe"]:
        raise HTTPException(status_code=400, detail="severity must be mild, moderate, or severe")
    if req.duration_days < 0 or req.duration_days > 365:
        raise HTTPException(status_code=400, detail="duration_days must be between 0 and 365")

    return check_symptoms(
        primary_symptom=req.primary_symptom,
        duration_days=req.duration_days,
        severity=req.severity,
        extra_symptoms=req.extra_symptoms,
    )


@app.get("/topics")
def get_topics():
    return {
        "diseases": [
            {"id": "dengue",        "name": "Dengue Fever",      "icon": "🦟", "season": "Monsoon"},
            {"id": "malaria",       "name": "Malaria",            "icon": "🦟", "season": "Monsoon"},
            {"id": "cholera",       "name": "Cholera",            "icon": "💧", "season": "Monsoon"},
            {"id": "tuberculosis",  "name": "Tuberculosis (TB)",  "icon": "🫁", "season": "Year-round"},
            {"id": "typhoid",       "name": "Typhoid",            "icon": "🌡️", "season": "Monsoon"},
            {"id": "diarrhoea",     "name": "Diarrhoea",          "icon": "💊", "season": "Monsoon"},
            {"id": "pneumonia",     "name": "Pneumonia",          "icon": "🫁", "season": "Winter"},
            {"id": "hepatitis",     "name": "Hepatitis B",        "icon": "🩺", "season": "Year-round"},
            {"id": "covid",         "name": "COVID-19",           "icon": "🦠", "season": "Year-round"},
            {"id": "leptospirosis", "name": "Leptospirosis",      "icon": "🌊", "season": "Post-flood"},
        ]
    }


@app.get("/nearby-centers")
def nearby_centers(lat: float = 20.2961, lng: float = 85.8245):
    """Returns nearest PHCs — static dataset for Odisha demo."""
    import math

    centers = [
        {"name": "Bhubaneswar PHC Unit-1",   "lat": 20.2961, "lng": 85.8245, "phone": "0674-2536824"},
        {"name": "Cuttack District Hospital", "lat": 20.4625, "lng": 85.8830, "phone": "0671-2304290"},
        {"name": "Puri PHC",                  "lat": 19.8135, "lng": 85.8312, "phone": "06752-223752"},
        {"name": "Berhampur District Hospital","lat": 19.3149, "lng": 84.7941, "phone": "0680-2224330"},
        {"name": "Sambalpur PHC",             "lat": 21.4669, "lng": 83.9812, "phone": "0663-2528124"},
        {"name": "Rourkela Government Hospital","lat": 22.2604,"lng": 84.8536, "phone": "0661-2510261"},
    ]

    def haversine(lat1, lng1, lat2, lng2):
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
        return R * 2 * math.asin(math.sqrt(a))

    for c in centers:
        c["distance_km"] = round(haversine(lat, lng, c["lat"], c["lng"]), 1)

    centers.sort(key=lambda x: x["distance_km"])
    return {"centers": centers[:4], "emergency": "108 (Free Ambulance) | 104 (Health Helpline)"}


@app.post("/feedback")
def feedback(req: FeedbackRequest):
    if req.rating not in [1, 2, 3, 4, 5]:
        raise HTTPException(status_code=400, detail="Rating must be 1–5")
    conn = sqlite3.connect("maitri_med.db")
    c = conn.cursor()
    c.execute(
        "UPDATE chat_logs SET rating=? WHERE session_id=? ORDER BY timestamp DESC LIMIT 1",
        (req.rating, req.session_id),
    )
    conn.commit()
    conn.close()
    return {"status": "ok", "message": "Thank you for your feedback!"}


@app.get("/stats")
def stats():
    return get_stats()