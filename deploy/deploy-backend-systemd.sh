#!/bin/bash

# 易享生活 - 使用systemd部署Spring Boot后端
# MySQL和Redis使用系统服务，Spring Boot也使用系统服务

set -e

echo "=========================================="
echo "易享生活 - 部署Spring Boot后端服务"
echo "=========================================="
echo ""

# 1. 检查MySQL服务
echo "1. 检查MySQL服务..."
if systemctl is-active --quiet mysql; then
    echo "   ✓ MySQL服务运行中"
else
    echo "   ✗ MySQL服务未运行，正在启动..."
    systemctl start mysql
fi

# 2. 检查Redis服务
echo "2. 检查Redis服务..."
if systemctl is-active --quiet redis-server; then
    echo "   ✓ Redis服务运行中"
else
    echo "   ✗ Redis服务未运行，正在启动..."
    systemctl start redis-server
fi

# 3. 检查数据库
echo "3. 检查数据库..."
if mysql --defaults-file=/etc/mysql/debian.cnf -e "USE easy_joy_life_db;" 2>/dev/null; then
    echo "   ✓ 数据库 easy_joy_life_db 存在"
    
    # 统计表数量
    TABLE_COUNT=$(mysql --defaults-file=/etc/mysql/debian.cnf -D easy_joy_life_db -e "SHOW TABLES;" 2>/dev/null | wc -l)
    TABLE_COUNT=$((TABLE_COUNT - 1))
    echo "   数据表数量: $TABLE_COUNT 个"
else
    echo "   ✗ 数据库不存在"
    exit 1
fi

# 4. 构建Spring Boot应用
echo "4. 构建Spring Boot应用..."
cd /opt/easy-joy-life/backend
if [ -f "mvnw" ]; then
    chmod +x mvnw
    ./mvnw clean package -DskipTests
else
    mvn clean package -DskipTests
fi

if [ ! -f "target/easy-joy-life-system-1.0.0.jar" ]; then
    echo "   ✗ JAR文件构建失败"
    exit 1
fi
echo "   ✓ JAR文件构建成功"

# 5. 停止旧服务（如果存在）
echo "5. 停止旧服务..."
if systemctl is-active --quiet easy-joy-life-backend; then
    systemctl stop easy-joy-life-backend
    echo "   ✓ 旧服务已停止"
else
    echo "   - 没有旧服务需要停止"
fi

# 6. 安装systemd服务
echo "6. 安装systemd服务..."
cp /opt/easy-joy-life/deploy/easy-joy-life-backend.service /etc/systemd/system/
systemctl daemon-reload
echo "   ✓ 服务文件已安装"

# 7. 启动服务
echo "7. 启动Spring Boot服务..."
systemctl start easy-joy-life-backend
systemctl enable easy-joy-life-backend
echo "   ✓ 服务已启动并设置为开机自启"

# 8. 等待服务启动
echo "8. 等待服务启动..."
sleep 10

# 9. 检查服务状态
echo "9. 检查服务状态..."
if systemctl is-active --quiet easy-joy-life-backend; then
    echo "   ✓ 服务运行中"
    systemctl status easy-joy-life-backend --no-pager | head -n 10
else
    echo "   ✗ 服务启动失败"
    echo ""
    echo "查看日志:"
    journalctl -u easy-joy-life-backend -n 50 --no-pager
    exit 1
fi

# 10. 健康检查
echo "10. 健康检查..."
for i in {1..30}; do
    if curl -f -s http://localhost:8080/api/health > /dev/null 2>&1; then
        echo "    ✓ 健康检查通过"
        break
    else
        if [ $i -eq 30 ]; then
            echo "    ✗ 健康检查失败"
            echo ""
            echo "查看日志:"
            journalctl -u easy-joy-life-backend -n 50 --no-pager
            exit 1
        fi
        echo "    等待服务启动... ($i/30)"
        sleep 2
    fi
done

# 11. 测试API
echo "11. 测试API..."
if curl -f -s http://localhost:8080/api/stores > /dev/null 2>&1; then
    echo "    ✓ API访问正常"
else
    echo "    ⚠ API访问失败（可能是数据库为空）"
fi

echo ""
echo "=========================================="
echo "部署完成！"
echo "=========================================="
echo ""
echo "服务状态:"
echo "  - MySQL:       ✓ 系统服务 (端口 3306)"
echo "  - Redis:       ✓ 系统服务 (端口 6379)"
echo "  - Spring Boot: ✓ 系统服务 (端口 8080)"
echo "  - Nginx:       ✓ 系统服务 (端口 80/443)"
echo ""
echo "访问地址:"
echo "  - 本地API: http://localhost:8080/api/stores"
echo "  - 线上API: https://www.quexitai.com/api/stores"
echo ""
echo "常用命令:"
echo "  - 查看状态: systemctl status easy-joy-life-backend"
echo "  - 查看日志: journalctl -u easy-joy-life-backend -f"
echo "  - 重启服务: systemctl restart easy-joy-life-backend"
echo "  - 停止服务: systemctl stop easy-joy-life-backend"
echo ""
