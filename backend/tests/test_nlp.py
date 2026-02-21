import pytest
from app.services.nlp import preprocess_text, check_negation, normalize_medical_terms

def test_normalization():
    # normalize_medical_terms always lowercases
    assert normalize_medical_terms("I have a high temp") == "i have a fever"
    assert "abdominal_pain" in normalize_medical_terms("My belly pain is bad")
    assert "cyanosis" in normalize_medical_terms("blue lips and face")

def test_negation():
    assert check_negation("I do not have a fever", "fever") == True
    assert check_negation("no chest pain", "chest_pain") == True
    assert check_negation("without vomiting", "vomiting") == True
    assert check_negation("I have a fever", "fever") == False
    assert check_negation("I don't have chest pain", "chest_pain") == True

def test_preprocessing():
    text = "No severe chest pain but short of breath"
    result = preprocess_text(text)
    
    # "short of breath" -> "dyspnea"
    assert "dyspnea" in result["normalized_text"]
    # "chest pain" -> "chest_pain" 
    assert "chest_pain" in result["normalized_text"]
