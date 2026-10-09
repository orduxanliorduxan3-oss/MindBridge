@echo off
title MindBridge Serveri Dayandir
color 0C
echo ======================================================
echo    MindBridge Platformasi Dayandirilir...
echo ======================================================
echo.

powershell -NoProfile -Command "$port = 5050; $pids = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess; if ($pids) { foreach ($p in $pids) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }; Write-Host 'Server ugurla dayandirildi!' -ForegroundColor Green } else { Write-Host 'Aktiv server tapilmadi (artiq dayandirilib).' -ForegroundColor Yellow }"

echo.
echo Pencereni baglaya bilersiniz.
timeout /t 3 >nul
