@echo off
echo 测试本地MySQL数据库表结构...
echo.

echo 1. 检查数据库连接...
mysql -u root -proot -e "SELECT VERSION();" 2>nul
if %errorlevel% neq 0 (
    echo ❌ MySQL连接失败
    pause
    exit /b 1
)
echo ✅ MySQL连接成功

echo.
echo 2. 检查数据库是否存在...
mysql -u root -proot -e "SHOW DATABASES LIKE 'easy_joy_life_db';" 2>nul
if %errorlevel% neq 0 (
    echo ❌ 数据库检查失败
    pause
    exit /b 1
)

echo.
echo 3. 检查表结构...
mysql -u root -proot easy_joy_life_db -e "SHOW TABLES;" 2>nul
if %errorlevel% neq 0 (
    echo ❌ 表结构检查失败
    pause
    exit /b 1
)

echo.
echo 4. 检查stores表数据...
mysql -u root -proot easy_joy_life_db -e "SELECT COUNT(*) as store_count FROM stores;" 2>nul
if %errorlevel% neq 0 (
    echo ❌ stores表不存在或查询失败
) else (
    echo ✅ stores表存在
)

echo.
echo 5. 检查rooms表数据...
mysql -u root -proot easy_joy_life_db -e "SELECT COUNT(*) as room_count FROM rooms;" 2>nul
if %errorlevel% neq 0 (
    echo ❌ rooms表不存在或查询失败
) else (
    echo ✅ rooms表存在
)

echo.
echo 6. 检查是否存在旧的单数表...
mysql -u root -proot easy_joy_life_db -e "SELECT COUNT(*) FROM store;" 2>nul
if %errorlevel% equ 0 (
    echo ⚠️  发现旧的store表，需要删除
) else (
    echo ✅ 没有旧的store表
)

mysql -u root -proot easy_joy_life_db -e "SELECT COUNT(*) FROM room;" 2>nul
if %errorlevel% equ 0 (
    echo ⚠️  发现旧的room表，需要删除
) else (
    echo ✅ 没有旧的room表
)

echo.
echo 测试完成！
pause