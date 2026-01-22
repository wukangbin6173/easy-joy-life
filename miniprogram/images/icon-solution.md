# 图标解决方案

## 问题
微信小程序需要PNG格式的图标文件，但当前缺少以下图标：
- home.png / home-active.png
- store.png / store-active.png  
- order.png / order-active.png
- profile.png / profile-active.png

## 临时解决方案

### 方案1: 使用iconfont图标字体
修改app.json，使用字体图标代替图片：

```json
"tabBar": {
  "custom": true,
  "list": [...]
}
```

### 方案2: 下载现成图标
推荐网站：
1. iconfont.cn (阿里巴巴矢量图标库)
2. iconpark.oceanengine.com (字节跳动图标库)
3. www.iconfinder.com

搜索关键词：
- home, house (首页)
- location, store (门店)  
- order, list (订单)
- user, profile (个人)

### 方案3: 在线生成
使用在线工具生成简单图标：
1. 访问 https://www.canva.com/
2. 创建48x48px的图标
3. 下载PNG格式

## 快速修复
我将创建一个临时的文本版本来避免编译错误。