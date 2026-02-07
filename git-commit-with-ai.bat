@echo off
REM ================================================================
REM File: git-commit-with-ai.bat
REM Description: Windows batch script for AI-powered git commits
REM ================================================================

setlocal enabledelayedexpansion

echo ================================
echo   AI Git Commit Helper
echo ================================
echo.

REM Check if Git Bash is available
where bash >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git Bash not found
    echo Please install Git for Windows: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check if jq is available
where jq >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] jq not found - AI generation will not work
    echo Download jq from: https://stedolan.github.io/jq/download/
    echo.
    set USE_AI=0
) else (
    set USE_AI=1
)

REM Check for changes
git status --short
if %errorlevel% neq 0 (
    echo [ERROR] Not a git repository
    pause
    exit /b 1
)

echo.
echo Commit message options:
echo   1. Auto-generate with DeepSeek AI
echo   2. Enter custom message
echo   3. Use default timestamp
echo.

set /p OPTION="Choose option (1-3, default: 1): "
if "!OPTION!"=="" set OPTION=1

if "!OPTION!"=="1" (
    if !USE_AI!==0 (
        echo [WARNING] jq not available, using default message
        set COMMIT_MSG=Deploy: %date% %time%
    ) else (
        echo.
        echo [INFO] Calling go.sh with AI generation...
        bash -c "./go.sh 1"
        exit /b 0
    )
) else if "!OPTION!"=="2" (
    set /p COMMIT_MSG="Enter commit message: "
    if "!COMMIT_MSG!"=="" set COMMIT_MSG=Deploy: %date% %time%
) else (
    set COMMIT_MSG=Deploy: %date% %time%
)

REM Add all changes
echo.
echo [INFO] Adding all changes...
git add .

REM Commit
echo [INFO] Committing with message: !COMMIT_MSG!
git commit -m "!COMMIT_MSG!"

if %errorlevel% neq 0 (
    echo [ERROR] Commit failed
    pause
    exit /b 1
)

REM Ask about push
echo.
set /p PUSH="Push to remote? (y/n): "
if /i "!PUSH!"=="y" (
    echo [INFO] Pushing to remote...
    git push
    if %errorlevel% neq 0 (
        echo [ERROR] Push failed
        pause
        exit /b 1
    )
    echo [SUCCESS] Pushed successfully!
)

echo.
echo [SUCCESS] Done!
pause
