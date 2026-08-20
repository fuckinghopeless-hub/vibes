@echo off
chcp 65001 >nul
title VIBES Git Auto Save
color 0F
cls

echo.
echo  ===================================================================
echo    VIBES - Avtomaticheskoe Sohranenie v GitHub
echo  ===================================================================
echo.

REM Proverka Git
where git >nul 2>nul
if errorlevel 1 (
    echo   [!] Git ne nayden v sisteme!
    echo   Ustanovite Git s sayta: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

REM Inicializaciya esli nuzhno
if not exist ".git" (
    echo   [*] Inicializaciya Git...
    git init
    git branch -M main
)

echo.
set MSG=
set /p "MSG=Vvedite opisanie (ili nazhmite Enter dlya avto-sohraneniya): "
if "%MSG%"=="" (
    set "MSG=chore: update vibes platform version"
)

echo.
echo   [*] Dobavlenie faylov (git add .)...
git add .

echo   [*] Sozdanie commita...
git commit -m "%MSG%"

echo.
echo   [*] Otpravka v GitHub (git push origin main)...
git push origin main

echo.
echo  ===================================================================
echo   Gotovo! Izmeneniya obrabotany.
echo  ===================================================================
echo.
pause
