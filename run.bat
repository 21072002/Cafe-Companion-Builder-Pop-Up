@echo off
echo =========================================================
echo    Starting The Cafe Companion (Aura Cafe AI)...
echo =========================================================
echo.
cd /d "%~dp0"
echo Server running at: http://127.0.0.1:8080
echo Press Ctrl+C to stop the server anytime.
echo.
set "PYTHON_EXE=python"
if exist "..\.venv\Scripts\python.exe" (
    set "PYTHON_EXE=..\.venv\Scripts\python.exe"
) else if exist ".venv\Scripts\python.exe" (
    set "PYTHON_EXE=.venv\Scripts\python.exe"
)

start http://127.0.0.1:8080
%PYTHON_EXE% server.py
pause
