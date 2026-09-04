@echo off
setlocal
cd /d "%~dp0"

set "NODE="
where node >nul 2>&1 && set "NODE=node"
if not defined NODE if exist "%LocalAppData%\Programs\cursor\resources\app\resources\helpers\node.exe" set "NODE=%LocalAppData%\Programs\cursor\resources\app\resources\helpers\node.exe"
if not defined NODE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE=%ProgramFiles%\nodejs\node.exe"

if not defined NODE (
  echo Nao encontrei o Node.js. Instale em https://nodejs.org e rode este arquivo de novo.
  pause
  exit /b 1
)

echo Abrindo http://127.0.0.1:4173
start "" "http://127.0.0.1:4173"
"%NODE%" server.js
