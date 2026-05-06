#!/bin/bash

# 易享生活 - 仅更新Spring Boot后端应用
# 不重启MySQL、Redis、Nginx等服务

set -e

echo "=========================================="
echo "易享生活 - 快速更新后端应用"
echo "=========================================="
echo ""

# 1. 构建Spring Boot应用
echo "1. 构建Spring Boot应用..."
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
echo ""

# 2. 重启Spring Boot服务
echo "2. 重启Spring Boot服务..."
systemctl restart easy-joy-life-backend
echo "   ✓ 服务已重启"
echo ""

# 3. 等待服务启动
echo "3. 等待服务启动..."
sleep 10

# 4. 检查服务状态
echo "4. 检查服务状态..."
if systemctl is-active --quiet easy-joy-life-backend; then
    echo "   ✓ 服务运行中"
else
    echo "   ✗ 服务启动失败"
    echo ""
    echo "查看日志:"
    journalctl -u easy-joy-life-backend -n 50 --no-pager
    exit 1
fi
echo ""

# 5. 健康检查
echo "5. 健康检查..."
for i in {1..30}; do
    if curl -f -s http://localhost:8080/api/health > /dev/null 2>&1; then
        echo "   ✓ 健康检查通过"
        break
    else
        if [ $i -eq 30 ]; then
            echo "   ✗ 健康检查失败"
            echo ""
            echo "查看日志:"
            journalctl -u easy-joy-life-backend -n 50 --no-pager
            exit 1
        fi
        echo "   等待服务启动... ($i/30)"
        sleep 2
    fi
done
echo ""

# 6. 测试API
echo "6. 测试API..."
if curl -f -s http://localhost:8080/api/stores > /dev/null 2>&1; then
    echo "   ✓ API访问正常"
else
    echo "   ⚠ API访问失败"
fi

if curl -f -s https://www.quexitai.com/api/stores > /dev/null 2>&1; then
    echo "   ✓ 线上API访问正常"
else
    echo "   ⚠ 线上API访问失败"
fi
echo ""

echo "=========================================="
echo "✓ 后端应用更新完成！"
echo "=========================================="
echo ""
echo "更新内容:"
echo "  - Spring Boot: ✓ 已重启"
echo ""
echo "未变更服务:"
echo "  - MySQL:  保持运行"
echo "  - Redis:  保持运行"
echo "  - Nginx:  保持运行"
echo ""
echo "查看日志: journalctl -u easy-joy-life-backend -f"
echo ""
