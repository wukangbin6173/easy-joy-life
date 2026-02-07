#!/bin/bash

# 快速服务状态检查脚本
# 用途: 快速查看所有服务是否运行

echo "=========================================="
echo "快速服务状态检查"
echo "=========================================="
echo ""

# 1. Nginx
echo "1. Nginx:"
if systemctl is-active --quiet nginx; then
    echo "   ✓ 运行中"
    nginx -v 2>&1 | sed 's/^/   /'
else
    echo "   ✗ 未运行"
fi
echo ""

# 2. MySQL
echo "2. MySQL (Docker):"
if docker ps | grep -q "easy-joy-life-mysql-prod"; then
    echo "   ✓ 运行中"
    docker exec easy-joy-life-mysql-prod mysql --version 2>/dev/null | sed 's/^/   /'
else
    echo "   ✗ 未运行"
fi
echo ""

# 3. Redis
echo "3. Redis (Docker):"
if docker ps | grep -q "easy-joy-life-redis-prod"; then
    echo "   ✓ 运行中"
    REDIS_VERSION=$(docker exec easy-joy-life-redis-prod redis-cli INFO SERVER 2>/dev/null | grep "redis_version" | cut -d':' -f2 | tr -d '\r')
    echo "   Redis version: $REDIS_VERSION"
else
    echo "   ✗ 未运行"
fi
echo ""

# 4. Spring Boot
echo "4. Spring Boot (Docker):"
if docker ps | grep -q "easy-joy-life-backend-prod"; then
    echo "   ✓ 运行中"
    STARTED=$(docker inspect -f '{{.State.StartedAt}}' easy-joy-life-backend-prod 2>/dev/null | cut -d'.' -f1)
    echo "   启动时间: $STARTED"
    
    # 检查健康状态
    if curl -f -s http://localhost:8080/api/health > /dev/null 2>&1; then
        echo "   ✓ 健康检查通过"
    else
        echo "   ✗ 健康检查失败"
    fi
else
    echo "   ✗ 未运行"
fi
echo ""

# 5. API测试
echo "5. API访问测试:"
if curl -f -s https://xx.aieo.cn/api/stores > /dev/null 2>&1; then
    echo "   ✓ https://xx.aieo.cn/api/stores 可访问"
else
    echo "   ✗ API访问失败"
fi
echo ""

# 6. 版本检查
echo "6. 应用版本检查:"
if [ -d "../backend" ]; then
    cd ../backend
    if git rev-parse --git-dir > /dev/null 2>&1; then
        git fetch origin main 2>/dev/null
        LOCAL=$(git rev-parse HEAD 2>/dev/null | cut -c1-8)
        REMOTE=$(git rev-parse origin/main 2>/dev/null | cut -c1-8)
        
        if [ "$LOCAL" = "$REMOTE" ]; then
            echo "   ✓ 代码已是最新版本 (commit: $LOCAL)"
        else
            echo "   ⚠ 有新版本可更新"
            echo "   本地: $LOCAL"
            echo "   远程: $REMOTE"
        fi
        
        # 检查JAR文件
        if [ -f "target/easy-joy-life-system-1.0.0.jar" ]; then
            JAR_DATE=$(stat -c %y target/easy-joy-life-system-1.0.0.jar 2>/dev/null | cut -d'.' -f1)
            echo "   JAR构建时间: $JAR_DATE"
        else
            echo "   ⚠ JAR文件不存在"
        fi
    fi
    cd - > /dev/null
fi

echo ""
echo "=========================================="
echo "检查完成"
echo "=========================================="
