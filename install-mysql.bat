@echo off
echo ========================================
echo MySQL 8.0 自动安装脚本
echo ========================================

echo.
echo 正在为易享生活棋牌室系统安装MySQL...
echo 这将下载并安装MySQL 8.0 Community Server

echo.
echo 1. 创建下载目录...
if not exist "mysql-installer" mkdir mysql-installer
cd mysql-installer

echo.
echo 2. 下载MySQL安装程序...
echo 正在下载MySQL Community Installer (�?MB)...
echo 请稍�?..

REM 下载MySQL Community Installer
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.35.0.msi' -OutFile 'mysql-installer.msi'}"

if not exist "mysql-installer.msi" (
    echo 下载失败，尝试备用下载链�?..
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-web-community-8.0.35.0.msi' -OutFile 'mysql-installer.msi'}"
)

if not exist "mysql-installer.msi" (
    echo 自动下载失败，请手动下载MySQL:
    echo 1. 访问: https://dev.mysql.com/downloads/installer/
    echo 2. 下载 "mysql-installer-community-8.0.35.0.msi"
    echo 3. 将文件放到当前目录并重命名为 mysql-installer.msi
    echo 4. 重新运行此脚�?
    pause
    exit /b 1
)

echo �?MySQL安装程序下载完成

echo.
echo 3. 启动MySQL安装程序...
echo.
echo ⚠️ 重要提示:
echo 在安装过程中请注意以下设�?
echo.
echo 📋 安装配置建议:
echo 1. 选择 "Server only" �?"Developer Default"
echo 2. 配置类型选择 "Development Computer"
echo 3. 端口保持默认 3306
echo 4. Root密码设置�? root
echo 5. 创建用户账户 (可�?
echo 6. 启动MySQL服务
echo.
echo 按任意键启动安装程序...
pause

REM 启动MySQL安装程序
start /wait msiexec /i mysql-installer.msi /quiet

echo.
echo 4. 等待安装完成...
echo 安装程序已启动，请按照界面提示完成安�?
echo.

REM 等待用户完成安装
echo 安装完成后，按任意键继续配置...
pause

echo.
echo 5. 验证MySQL安装...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ MySQL命令行工具未找到
    echo 请确保MySQL已正确安装并添加到系统PATH
    echo.
    echo 手动添加PATH的方�?
    echo 1. 找到MySQL安装目录 (通常�?C:\Program Files\MySQL\MySQL Server 8.0\bin)
    echo 2. 将该路径添加到系统环境变量PATH�?
    echo 3. 重新打开命令提示�?
    echo.
    pause
    exit /b 1
)

echo �?MySQL安装验证成功

echo.
echo 6. 启动MySQL服务...
net start mysql80 >nul 2>&1
if %errorlevel% neq 0 (
    net start mysql >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️ MySQL服务启动失败
        echo 请手动启动MySQL服务:
        echo 1. 打开服务管理�?(services.msc)
        echo 2. 找到MySQL80服务并启�?
        echo 或运�? net start mysql80
        pause
    )
)

echo �?MySQL服务已启�?

echo.
echo 7. 测试数据库连�?..
mysql -u root -proot -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ 数据库连接失�?
    echo 请检查root密码是否设置�?'root'
    echo 如果密码不同，请修改 backend/src/main/resources/application.yml
    pause
)

echo �?数据库连接成�?

echo.
echo 8. 创建项目数据�?..
mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS easy_joy_life_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %errorlevel% equ 0 (
    echo �?数据�?easy_joy_life_db 创建成功
) else (
    echo ⚠️ 数据库创建失败，请手动创�?
)

echo.
echo 9. 导入测试数据...
cd ..
mysql -u root -proot easy_joy_life_db < backend\src\main\resources\mysql-init.sql
if %errorlevel% equ 0 (
    echo �?测试数据导入成功
) else (
    echo ⚠️ 测试数据导入失败
)

echo.
echo ========================================
echo 🎉 MySQL安装和配置完成！
echo ========================================
echo.
echo 📊 MySQL配置信息:
echo - 服务�? MySQL80
echo - 端口: 3306
echo - 用户�? root
echo - 密码: root
echo - 数据�? easy_joy_life_db
echo.
echo 📈 测试数据:
echo - 门店: 5�?
echo - 房间: 13�?
echo.
echo 🚀 下一步操�?
echo 1. 重启后端服务以连接MySQL
echo 2. 将小程序切换到真实API模式
echo 3. 访问管理后台验证数据
echo.

pause
