@echo off
title MindBridge Local Platform
color 0B
echo ======================================================
echo    MindBridge - Canli Qrup Dersleri ve AI Platformasi
echo ======================================================
echo.
echo Server basladilir: http://localhost:5000/
echo Brauzer avtomatik acilacaqdir...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 5000
pause
