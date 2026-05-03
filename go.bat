@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ================================================================
REM File: go.bat
REM Description: Windows native deployment script
REM Project: EasyJoyLife
REM ================================================================

REM 配置
set SERVER_HOST=47.97.179.50
set SERVER_USER=root
set SERVER_PATH=/opt/easy-joy-life
set BACKEND_JAR=easy-joy-life-system-1.0.0.jar
set SITE_URL=https://xx.aieo.cn
set GIT_BRANCH=main
set DEEPSEEK_API_KEY=sk-a1374a0606a744c3888ee224b5b8252c

REM 颜色定义（使用 PowerShell 实现）
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "CYAN=[96m"
set "NC=[0m"

REM ================================================================
REM 显示帮助
REM ================================================================
if "%1"=="help" goto :help
if "%1"=="-h" goto :help
if "%1"=="--help" goto :help
if "%1"=="/?" goto :help

REM ================================================================
REM 显示菜单
REM ================================================================
echo.
echo ================================
echo   EasyJoyLife - 一键部署
echo ================================
echo.

if not "%1"=="" (
    set choice=%1
    echo 执行选项: !choice!
    goto :execute
)

echo 请选择操作:
echo 0. 启动本地开发环境
echo 1. Git 提交并部署到服务器 ^(默认^)
echo 2. 仅构建后端
echo 3. 清理缓存
echo 4. 退出
echo.

REM 等待用户输入（10秒超时）
set choice=
set /p choice="请输入选择 (直接回车选择 1): " 

if "!choice!"=="" set choice=1
echo.

:execute
if "%choice%"=="4" (
    echo 再见!
    exit /b 0
)

REM 记录开始时间
set START_TIME=%time%

REM 执行对应选项
if "%choice%"=="0" goto :option0
if "%choice%"=="1" goto :option1
if "%choice%"=="2" goto :option2
if "%choice%"=="3" goto :option3

echo 无效选项: %choice%
exit /b 1

REM ================================================================
REM 选项 0: 启动本地开发环境
REM ================================================================
:option0
echo 启动本地开发环境...
echo 此功能需要在 go.0.sh 中实现
exit /b 0

REM ================================================================
REM 选项 1: Git 提交并部署到服务器
REM ================================================================
:option1
echo Git 提交并部署到服务器
echo.

REM 1. 检查 Git 状态
echo 检查 Git 状态...
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo 错误: 不是 Git 仓库
    exit /b 1
)

for /f %%i in ('git status --porcelain') do (
    echo 警告: 工作目录有未提交的更改
    set /p continue="仍然继续? (y/n, 默认 y): "
    if "!continue!"=="" set continue=y
    if /i not "!continue!"=="y" (
        echo 操作已取消
        exit /b 1
    )
    goto :continue_build
)
:continue_build

REM 2. 检查 Java
echo.
echo 检查 Java 环境...
java -version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到 Java
    echo 请安装 Java 11+
    exit /b 1
)
echo Java 环境正常

REM 3. 构建后端
echo.
echo 本地构建后端...
if exist "backend\mvnw.cmd" (
    echo 使用 Maven Wrapper...
    cd backend
    call mvnw.cmd clean package -DskipTests
    if errorlevel 1 (
        echo 错误: 构建失败
        cd ..
        exit /b 1
    )
    cd ..
) else if exist "backend\pom.xml" (
    echo 使用系统 Maven...
    where mvn >nul 2>&1
    if errorlevel 1 (
        echo 错误: 未找到 Maven
        echo 请安装 Maven: scoop install maven
        exit /b 1
    )
    cd backend
    call mvn clean package -DskipTests
    if errorlevel 1 (
        echo 错误: 构建失败
        cd ..
        exit /b 1
    )
    cd ..
) else (
    echo 错误: 未找到 backend 目录
    exit /b 1
)

if not exist "backend\target\%BACKEND_JAR%" (
    echo 错误: JAR 文件未生成
    exit /b 1
)
echo 后端构建完成

REM 4. Git 提交
echo.
echo 提交消息选项:
echo   1. 使用 DeepSeek AI 自动生成 ^(推荐^)
echo   2. 手动输入提交消息
echo   3. 使用默认时间戳
echo.
set /p msg_option="选择方式 (1-3, 默认: 1): "
if "!msg_option!"=="" set msg_option=1

if "!msg_option!"=="2" (
    set /p COMMIT_MSG="请输入提交消息: "
    if "!COMMIT_MSG!"=="" (
        for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set COMMIT_MSG=部署: %%a-%%b-%%c
        for /f "tokens=1-2 delims=: " %%a in ('time /t') do set COMMIT_MSG=!COMMIT_MSG! %%a:%%b
    )
) else if "!msg_option!"=="3" (
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set COMMIT_MSG=部署: %%a-%%b-%%c
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set COMMIT_MSG=!COMMIT_MSG! %%a:%%b
) else (
    REM 使用 AI 生成
    echo 使用 DeepSeek AI 生成提交消息...
    
    REM 先添加所有更改到暂存区
    git add .
    
    REM 获取 git diff
    git diff --cached --stat > "%TEMP%\git_diff.txt" 2>&1
    
    REM 检查是否有暂存的更改
    for /f %%i in ('git diff --cached --stat ^| find /c /v ""') do set DIFF_LINES=%%i
    if !DIFF_LINES! EQU 0 (
        echo 警告: 没有暂存的更改
        for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set COMMIT_MSG=部署: %%a-%%b-%%c
        for /f "tokens=1-2 delims=: " %%a in ('time /t') do set COMMIT_MSG=!COMMIT_MSG! %%a:%%b
    ) else (
        REM 调用 PowerShell 脚本生成提交消息
        set "DEEPSEEK_API_KEY=%DEEPSEEK_API_KEY%"
        powershell -NoProfile -ExecutionPolicy Bypass -File "go.ai.ps1"
        
        REM 读取 AI 生成的消息（使用 UTF-8 编码）
        set "AI_MSG="
        for /f "usebackq delims=" %%i in ("%TEMP%\ai_commit_msg.txt") do (
            if not defined AI_MSG set "AI_MSG=%%i"
        )
        
        if "!AI_MSG!"=="API_ERROR" (
            echo 警告: AI 生成失败，使用默认消息
            for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set COMMIT_MSG=部署: %%a-%%b-%%c
            for /f "tokens=1-2 delims=: " %%a in ('time /t') do set COMMIT_MSG=!COMMIT_MSG! %%a:%%b
        ) else if "!AI_MSG!"=="NO_CHANGES" (
            echo 警告: 没有暂存的更改
            for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set COMMIT_MSG=部署: %%a-%%b-%%c
            for /f "tokens=1-2 delims=: " %%a in ('time /t') do set COMMIT_MSG=!COMMIT_MSG! %%a:%%b
        ) else if "!AI_MSG!"=="" (
            echo 警告: AI 返回空消息，使用默认消息
            for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set COMMIT_MSG=部署: %%a-%%b-%%c
            for /f "tokens=1-2 delims=: " %%a in ('time /t') do set COMMIT_MSG=!COMMIT_MSG! %%a:%%b
        ) else (
            echo.
            set /p use_ai="使用此提交消息? (y/n, 默认 y): "
            if "!use_ai!"=="" set use_ai=y
            if /i "!use_ai!"=="y" (
                set "COMMIT_MSG=!AI_MSG!"
            ) else (
                set /p COMMIT_MSG="请输入自定义提交消息: "
                if "!COMMIT_MSG!"=="" (
                    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set COMMIT_MSG=部署: %%a-%%b-%%c
                    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set COMMIT_MSG=!COMMIT_MSG! %%a:%%b
                )
            )
        )
        
        REM 清理临时文件
        del "%TEMP%\git_diff.txt" 2>nul
        del "%TEMP%\ai_commit_msg.txt" 2>nul
    )
)

echo.
echo 提交到 Git...
git add .
git diff --staged --quiet
if not errorlevel 1 (
    echo 没有新的更改需要提交
) else (
    git commit -m "!COMMIT_MSG!"
    if errorlevel 1 (
        echo 错误: 提交失败
        exit /b 1
    )
    echo 代码已提交: !COMMIT_MSG!
    
    echo.
    echo 推送到 GitHub...
    git push origin %GIT_BRANCH%
    if errorlevel 1 (
        echo 错误: 推送失败
        exit /b 1
    )
    echo 代码已推送到 GitHub
)

REM 5. 部署到服务器
echo.
echo 部署到服务器...
echo 服务器: %SERVER_HOST%
echo 路径: %SERVER_PATH%
echo.
set /p deploy_confirm="确认部署到生产服务器? (y/n, 默认 y): "
if "!deploy_confirm!"=="" set deploy_confirm=y
if /i not "!deploy_confirm!"=="y" (
    echo 部署已取消
    exit /b 0
)

REM 检查 SSH
where ssh >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到 SSH
    echo 请安装 OpenSSH 或 Git for Windows
    exit /b 1
)

echo.
echo 在服务器上执行部署...
ssh %SERVER_USER%@%SERVER_HOST% "cd %SERVER_PATH% && git pull origin main && pkill -f 'easy-joy-life-system' || true && sleep 2 && cd backend && mvn clean package -DskipTests && nohup java -jar target/%BACKEND_JAR% > /var/log/easyjoylife.log 2>&1 & sleep 10 && nginx -s reload && echo '部署完成'"

if errorlevel 1 (
    echo 错误: 服务器部署失败
    exit /b 1
)

REM 6. 验证部署
echo.
echo 验证部署...
timeout /t 3 /nobreak >nul

curl -s "%SITE_URL%/api/stores" >nul 2>&1
if not errorlevel 1 (
    echo 部署验证成功 - API 正常响应
    echo 访问地址: %SITE_URL%
) else (
    echo 警告: API 暂未响应，可能需要更多时间
)

REM 7. 完成
echo.
echo ================================
echo 部署完成!
echo ================================
echo.
echo 部署摘要:
echo   提交: !COMMIT_MSG!
echo   服务器: %SERVER_HOST%
echo   网址: %SITE_URL%
echo.
echo 后续步骤:
echo   1. 测试应用: %SITE_URL%
echo   2. 查看日志: ssh %SERVER_USER%@%SERVER_HOST% 'tail -f /var/log/easyjoylife.log'
echo   3. 监控服务: ssh %SERVER_USER%@%SERVER_HOST% 'ps aux ^| grep easy-joy-life'
echo.

goto :end

REM ================================================================
REM 选项 2: 仅构建后端
REM ================================================================
:option2
echo 仅构建后端...
echo.

REM 检查 Java
java -version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到 Java
    exit /b 1
)

REM 构建
if exist "backend\mvnw.cmd" (
    echo 使用 Maven Wrapper...
    cd backend
    call mvnw.cmd clean package -DskipTests
    cd ..
) else (
    echo 使用系统 Maven...
    cd backend
    call mvn clean package -DskipTests
    cd ..
)

if exist "backend\target\%BACKEND_JAR%" (
    echo 构建完成: backend\target\%BACKEND_JAR%
) else (
    echo 错误: 构建失败
    exit /b 1
)

goto :end

REM ================================================================
REM 选项 3: 清理缓存
REM ================================================================
:option3
echo 清理缓存...
if exist "backend\target" (
    rmdir /s /q "backend\target"
    echo 已清理 backend\target
)
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo 已清理 node_modules
)
echo 清理完成
goto :end

REM ================================================================
REM 帮助信息
REM ================================================================
:help
echo.
echo ================================
echo   EasyJoyLife - 一键部署
echo ================================
echo.
echo 用法: go.bat [选项]
echo.
echo 选项:
echo   (无参数)     - 显示交互式菜单
echo   0            - 启动本地开发环境
echo   1            - Git 提交并部署到服务器 ^(默认^)
echo   2            - 仅构建后端
echo   3            - 清理缓存
echo   help         - 显示此帮助信息
echo.
echo 示例:
echo   go.bat       - 交互模式
echo   go.bat 1     - 快速部署
echo   go.bat 2     - 仅构建
echo.
exit /b 0

REM ================================================================
REM 结束
REM ================================================================
:end
echo.
echo 总耗时: 从 %START_TIME% 到 %time%
exit /b 0
