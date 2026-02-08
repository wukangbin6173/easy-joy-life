@echo off
chcp 65001 >nul
echo ========================================
echo 部署阿里云短信服务
echo ========================================
echo.

echo [1/4] 上传JAR包到服务器...
scp backend/target/easy-joy-life-system-1.0.0.jar root@xx.aieo.cn:/opt/easy-joy-life/backend/target/
if %errorlevel% neq 0 (
    echo ❌ 上传失败！
    pause
    exit /b 1
)
echo ✅ 上传成功
echo.

echo [2/4] 重启后端服务...
ssh root@xx.aieo.cn "systemctl restart easy-joy-life-backend"
if %errorlevel% neq 0 (
    echo ❌ 重启失败！
    pause
    exit /b 1
)
echo ✅ 重启成功
echo.

echo [3/4] 等待服务启动（10秒）...
timeout /t 10 /nobreak >nul
echo ✅ 等待完成
echo.

echo [4/4] 检查服务状态...
ssh root@xx.aieo.cn "systemctl status easy-joy-life-backend --no-pager"
echo.

echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 📱 测试步骤：
echo 1. 打开小程序
echo 2. 进入"添加银行卡"页面
echo 3. 填写手机号并点击"发送验证码"
echo 4. 检查手机是否收到短信
echo.
echo 📊 查看日志：
echo ssh root@xx.aieo.cn "journalctl -u easy-joy-life-backend -f"
echo.
echo 🔍 查看短信日志：
echo ssh root@xx.aieo.cn "journalctl -u easy-joy-life-backend -f | grep -i sms"
echo.

pause
