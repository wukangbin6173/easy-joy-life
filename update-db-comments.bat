@echo off
chcp 65001 >nul
echo ============================================
echo 数据库注释更新工具
echo ============================================
echo.

cd backend

echo 正在执行数据库注释更新...
echo.

call mvnw.cmd spring-boot:run -Dspring-boot.run.arguments="--update-comments" -q

echo.
echo ============================================
echo 更新完成！
echo ============================================
pause
