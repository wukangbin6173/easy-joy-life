# 微信支付API证书获取指南

## 🔑 问题描述
缺少微信支付私钥文件：`apiclient_key.pem`

## 📋 获取步骤

### 1. 登录微信支付商户平台
- 访问：https://pay.weixin.qq.com
- 使用商户号：**1554487931** 登录

### 2. 进入API安全页面
1. 登录后，点击【账户中心】
2. 选择【API安全】
3. 找到【API证书】部分

### 3. 下载API证书
有两种方式获取证书：

#### 方式一：下载现有证书（推荐）
1. 在【API证书】部分，点击【下载证书】
2. 输入操作密码
3. 下载得到压缩包，包含：
   - `apiclient_cert.pem` - 商户证书（公钥）
   - `apiclient_key.pem` - 商户私钥 ⭐**这是我们需要的文件**
   - `apiclient_cert.p12` - PKCS12格式证书

#### 方式二：申请新证书
1. 点击【申请证书】
2. 下载证书工具
3. 生成证书请求文件
4. 上传并获得新证书

### 4. 证书文件说明
- `apiclient_cert.pem` - 商户API证书（公钥），用于验证商户身份
- `apiclient_key.pem` - 商户API私钥，用于签名请求 ⭐**关键文件**
- 证书有效期：通常为1年，到期需要更新

### 5. 安全注意事项
⚠️ **重要提醒**：
- 私钥文件 `apiclient_key.pem` 绝对不能泄露
- 不要将私钥文件提交到公开的代码仓库
- 建议使用环境变量或安全的配置管理方式

## 🔧 部署步骤

### 1. 下载证书后
将 `apiclient_key.pem` 文件放到：
```
backend/src/main/resources/cert/apiclient_key.pem
```

### 2. 验证文件格式
私钥文件应该以以下格式开头：
```
-----BEGIN PRIVATE KEY-----
```

### 3. 重新部署
```bash
# 重新编译并部署
./go.bat
```

## 📊 当前状态检查

### 现有文件：
- ✅ `apiclient_cert.pem` - 已存在
- ✅ `wechatpay_public_key.pem` - 已存在（你已添加）
- ❌ `apiclient_key.pem` - **缺失，需要下载**

### 配置状态：
- ✅ 商户号：1554487931
- ✅ 商户证书序列号：68EFFAD8D54020146A1372141B6EEBA1B52D6B64
- ✅ API v3密钥：已配置
- ✅ 微信支付公钥：已配置
- ❌ 商户私钥：缺失

## 🚀 临时解决方案

如果暂时无法获取私钥文件，可以：

1. **禁用微信支付功能**：
   ```yaml
   wechat:
     pay:
       enabled: false
   ```

2. **使用支付宝支付**：
   支付宝配置已完整，可以正常使用

3. **模拟支付模式**：
   在开发环境使用模拟支付进行测试

## 📞 技术支持

如果在获取证书过程中遇到问题：
1. 联系微信支付技术支持
2. 确认商户号权限
3. 检查账户状态

## ⚡ 快速检查命令

下载证书后，可以使用以下命令验证：
```bash
# 检查私钥文件格式
openssl rsa -in apiclient_key.pem -check -noout

# 检查证书和私钥是否匹配
openssl x509 -in apiclient_cert.pem -pubkey -noout | openssl md5
openssl rsa -in apiclient_key.pem -pubout | openssl md5
```

两个MD5值应该相同，表示证书和私钥匹配。