# VIBES Git Auto-Save with Versions
Write-Host ""
Write-Host " ===================================================================" -ForegroundColor Cyan
Write-Host "   VIBES - Автоматическое Сохранение Версий в GitHub" -ForegroundColor White
Write-Host " ===================================================================" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия Git и добавление в PATH при необходимости
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\Git\cmd\git.exe") {
        $env:Path = "C:\Program Files\Git\cmd;C:\Program Files\Git\bin;$env:Path"
    } elseif (Test-Path "C:\Program Files (x86)\Git\cmd\git.exe") {
        $env:Path = "C:\Program Files (x86)\Git\cmd;$env:Path"
    } elseif (Test-Path "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe") {
        $env:Path = "$env:LOCALAPPDATA\Programs\Git\cmd;$env:Path"
    }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "  [!] Git не найден в системе!" -ForegroundColor Red
    Write-Host "  Скачайте и установите Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Нажмите Enter для выхода..."
    exit 1
}

# Запрос версии
$ver = Read-Host "Введите номер версии (например 1.1.0 или Enter для пропуска)"

# Если версия введена — автоматически обновляем src/version.ts
if (-not [string]::IsNullOrWhiteSpace($ver)) {
    $versionContent = @"
/**
 * VIBES Platform Version
 * Automatically synchronized with Git releases and Settings tab
 */
export const APP_VERSION = '$ver';
"@
    Set-Content -Path "src\version.ts" -Value $versionContent -Encoding UTF8
    Write-Host "  [*] Версия в проекте обновлена на: $ver" -ForegroundColor Green
}

# Запрос описания коммита
$msg = Read-Host "Введите описание коммита (или Enter для авто-сообщения)"

if ([string]::IsNullOrWhiteSpace($msg)) {
    if ([string]::IsNullOrWhiteSpace($ver)) {
        $msg = "chore: update vibes platform"
    } else {
        $msg = "feat($ver): release $ver updates"
    }
} else {
    if (-not [string]::IsNullOrWhiteSpace($ver)) {
        $msg = "feat($ver): $msg"
    }
}

Write-Host ""
Write-Host "  [*] Добавление файлов (git add .)..." -ForegroundColor Gray
git add .

Write-Host "  [*] Создание коммита: '$msg'..." -ForegroundColor Gray
git commit -m $msg

if (-not [string]::IsNullOrWhiteSpace($ver)) {
    Write-Host "  [*] Создание тега версии: '$ver'..." -ForegroundColor Gray
    git tag -a $ver -m "Release $ver" 2>$null
}

Write-Host ""
Write-Host "  [*] Отправка в GitHub со всеми тегами (git push origin main --tags)..." -ForegroundColor Gray
git push origin main --tags

Write-Host ""
Write-Host " ===================================================================" -ForegroundColor Green
Write-Host "   [✓] Готово! Версия и файлы успешно отправлены в GitHub." -ForegroundColor Green
Write-Host " ===================================================================" -ForegroundColor Green
Write-Host ""
Read-Host "Нажмите Enter для завершения..."
