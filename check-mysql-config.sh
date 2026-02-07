#!/bin/bash

echo "=== MySQL 绑定地址配置 ==="
mysql -u root -p'EasyJoyLife2024!@#' -e "SHOW VARIABLES LIKE 'bind_address';"

echo ""
echo "=== MySQL 配置文件中的 bind-address ==="
grep -r 'bind-address' /etc/mysql/ 2>/dev/null || echo "未找到 bind-address 配置"

echo ""
echo "=== MySQL 监听端口 ==="
ss -tlnp | grep 3306

echo ""
echo "=== 最近的连接错误 ==="
tail -n 50 /var/log/mysql/error.log | grep -i "error\|warning\|access denied" || echo "没有发现错误"
