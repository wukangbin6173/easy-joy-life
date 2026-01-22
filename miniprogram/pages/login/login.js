// pages/login/login.js
const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loading: false
  },

  onLoad() {
    // 检查是否已经登录
    if (app.globalData.token) {
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
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
    }).catch(err => {
      wx.showToast({
        title: err.message || '登录失败',
        icon: 'none'
      });
    }).finally(() => {
      this.setData({ loading: false });
    });
  },

  // 获取用户信息授权
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