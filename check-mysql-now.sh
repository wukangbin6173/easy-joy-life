#!/bin/bash

# MySQL快速检查脚本
echo "=========================================="
echo "MySQL服务状态检查"
echo "=========================================="
echo ""

# 检查Docker容器
echo "1. 检查MySQL容器..."
if docker ps | grep -q "easy-joy-life-mysql-prod"; then
    echo "   ✓ MySQL容器正在运行"
    echo ""
    
    # 显示容器信息
    echo "2. 容器详细信息:"
    docker ps --filter "name=easy-joy-life-mysql-prod" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    
    # 测试MySQL连接
    echo "3. 测试MySQL连接..."
    if docker exec easy-joy-life-mysql-prod mysqladmin ping -h localhost 2>/dev/null | grep -q "alive"; then
        echo "   ✓ MySQL数据库连接正常"
    else
        echo "   ✗ MySQL数据库连接失败"
    fi
    echo ""
    
    # 检查数据库
    echo "4. 检查数据库..."
    if docker exec easy-joy-life-mysql-prod mysql -e "SHOW DATABASES LIKE 'easy_joy_life_db';" 2>/dev/null | grep -q "easy_joy_life_db"; then
        echo "   ✓ 数据库 easy_joy_life_db 存在"
    else
        echo "   ✗ 数据库 easy_joy_life_db 不存在"
    fi
    echo ""
    
    # 显示版本
    echo "5. MySQL版本:"
    docker exec easy-joy-life-mysql-prod mysql --version 2>/dev/null
    echo ""
    
    echo "=========================================="
    echo "结论: MySQL服务运行正常 ✓"
    echo "=========================================="
    
elif docker ps -a | grep -q "easy-joy-life-mysql-prod"; then
    echo "   ✗ MySQL容器存在但未运行"
    echo ""
    echo "容器状态:"
    docker ps -a --filter "name=easy-joy-life-mysql-prod" --format "table {{.Names}}\t{{.Status}}"
    echo ""
    echo "查看日志:"
    echo "  docker logs easy-joy-life-mysql-prod"
    echo ""
    echo "启动容器:"
    echo "  cd /opt/easy-joy-life/deploy"
    echo "  docker-compose -f docker-compose.prod.yml up -d mysql"
    echo ""
    echo "=========================================="
    echo "结论: MySQL服务未运行 ✗"
    echo "=========================================="
    
else
    echo "   ✗ MySQL容器不存在"
    echo ""
    echo "创建并启动容器:"
    echo "  cd /opt/easy-joy-life/deploy"
    echo "  docker-compose -f docker-compose.prod.yml up -d mysql"
    echo ""
    echo "=========================================="
    echo "结论: MySQL容器不存在 ✗"
    echo "=========================================="
fi
