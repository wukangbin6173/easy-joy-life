# 微信支付 API v3 密钥获取指南

## 📍 什么是 API v3 密钥？

API v3 密钥是用于**加密和解密**微信支付 API v3 接口数据的密钥，长度为**32位**。

**重要**：每个商户号都有自己独立的 API v3 密钥！

---

## 🔑 获取步骤

### 1. 登录微信支付商户平台

```
网址：https://pay.weixin.qq.com
使用超级管理员账号登录
```

### 2. 进入 API 安全设置

**路径**：
```
【账户中心】→ 【账户设置】→ 【API安全】
```

或者直接访问：
```
https://pay.weixin.qq.com/index.php/core/cert/api_cert
```

### 3. 找到 APIv3 密钥

在页面中找到 **"APIv3密钥"** 部分。

### 4. 设置或查看密钥

#### 情况A：首次设置

如果显示"未设置"，点击 **【设置密钥】** 按钮：

1. **输入密钥**：
   - 必须是**32位**字符
   - 可以包含：大小写字母、数字
   - 建议使用随机生成的强密码

2. **示例格式**：
   ```
   7Bf2k9Qd4Gh1Pz6Rt3Sw5Xy8Ac0VeMjU
   ```

3. **验证身份**：
   - 需要超级管理员扫码确认
   - 或者使用短信验证码

4. **保存密钥**：
   - ⚠️ **重要**：密钥设置后无法查看，请立即保存！
   - 建议保存到安全的密码管理器

#### 情况B：已设置但忘记

如果已经设置过但忘记了密钥：

1. 点击 **【重新设置密钥】**
2. 按照上述步骤重新设置
3. ⚠️ 注意：重新设置后，旧密钥立即失效

---

## 🔐 生成 32 位随机密钥

### 方法1：在线生成器

访问：https://www.random.org/strings/

设置：
- Length: 32
- Characters: Alphanumeric (a-z, A-Z, 0-9)
- 点击 "Get Strings"

### 方法2：使用命令行

**Linux/Mac**：
```bash
openssl rand -base64 24 | tr -d '/+=' | head -c 32
```

**Windows PowerShell**：
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 方法3：手动组合

使用大小写字母和数字，组合成32位字符串：
```
示例：Abc123Def456Ghi789Jkl012Mno345Pq
```

---

## 📝 配置到项目

### 1. 更新配置文件

编辑 `backend/src/main/resources/application.yml`：

```yaml
wechat:
  pay:
    app-id: wx9f4a33e5f2b31a6d  # 小程序AppID
    mch-id: 1671050768  # 新商户号
    private-key-path: classpath:cert/apiclient_key.pem
    merchant-serial-number: 7FC9E48CC505E55AB1D25033D98287B28BE36C3A
    api-v3-key: 这里填写您在商户平台设置的32位密钥  # ← 修改这里
    notify-url: https://xx.aieo.cn/api/payment/wechat/notify
```

### 2. 验证密钥格式

确保：
- ✅ 长度正好是 **32 位**
- ✅ 只包含字母和数字
- ✅ 没有空格或特殊字符
- ✅ 与商户平台设置的完全一致

---

## ⚠️ 重要注意事项

### 1. 密钥安全

- ❌ **不要**将密钥提交到 Git 仓库
- ❌ **不要**在公开场合分享密钥
- ✅ 使用环境变量或配置文件管理
- ✅ 定期更换密钥（建议每年一次）

### 2. 密钥作用

API v3 密钥用于：
- ✅ 加密敏感信息（如用户手机号）
- ✅ 解密微信支付回调通知
- ✅ 下载平台证书时的解密

### 3. 与其他密钥的区别

| 密钥类型 | 用途 | 长度 | 获取方式 |
|---------|------|------|---------|
| **API v3 密钥** | 加密/解密数据 | 32位 | 商户平台设置 |
| **商户私钥** | 签名请求 | PEM格式 | 下载证书文件 |
| **小程序 AppSecret** | 获取用户信息 | 32位 | 小程序后台 |

---

## 🔍 常见问题

### Q1: 忘记了 API v3 密钥怎么办？

**A**: 只能重新设置。密钥设置后无法查看，只能重置。

### Q2: 重置密钥会影响现有业务吗？

**A**: 会！重置后旧密钥立即失效，需要：
1. 更新所有使用该商户号的系统配置
2. 重启所有相关服务
3. 建议在业务低峰期操作

### Q3: API v3 密钥可以随便设置吗？

**A**: 可以，但建议：
- 使用随机生成的强密码
- 不要使用容易猜测的字符串
- 不要使用其他系统的密码

### Q4: 多个系统可以共用一个密钥吗？

**A**: 可以。同一个商户号的所有系统使用相同的 API v3 密钥。

### Q5: 签名错误是密钥问题吗？

**A**: 可能是以下原因：
- ❌ API v3 密钥错误
- ❌ 商户私钥不匹配
- ❌ 商户证书序列号错误
- ❌ 商户号错误

---

## 📋 完整配置检查清单

更换商户号后，需要确认以下所有配置：

- [ ] **商户号** (mch-id)：新商户号
- [ ] **API v3 密钥** (api-v3-key)：新商户号的密钥（32位）
- [ ] **商户私钥** (apiclient_key.pem)：新商户号的私钥文件
- [ ] **商户证书** (apiclient_cert.pem)：新商户号的证书文件
- [ ] **商户证书序列号** (merchant-serial-number)：新证书的序列号
- [ ] **小程序 AppID** (app-id)：确认是否需要更换
- [ ] **小程序 AppSecret**：确认是否需要更换

---

## 🚀 配置完成后的操作

### 1. 上传配置文件

```bash
scp backend/src/main/resources/application.yml root@xx.aieo.cn:/opt/easy-joy-life/backend/src/main/resources/
```

### 2. 重新编译

```bash
ssh root@xx.aieo.cn "cd /opt/easy-joy-life/backend && mvn clean package -DskipTests"
```

### 3. 重启服务

```bash
ssh root@xx.aieo.cn "systemctl restart easy-joy-life-backend"
```

### 4. 查看日志

```bash
ssh root@xx.aieo.cn "journalctl -u easy-joy-life-backend -n 100 --no-pager | grep '微信支付'"
```

### 5. 验证成功标志

日志中应该看到：
```
✅ 微信支付服务初始化成功
✅ 微信支付JSAPI服务初始化成功
✅ 微信支付服务初始化完成，SDK版本: 0.2.17
```

---

## 📞 需要帮助？

如果遇到问题：

1. **检查密钥格式**：确保是32位，无空格
2. **检查商户号**：确认使用的是新商户号
3. **检查证书**：确认证书文件与商户号匹配
4. **查看日志**：查看详细的错误信息
5. **联系微信支付客服**：95017

---

## 📚 参考资料

- [微信支付开发文档](https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml)
- [API v3 密钥说明](https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay3_0.shtml)
- [商户平台](https://pay.weixin.qq.com)

---

**创建时间**：2026-02-07  
**适用版本**：微信支付 API v3  
**商户号**：1671050768（上海信辉联智信息咨询有限公司）

