@echo off
echo ========================================
echo 易享生活棋牌室管理系统 - MySQL版本启动
echo ========================================

echo.
echo 1. 检查MySQL服务状态...
sc query mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo 警告: MySQL服务未运行，正在尝试启动...
    net start mysql
    if %errorlevel% neq 0 (
        echo 错误: 无法启动MySQL服务
        echo 请手动启动MySQL或运行: net start mysql
        pause
        exit /b 1
    )
)
echo MySQL服务正在运行 ✓

echo.
echo 2. 检查数据库连接...
mysql -u root -proot -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 无法连接到MySQL数据库
    echo 请检查:
    echo - MySQL服务是否运行
    echo - 用户名密码是否正确 (当前配置: root/root)
    echo - 端口3306是否可用
    pause
    exit /b 1
)
echo 数据库连接正常 ✓

echo.
echo 3. 检查数据库是否存在...
mysql -u root -proot -e "USE qiupai_db;" >nul 2>&1
if %errorlevel% neq 0 (
    echo 数据库不存在，正在创建...
    mysql -u root -proot < backend/src/main/resources/mysql-init.sql
    if %errorlevel% equ 0 (
        echo 数据库创建成功 ✓
    ) else (
        echo 数据库创建失败
        pause
        exit /b 1
    )
) else (
    echo 数据库已存在 ✓
)

echo.
echo 4. 启动后端服务...
cd backend
echo 正在编译和启动Spring Boot应用...
start "易享生活棋牌室后端服务" cmd /k "./mvnw spring-boot:run"

echo.
echo 5. 等待服务启动...
timeout /t 10 /nobreak >nul

echo.
echo 6. 检查服务状态...
for /l %%i in (1,1,30) do (
    curl -s http://localhost:8080/api/stores >nul 2>&1
    if !errorlevel! equ 0 (
        echo 后端服务启动成功 ✓
        goto :service_ready
    )
    echo 等待服务启动... (%%i/30)
    timeout /t 2 /nobreak >nul
)

echo 服务启动超时，请检查日志
goto :end

:service_ready
echo.
echo ========================================
echo 🎉 系统启动完成！
echo ========================================
echo.
echo 📊 管理后台: http://localhost:8080/admin.html
echo 🔧 API接口: http://localhost:8080/api/stores
echo 📱 小程序: 用微信开发者工具打开 miniprogram 目录
echo.
echo 📋 数据库信息:
echo   - 类型: MySQL 8.0
echo   - 数据库: qiupai_db
echo   - 用户: root
echo   - 密码: root
echo   - 端口: 3306
echo.
echo 📈 测试数据:
echo   - 门店数量: 5个
echo   - 房间数量: 13个
echo.
echo 💡 提示:
echo   - 可通过管理后台实时修改数据
echo   - 小程序会自动同步数据库变更
echo   - 数据持久化存储，重启不丢失
echo.

:end
pause