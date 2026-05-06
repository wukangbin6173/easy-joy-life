# 🚀 易享生活棋牌室 - 服务器连接和部署指南

## 📋 服务器信息
- **IP地址**: quexitai.com
- **域名**: quexitai.com
- **操作系统**: Ubuntu 20.04 LTS (推荐)

## 🔑 第一步：连接服务器

### 方法1: 使用SSH密钥（推荐）
```bash
# 如果你有SSH私钥文件
ssh -i /path/to/your/private-key root@quexitai.com

# 或者使用默认密钥
ssh root@quexitai.com
```

### 方法2: 使用密码
```bash
ssh root@quexitai.com
# 输入服务器密码
```

### Windows用户
- 使用 **PuTTY** 或 **Windows Terminal**
- 主机名: `quexitai.com`
- 端口: `22`
- 用户名: `root`

## 🌐 第二步：配置域名解析

确保域名 `quexitai.com` 已正确解析到服务器IP：

### 检查DNS解析
```bash
# 在本地电脑运行
nslookup quexitai.com
ping quexitai.com
```

### 如果DNS未生效
1. 登录域名注册商管理后台
2. 添加A记录：
   - 主机记录: `@`
   - 记录值: `quexitai.com`
   - TTL: `600`
3. 添加CNAME记录：
   - 主机记录: `www`
   - 记录值: `quexitai.com`
   - TTL: `600`

## 🚀 第三步：一键部署

连接到服务器后，运行以下命令：

```bash
# 下载快速部署脚本
wget https://raw.githubusercontent.com/wukangbin6173/easy-joy-life/main/deploy/quick-deploy-easyjoylife.sh

# 给脚本执行权限
chmod +x quick-deploy-easyjoylife.sh

# 运行部署脚本
./quick-deploy-easyjoylife.sh
```

## ⏱️ 部署时间预估
- **环境安装**: 10-15分钟
- **SSL证书配置**: 2-3分钟
- **应用构建**: 5-8分钟
- **服务启动**: 2-3分钟
- **总计**: 约20-30分钟

## 🔍 第四步：验证部署

部署完成后，测试以下链接：

### 1. 基础连通性测试
```bash
# 在服务器上运行
curl http://localhost:8080/api/stores
curl https://quexitai.com/api/stores
```

### 2. 浏览器访问测试
- **网站首页**: https://quexitai.com
- **API接口**: https://quexitai.com/api/stores
- **管理后台**: https://quexitai.com/admin.html

### 3. SSL证书测试
```bash
# 检查SSL证书
openssl s_client -connect quexitai.com:443 -servername quexitai.com
```

## 📱 第五步：小程序配置

### 1. 微信公众平台配置
登录 [微信公众平台](https://mp.weixin.qq.com)：

1. 进入 **开发** -> **开发设置**
2. 配置 **服务器域名**：
   - request合法域名: `quexitai.com`
   - uploadFile合法域名: `quexitai.com`
   - downloadFile合法域名: `quexitai.com`

### 2. 小程序代码上传
1. 使用微信开发者工具打开 `miniprogram` 目录
2. 确认环境配置正确（会自动使用生产环境）
3. 点击 **上传** 按钮
4. 填写版本号: `v1.0.0`
5. 填写更新说明: `易享生活棋牌室小程序首次发布`

### 3. 提交审核
1. 在微信公众平台进入 **版本管理**
2. 点击 **提交审核**
3. 填写相关信息并提交

## 🔧 故障排除

### 常见问题

#### 1. 连接服务器失败
```bash
# 检查网络连通性
ping quexitai.com

# 检查SSH服务
telnet quexitai.com 22
```

#### 2. 域名解析失败
```bash
# 检查DNS解析
dig quexitai.com
nslookup quexitai.com 8.8.8.8
```

#### 3. SSL证书申请失败
```bash
# 手动申请证书
certbot certonly --standalone -d quexitai.com -d www.quexitai.com
```

#### 4. 服务启动失败
```bash
# 查看服务状态
docker-compose -f /opt/easy-joy-life/deploy/docker-compose.prod.yml ps

# 查看日志
docker-compose -f /opt/easy-joy-life/deploy/docker-compose.prod.yml logs backend
```

### 获取帮助
如果遇到问题：
1. 检查服务器防火墙设置
2. 确认域名DNS解析正确
3. 查看应用日志文件
4. 检查MySQL数据库连接

## 📞 技术支持

部署过程中如有问题，请提供：
1. 错误信息截图
2. 服务器日志
3. 执行的具体命令
4. 服务器配置信息

---

**准备好了吗？让我们开始部署易享生活棋牌室小程序！** 🚀