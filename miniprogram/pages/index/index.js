// pages/index/index.js
const app = getApp();
const { storeApi } = require('../../utils/api.js');

Page({
  data: {
    userInfo: null,
    nearbyStores: [],
    banners: [
      {
        id: 1,
        image: '/images/banner1.jpg',
        title: '专业扑克房 - 德州扑克等你来战',
        subtitle: '环境优雅 · 设施齐全 · 24小时营业'
      },
      {
        id: 2,
        image: '/images/banner2.jpg',
        title: '智能麻将馆 - 无人值守新体验',
        subtitle: '扫码开门 · 自助结算 · 安全便捷'
      }
    ],
    quickActions: [
      {
        icon: '/images/icon-book.png',
        title: '立即预订',
        action: 'quickBook'
      },
      {
        icon: '/images/icon-unlock.png',
        title: '扫码开门',
        action: 'scanUnlock'
      },
      {
        icon: '/images/icon-member.png',
        title: '会员中心',
        action: 'memberCenter'
      },
      {
        icon: '/images/icon-service.png',
        title: '客服咨询',
        action: 'customerService'
      }
    ]
  },

  onLoad() {
    console.log('首页加载');
    // 延迟加载，避免阻塞
    setTimeout(() => {
      this.loadNearbyStores();
    }, 1000);
  },

  onShow() {
    console.log('首页显示');
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
  },

  // 检查登录状态
  checkLogin() {
    if (!app.globalData.token) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
  },

  // 加载附近门店
  loadNearbyStores() {
    // 使用API获取门店数据
    storeApi.getStores().then(response => {
      let stores = response.data || [];
      
      // 只取前3个门店作为附近门店
      stores = stores.slice(0, 3).map(store => {
        // 处理图片路径
        if (store.images && typeof store.images === 'string') {
          store.images = [store.images];
        } else if (!store.images) {
          store.images = ['/images/default-store.jpg'];
        }
        
        // 设置默认距离
        store.distance = store.distance || '1.2km';
        
        return store;
      });

      this.setData({
        nearbyStores: stores
      });
    }).catch(error => {
      console.error('加载附近门店失败:', error);
      // 如果API失败，使用默认数据
      this.setData({
        nearbyStores: []
      });
    });
  },

  // 快捷操作
  onQuickAction(e) {
    const action = e.currentTarget.dataset.action;
    
    switch (action) {
      case 'quickBook':
        wx.switchTab({
          url: '/pages/stores/stores'
        });
        break;
      case 'scanUnlock':
        this.scanUnlock();
        break;
      case 'memberCenter':
        wx.navigateTo({
          url: '/pages/member/member'
        });
        break;
      case 'customerService':
        wx.makePhoneCall({
          phoneNumber: '400-123-4567'
        });
        break;
    }
  },

  // 扫码开门
  scanUnlock() {
    wx.scanCode({
      success: (res) => {
        // 解析二维码内容
        try {
          const qrData = JSON.parse(res.result);
          if (qrData.type === 'unlock' && qrData.orderId) {
            wx.navigateTo({
              url: `/pages/unlock/unlock?orderId=${qrData.orderId}`
            });
          } else {
            wx.showToast({
              title: '无效的二维码',
              icon: 'none'
            });
          }
        } catch (e) {
          wx.showToast({
            title: '二维码格式错误',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        });
      }
    });
  },

  // 查看门店详情
  onStoreDetail(e) {
    const storeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/store-detail/store-detail?id=${storeId}`
    });
  },

  // 查看更多门店
  onMoreStores() {
    wx.switchTab({
      url: '/pages/stores/stores'
    });
  },

  // 轮播图点击
  onBannerTap(e) {
    const banner = e.currentTarget.dataset.banner;
    console.log('点击轮播图:', banner);
  }
});