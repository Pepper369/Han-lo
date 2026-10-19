@echo off
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Python. Mo truc tiep index.html bang trinh duyet.
  start "" "index.html"
  exit /b
)
start "" http://localhost:8000/index.html
python -m http.server 8000
