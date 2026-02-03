@echo off
echo 🚀 开始部署易享生活后端服务到服务器...

REM 配置变量
set SERVER_HOST=xx.aieo.cn
set SERVER_USER=root
set SERVER_PORT=22
set JAR_FILE=backend\target\easy-joy-life-system-1.0.0.jar
set REMOTE_DIR=/opt/easyjoylife

REM 检查JAR文件是否存在
if not exist "%JAR_FILE%" (
    echo ❌ JAR文件不存在: %JAR_FILE%
    echo 请先运行编译命令: cd backend ^&^& mvnw.cmd package -DskipTests
    pause
    exit /b 1
)

echo ✅ 找到JAR文件: %JAR_FILE%

REM 检查是否安装了scp和ssh（通过Git Bash或WSL）
where scp >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到scp命令
    echo 请安装Git Bash或WSL，或使用Linux环境进行部署
    echo 或者手动上传JAR文件到服务器
    pause
    exit /b 1
)

echo 🔍 检查服务器连接...
ssh -o ConnectTimeout=10 -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "echo '服务器连接成功'" 2>nul
if %errorlevel% neq 0 (
    echo ❌ 无法连接到服务器 %SERVER_HOST%
    echo 请检查:
    echo 1. 服务器地址是否正确
    echo 2. SSH密钥是否配置
    echo 3. 网络连接是否正常
    pause
    exit /b 1
)

echo ✅ 服务器连接正常

echo 📁 创建远程目录...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "mkdir -p %REMOTE_DIR%/backup %REMOTE_DIR%/logs"

echo 💾 备份现有服务...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "if [ -f %REMOTE_DIR%/easy-joy-life-system-1.0.0.jar ]; then cp %REMOTE_DIR%/easy-joy-life-system-1.0.0.jar %REMOTE_DIR%/backup/easy-joy-life-system-1.0.0.jar.backup.$(date +%%Y%%m%%d_%%H%%M%%S); echo '✅ 已备份现有JAR文件'; else echo '📝 没有找到现有JAR文件，跳过备份'; fi"

echo 🛑 停止现有服务...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "JAVA_PID=$(ps aux | grep 'easy-joy-life-system' | grep -v grep | awk '{print $2}'); if [ ! -z \"$JAVA_PID\" ]; then echo '停止进程 PID: '$JAVA_PID; kill -15 $JAVA_PID; sleep 5; if kill -0 $JAVA_PID 2>/dev/null; then echo '强制停止进程'; kill -9 $JAVA_PID; fi; echo '✅ 服务已停止'; else echo '📝 没有找到运行中的服务'; fi"

echo 📤 上传新的JAR文件...
scp -P %SERVER_PORT% "%JAR_FILE%" %SERVER_USER%@%SERVER_HOST%:%REMOTE_DIR%/
if %errorlevel% neq 0 (
    echo ❌ JAR文件上传失败
    pause
    exit /b 1
)
echo ✅ JAR文件上传成功

echo 📤 上传配置文件...
if exist "backend\src\main\resources\application-prod.yml" (
    scp -P %SERVER_PORT% "backend\src\main\resources\application-prod.yml" %SERVER_USER%@%SERVER_HOST%:%REMOTE_DIR%/
    echo ✅ 生产环境配置文件上传成功
)

echo 🚀 启动新服务...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "cd %REMOTE_DIR% && export JAVA_HOME=/usr/lib/jvm/java-21-openjdk && export PATH=$JAVA_HOME/bin:$PATH && nohup java -jar -Xms512m -Xmx1024m -Dspring.profiles.active=prod -Dserver.port=8081 easy-joy-life-system-1.0.0.jar > logs/app.log 2>&1 & echo '✅ 服务启动命令已执行' && echo '📋 进程ID: '$!"

echo ⏳ 等待服务启动...
timeout /t 15 /nobreak > nul

echo 🔍 检查服务状态...
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "JAVA_PID=$(ps aux | grep 'easy-joy-life-system' | grep -v grep | awk '{print $2}'); if [ ! -z \"$JAVA_PID\" ]; then echo '✅ 服务进程运行中，PID: '$JAVA_PID; else echo '❌ 服务进程未找到'; echo '📋 查看启动日志:'; tail -n 20 %REMOTE_DIR%/logs/app.log; exit 1; fi; if netstat -tlnp | grep ':8081' > /dev/null; then echo '✅ 端口8081正在监听'; else echo '⚠️ 端口8081未监听，服务可能还在启动中'; fi"

echo 🧪 测试API接口...
timeout /t 5 /nobreak > nul

curl -s --connect-timeout 10 "http://%SERVER_HOST%:8081/actuator/health" > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 健康检查接口正常
) else (
    echo ⚠️ 健康检查接口暂时无法访问，可能还在启动中
)

echo.
echo 🎉 部署完成！
echo.
echo 📋 部署信息:
echo - 服务器: %SERVER_HOST%
echo - 端口: 8081
echo - JAR文件: easy-joy-life-system-1.0.0.jar
echo - 部署目录: %REMOTE_DIR%
echo - 日志文件: %REMOTE_DIR%/logs/app.log
echo.
echo 🔧 常用命令:
echo # 查看服务状态
echo ssh %SERVER_USER%@%SERVER_HOST% 'ps aux ^| grep easy-joy-life-system'
echo.
echo # 查看实时日志
echo ssh %SERVER_USER%@%SERVER_HOST% 'tail -f %REMOTE_DIR%/logs/app.log'
echo.
echo 🧪 测试命令:
echo node test-wechat-jsapi-fix.js
echo.
echo 📝 修复内容:
echo - 修复微信JSAPI支付total_fee参数错误
echo - 更新微信支付SDK到0.2.17版本
echo - 增强参数验证和错误处理
echo - 添加详细的日志输出

pause