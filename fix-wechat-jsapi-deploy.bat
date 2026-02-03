@echo off
echo 🚀 修复微信JSAPI支付并重新部署...

REM 检查是否在项目根目录
if not exist "backend\pom.xml" (
    echo ❌ 请在项目根目录运行此脚本
    pause
    exit /b 1
)

REM 进入后端目录
cd backend

echo 📦 清理旧的编译文件...
call mvnw.cmd clean

echo 🔧 重新编译项目...
call mvnw.cmd compile

if %errorlevel% neq 0 (
    echo ❌ 编译失败，请检查错误信息
    pause
    exit /b 1
)

echo ✅ 编译成功

echo 🏗️ 打包应用...
call mvnw.cmd package -DskipTests

if %errorlevel% neq 0 (
    echo ❌ 打包失败，请检查错误信息
    pause
    exit /b 1
)

echo ✅ 打包成功

echo 🔄 停止现有服务...
REM 查找并停止Java进程
for /f "tokens=2" %%i in ('tasklist /fi "imagename eq java.exe" /fo table /nh ^| findstr "easy-joy-life-system"') do (
    echo 停止进程 PID: %%i
    taskkill /pid %%i /f
)

echo 🚀 启动新服务...
REM 后台启动服务
start /b java -jar target\easy-joy-life-system-1.0.0.jar > ..\logs\app.log 2>&1

echo ⏳ 等待服务启动...
timeout /t 10 /nobreak > nul

echo 🔍 检查服务状态...
curl -s http://localhost:8080/actuator/health > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 服务启动成功
) else (
    echo ⚠️ 服务可能还在启动中，请稍后检查
)

echo 📋 查看最新日志...
if exist "..\logs\app.log" (
    powershell "Get-Content '..\logs\app.log' -Tail 20"
)

echo.
echo 🎉 微信JSAPI支付修复部署完成！
echo.
echo 📝 修复内容:
echo - 更新微信支付SDK到0.2.18版本
echo - 修复total_fee参数错误
echo - 增强参数验证和错误处理
echo - 添加详细的日志输出
echo.
echo 🔧 测试命令:
echo node ..\test-wechat-jsapi-fix.js
echo.
echo 📊 查看日志:
echo powershell "Get-Content '..\logs\app.log' -Wait"

pause