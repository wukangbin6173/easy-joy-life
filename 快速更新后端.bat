@echo off
REM 易享生活 - 快速更新Spring Boot后端应用
REM 仅重启Spring Boot，不影响MySQL、Redis、Nginx

echo ==========================================
echo 易享生活 - 快速更新后端应用
echo ==========================================
echo.

set SERVER=root@xx.aieo.cn

echo 正在连接服务器并更新后端应用...
echo.

REM 执行远程更新脚本
ssh %SERVER% "cd /opt/easy-joy-life/deploy && ./update-backend-only.sh"

echo.
echo ==========================================
echo 更新完成
echo ==========================================
echo.
echo 查看日志: ssh %SERVER% "journalctl -u easy-joy-life-backend -f"
echo.
pause
