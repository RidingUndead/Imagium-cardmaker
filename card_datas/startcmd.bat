:: Opening a cmd with venv activated

@echo off
start cmd.exe /k "cd /d %~dp0 && venv\Scripts\activate.bat && python main.py"