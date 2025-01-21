# main.py
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import logging
from datetime import datetime

from models.database import init_db, get_db, CodeSubmission, Base
from models.schemas import (
    CodeSubmissionRequest,
    CodeSubmissionResponse,
    SecurityIssue,
    AnalysisResult
)
from services.analyzer import CodeAnalyzer
from services.vulnerability_detector import VulnerabilityDetector
from services.ai_suggester import AISuggester

app = FastAPI(title="CodeGuardian ML Service")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
code_analyzer = CodeAnalyzer()
vulnerability_detector = VulnerabilityDetector()
ai_suggester = AISuggester()

@app.on_event("startup")
async def startup():
    await init_db()

@app.post("/analyze", response_model=CodeSubmissionResponse)
async def analyze_code(
    request: CodeSubmissionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        # Create initial record in database
        submission = CodeSubmission(
            user_id=request.user_id,
            code=request.code,
            language=request.language,
            status="processing",
            submission_time=datetime.now(),
            score=None,
            results=None
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)
        
        # Schedule analysis in background
        background_tasks.add_task(
            process_code_analysis,
            submission.id,
            request.code,
            request.language,
            db
        )
        
        return CodeSubmissionResponse(
            submission_id=submission.id,
            status="processing",
            message="Code analysis started"
        )
    except Exception as e:
        logger.error(f"Error starting analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing submission")

async def process_code_analysis(
    submission_id: int,
    code: str,
    language: str,
    db: Session
):
    try:
        # Get analysis results
        security_issues = vulnerability_detector.detect(code, language)
        
        # Calculate scores
        complexity_score = code_analyzer.analyze_complexity(code)
        maintainability_score = code_analyzer.analyze_maintainability(code)
        security_score = calculate_security_score(security_issues)
        
        # Convert security issues to JSON-compatible format
        results = [
            {
                "severity": issue.severity,
                "message": issue.description,
                "line": issue.line_number,
                "recommendation": issue.recommendation
            }
            for issue in security_issues
        ]
        
        # Update submission in database
        submission = db.query(CodeSubmission).filter(CodeSubmission.id == submission_id).first()
        if submission:
            submission.status = "completed"
            submission.score = security_score
            submission.results = results
            db.commit()
    except Exception as e:
        logger.error(f"Error in analysis: {str(e)}")
        submission = db.query(CodeSubmission).filter(CodeSubmission.id == submission_id).first()
        if submission:
            submission.status = "error"
            db.commit()

def calculate_security_score(issues: List[SecurityIssue]) -> float:
    if not issues:
        return 100.0
    
    weights = {"high": 10, "medium": 5, "low": 2}
    total_weight = sum(weights[issue.severity.lower()] for issue in issues)
    max_score = 100
    
    return max(0, min(100, max_score - total_weight))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)