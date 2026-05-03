@echo off
REM 易享生活棋牌室小程序 - Windows版服务状态检查脚本
REM 用途: 通过SSH连接到服务器并执行检查脚本

echo ==========================================
echo 易享生活棋牌室小程序 - 服务状态检查
echo ==========================================
echo.

REM 服务器信息
set SERVER_IP=47.97.179.50
set SERVER_USER=root

echo 正在连接到服务器 %SERVER_IP%...
echo.

REM 通过SSH执行检查脚本
ssh %SERVER_USER%@%SERVER_IP% "cd /opt/easy-joy-life/deploy && chmod +x check-all-services.sh && ./check-all-services.sh"

echo.
echo ==========================================
echo 检查完成
echo ==========================================
pause
