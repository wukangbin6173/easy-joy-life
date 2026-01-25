// pages/login/login.js
const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loading: false
  },

  onLoad() {
    // 检查是否已经登录
    if (app.isLoggedIn()) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 微信登录
  onWechatLogin() {
    this.setData({ loading: true });
    
    app.wechatLogin().then(userInfo => {
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      console.log('登录成功，用户信息:', userInfo);
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
    }).catch(err => {
      console.error('登录失败:', err);
      wx.showToast({
        title: err.message || '登录失败',
        icon: 'none'
      });
    }).finally(() => {
      this.setData({ loading: false });
    });
  },

  // 兼容旧版本的getUserInfo授权方式
  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      this.onWechatLogin();
    } else {
      wx.showToast({
        title: '需要授权才能使用',
        icon: 'none'
      });
    }
  }
});