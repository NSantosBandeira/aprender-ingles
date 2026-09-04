@echo off
setlocal
cd /d "%~dp0"
docker compose up -d
cd web
set "PATH=%LOCALAPPDATA%\nodejs-portable;%PATH%"
if not exist .env.local copy .env.example .env.local
echo Abra http://localhost:3000
npm run dev
