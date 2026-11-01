@echo off
setlocal
echo ===================================================
echo Starting PlacementIQ Production Web Application
echo ===================================================

set "PYTHON_EXE=C:\Users\HP\AppData\Local\Programs\Python\Python313\python.exe"
if not exist "%PYTHON_EXE%" set "PYTHON_EXE=python"

cd /d "%~dp0backend"
echo Starting FastAPI production server on http://127.0.0.1:8000 ...
"%PYTHON_EXE%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000
pause
