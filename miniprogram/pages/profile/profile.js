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
          isLogin: !!app.globalData.openid, // 有openid就算登录
          nickname: appUserInfo.nickname || '微信用户',
          avatar: appUserInfo.avatar || '/images/default-avatar.png',
          phone: appUserInfo.phone || '未绑定手机',
          isVip: false
        }
      });

      // 如果已登录，加载用户统计数据
      if (app.globalData.openid) {
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
            'userInfo.avatar': retryUserInfo.avatar,
            'userInfo.isLogin': !!app.globalData.openid
          });
        }
      }, 1000);
    }
  },

  loadUserStats: function() {
    const app = getApp();
    const baseUrl = app.globalData.baseUrl;
    const userId = app.globalData.userId;
    
    if (!userId) {
      console.log('用户未登录，无法加载用户统计');
      return;
    }
    
    // 获取钱包余额
    const { request } = require('../../utils/api.js');
    request(`/api/wallet/${userId}`).then(res => {
      if (res.success) {
        this.setData({
          wallet: { balance: res.wallet ? res.wallet.balance : 0 }
        });
      }
    }).catch(err => {
      console.error('加载钱包数据失败:', err);
      this.setData({ wallet: { balance: 0 } });
    });
    
    // 暂时使用模拟数据
    const stats = {
      totalOrders: 15,
      totalHours: 48,
      totalAmount: 2400
    };

    const coupons = {
      available: 3
    };

    this.setData({
      stats: stats,
      coupons: coupons
    });
  },

  // 点击头像区域完善信息
  onAvatarTap: function() {
    wx.navigateTo({
      url: '/pages/user-profile/user-profile'
    });
  },

  goToOrders: function() {
    wx.switchTab({
      url: '/pages/orders/orders'
    });
  },

  goToFavorites: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  goToCoupons: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  goToWallet: function() {
    wx.navigateTo({
      url: '/pages/wallet/wallet'
    });
  },

  goToAddress: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  goToSettings: function() {
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
    const app = getApp();
    if (!app.globalData.openid) return;
    
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
          
          this.setData({
            userInfo: {
              isLogin: false,
              nickname: '微信用户',
              avatar: '/images/default-avatar.png',
              phone: '点击完善信息',
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
  }
});