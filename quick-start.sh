#!/bin/bash

# 快速启动脚本 - 优化Spring Boot启动速度

echo "🚀 快速启动 EasyJoyLife 服务..."

# JVM优化参数
JVM_OPTS="-Xms256m -Xmx512m"
JVM_OPTS="$JVM_OPTS -XX:+UseG1GC"
JVM_OPTS="$JVM_OPTS -XX:+UseStringDeduplication"
JVM_OPTS="$JVM_OPTS -Djava.security.egd=file:/dev/./urandom"
JVM_OPTS="$JVM_OPTS -Dspring.jmx.enabled=false"
JVM_OPTS="$JVM_OPTS -Dspring.main.lazy-initialization=true"

# Spring Boot优化参数
SPRING_OPTS="--spring.jpa.hibernate.ddl-auto=none"
SPRING_OPTS="$SPRING_OPTS --spring.jpa.show-sql=false"
SPRING_OPTS="$SPRING_OPTS --logging.level.org.hibernate=WARN"
SPRING_OPTS="$SPRING_OPTS --logging.level.org.springframework=WARN"
SPRING_OPTS="$SPRING_OPTS --logging.level.com.alibaba.druid=WARN"

# 检查端口占用
if netstat -tlnp | grep -q ":8080 "; then
    echo "⚠️ 端口8080被占用，正在清理..."
    pkill -f "easy-joy-life-system" || true
    sleep 2
fi

# 启动服务
echo "🔥 启动服务 (优化模式)..."
cd /opt/easy-joy-life/backend

nohup java $JVM_OPTS -jar target/easy-joy-life-system-1.0.0.jar $SPRING_OPTS > /var/log/easyjoylife.log 2>&1 &

# 等待启动
echo "⏳ 等待服务启动..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/stores > /dev/null 2>&1; then
        echo "✅ 服务启动成功! (用时 ${i} 秒)"
        echo "🌐 API地址: https://xx.aieo.cn/api"
        echo "📊 健康检查: curl https://xx.aieo.cn/api/stores"
        exit 0
    fi
    echo -n "."
    sleep 1
done

echo "❌ 服务启动超时，请检查日志:"
echo "tail -f /var/log/easyjoylife.log"
exit 1