@echo off
REM ============================================================================
REM 部署银行卡和支付密码功能到服务器
REM ============================================================================

echo ==========================================
echo 部署银行卡和支付密码功能
echo ==========================================
echo.

REM 1. 检查JAR文件是否存在
echo 1. 检查JAR文件...
if not exist "backend\target\easy-joy-life-system-1.0.0.jar" (
    echo    X JAR文件不存在，请先编译
    echo    运行: cd backend ^&^& mvnw.cmd clean package -DskipTests
    exit /b 1
)
echo    √ JAR文件存在
echo.

REM 2. 上传数据库脚本到服务器
echo 2. 上传数据库脚本...
scp backend\src\main\resources\db-init-bank-card-paypassword.sql root@xx.aieo.cn:/tmp/
if errorlevel 1 (
    echo    X 上传数据库脚本失败
    exit /b 1
)
echo    √ 数据库脚本已上传
echo.

REM 3. 执行数据库脚本
echo 3. 执行数据库脚本...
ssh root@xx.aieo.cn "mysql -u root -pEasyJoyLife2024!@# easy_joy_life_db < /tmp/db-init-bank-card-paypassword.sql"
if errorlevel 1 (
    echo    X 执行数据库脚本失败
    exit /b 1
)
echo    √ 数据库表创建成功
echo.

REM 4. 停止后端服务
echo 4. 停止后端服务...
ssh root@xx.aieo.cn "systemctl stop easy-joy-life-backend"
echo    √ 服务已停止
echo.

REM 5. 备份旧的JAR文件
echo 5. 备份旧的JAR文件...
ssh root@xx.aieo.cn "if [ -f /opt/easy-joy-life/backend/target/easy-joy-life-system-1.0.0.jar ]; then cp /opt/easy-joy-life/backend/target/easy-joy-life-system-1.0.0.jar /opt/easy-joy-life/backend/target/easy-joy-life-system-1.0.0.jar.backup.$(date +%%Y%%m%%d%%H%%M%%S); fi"
echo    √ 已备份
echo.

REM 6. 上传新的JAR文件
echo 6. 上传新的JAR文件...
scp backend\target\easy-joy-life-system-1.0.0.jar root@xx.aieo.cn:/opt/easy-joy-life/backend/target/
if errorlevel 1 (
    echo    X 上传JAR文件失败
    exit /b 1
)
echo    √ JAR文件已上传
echo.

REM 7. 启动后端服务
echo 7. 启动后端服务...
ssh root@xx.aieo.cn "systemctl start easy-joy-life-backend"
echo    √ 服务已启动
echo.

REM 8. 等待服务启动
echo 8. 等待服务启动...
timeout /t 15 /nobreak >nul
echo    √ 等待完成
echo.

REM 9. 检查服务状态
echo 9. 检查服务状态...
ssh root@xx.aieo.cn "systemctl is-active easy-joy-life-backend"
if errorlevel 1 (
    echo    X 服务启动失败
    echo.
    echo 查看日志:
    ssh root@xx.aieo.cn "journalctl -u easy-joy-life-backend -n 50 --no-pager"
    exit /b 1
)
echo    √ 服务运行中
echo.

REM 10. 测试API
echo 10. 测试API...
curl -s https://xx.aieo.cn/api/stores >nul 2>&1
if errorlevel 1 (
    echo    ! API访问失败，但服务已启动
) else (
    echo    √ API访问正常
)
echo.

echo ==========================================
echo √ 部署完成！
echo ==========================================
echo.
echo 新增功能:
echo   - 银行卡管理 API
echo   - 支付密码管理 API
echo.
echo 测试API:
echo   - 获取银行卡列表: curl https://xx.aieo.cn/api/bank-cards/user/{userId}
echo   - 检查支付密码: curl https://xx.aieo.cn/api/pay-password/exists/{userId}
echo.
echo 查看日志: ssh root@xx.aieo.cn "journalctl -u easy-joy-life-backend -f"
echo.

pause
