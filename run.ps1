# The Cafe Companion Launch Script
Write-Host "=========================================================" -ForegroundColor DarkYellow
Write-Host "   Starting The Cafe Companion (Aura Cafe AI)..." -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor DarkYellow
Write-Host ""
Set-Location -Path $PSScriptRoot
Write-Host "Opening browser: http://127.0.0.1:8080" -ForegroundColor Cyan
Start-Process "http://127.0.0.1:8080"
Write-Host "Starting Python async server..." -ForegroundColor Green
$pythonExe = "python"
if (Test-Path "$PSScriptRoot\..\.venv\Scripts\python.exe") {
    $pythonExe = "$PSScriptRoot\..\.venv\Scripts\python.exe"
} elseif (Test-Path "$PSScriptRoot\.venv\Scripts\python.exe") {
    $pythonExe = "$PSScriptRoot\.venv\Scripts\python.exe"
}
& $pythonExe server.py
