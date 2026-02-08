@echo off
chcp 65001 >nul
echo ========================================
echo 部署银行卡和支付密码功能
echo ========================================
echo.

echo [1/4] 检查MySQL连接...
mysql -u root -p -e "SELECT 'MySQL连接成功' AS status;" 2>nul
if errorlevel 1 (
    echo ❌ MySQL连接失败，请检查MySQL服务是否启动
    pause
    exit /b 1
)
echo ✅ MySQL连接成功
echo.

echo [2/4] 执行数据库脚本...
mysql -u root -p easy_joy_life_db < backend\src\main\resources\db-init-bank-card-paypassword.sql
if errorlevel 1 (
    echo ❌ 数据库脚本执行失败
    pause
    exit /b 1
)
echo ✅ 数据库表创建成功
echo.

echo [3/4] 验证表创建...
mysql -u root -p easy_joy_life_db -e "SHOW TABLES LIKE 'user_bank%%'; SHOW TABLES LIKE 'user_pay%%';"
echo.

echo [4/4] 重启后端服务...
echo 请手动重启后端服务：
echo   cd backend
echo   mvn spring-boot:run
echo.

echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 下一步：
echo 1. 重启后端服务
echo 2. 在微信开发者工具中重新编译小程序
echo 3. 测试银行卡管理功能
echo 4. 测试支付密码功能
echo.
pause
