#!/bin/bash

# 微信支付公钥模式部署脚本 - 强制重启版本
# 解决微信支付平台证书过期问题

set -e

echo "🚀 开始微信支付公钥模式部署..."
echo "📅 部署时间: $(date)"

# 配置变量
SERVER_HOST="xx.aieo.cn"
SERVER_USER="root"
BACKEND_PORT="8081"
FRONTEND_PORT="80"
PROJECT_NAME="easy-joy-life-system"

# 颜色输出函数
print_success() {
    echo -e "\033[32m✅ $1\033[0m"
}

print_error() {
    echo -e "\033[31m❌ $1\033[0m"
}

print_info() {
    echo -e "\033[34mℹ️  $1\033[0m"
}

print_warning() {
    echo -e "\033[33m⚠️  $1\033[0m"
}

# 检查SSH连接
check_ssh_connection() {
    print_info "检查SSH连接..."
    if ssh -o ConnectTimeout=10 -o BatchMode=yes $SERVER_USER@$SERVER_HOST exit 2>/dev/null; then
        print_success "SSH连接正常"
        return 0
    else
        print_error "SSH连接失败，请检查网络和SSH密钥配置"
        return 1
    fi
}

# 强制停止服务
force_stop_services() {
    print_info "强制停止现有服务..."
    
    ssh $SERVER_USER@$SERVER_HOST << 'EOF'
        echo "🔍 查找并停止Java进程..."
        
        # 查找Java进程
        JAVA_PIDS=$(ps aux | grep java | grep -v grep | awk '{print $2}')
        
        if [ ! -z "$JAVA_PIDS" ]; then
            echo "发现Java进程: $JAVA_PIDS"
            echo "强制终止Java进程..."
            echo $JAVA_PIDS | xargs kill -9 2>/dev/null || true
            sleep 2
        else
            echo "未发现Java进程"
        fi
        
        # 检查端口占用并强制释放
        echo "🔍 检查端口占用..."
        
        # 检查8081端口
        PORT_8081_PID=$(lsof -ti:8081 2>/dev/null || true)
        if [ ! -z "$PORT_8081_PID" ]; then
            echo "端口8081被进程 $PORT_8081_PID 占用，强制终止..."
            kill -9 $PORT_8081_PID 2>/dev/null || true
        fi
        
        # 检查80端口
        PORT_80_PID=$(lsof -ti:80 2>/dev/null || true)
        if [ ! -z "$PORT_80_PID" ]; then
            echo "端口80被进程 $PORT_80_PID 占用，强制终止..."
            kill -9 $PORT_80_PID 2>/dev/null || true
        fi
        
        # 停止可能的systemd服务
        systemctl stop nginx 2>/dev/null || true
        
        echo "✅ 服务停止完成"
        
        # 等待端口释放
        sleep 3
        
        # 再次检查端口
        if lsof -ti:8081 >/dev/null 2>&1; then
            echo "⚠️  端口8081仍被占用"
        else
            echo "✅ 端口8081已释放"
        fi
        
        if lsof -ti:80 >/dev/null 2>&1; then
            echo "⚠️  端口80仍被占用"
        else
            echo "✅ 端口80已释放"
        fi
EOF
    
    print_success "服务停止完成"
}

# 本地构建
build_locally() {
    print_info "开始本地构建..."
    
    # 检查Java环境
    if ! command -v java &> /dev/null; then
        print_error "Java未安装或不在PATH中"
        return 1
    fi
    
    # 进入后端目录并构建
    cd backend
    
    print_info "清理旧的构建文件..."
    rm -rf target/
    
    print_info "开始Maven构建..."
    if ./mvnw clean package -DskipTests -q; then
        print_success "Maven构建成功"
    else
        print_error "Maven构建失败"
        return 1
    fi
    
    # 检查JAR文件
    if [ -f "target/${PROJECT_NAME}-1.0.0.jar" ]; then
        print_success "JAR文件生成成功: target/${PROJECT_NAME}-1.0.0.jar"
    else
        print_error "JAR文件未找到"
        return 1
    fi
    
    cd ..
    print_success "本地构建完成"
}

# 上传到GitHub
upload_to_github() {
    print_info "上传代码到GitHub..."
    
    # 添加所有更改
    git add .
    
    # 提交更改
    COMMIT_MSG="feat: 微信支付公钥模式支持 - 解决平台证书过期问题

- 更新WechatPayService支持RSAPublicKeyConfig
- 更新WechatPayConfig添加公钥配置字段  
- 更新application.yml添加公钥配置注释
- 智能选择公钥模式或证书模式
- 强制重启部署脚本

部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
    
    if git commit -m "$COMMIT_MSG"; then
        print_success "代码提交成功"
    else
        print_warning "没有新的更改需要提交"
    fi
    
    # 推送到GitHub
    if git push origin main; then
        print_success "代码推送到GitHub成功"
    else
        print_error "代码推送失败"
        return 1
    fi
}

# 部署到服务器
deploy_to_server() {
    print_info "部署到服务器..."
    
    # 上传JAR文件
    print_info "上传JAR文件..."
    scp backend/target/${PROJECT_NAME}-1.0.0.jar $SERVER_USER@$SERVER_HOST:/opt/easyjoylife/
    
    # 上传前端文件
    print_info "上传前端文件..."
    scp -r miniprogram/* $SERVER_USER@$SERVER_HOST:/var/www/html/
    
    print_success "文件上传完成"
}

# 启动服务
start_services() {
    print_info "启动服务..."
    
    ssh $SERVER_USER@$SERVER_HOST << 'EOF'
        cd /opt/easyjoylife
        
        echo "🚀 启动后端服务..."
        
        # 设置Java环境变量
        export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
        export PATH=$JAVA_HOME/bin:$PATH
        
        # 启动后端服务
        nohup java -jar -Dserver.port=8081 \
            -Dspring.profiles.active=prod \
            -Xms512m -Xmx1024m \
            easy-joy-life-system-1.0.0.jar > app.log 2>&1 &
        
        echo "等待后端服务启动..."
        sleep 10
        
        # 检查后端服务状态
        if lsof -ti:8081 >/dev/null 2>&1; then
            echo "✅ 后端服务启动成功 (端口8081)"
        else
            echo "❌ 后端服务启动失败"
            echo "最近的日志:"
            tail -20 app.log
            exit 1
        fi
        
        echo "🌐 启动Nginx..."
        systemctl start nginx
        
        if systemctl is-active --quiet nginx; then
            echo "✅ Nginx启动成功"
        else
            echo "❌ Nginx启动失败"
            systemctl status nginx
            exit 1
        fi
        
        echo "🔍 检查服务状态..."
        echo "后端服务 (8081端口):"
        lsof -ti:8081 && echo "✅ 运行中" || echo "❌ 未运行"
        
        echo "前端服务 (80端口):"
        lsof -ti:80 && echo "✅ 运行中" || echo "❌ 未运行"
        
        echo "📊 系统资源使用情况:"
        free -h
        df -h /
EOF
    
    print_success "服务启动完成"
}

# 验证部署
verify_deployment() {
    print_info "验证部署结果..."
    
    # 等待服务完全启动
    sleep 5
    
    # 测试后端API
    print_info "测试后端API..."
    if curl -s -f "http://$SERVER_HOST:8081/api/test" >/dev/null 2>&1; then
        print_success "后端API响应正常"
    else
        print_warning "后端API测试失败，可能需要时间启动"
    fi
    
    # 测试前端
    print_info "测试前端访问..."
    if curl -s -f "http://$SERVER_HOST/" >/dev/null 2>&1; then
        print_success "前端访问正常"
    else
        print_warning "前端访问测试失败"
    fi
    
    print_success "部署验证完成"
}

# 主执行流程
main() {
    echo "=========================================="
    echo "🔧 微信支付公钥模式部署脚本"
    echo "=========================================="
    
    # 检查SSH连接
    if ! check_ssh_connection; then
        exit 1
    fi
    
    # 强制停止服务
    force_stop_services
    
    # 本地构建
    if ! build_locally; then
        print_error "本地构建失败，部署终止"
        exit 1
    fi
    
    # 上传到GitHub
    if ! upload_to_github; then
        print_error "GitHub上传失败，部署终止"
        exit 1
    fi
    
    # 部署到服务器
    if ! deploy_to_server; then
        print_error "服务器部署失败，部署终止"
        exit 1
    fi
    
    # 启动服务
    if ! start_services; then
        print_error "服务启动失败，部署终止"
        exit 1
    fi
    
    # 验证部署
    verify_deployment
    
    echo "=========================================="
    print_success "🎉 部署完成！"
    echo "=========================================="
    echo "📱 小程序访问: https://$SERVER_HOST/"
    echo "🔧 后端API: https://$SERVER_HOST:8081/"
    echo "📋 管理后台: https://$SERVER_HOST/admin.html"
    echo ""
    print_info "💡 下一步操作："
    echo "1. 将真实的微信支付公钥文件放到: backend/src/main/resources/cert/wechatpay_public_key.pem"
    echo "2. 在application.yml中取消注释公钥配置并填入真实的公钥ID"
    echo "3. 重新运行此脚本完成最终部署"
    echo "=========================================="
}

# 执行主函数
main "$@"