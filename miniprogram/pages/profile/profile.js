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
    // 检查登录状态
    if (!app.isLoggedIn()) {
      this.setData({
        userInfo: {
          isLogin: false,
          nickname: '未登录',
          avatar: '/images/default-avatar.png',
          phone: '点击登录',
          isVip: false
        }
      });
      return;
    }

    // 获取用户信息
    const userInfo = app.getUserInfo();
    if (userInfo) {
      this.setData({
        userInfo: {
          isLogin: true,
          nickname: userInfo.nickname || '棋牌爱好者',
          avatar: userInfo.avatar || '/images/default-avatar.png',
          phone: userInfo.phone || '未绑定手机',
          isVip: false // 可以根据用户等级判断
        }
      });

      // 加载用户统计数据
      this.loadUserStats();
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

  // 点击头像区域登录
  onAvatarTap: function() {
    if (!this.data.userInfo.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
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