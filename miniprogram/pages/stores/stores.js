// pages/stores/stores.js
const app = getApp();
const { storeApi, roomApi } = require('../../utils/api.js');
const config = require('../../utils/config.js');
const resourceStatus = require('../../utils/resource-status.js');
const locationUtil = require('../../utils/location.js');
const bookingModeUtil = require('../../utils/booking-mode.js');

const CATEGORY_CONFIG = {
  all: { title: '全部', keywords: [] },
  mahjong: { title: '棋牌', serviceName: '包间', fallbackImage: '/images/棋牌预约.png', keywords: ['棋牌', '麻将', '包间', '包房', '棋牌室', 'mahjong'] },
  billiards: { title: '台球', serviceName: '球台', fallbackImage: '/images/台球预约.png', keywords: ['台球', '桌球', '球台', '8球', '八球', 'billiard', 'billiards', 'pool'] },
  carwash: { title: '洗车', serviceName: '洗车机', fallbackImage: '/images/自助洗车.png', keywords: ['洗车', '洗车机', '自助洗车', 'carwash', 'car wash', 'car'] }
};

Page({
  data: {
    stores: [],
    allStores: [],
    loading: true,
    searchKeyword: '',
    currentLocation: null,
    showLocationAuth: false,
    activeCategory: 'all',
    categoryTabs: [
      { type: 'all', title: '全部', active: true },
      { type: 'mahjong', title: '棋牌', active: false },
      { type: 'billiards', title: '台球', active: false },
      { type: 'carwash', title: '洗车', active: false }
    ],
    emptyText: '暂无门店信息'
  },

  onLoad(options = {}) {
    if (options.category) this.setActiveCategory(options.category);
    this.getLocation();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadStores();
  },

  // 获取位置信息
  getLocation() {
    locationUtil.getCurrentLocation().then(location => {
      this.setData({
        currentLocation: location,
        showLocationAuth: false
      });
      this.loadStores();
    }).catch(() => {
      this.setData({
        showLocationAuth: true
      });
      this.loadStores();
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

  loadStores() {
    this.setData({ loading: true });
    const fallbackMerchantId = this.getMerchantId();
    storeApi.getStores(undefined, 1, 100).then(response => {
      let stores = [];
      const data = response.data;
      if (data && Array.isArray(data.list)) stores = data.list;
      else if (data && Array.isArray(data.records)) stores = data.records;
      else if (Array.isArray(data)) stores = data;

      stores = stores.map((store, index) => {
        // 字段适配：商起点用 storeName，前端用 name
        store.name = store.storeName || store.name;
        store.merchantId = store.merchantId || store.merchantID || fallbackMerchantId;
        const validCover = store.coverUrl && !store.coverUrl.startsWith('file://') ? store.coverUrl : null;
        const validLogo = store.logoUrl && !store.logoUrl.startsWith('file://') ? store.logoUrl : null;
        store.phone = store.contactPhone || store.phone;
        store.categoryTypes = this.detectCategoryTypes(store);
        store.categoryType = store.categoryTypes[0];
        const bookingEnabled = bookingModeUtil.resolveBookingEnabled(store);
        store.categoryTitle = CATEGORY_CONFIG[store.categoryType].title;
        store.serviceName = CATEGORY_CONFIG[store.categoryType].serviceName;
        store.bookingEnabled = bookingEnabled;
        store.actionText = this.getStoreActionText(bookingEnabled);
        store.availableText = this.getStoreAvailabilityText(bookingEnabled, store.roomCount);
        store.images = validCover ? [validCover] : (validLogo ? [validLogo] : [CATEGORY_CONFIG[store.categoryType].fallbackImage]);
        store.displayName = store.name || '门店信息待同步';

        const distance = locationUtil.resolveDistanceKm(store, this.data.currentLocation);
        if (distance !== null && distance !== undefined) {
          store.distance = this.formatDistance(distance);
        }
        return store;
      });

      this.setData({ allStores: stores, loading: false });
      this.applyFilters();
      this.enrichStoresWithBookingMode(stores);
      this.enrichStoresWithRooms(stores, fallbackMerchantId);
    }).catch(error => {
      console.error('加载门店失败:', error);
      this.setData({ loading: false });
    });
  },

  // 搜索门店
  onSearch(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.applyFilters();
  },

  // 清空搜索
  onClearSearch() {
    this.setData({
      searchKeyword: ''
    });
    this.applyFilters();
  },

  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    this.setActiveCategory(category);
    this.applyFilters();
  },

  setActiveCategory(category) {
    const activeCategory = CATEGORY_CONFIG[category] ? category : 'all';
    this.setData({
      activeCategory,
      categoryTabs: this.data.categoryTabs.map(item => ({
        ...item,
        active: item.type === activeCategory
      }))
    });
  },

  applyFilters() {
    const keyword = (this.data.searchKeyword || '').trim().toLowerCase();
    const activeCategory = this.data.activeCategory;
    let stores = this.data.allStores;

    if (activeCategory !== 'all') {
      stores = stores.filter(store => (store.categoryTypes || [store.categoryType]).includes(activeCategory));
    }

    if (keyword) {
      stores = stores.filter(store => {
        const text = `${store.name || ''}${store.displayName || ''}${store.address || ''}${store.categoryTitle || ''}`.toLowerCase();
        return text.includes(keyword);
      });
    }

    const categoryTitle = CATEGORY_CONFIG[activeCategory].title;
    const emptyText = keyword
      ? '没有找到匹配的门店'
      : activeCategory === 'all'
        ? '暂无门店信息'
        : `暂无${categoryTitle}门店`;

    this.setData({ stores, emptyText });
  },

  detectCategoryTypes(store) {
    const text = [
      store.name,
      store.storeName,
      store.category,
      store.categoryName,
      store.businessType,
      store.serviceType,
      store.storeType,
      store.description,
      store.facilities,
      store.tags,
      store.productName,
      store.resourceName
    ].filter(Boolean).join(' ').toLowerCase();

    const types = [];
    if (CATEGORY_CONFIG.carwash.keywords.some(keyword => text.includes(keyword.toLowerCase()))) types.push('carwash');
    if (CATEGORY_CONFIG.billiards.keywords.some(keyword => text.includes(keyword.toLowerCase()))) types.push('billiards');
    if (CATEGORY_CONFIG.mahjong.keywords.some(keyword => text.includes(keyword.toLowerCase()))) types.push('mahjong');
    return types.length ? types : ['mahjong'];
  },

  getMerchantId() {
    return (app.getActiveMerchantId && app.getActiveMerchantId()) ||
      app.globalData.currentMerchantId ||
      app.globalData.defaultMerchantId ||
      config.DEFAULT_MERCHANT_ID;
  },

  getStoreActionText(bookingEnabled) {
    return bookingEnabled ? '立即预订' : '到店下单';
  },

  getStoreAvailabilityText(bookingEnabled, availableCount) {
    if (availableCount === undefined || availableCount === null || availableCount === '') {
      return bookingEnabled ? '今日可约' : '今日可用';
    }
    if (Number(availableCount || 0) <= 0) return bookingEnabled ? '暂无可约' : '暂无可用';
    return bookingEnabled ? '今日可约' : '今日可用';
  },

  enrichStoresWithBookingMode(stores) {
    stores.forEach(store => {
      const storeId = store.id || store.storeId;
      if (!storeId) return;
      storeApi.getStoreWithBookingMode(storeId).then(res => {
        const latest = (res && res.data) || {};
        const merged = { ...store, ...latest };
        const bookingEnabled = bookingModeUtil.resolveBookingEnabled(merged);
        this.updateStorePartial(store, {
          bookingConfig: merged.bookingConfig,
          displayConfig: merged.displayConfig,
          bookingEnabled,
          actionText: this.getStoreActionText(bookingEnabled),
          availableText: this.getStoreAvailabilityText(bookingEnabled, store.roomCount)
        });
      }).catch(err => {
        console.warn('加载门店预约配置失败:', storeId, err);
      });
    });
  },

  enrichStoresWithRooms(stores, fallbackMerchantId) {
    stores.forEach(store => {
      const merchantId = store.merchantId || fallbackMerchantId;
      if (!merchantId) return;
      roomApi.getRooms(merchantId, 1, 50, store.id || store.storeId).then(res => {
        const rooms = this.extractRoomList(res.data);
        this.updateStoreRooms(store, rooms);
      }).catch(() => {});
    });
  },

  extractRoomList(data) {
    if (data && Array.isArray(data.list)) return data.list;
    if (data && Array.isArray(data.records)) return data.records;
    return Array.isArray(data) ? data : [];
  },

  updateStoreRooms(targetStore, rooms) {
    const visibleRooms = this.filterRoomsForStore(rooms, targetStore).filter(room => room.isShowInApp !== 0);
    const bookingEnabled = bookingModeUtil.resolveBookingEnabled(targetStore);
    const roomList = visibleRooms.filter(room => this.isBookableResource(room, bookingEnabled));
    const categoryTypes = this.detectCategoryTypesFromRooms(roomList.length ? roomList : visibleRooms, targetStore.categoryTypes);
    const categoryType = categoryTypes[0] || targetStore.categoryType || 'mahjong';
    const meta = CATEGORY_CONFIG[categoryType] || CATEGORY_CONFIG.mahjong;

    const allStores = this.data.allStores.map(store => {
      const sameStore = String(store.id || store.storeId) === String(targetStore.id || targetStore.storeId);
      if (!sameStore) return store;
      return {
        ...store,
        categoryTypes,
        categoryType,
        categoryTitle: meta.title,
        serviceName: meta.serviceName,
        roomCount: roomList.length || store.roomCount || 0,
        bookingEnabled,
        actionText: this.getStoreActionText(bookingEnabled),
        availableText: this.getStoreAvailabilityText(bookingEnabled, roomList.length)
      };
    });
    this.setData({ allStores });
    this.applyFilters();
  },

  updateStorePartial(targetStore, patch) {
    const targetId = String((targetStore && (targetStore.id || targetStore.storeId)) || '');
    const allStores = this.data.allStores.map(store => {
      const storeId = String(store.id || store.storeId || '');
      return targetId && storeId === targetId ? { ...store, ...patch } : store;
    });
    this.setData({ allStores });
    this.applyFilters();
  },

  filterRoomsForStore(rooms, store) {
    const storeId = String((store && (store.id || store.storeId)) || '');
    if (!storeId) return rooms;
    const roomsWithStoreId = rooms.filter(room => this.getRoomStoreId(room));
    if (!roomsWithStoreId.length) return rooms;
    return rooms.filter(room => String(this.getRoomStoreId(room)) === storeId);
  },

  getRoomStoreId(room = {}) {
    return room.storeId || room.storeID || room.store_id ||
      (room.store && room.store.id) ||
      (room.storeInfo && room.storeInfo.id) || '';
  },

  isBookableResource(room = {}, bookingEnabled = false) {
    return resourceStatus.isResourceBookable(room, { bookingEnabled });
  },

  detectCategoryTypesFromRooms(rooms, fallbackTypes) {
    const types = [];
    rooms.forEach(room => {
      this.detectCategoryTypes(room).forEach(type => {
        if (!types.includes(type)) types.push(type);
      });
    });
    return types.length ? types : (fallbackTypes || ['mahjong']);
  },

  // 查看门店详情
  onStoreDetail(e) {
    const storeId = e.currentTarget.dataset.id;
    const merchantId = e.currentTarget.dataset.merchantid;
    if (merchantId && app.setActiveMerchantId) app.setActiveMerchantId(merchantId);
    wx.navigateTo({
      url: `/pages/store-detail/store-detail?id=${storeId}&merchantId=${merchantId || ''}`
    });
  },

  // 导航到门店
  onNavigate(e) {
    const store = e.currentTarget.dataset.store;
    const storeLocation = locationUtil.resolveStoreLocation(store);
    if (storeLocation) {
      wx.openLocation({
        latitude: storeLocation.latitude,
        longitude: storeLocation.longitude,
        name: store.name,
        address: store.address,
        scale: 18
      });
    } else {
      wx.showModal({
        title: store.name || '门店地址',
        content: store.address ? `${store.address}\n\n该门店缺少经纬度，暂无法直接打开地图。` : '门店位置信息不完整',
        confirmText: store.address ? '复制地址' : '知道了',
        showCancel: !!store.address,
        success: (res) => {
          if (res.confirm && store.address) wx.setClipboardData({ data: store.address });
        }
      });
    }
  },

  // 计算距离
  calculateDistance(lat1, lng1, lat2, lng2) {
    return locationUtil.calculateDistance(lat1, lng1, lat2, lng2);
  },

  // 格式化距离
  formatDistance(distance) {
    return locationUtil.formatDistance(distance);
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadStores();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
