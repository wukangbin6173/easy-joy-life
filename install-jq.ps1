# ================================================================
# File: install-jq.ps1
# Description: Automatically install jq for Windows
# ================================================================

Write-Host "================================" -ForegroundColor Blue
Write-Host "  jq Installation Script" -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue
Write-Host ""

# Check if jq is already installed
if (Get-Command jq -ErrorAction SilentlyContinue) {
    Write-Host "[OK] jq is already installed" -ForegroundColor Green
    $version = & jq --version
    Write-Host "Version: $version" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can now use AI Git commit features!" -ForegroundColor Green
    exit 0
}

Write-Host "[INFO] jq not found, installing..." -ForegroundColor Yellow
Write-Host ""

# Create tools directory
$toolsDir = "C:\Tools"
if (-not (Test-Path $toolsDir)) {
    Write-Host "[INFO] Creating directory: $toolsDir" -ForegroundColor Cyan
    New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
}

# Download jq
$jqUrl = "https://github.com/stedolan/jq/releases/download/jq-1.6/jq-win64.exe"
$jqPath = "$toolsDir\jq.exe"

Write-Host "[INFO] Downloading jq from GitHub..." -ForegroundColor Cyan
Write-Host "URL: $jqUrl" -ForegroundColor Gray

try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $jqUrl -OutFile $jqPath -UseBasicParsing
    Write-Host "[OK] Downloaded to: $jqPath" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to download jq" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please try manual installation:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://stedolan.github.io/jq/download/" -ForegroundColor Yellow
    Write-Host "2. Download jq-win64.exe" -ForegroundColor Yellow
    Write-Host "3. Rename to jq.exe and place in C:\Tools" -ForegroundColor Yellow
    exit 1
}

# Add to PATH
Write-Host ""
Write-Host "[INFO] Adding to PATH..." -ForegroundColor Cyan

$currentPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
if ($currentPath -notlike "*$toolsDir*") {
    $newPath = if ($currentPath) { "$currentPath;$toolsDir" } else { $toolsDir }
    [Environment]::SetEnvironmentVariable("Path", $newPath, [EnvironmentVariableTarget]::User)
    $env:Path += ";$toolsDir"
    Write-Host "[OK] Added $toolsDir to PATH" -ForegroundColor Green
} else {
    Write-Host "[INFO] $toolsDir already in PATH" -ForegroundColor Cyan
}

# Verify installation
Write-Host ""
Write-Host "[INFO] Verifying installation..." -ForegroundColor Cyan

try {
    $version = & $jqPath --version
    Write-Host "[OK] jq installed successfully!" -ForegroundColor Green
    Write-Host "Version: $version" -ForegroundColor Cyan
} catch {
    Write-Host "[ERROR] Installation verification failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test jq
Write-Host ""
Write-Host "[INFO] Testing jq..." -ForegroundColor Cyan

$testJson = '{"name":"test","value":123}'
$testResult = $testJson | & $jqPath .

if ($testResult) {
    Write-Host "[OK] jq is working correctly!" -ForegroundColor Green
} else {
    Write-Host "[WARNING] jq test failed" -ForegroundColor Yellow
}

# Final message
Write-Host ""
Write-Host "================================" -ForegroundColor Blue
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Blue
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your terminal (or run: refreshenv)" -ForegroundColor White
Write-Host "2. Test with: jq --version" -ForegroundColor White
Write-Host "3. Use AI Git commit: ./go.sh 1" -ForegroundColor White
Write-Host ""
Write-Host "If jq command is not found after restart:" -ForegroundColor Yellow
Write-Host "- Close and reopen your terminal" -ForegroundColor White
Write-Host "- Or run: `$env:Path += ';C:\Tools'" -ForegroundColor White
Write-Host ""
