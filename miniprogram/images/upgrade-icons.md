# 图标升级指南

## 当前状态
已创建所有必需的占位图标文件（1x1像素透明PNG），小程序可以正常编译运行。

## 推荐的图标资源

### 1. 免费图标库
- **Iconfont (阿里巴巴)**: https://www.iconfont.cn/
  - 搜索: 首页、门店、订单、个人中心
  - 下载48x48px PNG格式
  
- **IconPark (字节跳动)**: https://iconpark.oceanengine.com/
  - 高质量图标，支持多种格式
  
### 2. 需要的图标清单

#### TabBar图标 (必需)
- `home.png` + `home-active.png` - 首页图标
- `store.png` + `store-active.png` - 门店图标  
- `order.png` + `order-active.png` - 订单图标
- `profile.png` + `profile-active.png` - 个人中心图标

#### 功能图标 (可选优化)
- `default-avatar.png` - 默认头像
- `default-store.png` - 默认门店图片
- `smart-lock.png` - 智能锁图标
- `password-icon.png` - 密码图标
- `bluetooth-icon.png` - 蓝牙图标
- `qr-icon.png` - 二维码图标
- `success-icon.png` - 成功图标
- `error-icon.png` - 错误图标

### 3. 图标规范
- **尺寸**: 48x48px (TabBar图标)
- **格式**: PNG
- **背景**: 透明
- **颜色**: 
  - 普通状态: #666666 (灰色)
  - 选中状态: #1890ff (蓝色)

### 4. 快速替换
1. 下载新图标到 `miniprogram/images/` 目录
2. 保持文件名不变
3. 重新编译小程序即可

## 在线图标生成工具
如果需要快速生成简单图标：
1. https://www.canva.com/ - 在线设计工具
2. https://icon-icons.com/ - 图标搜索下载
3. https://www.flaticon.com/ - 扁平化图标库