@echo off
echo ==========================================
echo      HealthAi Backend Setup and Run
echo ==========================================

cd "%~dp0"

:: Check for Python (Try 'python' first, then 'py')
python --version >nul 2>&1
if not errorlevel 1 goto found_python

py --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py
    goto found_python
)

echo.
echo [ERROR] Python is not installed or not in your PATH.
echo.
echo Please install Python from: https://www.python.org/downloads/
echo.
echo IMPORTANT: When installing, check the box that says "Add Python to PATH".
echo.
pause
exit /b

:found_python
if "%PYTHON_CMD%"=="" set PYTHON_CMD=python
echo [INFO] Python found (%PYTHON_CMD%).

:: Create Virtual Env if missing
if not exist ".venv" (
    echo [INFO] Creating virtual environment...
    %PYTHON_CMD% -m venv .venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b
    )
    echo [OK] Virtual environment created.
)

:: Activate Virtual Env
call .venv\Scripts\activate.bat

:: Install Requirements
echo [INFO] Installing dependencies...
python -m pip install -r backend/requirements.txt >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Failed to install requirements.
    pause
    exit /b
)
echo [OK] Dependencies installed.

:: Run Server
echo.
echo [SUCCESS] Backend is starting!
echo Leave this window OPEN while using the app.
echo.
echo Access API at: http://127.0.0.1:8000
echo.

cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause
