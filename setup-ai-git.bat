@echo off
REM ================================================================
REM File: setup-ai-git.bat
REM Description: One-click setup for AI Git commit features
REM ================================================================

echo ================================
echo   AI Git Commit Setup
echo ================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Not running as administrator
    echo Some features may require admin privileges
    echo.
)

REM Step 1: Check Git
echo [1/4] Checking Git...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git not found
    echo Please install Git for Windows: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git is installed
echo.

REM Step 2: Check jq
echo [2/4] Checking jq...
where jq >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] jq not found, installing...
    echo.
    
    REM Run PowerShell installation script
    powershell -ExecutionPolicy Bypass -File install-jq.ps1
    
    if %errorlevel% neq 0 (
        echo [ERROR] jq installation failed
        pause
        exit /b 1
    )
    
    REM Refresh PATH
    call refreshenv.cmd 2>nul
    
    echo.
) else (
    echo [OK] jq is already installed
    jq --version
    echo.
)

REM Step 3: Check scripts
echo [3/4] Checking scripts...

if not exist "go.sh" (
    echo [ERROR] go.sh not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "go.lib.sh" (
    echo [ERROR] go.lib.sh not found
    pause
    exit /b 1
)

if not exist "generate-commit-msg.sh" (
    echo [ERROR] generate-commit-msg.sh not found
    pause
    exit /b 1
)

echo [OK] All scripts found
echo.

REM Step 4: Test DeepSeek API
echo [4/4] Testing DeepSeek API...
echo.

REM Check if Git Bash is available
where bash >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Git Bash not found
    echo Please use Git Bash to run the AI commit features
    echo.
    goto :skip_test
)

REM Run a simple test
echo Testing API connection...
bash -c "curl -s -I https://api.deepseek.com | head -n 1"

if %errorlevel% neq 0 (
    echo [WARNING] Cannot connect to DeepSeek API
    echo Please check your network connection
    echo.
) else (
    echo [OK] API is accessible
    echo.
)

:skip_test

REM Summary
echo ================================
echo   Setup Complete!
echo ================================
echo.
echo Available commands:
echo.
echo   1. Full workflow (build + commit + deploy):
echo      bash -c "./go.sh 1"
echo.
echo   2. Generate commit message only:
echo      bash -c "./generate-commit-msg.sh"
echo.
echo   3. Windows batch script:
echo      git-commit-with-ai.bat
echo.
echo   4. Test API:
echo      bash -c "./test-deepseek-api.sh"
echo.
echo Documentation:
echo   - Quick guide: AI-Git-Commit-快速指南.md
echo   - Full docs:   DeepSeek-Git-Integration.md
echo.
echo [TIP] If jq command is not found, restart your terminal
echo.

pause
