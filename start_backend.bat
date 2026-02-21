@echo off
echo Starting HealthAi Backend...
cd "%~dp0"
call .venv\Scripts\activate.bat
if errorlevel 1 (
    echo Virtual environment not found or failed to activate.
    echo Please ensure you have created a venv and installed requirements.
    pause
    exit /b
)
cd backend
echo Running uvicorn server on port 8000...
uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause
