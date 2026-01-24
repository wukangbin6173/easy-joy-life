@echo off
echo ========================================
echo 域名更换状态检查 - xx.aieo.cn
echo ========================================
echo.

echo 1. 检查当前DNS解析状态...
nslookup xx.aieo.cn
echo.

echo 2. 检查目标服务器连通性...
ping -n 4 121.43.96.127
echo.

echo 3. 检查新域名HTTP访问...
curl -I http://xx.aieo.cn 2>nul
if %errorlevel% neq 0 (
    echo ❌ HTTP访问失败 - DNS可能还未生效
) else (
    echo ✅ HTTP访问正常
)
echo.

echo 4. 检查新域名HTTPS访问...
curl -I https://xx.aieo.cn 2>nul
if %errorlevel% neq 0 (
    echo ❌ HTTPS访问失败 - SSL证书可能还未配置
) else (
    echo ✅ HTTPS访问正常
)
echo.

echo ========================================
echo 状态总结:
echo ========================================
echo 如果DNS解析显示 198.18.0.95，需要修改为 121.43.96.127
echo 如果HTTP访问失败，说明DNS还未生效，请等待
echo 如果HTTPS访问失败，需要在服务器上申请SSL证书
echo.
echo 详细操作步骤请查看: 域名更换完成指南.md
echo ========================================

pause