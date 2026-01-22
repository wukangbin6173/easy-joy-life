@echo off
echo 正在设置MySQL数据�?..

REM 检查MySQL是否安装
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到MySQL，请先安装MySQL
    echo 下载地址: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)

echo MySQL已安装，正在创建数据�?..

REM 创建数据库和�?
mysql -u root -p < backend/src/main/resources/mysql-init.sql

if %errorlevel% equ 0 (
    echo 数据库创建成功！
    echo 数据库名: easy_joy_life_db
    echo 用户�? root
    echo 请确保在application.yml中配置了正确的密�?
) else (
    echo 数据库创建失败，请检查MySQL连接
)

pause
