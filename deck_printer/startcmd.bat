@echo off

start cmd.exe /k "cd /d %~dp0 && npm run dev -- --host 0.0.0.0 --port 5174"