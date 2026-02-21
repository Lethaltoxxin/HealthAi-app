from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.workout_generator import generator

router = APIRouter(prefix="/api/workout", tags=["Workout Generator"])

class WorkoutRequest(BaseModel):
    goal: str = "general" # strength, hypertrophy, loose_weight
    level: str = "beginner" 
    equipment: List[str] = [] 
    days_per_week: int = 3
    injuries: List[str] = []

@router.post("/generate")
async def generate_workout(req: WorkoutRequest):
    try:
        profile = {
            "goal": req.goal,
            "level": req.level,
            "equipment": req.equipment,
            "days_per_week": req.days_per_week,
            "injuries": req.injuries
        }
        plan = generator.generate(profile)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
