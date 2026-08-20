@echo off
chcp 65001 >nul
title VIBES — Self-Control RPG Platform
color 07
cls

echo.
echo  ===================================================================
echo.
echo    ██╗   ██╗██╗██████╗ ███████╗███████╗
echo    ██║   ██║██║██╔══██╗██╔════╝██╔════╝
echo    ██║   ██║██║██████╔╝█████╗  ███████╗
echo    ╚██╗ ██╔╝██║██╔══██╗██╔══╝  ╚════██║
echo     ╚████╔╝ ██║██████╔╝███████╗███████║
echo      ╚═══╝  ╚═╝╚═════╝ ╚══════╝╚══════╝
echo.
echo    VIBES — Self-Control ^& Gamification Platform
echo    M3 Monochrome Edition
echo.
echo  ===================================================================
echo.

:: Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   [X] Ошибка: Node.js не найден на компьютере!
    echo   Пожалуйста, установите Node.js с https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists, install if missing
if not exist "node_modules" (
    echo   [*] Установка зависимостей...
    call npm install
    if %errorlevel% neq 0 (
        echo   [X] Ошибка при установке пакетов npm!
        pause
        exit /b 1
    )
)

echo   [+] Запуск сервера разработки на http://localhost:5173 ...
echo.

:: Open default browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173"

:: Start Vite dev server
call npm run dev
