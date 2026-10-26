@echo off
echo ===================================================
echo Starting PlacementIQ Production Web Application
echo ===================================================

cd /d "%~dp0backend"
set "PATH=C:\Users\HP\AppData\Local\Programs\Python\Python313;C:\Users\HP\AppData\Local\Programs\Python\Python313\Scripts;%PATH%"
echo Starting FastAPI production server on http://127.0.0.1:8000 ...
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
pause
