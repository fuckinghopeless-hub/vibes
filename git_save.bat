@echo off
setlocal enabledelayedexpansion

REM Add Git to path for current session if not found
where git >nul 2>nul
if errorlevel 1 (
    if exist "C:\Program Files\Git\cmd\git.exe" (
        set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;!PATH!"
    ) else if exist "C:\Program Files (x86)\Git\cmd\git.exe" (
        set "PATH=C:\Program Files (x86)\Git\cmd;!PATH!"
    ) else if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
        set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;!PATH!"
    )
)

cls
echo ===================================================================
echo   VIBES - Avtomaticheskoe Sohranenie Versiy v GitHub
echo ===================================================================
echo.

where git >nul 2>nul
if errorlevel 1 (
    echo [!] Git ne nayden v sisteme!
    echo Ustanovite Git s sayta: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

REM Zapros Versii
set "VER="
set /p "VER=Vvedite nomer versii (naprimer 1.1.0 ili Enter dlya propuska): "

REM Esli versiya vvedena - obnovlyaem src/version.ts
if not "!VER!"=="" (
    (
        echo /**
        echo  * VIBES Platform Version
        echo  * Automatically synchronized with Git releases and Settings tab
        echo  */
        echo export const APP_VERSION = '!VER!';
    ) > src\version.ts
    echo [*] Obnovlena versiya v proekte na: !VER!
)

REM Zapros Opisaniya
set "MSG="
set /p "MSG=Vvedite opisanie commita (ili Enter dlya avto): "

if "!MSG!"=="" (
    if "!VER!"=="" (
        set "MSG=chore: update vibes platform"
    ) else (
        set "MSG=feat(!VER!): release !VER! updates"
    )
) else (
    if not "!VER!"=="" (
        set "MSG=feat(!VER!): !MSG!"
    )
)

echo.
echo [*] Dobavlenie faylov (git add .)...
git add .

echo [*] Sozdanie commita: "!MSG!"
git commit -m "!MSG!"

if not "!VER!"=="" (
    echo [*] Sozdanie tega versii: "!VER!"...
    git tag -a "!VER!" -m "Release !VER!" 2>nul
)

echo.
echo [*] Otpravka v GitHub s tegami (git push origin main --tags)...
git push origin main --tags

echo.
echo ===================================================================
echo  [OK] Gotovo! Versiya i izmeneniya uspeshno otpravleny v GitHub.
echo ===================================================================
echo.
pause
