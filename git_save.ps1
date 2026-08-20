# VIBES Git Auto-Save & Push Script
Write-Host ""
Write-Host " ===================================================================" -ForegroundColor Cyan
Write-Host "   VIBES - Автоматическое Сохранение в GitHub" -ForegroundColor White
Write-Host " ===================================================================" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "  [!] Git не установлен в системе!" -ForegroundColor Red
    Write-Host "  Скачайте и установите Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Нажмите Enter для выхода..."
    exit 1
}

# Инициализация если нужно
if (-not (Test-Path ".git")) {
    Write-Host "  [*] Инициализация Git-репозитория..." -ForegroundColor Gray
    git init
    git branch -M main
}

# Запрос описания коммита
$msg = Read-Host "Введите описание изменений (или Enter для авто-сохранения)"
if ([string]::IsNullOrWhiteSpace($msg)) {
    $msg = "chore: update vibes platform version"
}

Write-Host ""
Write-Host "  [*] Добавление файлов (git add .)..." -ForegroundColor Gray
git add .

Write-Host "  [*] Создание коммита..." -ForegroundColor Gray
git commit -m $msg

Write-Host ""
Write-Host "  [*] Отправка в GitHub (git push origin main)..." -ForegroundColor Gray
git push origin main

Write-Host ""
Write-Host " ===================================================================" -ForegroundColor Green
Write-Host "   [✓] Готово! Все изменения сохранены." -ForegroundColor Green
Write-Host " ===================================================================" -ForegroundColor Green
Write-Host ""
Read-Host "Нажмите Enter для завершения..."
