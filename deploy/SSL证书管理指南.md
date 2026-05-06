# 🔐 易享生活 - SSL证书自动管理指南

## 📋 概述

本指南提供了完整的SSL证书自动申请、配置和管理解决方案，专为易享生活棋牌室小程序项目设计。

## 🚀 快速开始

### 1. 自动SSL证书申请
```bash
# 进入部署目录
cd /opt/easy-joy-life/deploy

# 运行SSL自动配置脚本
chmod +x ssl-auto-setup.sh
./ssl-auto-setup.sh install
```

### 2. 脚本功能说明
- ✅ 自动检测域名解析
- ✅ 安装和配置Certbot
- ✅ 申请Let's Encrypt免费证书
- ✅ 配置Nginx HTTPS
- ✅ 设置自动续期
- ✅ SSL安全优化配置

## 🔧 详细功能

### 域名和证书信息
- **主域名**: quexitai.com
- **备用域名**: www.quexitai.com
- **证书类型**: Let's Encrypt (免费，90天有效期)
- **自动续期**: 每天凌晨2点检查

### SSL配置特性
- **协议支持**: TLS 1.2, TLS 1.3
- **安全评级**: A+ (SSL Labs)
- **HSTS**: 启用 (1年有效期)
- **安全头**: 完整配置
- **HTTP/2**: 支持

## 📝 使用方法

### 基本命令
```bash
# 完整安装SSL证书
./ssl-auto-setup.sh install

# 手动续期证书
./ssl-auto-setup.sh renew

# 查看证书信息
./ssl-auto-setup.sh info

# 测试SSL配置
./ssl-auto-setup.sh test
```

### 验证SSL证书
```bash
# 检查证书状态
sudo certbot certificates

# 在线测试SSL评级
# 访问: https://www.ssllabs.com/ssltest/analyze.html?d=quexitai.com
```

## 🔄 自动续期机制

### 续期设置
- **检查频率**: 每天凌晨2点
- **续期条件**: 证书剩余30天时自动续期
- **日志位置**: `/var/log/ssl-renewal.log`

### 手动续期
```bash
# 立即检查并续期
sudo certbot renew

# 强制续期 (测试用)
sudo certbot renew --force-renewal

# 查看续期日志
sudo tail -f /var/log/ssl-renewal.log
```

## 🛠️ 故障排除

### 常见问题

#### 1. 域名解析问题
```bash
# 检查DNS解析
dig quexitai.com @8.8.8.8
nslookup quexitai.com

# 确保A记录指向: quexitai.com
```

#### 2. 端口占用问题
```bash
# 检查80端口占用
sudo netstat -tlnp | grep :80

# 停止冲突服务
sudo systemctl stop apache2
```

#### 3. 防火墙问题
```bash
# 开放必要端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### 紧急处理

#### 证书过期处理
```bash
# 1. 立即续期
sudo certbot renew --force-renewal

# 2. 重载Nginx
sudo systemctl reload nginx

# 3. 验证证书
curl -I https://quexitai.com
```

#### 回滚到HTTP
```bash
# 临时禁用HTTPS (紧急情况)
sudo sed -i 's/listen 443 ssl/# listen 443 ssl/' /etc/nginx/sites-available/easy-joy-life
sudo nginx -t && sudo systemctl reload nginx
```

## 📊 监控和维护

### 证书监控
```bash
# 检查证书到期时间
openssl x509 -enddate -noout -in /etc/letsencrypt/live/quexitai.com/cert.pem

# 查看所有证书状态
sudo certbot certificates
```

### 日志监控
```bash
# SSL续期日志
sudo tail -f /var/log/ssl-renewal.log

# Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# Certbot日志
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

## 🔒 安全最佳实践

### SSL配置优化
- ✅ 禁用不安全的SSL/TLS版本
- ✅ 使用强加密套件
- ✅ 启用HSTS
- ✅ 配置安全响应头
- ✅ 启用OCSP装订

### 定期维护任务
- 📅 每月检查证书状态
- 📅 每季度更新Nginx配置
- 📅 每年检查SSL最佳实践更新

## 📞 技术支持

### 获取帮助
如果遇到SSL相关问题：

1. **查看故障排除指南**: `ssl-troubleshooting.md`
2. **检查系统日志**: `journalctl -u nginx`
3. **验证域名解析**: 确保DNS正确配置
4. **测试网络连通性**: `telnet quexitai.com 443`

### 联系信息
- **项目仓库**: https://github.com/wukangbin6173/easy-joy-life
- **SSL测试**: https://www.ssllabs.com/ssltest/
- **Let's Encrypt文档**: https://letsencrypt.org/docs/

---

## 📋 SSL证书检查清单

### 部署前检查
- [ ] 域名已正确解析到服务器IP
- [ ] 80和443端口已开放
- [ ] Nginx已安装并运行
- [ ] 服务器时间正确

### 部署后验证
- [ ] HTTPS访问正常
- [ ] 证书链完整
- [ ] SSL评级A+
- [ ] 自动续期已配置
- [ ] 监控日志正常

### 定期维护
- [ ] 每月检查证书状态
- [ ] 每季度测试续期功能
- [ ] 每年更新SSL配置

**🎉 恭喜！你的SSL证书已成功配置并启用自动管理！**