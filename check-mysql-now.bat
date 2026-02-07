@echo off
REM MySQL快速检查脚本 - Windows版
REM 通过SSH连接服务器检查MySQL状态

echo ==========================================
echo MySQL服务状态检查
echo ==========================================
echo.

set SERVER_IP=121.43.96.127
set SERVER_USER=root

echo 正在连接服务器 %SERVER_IP%...
echo.

REM 上传并执行检查脚本
ssh %SERVER_USER%@%SERVER_IP% "bash -s" < check-mysql-now.sh

echo.
echo ==========================================
echo 检查完成
echo ==========================================
pause
