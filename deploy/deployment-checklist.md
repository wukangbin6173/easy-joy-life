# 🚀 易享生活棋牌室小程序 - 部署检查清单

## 📋 部署前准备 (Pre-deployment)

### 服务器准备
- [ ] 购买云服务器（推荐配置：2核4G，40GB存储）
- [ ] 获取服务器IP地址: `___________________`
- [ ] 配置SSH密钥或密码登录
- [ ] 确保服务器可以访问外网

### 域名和证书
- [ ] 购买并备案域名: `___________________`
- [ ] 配置DNS解析指向服务器IP
- [ ] 准备SSL证书（Let's Encrypt或购买）

### 微信小程序资质
- [ ] 微信小程序账号已认证
- [ ] 获取AppID: `___________________`
- [ ] 获取AppSecret: `___________________`
- [ ] 微信支付商户号（可选): `___________________`

## 🔧 服务器配置 (Server Setup)

### 环境安装
- [ ] 运行 `server-setup.sh` 脚本
- [ ] Java 11 安装完成
- [ ] MySQL 8.0 安装完成
- [ ] Nginx 安装完成
- [ ] Docker 和 Docker Compose 安装完成

### 安全配置
- [ ] 防火墙配置完成（22, 80, 443端口开放）
- [ ] MySQL root密码设置: `___________________`
- [ ] 创建应用目录 `/opt/easy-joy-life`

## 📦 应用部署 (Application Deployment)

### 代码部署
- [ ] 克隆项目到 `/opt/easy-joy-life`
- [ ] 复制 `.env.example` 为 `.env`
- [ ] 配置环境变量文件

### 环境变量配置
```bash
# 在 deploy/.env 文件中配置以下变量
MYSQL_PASSWORD=___________________
JWT_SECRET=___________________
WECHAT_APPID=___________________
WECHAT_SECRET=___________________
SERVER_DOMAIN=https://___________________
```

### SSL证书配置
- [ ] 安装SSL证书到正确路径
- [ ] 更新Nginx配置中的证书路径
- [ ] 测试HTTPS访问

### 应用启动
- [ ] 运行 `deploy.sh` 脚本
- [ ] 后端服务启动成功（端口8080）
- [ ] MySQL数据库连接正常
- [ ] Nginx代理配置正确

## 🔍 部署验证 (Deployment Verification)

### API测试
- [ ] 健康检查: `curl https://your-domain.com/health`
- [ ] 门店API: `curl https://your-domain.com/api/stores`
- [ ] 管理后台: `https://your-domain.com/admin.html`

### 服务状态检查
```bash
# 检查Docker容器状态
sudo docker-compose -f docker-compose.prod.yml ps

# 检查Nginx状态
sudo systemctl status nginx

# 检查应用日志
sudo docker-compose -f docker-compose.prod.yml logs backend
```

## 📱 小程序配置 (Mini-program Configuration)

### 代码更新
- [ ] 更新 `miniprogram/utils/config.js` 中的生产环境域名
- [ ] 确认环境检测逻辑正确
- [ ] 测试API调用功能

### 微信公众平台配置
- [ ] 登录微信公众平台
- [ ] 配置服务器域名:
  - request合法域名: `https://your-domain.com`
  - uploadFile合法域名: `https://your-domain.com`
  - downloadFile合法域名: `https://your-domain.com`

### 小程序发布
- [ ] 使用微信开发者工具上传代码
- [ ] 填写版本号: `v1.0.0`
- [ ] 填写更新说明
- [ ] 提交审核
- [ ] 审核通过后发布

## 🔒 安全和监控 (Security & Monitoring)

### 安全配置
- [ ] 关闭不必要的端口
- [ ] 配置fail2ban防暴力破解
- [ ] 定期更新系统和依赖
- [ ] 配置自动备份

### 监控设置
- [ ] 配置日志轮转
- [ ] 设置磁盘空间监控
- [ ] 配置服务自动重启
- [ ] 设置告警通知

## ✅ 最终检查 (Final Verification)

### 功能测试
- [ ] 小程序正常启动
- [ ] 门店列表显示正常
- [ ] 门店详情页面正常
- [ ] 房间预订功能正常
- [ ] 用户登录功能正常
- [ ] 管理后台访问正常

### 性能测试
- [ ] 页面加载速度 < 3秒
- [ ] API响应时间 < 1秒
- [ ] 并发用户测试通过
- [ ] 移动端适配正常

### 备份和恢复
- [ ] 数据库备份脚本配置
- [ ] 应用文件备份配置
- [ ] 恢复流程测试通过

## 📞 上线后维护 (Post-deployment Maintenance)

### 日常维护任务
- [ ] 每日检查服务状态
- [ ] 每周检查系统资源使用
- [ ] 每月更新系统补丁
- [ ] 定期备份重要数据

### 监控指标
- [ ] 服务器CPU使用率 < 80%
- [ ] 内存使用率 < 80%
- [ ] 磁盘使用率 < 80%
- [ ] API响应时间 < 1秒
- [ ] 错误率 < 1%

---

## 📝 部署记录

**部署日期**: ___________________  
**部署人员**: ___________________  
**服务器IP**: ___________________  
**域名**: ___________________  
**版本号**: ___________________  

**备注**:
___________________
___________________
___________________

**签名**: ___________________