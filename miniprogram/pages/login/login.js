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
    if (app.globalData.userInfo && app.globalData.userInfo.nickname !== '微信用户') {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 微信登录（获取详细用户信息）
  onWechatLogin() {
    this.setData({ loading: true });
    
    // 获取用户详细信息
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        const app = getApp();
        const userInfo = {
          ...app.globalData.userInfo,
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          gender: res.userInfo.gender,
          isLogin: true
        };
        
        // 更新app中的用户信息
        app.globalData.userInfo = userInfo;
        wx.setStorageSync('userInfo', userInfo);
        
        // 更新后端用户信息
        app.updateUserInfoToBackend(userInfo);
        
        wx.showToast({
          title: '信息完善成功',
          icon: 'success'
        });
        
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err);
        wx.showToast({
          title: '需要授权才能完善信息',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ loading: false });
      }
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