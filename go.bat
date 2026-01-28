@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM EasyJoyLife 一键部署脚本 (Windows版本)
REM 功能：本地构建 + 上传GitHub + 服务器部署

REM 配置变量
set SERVER_HOST=121.43.96.127
set SERVER_USER=root
set SERVER_PATH=/opt/easy-joy-life
set BACKEND_JAR=easy-joy-life-system-1.0.0.jar

REM 颜色定义 (Windows CMD)
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

echo %GREEN%🚀 EasyJoyLife 一键部署脚本启动%NC%
echo %BLUE%================================================%NC%

REM 检查是否在项目根目录
if not exist "backend\pom.xml" (
    echo %RED%错误: 请在项目根目录运行此脚本%NC%
    pause
    exit /b 1
)

REM 解析命令行参数
set ACTION=%1
if "%ACTION%"=="" set ACTION=all

if "%ACTION%"=="1" goto :build
if "%ACTION%"=="build" goto :build
if "%ACTION%"=="2" goto :upload
if "%ACTION%"=="upload" goto :upload
if "%ACTION%"=="3" goto :deploy
if "%ACTION%"=="deploy" goto :deploy
if "%ACTION%"=="4" goto :all
if "%ACTION%"=="all" goto :all
if "%ACTION%"=="-h" goto :help
if "%ACTION%"=="--help" goto :help

echo %RED%错误: 未知选项 '%ACTION%'%NC%
goto :help

:all
echo %BLUE%🔄 执行完整部署流程...%NC%
call :check_git_status
if errorlevel 1 exit /b 1
call :local_build
if errorlevel 1 exit /b 1
call :upload_to_github
if errorlevel 1 exit /b 1
call :deploy_to_server
if errorlevel 1 exit /b 1
goto :success

:build
call :local_build
if errorlevel 1 exit /b 1
goto :success

:upload
call :check_git_status
if errorlevel 1 exit /b 1
call :upload_to_github
if errorlevel 1 exit /b 1
goto :success

:deploy
call :deploy_to_server
if errorlevel 1 exit /b 1
goto :success

:check_git_status
echo %YELLOW%🔍 检查Git状态...%NC%
git status --porcelain > temp_git_status.txt
for /f %%i in (temp_git_status.txt) do (
    echo %YELLOW%警告: 工作目录有未提交的更改%NC%
    set /p CONTINUE="是否继续? (y/N): "
    if /i not "!CONTINUE!"=="y" (
        echo %RED%部署已取消%NC%
        del temp_git_status.txt
        exit /b 1
    )
    goto :git_status_done
)
:git_status_done
del temp_git_status.txt
exit /b 0

:local_build
echo %BLUE%🔨 开始本地构建...%NC%

REM 检查Java环境
java -version >nul 2>&1
if errorlevel 1 (
    echo %RED%错误: Java未安装或未配置到PATH%NC%
    exit /b 1
)

REM 进入后端目录并构建
cd backend
echo %YELLOW%正在编译后端项目...%NC%

REM 使用Maven构建
if exist "mvnw.cmd" (
    call mvnw.cmd clean package -DskipTests -Dmaven.compiler.source=11 -Dmaven.compiler.target=11
) else (
    mvn clean package -DskipTests -Dmaven.compiler.source=11 -Dmaven.compiler.target=11
)

if errorlevel 1 (
    echo %RED%错误: Maven构建失败%NC%
    cd ..
    exit /b 1
)

REM 检查JAR文件是否生成
if not exist "target\%BACKEND_JAR%" (
    echo %RED%错误: JAR文件构建失败%NC%
    cd ..
    exit /b 1
)

echo %GREEN%✅ 后端构建完成%NC%
cd ..
exit /b 0

:upload_to_github
echo %BLUE%📤 上传代码到GitHub...%NC%

REM 添加所有更改
git add .

REM 检查是否有更改需要提交
git diff --staged --quiet
if not errorlevel 1 (
    echo %YELLOW%没有新的更改需要提交%NC%
) else (
    REM 提交更改
    for /f "tokens=1-4 delims=/ " %%i in ('date /t') do set COMMIT_DATE=%%l-%%j-%%k
    for /f "tokens=1-2 delims=: " %%i in ('time /t') do set COMMIT_TIME=%%i:%%j
    set COMMIT_MSG=Deploy: !COMMIT_DATE! !COMMIT_TIME!
    git commit -m "!COMMIT_MSG!"
    echo %GREEN%✅ 代码已提交: !COMMIT_MSG!%NC%
)

REM 推送到远程仓库
git push origin main
if errorlevel 1 (
    echo %RED%错误: 推送到GitHub失败%NC%
    exit /b 1
)

echo %GREEN%✅ 代码已推送到GitHub%NC%
exit /b 0

:deploy_to_server
echo %BLUE%🚀 开始服务器部署...%NC%

REM 检查SSH连接
ssh -o ConnectTimeout=5 %SERVER_USER%@%SERVER_HOST% "echo 'SSH连接正常'" >nul 2>&1
if errorlevel 1 (
    echo %RED%错误: 无法连接到服务器 %SERVER_HOST%%NC%
    exit /b 1
)

echo %YELLOW%正在服务器上执行部署...%NC%

REM 创建临时部署脚本
echo set -e > temp_deploy.sh
echo echo "🔄 进入项目目录..." >> temp_deploy.sh
echo cd /opt/easy-joy-life >> temp_deploy.sh
echo echo "📥 拉取最新代码..." >> temp_deploy.sh
echo git pull origin main >> temp_deploy.sh
echo echo "🛑 停止现有服务..." >> temp_deploy.sh
echo pkill -f "easy-joy-life-system" ^|^| true >> temp_deploy.sh
echo sleep 2 >> temp_deploy.sh
echo echo "🔨 重新编译项目..." >> temp_deploy.sh
echo cd backend >> temp_deploy.sh
echo mvn clean package -DskipTests >> temp_deploy.sh
echo echo "🗄️ 检查数据库连接..." >> temp_deploy.sh
echo mysql -uroot -p'EasyJoyLife2024!@#' -e "SELECT 1;" ^> /dev/null >> temp_deploy.sh
echo echo "🚀 启动新服务..." >> temp_deploy.sh
echo nohup java -jar target/easy-joy-life-system-1.0.0.jar ^> /var/log/easyjoylife.log 2^>^&1 ^& >> temp_deploy.sh
echo echo "⏳ 等待服务启动..." >> temp_deploy.sh
echo sleep 10 >> temp_deploy.sh
echo echo "🔍 检查服务状态..." >> temp_deploy.sh
echo if pgrep -f "easy-joy-life-system" ^> /dev/null; then >> temp_deploy.sh
echo     echo "✅ 服务启动成功" >> temp_deploy.sh
echo     if curl -s http://localhost:8080/api/stores ^> /dev/null; then >> temp_deploy.sh
echo         echo "✅ API接口测试通过" >> temp_deploy.sh
echo     else >> temp_deploy.sh
echo         echo "⚠️ API接口测试失败，请检查日志" >> temp_deploy.sh
echo     fi >> temp_deploy.sh
echo else >> temp_deploy.sh
echo     echo "❌ 服务启动失败" >> temp_deploy.sh
echo     echo "最近的日志:" >> temp_deploy.sh
echo     tail -20 /var/log/easyjoylife.log >> temp_deploy.sh
echo     exit 1 >> temp_deploy.sh
echo fi >> temp_deploy.sh
echo echo "🎉 部署完成!" >> temp_deploy.sh

REM 上传并执行部署脚本
scp temp_deploy.sh %SERVER_USER%@%SERVER_HOST%:/tmp/deploy.sh
ssh %SERVER_USER%@%SERVER_HOST% "chmod +x /tmp/deploy.sh && /tmp/deploy.sh && rm /tmp/deploy.sh"

if errorlevel 1 (
    echo %RED%❌ 服务器部署失败%NC%
    del temp_deploy.sh
    exit /b 1
)

del temp_deploy.sh
echo %GREEN%✅ 服务器部署成功!%NC%
exit /b 0

:success
echo %GREEN%🎉 所有操作完成!%NC%
pause
exit /b 0

:help
echo EasyJoyLife 一键部署脚本 (Windows版本)
echo.
echo 用法: go.bat [选项]
echo.
echo 选项:
echo   1, build     仅本地构建
echo   2, upload    仅上传到GitHub
echo   3, deploy    仅服务器部署
echo   4, all       完整部署流程 (默认)
echo   -h, --help   显示帮助信息
echo.
echo 示例:
echo   go.bat          # 完整部署
echo   go.bat build    # 仅构建
echo   go.bat deploy   # 仅部署到服务器
pause
exit /b 0