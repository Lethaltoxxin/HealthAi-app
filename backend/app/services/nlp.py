import json
import os
import re
from typing import List, Dict, Any, Tuple

# Spacy is optional — works without it
try:
    import spacy
    nlp_model = spacy.load("en_core_web_sm")
except:
    nlp_model = None

# Load Lexicon
LEXICON_PATH = os.path.join(os.path.dirname(__file__), "../../data/nlp/lexicon.json")
try:
    with open(LEXICON_PATH, 'r') as f:
        lexicon_data = json.load(f)
        SYNONYMS = lexicon_data.get("synonyms", {})
except Exception as e:
    print(f"Warning: Could not load lexicon: {e}")
    SYNONYMS = {}

# Build sorted variant list (longest match first)
_ALL_VARIANTS = []
for standard, variants in SYNONYMS.items():
    for v in variants:
        _ALL_VARIANTS.append((v.lower(), standard.lower()))
_ALL_VARIANTS.sort(key=lambda x: len(x[0]), reverse=True)


def normalize_medical_terms(text: str) -> str:
    """
    Replace mapped phrases with standard medical terms.
    Longest-match-first string replacement.
    """
    result = text.lower()
    for variant, standard in _ALL_VARIANTS:
        if variant in result:
            result = result.replace(variant, standard)
    return result


def preprocess_text(text: str) -> Dict[str, Any]:
    """
    Normalize text, extract entities, keywords, and negations.
    """
    normalized = normalize_medical_terms(text)
    
    if not nlp_model:
        return {
            "raw_text": text,
            "normalized_text": normalized,
            "lemmas": normalized.split(),
            "entities": [],
            "negated_terms": []
        }

    doc = nlp_model(normalized)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    
    negated = []
    for token in doc:
        is_neg = False
        for child in token.children:
            if child.dep_ == "neg":
                is_neg = True
        if token.head and token.head.dep_ == "neg":
            is_neg = True
        if is_neg:
            negated.append(token.lemma_)

    lemmas = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct]

    return {
        "raw_text": text,
        "normalized_text": normalized,
        "lemmas": lemmas,
        "entities": entities,
        "negated_terms": negated
    }


# Negation patterns for regex-based detection
_NEGATION_PREFIXES = r"(?:no|not|never|deny|denies|denied|without|don't|dont|doesn't|doesnt|hasn't|hasnt|haven't|havent|isn't|isnt|wasn't|wasnt|lack of|absence of|free of|negative for)"

def check_negation(text: str, keyword: str) -> bool:
    """
    Check if a specific keyword is negated in the text.
    Uses regex pattern matching for reliability.
    """
    text_lower = text.lower()
    
    # Handle underscored terms: "chest_pain" -> "chest pain" for regex
    keyword_for_regex = keyword.replace("_", r"[\s_]")
    
    pattern = _NEGATION_PREFIXES + r"\s+(?:\w+\s+){0,3}" + keyword_for_regex
    return bool(re.search(pattern, text_lower))
