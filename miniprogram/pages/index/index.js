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
    ],
    showUserCard: true // 始终显示用户卡片
  },

  onLoad() {
    console.log('首页加载');
    // 获取用户信息
    this.getUserInfo();
    // 延迟加载，避免阻塞
    setTimeout(() => {
      this.loadNearbyStores();
    }, 1000);
  },

  onShow() {
    console.log('首页显示');
    // 刷新用户信息
    this.getUserInfo();
  },

  // 获取用户信息
  getUserInfo() {
    try {
      const app = getApp();
      console.log('=== 开始获取用户信息 ===');
      console.log('app 实例:', app ? '存在' : '不存在');
      
      if (app && app.globalData) {
        console.log('app.globalData:', app.globalData);
        console.log('全局用户信息app.globalData.userInfo:', app.globalData.userInfo);
        
        if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo
          });
          console.log('✓ 用户信息已加载:', app.globalData.userInfo);
        } else {
          console.log('⚠ app.globalData.userInfo 为空，尝试从缓存获取');
          
          // 尝试从缓存获取
          const cachedUserInfo = wx.getStorageSync('userInfo');
          //cachedUserInfo = null //先暂时不使用缓存数据
          if (false) {
            console.log('✓ 从缓存获取到用户信息:', cachedUserInfo);
            this.setData({
              userInfo: cachedUserInfo
            });
          } else {
            console.log('⚠ 缓存中也没有用户信息，设置默认信息');
            // 设置默认用户信息，让卡片显示出来
            this.setData({
              userInfo: {
                nickname: '微信用户',
                avatar: '/images/default-avatar.png'
              }
            });
          }
        }
      } else {
        console.log('❌ app 或 app.globalData 不存在');
        // 设置默认用户信息
        this.setData({
          userInfo: {
            nickname: '微信用户',
            avatar: '/images/default-avatar.png'
          }
        });
      }
      
      console.log('=== 用户信息获取完成 ===');
      console.log('当前 userInfo:', this.data.userInfo);
    } catch (e) {
      console.error('❌ 获取用户信息失败:', e);
      // 设置默认用户信息
      this.setData({
        userInfo: {
          nickname: '微信用户',
          avatar: '/images/default-avatar.png'
        }
      });
    }
  },

  // 检查登录状态
  checkLogin() {
    try {
      const app = getApp();
      if (!app || !app.globalData || !app.globalData.token) {
        wx.navigateTo({
          url: '/pages/login/login'
        });
      } else {
        this.setData({
          userInfo: app.globalData.userInfo
        });
      }
    } catch (e) {
      console.error('检查登录状态失败:', e);
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
  },

  // 加载附近门店
  loadNearbyStores() {
    console.log('开始加载附近门店...');
    
    // 使用API获取门店数据
    storeApi.getStores().then(response => {
      console.log('门店API响应:', response);
      
      let stores = response.data || [];
      
      // 只取前3个门店作为附近门店
      stores = stores.slice(0, 3).map(store => {
        // 处理图片路径
        if (store.image && typeof store.image === 'string') {
          store.images = [store.image];
        } else if (!store.images) {
          store.images = ['/images/default-store.jpg'];
        }
        
        // 设置默认距离
        store.distance = store.distance || '1.2km';
        
        return store;
      });

      console.log('处理后的门店数据:', stores);
      
      this.setData({
        nearbyStores: stores
      });
      
      console.log('附近门店加载成功，数量:', stores.length);
    }).catch(error => {
      console.error('加载附近门店失败:', error);
      wx.showToast({
        title: '加载门店失败',
        icon: 'none'
      });
      
      // 如果API失败，使用空数据
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
  },

  // 跳转到完善个人信息页面
  goToCompleteProfile() {
    wx.navigateTo({
      url: '/pages/user-profile/user-profile'
    });
  }
});