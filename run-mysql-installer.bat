@echo off
echo ========================================
echo 启动MySQL安装程序
echo ========================================

echo.
echo MySQL 8.0.44安装包已下载完成并验证通过
echo 文件位置: mysql-download\mysql-installer-community-8.0.44.0.msi
echo.

echo 正在启动MySQL安装程序...
echo 请按照以下配置进行安装:
echo.
echo 📋 安装配置建议:
echo 1. 选择 "Server only" 或 "Developer Default"
echo 2. 配置类型: "Development Computer"  
echo 3. 端口: 3306 (保持默认)
echo 4. Root密码: root
echo 5. 启动MySQL服务: 勾选
echo.

echo 按任意键启动安装程序...
pause >nul

REM 启动MySQL安装程序
start "" "mysql-download\mysql-installer-community-8.0.44.0.msi"

echo.
echo 安装程序已启动，请按照界面提示完成安装
echo 安装完成后，运行 verify-mysql-installation.bat 验证安装
echo.

pause