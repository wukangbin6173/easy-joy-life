@echo off
chcp 65001 >nul
echo ==========================================
echo 易享生活棋牌室 - 部署到服务器
echo ==========================================
echo.

echo 服务器: 121.43.96.127
echo 用户: root
echo.

echo ==========================================
echo 手动部署步骤
echo ==========================================
echo.
echo 请按以下步骤操作：
echo.
echo 1. 使用 PuTTY 连接服务器
echo    Host: 121.43.96.127
echo    Port: 22
echo    Username: root
echo    Password: Easy8286173
echo.
echo 2. 在服务器上执行以下命令：
echo.
echo    cd /opt/easy-joy-life
echo    git pull origin main
echo    cd backend
echo    ./mvnw clean package -DskipTests
echo    cd ../deploy
echo    docker-compose -f docker-compose.prod.yml restart backend
echo    docker-compose -f docker-compose.prod.yml logs -f backend
echo.
echo ==========================================
echo 本次更新内容
echo ==========================================
echo.
echo 1. 添加 RestTemplateConfig 支持 text/plain 响应
echo 2. 修复微信登录 API HttpMessageConverter 错误
echo 3. 优化首页用户信息显示
echo.
echo ==========================================
echo 部署后测试
echo ==========================================
echo.
echo 1. 真机调试小程序
echo 2. 测试登录功能
echo 3. 确认用户信息卡片显示
echo.
echo ==========================================
pause
