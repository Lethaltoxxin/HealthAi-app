from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import uvicorn
import json
from datetime import datetime
import random

app = FastAPI(title="HealthAi Prototype API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Helper: Deterministic Nutrition Engine
# -------------------------
def bmr_mifflin(weight_kg, height_cm, age, sex):
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age
    return base + (5 if sex == 'male' else -161)

activity_factors = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very_active': 1.9
}

def compute_targets(user, activity, goal, deficit_pct=0.15):
    bmr = bmr_mifflin(user['weight_kg'], user['height_cm'], user['age'], user['sex'])
    tdee = bmr * activity_factors.get(activity, 1.55)
    
    if goal == 'lose':
        target = int(tdee * (1 - deficit_pct))
    elif goal == 'gain':
        target = int(tdee * 1.15)
    else:
        target = int(tdee)
        
    protein_g = round(user['weight_kg'] * 1.8)
    fat_kcal = int(0.25 * target)
    fat_g = int(fat_kcal / 9)
    carbs_kcal = target - (protein_g * 4 + fat_g * 9)
    carbs_g = int(carbs_kcal / 4) if carbs_kcal > 0 else 0
    
    return {
        'bmr': int(bmr),
        'tdee': int(tdee),
        'target_cals': target,
        'protein_g': protein_g,
        'fat_g': fat_g,
        'carbs_g': carbs_g
    }

# -------------------------
# Simple Recipe DB
# -------------------------
SAMPLE_RECIPES = {
    "r_besan_chilla": {
        "id": "r_besan_chilla", "title": "Besan Chilla with mint chutney", "region": "north", "dietary_type": "vegetarian",
        "calories": 320, "protein_g": 14, "carbs_g": 32, "fat_g": 10, "cook_time_min": 20, "difficulty": "easy",
        "ingredients": [{"name": "besan", "qty": "80g"}, {"name": "onion", "qty": "30g"}],
        "steps": ["Mix batter", "Cook on skillet", "Serve with chutney"], "tags": ["breakfast"], "batchable": False
    },
    "r_oats_upma": {
        "id": "r_oats_upma", "title": "Oats Upma", "region": "pan-indian", "dietary_type": "vegetarian",
        "calories": 320, "protein_g": 11, "carbs_g": 48, "fat_g": 8, "cook_time_min": 18, "difficulty": "easy",
        "ingredients": [{"name": "oats", "qty": "60g"}],
        "steps": ["Roast oats", "Saute veggies", "Cook together"], "tags": ["breakfast"], "batchable": True
    },
    "r_paneer_tikka": {
        "id": "r_paneer_tikka", "title": "Grilled Paneer Tikka Salad", "region": "north", "dietary_type": "vegetarian",
        "calories": 450, "protein_g": 25, "carbs_g": 15, "fat_g": 30, "cook_time_min": 25, "difficulty": "medium",
        "ingredients": [{"name": "paneer", "qty": "200g"}, {"name": "yogurt", "qty": "50g"}],
        "steps": ["Marinate paneer", "Grill until golden", "Toss with veggies"], "tags": ["lunch", "dinner"], "batchable": True
    },
    "r_chicken_curry": {
        "id": "r_chicken_curry", "title": "Home Style Chicken Curry", "region": "north", "dietary_type": "non-vegetarian",
        "calories": 500, "protein_g": 40, "carbs_g": 10, "fat_g": 20, "cook_time_min": 40, "difficulty": "medium",
        "ingredients": [{"name": "chicken", "qty": "200g"}, {"name": "onion", "qty": "100g"}],
        "steps": ["Saute onions", "Add spices and chicken", "Simmer"], "tags": ["lunch", "dinner"], "batchable": True
    }
}

# -------------------------
# Models
# -------------------------
class UserInput(BaseModel):
    age: int
    sex: str
    height_cm: int
    weight_kg: float
    activity: str
    goal: str
    diet: str
    region: str

# Import core modules
# NOTE: Ensure symptom_rules.py and exercise_db.py are in the same directory
from symptom_rules import check_symptoms
from exercise_db import generate_workout_plan

class SymptomRequest(BaseModel):
    user_id: str = None
    symptoms: List[str]
    vitals: Dict[str, Any] = None # e.g. {'temp_c': 38.5}

class WorkoutRequest(BaseModel):
    goal: str
    level: str # beginner, intermediate, advanced
    duration_min: int = 30 # Made optional with default
    equipment: List[str] = [] # e.g. ["dumbbell"]
    days_per_week: int = 3

# -------------------------
# Endpoints
# -------------------------
@app.get("/")
def health_check():
    return {"status": "ok", "service": "HealthAi Backend"}

@app.post("/api/diet/generate")
def generate_diet(user: UserInput):
    # Calculate macros
    targets = compute_targets(user.dict(), user.activity, user.goal)
    
    # Simple logic to pick recipes (Mock for now)
    plan = {
        "user_id": "u_123",
        "meta": targets,
        "schedule": {
            "Monday": {
                "breakfast": SAMPLE_RECIPES["r_besan_chilla"],
                "lunch": SAMPLE_RECIPES["r_paneer_tikka"],
                "dinner": SAMPLE_RECIPES["r_chicken_curry"] if user.diet != "vegetarian" else SAMPLE_RECIPES["r_paneer_tikka"],
                "snack": {"title": "Apple & Almonds", "calories": 150}
            }
        }
    }
    return plan

@app.post("/api/symptom/check")
def symptom_check(req: SymptomRequest):
    # Join symptoms for text processing
    text_input = " ".join(req.symptoms)
    result = check_symptoms(text_input, req.vitals)
    return result

@app.post("/api/workout/generate")
def generate_workout(req: WorkoutRequest):
    # Convert request to profile dict
    profile = {
        "goal": req.goal,
        "level": req.level,
        "equipment": req.equipment,
        "days_per_week": req.days_per_week
    }
    plan = generate_workout_plan(profile)
    return plan

@app.post("/api/prescription/scan")
async def scan_prescription(file: UploadFile = File(...)):
    # Mock response
    return {
        "medications": [
            {"name": "Amoxicillin", "dosage": "500mg", "freq": "Twice daily"},
            {"name": "Paracetamol", "dosage": "650mg", "freq": "As needed for fever"}
        ],
        "notes": "Take with food. Complete the full course."
    }

@app.post("/api/events")
def log_event(payload: Dict[str, Any]):
    print(f"EVENT LOGGED: {payload}")
    return {"status": "recorded"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
