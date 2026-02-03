#!/bin/bash

# 服务器部署脚本 - 部署微信JSAPI支付修复版本
echo "🚀 开始部署易享生活后端服务到服务器..."

# 配置变量
SERVER_HOST="xx.aieo.cn"
SERVER_USER="root"
SERVER_PORT="22"
JAR_FILE="backend/target/easy-joy-life-system-1.0.0.jar"
REMOTE_DIR="/opt/easyjoylife"
SERVICE_NAME="easyjoylife"

# 检查JAR文件是否存在
if [ ! -f "$JAR_FILE" ]; then
    echo "❌ JAR文件不存在: $JAR_FILE"
    echo "请先运行编译命令: cd backend && ./mvnw.cmd package -DskipTests"
    exit 1
fi

echo "✅ 找到JAR文件: $JAR_FILE"
echo "📊 文件大小: $(du -h $JAR_FILE | cut -f1)"

# 检查服务器连接
echo "🔍 检查服务器连接..."
if ! ssh -o ConnectTimeout=10 -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "echo '服务器连接成功'" 2>/dev/null; then
    echo "❌ 无法连接到服务器 $SERVER_HOST"
    echo "请检查:"
    echo "1. 服务器地址是否正确"
    echo "2. SSH密钥是否配置"
    echo "3. 网络连接是否正常"
    exit 1
fi

echo "✅ 服务器连接正常"

# 创建远程目录
echo "📁 创建远程目录..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "mkdir -p $REMOTE_DIR/backup $REMOTE_DIR/logs"

# 备份现有JAR文件
echo "💾 备份现有服务..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
    if [ -f $REMOTE_DIR/easy-joy-life-system-1.0.0.jar ]; then
        cp $REMOTE_DIR/easy-joy-life-system-1.0.0.jar $REMOTE_DIR/backup/easy-joy-life-system-1.0.0.jar.backup.$(date +%Y%m%d_%H%M%S)
        echo '✅ 已备份现有JAR文件'
    else
        echo '📝 没有找到现有JAR文件，跳过备份'
    fi
"

# 停止现有服务
echo "🛑 停止现有服务..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
    # 查找并停止Java进程
    JAVA_PID=\$(ps aux | grep 'easy-joy-life-system' | grep -v grep | awk '{print \$2}')
    if [ ! -z \"\$JAVA_PID\" ]; then
        echo '停止进程 PID: '\$JAVA_PID
        kill -15 \$JAVA_PID
        sleep 5
        
        # 如果进程仍在运行，强制杀死
        if kill -0 \$JAVA_PID 2>/dev/null; then
            echo '强制停止进程'
            kill -9 \$JAVA_PID
        fi
        echo '✅ 服务已停止'
    else
        echo '📝 没有找到运行中的服务'
    fi
"

# 上传新的JAR文件
echo "📤 上传新的JAR文件..."
if scp -P $SERVER_PORT "$JAR_FILE" $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/; then
    echo "✅ JAR文件上传成功"
else
    echo "❌ JAR文件上传失败"
    exit 1
fi

# 上传配置文件（如果需要）
echo "📤 上传配置文件..."
if [ -f "backend/src/main/resources/application-prod.yml" ]; then
    scp -P $SERVER_PORT "backend/src/main/resources/application-prod.yml" $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/
    echo "✅ 生产环境配置文件上传成功"
fi

# 启动新服务
echo "🚀 启动新服务..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
    cd $REMOTE_DIR
    
    # 设置Java环境变量（如果需要）
    export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
    export PATH=\$JAVA_HOME/bin:\$PATH
    
    # 启动服务
    nohup java -jar \
        -Xms512m -Xmx1024m \
        -Dspring.profiles.active=prod \
        -Dserver.port=8081 \
        easy-joy-life-system-1.0.0.jar \
        > logs/app.log 2>&1 &
    
    echo '✅ 服务启动命令已执行'
    echo '📋 进程ID: '\$!
"

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 15

# 检查服务状态
echo "🔍 检查服务状态..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
    # 检查进程是否运行
    JAVA_PID=\$(ps aux | grep 'easy-joy-life-system' | grep -v grep | awk '{print \$2}')
    if [ ! -z \"\$JAVA_PID\" ]; then
        echo '✅ 服务进程运行中，PID: '\$JAVA_PID
    else
        echo '❌ 服务进程未找到'
        echo '📋 查看启动日志:'
        tail -n 20 $REMOTE_DIR/logs/app.log
        exit 1
    fi
    
    # 检查端口是否监听
    if netstat -tlnp | grep ':8081' > /dev/null; then
        echo '✅ 端口8081正在监听'
    else
        echo '⚠️ 端口8081未监听，服务可能还在启动中'
    fi
"

# 测试API接口
echo "🧪 测试API接口..."
sleep 5

# 测试健康检查接口
if curl -s --connect-timeout 10 "http://$SERVER_HOST:8081/actuator/health" > /dev/null; then
    echo "✅ 健康检查接口正常"
else
    echo "⚠️ 健康检查接口暂时无法访问，可能还在启动中"
fi

# 显示部署信息
echo ""
echo "🎉 部署完成！"
echo ""
echo "📋 部署信息:"
echo "- 服务器: $SERVER_HOST"
echo "- 端口: 8081"
echo "- JAR文件: easy-joy-life-system-1.0.0.jar"
echo "- 部署目录: $REMOTE_DIR"
echo "- 日志文件: $REMOTE_DIR/logs/app.log"
echo ""
echo "🔧 常用命令:"
echo "# 查看服务状态"
echo "ssh $SERVER_USER@$SERVER_HOST 'ps aux | grep easy-joy-life-system'"
echo ""
echo "# 查看实时日志"
echo "ssh $SERVER_USER@$SERVER_HOST 'tail -f $REMOTE_DIR/logs/app.log'"
echo ""
echo "# 重启服务"
echo "ssh $SERVER_USER@$SERVER_HOST 'pkill -f easy-joy-life-system && cd $REMOTE_DIR && nohup java -jar -Dspring.profiles.active=prod easy-joy-life-system-1.0.0.jar > logs/app.log 2>&1 &'"
echo ""
echo "🧪 测试命令:"
echo "node test-wechat-jsapi-fix.js"
echo ""
echo "📝 修复内容:"
echo "- 修复微信JSAPI支付total_fee参数错误"
echo "- 更新微信支付SDK到0.2.17版本"
echo "- 增强参数验证和错误处理"
echo "- 添加详细的日志输出"