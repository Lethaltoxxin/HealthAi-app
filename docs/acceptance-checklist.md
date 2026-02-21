# Acceptance Checklist

## Core Functionality
- [x] Chatbot UI loads and is responsive.
- [x] User can send messages and receive responses.
- [x] "Red Flag" inputs trigger Emergency Triage (e.g., "crushing chest pain").
- [x] "Consult" inputs trigger Consult advice (e.g., "migraine").
- [x] General queries logic routes to Mock LLM.
- [x] Quick Actions (Diet, Workout) work.

## Safety & Rules
- [x] 300+ Red Flag rules loaded.
- [x] 100+ Consult rules loaded.
- [x] NLP Normalization handles synonyms (e.g., "belly pain" -> "abdominal_pain").

## Validation
- [ ] Confidence Score >= 0.95 (Run `validate_chatbot.py`).
- [ ] Accessibility Checks pass.
