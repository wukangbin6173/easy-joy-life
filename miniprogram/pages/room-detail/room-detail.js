const app = getApp();
const config = require('../../utils/config.js');
const { storeApi, roomApi } = require('../../utils/api.js');
const resourceStatus = require('../../utils/resource-status.js');
const bookingModeUtil = require('../../utils/booking-mode.js');

Page({
  data: {
    room: {},
    store: {},
    storeId: '',
    merchantId: '',
    roomId: '',
    selectedRoomId: '',
    selectMode: false,
    serviceMeta: {
      resourceLabel: '资源',
      priceUnitText: '/小时起'
    },
    bookingEnabled: false,
    flowText: {},
    loading: true
  },

  onLoad(options = {}) {
    const roomId = options.roomId || options.id || options.resourceId || '';
    const storeId = options.storeId || '';
    const merchantId = options.merchantId ||
      (app.getActiveMerchantId ? app.getActiveMerchantId() : config.DEFAULT_MERCHANT_ID);
    const serviceMeta = {
      resourceLabel: decodeURIComponent(options.resourceLabel || '') || '资源',
      categoryTitle: decodeURIComponent(options.categoryTitle || '') || '',
      priceUnitText: decodeURIComponent(options.priceUnitText || '') || '/小时起'
    };
    const bookingEnabled = false;
    this.setData({
      storeId,
      merchantId,
      roomId,
      selectedRoomId: options.selectedRoomId || '',
      selectMode: options.selectMode === '1' || options.selectMode === 'true',
      serviceMeta,
      bookingEnabled,
      flowText: this.getFlowText(bookingEnabled)
    });
    this.updateNavigationTitle(serviceMeta);
    this.bindRoomSnapshot();
    this.loadRoomDetail(roomId, merchantId);
    if (storeId) this.loadStoreBookingMode(storeId);
  },

  getFlowText(bookingEnabled = this.data.bookingEnabled) {
    return bookingEnabled
      ? {
          disabledButton: '暂不可约',
          orderButton: '去预订',
          unavailableRoomText: '当前资源不可约',
          fallbackType: '预约资源',
          disabledStatusText: '不可约'
        }
      : {
          disabledButton: '暂不可用',
          orderButton: '去下单',
          unavailableRoomText: '当前资源不可用',
          fallbackType: '资源',
          disabledStatusText: '不可用'
        };
  },

  resolveBookingEnabled(...sources) {
    return bookingModeUtil.resolveBookingEnabled(...sources);
  },

  updateNavigationTitle(serviceMeta = this.data.serviceMeta) {
    wx.setNavigationBarTitle({
      title: `${serviceMeta.resourceLabel || '资源'}详情`
    });
  },

  bindRoomSnapshot() {
    try {
      const channel = this.getOpenerEventChannel && this.getOpenerEventChannel();
      if (!channel || !channel.on) return;
      channel.on('roomSnapshot', ({ room, serviceMeta }) => {
        if (!room) return;
        this._roomRawData = room;
        const embeddedStore = room.store || room.storeInfo || {};
        const currentStore = Object.keys(this.data.store || {}).length ? this.data.store : embeddedStore;
        const bookingEnabled = this.resolveBookingEnabled(currentStore);
        this.setData({
          bookingEnabled,
          store: currentStore,
          flowText: this.getFlowText(bookingEnabled),
          room: this.normalizeRoom(room, room.id || this.data.roomId, bookingEnabled),
          serviceMeta: {
            ...this.data.serviceMeta,
            ...(serviceMeta || {})
          },
          loading: false
        }, () => {
          this.updateNavigationTitle();
        });
      });
    } catch (e) {}
  },

  loadStoreBookingMode(storeId = this.data.storeId) {
    if (!storeId) {
      this.applyStoreBookingMode({});
      return Promise.resolve(false);
    }
    if (this._storeModePromise && `${this._loadingStoreId || ''}` === `${storeId}`) {
      return this._storeModePromise;
    }
    this._loadingStoreId = storeId;
    this._storeModePromise = storeApi.getStoreWithBookingMode(storeId).then(res => {
      const store = res && res.data ? res.data : {};
      store.name = store.storeName || store.name;
      this._loadedStoreId = storeId;
      this.setData({ store, storeId });
      return this.applyStoreBookingMode(store);
    }).catch(err => {
      console.error('加载门店预约设置失败:', err);
      this._loadedStoreId = '';
      this.setData({ store: {}, storeId });
      return this.applyStoreBookingMode({});
    }).finally(() => {
      this._loadingStoreId = '';
      this._storeModePromise = null;
    });
    return this._storeModePromise;
  },

  applyStoreBookingMode(store = this.data.store, rawRoom = this._roomRawData || this.data.room) {
    const bookingEnabled = this.resolveBookingEnabled(store);
    const roomId = (rawRoom && (rawRoom.id || rawRoom.resourceId)) || this.data.roomId;
    const hasRoomData = rawRoom && Object.keys(rawRoom).length > 0 &&
      (rawRoom.id || rawRoom.resourceId || rawRoom.resourceName || rawRoom.name || rawRoom.status !== undefined);
    this.setData({
      bookingEnabled,
      flowText: this.getFlowText(bookingEnabled),
      room: hasRoomData
        ? this.normalizeRoom(rawRoom, roomId, bookingEnabled)
        : this.buildFallbackRoom(roomId, bookingEnabled)
    });
    return bookingEnabled;
  },

  getStoreIdFromRoom(room = {}) {
    return room.storeId || room.storeID || room.store_id ||
      (room.store && room.store.id) ||
      (room.storeInfo && room.storeInfo.id) || '';
  },

  loadRoomDetail(roomId, merchantId) {
    if (!roomId || !merchantId) {
      const bookingEnabled = this.resolveBookingEnabled(this.data.store);
      const room = this.buildFallbackRoom(roomId, bookingEnabled);
      this._roomRawData = room;
      this.setData({
        loading: false,
        bookingEnabled,
        flowText: this.getFlowText(bookingEnabled),
        room
      });
      return;
    }

    this.setData({ loading: true });
    roomApi.getRoomById(roomId, merchantId).then(res => {
      const data = res && res.data ? res.data : {};
      const hasData = data && Object.keys(data).length > 0;
      const resolvedStoreId = this.getStoreIdFromRoom(data) || this.data.storeId;
      const embeddedStore = data.store || data.storeInfo || {};
      const bookingStore = resolvedStoreId ? this.data.store : embeddedStore;
      const bookingEnabled = this.resolveBookingEnabled(bookingStore);
      this._roomRawData = hasData ? data : (this._roomRawData || {});
      this.setData({
        bookingEnabled,
        flowText: this.getFlowText(bookingEnabled),
        store: resolvedStoreId ? this.data.store : embeddedStore,
        room: hasData
          ? this.normalizeRoom(data, roomId, bookingEnabled)
          : (this.data.room && this.data.room.id ? this.data.room : this.buildFallbackRoom(roomId, bookingEnabled)),
        storeId: resolvedStoreId,
        loading: false
      }, () => {
        if (resolvedStoreId && `${resolvedStoreId}` !== `${this._loadedStoreId || ''}`) {
          this.loadStoreBookingMode(resolvedStoreId);
        }
      });
    }).catch(err => {
      console.error('加载资源详情失败:', err);
      wx.showToast({ title: '资源详情加载失败', icon: 'none' });
      const bookingEnabled = this.resolveBookingEnabled(this.data.store);
      this.setData({
        bookingEnabled,
        flowText: this.getFlowText(bookingEnabled),
        loading: false,
        room: this.data.room && this.data.room.id ? this.data.room : this.buildFallbackRoom(roomId, bookingEnabled)
      });
    });
  },

  normalizeRoom(data = {}, roomId, bookingEnabled = this.data.bookingEnabled) {
    const price = this.normalizePrice(data.unitPrice || data.price || data.pricePerHour || data.hourPrice);
    const tags = this.parseTags(data.tags || data.labels || data.featureTags || data.facilities);
    const status = Number(data.status);
    const bookable = this.isResourceBookable(data, bookingEnabled);
    const id = data.id || data.resourceId || roomId;
    return {
      ...data,
      id,
      name: data.resourceName || data.name || '资源信息待同步',
      type: data.resourceType || data.type || data.categoryName || this.getFlowText(bookingEnabled).fallbackType || '资源',
      pricePerHour: price,
      price: price ? this.formatPrice(price) : '--',
      unitText: data.priceUnitText || data.unitName || data.priceUnit || this.data.serviceMeta.priceUnitText,
      image: this.pickImage(data.resourcePhoto || data.image || data.coverUrl || data.photoUrl),
      facilities: tags.length ? tags.join('、') : (data.description || '资源设施待同步'),
      status,
      statusKey: bookable ? 'available' : this.getStatusKey(status),
      statusText: this.getStatusText(data, bookingEnabled),
      capacity: data.capacity || data.maxCapacity || '',
      description: data.description || data.remark || '资源介绍待同步',
      bookable,
      selected: `${id}` === `${this.data.selectedRoomId || ''}`
    };
  },

  buildFallbackRoom(roomId, bookingEnabled = this.data.bookingEnabled) {
    const flowText = this.getFlowText(bookingEnabled);
    return {
      id: roomId || '',
      name: '资源信息待同步',
      type: flowText.fallbackType || '资源',
      price: '--',
      unitText: this.data.serviceMeta.priceUnitText,
      image: config.DEFAULT_ROOM_IMAGE,
      facilities: '资源设施待同步',
      statusKey: 'disabled',
      statusText: flowText.disabledStatusText || '不可用',
      capacity: '',
      description: '资源介绍待同步',
      bookable: false
    };
  },

  pickImage(url) {
    const text = String(url || '');
    if (text && !text.startsWith('file://')) return text;
    return config.DEFAULT_ROOM_IMAGE;
  },

  previewRoomImage() {
    const image = this.data.room && this.data.room.image;
    if (!image) return;
    wx.previewImage({
      current: image,
      urls: [image]
    });
  },

  normalizePrice(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return 0;
    return num >= 100 ? num / 100 : num;
  },

  formatPrice(price) {
    return Number.isInteger(price) ? `${price}` : price.toFixed(2).replace(/\.00$/, '');
  },

  parseTags(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean).map(item => `${item}`);
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(item => `${item}`);
    } catch (e) {}
    return String(value).split(/[,，、|/\s]+/).filter(Boolean);
  },

  isResourceBookable(room = {}, bookingEnabled = this.data.bookingEnabled) {
    return resourceStatus.isResourceBookable(room, { bookingEnabled });
  },

  getStatusText(room = {}, bookingEnabled = this.data.bookingEnabled) {
    return this.normalizeFlowStatusText(resourceStatus.getResourceStatusText(room, { bookingEnabled }), bookingEnabled);
  },

  normalizeFlowStatusText(text = '', bookingEnabled = this.data.bookingEnabled) {
    let result = String(text || '');
    if (bookingEnabled) {
      result = result.replace(/使用中/g, '已预约').replace(/不可用/g, '不可约').replace(/可用/g, '可约');
    } else {
      result = result.replace(/已预约/g, '使用中').replace(/不可约/g, '不可用').replace(/可约/g, '可用');
    }
    return result;
  },

  getStatusKey(status) {
    const map = { 1: 'occupied', 2: 'occupied', 3: 'maintenance', 4: 'disabled', 5: 'disabled' };
    return map[status] || 'disabled';
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/index/index' });
  },

  bookRoom() {
    if (!this.data.room.bookable) {
      wx.showToast({ title: this.data.flowText.unavailableRoomText || '当前资源不可用', icon: 'none' });
      return;
    }
    if (this.data.selectMode) {
      try {
        const channel = this.getOpenerEventChannel && this.getOpenerEventChannel();
        if (channel && channel.emit) {
          channel.emit('selectRoom', { room: this.data.room });
        }
      } catch (e) {}
      wx.navigateBack();
      return;
    }
    if (this.data.storeId) {
      wx.navigateTo({
        url: `/pages/store-detail/store-detail?id=${this.data.storeId}&merchantId=${this.data.merchantId || ''}`
      });
      return;
    }
    wx.showToast({ title: '门店信息待同步', icon: 'none' });
  }
});
