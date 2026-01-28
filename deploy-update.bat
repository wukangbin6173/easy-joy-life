@echo off
chcp 65001 >nul
echo ==========================================
echo 易享生活棋牌室 - 更新部署
echo ==========================================
echo.

echo 正在连接服务器并更新代码...
echo.

ssh root@121.43.96.127 "cd /opt/easy-joy-life && git pull origin main && cd backend && ./mvnw clean package -DskipTests -Pprod && cd ../deploy && docker-compose -f docker-compose.prod.yml restart backend"

echo.
echo ==========================================
echo 部署完成！
echo.
echo 访问地址:
echo - 网站: https://xx.aieo.cn
echo - API: https://xx.aieo.cn/api/stores
echo ==========================================
echo.
pause
