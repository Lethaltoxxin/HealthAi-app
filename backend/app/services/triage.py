import json
import os
from typing import List, Dict, Any, Tuple
from app.services.nlp import normalize_medical_terms, check_negation

RULES_DIR = os.path.join(os.path.dirname(__file__), "../../data/rules")

class TriageEngine:
    def __init__(self):
        self.red_flags = self._load_rules("red_flags.json")
        self.consult_rules = self._load_rules("consult_rules.json")

    def _load_rules(self, filename: str) -> List[Dict]:
        try:
            path = os.path.join(RULES_DIR, filename)
            with open(path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading rules {filename}: {e}")
            return []

    def evaluate(self, text: str, vitals: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Evaluate text and vitals against rules.
        Checks BOTH raw and normalized text for matching.
        Returns triage result, confidence, reasons, and actions.
        """
        text_lower = text.lower()
        # Normalize to map synonyms to standard medical terms
        normalized = normalize_medical_terms(text_lower)
        
        # 1. Red Flag Check (Emergency)
        for rule in self.red_flags:
            condition = rule['condition']
            co_condition = rule.get('required_co_condition')
            keywords = rule.get('keywords', [])
            min_kw = rule.get('min_matches', 0)
            
            # Check condition in BOTH raw and normalized text
            condition_found = (condition in text_lower) or (condition in normalized)
            
            if condition_found:
                # Check negation
                if check_negation(text_lower, condition):
                    continue
                    
                # Check co-condition if required
                if co_condition:
                    co_found = (co_condition in text_lower) or (co_condition in normalized)
                    if not co_found:
                        continue
                
                # Check additional keywords if required
                if keywords and min_kw > 0:
                    kw_count = sum(1 for kw in keywords if kw in text_lower or kw in normalized)
                    if kw_count < min_kw:
                        continue
                
                return {
                    "triage": "emergency",
                    "confidence": 1.0,
                    "reasons": [rule.get('reason', 'Red flag detected.')],
                    "actions": [rule.get('action', 'Seek emergency care immediately.')],
                    "matched_rule": rule['id']
                }

        # 2. Consult Rules (Keywords/Criteria)
        matched_reasons = []
        matched_actions = []
        
        for rule in self.consult_rules:
            match_count = 0
            
            # Check 'condition' field (single string match)
            if 'condition' in rule:
                cond = rule['condition']
                if (cond in text_lower) or (cond in normalized):
                    matched_reasons.append(rule.get('reason', ''))
                    matched_actions.append(rule.get('action', ''))
                    continue
            
            # Keyword matching
            if 'keywords' in rule:
                for kw in rule['keywords']:
                    if (kw in text_lower) or (kw in normalized):
                        match_count += 1
                
                if match_count >= rule.get('min_matches', 1):
                    matched_reasons.append(rule.get('reason', ''))
                    matched_actions.append(rule.get('action', ''))

            # Criteria matching (vitals)
            if 'criterias' in rule and vitals:
                criteria_met = True
                for crit in rule['criterias']:
                    field = crit['field'].split('.')[-1]
                    val = vitals.get(field)
                    if val is None:
                        criteria_met = False
                        break
                    
                    if crit['operator'] == 'gt' and not (val > crit['value']):
                        criteria_met = False
                    elif crit['operator'] == 'lt' and not (val < crit['value']):
                        criteria_met = False
                
                if criteria_met:
                    matched_reasons.append(rule.get('reason', ''))
                    matched_actions.append(rule.get('action', ''))

        if matched_reasons:
            return {
                "triage": "consult",
                "confidence": 0.85,
                "reasons": matched_reasons,
                "actions": list(set(matched_actions)),
                "matched_rule": "consult_heuristic"
            }

        # 3. Default / Self Care
        return {
            "triage": "self_care",
            "confidence": 0.6,
            "reasons": ["No immediate red flags or specific conditions detected."],
            "actions": ["Monitor symptoms. If they worsen, see a doctor."],
            "matched_rule": "default"
        }

# Global instance
engine = TriageEngine()
