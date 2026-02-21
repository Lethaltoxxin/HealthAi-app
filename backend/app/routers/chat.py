from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.chat_orchestrator import orchestrator

router = APIRouter(prefix="/api/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    user_id: Optional[str] = "guest"
    message: str
    context: Optional[Dict] = {}

class ChatResponse(BaseModel):
    message: str
    intent: str
    actions: List[Dict[str, str]] = []
    data: Optional[Dict] = None

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        response = orchestrator.process_message(req.message, req.context)
        return {
            "message": response["text"],
            "intent": response["intent"],
            "actions": response["actions"],
            "data": response["data"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
