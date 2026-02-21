# HealthAi Full-Stack Prototype

## Prerequisites
- Docker & Docker Compose
- Python 3.11+ (if running backend locally without Docker)
- Node.js 18+ (if running frontend locally without Docker)

## Running with Docker (Recommended)
1. **Build and Run:**
   ```bash
   docker-compose up --build
   ```
2. **Access:**
   - Frontend: http://localhost:5173
   - Backend API Docs: http://localhost:8000/docs
   - Events Stream: http://localhost:8000/api/events

## Running Locally (Dev Mode)

### Backend
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create virtual env & install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
3. Run Server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend
1. Navigate to root:
   ```bash
   npm install
   ```
2. Run Dev Server:
   ```bash
   npm run dev
   ```

## Chatbot Logic
The Chatbot serves as the main entry point (`/api/chat`).
- **Orchestrator:** Parses intent (Symptom, Diet, Workout, etc).
- **Rules Engine:** Checks `red_flags.json` (Emergency) and `consult_rules.json`.
- **NLP:** Uses medical lexicon for synonym mapping.

## Running Tests
1. **Validation Script (Confidence Score):**
   ```bash
   set PYTHONPATH=backend
   python backend/validation/validate_chatbot.py
   ```

## Key Files
- `backend/app/services/chat_orchestrator.py`: Chat Logic.
- `backend/data/rules/`: Expanded JSON Rule sets.
- `src/pages/Chat.jsx`: Frontend Chat UI.
