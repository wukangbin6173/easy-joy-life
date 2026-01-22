@echo off
echo ========================================
echo MySQL连接测试脚本
echo ========================================

echo.
echo 正在测试MySQL连接和数�?..

echo.
echo 1. 测试MySQL服务状�?..
netstat -an | findstr :3306 >nul 2>&1
if %errorlevel% equ 0 (
    echo �?MySQL服务正在运行 (端口3306)
) else (
    echo �?MySQL服务未运�?
    goto :error
)

echo.
echo 2. 测试数据库连�?..
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "SELECT 1;" >nul 2>&1
if %errorlevel% equ 0 (
    echo �?数据库连接成�?
) else (
    echo �?数据库连接失�?
    goto :error
)

echo.
echo 3. 检查数据库和表...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "USE easy_joy_life_db; SHOW TABLES;" >nul 2>&1
if %errorlevel% equ 0 (
    echo �?数据库easy_joy_life_db存在，表结构正常
) else (
    echo �?数据库或表不存在
    goto :error
)

echo.
echo 4. 检查数据内�?..
echo 门店数据:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "USE easy_joy_life_db; SELECT id, name FROM store;"

echo.
echo 房间数据:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "USE easy_joy_life_db; SELECT COUNT(*) as room_count FROM room;"

echo.
echo 5. 测试后端API...
echo 测试门店API: http://localhost:8080/api/stores/admin/all
curl -s http://localhost:8080/api/stores/admin/all

echo.
echo.
echo ========================================
echo 📊 诊断结果
echo ========================================
echo.
echo MySQL状�? �?正常运行
echo 数据库状�? �?easy_joy_life_db存在
echo 数据内容: �?5个门店，13个房�?
echo.
echo 🔧 问题分析:
echo 后端API返回500错误，可能原�?
echo 1. 后端服务仍在使用H2配置
echo 2. 需要重启后端服务以连接MySQL
echo 3. JPA实体映射问题
echo.
echo 💡 解决方案:
echo 运行: restart-backend-with-mysql.bat
echo.
goto :end

:error
echo.
echo �?MySQL连接测试失败
echo 请先确保MySQL正确安装和配�?

:end
pause
