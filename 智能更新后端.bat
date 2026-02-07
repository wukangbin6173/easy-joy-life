@echo off
REM 易享生活 - 智能更新后端应用
REM 自动上传修改的文件并重启Spring Boot

echo ==========================================
echo 易享生活 - 智能更新后端应用
echo ==========================================
echo.

set SERVER=root@xx.aieo.cn
set REMOTE_PATH=/opt/easy-joy-life

echo 步骤1: 上传修改的文件...
echo.

REM 上传Java源代码
echo [1/3] 上传Java源代码...
scp -r backend\src\main\java\com\easyjoylife %SERVER%:%REMOTE_PATH%/backend/src/main/java/com/

REM 上传配置文件
echo [2/3] 上传配置文件...
scp backend\src\main\resources\application-prod.yml %SERVER%:%REMOTE_PATH%/backend/src/main/resources/

REM 上传证书文件（如果有修改）
echo [3/3] 上传证书文件...
scp backend\src\main\resources\cert\*.pem %SERVER%:%REMOTE_PATH%/backend/src/main/resources/cert/ 2>nul

echo.
echo 步骤2: 构建并重启后端服务...
echo.

REM 执行远程更新脚本
ssh %SERVER% "cd %REMOTE_PATH%/deploy && ./update-backend-only.sh"

echo.
echo ==========================================
echo 更新完成！
echo ==========================================
echo.
echo 常用命令:
echo   查看日志: ssh %SERVER% "journalctl -u easy-joy-life-backend -f"
echo   查看状态: ssh %SERVER% "systemctl status easy-joy-life-backend"
echo   测试API:  curl https://xx.aieo.cn/api/stores
echo.
pause
