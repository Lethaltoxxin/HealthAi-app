from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
from datetime import datetime

router = APIRouter(prefix="/api/events", tags=["Events"])
logger = logging.getLogger(__name__)

class EventLog(BaseModel):
    event_type: str
    payload: Dict[str, Any]
    timestamp: Optional[str] = None

@router.post("/", status_code=201)
async def log_event(event: EventLog):
    try:
        # In a real app, this would go to a DB or ELK stack
        # For now, structured logging to stdout
        log_entry = {
            "timestamp": event.timestamp or datetime.utcnow().isoformat(),
            "type": event.event_type,
            "data": event.payload
        }
        logger.info(f"EVENT_LOG: {log_entry}")
        return {"status": "recorded", "id": "evt_" + datetime.now().strftime("%Y%m%d%H%M%S")}
    except Exception as e:
        logger.error(f"Failed to log event: {str(e)}")
        raise HTTPException(status_code=500, detail="Event logging failed")
