@echo off
chcp 65001 >nul
echo ========================================
echo 易享生活棋牌室 - 服务器连接脚本
echo ========================================
echo.
echo 服务器信息:
echo IP地址: 121.43.96.127
echo 用户名: root
echo 密码: Easy8286173
echo 域名: easyjoylife.xin
echo.
echo ========================================
echo 连接选项:
echo ========================================
echo 1. SSH连接 (推荐)
echo 2. 显示PuTTY连接信息
echo 3. 一键部署脚本
echo 4. 退出
echo.
set /p choice=请选择操作 (1-4): 

if "%choice%"=="1" goto ssh_connect
if "%choice%"=="2" goto putty_info
if "%choice%"=="3" goto deploy_info
if "%choice%"=="4" goto exit

:ssh_connect
echo.
echo 正在连接服务器...
echo 密码: Easy8286173
echo.
ssh root@121.43.96.127
goto end

:putty_info
echo.
echo ========================================
echo PuTTY连接信息:
echo ========================================
echo Host Name: 121.43.96.127
echo Port: 22
echo Connection Type: SSH
echo Username: root
echo Password: Easy8286173
echo.
echo 请手动打开PuTTY并输入以上信息
pause
goto end

:deploy_info
echo.
echo ========================================
echo 一键部署命令:
echo ========================================
echo 1. 连接服务器后运行:
echo    wget https://raw.githubusercontent.com/wukangbin6173/easy-joy-life/main/deploy/quick-deploy-easyjoylife.sh
echo    chmod +x quick-deploy-easyjoylife.sh
echo    ./quick-deploy-easyjoylife.sh
echo.
echo 2. 部署完成后访问:
echo    https://easyjoylife.xin
echo    https://easyjoylife.xin/admin.html
echo.
pause
goto end

:exit
echo 退出脚本
goto end

:end
echo.
echo 脚本执行完成
pause