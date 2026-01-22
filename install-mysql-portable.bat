@echo off
echo ========================================
echo MySQL便携版自动安装脚本
echo ========================================

echo.
echo 正在为雀胜棋牌室系统安装MySQL便携版...
echo 这将下载并配置一个轻量级的MySQL实例

echo.
echo 1. 创建MySQL目录...
if not exist "mysql-portable" mkdir mysql-portable
cd mysql-portable

echo.
echo 2. 下载MySQL便携版 (约50MB)...
echo 正在下载MySQL 8.0便携版...
echo 请稍等，这可能需要几分钟...

REM 使用PowerShell下载MySQL便携版
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.35-winx64.zip' -OutFile 'mysql.zip'}"

if not exist "mysql.zip" (
    echo 下载失败，请检查网络连接
    echo 或手动下载: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)

echo ✓ MySQL下载完成

echo.
echo 3. 解压MySQL...
powershell -Command "Expand-Archive -Path 'mysql.zip' -DestinationPath '.' -Force"

REM 重命名解压后的目录
for /d %%i in (mysql-*) do ren "%%i" mysql

echo ✓ MySQL解压完成

echo.
echo 4. 创建MySQL配置文件...
echo [mysqld] > mysql\my.ini
echo port=3306 >> mysql\my.ini
echo basedir=mysql >> mysql\my.ini
echo datadir=mysql\data >> mysql\my.ini
echo server-id=1 >> mysql\my.ini
echo default-authentication-plugin=mysql_native_password >> mysql\my.ini
echo character-set-server=utf8mb4 >> mysql\my.ini
echo collation-server=utf8mb4_unicode_ci >> mysql\my.ini
echo skip-ssl >> mysql\my.ini
echo bind-address=0.0.0.0 >> mysql\my.ini

echo ✓ 配置文件创建完成

echo.
echo 5. 初始化MySQL数据目录...
mysql\bin\mysqld --initialize-insecure --console

echo ✓ MySQL初始化完成

echo.
echo 6. 启动MySQL服务...
start "MySQL Server" mysql\bin\mysqld --console

echo 等待MySQL启动...
timeout /t 5 /nobreak >nul

echo.
echo 7. 创建数据库和用户...
mysql\bin\mysql -u root -e "CREATE DATABASE IF NOT EXISTS qiupai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql\bin\mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';"
mysql\bin\mysql -u root -e "FLUSH PRIVILEGES;"

echo ✓ 数据库创建完成

echo.
echo 8. 导入测试数据...
mysql\bin\mysql -u root -proot qiupai_db < ..\backend\src\main\resources\mysql-init.sql

echo ✓ 测试数据导入完成

echo.
echo ========================================
echo 🎉 MySQL便携版安装完成！
echo ========================================
echo.
echo MySQL信息:
echo - 端口: 3306
echo - 用户名: root  
echo - 密码: root
echo - 数据库: qiupai_db
echo.
echo 下一步:
echo 1. MySQL已在后台运行
echo 2. 重启后端服务以连接MySQL
echo 3. 将小程序切换到真实API模式
echo.

cd ..
pause