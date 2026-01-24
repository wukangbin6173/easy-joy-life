#!/bin/bash

# 易享生活棋牌室小程序 - 快速部署脚本
# 服务器: 121.43.96.127
# 域名: xx.aieo.cn

set -e

echo "=========================================="
echo "易享生活棋牌室小程序 - 快速部署"
echo "服务器: 121.43.96.127"
echo "域名: xx.aieo.cn"
echo "=========================================="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "请使用root用户运行此脚本"
    exit 1
fi

# 1. 更新系统
echo "1. 更新系统..."
apt update && apt upgrade -y

# 2. 安装基础工具
echo "2. 安装基础工具..."
apt install -y curl wget git vim unzip htop

# 3. 安装Java 11
echo "3. 安装Java 11..."
apt install -y openjdk-11-jdk
java -version

# 4. 安装MySQL 8.0
echo "4. 安装MySQL 8.0..."
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql

# 5. 配置MySQL
echo "5. 配置MySQL..."
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'EasyJoyLife2024!@#';"
mysql -u root -pEasyJoyLife2024!@# -e "CREATE DATABASE IF NOT EXISTS easy_joy_life_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -pEasyJoyLife2024!@# -e "FLUSH PRIVILEGES;"

# 6. 安装Nginx
echo "6. 安装Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# 7. 安装Docker
echo "7. 安装Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 8. 安装Docker Compose
echo "8. 安装Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 9. 配置防火墙
echo "9. 配置防火墙..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# 10. 克隆项目
echo "10. 克隆项目..."
cd /opt
git clone https://github.com/wukangbin6173/easy-joy-life.git
chown -R root:root easy-joy-life

# 11. 配置SSL证书 (使用专用脚本)
echo "11. 配置SSL证书..."
cd /opt/easy-joy-life/deploy
chmod +x ssl-auto-setup.sh
./ssl-auto-setup.sh install

# 12. 配置环境变量
echo "12. 配置环境变量..."
cd /opt/easy-joy-life/deploy
cp .env.production .env

# 13. 导入数据库
echo "13. 导入数据库..."
mysql -u root -pEasyJoyLife2024!@# easy_joy_life_db < ../backend/src/main/resources/mysql-init.sql

# 14. 构建并启动应用
echo "14. 构建并启动应用..."
cd ../backend
chmod +x mvnw
./mvnw clean package -DskipTests -Pprod

cd ../deploy
docker-compose -f docker-compose.prod.yml up -d

# 15. 配置Nginx (SSL脚本已自动配置)
echo "15. Nginx配置已完成..."

# 16. 等待服务启动
echo "16. 等待服务启动..."
sleep 30

# 17. 健康检查
echo "17. 健康检查..."
for i in {1..10}; do
    if curl -f https://xx.aieo.cn/api/stores > /dev/null 2>&1; then
        echo "✓ 服务启动成功！"
        break
    else
        echo "等待服务启动... ($i/10)"
        sleep 10
    fi
    
    if [ $i -eq 10 ]; then
        echo "❌ 服务启动失败，请检查日志"
        docker-compose -f docker-compose.prod.yml logs backend
        exit 1
    fi
done

echo "=========================================="
echo "部署完成！"
echo ""
echo "🎉 易享生活棋牌室小程序已成功部署"
echo ""
echo "访问地址:"
echo "- 网站: https://xx.aieo.cn"
echo "- API: https://xx.aieo.cn/api/stores"
echo "- 管理后台: https://xx.aieo.cn/admin.html"
echo ""
echo "下一步:"
echo "1. 在微信公众平台配置服务器域名: xx.aieo.cn"
echo "2. 更新小程序代码并上传"
echo "3. 提交审核发布"
echo "=========================================="