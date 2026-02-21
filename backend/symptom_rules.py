import re

# Clinical Knowledge Base
# Rules are structured as: { 'condition_id': { 'symptoms': [...], 'urgency': '...', 'explanation': '...', 'followups': [...] } }

SYMPTOM_RULES = {
    'emergency_cardiac': {
        'keywords': ['chest pain', 'chest tightness', 'crushing chest', 'heavy chest', 'radiating pain', 'jaw pain', 'arm pain'],
        'required_combinations': [
            ['chest pain', 'shortness of breath'],
            ['chest pain', 'sweating'],
            ['chest pain', 'nausea'],
            ['severe chest pain']
        ],
        'urgency': 'emergency',
        'title': 'Possible Cardiac Event',
        'explanation': 'Symptoms suggest a potential cardiac event (heart attack) which requires immediate medical attention.',
        'advice': 'Call emergency services immediately. Do not drive yourself to the hospital.',
        'color': 'red'
    },
    'emergency_stroke': {
        'keywords': ['face drooping', 'arm weakness', 'speech difficulty', 'slurred speech', 'sudden confusion', 'vision loss'],
        'required_combinations': [
            ['face drooping'],
            ['arm weakness'],
            ['slurred speech']
        ],
        'urgency': 'emergency',
        'title': 'Possible Stroke',
        'explanation': 'Sudden onset of neurological symptoms (Face, Arm, Speech) is a strong indicator of stroke.',
        'advice': 'Time is critical. Call emergency services immediately.',
        'color': 'red'
    },
    'urgent_infection': {
        'keywords': ['fever', 'high fever', 'chills', 'cough', 'sore throat', 'body ache'],
        'thresholds': {
            'fever_c': 39.0, # High fever
            'duration_days': 5
        },
        'urgency': 'consult',
        'title': 'Severe Infection',
        'explanation': 'High fever or persistent symptoms may indicate a bacterial infection or severe viral illness needing treatment.',
        'advice': 'Consult a doctor within 24 hours. Monitor temperature and hydration.',
        'color': 'orange'
    },
    'common_cold_flu': {
        'keywords': ['runny nose', 'sneezing', 'mild cough', 'low grade fever', 'fatigue'],
        'urgency': 'self-care',
        'title': 'Common Cold / Viral',
        'explanation': 'Symptoms are consistent with a common viral infection that typically resolves on its own.',
        'advice': 'Rest, hydration, and over-the-counter remedies. Monitor for worsening symptoms.',
        'color': 'green'
    }
}

def normalize_text(text):
    text = text.lower()
    # Simple spell correction map (could be extensive)
    corrections = {
        'chestpain': 'chest pain',
        'breathless': 'shortness of breath',
        'cant breathe': 'shortness of breath',
        'head ache': 'headache'
    }
    for wrong, right in corrections.items():
        text = text.replace(wrong, right)
    return text

def check_symptoms(user_input, vitals=None):
    text = normalize_text(user_input)
    
    # 1. Check Emergencies (Red Flags)
    # Cardiac
    cardiac_rule = SYMPTOM_RULES['emergency_cardiac']
    
    # Check direct keywords
    matched_keywords = [k for k in cardiac_rule['keywords'] if k in text]
    
    # Check combinations
    combo_hit = False
    for combo in cardiac_rule['required_combinations']:
        if all(c in text for c in combo):
            combo_hit = True
            break
            
    if combo_hit or (len(matched_keywords) >= 2) or ('severe' in text and 'chest' in text):
         return {
            'triage': {
                'urgency': cardiac_rule['urgency'],
                'title': cardiac_rule['title'],
                'advice': cardiac_rule['advice'],
                'color': cardiac_rule['color']
            },
            'confidence': 0.95,
            'reasons': [f"Matched critical symptoms: {', '.join(matched_keywords or ['Combined risk factors'])}"],
            'explanation': cardiac_rule['explanation'],
            'followups': ["Is the pain radiating to your left arm or jaw?", "Do you have a history of heart disease?"]
        }

    # Stroke
    stroke_rule = SYMPTOM_RULES['emergency_stroke']
    matched_stroke = [k for k in stroke_rule['keywords'] if k in text]
    if matched_stroke:
        return {
            'triage': {
                'urgency': stroke_rule['urgency'],
                'title': stroke_rule['title'],
                'advice': stroke_rule['advice'],
                'color': stroke_rule['color']
            },
            'confidence': 0.98,
            'reasons': [f"Neurological warning sign: {matched_stroke[0]}"],
            'explanation': stroke_rule['explanation'],
            'followups': ["When did the symptoms start (exact time)?"]
        }

    # 2. Check Urgent Consults
    # Infection rules
    inf_rule = SYMPTOM_RULES['urgent_infection']
    if vitals and vitals.get('temp_c', 0) > inf_rule['thresholds']['fever_c']:
         return {
            'triage': {
                'urgency': inf_rule['urgency'],
                'title': inf_rule['title'],
                'advice': inf_rule['advice'],
                'color': inf_rule['color']
            },
            'confidence': 0.90,
            'reasons': [f"High fever detected ({vitals['temp_c']}°C)"],
            'explanation': f"Fever above {inf_rule['thresholds']['fever_c']}°C requires medical assessment.",
            'followups': ["How long have you had the fever?", "Are you experiencing confusion or stiff neck?"]
        }
    
    # General urgent pattern
    if 'severe pain' in text or 'vomiting' in text:
         return {
            'triage': {
                'urgency': 'consult',
                'title': 'Medical Consult Needed',
                'advice': 'Severe symptoms require professional evaluation.',
                'color': 'orange'
            },
            'confidence': 0.85,
            'reasons': ["Reported severe symptoms"],
            'explanation': "Severe pain or persistent vomiting can indicate conditions requiring treatment.",
            'followups': ["Where exactly is the pain located?", "Are you able to keep fluids down?"]
        }

    # 3. Default to Self-Care / Low Urgency
    return {
        'triage': {
            'urgency': 'self-care',
            'title': 'Likely Minor Issue',
            'advice': 'Monitor symptoms at home. If they worsen, consult a doctor.',
            'color': 'green'
        },
        'confidence': 0.70,
        'reasons': ["No red flags detected", "Symptoms consistent with common minor illnesses"],
        'explanation': "Based on the description, there are no immediate emergency signs. Ensure rest and hydration.",
        'followups': ["Has this happened before?", "Does anything make it better or worse?"]
    }
