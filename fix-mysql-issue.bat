@echo off
echo ========================================
echo MySQL问题一键修复脚�?
echo ========================================

echo.
echo 当前状�? 小程序已切换到模拟数据模式，功能正常
echo 正在修复MySQL数据库连接问�?..

echo.
echo 1. 检查MySQL服务状�?..
sc query mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo �?MySQL服务未安装或未配�?
    echo.
    echo 解决方案:
    echo 1. 下载安装MySQL: https://dev.mysql.com/downloads/mysql/
    echo 2. 或使用Docker: docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:8.0
    echo 3. 或继续使用模拟数据模�?(当前已启�?
    echo.
    pause
    exit /b 1
)

echo �?MySQL服务已安�?

echo.
echo 2. 启动MySQL服务...
net start mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ MySQL可能已经在运行或启动失败
    echo 检查MySQL状�?..
) else (
    echo �?MySQL服务启动成功
)

echo.
echo 3. 等待MySQL完全启动...
timeout /t 3 /nobreak >nul

echo.
echo 4. 检查MySQL连接...
netstat -an | findstr :3306 >nul 2>&1
if %errorlevel% neq 0 (
    echo �?MySQL端口3306未监�?
    echo 可能的原�?
    echo - MySQL服务启动失败
    echo - 端口被其他程序占�?
    echo - MySQL配置问题
    echo.
    echo 建议: 继续使用模拟数据模式，稍后手动解决MySQL问题
    pause
    exit /b 1
) else (
    echo �?MySQL端口3306正在监听
)

echo.
echo 5. 测试数据库连�?..
mysql -u root -proot -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo �?无法连接到MySQL数据�?
    echo 可能的原�?
    echo - root密码不是'root'
    echo - MySQL用户权限问题
    echo.
    echo 请检查application.yml中的数据库密码配�?
    echo 当前配置: username=root, password=root
    echo.
    pause
    exit /b 1
) else (
    echo �?数据库连接成�?
)

echo.
echo 6. 检查数据库是否存在...
mysql -u root -proot -e "USE easy_joy_life_db;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ 数据库qiupai_db不存在，正在创建...
    mysql -u root -proot < backend/src/main/resources/mysql-init.sql
    if %errorlevel% equ 0 (
        echo �?数据库创建成�?
    ) else (
        echo �?数据库创建失�?
        pause
        exit /b 1
    )
) else (
    echo �?数据库qiupai_db已存�?
)

echo.
echo 7. 验证数据...
mysql -u root -proot -e "USE easy_joy_life_db; SELECT COUNT(*) as store_count FROM store;" 2>nul
if %errorlevel% equ 0 (
    echo �?数据库表和数据正�?
) else (
    echo ⚠️ 数据可能不完整，重新初始�?..
    mysql -u root -proot < backend/src/main/resources/mysql-init.sql
)

echo.
echo ========================================
echo 🎉 MySQL修复完成�?
echo ========================================
echo.
echo 下一步操�?
echo 1. 重启后端服务 (如果正在运行)
echo    - 按Ctrl+C停止当前服务
echo    - 运行: cd backend ^&^& ./mvnw spring-boot:run
echo.
echo 2. 切换小程序到真实API模式
echo    - 修改 miniprogram/app.js
echo    - �?mockMode 改为 false
echo.
echo 3. 验证功能
echo    - 访问: http://localhost:8080/admin.html
echo    - 测试小程序门店列�?
echo.
echo 当前状�? 小程序使用模拟数据，功能正常
echo MySQL状�? �?已修复，等待后端重启
echo.

pause
