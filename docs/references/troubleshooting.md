# 常见问题排查指南

> **文档类型**：快速参考
> **最后更新**：2026-02-05

---

## 🔍 问题分类

### 1. 微信登录问题
### 2. 微信支付问题
### 3. 用户信息问题
### 4. 服务器部署问题
### 5. 数据库问题

---

## 1️⃣ 微信登录问题

### 问题：小程序无法登录

**症状**：
- 点击登录无反应
- 提示"登录失败"
- 后端日志显示 code2Session 失败

**排查步骤**：

```bash
# 1. 检查小程序配置
# miniprogram/utils/config.js
const config = {
  appId: 'wx...',  # 检查是否正确
  baseUrl: 'https://your-domain.com/api'  # 检查域名
}

# 2. 检查后端配置
# backend/src/main/resources/application-prod.yml
wechat:
  miniprogram:
    appId: wx...  # 必须与小程序一致
    appSecret: ...  # 检查是否正确

# 3. 检查域名配置
# 微信公众平台 → 开发 → 开发管理 → 服务器域名
# 确保 your-domain.com 已添加到白名单

# 4. 查看后端日志
docker logs easyjoylife-backend | grep -i "login"
```

**常见原因**：
- AppID 或 AppSecret 配置错误
- 域名未在微信后台配置
- HTTPS 证书问题
- 网络连接问题

**解决方案**：
- 核对 AppID 和 AppSecret
- 在微信公众平台添加服务器域名
- 检查 SSL 证书是否有效
- 测试网络连通性

**相关文档**：
- [微信静默登录问题修复](../experiences/01.wechat-login-fix.md)

---

## 2️⃣ 微信支付问题

### 问题：支付失败

**症状**：
- 点击支付无反应
- 提示"支付失败，请重试"
- 后端日志显示证书验证失败

**排查步骤**：

```bash
# 1. 检查证书有效期
openssl x509 -in backend/src/main/resources/cert/wechatpay_public_key.pem \
  -noout -dates

# 2. 检查商户号配置
# application-prod.yml
wechat:
  pay:
    mchId: "1234567890"  # 商户号
    apiV3Key: "..."      # API密钥V3
    certSerialNo: "..."  # 证书序列号

# 3. 测试支付接口
curl -X POST https://your-domain.com/api/payment/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount": 100, "userId": 1}'

# 4. 查看支付日志
docker logs easyjoylife-backend | grep -i "payment"
```

**常见原因**：
- 微信支付证书过期
- 商户号或密钥配置错误
- 签名验证失败
- 回调地址配置错误

**解决方案**：
- 更新微信支付证书
- 核对商户号和密钥
- 检查签名算法
- 配置正确的回调地址

**相关文档**：
- [微信支付证书过期解决方案](../experiences/02.wechat-payment-cert.md)
- [微信支付集成指南](../../微信支付集成指南.md)

---

## 3️⃣ 用户信息问题

### 问题：用户信息无法更新

**症状**：
- 修改昵称或头像后不生效
- 提示"更新失败"
- 后端返回 500 错误

**排查步骤**：

```bash
# 1. 检查请求参数
# 小程序控制台查看请求
PUT /api/user/profile
{
  "nickname": "新昵称",
  "avatar": "https://..."
}

# 2. 检查后端日志
docker logs easyjoylife-backend | grep -i "user"

# 3. 检查数据库连接
docker exec easyjoylife-mysql mysql -uroot -p -e "SELECT 1"

# 4. 测试更新接口
curl -X PUT https://your-domain.com/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"nickname": "测试", "avatar": "https://..."}'
```

**常见原因**：
- 参数验证失败
- 数据库连接问题
- 权限不足
- 字段长度超限

**解决方案**：
- 检查参数格式
- 验证数据库连接
- 检查用户权限
- 调整字段长度限制

**相关文档**：
- [用户信息更新问题修复](../experiences/03.user-info-update.md)

---

## 4️⃣ 服务器部署问题

### 问题：服务无法启动

**症状**：
- Docker 容器启动失败
- 后端服务无响应
- Nginx 502 错误

**排查步骤**：

```bash
# 1. 检查容器状态
docker ps -a

# 2. 查看容器日志
docker logs easyjoylife-backend
docker logs easyjoylife-nginx
docker logs easyjoylife-mysql

# 3. 检查端口占用
netstat -tlnp | grep 8080
netstat -tlnp | grep 3306

# 4. 检查磁盘空间
df -h

# 5. 检查内存使用
free -h
```

**常见原因**：
- 端口被占用
- 磁盘空间不足
- 内存不足
- 配置文件错误
- 数据库连接失败

**解决方案**：
- 释放被占用的端口
- 清理磁盘空间
- 增加内存或优化配置
- 检查配置文件语法
- 验证数据库连接信息

**相关文档**：
- [服务器部署经验](../experiences/05.server-deployment.md)
- [部署规范](../standards/05.tool-02.deployment.md)

---

## 5️⃣ 数据库问题

### 问题：数据库连接失败

**症状**：
- 后端启动失败
- 提示"Unable to connect to database"
- 接口返回 500 错误

**排查步骤**：

```bash
# 1. 检查 MySQL 容器状态
docker ps | grep mysql

# 2. 测试数据库连接
docker exec easyjoylife-mysql mysql -uroot -p -e "SELECT 1"

# 3. 检查数据库配置
# application-prod.yml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/easyjoylife
    username: root
    password: ${MYSQL_ROOT_PASSWORD}

# 4. 查看 MySQL 日志
docker logs easyjoylife-mysql

# 5. 检查网络连接
docker network inspect easyjoylife_default
```

**常见原因**：
- MySQL 容器未启动
- 数据库密码错误
- 数据库不存在
- 网络配置问题
- 防火墙阻止连接

**解决方案**：
- 启动 MySQL 容器
- 核对数据库密码
- 创建数据库
- 检查 Docker 网络配置
- 配置防火墙规则

---

## 🚨 紧急问题处理

### 生产环境故障

**立即执行**：
```bash
# 1. 查看所有容器状态
docker ps -a

# 2. 重启服务
cd deploy
docker-compose restart

# 3. 查看日志
docker-compose logs -f --tail=100

# 4. 如果需要完全重启
docker-compose down
docker-compose up -d
```

### 数据恢复

**数据库恢复**：
```bash
# 1. 停止服务
docker-compose stop backend

# 2. 恢复数据库
docker exec -i easyjoylife-mysql mysql -uroot -p easyjoylife < backup.sql

# 3. 重启服务
docker-compose start backend
```

---

## 📞 获取帮助

### 查看日志
```bash
# 后端日志
docker logs easyjoylife-backend --tail=100 -f

# Nginx 日志
docker logs easyjoylife-nginx --tail=100 -f

# MySQL 日志
docker logs easyjoylife-mysql --tail=100 -f
```

### 联系支持
- **技术文档**：docs/
- **问题记录**：docs/experiences/
- **部署指南**：deploy/README.md

---

**维护者**：开发团队
**最后更新**：2026-02-05
