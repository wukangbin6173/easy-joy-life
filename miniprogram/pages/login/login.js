// pages/login/login.js
const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loading: false
  },

  onLoad() {
    // 检查是否已经有详细的用户信息
    const app = getApp();
    this.onWechatLogin() ;
    if (app.globalData.userInfo && app.globalData.userInfo.nickname !== '微信用户') {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 微信登录（跳转到用户信息完善页面）
  onWechatLogin() {
    wx.navigateTo({
      url: '/pages/user-profile/user-profile'
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