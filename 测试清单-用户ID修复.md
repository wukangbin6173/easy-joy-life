# 测试清单 - 用户ID修复

## 快速验证

### 1. 代码验证 ✅
```bash
node verify-userid-fix.js
```
**结果**: 所有文件验证通过

---

## 功能测试

### 场景A: 未登录状态

#### 测试步骤
1. 清除登录状态
   ```javascript
   // 在微信开发者工具控制台执行
   getApp().globalData.userId = null
   ```

2. 测试各个页面

| 页面 | 操作 | 预期结果 | 状态 |
|------|------|---------|------|
| 钱包页面 | 进入页面 | 提示"请先登录" | ⏳ |
| 充值页面 | 进入页面 | 提示"请先登录" | ⏳ |
| 交易记录 | 进入页面 | 提示"请先登录" | ⏳ |
| 个人中心 | 查看统计 | 提示"请先登录" | ⏳ |
| 支付测试 | 创建订单 | 提示"请先登录" | ⏳ |

---

### 场景B: 已登录状态

#### 测试步骤
1. 确保已登录
   ```javascript
   // 在微信开发者工具控制台执行
   getApp().globalData.userId
   // 应该返回数字，如: 1
   ```

2. 测试各个功能

| 功能 | 操作 | 预期结果 | 状态 |
|------|------|---------|------|
| 钱包余额 | 进入钱包页面 | 显示正确余额 | ⏳ |
| 最近交易 | 查看钱包页面 | 显示最近5条交易 | ⏳ |
| 充值余额 | 进入充值页面 | 显示当前余额 | ⏳ |
| 创建充值 | 选择金额充值 | 成功创建订单 | ⏳ |
| 交易列表 | 查看交易记录 | 显示完整列表 | ⏳ |
| 交易筛选 | 切换收入/支出 | 筛选正常工作 | ⏳ |
| 用户统计 | 查看个人中心 | 显示正确统计 | ⏳ |

---

## 控制台检查

### 检查点
```javascript
// 1. 查看用户ID
getApp().globalData.userId
// 预期: 返回数字（已登录）或 undefined（未登录）

// 2. 查看API基础URL
getApp().globalData.apiBaseUrl
// 预期: https://xx.aieo.cn

// 3. 查看完整配置
getApp().globalData
// 预期: 包含 userId, apiBaseUrl, token 等
```

### 日志检查
- [ ] 无 "临时用户ID" 相关日志
- [ ] 未登录时有 "用户未登录" 日志
- [ ] API请求使用正确的用户ID

---

## 网络请求检查

打开 Network 标签，检查以下请求：

| 请求 | URL | 参数 | 预期 |
|------|-----|------|------|
| 钱包信息 | `/api/payment/wallet/{userId}` | userId 为实际用户ID | 200 OK |
| 交易记录 | `/api/payment/transactions/{userId}` | userId 为实际用户ID | 200 OK |
| 创建充值 | `/api/payment/recharge/create` | body.userId 为实际用户ID | 200 OK |

---

## 边界情况测试

### 1. 登录后立即访问
- [ ] 钱包页面正常加载
- [ ] 交易记录正常显示

### 2. 登出后访问
- [ ] 显示"请先登录"提示
- [ ] 不会发起API请求

### 3. 切换用户
- [ ] 显示新用户的数据
- [ ] 不会显示旧用户的数据

---

## 回归测试

确保修改没有影响其他功能：

| 功能 | 状态 |
|------|------|
| 门店列表 | ⏳ |
| 房间列表 | ⏳ |
| 订单列表 | ⏳ |
| 用户信息 | ⏳ |
| 微信登录 | ⏳ |

---

## 性能检查

- [ ] 页面加载速度正常
- [ ] 无多余的API请求
- [ ] 无内存泄漏

---

## 兼容性测试

### 设备测试
- [ ] iOS 真机
- [ ] Android 真机
- [ ] 开发者工具

### 网络环境
- [ ] WiFi
- [ ] 4G/5G
- [ ] 弱网环境

---

## 问题排查

### 如果钱包页面无数据

1. **检查用户ID**
   ```javascript
   console.log('用户ID:', getApp().globalData.userId);
   ```

2. **检查API请求**
   - 打开 Network 标签
   - 查看 `/api/payment/wallet/` 请求
   - 检查状态码和响应

3. **检查后端服务**
   ```bash
   curl https://xx.aieo.cn/api/payment/wallet/1
   ```

### 如果交易记录无数据

1. **检查API路径**
   - 应该是 `/api/payment/transactions/{userId}`
   - 不是 `/payment/transactions/{userId}`

2. **检查数据库**
   ```sql
   SELECT * FROM wallet_transactions WHERE user_id = 1;
   ```

### 如果充值失败

1. **检查用户ID是否传递**
   ```javascript
   // 在 createRechargeOrder 中添加日志
   console.log('创建订单，用户ID:', app.globalData.userId);
   ```

2. **检查请求数据**
   - 打开 Network 标签
   - 查看 `/api/payment/recharge/create` 请求
   - 检查 body 中的 userId

---

## 上线前检查清单

- [ ] 所有测试用例通过
- [ ] 控制台无错误
- [ ] 网络请求正常
- [ ] 真机测试通过
- [ ] 代码已提交
- [ ] 版本号已更新

---

## 上线信息

**版本号**: 1.0.6

**更新内容**:
- 移除所有临时用户ID
- 优化登录状态检查
- 修复钱包和交易记录数据获取问题
- 改进错误提示

**测试人员**: _______

**测试日期**: _______

**测试结果**: ⏳ 待测试

---

## 快速命令

```bash
# 验证代码修复
node verify-userid-fix.js

# 测试钱包API
node test-wallet-page.js

# 测试交易记录API
node test-transaction-api.js
```

---

**备注**: 
- ✅ = 通过
- ❌ = 失败
- ⏳ = 待测试
- ⚠️ = 有问题但不影响功能
