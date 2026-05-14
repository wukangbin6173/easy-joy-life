const { storeApi, roomApi, request } = require('../../utils/api.js');
const resourceStatus = require('../../utils/resource-status.js');
const config = require('../../utils/config.js');
const bookingModeUtil = require('../../utils/booking-mode.js');
const app = getApp();

const SERVICE_META = {
  mahjong: {
    type: 'mahjong',
    categoryTitle: '棋牌',
    resourceLabel: '包间',
    selectPlaceholder: '请选择包间',
    selectPageTitle: '选择包间',
    emptyText: '暂无可展示包间',
    priceUnitText: '/小时起',
    fallbackImage: config.DEFAULT_ROOM_IMAGE
  },
  billiards: {
    type: 'billiards',
    categoryTitle: '台球',
    resourceLabel: '球台',
    selectPlaceholder: '请选择球台',
    selectPageTitle: '选择球台',
    emptyText: '暂无可展示球台',
    priceUnitText: '/小时起',
    fallbackImage: '/images/台球预约.png'
  },
  carwash: {
    type: 'carwash',
    categoryTitle: '洗车',
    resourceLabel: '洗车服务',
    selectPlaceholder: '请选择洗车服务',
    selectPageTitle: '选择洗车服务',
    emptyText: '暂无可展示洗车服务',
    priceUnitText: '/次起',
    fallbackImage: '/images/自助洗车.png'
  },
  generic: {
    type: 'generic',
    categoryTitle: '服务',
    resourceLabel: '资源',
    selectPlaceholder: '请选择资源',
    selectPageTitle: '选择资源',
    emptyText: '暂无可展示资源',
    priceUnitText: '/小时起',
    fallbackImage: config.DEFAULT_ROOM_IMAGE
  }
};

Page({
  data: {
    storeId: '',
    merchantId: '',
    selectedRoomId: '',
    selectedRoom: {},
    store: {},
    storeCover: config.DEFAULT_STORE_IMAGE,
    rooms: [],
    loading: true,
    startTime: '',
    endTime: '',
    hours: '',
    packageName: '',
    bookingEnabled: false,
    flowText: {},
    serviceMeta: SERVICE_META.generic
  },

  onLoad(options = {}) {
    const bookingEnabled = false;
    const serviceMeta = this.getModeServiceMeta(this.buildMetaFromOptions(options, bookingEnabled), bookingEnabled);
    this.setData({
      storeId: options.storeId || '',
      merchantId: options.merchantId || '',
      selectedRoomId: options.selectedRoomId || '',
      startTime: options.startTime || '',
      endTime: options.endTime || '',
      hours: options.hours || '',
      packageName: decodeURIComponent(options.packageName || ''),
      bookingEnabled,
      flowText: this.getFlowText(bookingEnabled),
      serviceMeta
    });
    if (this.data.merchantId && app.setActiveMerchantId) app.setActiveMerchantId(this.data.merchantId);
    this.loadPageData();
  },

  resolveBookingEnabled(...sources) {
    return bookingModeUtil.resolveBookingEnabled(...sources);
  },

  getFlowText(bookingEnabled = this.data.bookingEnabled) {
    return bookingEnabled
      ? {
          defaultPackageName: '按小时预约',
          currentFilterText: '当前可约',
          legendAvailable: '可约',
          legendBooked: '已预约',
          legendDisabled: '不可约',
          unavailableRoomText: '当前资源不可约',
          timelineLabel: '今日可约时段'
        }
      : {
          defaultPackageName: '按小时使用',
          currentFilterText: '当前可用',
          legendAvailable: '可用',
          legendBooked: '使用中',
          legendDisabled: '不可用',
          unavailableRoomText: '当前资源不可用',
          timelineLabel: '今日时段'
        };
  },

  getModeServiceMeta(meta = SERVICE_META.generic, bookingEnabled = this.data.bookingEnabled) {
    const resourceLabel = meta.resourceLabel || '资源';
    return {
      ...meta,
      selectPageTitle: bookingEnabled ? `选择预约${resourceLabel}` : (meta.selectPageTitle || `选择${resourceLabel}`),
      emptyText: bookingEnabled ? `暂无可预约${resourceLabel}` : (meta.emptyText || `暂无可展示${resourceLabel}`)
    };
  },

  buildMetaFromOptions(options = {}, bookingEnabled = false) {
    const resourceLabel = decodeURIComponent(options.resourceLabel || '');
    const categoryTitle = decodeURIComponent(options.categoryTitle || '');
    const priceUnitText = decodeURIComponent(options.priceUnitText || '');
    const base = resourceLabel.includes('洗车') || categoryTitle.includes('洗车')
      ? SERVICE_META.carwash
      : (resourceLabel.includes('球台') || categoryTitle.includes('台球') ? SERVICE_META.billiards : SERVICE_META.generic);
    return {
      ...base,
      resourceLabel: resourceLabel || base.resourceLabel,
      categoryTitle: categoryTitle || base.categoryTitle,
      selectPageTitle: resourceLabel ? `${bookingEnabled ? '选择预约' : '选择'}${resourceLabel}` : base.selectPageTitle,
      selectPlaceholder: resourceLabel ? `请选择${resourceLabel}` : base.selectPlaceholder,
      emptyText: resourceLabel ? `${bookingEnabled ? '暂无可预约' : '暂无可展示'}${resourceLabel}` : base.emptyText,
      priceUnitText: priceUnitText || base.priceUnitText
    };
  },

  onPullDownRefresh() {
    this.loadPageData();
    setTimeout(() => wx.stopPullDownRefresh(), 1200);
  },

  loadPageData() {
    this.setData({ loading: true });
    this.loadStore().then(() => this.loadRooms()).finally(() => {
      this.setData({ loading: false });
    });
  },

  loadStore() {
    if (!this.data.storeId) return Promise.resolve();
    return storeApi.getStoreWithBookingMode(this.data.storeId).then(res => {
      const store = res.data || {};
      store.name = store.storeName || store.name;
      const cover = this.pickImage(store.coverUrl || store.logoUrl || (store.images && store.images[0]));
      const bookingEnabled = this.resolveBookingEnabled(store);
      const serviceMeta = this.getModeServiceMeta(this.getServiceMeta(store), bookingEnabled);
      store.categoryTitle = serviceMeta.categoryTitle;
      this.setData({
        store,
        storeCover: cover || config.DEFAULT_STORE_IMAGE,
        bookingEnabled,
        flowText: this.getFlowText(bookingEnabled),
        serviceMeta
      });
    }).catch(err => {
      console.error('加载门店详情失败:', err);
    });
  },

  loadRooms() {
    if (!this.data.merchantId) {
      this.setData({ rooms: [] });
      return Promise.resolve();
    }

    return roomApi.getRooms(this.data.merchantId, 1, 100, this.data.storeId).then(res => {
      const data = res.data;
      const rawRooms = data && Array.isArray(data.list)
        ? data.list
        : (data && Array.isArray(data.records) ? data.records : (Array.isArray(data) ? data : []));
      const scopedRooms = this.filterRoomsForCurrentStore(rawRooms);
      const bookingEnabled = this.resolveBookingEnabled(this.data.store);
      const serviceMeta = this.getModeServiceMeta(this.getServiceMeta(this.data.store, scopedRooms), bookingEnabled);
      const rooms = scopedRooms
        .filter(room => room.isShowInApp !== 0)
        .map((room, index) => this.normalizeRoom(room, index, serviceMeta, bookingEnabled));
      const sortedRooms = this.sortRoomsByBookable(rooms, bookingEnabled);

      this.setData({
        rooms: sortedRooms,
        bookingEnabled,
        flowText: this.getFlowText(bookingEnabled),
        serviceMeta
      });
      this.ensureSelectedRoom(sortedRooms, bookingEnabled);
      return this.loadRoomTimelines(sortedRooms);
    }).catch(err => {
      console.error('加载资源失败:', err);
      this.setData({ rooms: [] });
    });
  },

  normalizeRoom(room, index, serviceMeta, bookingEnabled = this.data.bookingEnabled) {
    const tags = this.parseTags(room.tags);
    const image = this.pickImage(room.resourcePhoto || room.image || room.coverUrl);
    const price = room.unitPrice || room.price || room.pricePerHour || room.hourPrice;
    const normalizedPrice = this.normalizePrice(price);
    return {
      ...room,
      name: room.resourceName || room.name || `${serviceMeta.resourceLabel}${index + 1}`,
      image: image || serviceMeta.fallbackImage || config.DEFAULT_ROOM_IMAGE,
      pricePerHour: normalizedPrice ? this.formatPrice(normalizedPrice) : '--',
      priceUnitText: this.getPriceUnitText(room, serviceMeta),
      capacityText: this.getCapacityText(room, tags),
      tagList: tags.slice(0, 2),
      supportText: this.getSupportText(room, tags),
      rawStatusText: resourceStatus.collectStatusText(room),
      bookable: this.isResourceBookable(room, bookingEnabled),
      availabilityText: this.getAvailabilityText(room, bookingEnabled),
      statusClass: this.getStatusClass(room, bookingEnabled),
      sortIndex: index,
      timeline: this.buildEmptyTimeline()
    };
  },

  sortRoomsByBookable(rooms = [], bookingEnabled = this.data.bookingEnabled) {
    return [...rooms].sort((a, b) => {
      const aRank = this.isResourceBookable(a, bookingEnabled) ? 0 : 1;
      const bRank = this.isResourceBookable(b, bookingEnabled) ? 0 : 1;
      if (aRank !== bRank) return aRank - bRank;
      return Number(a.sortIndex || 0) - Number(b.sortIndex || 0);
    });
  },

  filterRoomsForCurrentStore(rooms) {
    const storeId = `${this.data.storeId || ''}`;
    if (!storeId) return rooms;
    const withStore = rooms.filter(room => this.getRoomStoreId(room));
    if (!withStore.length) return rooms;
    return rooms.filter(room => `${this.getRoomStoreId(room)}` === storeId);
  },

  getRoomStoreId(room = {}) {
    return room.storeId || room.storeID || room.store_id ||
      (room.store && room.store.id) ||
      (room.storeInfo && room.storeInfo.id) || '';
  },

  normalizePrice(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return 0;
    return num >= 100 ? num / 100 : num;
  },

  formatPrice(price) {
    return Number.isInteger(price) ? `${price}` : price.toFixed(2).replace(/\.00$/, '');
  },

  getPriceUnitText(room, serviceMeta) {
    const unitText = `${room.unitName || room.priceUnit || room.unit || ''}`;
    if (unitText.includes('次')) return '/次起';
    if (unitText.includes('小时') || unitText.toLowerCase().includes('hour')) return '/小时起';
    return serviceMeta.priceUnitText;
  },

  loadRoomTimelines(rooms) {
    const today = this.getTodayDate();
    const tasks = rooms.map(room => this.loadRoomTimeline(room, today));
    return Promise.all(tasks);
  },

  loadRoomTimeline(room, date) {
    const loadBillingTimeline = () => (
      request(`/api/billing/timeline/${room.id}?date=${date}`).then(res => {
        const timeline = this.normalizeTimeline(res.data || res);
        this.updateRoom(room.id, { timeline });
      }).catch(err => {
        console.error('加载资源时间轴失败', room.id, err);
      })
    );

    return roomApi.getAvailableSlots(this.data.merchantId, room.id, date, {
      storeId: this.data.storeId,
      durationMinutes: Math.max(60, Number(this.data.hours || 1) * 60),
      slotStepMinutes: 60
    }).then(res => {
      if (!this.extractTimelineSlots(res.data || res).length) return loadBillingTimeline();
      const timeline = this.normalizeTimeline(res.data || res);
      this.updateRoom(room.id, { timeline });
      return null;
    }).catch(() => loadBillingTimeline());
  },

  normalizeTimeline(data) {
    const source = this.extractTimelineSlots(data);
    if (!source.length) return this.buildEmptyTimeline();

    const blocks = this.buildEmptyTimeline();
    source.forEach(slot => {
      const start = slot.startTime || slot.start || slot.beginTime || slot.time || '';
      const hour = this.parseHour(start);
      const idx = Math.max(0, Math.min(23, hour)) - 12;
      if (idx >= 0 && idx < blocks.length) {
        const status = this.normalizeSlotStatus(
          this.getSlotStatusValue(slot),
          slot
        );
        blocks[idx].status = status === 'available' ? 'available' : status;
      }
    });
    return blocks;
  },

  extractTimelineSlots(data) {
    if (Array.isArray(data)) {
      if (data[0] && Array.isArray(data[0].timeline)) return data[0].timeline;
      return data.map(slot => (slot && typeof slot === 'object' ? slot : { startTime: slot, status: 'available' }));
    }
    if (!data || typeof data !== 'object') return [];
    if (Array.isArray(data.timeline)) return data.timeline;
    if (Array.isArray(data.availableSlots)) return data.availableSlots;
    if (Array.isArray(data.slots)) return data.slots;
    if (Array.isArray(data.timeSlots)) return data.timeSlots;
    if (Array.isArray(data.list)) return data.list;
    if (Array.isArray(data.records)) return data.records;
    if (Array.isArray(data.bookedSlots)) {
      return data.bookedSlots.map(slot => {
        const item = slot && typeof slot === 'object' ? slot : { startTime: slot };
        return { ...item, status: item.status || 'booked' };
      });
    }
    if (data.data && data.data !== data) return this.extractTimelineSlots(data.data);
    if (data.result && data.result !== data) return this.extractTimelineSlots(data.result);
    return [];
  },

  getSlotStatusValue(slot = {}) {
    const keys = ['status', 'state', 'bookingStatus', 'availableStatus', 'availabilityStatus', 'statusText', 'stateText'];
    for (const key of keys) {
      const value = slot[key];
      if (value !== undefined && value !== null && value !== '') return value;
    }
    if (slot.available === false || slot.isAvailable === false || slot.bookable === false) return 'booked';
    if (slot.available === true || slot.isAvailable === true || slot.bookable === true) return 'available';
    return '';
  },

  normalizeSlotStatus(status, slot = {}) {
    if (slot.available === false || slot.isAvailable === false || slot.bookable === false) return 'booked';
    if (slot.available === true || slot.isAvailable === true || slot.bookable === true) {
      if (status === undefined || status === null || status === '') return 'available';
    }
    if (typeof status === 'number' || (status !== '' && Number.isFinite(Number(status)))) {
      const code = Number(status);
      if (code === 0) return 'available';
      if (code === 1 || code === 2) return 'booked';
      if (code === 3 || code === 4 || code === 5) return 'disabled';
    }
    const text = String(status || '').toLowerCase();
    if (!text) return 'available';
    if (['available', 'free', 'idle', 'open'].includes(text) || text.includes('可约') || text.includes('空闲')) return 'available';
    if (['occupied', 'booked', 'using', 'reserved', 'paid', 'unavailable', 'locked'].includes(text)) return 'booked';
    if (text.includes('已约') || text.includes('预订') || text.includes('预约中') || text.includes('占用') || text.includes('使用中')) return 'booked';
    if (text.includes('待打扫') || text.includes('待清洁') || text.includes('清扫') || text.includes('清洁') || text.includes('保洁')) return 'cleaning';
    if (['past', 'disabled', 'closed'].includes(text)) return 'disabled';
    if (text.includes('维护') || text.includes('维修') || text.includes('停用') || text.includes('休息') || text.includes('不可约') || text.includes('不可用')) return 'disabled';
    return 'available';
  },

  buildEmptyTimeline() {
    const blocks = [];
    for (let i = 12; i < 24; i++) blocks.push({ status: 'disabled' });
    return blocks;
  },

  parseHour(value) {
    if (value === undefined || value === null || value === '') return 0;
    if (typeof value === 'number') return Math.max(0, Math.min(23, Math.floor(value)));
    const text = String(value);
    const match = text.match(/T(\d{1,2}):/) || text.match(/\b(\d{1,2}):\d{2}\b/);
    return match ? Number(match[1]) : 0;
  },

  updateRoom(roomId, patch) {
    const rooms = this.sortRoomsByBookable(
      this.data.rooms.map(room => room.id === roomId ? { ...room, ...patch } : room)
    );
    this.setData({ rooms });
    if (this.data.selectedRoomId == roomId) this.ensureSelectedRoom(rooms);
  },

  ensureSelectedRoom(rooms, bookingEnabled = this.data.bookingEnabled) {
    if (!rooms.length) {
      this.setData({ selectedRoom: {}, selectedRoomId: '' });
      return;
    }
    const currentRoom = rooms.find(item => `${item.id}` === `${this.data.selectedRoomId}`);
    const room = currentRoom && this.isResourceBookable(currentRoom, bookingEnabled)
      ? currentRoom
      : rooms.find(item => this.isResourceBookable(item, bookingEnabled));
    this.setData({
      selectedRoomId: room ? room.id : '',
      selectedRoom: room || {}
    });
  },

  selectRoom(e) {
    const id = e.currentTarget.dataset.id;
    const room = this.data.rooms.find(item => `${item.id}` === `${id}`);
    if (!room) return;
    if (!this.isResourceBookable(room, this.data.bookingEnabled)) {
      wx.showToast({ title: this.data.flowText.unavailableRoomText || '当前资源不可用', icon: 'none' });
      return;
    }
    this.setData({ selectedRoomId: id, selectedRoom: room });
  },

  confirmSelect() {
    if (!this.data.selectedRoom.id) {
      wx.showToast({ title: `请选择${this.data.serviceMeta.resourceLabel}`, icon: 'none' });
      return;
    }
    if (!this.isResourceBookable(this.data.selectedRoom, this.data.bookingEnabled)) {
      wx.showToast({ title: this.data.flowText.unavailableRoomText || '当前资源不可用', icon: 'none' });
      return;
    }
    const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel();
    if (eventChannel && eventChannel.emit) {
      eventChannel.emit('selectRoom', { room: this.data.selectedRoom });
    }
    wx.navigateBack();
  },

  goBack() {
    wx.navigateBack();
  },

  pickImage(url) {
    return url && !String(url).startsWith('file://') ? url : '';
  },

  parseTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return String(tags).split(/[,，、|/\s]+/).filter(Boolean);
  },

  getCapacityText(room, tags) {
    const text = `${room.capacity || ''}${room.maxCapacity || ''}${room.description || ''}${tags.join('')}`;
    const match = text.match(/\d+\s*[-–]\s*\d+\s*人|\d+\s*人/);
    return match ? match[0].replace(/\s/g, '') : '';
  },

  getSupportText(room, tags) {
    const text = `${room.description || ''}${tags.join(' ')}`;
    if (text.includes('夜场')) return '夜场';
    return this.compactText(room.description || tags.join(' / '), 18);
  },

  getAvailabilityText(room, bookingEnabled = this.data.bookingEnabled) {
    return this.normalizeFlowStatusText(resourceStatus.getResourceStatusText(room, { bookingEnabled }), bookingEnabled);
  },

  getStatusClass(room, bookingEnabled = this.data.bookingEnabled) {
    return resourceStatus.getResourceStatusClass(room, { bookingEnabled });
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

  isResourceBookable(room = {}, bookingEnabled = this.data.bookingEnabled) {
    return resourceStatus.isResourceBookable(room, { bookingEnabled });
  },

  getTodayDate() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  compactText(value, maxLength) {
    const text = String(value || '').replace(/\s+/g, '');
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  },

  getServiceMeta(store = {}, rooms = []) {
    const roomText = rooms.map(room => [
      room.resourceName,
      room.name,
      room.tags,
      room.description,
      room.resourceType,
      room.type
    ].filter(Boolean).join(' ')).join(' ');
    const text = [
      store.storeName,
      store.name,
      store.tags,
      store.labels,
      store.description,
      store.businessType,
      store.storeType,
      store.categoryName,
      roomText
    ].filter(Boolean).join(' ').toLowerCase();

    if (/洗车|car\s*wash|carwash|汽车服务/.test(text)) return SERVICE_META.carwash;
    if (/台球|桌球|球台|billiard|pool/.test(text)) return SERVICE_META.billiards;
    if (/棋牌|麻将|包间|包房|mahjong/.test(text)) return SERVICE_META.mahjong;
    return this.data.serviceMeta || SERVICE_META.generic;
  }
});
