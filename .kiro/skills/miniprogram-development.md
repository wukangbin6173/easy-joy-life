---
name: "WeChat MiniProgram Development"
description: "Complete WeChat MiniProgram development knowledge and best practices"
tags: ["wechat", "miniprogram", "frontend", "javascript", "wxss"]
version: "1.0.0"
---

# 微信小程序开发技能

## 项目结构

### 基础文件
- `app.js`: 小程序入口文件
- `app.json`: 全局配置文件
- `app.wxss`: 全局样式文件
- `sitemap.json`: 搜索优化配置

### 页面结构
每个页面包含4个文件:
- `.js`: 页面逻辑
- `.wxml`: 页面结构
- `.wxss`: 页面样式
- `.json`: 页面配置

## 核心API

### 网络请求
```javascript
wx.request({
  url: 'https://api.example.com',
  method: 'POST',
  data: { key: 'value' },
  success: (res) => console.log(res),
  fail: (error) => console.error(error)
});
```

### 本地存储
```javascript
// 同步存储
wx.setStorageSync('key', 'value');
const value = wx.getStorageSync('key');

// 异步存储
wx.setStorage({
  key: 'key',
  data: 'value'
});
```

### 页面跳转
```javascript
// 保留当前页面
wx.navigateTo({ url: '/pages/detail/detail' });

// 关闭当前页面
wx.redirectTo({ url: '/pages/index/index' });

// 返回上一页
wx.navigateBack({ delta: 1 });
```

## 支付功能

### 微信支付
```javascript
wx.requestPayment({
  timeStamp: '',
  nonceStr: '',
  package: '',
  signType: 'RSA',
  paySign: '',
  success: () => {
    wx.showToast({ title: '支付成功' });
  },
  fail: () => {
    wx.showToast({ title: '支付失败', icon: 'none' });
  }
});
```

### 登录授权
```javascript
wx.login({
  success: (res) => {
    if (res.code) {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
    }
  }
});
```

## 组件开发

### 自定义组件
```javascript
Component({
  properties: {
    title: String,
    content: String
  },
  data: {
    show: false
  },
  methods: {
    toggle() {
      this.setData({ show: !this.data.show });
    }
  }
});
```

### 组件通信
```javascript
// 父组件调用子组件方法
this.selectComponent('#myComponent').toggle();

// 子组件触发父组件事件
this.triggerEvent('myevent', { data: 'value' });
```

## 样式开发

### WXSS特性
- 支持大部分CSS特性
- 新增尺寸单位 rpx (responsive pixel)
- 全局样式和局部样式

### 响应式设计
```css
/* 使用rpx实现响应式 */
.container {
  width: 750rpx; /* 屏幕宽度 */
  padding: 20rpx;
}

/* 媒体查询 */
@media (max-width: 600px) {
  .container {
    padding: 10rpx;
  }
}
```

## 性能优化

### 代码优化
1. **按需加载**: 使用分包加载
2. **图片优化**: 压缩图片，使用webp格式
3. **请求优化**: 合并请求，使用缓存
4. **渲染优化**: 避免频繁setData

### 分包配置
```json
{
  "pages": ["pages/index/index"],
  "subPackages": [{
    "root": "packageA",
    "pages": ["pages/cat/cat"]
  }]
}
```

## 调试技巧

### 开发者工具
- Console面板: 查看日志和错误
- Network面板: 监控网络请求
- Storage面板: 查看本地存储
- Sensor面板: 模拟传感器数据

### 真机调试
```javascript
// 开启调试模式
console.log('Debug info:', data);

// 性能监控
const start = Date.now();
// 执行代码
console.log('执行时间:', Date.now() - start);
```

## 发布流程

### 版本管理
1. 开发版本: 开发者工具上传
2. 体验版本: 提交审核前测试
3. 审核版本: 提交微信审核
4. 线上版本: 审核通过后发布

### 审核要点
- 功能完整性
- 用户体验
- 内容合规性
- 技术规范性

## 常见问题

### 网络请求失败
- 检查域名是否在白名单
- 确认使用HTTPS协议
- 验证请求参数格式

### 支付失败
- 检查商户配置
- 验证签名算法
- 确认回调地址

### 页面白屏
- 检查页面路径
- 验证数据绑定
- 查看控制台错误