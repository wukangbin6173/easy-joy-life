#!/bin/bash

# 易享生活 - 启用MySQL远程访问
# 用途: 允许从外部IP连接到MySQL数据库

set -e

echo "=========================================="
echo "启用MySQL远程访问"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 检查MySQL服务状态
echo "1. 检查MySQL服务..."
if systemctl is-active --quiet mysql; then
    echo -e "${GREEN}✓${NC} MySQL服务正在运行"
else
    echo -e "${RED}✗${NC} MySQL服务未运行"
    echo "启动MySQL服务..."
    sudo systemctl start mysql
fi
echo ""

# 2. 检查当前监听地址
echo "2. 检查MySQL监听地址..."
BIND_ADDRESS=$(sudo grep "bind-address" /etc/mysql/mysql.conf.d/mysqld.cnf 2>/dev/null || echo "未找到")
echo "当前配置: $BIND_ADDRESS"
echo ""

# 3. 修改MySQL配置允许远程连接
echo "3. 修改MySQL配置..."
if [ -f /etc/mysql/mysql.conf.d/mysqld.cnf ]; then
    # 备份原配置
    sudo cp /etc/mysql/mysql.conf.d/mysqld.cnf /etc/mysql/mysql.conf.d/mysqld.cnf.backup
    
    # 修改bind-address为0.0.0.0（允许所有IP）
    sudo sed -i 's/^bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
    
    # 如果没有bind-address行，添加它
    if ! grep -q "bind-address" /etc/mysql/mysql.conf.d/mysqld.cnf; then
        sudo sed -i '/\[mysqld\]/a bind-address = 0.0.0.0' /etc/mysql/mysql.conf.d/mysqld.cnf
    fi
    
    echo -e "${GREEN}✓${NC} MySQL配置已更新"
else
    echo -e "${YELLOW}!${NC} 配置文件路径可能不同，请手动检查"
fi
echo ""

# 4. 重启MySQL服务
echo "4. 重启MySQL服务..."
sudo systemctl restart mysql
sleep 3

if systemctl is-active --quiet mysql; then
    echo -e "${GREEN}✓${NC} MySQL服务重启成功"
else
    echo -e "${RED}✗${NC} MySQL服务重启失败"
    exit 1
fi
echo ""

# 5. 配置MySQL用户权限
echo "5. 配置MySQL用户权限..."
echo "请输入MySQL root密码（生产环境: EasyJoyLife2024!@#）"

# 创建SQL命令
SQL_COMMANDS="
-- 允许root用户从任何IP连接
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'EasyJoyLife2024!@#';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- 更新现有root用户
UPDATE mysql.user SET host='%' WHERE user='root' AND host='localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 显示用户列表
SELECT user, host FROM mysql.user WHERE user='root';
"

# 执行SQL命令
echo "$SQL_COMMANDS" | sudo mysql -u root -p

echo ""

# 6. 配置防火墙
echo "6. 配置防火墙..."
if command -v ufw &> /dev/null; then
    echo "检测到UFW防火墙"
    sudo ufw allow 3306/tcp
    echo -e "${GREEN}✓${NC} 已允许3306端口"
elif command -v firewall-cmd &> /dev/null; then
    echo "检测到firewalld防火墙"
    sudo firewall-cmd --permanent --add-port=3306/tcp
    sudo firewall-cmd --reload
    echo -e "${GREEN}✓${NC} 已允许3306端口"
else
    echo -e "${YELLOW}!${NC} 未检测到防火墙，跳过"
fi
echo ""

# 7. 验证配置
echo "7. 验证配置..."
echo ""
echo "MySQL监听端口:"
sudo netstat -tuln | grep 3306 || echo "未找到监听端口"
echo ""
echo "MySQL用户权限:"
sudo mysql -u root -p -e "SELECT user, host FROM mysql.user WHERE user='root';"
echo ""

# 8. 显示连接信息
echo "=========================================="
echo -e "${GREEN}配置完成！${NC}"
echo "=========================================="
echo ""
echo "MySQL远程连接信息:"
echo "  Host:     47.97.179.50"
echo "  Port:     3306"
echo "  Username: root"
echo "  Password: EasyJoyLife2024!@#"
echo "  Database: easy_joy_life_db"
echo ""
echo "⚠️  重要提示:"
echo "1. 如果使用阿里云，需要在安全组中开放3306端口"
echo "2. 建议只允许特定IP访问，而不是所有IP"
echo "3. 定期更换数据库密码"
echo ""
echo "测试连接命令:"
echo "  mysql -h 47.97.179.50 -P 3306 -u root -p"
echo ""
