@echo off
chcp 65001 >nul
echo ==========================================
echo 启用MySQL远程访问
echo ==========================================
echo.

echo 正在连接服务器并配置MySQL...
echo.

ssh root@121.43.96.127 "cd /opt/easy-joy-life/deploy && chmod +x enable-mysql-remote-quick.sh && ./enable-mysql-remote-quick.sh"

echo.
echo ==========================================
echo 配置完成！
echo ==========================================
echo.
echo 现在可以尝试重新连接数据库了
echo.
pause
