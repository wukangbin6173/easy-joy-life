#!/bin/bash

# 易享生活棋牌室小程序 - 仅部署Spring Boot后端
# MySQL和Redis使用系统服务

set -e

echo "=========================================="
echo "易享生活 - 部署Spring Boot后端应用"
echo "=========================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "docker-compose.backend-only.yml" ]; then
    echo "错误: 请在 deploy 目录下运行此脚本"
    exit 1
fi

# 1. 检查MySQL服务
echo "1. 检查MySQL服务..."
if systemctl is-active --quiet mysql; then
    echo "   ✓ MySQL服务运行中"
else
    echo "   ✗ MySQL服务未运行"
    echo "   启动MySQL: systemctl start mysql"
    exit 1
fi

# 2. 检查Redis服务
echo "2. 检查Redis服务..."
if systemctl is-active --quiet redis-server; then
    echo "   ✓ Redis服务运行中"
else
    echo "   ✗ Redis服务未运行"
    echo "   启动Redis: systemctl start redis-server"
    exit 1
fi

# 3. 检查数据库是否存在
echo "3. 检查数据库..."
if sudo mysql -e "USE easy_joy_life_db;" 2>/dev/null; then
    echo "   ✓ 数据库 easy_joy_life_db 存在"
else
    echo "   ⚠ 数据库不存在，正在创建..."
    sudo mysql -e "CREATE DATABASE IF NOT EXISTS easy_joy_life_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo "   ✓ 数据库创建成功"
    
    # 导入数据库结构
    if [ -f "../backend/src/main/resources/mysql-init.sql" ]; then
        echo "   正在导入数据库结构..."
        sudo mysql easy_joy_life_db < ../backend/src/main/resources/mysql-init.sql
        echo "   ✓ 数据库结构导入成功"
    fi
fi

# 4. 检查环境变量文件
echo "4. 检查环境变量..."
if [ ! -f ".env" ]; then
    if [ -f ".env.production" ]; then
        echo "   复制 .env.production 到 .env"
        cp .env.production .env
    else
        echo "   ⚠ 警告: .env 文件不存在，使用默认配置"
    fi
fi

# 5. 构建Spring Boot应用
echo "5. 构建Spring Boot应用..."
cd ../backend
if [ -f "mvnw" ]; then
    chmod +x mvnw
    ./mvnw clean package -DskipTests -Pprod
else
    mvn clean package -DskipTests -Pprod
fi

if [ ! -f "target/easy-joy-life-system-1.0.0.jar" ]; then
    echo "   ✗ JAR文件构建失败"
    exit 1
fi
echo "   ✓ JAR文件构建成功"

# 6. 停止旧容器（如果存在）
echo "6. 停止旧容器..."
cd ../deploy
if docker ps -a | grep -q "easy-joy-life-backend-prod"; then
    docker stop easy-joy-life-backend-prod 2>/dev/null || true
    docker rm easy-joy-life-backend-prod 2>/dev/null || true
    echo "   ✓ 旧容器已停止并删除"
else
    echo "   - 没有旧容器需要停止"
fi

# 7. 构建并启动新容器
echo "7. 启动Spring Boot容器..."
docker-compose -f docker-compose.backend-only.yml up -d --build

# 8. 等待服务启动
echo "8. 等待服务启动..."
sleep 10

# 9. 检查容器状态
echo "9. 检查容器状态..."
if docker ps | grep -q "easy-joy-life-backend-prod"; then
    echo "   ✓ 容器运行中"
    
    # 显示容器信息
    docker ps --filter "name=easy-joy-life-backend-prod" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo "   ✗ 容器启动失败"
    echo ""
    echo "查看日志:"
    docker logs easy-joy-life-backend-prod
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
            docker logs --tail 50 easy-joy-life-backend-prod
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
echo "  - Spring Boot: ✓ Docker容器 (端口 8080)"
echo "  - Nginx:       ✓ 系统服务 (端口 80/443)"
echo ""
echo "访问地址:"
echo "  - 本地API: http://localhost:8080/api/stores"
echo "  - 线上API: https://xx.aieo.cn/api/stores"
echo ""
echo "常用命令:"
echo "  - 查看日志: docker logs -f easy-joy-life-backend-prod"
echo "  - 重启服务: docker-compose -f docker-compose.backend-only.yml restart"
echo "  - 停止服务: docker-compose -f docker-compose.backend-only.yml stop"
echo ""
