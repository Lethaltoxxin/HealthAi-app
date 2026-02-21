import pytest
from app.services.chat_orchestrator import orchestrator

def test_intent_symptom():
    assert orchestrator.classify_intent("I have a headache", "headache") == "symptom_check"

def test_intent_workout():
    assert orchestrator.classify_intent("Build me a workout", "workout") == "workout_request"

def test_intent_diet():
    assert orchestrator.classify_intent("I want a diet plan", "diet") == "diet_request"

def test_intent_greeting():
    assert orchestrator.classify_intent("hello", "hello") == "greeting"

def test_symptom_routing_emergency():
    response = orchestrator.process_message("I have crushing chest pain")
    assert response["intent"] == "symptom_check"
    assert response["data"] is not None
    assert response["data"]["triage"] == "emergency"

def test_symptom_routing_seizure():
    response = orchestrator.process_message("seizure")
    assert response["intent"] == "symptom_check"
    assert response["data"] is not None
    assert response["data"]["triage"] == "emergency"

def test_symptom_routing_consult():
    response = orchestrator.process_message("I have a migraine")
    assert response["intent"] == "symptom_check"
    assert response["data"] is not None
    assert response["data"]["triage"] == "consult"
