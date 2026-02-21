@echo off
TITLE HealthAi Launcher

echo ===================================================
echo      HealthAi Full-Stack App Launcher
echo ===================================================

REM 1. Check for Python
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [!ERROR!] Python is NOT installed.
    echo.
    echo Attempting to install Python via Winget...
    winget install -e --id Python.Python.3.11 --scope machine
    
    IF %ERRORLEVEL% NEQ 0 (
        echo [!ERROR!] Automatic installation failed.
        echo Please install Python manually from: https://www.python.org/downloads/
        echo AND check "Add Python to PATH" during installation.
        pause
        exit /b
    )
    
    echo.
    echo [SUCCESS] Python installed!
    echo [IMPORTANT] You MUST close this window and run this script again for the changes to take effect.
    echo.
    pause
    exit /b
)

REM 2. Check for Node.js
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [!ERROR!] Node.js is NOT installed.
    echo.
    echo Attempting to install Node.js via Winget...
    winget install -e --id OpenJS.NodeJS
    
    echo.
    echo [IMPORTANT] You MUST close this window and run this script again for the changes to take effect.
    pause
    exit /b
)

echo.
echo [1/3] Setting up Backend...
cd backend
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing backend dependencies...
pip install -r requirements.txt >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: Some backend dependencies might have failed.
)
cd ..

echo.
echo [2/3] Setting up Frontend...
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

echo.
echo [3/3] Starting Servers...
echo.

REM Start Backend in a new window
start "HealthAi Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

REM Start Frontend in a new window
start "HealthAi Frontend" cmd /k "npm run dev"

echo.
echo [SUCCESS] Application is starting!
echo.
echo Backend API: http://localhost:8000/docs
echo Frontend UI: http://localhost:5173
echo.
echo You can close this window now, but keep the other two windows open.
pause
