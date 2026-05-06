# 🔐 SSL证书自动申请 - 故障排除指南

## 📋 SSL证书管理脚本使用

### 基本用法
```bash
# 完整安装SSL证书
chmod +x ssl-auto-setup.sh
./ssl-auto-setup.sh install

# 手动续期证书
./ssl-auto-setup.sh renew

# 查看证书信息
./ssl-auto-setup.sh info

# 测试SSL配置
./ssl-auto-setup.sh test
```

## 🔧 常见问题解决

### 1. 域名解析问题

#### 问题症状
```
❌ 域名解析不匹配
域名 quexitai.com 解析到: 1.2.3.4
服务器IP: quexitai.com
```

#### 解决方案
```bash
# 检查DNS解析
dig quexitai.com @8.8.8.8
nslookup quexitai.com

# 等待DNS生效 (可能需要24小时)
# 或联系域名注册商检查A记录配置
```

### 2. 80端口被占用

#### 问题症状
```
nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
```

#### 解决方案
```bash
# 查看占用80端口的进程
sudo netstat -tlnp | grep :80
sudo lsof -i :80

# 停止占用进程
sudo systemctl stop apache2  # 如果是Apache
sudo pkill -f "进程名"

# 重启Nginx
sudo systemctl restart nginx
```

### 3. Let's Encrypt速率限制

#### 问题症状
```
too many certificates already issued for exact set of domains
```

#### 解决方案
```bash
# 使用测试环境申请 (不计入限制)
certbot certonly --staging \
    --webroot \
    --webroot-path=/var/www/html \
    -d quexitai.com \
    -d www.quexitai.com

# 测试成功后，删除测试证书，申请正式证书
certbot delete --cert-name quexitai.com
```

### 4. 防火墙阻止访问

#### 问题症状
```
Connection timed out
curl: (7) Failed to connect to quexitai.com port 80
```

#### 解决方案
```bash
# 检查防火墙状态
sudo ufw status

# 开放必要端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# 检查云服务器安全组
# 确保80和443端口在云控制台中已开放
```

### 5. Nginx配置错误

#### 问题症状
```
nginx: [emerg] invalid parameter "ssl_certificate"
nginx: configuration file /etc/nginx/nginx.conf test failed
```

#### 解决方案
```bash
# 检查Nginx配置语法
sudo nginx -t

# 查看详细错误信息
sudo nginx -T

# 恢复默认配置
sudo cp /etc/nginx/sites-available/default.backup /etc/nginx/sites-available/default
sudo systemctl reload nginx
```

## 🛠️ 手动SSL证书申请

如果自动脚本失败，可以手动申请：

### 方法1: Webroot方式
```bash
# 1. 准备webroot目录
sudo mkdir -p /var/www/html
sudo chown -R www-data:www-data /var/www/html

# 2. 配置临时Nginx
sudo tee /etc/nginx/sites-available/temp << EOF
server {
    listen 80;
    server_name quexitai.com www.quexitai.com;
    root /var/www/html;
    
    location /.well-known/acme-challenge/ {
        try_files \$uri =404;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/temp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 3. 申请证书
sudo certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email admin@quexitai.com \
    --agree-tos \
    --no-eff-email \
    -d quexitai.com \
    -d www.quexitai.com
```

### 方法2: Standalone方式
```bash
# 1. 停止Nginx
sudo systemctl stop nginx

# 2. 申请证书
sudo certbot certonly \
    --standalone \
    --email admin@quexitai.com \
    --agree-tos \
    --no-eff-email \
    -d quexitai.com \
    -d www.quexitai.com

# 3. 重启Nginx
sudo systemctl start nginx
```

### 方法3: DNS验证方式
```bash
# 适用于域名在阿里云/腾讯云等支持API的服务商
sudo certbot certonly \
    --manual \
    --preferred-challenges dns \
    --email admin@quexitai.com \
    --agree-tos \
    -d quexitai.com \
    -d www.quexitai.com

# 按提示添加TXT记录到DNS
```

## 🔍 SSL证书验证

### 检查证书有效性
```bash
# 查看证书详情
sudo certbot certificates

# 检查证书文件
sudo ls -la /etc/letsencrypt/live/quexitai.com/

# 测试证书链
openssl s_client -connect quexitai.com:443 -servername quexitai.com
```

### 在线SSL测试工具
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **SSL Checker**: https://www.sslchecker.com/
- **DigiCert**: https://www.digicert.com/help/

## 🔄 证书续期管理

### 手动续期
```bash
# 续期所有证书
sudo certbot renew

# 续期特定证书
sudo certbot renew --cert-name quexitai.com

# 强制续期 (测试用)
sudo certbot renew --force-renewal
```

### 自动续期设置
```bash
# 查看现有定时任务
sudo crontab -l

# 添加自动续期任务
echo "0 2 * * * /usr/bin/certbot renew --quiet && /bin/systemctl reload nginx" | sudo crontab -

# 测试续期脚本
sudo /usr/local/bin/ssl-renewal.sh
```

## 📝 日志和监控

### 重要日志文件
```bash
# Certbot日志
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# SSL续期日志
sudo tail -f /var/log/ssl-renewal.log

# 系统日志
sudo journalctl -u nginx -f
```

### 监控证书到期
```bash
# 检查证书到期时间
sudo certbot certificates | grep -A 5 quexitai.com

# 创建到期提醒脚本
cat > /usr/local/bin/ssl-expiry-check.sh << 'EOF'
#!/bin/bash
DAYS_BEFORE_EXPIRY=30
CERT_PATH="/etc/letsencrypt/live/quexitai.com/cert.pem"

if [ -f "$CERT_PATH" ]; then
    EXPIRY_DATE=$(openssl x509 -enddate -noout -in "$CERT_PATH" | cut -d= -f2)
    EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s)
    CURRENT_TIMESTAMP=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_TIMESTAMP - $CURRENT_TIMESTAMP) / 86400 ))
    
    if [ $DAYS_LEFT -lt $DAYS_BEFORE_EXPIRY ]; then
        echo "警告: SSL证书将在 $DAYS_LEFT 天后过期!"
        # 这里可以添加邮件通知或其他告警
    fi
fi
EOF

chmod +x /usr/local/bin/ssl-expiry-check.sh
```

## 🚨 紧急情况处理

### 证书过期紧急处理
```bash
# 1. 立即续期
sudo certbot renew --force-renewal

# 2. 如果续期失败，临时禁用HTTPS
sudo sed -i 's/listen 443 ssl/# listen 443 ssl/' /etc/nginx/sites-available/easy-joy-life
sudo sed -i 's/ssl_certificate/# ssl_certificate/' /etc/nginx/sites-available/easy-joy-life
sudo nginx -t && sudo systemctl reload nginx

# 3. 重新申请证书后恢复HTTPS配置
```

### 回滚到HTTP
```bash
# 临时配置仅HTTP访问
sudo tee /etc/nginx/sites-available/http-only << EOF
server {
    listen 80;
    server_name quexitai.com www.quexitai.com;
    
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/http-only /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 📞 获取帮助

如果遇到无法解决的问题：

1. **查看详细日志**: `/var/log/letsencrypt/letsencrypt.log`
2. **检查Nginx配置**: `sudo nginx -T`
3. **验证域名解析**: `dig quexitai.com`
4. **测试端口连通性**: `telnet quexitai.com 80`
5. **联系域名服务商**: 确认DNS配置正确

记住：SSL证书申请需要域名正确解析到服务器IP，这是最关键的前提条件！