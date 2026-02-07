@echo off
REM ================================================================
REM File: go-enhanced.bat
REM Description: Windows wrapper for go.sh
REM Project: EasyJoyLife
REM ================================================================

setlocal enabledelayedexpansion

REM Check if Git Bash is available
where bash >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Git Bash not found
    echo Please install Git for Windows: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Run go.sh with Git Bash
if "%~1"=="" (
    bash go.sh
) else (
    bash go.sh %1
)

exit /b %errorlevel%
