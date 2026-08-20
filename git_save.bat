@echo off
chcp 65001 >nul
title VIBES Git Auto-Save with Versions
color 0F
cls

echo.
echo  ===================================================================
echo    VIBES - Avtomaticheskoe Sohranenie Versiy v GitHub
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

REM Zapros Versii
set VER=
set /p "VER=Vvedite nomer versii (naprimer 0.1v2 ili Enter dlya propuska): "

REM Zapros Opisaniya
set MSG=
set /p "MSG=Vvedite opisanie commita (ili Enter dlya avto): "

if "%MSG%"=="" (
    if "%VER%"=="" (
        set "MSG=chore: update vibes platform"
    ) else (
        set "MSG=feat(%VER%): release %VER% updates"
    )
) else (
    if not "%VER%"=="" (
        set "MSG=feat(%VER%): %MSG%"
    )
)

echo.
echo   [*] Dobavlenie faylov (git add .)...
git add .

echo   [*] Sozdanie commita: "%MSG%"
git commit -m "%MSG%"

REM Sozdanie tega esli versiya ukazana
if not "%VER%"=="" (
    echo   [*] Sozdanie tega versii: "%VER%"...
    git tag -a "%VER%" -m "Release %VER%" 2>nul
)

echo.
echo   [*] Otpravka v GitHub s tegami (git push origin main --tags)...
git push origin main --tags

echo.
echo  ===================================================================
echo   [✓] Gotovo! Versiya i izmeneniya uspeshno otpravleny v GitHub.
echo  ===================================================================
echo.
pause
