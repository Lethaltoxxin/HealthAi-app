from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.triage import engine

router = APIRouter(prefix="/api/symptom", tags=["Symptom Checker"])

class SymptomRequest(BaseModel):
    user_id: Optional[str] = None
    text: str # Free text description
    vitals: Optional[Dict[str, Any]] = None

class TriageResponse(BaseModel):
    triage: str # emergency, consult, self_care
    confidence: float
    reasons: List[str]
    actions: List[str]
    explain: Optional[str] = None

@router.post("/check", response_model=TriageResponse)
async def check_symptoms(req: SymptomRequest):
    try:
        result = engine.evaluate(req.text, req.vitals)
        
        # In a real system, here we would call the LLM to generate the "explain" text
        # utilizing the rules that matched. For now, we use a simple template.
        explain_text = f"Based on your report of '{req.text}', we recommend: {result['actions'][0]}"
        
        return {
            "triage": result['triage'],
            "confidence": result['confidence'],
            "reasons": result['reasons'],
            "actions": result['actions'],
            "explain": explain_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
