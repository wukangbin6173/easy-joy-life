#!/bin/bash

# 易享生活棋牌室小程序 - 完整服务状态检查脚本
# 用途: 检查所有服务进程是否正常运行，以及Spring Boot应用是否为最新版本

echo "=========================================="
echo "易享生活棋牌室小程序 - 服务状态检查"
echo "检查时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查结果统计
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# 检查函数
check_service() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC} - $2"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} - $2"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# ==========================================
# 1. 检查 Nginx 服务
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  检查 Nginx 服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查Nginx进程
if systemctl is-active --quiet nginx; then
    check_service 0 "Nginx 服务运行中"
    
    # 检查Nginx配置
    if nginx -t 2>&1 | grep -q "successful"; then
        check_service 0 "Nginx 配置文件正确"
    else
        check_service 1 "Nginx 配置文件有错误"
        nginx -t
    fi
    
    # 检查监听端口
    if netstat -tuln | grep -q ":80 "; then
        check_service 0 "Nginx 监听 80 端口"
    else
        check_service 1 "Nginx 未监听 80 端口"
    fi
    
    if netstat -tuln | grep -q ":443 "; then
        check_service 0 "Nginx 监听 443 端口"
    else
        check_service 1 "Nginx 未监听 443 端口"
    fi
    
    # 显示Nginx版本
    NGINX_VERSION=$(nginx -v 2>&1 | cut -d'/' -f2)
    echo "   版本: nginx/$NGINX_VERSION"
    
else
    check_service 1 "Nginx 服务未运行"
    echo -e "${YELLOW}   提示: 运行 'systemctl start nginx' 启动服务${NC}"
fi

echo ""

# ==========================================
# 2. 检查 MySQL 服务
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  检查 MySQL 服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查MySQL容器
if docker ps | grep -q "easy-joy-life-mysql-prod"; then
    check_service 0 "MySQL 容器运行中"
    
    # 检查容器状态
    MYSQL_STATUS=$(docker inspect -f '{{.State.Status}}' easy-joy-life-mysql-prod 2>/dev/null)
    if [ "$MYSQL_STATUS" = "running" ]; then
        check_service 0 "MySQL 容器状态: running"
    else
        check_service 1 "MySQL 容器状态异常: $MYSQL_STATUS"
    fi
    
    # 检查端口
    if netstat -tuln | grep -q ":3306 "; then
        check_service 0 "MySQL 监听 3306 端口"
    else
        check_service 1 "MySQL 未监听 3306 端口"
    fi
    
    # 检查数据库连接
    if docker exec easy-joy-life-mysql-prod mysqladmin ping -h localhost 2>/dev/null | grep -q "alive"; then
        check_service 0 "MySQL 数据库连接正常"
    else
        check_service 1 "MySQL 数据库连接失败"
    fi
    
    # 显示MySQL版本和数据库
    MYSQL_VERSION=$(docker exec easy-joy-life-mysql-prod mysql --version 2>/dev/null | grep -oP 'Ver \K[0-9.]+')
    echo "   版本: MySQL $MYSQL_VERSION"
    
    # 检查数据库是否存在
    if docker exec easy-joy-life-mysql-prod mysql -e "SHOW DATABASES LIKE 'easy_joy_life_db';" 2>/dev/null | grep -q "easy_joy_life_db"; then
        check_service 0 "数据库 easy_joy_life_db 存在"
        
        # 统计表数量
        TABLE_COUNT=$(docker exec easy-joy-life-mysql-prod mysql -D easy_joy_life_db -e "SHOW TABLES;" 2>/dev/null | wc -l)
        TABLE_COUNT=$((TABLE_COUNT - 1))
        echo "   数据表数量: $TABLE_COUNT 个"
    else
        check_service 1 "数据库 easy_joy_life_db 不存在"
    fi
    
else
    check_service 1 "MySQL 容器未运行"
    echo -e "${YELLOW}   提示: 运行 'docker-compose -f docker-compose.prod.yml up -d mysql' 启动容器${NC}"
fi

echo ""

# ==========================================
# 3. 检查 Redis 服务
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  检查 Redis 服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查Redis容器
if docker ps | grep -q "easy-joy-life-redis-prod"; then
    check_service 0 "Redis 容器运行中"
    
    # 检查容器状态
    REDIS_STATUS=$(docker inspect -f '{{.State.Status}}' easy-joy-life-redis-prod 2>/dev/null)
    if [ "$REDIS_STATUS" = "running" ]; then
        check_service 0 "Redis 容器状态: running"
    else
        check_service 1 "Redis 容器状态异常: $REDIS_STATUS"
    fi
    
    # 检查端口
    if netstat -tuln | grep -q ":6379 "; then
        check_service 0 "Redis 监听 6379 端口"
    else
        check_service 1 "Redis 未监听 6379 端口"
    fi
    
    # 检查Redis连接
    if docker exec easy-joy-life-redis-prod redis-cli ping 2>/dev/null | grep -q "PONG"; then
        check_service 0 "Redis 连接正常"
    else
        check_service 1 "Redis 连接失败"
    fi
    
    # 显示Redis版本和信息
    REDIS_VERSION=$(docker exec easy-joy-life-redis-prod redis-cli INFO SERVER 2>/dev/null | grep "redis_version" | cut -d':' -f2 | tr -d '\r')
    echo "   版本: Redis $REDIS_VERSION"
    
    # 显示缓存键数量
    REDIS_KEYS=$(docker exec easy-joy-life-redis-prod redis-cli DBSIZE 2>/dev/null | grep -oP '\d+')
    echo "   缓存键数量: $REDIS_KEYS 个"
    
else
    check_service 1 "Redis 容器未运行"
    echo -e "${YELLOW}   提示: 运行 'docker-compose -f docker-compose.prod.yml up -d redis' 启动容器${NC}"
fi

echo ""

# ==========================================
# 4. 检查 Spring Boot 服务
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  检查 Spring Boot 服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查Spring Boot容器
if docker ps | grep -q "easy-joy-life-backend-prod"; then
    check_service 0 "Spring Boot 容器运行中"
    
    # 检查容器状态
    BACKEND_STATUS=$(docker inspect -f '{{.State.Status}}' easy-joy-life-backend-prod 2>/dev/null)
    if [ "$BACKEND_STATUS" = "running" ]; then
        check_service 0 "Spring Boot 容器状态: running"
    else
        check_service 1 "Spring Boot 容器状态异常: $BACKEND_STATUS"
    fi
    
    # 检查端口
    if netstat -tuln | grep -q ":8080 "; then
        check_service 0 "Spring Boot 监听 8080 端口"
    else
        check_service 1 "Spring Boot 未监听 8080 端口"
    fi
    
    # 检查健康端点
    if curl -f -s http://localhost:8080/api/health > /dev/null 2>&1; then
        check_service 0 "Spring Boot 健康检查通过"
    else
        check_service 1 "Spring Boot 健康检查失败"
    fi
    
    # 检查容器启动时间
    CONTAINER_STARTED=$(docker inspect -f '{{.State.StartedAt}}' easy-joy-life-backend-prod 2>/dev/null | cut -d'.' -f1)
    echo "   容器启动时间: $CONTAINER_STARTED"
    
    # 检查容器重启次数
    RESTART_COUNT=$(docker inspect -f '{{.RestartCount}}' easy-joy-life-backend-prod 2>/dev/null)
    if [ "$RESTART_COUNT" -eq 0 ]; then
        check_service 0 "容器重启次数: $RESTART_COUNT (正常)"
    else
        check_service 1 "容器重启次数: $RESTART_COUNT (异常)"
    fi
    
    # 检查镜像构建时间
    IMAGE_ID=$(docker inspect -f '{{.Image}}' easy-joy-life-backend-prod 2>/dev/null)
    IMAGE_CREATED=$(docker inspect -f '{{.Created}}' $IMAGE_ID 2>/dev/null | cut -d'.' -f1)
    echo "   镜像构建时间: $IMAGE_CREATED"
    
    # 检查代码最后更新时间
    if [ -d "../backend" ]; then
        LAST_COMMIT=$(cd ../backend && git log -1 --format="%ci %s" 2>/dev/null)
        if [ -n "$LAST_COMMIT" ]; then
            echo "   代码最后提交: $LAST_COMMIT"
        fi
    fi
    
else
    check_service 1 "Spring Boot 容器未运行"
    echo -e "${YELLOW}   提示: 运行 'docker-compose -f docker-compose.prod.yml up -d backend' 启动容器${NC}"
fi

echo ""

# ==========================================
# 5. 检查应用是否为最新版本
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  检查应用版本状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "../backend" ]; then
    cd ../backend
    
    # 检查Git状态
    if git rev-parse --git-dir > /dev/null 2>&1; then
        # 获取远程最新提交
        git fetch origin main 2>/dev/null
        
        LOCAL_COMMIT=$(git rev-parse HEAD 2>/dev/null)
        REMOTE_COMMIT=$(git rev-parse origin/main 2>/dev/null)
        
        if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
            check_service 0 "代码版本: 已是最新版本"
            echo "   本地提交: ${LOCAL_COMMIT:0:8}"
        else
            check_service 1 "代码版本: 有新版本可更新"
            echo "   本地提交: ${LOCAL_COMMIT:0:8}"
            echo "   远程提交: ${REMOTE_COMMIT:0:8}"
            echo -e "${YELLOW}   提示: 运行 'git pull origin main' 更新代码${NC}"
        fi
        
        # 检查是否有未提交的更改
        if git diff-index --quiet HEAD -- 2>/dev/null; then
            check_service 0 "工作区状态: 干净"
        else
            check_service 1 "工作区状态: 有未提交的更改"
            echo -e "${YELLOW}   提示: 运行 'git status' 查看详情${NC}"
        fi
    else
        echo "   ⚠️  不是Git仓库，无法检查版本"
    fi
    
    # 检查JAR文件是否存在
    if [ -f "target/easy-joy-life-system-1.0.0.jar" ]; then
        JAR_SIZE=$(du -h target/easy-joy-life-system-1.0.0.jar | cut -f1)
        JAR_DATE=$(stat -c %y target/easy-joy-life-system-1.0.0.jar 2>/dev/null | cut -d'.' -f1)
        check_service 0 "JAR文件存在"
        echo "   文件大小: $JAR_SIZE"
        echo "   构建时间: $JAR_DATE"
        
        # 比较JAR文件时间和容器启动时间
        JAR_TIMESTAMP=$(stat -c %Y target/easy-joy-life-system-1.0.0.jar 2>/dev/null)
        CONTAINER_TIMESTAMP=$(docker inspect -f '{{.State.StartedAt}}' easy-joy-life-backend-prod 2>/dev/null | xargs -I {} date -d {} +%s 2>/dev/null)
        
        if [ -n "$JAR_TIMESTAMP" ] && [ -n "$CONTAINER_TIMESTAMP" ]; then
            if [ $JAR_TIMESTAMP -gt $CONTAINER_TIMESTAMP ]; then
                check_service 1 "应用状态: JAR文件比容器新，需要重新部署"
                echo -e "${YELLOW}   提示: 运行 'docker-compose -f docker-compose.prod.yml up -d --build backend' 重新部署${NC}"
            else
                check_service 0 "应用状态: 容器运行的是最新构建"
            fi
        fi
    else
        check_service 1 "JAR文件不存在"
        echo -e "${YELLOW}   提示: 运行 './mvnw clean package -DskipTests' 构建应用${NC}"
    fi
    
    cd - > /dev/null
else
    echo "   ⚠️  后端目录不存在"
fi

echo ""

# ==========================================
# 6. 检查网络连通性
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  检查网络连通性"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查本地API
if curl -f -s http://localhost:8080/api/stores > /dev/null 2>&1; then
    check_service 0 "本地API访问: http://localhost:8080/api/stores"
else
    check_service 1 "本地API访问失败"
fi

# 检查HTTPS访问
if curl -f -s https://www.quexitai.com/api/stores > /dev/null 2>&1; then
    check_service 0 "HTTPS访问: https://www.quexitai.com/api/stores"
else
    check_service 1 "HTTPS访问失败"
fi

# 检查SSL证书
if [ -f "/etc/letsencrypt/live/www.quexitai.com/fullchain.pem" ]; then
    CERT_EXPIRY=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/www.quexitai.com/fullchain.pem 2>/dev/null | cut -d'=' -f2)
    CERT_EXPIRY_TIMESTAMP=$(date -d "$CERT_EXPIRY" +%s 2>/dev/null)
    CURRENT_TIMESTAMP=$(date +%s)
    DAYS_LEFT=$(( ($CERT_EXPIRY_TIMESTAMP - $CURRENT_TIMESTAMP) / 86400 ))
    
    if [ $DAYS_LEFT -gt 30 ]; then
        check_service 0 "SSL证书有效期: $DAYS_LEFT 天"
    elif [ $DAYS_LEFT -gt 0 ]; then
        check_service 1 "SSL证书即将过期: $DAYS_LEFT 天"
        echo -e "${YELLOW}   提示: 运行 'certbot renew' 续期证书${NC}"
    else
        check_service 1 "SSL证书已过期"
        echo -e "${RED}   紧急: 立即运行 'certbot renew' 续期证书${NC}"
    fi
else
    check_service 1 "SSL证书文件不存在"
fi

echo ""

# ==========================================
# 7. 检查Docker网络
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  检查Docker网络"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker network ls | grep -q "easy-joy-life-network"; then
    check_service 0 "Docker网络存在: easy-joy-life-network"
    
    # 检查网络中的容器
    NETWORK_CONTAINERS=$(docker network inspect easy-joy-life-network -f '{{range .Containers}}{{.Name}} {{end}}' 2>/dev/null)
    echo "   网络中的容器: $NETWORK_CONTAINERS"
else
    check_service 1 "Docker网络不存在"
fi

echo ""

# ==========================================
# 总结报告
# ==========================================
echo "=========================================="
echo "📊 检查结果汇总"
echo "=========================================="
echo "总检查项: $TOTAL_CHECKS"
echo -e "通过: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "失败: ${RED}$FAILED_CHECKS${NC}"
echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✓ 所有服务运行正常！${NC}"
    exit 0
else
    echo -e "${RED}✗ 发现 $FAILED_CHECKS 个问题，请检查上述失败项${NC}"
    echo ""
    echo "常用修复命令:"
    echo "  - 重启所有服务: docker-compose -f docker-compose.prod.yml restart"
    echo "  - 查看日志: docker-compose -f docker-compose.prod.yml logs -f"
    echo "  - 重新构建: docker-compose -f docker-compose.prod.yml up -d --build"
    exit 1
fi
