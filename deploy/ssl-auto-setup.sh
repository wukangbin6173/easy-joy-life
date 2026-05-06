#!/bin/bash

# 易享生活棋牌室 - 自动SSL证书申请脚本
# 域名: quexitai.com
# 支持自动申请、续期和监控

set -e

# 配置变量
DOMAIN="www.quexitai.com"
EMAIL="admin@www.quexitai.com"
WEBROOT="/var/www/html"
NGINX_CONF="/etc/nginx/sites-available/easy-joy-life"
SSL_DIR="/etc/letsencrypt/live/$DOMAIN"

echo "=========================================="
echo "易享生活 - 自动SSL证书管理"
echo "域名: $DOMAIN"
echo "=========================================="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用root用户运行此脚本"
    exit 1
fi

# 1. 安装Certbot
install_certbot() {
    echo "📦 安装Certbot..."
    
    # 更新包列表
    apt update
    
    # 安装snapd (如果没有)
    if ! command -v snap &> /dev/null; then
        apt install -y snapd
        systemctl enable --now snapd.socket
        sleep 5
    fi
    
    # 安装certbot
    if ! command -v certbot &> /dev/null; then
        snap install --classic certbot
        ln -sf /snap/bin/certbot /usr/bin/certbot
    fi
    
    echo "✅ Certbot安装完成"
}

# 2. 检查域名解析
check_dns() {
    echo "🔍 检查域名解析..."
    
    # 获取服务器公网IP
    SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip)
    echo "服务器IP: $SERVER_IP"
    
    # 检查主域名解析
    DOMAIN_IP=$(dig +short $DOMAIN @8.8.8.8 | tail -n1)
    echo "域名 $DOMAIN 解析到: $DOMAIN_IP"
    
    if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
        echo "⚠️  警告: 域名解析不匹配"
        echo "请确保域名 $DOMAIN 的A记录指向 $SERVER_IP"
        read -p "是否继续申请证书? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "✅ 域名解析正确"
    fi
}

# 3. 准备Nginx临时配置
setup_temp_nginx() {
    echo "🔧 配置临时Nginx..."
    
    # 创建webroot目录
    mkdir -p $WEBROOT
    
    # 创建临时Nginx配置
    cat > /etc/nginx/sites-available/temp-ssl << EOF
server {
    listen 80;
    server_name $DOMAIN $WWW_DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root $WEBROOT;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF
    
    # 启用临时配置
    ln -sf /etc/nginx/sites-available/temp-ssl /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # 测试并重载Nginx
    nginx -t && systemctl reload nginx
    
    echo "✅ 临时Nginx配置完成"
}

# 4. 申请SSL证书
request_certificate() {
    echo "🔐 申请SSL证书..."
    
    # 使用webroot方式申请证书
    certbot certonly \
        --webroot \
        --webroot-path=$WEBROOT \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --non-interactive \
        -d $DOMAIN \
        -d $WWW_DOMAIN
    
    if [ $? -eq 0 ]; then
        echo "✅ SSL证书申请成功"
        ls -la $SSL_DIR/
    else
        echo "❌ SSL证书申请失败"
        exit 1
    fi
}

# 5. 配置生产环境Nginx
setup_production_nginx() {
    echo "🚀 配置生产环境Nginx..."
    
    # 创建生产环境Nginx配置
    cat > $NGINX_CONF << EOF
# 易享生活棋牌室 - 生产环境配置
upstream backend {
    server 127.0.0.1:8080;
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name $DOMAIN $WWW_DOMAIN;
    
    # Let's Encrypt验证
    location /.well-known/acme-challenge/ {
        root $WEBROOT;
    }
    
    # 其他请求重定向到HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS主配置
server {
    listen 443 ssl http2;
    server_name $DOMAIN $WWW_DOMAIN;
    
    # SSL证书配置
    ssl_certificate $SSL_DIR/fullchain.pem;
    ssl_certificate_key $SSL_DIR/privkey.pem;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 文件上传大小限制
    client_max_body_size 10M;
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API代理
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # 超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # 管理后台
    location /admin.html {
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://backend;
        access_log off;
    }
    
    # 默认页面
    location / {
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # 启用生产配置
    rm -f /etc/nginx/sites-enabled/temp-ssl
    ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
    
    # 测试并重载Nginx
    nginx -t && systemctl reload nginx
    
    echo "✅ 生产环境Nginx配置完成"
}

# 6. 设置自动续期
setup_auto_renewal() {
    echo "🔄 设置SSL证书自动续期..."
    
    # 创建续期脚本
    cat > /usr/local/bin/ssl-renewal.sh << 'EOF'
#!/bin/bash
# SSL证书自动续期脚本

echo "$(date): 开始检查SSL证书续期..."

# 尝试续期证书
certbot renew --quiet --no-self-upgrade

# 如果证书更新了，重载Nginx
if [ $? -eq 0 ]; then
    echo "$(date): 证书检查完成"
    systemctl reload nginx
    echo "$(date): Nginx已重载"
else
    echo "$(date): 证书续期失败"
fi
EOF
    
    chmod +x /usr/local/bin/ssl-renewal.sh
    
    # 添加到crontab (每天凌晨2点检查)
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/ssl-renewal.sh >> /var/log/ssl-renewal.log 2>&1") | crontab -
    
    echo "✅ 自动续期设置完成"
    echo "📅 证书将在每天凌晨2点自动检查续期"
}

# 7. 验证SSL证书
verify_ssl() {
    echo "🔍 验证SSL证书..."
    
    # 等待Nginx重载完成
    sleep 5
    
    # 检查证书有效性
    echo "检查证书信息:"
    openssl s_client -connect $DOMAIN:443 -servername $DOMAIN < /dev/null 2>/dev/null | openssl x509 -noout -dates
    
    # 测试HTTPS访问
    echo "测试HTTPS访问:"
    if curl -s -I https://$DOMAIN | grep -q "200 OK"; then
        echo "✅ HTTPS访问正常"
    else
        echo "⚠️  HTTPS访问可能有问题"
    fi
    
    # 测试证书评级
    echo "🔗 SSL证书评级测试:"
    echo "请访问: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
}

# 8. 显示证书信息
show_certificate_info() {
    echo "=========================================="
    echo "📋 SSL证书信息"
    echo "=========================================="
    echo "域名: $DOMAIN, $WWW_DOMAIN"
    echo "证书路径: $SSL_DIR"
    echo "有效期:"
    certbot certificates | grep -A 10 $DOMAIN
    echo ""
    echo "🔗 访问地址:"
    echo "- https://$DOMAIN"
    echo "- https://$WWW_DOMAIN"
    echo ""
    echo "📅 自动续期: 已启用 (每天凌晨2点检查)"
    echo "📝 续期日志: /var/log/ssl-renewal.log"
    echo "=========================================="
}

# 主函数
main() {
    case "${1:-install}" in
        "install")
            install_certbot
            check_dns
            setup_temp_nginx
            request_certificate
            setup_production_nginx
            setup_auto_renewal
            verify_ssl
            show_certificate_info
            ;;
        "renew")
            echo "🔄 手动续期SSL证书..."
            certbot renew
            systemctl reload nginx
            echo "✅ 续期完成"
            ;;
        "info")
            show_certificate_info
            ;;
        "test")
            verify_ssl
            ;;
        *)
            echo "用法: $0 [install|renew|info|test]"
            echo "  install - 安装并申请SSL证书 (默认)"
            echo "  renew   - 手动续期证书"
            echo "  info    - 显示证书信息"
            echo "  test    - 测试SSL配置"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"