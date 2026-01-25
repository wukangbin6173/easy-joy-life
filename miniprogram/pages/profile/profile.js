// pages/profile/profile.js
const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    userInfo: {
      isLogin: false,
      nickname: '',
      avatar: '',
      phone: '',
      isVip: false
    },
    stats: {
      totalOrders: 0,
      totalHours: 0,
      totalAmount: 0
    },
    wallet: {
      balance: 0
    },
    coupons: {
      available: 0
    }
  },

  onLoad: function() {
    this.loadUserInfo();
  },

  onShow: function() {
    this.loadUserInfo();
  },

  loadUserInfo: function() {
    // 获取app中的用户信息
    const app = getApp();
    const appUserInfo = app.getUserInfo();
    
    if (appUserInfo) {
      // 有用户信息，显示头像和昵称
      this.setData({
        userInfo: {
          isLogin: appUserInfo.isLogin || false,
          nickname: appUserInfo.nickname || '微信用户',
          avatar: appUserInfo.avatar || '/images/default-avatar.png',
          phone: appUserInfo.phone || '未绑定手机',
          isVip: false
        }
      });

      // 如果已完整登录，加载用户统计数据
      if (appUserInfo.isLogin) {
        this.loadUserStats();
      }
    } else {
      // 没有用户信息，设置默认信息并等待app获取
      this.setData({
        userInfo: {
          isLogin: false,
          nickname: '微信用户',
          avatar: '/images/default-avatar.png',
          phone: '点击完善信息',
          isVip: false
        }
      });

      // 延迟重试获取用户信息
      setTimeout(() => {
        const retryUserInfo = app.getUserInfo();
        if (retryUserInfo && retryUserInfo.nickname !== '微信用户') {
          this.setData({
            'userInfo.nickname': retryUserInfo.nickname,
            'userInfo.avatar': retryUserInfo.avatar
          });
        }
      }, 1000);
    }
  },

  loadUserStats: function() {
    // 这里可以调用API获取用户统计数据
    // 暂时使用模拟数据
    const stats = {
      totalOrders: 15,
      totalHours: 48,
      totalAmount: 2400
    };

    const wallet = {
      balance: 168.50
    };

    const coupons = {
      available: 3
    };

    this.setData({
      stats: stats,
      wallet: wallet,
      coupons: coupons
    });
  },

  // 点击头像区域完善信息
  onAvatarTap: function() {
    const app = getApp();
    if (!app.isLoggedIn()) {
      wx.showModal({
        title: '完善个人信息',
        content: '是否要完善个人信息以使用更多功能？',
        confirmText: '去完善',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            });
          }
        }
      });
    }
  },

  goToOrders: function() {
    if (!this.checkLogin()) return;
    wx.switchTab({
      url: '/pages/orders/orders'
    });
  },

  goToFavorites: function() {
    if (!this.checkLogin()) return;
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  goToCoupons: function() {
    if (!this.checkLogin()) return;
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  goToWallet: function() {
    if (!this.checkLogin()) return;
    wx.navigateTo({
      url: '/pages/wallet/wallet'
    });
  },

  goToAddress: function() {
    if (!this.checkLogin()) return;
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  goToSettings: function() {
    if (!this.checkLogin()) return;
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  goToHelp: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  contactService: function() {
    wx.showModal({
      title: '联系客服',
      content: '客服电话：400-123-4567\n工作时间：9:00-22:00\n\n微信客服：qiusheng_service',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  logout: function() {
    if (!this.data.userInfo.isLogin) return;
    
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
          
          this.setData({
            userInfo: {
              isLogin: false,
              nickname: '未登录',
              avatar: '/images/default-avatar.png',
              phone: '点击登录',
              isVip: false
            },
            stats: {
              totalOrders: 0,
              totalHours: 0,
              totalAmount: 0
            },
            wallet: {
              balance: 0
            },
            coupons: {
              available: 0
            }
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 检查登录状态
  checkLogin: function() {
    if (!app.isLoggedIn()) {
      wx.showModal({
        title: '请先登录',
        content: '使用此功能需要先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            });
          }
        }
      });
      return false;
    }
    return true;
  }
});