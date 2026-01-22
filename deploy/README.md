# 易享生活棋牌室小程序 - 生产环境部署指南

## 📋 部署前准备清单

### 1. 服务器资源
- [ ] 云服务器（2核4G，40GB存储，5Mbps带宽）
- [ ] 已备案的域名
- [ ] SSL证书（Let's Encrypt免费证书或购买的证书）

### 2. 微信小程序资质
- [ ] 微信小程序账号（已认证）
- [ ] 小程序AppID和Secret
- [ ] 微信支付商户号（如需支付功能）

### 3. 必要信息收集
- [ ] 服务器IP地址
- [ ] 域名DNS解析
- [ ] 数据库密码
- [ ] JWT密钥
- [ ] 微信配置信息

## 🚀 快速部署步骤

### 步骤1: 服务器初始化
```bash
# 1. 连接到服务器
ssh root@your-server-ip

# 2. 创建部署用户
adduser deploy
usermod -aG sudo deploy
su - deploy

# 3. 运行环境搭建脚本
wget https://raw.githubusercontent.com/wukangbin6173/easy-joy-life/main/deploy/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

### 步骤2: 配置环境变量
```bash
# 1. 克隆项目
cd /opt
sudo git clone https://github.com/wukangbin6173/easy-joy-life.git
sudo chown -R deploy:deploy easy-joy-life

# 2. 配置环境变量
cd easy-joy-life/deploy
cp .env.example .env
vim .env  # 编辑配置文件
```

### 步骤3: 配置SSL证书
```bash
# 使用 Let's Encrypt 免费证书
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 或者上传购买的证书到
# /etc/ssl/certs/your-domain.com.pem
# /etc/ssl/private/your-domain.com.key
```

### 步骤4: 执行部署
```bash
cd /opt/easy-joy-life/deploy
chmod +x deploy.sh
./deploy.sh
```

### 步骤5: 验证部署
```bash
# 检查服务状态
sudo docker-compose -f docker-compose.prod.yml ps

# 检查API
curl https://your-domain.com/api/stores

# 检查日志
sudo docker-compose -f docker-compose.prod.yml logs backend
```

## 🔧 小程序配置更新

### 1. 更新API地址
编辑 `miniprogram/utils/config.js`：
```javascript
production: {
  baseUrl: 'https://your-actual-domain.com',  // 替换为实际域名
  mockMode: false,
  debug: false
}
```

### 2. 配置服务器域名
在微信公众平台 -> 开发 -> 开发设置 -> 服务器域名中添加：
- **request合法域名**: `https://your-domain.com`
- **uploadFile合法域名**: `https://your-domain.com`
- **downloadFile合法域名**: `https://your-domain.com`

### 3. 上传小程序代码
1. 使用微信开发者工具打开 `miniprogram` 目录
2. 点击"上传"按钮
3. 填写版本号和项目备注
4. 上传到微信后台

### 4. 提交审核
1. 登录微信公众平台
2. 进入版本管理
3. 提交审核并填写相关信息
4. 等待审核通过后发布

## 📊 监控和维护

### 1. 日志监控
```bash
# 查看应用日志
sudo docker-compose -f docker-compose.prod.yml logs -f backend

# 查看Nginx日志
sudo tail -f /var/log/nginx/easy-joy-life.access.log
sudo tail -f /var/log/nginx/easy-joy-life.error.log
```

### 2. 性能监控
```bash
# 查看系统资源
htop
df -h
free -h

# 查看Docker容器状态
sudo docker stats
```

### 3. 数据备份
```bash
# 数据库备份
sudo docker exec easy-joy-life-mysql-prod mysqldump -u root -p easy_joy_life_db > backup_$(date +%Y%m%d).sql

# 上传文件备份
sudo tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /opt/easy-joy-life/uploads/
```

## 🔒 安全配置

### 1. 防火墙配置
```bash
sudo ufw status
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw deny 8080   # 禁止直接访问后端
```

### 2. 定期更新
```bash
# 系统更新
sudo apt update && sudo apt upgrade

# Docker镜像更新
sudo docker-compose -f docker-compose.prod.yml pull
sudo docker-compose -f docker-compose.prod.yml up -d
```

## 🆘 故障排除

### 常见问题
1. **服务启动失败**: 检查环境变量配置和端口占用
2. **数据库连接失败**: 检查MySQL服务状态和密码
3. **SSL证书问题**: 检查证书路径和权限
4. **小程序API调用失败**: 检查域名配置和网络连接

### 紧急回滚
```bash
# 回滚到上一个版本
cd /opt/easy-joy-life-backup/backup-YYYYMMDD-HHMMSS
sudo docker-compose -f docker-compose.prod.yml down
sudo cp -r * /opt/easy-joy-life/
cd /opt/easy-joy-life/deploy
sudo docker-compose -f docker-compose.prod.yml up -d
```

## 📞 技术支持

如遇到部署问题，请检查：
1. 服务器配置是否满足要求
2. 域名DNS解析是否正确
3. SSL证书是否有效
4. 环境变量是否配置正确
5. 微信小程序域名是否已配置

更多技术支持请参考项目文档或提交Issue。