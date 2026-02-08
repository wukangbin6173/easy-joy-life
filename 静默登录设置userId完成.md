# 静默登录设置 userId 完成

## 问题描述
小程序启动后，很多页面提示"用户未登录，无法加载用户统计"，因为之前的静默登录只设置了 `openid`，没有设置 `userId`。

## 问题原因
1. `app.js` 中的静默登录只保存了 `openid`，没有保存 `userId`
2. 修改后的页面代码都使用 `app.globalData.userId` 来获取用户ID
3. 导致 `userId` 为 `undefined`，触发"用户未登录"的检查

## 解决方案

### 1. 修改 globalData 定义
添加 `userId` 和 `apiBaseUrl` 字段：

```javascript
globalData: {
  userInfo: null,
  baseUrl: '',
  apiBaseUrl: '',  // 新增
  token: null,
  openid: null,
  sessionKey: null,
  userId: null     // 新增
}
```

### 2. 修改 onLaunch 方法
同时设置 `baseUrl` 和 `apiBaseUrl`：

```javascript
onLaunch() {
  const envConfig = config.getCurrentConfig();
  this.globalData.baseUrl = envConfig.baseUrl;
  this.globalData.apiBaseUrl = envConfig.baseUrl; // 新增
  
  this.autoSilentLogin();
}
```

### 3. 修改静默登录逻辑
在 `autoSilentLogin()` 方法中保存 `userId`：

**修改前：**
```javascript
if (res.success && res.openid) {
  const { openid, sessionKey, user } = res;
  
  this.globalData.openid = openid;
  this.globalData.sessionKey = sessionKey;
  this.globalData.userInfo = user;
  
  wx.setStorageSync('openid', openid);
  wx.setStorageSync('sessionKey', sessionKey);
  wx.setStorageSync('userInfo', user);
}
```

**修改后：**
```javascript
if (res.success && res.openid && res.user) {
  const { openid, sessionKey, user } = res;
  
  this.globalData.openid = openid;
  this.globalData.sessionKey = sessionKey;
  this.globalData.userId = user.id;  // 新增
  this.globalData.userInfo = user;
  
  wx.setStorageSync('openid', openid);
  wx.setStorageSync('sessionKey', sessionKey);
  wx.setStorageSync('userId', user.id);  // 新增
  wx.setStorageSync('userInfo', user);
  
  console.log('✅ 静默登录成功！');
  console.log('用户ID:', user.id);
}
```

### 4. 修改缓存恢复逻辑
从缓存恢复时也要恢复 `userId`：

**修改前：**
```javascript
const cachedOpenid = wx.getStorageSync('openid');
const cachedUserInfo = wx.getStorageSync('userInfo');

if (cachedOpenid && cachedUserInfo) {
  this.globalData.openid = cachedOpenid;
  this.globalData.userInfo = cachedUserInfo;
  return;
}
```

**修改后：**
```javascript
const cachedOpenid = wx.getStorageSync('openid');
const cachedUserId = wx.getStorageSync('userId');
const cachedUserInfo = wx.getStorageSync('userInfo');

if (cachedOpenid && cachedUserId && cachedUserInfo) {
  this.globalData.openid = cachedOpenid;
  this.globalData.userId = cachedUserId;  // 新增
  this.globalData.userInfo = cachedUserInfo;
  console.log('从缓存恢复登录状态');
  console.log('用户ID:', cachedUserId);
  return;
}
```

### 5. 修改其他登录方法
在 `loginWithCode()` 和 `retryCreateUser()` 中也设置 `userId`。

### 6. 修改退出登录
清除 `userId` 缓存：

```javascript
logout() {
  this.globalData.openid = null;
  this.globalData.sessionKey = null;
  this.globalData.userId = null;  // 新增
  this.globalData.userInfo = null;
  
  wx.removeStorageSync('openid');
  wx.removeStorageSync('sessionKey');
  wx.removeStorageSync('userId');  // 新增
  wx.removeStorageSync('userInfo');
}
```

## 后端接口返回数据

微信登录接口 `/api/auth/wechat/login` 返回：

```json
{
  "success": true,
  "openid": "oXXXX...",
  "sessionKey": "xxx...",
  "user": {
    "id": 1,
    "openid": "oXXXX...",
    "nickname": "微信用户",
    "avatar": "/images/default-avatar.png",
    "phone": "",
    "status": "ACTIVE",
    "isLogin": true
  }
}
```

关键字段：`user.id` - 这就是我们需要的 `userId`

## 数据流程

### 首次启动
1. 小程序启动 → `onLaunch()`
2. 调用 `autoSilentLogin()`
3. 获取微信 code
4. 调用后端 `/api/auth/wechat/login`
5. 后端返回 `openid` 和 `user.id`
6. 保存到 `globalData` 和本地缓存
7. 页面可以使用 `app.globalData.userId`

### 再次启动
1. 小程序启动 → `onLaunch()`
2. 调用 `autoSilentLogin()`
3. 检查缓存，发现有 `userId`
4. 直接从缓存恢复，无需请求后端
5. 页面可以使用 `app.globalData.userId`

## 测试验证

### 1. 清除缓存测试
```javascript
// 在微信开发者工具控制台执行
wx.clearStorageSync();
// 然后重新编译小程序
```

**预期结果**：
- 控制台显示"开始自动静默登录..."
- 显示"✅ 静默登录成功！"
- 显示"用户ID: 1"（或其他数字）
- 页面正常加载数据，不再提示"用户未登录"

### 2. 查看登录状态
```javascript
// 在控制台执行
const app = getApp();
console.log('用户ID:', app.globalData.userId);
console.log('OpenId:', app.globalData.openid);
console.log('用户信息:', app.globalData.userInfo);
```

**预期结果**：
```
用户ID: 1
OpenId: oXXXX...
用户信息: {id: 1, nickname: "微信用户", ...}
```

### 3. 测试各个页面
| 页面 | 功能 | 预期结果 |
|------|------|---------|
| 钱包页面 | 加载钱包信息 | ✅ 正常显示余额 |
| 钱包页面 | 加载交易记录 | ✅ 显示最近5条 |
| 充值页面 | 加载当前余额 | ✅ 正常显示 |
| 交易记录 | 加载完整列表 | ✅ 正常显示 |
| 个人中心 | 加载用户统计 | ✅ 正常显示 |

### 4. 控制台日志检查
启动时应该看到：
```
小程序启动
API地址: https://xx.aieo.cn
开始自动静默登录...
获取微信登录code成功: 071xxx...
微信登录API响应: {success: true, openid: "oXXX...", user: {...}}
========================================
✅ 静默登录成功！
OpenId: oXXX...
用户ID: 1
用户昵称: 微信用户
========================================
```

## 常见问题

### Q1: 还是提示"用户未登录"
**检查步骤**：
1. 查看控制台是否有"静默登录成功"
2. 检查 `app.globalData.userId` 是否有值
3. 清除缓存后重新启动

```javascript
// 检查命令
getApp().globalData.userId
```

### Q2: 静默登录失败
**可能原因**：
1. 网络问题
2. 后端服务未启动
3. AppId 或 AppSecret 配置错误

**解决方法**：
```bash
# 检查后端服务
curl https://xx.aieo.cn/api/health

# 查看后端日志
tail -f backend/logs/spring.log
```

### Q3: userId 为 undefined
**检查步骤**：
1. 查看后端返回的数据结构
2. 确认 `res.user.id` 存在
3. 检查是否正确保存到 globalData

```javascript
// 在 autoSilentLogin 的 then 中添加日志
console.log('后端返回的user:', res.user);
console.log('user.id:', res.user.id);
```

## 优化建议

### 1. 添加登录状态检查方法
```javascript
// 在 app.js 中添加
isUserLoggedIn() {
  return !!(this.globalData.userId && this.globalData.openid);
}

getUserId() {
  return this.globalData.userId;
}
```

### 2. 页面中使用
```javascript
onLoad() {
  const app = getApp();
  
  if (!app.isUserLoggedIn()) {
    wx.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }
  
  const userId = app.getUserId();
  this.loadData(userId);
}
```

### 3. 自动重试机制
如果静默登录失败，可以添加重试逻辑：

```javascript
autoSilentLogin(retryCount = 0) {
  // ... 登录逻辑 ...
  
  .catch(err => {
    if (retryCount < 3) {
      console.log(`登录失败，${retryCount + 1}秒后重试...`);
      setTimeout(() => {
        this.autoSilentLogin(retryCount + 1);
      }, (retryCount + 1) * 1000);
    } else {
      console.error('登录失败，已达到最大重试次数');
      this.setDefaultUserInfo();
    }
  });
}
```

## 总结

✅ **修复完成**

- 在 `globalData` 中添加了 `userId` 字段
- 静默登录时保存 `userId` 到内存和缓存
- 从缓存恢复时也恢复 `userId`
- 所有登录相关方法都正确设置 `userId`
- 退出登录时清除 `userId`

**效果**：
- 小程序启动时自动静默登录
- 自动获取并保存 `userId`
- 所有页面可以正常使用 `app.globalData.userId`
- 不再提示"用户未登录"

**下一步**：
1. 清除小程序缓存
2. 重新编译小程序
3. 查看控制台确认静默登录成功
4. 测试各个页面功能
