import re
import random
from typing import Dict, Any, List, Optional
from app.services.nlp import preprocess_text, normalize_medical_terms
from app.services.triage import engine as triage_engine

class ChatOrchestrator:
    def __init__(self):
        self.intents = {
            "symptom_check": [
                r"pain", r"ache", r"fever", r"dizzy", r"vomit", r"cough", 
                r"breath", r"hurt", r"swollen", r"bleeding", r"rash", r"sick",
                r"headache", r"stomach", r"chest", r"nause", r"faint", r"migraine",
                r"seizure", r"convulsion", r"unconscious", r"syncope",
                r"blood", r"bleed", r"weak", r"numb", r"droop",
                r"vision", r"allergic", r"allergy", r"poison", r"overdose",
                r"stiff", r"swell", r"diabetic", r"suicid", r"burn",
                r"choking", r"drowning", r"shock", r"fracture", r"crush",
                r"blue lips", r"cyanosis", r"dyspnea", r"hemoptysis",
                r"hemiparesis", r"dysarthria", r"anaphylaxis", r"hemorrhage",
                r"thunderclap", r"meningitis", r"trauma",
                r"injury", r"accident", r"emergency", r"urgent",
                r"baby.*fever", r"infant.*fever", r"child.*fever"
            ],
            "workout_request": [
                r"workout", r"exercise", r"gym", r"train", r"fitness", r"muscle", r"strength"
            ],
            "diet_request": [
                r"diet", r"food", r"meal", r"nutrition", r"recipe", r"eat", r"calories", r"vegetarian"
            ],
            "mindfulness": [
                r"meditat", r"sleep", r"calm", r"relax", r"breathing exercise", r"mindful"
            ],
            "greeting": [
                r"\bhello\b", r"\bhi\b", r"\bhey\b"
            ]
        }
        
    def classify_intent(self, text: str, normalized: str) -> str:
        text_lower = text.lower()
        norm_lower = normalized.lower()
        combined = text_lower + " " + norm_lower
        
        # Check specific keywords in combined text
        for intent, keywords in self.intents.items():
            for kw in keywords:
                if re.search(kw, combined):
                    return intent
                    
        # Check for stress/anxiety (could be mindfulness or symptom)
        if re.search(r"stress|anxiety|anxious|worried|panic", combined):
            return "mindfulness"
                    
        return "general_query"

    def process_message(self, text: str, user_context: Optional[Dict] = None) -> Dict[str, Any]:
        # 1. Normalize text
        normalized = normalize_medical_terms(text)
        
        # 2. Detect Intent
        intent = self.classify_intent(text, normalized)
        
        response: Dict[str, Any] = {
            "text": "",
            "intent": intent,
            "data": None,
            "actions": []
        }
        
        # 3. Route
        if intent == "symptom_check":
            # Call Triage Engine with RAW text (engine normalizes internally)
            triage_result = triage_engine.evaluate(text)
            response["data"] = triage_result
            
            if triage_result["triage"] == "emergency":
                response["text"] = (
                    f"This sounds urgent. {triage_result['reasons'][0]} "
                    f"Please call emergency services immediately or go to the nearest ER."
                )
                response["actions"] = [
                    {"type": "call", "value": "911", "label": "Call Emergency"},
                    {"type": "call", "value": "112", "label": "Call 112"}
                ]
            elif triage_result["triage"] == "consult":
                response["text"] = (
                    f"I noticed: {', '.join(triage_result['reasons'])}. "
                    f"It would be best to consult a doctor regarding this."
                )
                response["actions"] = [{"type": "link", "value": "/find-doctor", "label": "Find a Doctor"}]
            else:
                response["text"] = (
                    f"{triage_result['reasons'][0]} "
                    f"{' '.join(triage_result['actions'])} "
                    f"If symptoms worsen, please seek medical attention."
                )
                 
        elif intent == "workout_request":
            response["text"] = "I can help you build a workout plan! Would you like to start the Workout Builder?"
            response["actions"] = [{"type": "navigate", "value": "/workout", "label": "Open Workout Builder"}]
            
        elif intent == "diet_request":
            response["text"] = "Nutrition is key! Let me help you set up a meal plan."
            response["actions"] = [{"type": "navigate", "value": "/nutrition", "label": "Open Nutrition"}]

        elif intent == "mindfulness":
            response["text"] = (
                "I hear you. Taking care of your mental health is important. "
                "Would you like to try a guided breathing exercise?"
            )
            response["actions"] = [{"type": "navigate", "value": "/mindfulness", "label": "Start Session"}]

        elif intent == "greeting":
            response["text"] = (
                "Hello! I'm your HealthAi assistant. I can help with symptoms, "
                "workouts, nutrition, or mindfulness. How are you feeling today?"
            )
            
        else:
            response["text"] = (
                "I understand you're asking about something. "
                "I can help best with symptoms, workouts, diet plans, and mindfulness. "
                "Could you tell me more about what you need?"
            )
            
        return response

orchestrator = ChatOrchestrator()
