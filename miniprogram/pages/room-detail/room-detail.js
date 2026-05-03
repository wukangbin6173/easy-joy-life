const app = getApp();
const config = require('../../utils/config.js');
const { roomApi } = require('../../utils/api.js');
const resourceStatus = require('../../utils/resource-status.js');

Page({
  data: {
    room: {},
    storeId: '',
    merchantId: '',
    roomId: '',
    selectedRoomId: '',
    selectMode: false,
    serviceMeta: {
      resourceLabel: '资源',
      priceUnitText: '/小时起'
    },
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
    this.setData({
      storeId,
      merchantId,
      roomId,
      selectedRoomId: options.selectedRoomId || '',
      selectMode: options.selectMode === '1' || options.selectMode === 'true',
      serviceMeta
    });
    this.updateNavigationTitle(serviceMeta);
    this.bindRoomSnapshot();
    this.loadRoomDetail(roomId, merchantId);
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
        this.setData({
          room: this.normalizeRoom(room, room.id || this.data.roomId),
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

  loadRoomDetail(roomId, merchantId) {
    if (!roomId || !merchantId) {
      this.setData({ loading: false, room: this.buildFallbackRoom(roomId) });
      return;
    }

    this.setData({ loading: true });
    roomApi.getRoomById(roomId, merchantId).then(res => {
      const data = res && res.data ? res.data : {};
      const hasData = data && Object.keys(data).length > 0;
      this.setData({
        room: hasData
          ? this.normalizeRoom(data, roomId)
          : (this.data.room && this.data.room.id ? this.data.room : this.buildFallbackRoom(roomId)),
        storeId: data.storeId || data.storeID || data.store_id || this.data.storeId,
        loading: false
      });
    }).catch(err => {
      console.error('加载资源详情失败:', err);
      wx.showToast({ title: '资源详情加载失败', icon: 'none' });
      this.setData({
        loading: false,
        room: this.data.room && this.data.room.id ? this.data.room : this.buildFallbackRoom(roomId)
      });
    });
  },

  normalizeRoom(data = {}, roomId) {
    const price = this.normalizePrice(data.unitPrice || data.price || data.pricePerHour || data.hourPrice);
    const tags = this.parseTags(data.tags || data.labels || data.featureTags || data.facilities);
    const status = Number(data.status);
    const bookable = this.isResourceBookable(data);
    const id = data.id || data.resourceId || roomId;
    return {
      ...data,
      id,
      name: data.resourceName || data.name || '资源信息待同步',
      type: data.resourceType || data.type || data.categoryName || '预约资源',
      pricePerHour: price,
      price: price ? this.formatPrice(price) : '--',
      unitText: data.priceUnitText || data.unitName || data.priceUnit || this.data.serviceMeta.priceUnitText,
      image: this.pickImage(data.resourcePhoto || data.image || data.coverUrl || data.photoUrl),
      facilities: tags.length ? tags.join('、') : (data.description || '资源设施待同步'),
      status,
      statusKey: bookable ? 'available' : this.getStatusKey(status),
      statusText: this.getStatusText(data),
      capacity: data.capacity || data.maxCapacity || '',
      description: data.description || data.remark || '资源介绍待同步',
      bookable,
      selected: `${id}` === `${this.data.selectedRoomId || ''}`
    };
  },

  buildFallbackRoom(roomId) {
    return {
      id: roomId || '',
      name: '资源信息待同步',
      type: '预约资源',
      price: '--',
      unitText: this.data.serviceMeta.priceUnitText,
      image: config.DEFAULT_ROOM_IMAGE,
      facilities: '资源设施待同步',
      statusKey: 'disabled',
      statusText: '不可约',
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

  isResourceBookable(room = {}) {
    return resourceStatus.isResourceBookable(room);
  },

  getStatusText(room = {}) {
    return resourceStatus.getResourceStatusText(room);
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
      wx.showToast({ title: '当前资源不可约', icon: 'none' });
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
