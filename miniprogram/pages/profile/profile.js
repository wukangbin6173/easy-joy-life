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
    // 模拟用户数据
    const userInfo = {
      isLogin: true,
      nickname: '棋牌爱好者',
      avatar: '/images/default-avatar.png',
      phone: '138****8888',
      isVip: true
    };

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
      userInfo: userInfo,
      stats: stats,
      wallet: wallet,
      coupons: coupons
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
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
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