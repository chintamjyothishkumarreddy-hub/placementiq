@echo off
setlocal
echo ===================================================
echo Starting PlacementIQ and Generating Live Public Link
echo ===================================================

set "PYTHON_EXE=C:\Users\HP\AppData\Local\Programs\Python\Python313\python.exe"
if not exist "%PYTHON_EXE%" set "PYTHON_EXE=python"

start "PlacementIQ Backend" cmd /c "cd /d %~dp0backend && "%PYTHON_EXE%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000"
echo Waiting for backend server to start...
timeout /t 3 /nobreak >nul

echo ===================================================
echo Cloudflare Tunnel starting...
echo Your live public link will appear below:
echo ===================================================
"%~dp0cloudflared.exe" tunnel --url http://127.0.0.1:8000
