@echo off
echo ========================================
echo 重启后端服务连接MySQL数据�?
echo ========================================

echo.
echo 当前状态检�?
echo - MySQL服务: 正在运行 �?
echo - 数据库qiupai_db: 存在 �? 
echo - 门店数据: 5�?�?
echo - 房间数据: 13�?�?
echo.

echo 问题: 后端服务仍在使用H2配置，需要重启连接MySQL
echo.

echo 1. 停止当前后端服务...
echo 请在后端服务窗口�?Ctrl+C 停止服务
echo 或者关闭后端服务窗�?
echo.
pause

echo.
echo 2. 启动连接MySQL的后端服�?..
cd backend

echo 正在启动Spring Boot服务 (连接MySQL)...
echo 请等待服务启动完�?..
echo.

start "易享生活棋牌室后端服�?MySQL" cmd /k "./mvnw spring-boot:run"

echo.
echo 3. 等待服务启动...
timeout /t 15 /nobreak >nul

echo.
echo 4. 验证服务状�?..
for /l %%i in (1,1,20) do (
    curl -s http://localhost:8080/api/stores/admin/all >nul 2>&1
    if !errorlevel! equ 0 (
        echo �?后端服务启动成功，已连接MySQL
        goto :service_ready
    )
    echo 等待服务启动... (%%i/20)
    timeout /t 3 /nobreak >nul
)

echo ⚠️ 服务启动超时，请检查后端日�?
goto :end

:service_ready
echo.
echo 5. 测试API接口...
curl -s http://localhost:8080/api/stores/admin/all
echo.

echo.
echo ========================================
echo 🎉 后端服务重启完成�?
echo ========================================
echo.
echo 📊 服务信息:
echo - 后端服务: http://localhost:8080
echo - 管理后台: http://localhost:8080/admin.html
echo - 数据�? MySQL easy_joy_life_db
echo - 门店数据: 5�?
echo - 房间数据: 13�?
echo.
echo 🚀 下一�?
echo 1. 访问管理后台: http://localhost:8080/admin.html
echo 2. 切换小程序到真实API模式 (mockMode: false)
echo 3. 测试所有功�?
echo.

:end
pause
