@echo off
echo ===================================================
echo Starting PlacementIQ Production Web Application
echo ===================================================

cd /d "%~dp0backend"
echo Starting FastAPI production server on http://0.0.0.0:8000 ...
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
pause
