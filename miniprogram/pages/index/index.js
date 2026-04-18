const app = getApp();
const { storeApi } = require('../../utils/api.js');

Page({
  data: {
    nearbyStores: [],
    loading: true,
    searchKeyword: ''
  },

  onLoad() {
    this.loadStores();
  },

  onShow() {
    this.loadStores();
  },

  loadStores() {
    this.setData({ loading: true });
    storeApi.getMerchants(1, 20).then(res => {
      let stores = [];
      const data = res.data;
      if (data && data.list) stores = data.list;
      else if (Array.isArray(data)) stores = data;

      stores = stores.map(store => {
        if (!store.images) store.images = ['/images/default-store.jpg'];
        if (typeof store.images === 'string') store.images = [store.images];
        return store;
      });

      this.setData({ nearbyStores: stores, loading: false });
    }).catch(err => {
      console.error('加载门店失败:', err);
      // 使用模拟数据（截图中的真实门店数据）
      this.setData({
        nearbyStores: [
          { id: 1, merchantId: 1, name: '嘉善亭桥路店', address: '嘉兴市嘉善县罗星街道亭桥南路229号', images: ['/images/store-jiashanting.jpg'], availableRooms: 8, distance: '80.59km' },
          { id: 2, merchantId: 2, name: '花印大厦店', address: '妙家浜路555号长...', images: ['/images/store-huayin.jpg'], availableRooms: 5, distance: '110.2km' },
          { id: 3, merchantId: 3, name: '诸暨郭家店', address: '诸暨市暨阳街道暨东路...', images: ['/images/store-zhujiguo.jpg'], availableRooms: 6, distance: '112.94km' }
        ],
        loading: false
      });
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearch() {
    this.loadStores();
  },

  onStoreDetail(e) {
    const storeId = e.currentTarget.dataset.id;
    const merchantId = e.currentTarget.dataset.merchantid;
    wx.navigateTo({
      url: `/pages/store-detail/store-detail?id=${storeId}&merchantId=${merchantId || ''}`
    });
  },

  goToOrders() {
    wx.switchTab({ url: '/pages/orders/orders' });
  },

  onPullDownRefresh() {
    this.loadStores();
    setTimeout(() => wx.stopPullDownRefresh(), 1000);
  }
});
