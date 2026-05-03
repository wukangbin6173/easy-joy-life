#!/bin/bash

# 易享生活 - 快速启用MySQL远程访问（无交互版本）

set -e

echo "=========================================="
echo "快速启用MySQL远程访问"
echo "=========================================="
echo ""

# 数据库密码
DB_PASSWORD="EasyJoyLife2024!@#"

# 1. 修改MySQL配置
echo "1. 修改MySQL配置允许远程连接..."
if [ -f /etc/mysql/mysql.conf.d/mysqld.cnf ]; then
    sudo cp /etc/mysql/mysql.conf.d/mysqld.cnf /etc/mysql/mysql.conf.d/mysqld.cnf.backup.$(date +%Y%m%d_%H%M%S)
    sudo sed -i 's/^bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
    
    if ! grep -q "bind-address" /etc/mysql/mysql.conf.d/mysqld.cnf; then
        echo "bind-address = 0.0.0.0" | sudo tee -a /etc/mysql/mysql.conf.d/mysqld.cnf
    fi
    echo "✓ 配置已更新"
fi
echo ""

# 2. 重启MySQL
echo "2. 重启MySQL服务..."
sudo systemctl restart mysql
sleep 3
echo "✓ MySQL已重启"
echo ""

# 3. 配置用户权限
echo "3. 配置用户权限..."
sudo mysql -u root -p"$DB_PASSWORD" <<EOF
-- 创建或更新root用户允许远程访问
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SELECT user, host FROM mysql.user WHERE user='root';
EOF
echo "✓ 权限已配置"
echo ""

# 4. 配置防火墙
echo "4. 配置防火墙..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 3306/tcp
    echo "✓ UFW已允许3306端口"
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-port=3306/tcp
    sudo firewall-cmd --reload
    echo "✓ firewalld已允许3306端口"
fi
echo ""

# 5. 验证
echo "5. 验证配置..."
echo "MySQL监听端口:"
sudo netstat -tuln | grep 3306
echo ""

echo "=========================================="
echo "✓ 配置完成！"
echo "=========================================="
echo ""
echo "连接信息:"
echo "  Host:     47.97.179.50"
echo "  Port:     3306"
echo "  Username: root"
echo "  Password: $DB_PASSWORD"
echo "  Database: easy_joy_life_db"
echo ""
echo "⚠️  别忘了在阿里云安全组中开放3306端口！"
echo ""
