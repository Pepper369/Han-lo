@echo off
cd /d "%~dp0"

where node >nul 2>nul
if not errorlevel 1 (
  echo Dang khoi chay Han Lo qua Node.js...
  node server.js
  exit /b
)

where python >nul 2>nul
if not errorlevel 1 (
  echo Dang khoi chay Han Lo qua Python...
  start "" http://localhost:8000/index.html
  python -m http.server 8000
  exit /b
)

echo Khong tim thay Node.js hoac Python. Mo truc tiep index.html.
start "" "index.html"
