const app = getApp();
const { storeApi, roomApi } = require('../../utils/api.js');
const config = require('../../utils/config.js');
const resourceStatus = require('../../utils/resource-status.js');
const userProfile = require('../../utils/user-profile.js');
const locationUtil = require('../../utils/location.js');

const CATEGORY_CONFIG = {
  mahjong: {
    title: '无人棋牌室',
    serviceName: '包间',
    serviceUnit: '间',
    extraTag: '停车方便',
    availableText: '今日可约',
    fallbackImage: '/images/棋牌预约.png',
    keywords: ['棋牌', '麻将', '包间', '包房', '棋牌室', 'mahjong']
  },
  billiards: {
    title: '无人台球室',
    serviceName: '球台',
    serviceUnit: '张',
    extraTag: '近地铁',
    availableText: '今日可约',
    fallbackImage: '/images/台球预约.png',
    keywords: ['台球', '桌球', '球台', '8球', '八球', 'billiard', 'billiards', 'pool']
  },
  carwash: {
    title: '无人洗车',
    serviceName: '洗车机',
    serviceUnit: '台',
    extraTag: '停车方便',
    availableText: '当前可用',
    fallbackImage: '/images/自助洗车.png',
    keywords: ['洗车', '洗车机', '自助洗车', 'carwash', 'car wash', 'car']
  }
};

Page({
  data: {
    nearbyStores: [],
    allStores: [],
    loading: true,
    searchKeyword: '',
    currentLocation: null,
    activeCategory: 'mahjong',
    categoryTitle: '无人棋牌室',
    emptyCategoryText: '暂无无人棋牌室门店',
    userPhoneText: '请绑定手机号',
    userNickname: '微信用户',
    userAvatar: userProfile.DEFAULT_AVATAR,
    isPhoneVerified: false,
    bannerList: [
      { url: '/images/banner.png' },
      { url: '/images/banner2.jpg' }
    ],
    serviceCards: [
      {
        type: 'mahjong',
        title: '无人棋牌室',
        desc: '安静私密 · 智能开局',
        image: '/images/无人棋牌室0.png',
        activeImage: '/images/无人棋牌室.png',
        active: true,
        copyOverlay: false,
        showCheck: false
      },
      {
        type: 'billiards',
        title: '无人台球室',
        desc: '专业球台 · 畅快体验',
        image: '/images/无人台球.png',
        activeImage: '/images/无人台球-1.png',
        active: false,
        copyOverlay: false,
        showCheck: false
      },
      {
        type: 'carwash',
        title: '无人洗车',
        desc: '自助洗车 · 便捷高效',
        image: '/images/无人洗车.png',
        activeImage: '/images/无人洗车-1.png',
        active: false,
        copyOverlay: false,
        showCheck: false
      }
    ]
  },

  onLoad() {
    this.updateUserCard();
    this.scheduleUserCardRefresh();
    this.getLocation();
  },

  onShow() {
    this.updateUserCard();
    this.scheduleUserCardRefresh();
    this.loadStores();
  },

  onUnload() {
    if (this._userCardTimers) {
      this._userCardTimers.forEach(timer => clearTimeout(timer));
      this._userCardTimers = null;
    }
  },

  updateUserCard() {
    const cachedUser = wx.getStorageSync('userInfo') || {};
    const globalUser = app.globalData.userInfo || {};
    const user = { ...cachedUser, ...globalUser };
    const phone = user.phone || user.phoneNumber || '';
    const nickname = this.pickUserNickname(globalUser, cachedUser);
    const avatar = this.pickUserAvatar(globalUser, cachedUser);
    const phoneText = phone && phone !== '未绑定手机号'
      ? `${this.maskPhone(phone)} 已绑定手机号`
      : '请绑定手机号';
    this.setData({
      userPhoneText: phoneText,
      userNickname: nickname,
      userAvatar: avatar,
      isPhoneVerified: !!phone && phone !== '未绑定手机号'
    });
  },

  scheduleUserCardRefresh() {
    if (this._userCardTimers) {
      this._userCardTimers.forEach(timer => clearTimeout(timer));
    }
    this._userCardTimers = [800, 2000].map(delay => setTimeout(() => {
      this.updateUserCard();
    }, delay));
  },

  pickUserNickname(...sources) {
    const fallbackSource = {};
    sources.forEach(source => {
      if (!source) return;
      if (!fallbackSource.nickname) fallbackSource.nickname = source.name || source.realName || source.userName || '';
    });
    const nickname = userProfile.resolveNickname(...sources, fallbackSource);
    return nickname || (app.globalData.openid || app.globalData.userId ? '微信用户' : '未登录用户');
  },

  pickUserAvatar(...sources) {
    return userProfile.resolveAvatar(
      ...sources,
      userProfile.avatarOptions({ allowLocal: true })
    ) || userProfile.DEFAULT_AVATAR;
  },

  maskPhone(phone) {
    const text = String(phone || '');
    if (text.length < 7) return text;
    return `${text.slice(0, 3)}****${text.slice(-4)}`;
  },

  onUserAvatarError() {
    this.setData({ userAvatar: userProfile.DEFAULT_AVATAR });
  },

  // 获取用户位置
  getLocation() {
    locationUtil.getCurrentLocation().then(loc => {
      this.setData({ currentLocation: loc });
      this.loadStores();
    }).catch(() => {
      console.log('获取位置失败，不显示距离');
      this.loadStores();
    });
  },

  // 计算两点距离（km）
  calculateDistance(lat1, lng1, lat2, lng2) {
    return locationUtil.calculateDistance(lat1, lng1, lat2, lng2);
  },

  formatDistance(km) {
    return locationUtil.formatDistance(km);
  },

  loadStores() {
    this.setData({ loading: true });
    const merchantId = this.getMerchantId();
    storeApi.getStores(merchantId, 1, 50).then(res => {
      console.log('门店接口返回:', JSON.stringify(res).substring(0, 200));
      let stores = [];
      const data = res.data;
      console.log('data类型:', typeof data, 'list类型:', data && typeof data.list, 'isArray:', data && Array.isArray(data.list));
      if (data && Array.isArray(data.list)) stores = data.list;
      else if (Array.isArray(data)) stores = data;
      console.log('门店数量:', stores.length);

      stores = stores.map((store, index) => {
        // 字段适配：商起点用 storeName，前端用 name
        store.name = store.storeName || store.name;
        store.merchantId = store.merchantId || store.merchantID || merchantId;
        // coverUrl 优先，logoUrl 过滤掉本地 file:// 路径，都没有用默认图
        const validCover = store.coverUrl && !store.coverUrl.startsWith('file://') ? store.coverUrl : null;
        const validLogo = store.logoUrl && !store.logoUrl.startsWith('file://') ? store.logoUrl : null;
        store.phone = store.contactPhone || store.phone;
        store.categoryTypes = this.detectCategoryTypes(store);
        store.categoryType = store.categoryTypes[0];
        const coverImage = validCover || validLogo || this.getCategoryMeta(store.categoryType).fallbackImage;
        store.coverImage = coverImage;
        store.images = coverImage ? [coverImage] : [];
        store.displayName = this.formatStoreName(store.name, index);
        store.categoryTitle = this.getCategoryMeta(store.categoryType).title;
        store.serviceName = this.getStoreServiceName(store);
        store.serviceUnit = this.getCategoryMeta(store.categoryType).serviceUnit;
        store.extraTag = this.getCategoryMeta(store.categoryType).extraTag;
        store.availableText = this.getCategoryMeta(store.categoryType).availableText;
        const priceInfo = this.getStorePriceInfo(store);
        store.priceYuan = priceInfo.text;
        store.hasPrice = priceInfo.hasPrice;
        store.priceUnitText = priceInfo.unitText;
        store.canBook = undefined;
        store.roomCount = store.roomCount || 0;
        // 计算距离
        const km = locationUtil.resolveDistanceKm(store, this.data.currentLocation);
        if (km !== null && km !== undefined) {
          store.distanceKm = km;
          store.distance = this.formatDistance(km);
        } else {
          store.distanceKm = 99999; // 没有坐标的排最后
        }
        return store;
      });

      // 按距离从近到远排序
      stores.sort((a, b) => a.distanceKm - b.distanceKm);

      // 先显示门店列表
      const displayStores = stores;
      this.setData({ allStores: displayStores, loading: false });
      this.applyCategory(this.data.activeCategory);
      wx.stopPullDownRefresh();

      // 异步查每个门店的房间数量，查到了再更新
      displayStores.forEach((store, index) => {
        const storeMerchantId = store.merchantId || merchantId;
        if (!storeMerchantId) return;
        roomApi.getRooms(storeMerchantId, 1, 50, store.id || store.storeId).then(r => {
          const list = this.extractRoomList(r.data);
          this.updateStoreRooms(store, list);
        }).catch(() => {});
      });
    }).catch(err => {
      console.error('加载门店失败:', err);
      this.setData({ allStores: [], loading: false });
      this.applyCategory(this.data.activeCategory);
      wx.stopPullDownRefresh();
    });
  },

  formatStoreName(name, index) {
    if (name) return name;
    return '门店信息待同步';
  },

  getMerchantId() {
    return (app.getActiveMerchantId && app.getActiveMerchantId()) ||
      app.globalData.currentMerchantId ||
      app.globalData.defaultMerchantId ||
      config.DEFAULT_MERCHANT_ID;
  },

  detectCategoryTypes(store, useDefault = true) {
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
    return types.length ? types : (useDefault ? ['mahjong'] : []);
  },

  getCategoryMeta(category) {
    return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.mahjong;
  },

  getStoreServiceName(store) {
    return this.getCategoryMeta(store.categoryType).serviceName;
  },

  getStorePrice(store) {
    return this.getStorePriceInfo(store).text;
  },

  getStorePriceInfo(source = {}) {
    const raw = this.pickPriceValue(source, [
      'minPrice',
      'lowestPrice',
      'startPrice',
      'startingPrice',
      'price',
      'unitPrice',
      'hourPrice',
      'pricePerHour',
      'salePrice',
      'packagePrice'
    ]);
    const value = this.normalizeMoney(raw);
    return {
      value,
      text: value ? this.formatPrice(value) : '',
      unitText: '起',
      hasPrice: value > 0
    };
  },

  getMinRoomPriceInfo(rooms = []) {
    const prices = (Array.isArray(rooms) ? rooms : [])
      .map(room => this.getStorePriceInfo(room))
      .filter(item => item.hasPrice)
      .sort((a, b) => a.value - b.value);
    return prices[0] || { value: 0, text: '', unitText: '起', hasPrice: false };
  },

  pickPriceValue(source = {}, fields = []) {
    for (const field of fields) {
      const value = source[field];
      if (value !== undefined && value !== null && value !== '') return value;
    }
    return '';
  },

  normalizeMoney(value) {
    if (value === undefined || value === null || value === '') return 0;
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return 0;
    return num >= 100 ? num / 100 : num;
  },

  formatPrice(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return '';
    return Number.isInteger(num) ? `${num}` : num.toFixed(2).replace(/\.00$/, '');
  },

  applyCategory(category) {
    const meta = this.getCategoryMeta(category);
    const filteredStores = this.data.allStores
      .filter(store => (store.categoryTypes || [store.categoryType]).includes(category))
      .map(store => this.decorateStoreForCategory(store, category));
    this.setData({
      nearbyStores: filteredStores,
      categoryTitle: meta.title,
      emptyCategoryText: `暂无${meta.title}门店`
    });
  },

  decorateStoreForCategory(store, category) {
    const meta = this.getCategoryMeta(category);
    const categoryRoomCounts = store.categoryRoomCounts || {};
    return {
      ...store,
      categoryTitle: meta.title,
      serviceName: meta.serviceName,
      serviceUnit: meta.serviceUnit,
      extraTag: meta.extraTag,
      availableText: meta.availableText,
      priceYuan: store.priceYuan,
      hasPrice: !!store.hasPrice,
      priceUnitText: store.priceUnitText || '起',
      roomCount: categoryRoomCounts[category] || store.roomCount || 0
    };
  },

  updateStoreRooms(targetStore, rooms) {
    const visibleRooms = this.filterRoomsForStore(rooms, targetStore).filter(room => room.isShowInApp !== 0);
    const roomList = visibleRooms.filter(room => this.isBookableResource(room));
    const categoryRoomCounts = {};
    const roomCategoryTypes = [];
    roomList.forEach(room => {
      const roomTypes = this.detectCategoryTypes(room, false);
      roomTypes.forEach(type => {
        if (!roomCategoryTypes.includes(type)) roomCategoryTypes.push(type);
        categoryRoomCounts[type] = (categoryRoomCounts[type] || 0) + 1;
      });
    });
    const categoryType = roomCategoryTypes[0] || targetStore.categoryType || 'mahjong';
    const meta = this.getCategoryMeta(categoryType);
    const minPriceInfo = this.getMinRoomPriceInfo(roomList.length ? roomList : visibleRooms);

    const matchStore = store => {
      const targetId = targetStore.id || targetStore.storeId;
      const storeId = store.id || store.storeId;
      if (targetId && storeId) return String(storeId) === String(targetId);
      return targetStore.merchantId && store.merchantId && String(store.merchantId) === String(targetStore.merchantId);
    };
    const allStores = this.data.allStores.map(store => (
      matchStore(store)
        ? {
            ...store,
            roomCount: roomList.length,
            categoryRoomCounts,
            categoryTypes: roomCategoryTypes.length ? roomCategoryTypes : store.categoryTypes,
            categoryType,
            availableText: roomList.length ? meta.availableText : '暂无可约',
            canBook: roomList.length > 0,
            priceYuan: minPriceInfo.hasPrice ? minPriceInfo.text : store.priceYuan,
            hasPrice: minPriceInfo.hasPrice || !!store.hasPrice,
            priceUnitText: minPriceInfo.hasPrice ? minPriceInfo.unitText : store.priceUnitText
          }
        : store
    ));
    this.setData({ allStores });
    this.applyCategory(this.data.activeCategory);
  },

  extractRoomList(data) {
    if (data && Array.isArray(data.list)) return data.list;
    if (data && Array.isArray(data.records)) return data.records;
    return Array.isArray(data) ? data : [];
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

  isBookableResource(room = {}) {
    return resourceStatus.isResourceBookable(room);
  },

  getFallbackStores() {
    return [];
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
    if (`${storeId}`.indexOf('demo-') === 0) {
      wx.showToast({ title: '门店加载中，请稍后重试', icon: 'none' });
      return;
    }
    if (merchantId && app.setActiveMerchantId) app.setActiveMerchantId(merchantId);
    wx.navigateTo({
      url: `/pages/store-detail/store-detail?id=${storeId}&merchantId=${merchantId || ''}`
    });
  },

  navigateToStore(e) {
    const store = e.currentTarget.dataset.store;
    const storeLocation = locationUtil.resolveStoreLocation(store);
    if (storeLocation) {
      wx.openLocation({
        latitude: storeLocation.latitude,
        longitude: storeLocation.longitude,
        name: store.name,
        address: store.address
      });
    } else if (store.address) {
      wx.showModal({
        title: store.name,
        content: store.address,
        confirmText: '复制地址',
        cancelText: '关闭',
        success: (res) => { if (res.confirm) wx.setClipboardData({ data: store.address }); }
      });
    } else {
      wx.showToast({ title: '暂无位置信息', icon: 'none' });
    }
  },

  goToOrders() {
    wx.switchTab({ url: '/pages/orders/orders' });
  },

  goToStores() {
    wx.navigateTo({ url: `/pages/nearby-stores/nearby-stores?category=${this.data.activeCategory}` });
  },

  goToProfile() {
    wx.switchTab({ url: '/pages/profile/profile' });
  },

  goToRecharge() {
    wx.navigateTo({ url: '/pages/recharge/recharge' });
  },

  contactService() {
    wx.showModal({
      title: '联系客服',
      variant: 'service',
      servicePhone: '15157903339',
      serviceTime: '7×24小时在线',
      serviceDesc: '预约、支付、开门、退款等问题都可以联系人工客服',
      showCancel: true,
      cancelText: '知道了',
      confirmText: '拨打电话',
      success: (res) => {
        if (res.confirm) wx.makePhoneCall({ phoneNumber: '15157903339' });
      }
    });
  },

  scanCode() {
    wx.scanCode({
      success: (res) => {
        const scanText = this.decodeScanText(res.result || res.path || '');
        console.log('扫码结果:', scanText);
        this.handleScanResult(scanText);
      },
      fail: () => {
        wx.showToast({ title: '扫码失败', icon: 'none' });
      }
    });
  },

  decodeScanText(text = '') {
    const rawText = String(text || '').trim();
    try {
      return decodeURIComponent(rawText);
    } catch (e) {
      return rawText;
    }
  },

  handleScanResult(scanText) {
    if (!scanText) {
      wx.showToast({ title: '二维码内容为空', icon: 'none' });
      return;
    }

    const payload = this.parseScanPayload(scanText);
    if (this.navigateByScanPayload(payload)) return;

    wx.showModal({
      title: '二维码未识别',
      content: '这个二维码不是雀玺门店、资源或订单二维码，请确认后重试。',
      confirmText: '复制内容',
      cancelText: '关闭',
      success: (modalRes) => {
        if (modalRes.confirm) wx.setClipboardData({ data: scanText });
      }
    });
  },

  parseScanPayload(scanText) {
    const payload = { raw: scanText };

    if (scanText.startsWith('{') && scanText.endsWith('}')) {
      try {
        return { ...payload, ...JSON.parse(scanText) };
      } catch (e) {}
    }

    const pathMatch = scanText.match(/(\/?pages\/[^?\s#]+)(\?[^#\s]*)?/);
    if (pathMatch) {
      payload.path = pathMatch[1].startsWith('/') ? pathMatch[1] : `/${pathMatch[1]}`;
      if (pathMatch[2]) this.mergeQueryToPayload(payload, pathMatch[2].slice(1));
    }

    const queryText = scanText.includes('?') ? scanText.split('?').slice(1).join('?') : scanText;
    this.mergeQueryToPayload(payload, queryText);
    return payload;
  },

  mergeQueryToPayload(payload, queryText = '') {
    queryText.split('&').forEach(part => {
      const [key, ...valueParts] = part.split('=');
      if (!key || !valueParts.length) return;
      const safeKey = key.trim();
      const safeValue = this.decodeScanText(valueParts.join('='));
      if (safeKey) payload[safeKey] = safeValue;
    });
  },

  navigateByScanPayload(payload = {}) {
    const encoded = value => encodeURIComponent(String(value));
    const path = payload.path || '';
    const allowedPaths = [
      '/pages/store-detail/store-detail',
      '/pages/room-detail/room-detail',
      '/pages/order-detail/order-detail',
      '/pages/unlock/unlock'
    ];

    if (path && allowedPaths.some(item => path.startsWith(item))) {
      wx.navigateTo({ url: path });
      return true;
    }

    const orderId = payload.orderId || payload.billingOrderId || payload.billingId || payload.orderNo;
    if (orderId) {
      wx.navigateTo({ url: `/pages/order-detail/order-detail?orderId=${encoded(orderId)}` });
      return true;
    }

    const resourceId = payload.resourceId || payload.roomId || payload.resource_id;
    const merchantId = payload.merchantId || payload.merchant_id || payload.mchId;
    const storeId = payload.storeId || payload.store_id || payload.shopId || payload.shop_id;

    if (resourceId) {
      const params = [`id=${encoded(resourceId)}`];
      if (merchantId) params.push(`merchantId=${encoded(merchantId)}`);
      if (storeId) params.push(`storeId=${encoded(storeId)}`);
      wx.navigateTo({ url: `/pages/room-detail/room-detail?${params.join('&')}` });
      return true;
    }

    if (storeId) {
      const params = [`id=${encoded(storeId)}`];
      if (merchantId) params.push(`merchantId=${encoded(merchantId)}`);
      wx.navigateTo({ url: `/pages/store-detail/store-detail?${params.join('&')}` });
      return true;
    }

    return false;
  },

  filterByCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    const serviceCards = this.data.serviceCards.map(item => ({
      ...item,
      active: item.type === cat
    }));
    this.setData({
      activeCategory: cat,
      serviceCards
    });
    this.applyCategory(cat);
  },

  onPullDownRefresh() {
    this.setData({ nearbyStores: [], loading: true });
    this.loadStores();
    setTimeout(() => wx.stopPullDownRefresh(), 2000);
  }
});
