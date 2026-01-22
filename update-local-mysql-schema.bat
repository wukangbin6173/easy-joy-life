@echo off
chcp 65001 >nul
echo 更新本地MySQL数据库表结构为复数形式...
echo.

echo 1. 尝试连接MySQL...
mysql -u root -proot -e "SELECT VERSION();" 2>nul
if %errorlevel% neq 0 (
    echo ❌ MySQL连接失败，请确保MySQL服务正在运行
    echo 尝试启动MySQL服务...
    net start mysql80 2>nul
    timeout /t 3 >nul
    mysql -u root -proot -e "SELECT VERSION();" 2>nul
    if %errorlevel% neq 0 (
        echo ❌ 仍然无法连接MySQL
        pause
        exit /b 1
    )
)
echo ✅ MySQL连接成功

echo.
echo 2. 执行数据库更新脚本...
mysql -u root -proot < backend\src\main\resources\mysql-init.sql
if %errorlevel% neq 0 (
    echo ❌ 数据库更新失败
    pause
    exit /b 1
)
echo ✅ 数据库更新成功

echo.
echo 3. 验证表结构...
echo 当前数据库中的表：
mysql -u root -proot easy_joy_life_db -e "SHOW TABLES;"

echo.
echo stores表记录数：
mysql -u root -proot easy_joy_life_db -e "SELECT COUNT(*) as store_count FROM stores;"

echo.
echo rooms表记录数：
mysql -u root -proot easy_joy_life_db -e "SELECT COUNT(*) as room_count FROM rooms;"

echo.
echo ✅ 本地MySQL数据库更新完成！
echo 现在使用复数表名：stores 和 rooms
pause