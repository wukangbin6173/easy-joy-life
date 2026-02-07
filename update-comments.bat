@echo off
chcp 65001 >nul
echo ============================================================================
echo 数据库注释规范化工具
echo 基于 ZERO 开发规范
echo ============================================================================
echo.
echo 本脚本将更新数据库表和字段的注释，使其符合 ZERO 规范
echo 注意：只修改注释，不改变表名和字段名
echo.
echo 请确认以下信息：
echo - 数据库地址: 121.43.96.127:3306
echo - 数据库名称: easy_joy_life_db
echo - 用户名: root
echo.
set /p confirm="确认执行？(Y/N): "
if /i not "%confirm%"=="Y" (
    echo 操作已取消
    pause
    exit /b
)

echo.
echo 正在执行注释更新...
echo.

mysql -h 121.43.96.127 -P 3306 -u root -p -D easy_joy_life_db < update-database-comments.sql

echo.
echo ============================================================================
echo 执行完成！
echo.
echo 请在数据库客户端中查看更新后的表结构
echo ============================================================================
pause
