// pages/stores/stores.js
const app = getApp();
const { storeApi } = require('../../utils/api.js');

Page({
  data: {
    stores: [],
    loading: true,
    searchKeyword: '',
    currentLocation: null,
    showLocationAuth: false
  },

  onLoad() {
    // 直接加载门店，不获取位置
    this.loadStores();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadStores();
  },

  // 获取位置信息
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          currentLocation: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        });
        this.loadStores();
      },
      fail: () => {
        this.setData({
          showLocationAuth: true
        });
        this.loadStores();
      }
    });
  },

  // 授权位置
  onLocationAuth() {
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          this.setData({
            showLocationAuth: false
          });
          this.getLocation();
        }
      }
    });
  },

  // 加载门店列表
  loadStores() {
    this.setData({ loading: true });

    // 使用API获取门店数据
    const apiCall = this.data.searchKeyword ? 
      storeApi.searchStores(this.data.searchKeyword) : 
      storeApi.getStores();

    apiCall.then(response => {
      let stores = response.data || [];
      
      // 处理图片路径，确保是数组格式
      stores = stores.map(store => {
        if (store.images && typeof store.images === 'string') {
          store.images = [store.images];
        } else if (!store.images) {
          store.images = ['/images/default-store.jpg'];
        }
        
        // 计算距离（如果有位置信息）
        if (this.data.currentLocation && store.longitude && store.latitude) {
          const distance = this.calculateDistance(
            this.data.currentLocation.latitude,
            this.data.currentLocation.longitude,
            parseFloat(store.latitude),
            parseFloat(store.longitude)
          );
          store.distance = this.formatDistance(distance);
        } else {
          store.distance = '未知';
        }
        
        return store;
      });

      this.setData({
        stores: stores,
        loading: false
      });
    }).catch(error => {
      console.error('加载门店失败:', error);
      wx.showToast({
        title: '加载门店失败',
        icon: 'none'
      });
      this.setData({
        loading: false
      });
    });
  },

  // 搜索门店
  onSearch(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.loadStores();
  },

  // 清空搜索
  onClearSearch() {
    this.setData({
      searchKeyword: ''
    });
    this.loadStores();
  },

  // 查看门店详情
  onStoreDetail(e) {
    const storeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/store-detail/store-detail?id=${storeId}`
    });
  },

  // 导航到门店
  onNavigate(e) {
    const store = e.currentTarget.dataset.store;
    if (store.latitude && store.longitude) {
      wx.openLocation({
        latitude: parseFloat(store.latitude),
        longitude: parseFloat(store.longitude),
        name: store.name,
        address: store.address
      });
    } else {
      wx.showToast({
        title: '门店位置信息不完整',
        icon: 'none'
      });
    }
  },

  // 计算距离
  calculateDistance(lat1, lng1, lat2, lng2) {
    const radLat1 = lat1 * Math.PI / 180.0;
    const radLat2 = lat2 * Math.PI / 180.0;
    const a = radLat1 - radLat2;
    const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2), 2) + 
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b/2), 2)));
    return s * 6378.137;
  },

  // 格式化距离
  formatDistance(distance) {
    if (distance < 1) {
      return Math.round(distance * 1000) + 'm';
    } else {
      return distance.toFixed(1) + 'km';
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadStores();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});