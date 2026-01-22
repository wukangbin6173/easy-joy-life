#!/bin/bash

# 易享生活棋牌室小程序 - 服务器环境搭建脚本
# 适用于 Ubuntu 20.04 LTS

echo "=========================================="
echo "易享生活棋牌室小程序 - 服务器环境搭建"
echo "=========================================="

# 更新系统
echo "1. 更新系统包..."
sudo apt update && sudo apt upgrade -y

# 安装基础工具
echo "2. 安装基础工具..."
sudo apt install -y curl wget git vim unzip

# 安装 Java 11
echo "3. 安装 Java 11..."
sudo apt install -y openjdk-11-jdk
java -version

# 安装 MySQL 8.0
echo "4. 安装 MySQL 8.0..."
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# 配置 MySQL
echo "5. 配置 MySQL..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_mysql_password';"
sudo mysql -u root -pyour_mysql_password -e "CREATE DATABASE IF NOT EXISTS easy_joy_life_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -u root -pyour_mysql_password -e "FLUSH PRIVILEGES;"

# 安装 Nginx
echo "6. 安装 Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 安装 Docker (可选，用于容器化部署)
echo "7. 安装 Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
echo "8. 安装 Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 创建应用目录
echo "9. 创建应用目录..."
sudo mkdir -p /opt/easy-joy-life
sudo chown $USER:$USER /opt/easy-joy-life

# 配置防火墙
echo "10. 配置防火墙..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8080
sudo ufw --force enable

echo "=========================================="
echo "服务器环境搭建完成！"
echo "请记住以下信息："
echo "- MySQL root密码: your_mysql_password"
echo "- 应用目录: /opt/easy-joy-life"
echo "- 下一步: 上传应用代码并配置"
echo "=========================================="