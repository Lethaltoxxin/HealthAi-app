import pytest
from app.services.triage import engine

def test_red_flag_chest_pain():
    result = engine.evaluate("I have severe chest pain")
    assert result['triage'] == "emergency"
    assert "chest_pain" in result['matched_rule']

def test_red_flag_unconscious():
    # "unconscious" -> NLP maps to "syncope" via lexicon
    result = engine.evaluate("The patient is unconscious")
    assert result['triage'] == "emergency"

def test_negation_chest_pain():
    # "no chest pain" -> negated, should NOT be emergency
    result = engine.evaluate("I have no chest pain")
    assert result['triage'] != "emergency"

def test_red_flag_seizure():
    result = engine.evaluate("patient having a seizure")
    assert result['triage'] == "emergency"

def test_red_flag_bleeding():
    result = engine.evaluate("uncontrolled bleeding from leg")
    assert result['triage'] == "emergency"

def test_consult_migraine_keywords():
    result = engine.evaluate("I have a headache and light sensitivity")
    assert result['triage'] == "consult"

def test_self_care_default():
    result = engine.evaluate("I feel a bit tired")
    assert result['triage'] == "self_care"

def test_consult_fever_with_vitals():
    vitals = {"temp_c": 39.5, "duration_days": 4}
    result = engine.evaluate("fever", vitals=vitals)
    assert result['triage'] == "consult"
