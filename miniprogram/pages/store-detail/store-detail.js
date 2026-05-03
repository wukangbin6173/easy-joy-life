const { storeApi, roomApi } = require('../../utils/api.js');
const { openCashier } = require('../../utils/payment.js');
const { ensureUserIdentity } = require('../../utils/user-session.js');
const resourceStatus = require('../../utils/resource-status.js');
const config = require('../../utils/config.js');
const locationUtil = require('../../utils/location.js');
const app = getApp();

const DEFAULT_STORE_IMAGE = config.DEFAULT_STORE_IMAGE;
const DEFAULT_ROOM_IMAGE = config.DEFAULT_ROOM_IMAGE;

const SERVICE_META = {
  mahjong: {
    type: 'mahjong',
    categoryTitle: '棋牌',
    projectName: '无人棋牌室',
    resourceLabel: '包间',
    resourcePanelTitle: '选择包间',
    moreResourceText: '查看更多包间',
    emptyResourceText: '暂无可预约包间',
    priceUnitText: '/小时起',
    fallbackImage: DEFAULT_ROOM_IMAGE
  },
  billiards: {
    type: 'billiards',
    categoryTitle: '台球',
    projectName: '无人台球',
    resourceLabel: '球台',
    resourcePanelTitle: '选择球台',
    moreResourceText: '查看更多球台',
    emptyResourceText: '暂无可预约球台',
    priceUnitText: '/小时起',
    fallbackImage: '/images/台球预约.png'
  },
  carwash: {
    type: 'carwash',
    categoryTitle: '洗车',
    projectName: '自助洗车',
    resourceLabel: '洗车服务',
    resourcePanelTitle: '选择洗车服务',
    moreResourceText: '查看更多服务',
    emptyResourceText: '暂无可预约洗车服务',
    priceUnitText: '/次起',
    fallbackImage: '/images/自助洗车.png'
  },
  generic: {
    type: 'generic',
    categoryTitle: '服务',
    projectName: '预约服务',
    resourceLabel: '资源',
    resourcePanelTitle: '选择预约资源',
    moreResourceText: '查看更多资源',
    emptyResourceText: '暂无可预约资源',
    priceUnitText: '/小时起',
    fallbackImage: DEFAULT_ROOM_IMAGE
  }
};

Page({
  data: {
    storeId: null,
    merchantId: null,
    store: {},
    rooms: [],
    walletBalance: 0,
    userPoints: 0,
    pointsRate: 2,
    // 时间轴
    timelineHours: [],
    defaultTimeline: [],
    // 预订弹窗
    showBooking: false,
    selectedRoom: {},
    bookingMode: 'time',
    roomCount: 1,
    dates: [],
    selectedDate: '',
    selectedDateLabel: '今天',
    // 时长快捷筛选
    selectedDuration: 0,
    // 时间格子
    timeSlots: [],
    selectedHours: 0,
    totalPrice: 0,
    // 套餐
    packages: [],
    packageNames: [],
    selectedPackageIdx: -1,
    // 时间选择
    startTimeStr: '',
    endTimeStr: '',
    startHour: -1,
    endHour: -1,
    startTimeOptions: [],
    displayStartTimeOptions: [],
    showAllStartTimes: false,
    startTimeHasMore: false,
    timeOptionsEmptyText: '暂无可选时间',
    durationOptions: [
      { label: '1小时', hours: 1 },
      { label: '2小时', hours: 2 },
      { label: '3小时', hours: 3 },
      { label: '4小时', hours: 4 },
      { label: '5小时', hours: 5 },
      { label: '6小时', hours: 6 },
      { label: '7小时', hours: 7 },
      { label: '8小时', hours: 8 }
    ],
    displayDurationOptions: [
      { label: '1小时', hours: 1 },
      { label: '2小时', hours: 2 },
      { label: '3小时', hours: 3 },
      { label: '4小时', hours: 4 },
      { label: '5小时', hours: 5 },
      { label: '6小时', hours: 6 },
      { label: '7小时', hours: 7 },
      { label: '8小时', hours: 8 }
    ],
    showAllDurations: false,
    durationHasMore: false,
    bookingPackages: [],
    selectedPackageName: '',
    selectedPackageIntro: '',
    isFixedTime: false,
    pkgDurationHours: 0,
    pkgStartLimit: '00:00',
    pkgEndLimit: '23:59',
    // 手机验证弹窗
    showPhoneModal: false,
    modalPhone: '',
    modalCode: '',
    modalCountdown: 0,
    modalLoading: false,
    showConfirmModal: false,
    confirmInfo: {},
    isFavorited: false,
    serviceMeta: SERVICE_META.generic
  },

  onLoad(options) {
    const merchantId = options.merchantId || (app.getActiveMerchantId ? app.getActiveMerchantId() : null);
    if (merchantId && app.setActiveMerchantId) app.setActiveMerchantId(merchantId);
    this.setData({
      storeId: options.id,
      merchantId: merchantId || null
    });
    this.initDates();
    this.initTimeline();
    this.loadStoreDetail();
    // 检查是否已收藏
    this.setData({ isFavorited: this.isStoreFavorited(options.id) });
  },

  onShow() {
    if (wx.getStorageSync('bookingPaymentChanged')) {
      wx.removeStorageSync('bookingPaymentChanged');
      this.loadRooms();
    }
    this.loadWalletInfo();
  },

  onPullDownRefresh() {
    this.loadStoreDetail();
    this.loadRooms();
    this.loadWalletInfo();
    setTimeout(() => wx.stopPullDownRefresh(), 2000);
  },

  // ========== 初始化 ==========

  initDates() {
    const labels = ['今天', '明天'];
    const dates = [];
    for (let i = 0; i < 2; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push({
        value: this.formatDateValue(d),
        label: labels[i] || `${mm}-${dd}`,
        short: `${mm}-${dd}`
      });
    }
    this.setData({ dates, selectedDate: dates[0].value, selectedDateLabel: dates[0].label });
  },

  formatDateValue(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  initTimeline() {
    // 生成时间轴刻度 0-24
    const hours = [];
    for (let i = 0; i <= 24; i += 2) {
      hours.push(i);
    }
  // 生成默认时间轴段（仅在接口未返回时间轴时使用状态兜底）
    const now = new Date();
    const currentHour = now.getHours();
    const timeline = [];
    for (let h = 0; h < 24; h++) {
      let status = 'available';
      if (h < currentHour) status = 'past';
      timeline.push({ hour: h, status, width: 100 / 24 });
    }
    this.setData({ timelineHours: hours, defaultTimeline: timeline });
  },

  initStartTimeOptions() {
    this.refreshStartTimeOptions(this.data.selectedRoom);
  },

  getOptionDisplayState(list = [], expanded = false, limit = 8) {
    const source = Array.isArray(list) ? list : [];
    return {
      items: expanded ? source : source.slice(0, limit),
      hasMore: source.length > limit
    };
  },

  getStartTimeDisplayState(options = this.data.startTimeOptions, expanded = this.data.showAllStartTimes, preferredHour) {
    const source = Array.isArray(options) ? options : [];
    if (expanded) {
      return {
        displayStartTimeOptions: source,
        startTimeHasMore: source.length > 8
      };
    }

    let startIndex = -1;
    if (preferredHour !== undefined && preferredHour !== null && preferredHour >= 0) {
      startIndex = source.findIndex(item => Number(item.hour) === Number(preferredHour));
    }
    if (startIndex < 0) startIndex = source.findIndex(item => !item.disabled);
    if (startIndex < 0) startIndex = 0;

    return {
      displayStartTimeOptions: source.slice(startIndex, startIndex + 8),
      startTimeHasMore: source.length > 8
    };
  },

  getDurationDisplayState(options = this.data.durationOptions, expanded = this.data.showAllDurations) {
    const state = this.getOptionDisplayState(options, expanded, 8);
    return {
      displayDurationOptions: state.items,
      durationHasMore: state.hasMore
    };
  },

  refreshStartTimeOptions(room = this.data.selectedRoom) {
    const options = this.buildStartTimeOptions(room);
    const first = options.find(item => !item.disabled);
    const preferredHour = first ? first.hour : this.data.startHour;
    const timeDisplayState = this.getStartTimeDisplayState(options, this.data.showAllStartTimes, preferredHour);
    if (!first) {
      this.setData({
        startTimeOptions: options,
        ...timeDisplayState,
        startHour: -1,
        startTimeStr: '',
        endHour: -1,
        endTimeStr: '',
        totalPrice: 0,
        timeOptionsEmptyText: options.length ? '当前没有可用开始时间' : '暂无真实可约时间'
      });
      return;
    }
    const selectedHours = this.data.selectedHours > 0 ? this.data.selectedHours : 1;
    this.setData({
      startTimeOptions: options,
      ...timeDisplayState,
      startHour: first.hour,
      startTimeStr: first.label,
      selectedHours,
      endHour: first.hour + selectedHours,
      endTimeStr: this.formatHourValue(first.hour + selectedHours),
      timeOptionsEmptyText: ''
    }, () => {
      this.refreshBookingPackageStates();
      this.updateTotalPrice();
    });
  },

  buildStartTimeOptions(room = {}, durationHours = this.data.selectedHours || 1, packageForTime) {
    if (!this.isResourceBookable(room)) return [];

    const intervals = this.buildSlotIntervals(room);
    if (!intervals.length) return [];

    const currentMinutes = this.getCurrentMinutesForSelectedDate();
    const selectedPackage = packageForTime || this.data.bookingPackages[this.data.selectedPackageIdx];
    const optionsByMinutes = {};
    const safeDuration = Math.max(1, Number(durationHours) || 1);
    const durationMinutes = Math.round(safeDuration * 60);
    const stepMinutes = 60;

    intervals.forEach(interval => {
      const latestStart = interval.status === 'available'
        ? interval.end - durationMinutes
        : interval.end - stepMinutes;
      for (let startMinutes = interval.start; startMinutes <= latestStart; startMinutes += stepMinutes) {
        const rangeAvailable = interval.status === 'available' &&
          this.isTimeRangeAvailable(startMinutes / 60, safeDuration, room);
        const endHour = (startMinutes + durationMinutes) / 60;
        const packageReason = rangeAvailable
          ? this.getPackageUnavailableReason(selectedPackage, startMinutes / 60, endHour)
          : '';
        const option = {
          minutes: startMinutes,
          hour: startMinutes / 60,
          label: this.formatMinutes(startMinutes),
          disabled: !rangeAvailable || !!packageReason || startMinutes <= currentMinutes,
          disabledReason: packageReason,
          status: interval.status
        };
        const existing = optionsByMinutes[startMinutes];
        if (!existing || (existing.disabled && !option.disabled)) {
          optionsByMinutes[startMinutes] = option;
        }
      }
    });

    return Object.keys(optionsByMinutes)
      .map(key => optionsByMinutes[key])
      .sort((a, b) => a.minutes - b.minutes);
  },

  getSlotStatusValue(slot = {}) {
    const keys = [
      'status',
      'state',
      'bookingStatus',
      'availableStatus',
      'availabilityStatus',
      'statusText',
      'stateText'
    ];
    for (const key of keys) {
      const value = slot[key];
      if (value !== undefined && value !== null && value !== '') return value;
    }
    if (slot.available === false || slot.isAvailable === false || slot.bookable === false) return 'booked';
    if (slot.available === true || slot.isAvailable === true || slot.bookable === true) return 'available';
    return '';
  },

  buildSlotIntervals(room = {}) {
    const slots = Array.isArray(room.timelineSlots) ? room.timelineSlots : [];
    return slots.map(slot => {
      const start = this.parseSlotMinutes(slot.startTime || slot.start || slot.beginTime || slot.time);
      if (start < 0) return null;
      const end = this.parseSlotMinutes(slot.endTime || slot.end || slot.finishTime || slot.endAt);
      const status = this.normalizeSlotStatus(this.getSlotStatusValue(slot), slot);
      return {
        start,
        end: end > start ? end : start + 60,
        status
      };
    }).filter(Boolean).sort((a, b) => a.start - b.start);
  },

  isTimeRangeAvailable(startHour, hours, room = this.data.selectedRoom) {
    const safeHours = Math.max(1, Number(hours) || 1);
    const startMinutes = Math.round(Number(startHour) * 60);
    const endMinutes = startMinutes + Math.round(safeHours * 60);
    if (!Number.isFinite(startMinutes) || startMinutes < 0 || endMinutes > 24 * 60) return false;
    if (this.isSelectedDateToday() && startMinutes <= this.getCurrentMinutesForSelectedDate()) return false;

    const intervals = this.buildSlotIntervals(room);
    if (!intervals.length) return false;

    let cursor = startMinutes;
    while (cursor < endMinutes) {
      const hit = intervals.find(item =>
        item.status === 'available' && item.start <= cursor && item.end > cursor
      );
      if (!hit) return false;
      cursor = Math.min(hit.end, endMinutes);
    }
    return true;
  },

  findFirstAvailableStartForDuration(hours, room = this.data.selectedRoom, packageForTime) {
    const options = this.buildStartTimeOptions(room, hours, packageForTime);
    const first = options.find(item => !item.disabled);
    return first ? first.hour : -1;
  },

  getCurrentMinutesForSelectedDate() {
    if (!this.isSelectedDateToday()) return -1;
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  },

  parseSlotMinutes(value) {
    if (value === undefined || value === null || value === '') return -1;
    if (typeof value === 'number') {
      const minutes = value > 24 ? value : value * 60;
      return Math.max(0, Math.min(24 * 60, Math.floor(minutes)));
    }
    const match = String(value).match(/T?(\d{1,2}):(\d{2})/) || String(value).match(/\b(\d{1,2}):(\d{2})\b/);
    if (!match) return -1;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return -1;
    return Math.max(0, Math.min(24 * 60, hour * 60 + minute));
  },

  isSelectedDateToday() {
    const selectedDate = String(this.data.selectedDate || this.formatDateValue(new Date())).replace(/-/g, '/');
    const selected = new Date(selectedDate);
    if (Number.isNaN(selected.getTime())) return true;
    return this.isSameDate(selected, new Date());
  },

  formatMinutes(minutes) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  },

  formatHourValue(hourValue) {
    return this.formatMinutes(Math.round(hourValue * 60));
  },

  // ========== 数据加载 ==========

  loadStoreDetail() {
    storeApi.getStoreById(this.data.storeId).then(res => {
      let store = res.data || {};
      store.name = store.storeName || store.name;
      const validCover = store.coverUrl && !store.coverUrl.startsWith('file://') ? store.coverUrl : null;
      const validLogo = store.logoUrl && !store.logoUrl.startsWith('file://') ? store.logoUrl : null;
      store.images = validCover ? [validCover] : (validLogo ? [validLogo] : [DEFAULT_STORE_IMAGE]);
      store.phone = store.contactPhone || store.phone;
      store.description = this.resolveStoreDescription(store);
      const serviceMeta = this.getServiceMeta(store);
      store.categoryTitle = serviceMeta.categoryTitle;
      store.displayTags = this.buildStoreTags(store);
      // 计算距离
      const loc = app.globalData.currentLocation;
      const km = locationUtil.resolveDistanceKm(store, loc);
      if (km !== null && km !== undefined) {
        store.distance = locationUtil.formatDistance(km);
      }
      const resolvedMerchantId = store.merchantId || store.merchantID || this.data.merchantId;
      const merchantChanged = resolvedMerchantId && `${resolvedMerchantId}` !== `${this.data.merchantId || ''}`;
      if (merchantChanged && app.setActiveMerchantId) app.setActiveMerchantId(resolvedMerchantId);
      this.setData({
        store,
        merchantId: resolvedMerchantId || this.data.merchantId,
        serviceMeta
      }, () => {
        this.loadRooms();
        if (resolvedMerchantId || this.data.merchantId) this.loadWalletInfo();
      });
    }).catch(err => {
      console.error('加载门店详情失败:', err);
      this.setData({
        store: {
          name: '门店信息待同步',
          images: [DEFAULT_STORE_IMAGE],
          address: '门店地址待同步'
        }
      });
    });
  },

  loadRooms() {
    if (!this.data.merchantId) {
      this.clearRoomState();
      return;
    }
    roomApi.getRooms(this.data.merchantId, 1, 100, this.data.storeId).then(res => {
      let rooms = [];
      const data = res.data;
      if (data && Array.isArray(data.list)) rooms = data.list;
      else if (data && Array.isArray(data.records)) rooms = data.records;
      else if (Array.isArray(data)) rooms = data;

      rooms = this.filterRoomsForCurrentStore(rooms).filter(room => room.isShowInApp !== 0);
      const serviceMeta = this.getServiceMeta(this.data.store, rooms);
      const store = {
        ...this.data.store,
        categoryTitle: serviceMeta.categoryTitle,
        displayTags: this.buildStoreTags(this.data.store)
      };
      rooms = rooms.map((room, index) => this.normalizeRoom(room, index, serviceMeta));
      this.setData({ serviceMeta, store });

      // Prefer schedule-based available slots, then fall back to the billing timeline.
      const dateStr = this.data.selectedDate || this.formatDateValue(new Date());
      const timelinePromises = rooms.map(room => this.loadRoomAvailability(room, dateStr));

      Promise.all(timelinePromises).then(() => {
        this.applyLocalPaidBooking(rooms, dateStr);
        const sortedRooms = this.sortRoomsByBookable(rooms);
        this.setData({ rooms: sortedRooms, selectedRoom: {} });
        this.ensureSelectedRoom(sortedRooms);
      });
    }).catch(err => {
      console.error('加载房间失败:', err);
      this.clearRoomState();
    });
  },

  loadRoomAvailability(room, dateStr) {
    if (!room || !room.id || !this.isResourceBookable(room)) {
      room.timeline = [];
      room.timelineSlots = [];
      return Promise.resolve();
    }

    const merchantId = this.data.merchantId || room.merchantId || (app.getActiveMerchantId ? app.getActiveMerchantId() : config.DEFAULT_MERCHANT_ID);
    const storeId = this.data.storeId || this.getRoomStoreId(room);
    const loadBillingTimeline = () => {
      const { request } = require('../../utils/api.js');
      return request(`/api/billing/timeline/${room.id}?date=${dateStr}`).then(r => {
        const slots = this.extractTimelineSlots(r.data || r);
        this.applyRoomTimelineSlots(room, slots);
      }).catch(() => {
        room.timeline = [];
        room.timelineSlots = [];
      });
    };

    if (!merchantId) return loadBillingTimeline();

    return roomApi.getAvailableSlots(merchantId, room.id, dateStr, {
      storeId,
      durationMinutes: 60,
      slotStepMinutes: 60
    }).then(res => {
      const slots = this.extractAvailableSlots(res.data || res);
      if (slots.length) {
        this.applyRoomTimelineSlots(room, slots.map(slot => this.normalizeAvailableSlot(slot)).filter(Boolean));
        return null;
      }
      return loadBillingTimeline();
    }).catch(() => loadBillingTimeline());
  },

  applyRoomTimelineSlots(room, slots = []) {
    const normalizedSlots = (Array.isArray(slots) ? slots : [])
      .map(slot => this.normalizeAvailableSlot(slot))
      .filter(Boolean);

    room.timelineSlots = normalizedSlots;
    if (normalizedSlots.length) {
      const pricedSlot = normalizedSlots.find(slot => slot.price || slot.unitPrice);
      if (pricedSlot) {
        const timelinePrice = this.normalizePrice(pricedSlot.price || pricedSlot.unitPrice);
        if (timelinePrice) {
          room.pricePerHour = timelinePrice;
          room.priceText = this.formatPrice(timelinePrice);
        }
      }
      room.timeline = this.normalizeTimeline(normalizedSlots);
    } else {
      room.timeline = [];
    }
  },

  extractAvailableSlots(data) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== 'object') return [];

    const keys = ['availableSlots', 'slots', 'timeSlots', 'list', 'records', 'items', 'timeline'];
    for (const key of keys) {
      if (Array.isArray(data[key])) return data[key];
    }
    if (data.data && data.data !== data) return this.extractAvailableSlots(data.data);
    if (data.result && data.result !== data) return this.extractAvailableSlots(data.result);
    if (data.page && data.page !== data) return this.extractAvailableSlots(data.page);
    return [];
  },

  normalizeAvailableSlot(slot) {
    const item = slot && typeof slot === 'object' ? slot : { startTime: slot };
    const startTime = item.startTime || item.start || item.beginTime || item.begin || item.time || item.slotTime;
    if (startTime === undefined || startTime === null || startTime === '') return null;

    const startMinutes = this.parseSlotMinutes(startTime);
    if (startMinutes < 0) return null;

    const rawEnd = item.endTime || item.end || item.finishTime || item.finish || item.endAt;
    const endMinutes = rawEnd ? this.parseSlotMinutes(rawEnd) : Math.min(24 * 60, startMinutes + 60);
    const status = this.normalizeSlotStatus(this.getSlotStatusValue(item), item);

    return {
      ...item,
      startTime: this.formatMinutes(startMinutes),
      endTime: endMinutes > startMinutes ? this.formatMinutes(endMinutes) : this.formatMinutes(Math.min(24 * 60, startMinutes + 60)),
      status
    };
  },

  clearRoomState() {
    this.setData({
      rooms: [],
      selectedRoom: {},
      bookingPackages: [],
      selectedPackageIdx: -1,
      selectedPackageName: '',
      selectedPackageIntro: '',
      startTimeOptions: [],
      displayStartTimeOptions: [],
      showAllStartTimes: false,
      startTimeHasMore: false,
      startHour: -1,
      startTimeStr: '',
      endHour: -1,
      endTimeStr: '',
      totalPrice: 0
    });
  },

  filterRoomsForCurrentStore(rooms) {
    const storeId = `${this.data.storeId || ''}`;
    if (!storeId) return rooms;

    const roomsWithStoreId = rooms.filter(room => this.getRoomStoreId(room));
    if (!roomsWithStoreId.length) return rooms;

    const filtered = rooms.filter(room => `${this.getRoomStoreId(room)}` === storeId);
    if (filtered.length !== rooms.length) {
      console.warn('已过滤非当前门店资源:', {
        storeId,
        before: rooms.length,
        after: filtered.length
      });
    }
    return filtered;
  },

  getRoomStoreId(room = {}) {
    return room.storeId || room.storeID || room.store_id ||
      (room.store && room.store.id) ||
      (room.storeInfo && room.storeInfo.id) || '';
  },

  normalizeRoom(room, index, serviceMeta) {
    const tags = this.parseTags(room.tags || room.labels || room.featureTags);
    const price = this.normalizePrice(room.unitPrice || room.price || room.pricePerHour || room.hourPrice);
    const image = this.pickResourceImage(room, serviceMeta);
    return {
      ...room,
      name: room.resourceName || room.name || `${serviceMeta.resourceLabel}${index + 1}`,
      image,
      pricePerHour: price,
      priceText: price ? this.formatPrice(price) : '--',
      priceUnitText: this.getPriceUnitText(room, serviceMeta),
      capacityText: this.formatCapacity(room, tags),
      metaText: this.getResourceMetaText(room, tags, serviceMeta),
      shortDesc: this.getResourceShortDesc(room, tags),
      tagList: tags.slice(0, 2),
      rawStatusText: resourceStatus.collectStatusText(room),
      bookable: this.isResourceBookable(room),
      statusClass: resourceStatus.getResourceStatusClass(room),
      statusText: this.getResourceStatusText(room),
      sortIndex: index
    };
  },

  sortRoomsByBookable(rooms = []) {
    return [...rooms].sort((a, b) => {
      const aRank = this.isResourceBookable(a) ? 0 : 1;
      const bRank = this.isResourceBookable(b) ? 0 : 1;
      if (aRank !== bRank) return aRank - bRank;
      return Number(a.sortIndex || 0) - Number(b.sortIndex || 0);
    });
  },

  pickResourceImage(room, serviceMeta) {
    const image = room.resourcePhoto || room.image || room.coverUrl || room.photoUrl;
    if (image && !String(image).startsWith('file://')) return image;
    return serviceMeta.fallbackImage || DEFAULT_ROOM_IMAGE;
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

  formatCapacity(room, tags = []) {
    const text = `${room.capacity || ''}${room.maxCapacity || ''}${room.description || ''}${tags.join('')}`;
    const match = text.match(/\d+\s*[-–]\s*\d+\s*人|\d+\s*人/);
    if (match) return match[0].replace(/\s/g, '');
    return '';
  },

  getResourceMetaText(room, tags, serviceMeta) {
    if (serviceMeta.type === 'mahjong') return this.formatCapacity(room, tags);
    return tags[0] || room.resourceType || room.type || '';
  },

  getResourceShortDesc(room, tags) {
    const source = room.shortDesc || room.subtitle || room.description || tags[1] || '';
    return this.compactText(source, 8);
  },

  getResourceStatusText(room) {
    return resourceStatus.getResourceStatusText(room);
  },

  isResourceBookable(room = {}) {
    return resourceStatus.isResourceBookable(room);
  },

  compactText(value, maxLength) {
    const text = String(value || '').replace(/\s+/g, '');
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
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

  buildStoreTags(store = {}) {
    const fields = [
      store.tags,
      store.labels,
      store.featureTags,
      store.facilities,
      store.serviceTags
    ];
    const tags = fields.reduce((list, item) => list.concat(this.parseTags(item)), []);
    return [...new Set(tags)].slice(0, 4);
  },

  resolveStoreDescription(store = {}) {
    return this.firstText(
      store.description,
      store.storeDescription,
      store.storeDesc,
      store.introduction,
      store.intro,
      store.storeIntro,
      store.shopIntro,
      store.summary,
      store.content,
      store.remark,
      store.announcement
    );
  },

  firstText(...values) {
    for (const value of values) {
      if (value === undefined || value === null) continue;
      const text = String(value).trim();
      if (text) return text;
    }
    return '';
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
    return SERVICE_META.generic;
  },

  ensureSelectedRoom(rooms) {
    if (!rooms || !rooms.length) {
      this.setData({
        selectedRoom: {},
        bookingPackages: [],
        selectedPackageIdx: -1,
        selectedPackageName: '',
        selectedPackageIntro: '',
        startTimeOptions: [],
        displayStartTimeOptions: [],
        showAllStartTimes: false,
        startTimeHasMore: false,
        totalPrice: 0
      });
      return;
    }
    const currentId = this.data.selectedRoom && this.data.selectedRoom.id;
    const currentRoom = rooms.find(item => `${item.id}` === `${currentId}`);
    const room = currentRoom && this.isResourceBookable(currentRoom)
      ? currentRoom
      : rooms.find(item => this.isResourceBookable(item));
    if (!room) {
      this.setData({
        rooms: this.markSelectedRooms(rooms, {}),
        selectedRoom: {},
        bookingPackages: [],
        selectedPackageIdx: -1,
        selectedPackageName: '',
        selectedPackageIntro: '',
        startTimeOptions: [],
        displayStartTimeOptions: [],
        showAllStartTimes: false,
        startTimeHasMore: false,
        startHour: -1,
        startTimeStr: '',
        endHour: -1,
        endTimeStr: '',
        totalPrice: 0
      });
      return;
    }
    const selectedRoom = { ...room, selected: true };
    this.setData({
      rooms: this.markSelectedRooms(rooms, selectedRoom),
      selectedRoom,
      showAllStartTimes: false
    }, () => {
      this.refreshStartTimeOptions(selectedRoom);
      this.generatePackages(selectedRoom);
    });
  },

  markSelectedRooms(rooms = [], selectedRoom = {}) {
    const selectedId = selectedRoom && selectedRoom.id !== undefined && selectedRoom.id !== null
      ? `${selectedRoom.id}`
      : '';
    return (Array.isArray(rooms) ? rooms : []).map(item => ({
      ...item,
      selected: !!selectedId && `${item.id}` === selectedId
    }));
  },

  attachTimeline(rooms) {
    const now = new Date();
    const ch = now.getHours();
    rooms.forEach(room => {
      const tl = [];
      const bookedHours = this.getBookedHoursForRoom(room.id);
      for (let h = 0; h < 24; h++) {
        let status = 'past';
        if (h < ch) status = 'past';
        else if (bookedHours.includes(h)) status = 'booked';
        tl.push({ hour: h, status, width: 100 / 24 });
      }
      room.timeline = tl;
    });
  },

  applyLocalPaidBooking(rooms, dateStr) {
    const booking = wx.getStorageSync('lastPaidBooking') || {};
    if (!booking.resourceId || !booking.startTime) return;
    if (booking.merchantId && String(booking.merchantId) !== String(this.data.merchantId || '')) return;

    const bookingDate = String(booking.startTime).slice(0, 10);
    if (bookingDate && bookingDate !== dateStr) return;

    const startHour = this.parseTimelineHour(booking.startTime);
    if (startHour < 0) return;

    const durationHours = Math.max(1, Math.ceil(Number(booking.durationMinutes || 60) / 60));
    rooms.forEach(room => {
      if (String(room.id) !== String(booking.resourceId)) return;
      const timeline = room.timeline || this.data.defaultTimeline;
      room.timeline = timeline.map(seg => {
        const h = Number(seg.hour);
        if (h >= startHour && h < startHour + durationHours) {
          return { ...seg, status: 'booked' };
        }
        return seg;
      });
      if (Array.isArray(room.timelineSlots)) {
        room.timelineSlots = room.timelineSlots.map(slot => {
          const minutes = this.parseSlotMinutes(slot.startTime || slot.start || slot.beginTime || slot.time);
          const h = Math.floor(minutes / 60);
          if (h >= startHour && h < startHour + durationHours) {
            return { ...slot, status: 'booked' };
          }
          return slot;
        });
      }
    });
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
        return {
          ...item,
          status: item.status || 'booked'
        };
      });
    }
    if (data.data && data.data !== data) return this.extractTimelineSlots(data.data);
    if (data.result && data.result !== data) return this.extractTimelineSlots(data.result);
    if (data.page && data.page !== data) return this.extractTimelineSlots(data.page);
    return [];
  },

  normalizeTimeline(slots) {
    const timeline = [];
    for (let h = 0; h < 24; h++) {
      timeline.push({ hour: h, status: 'past', width: 100 / 24 });
    }

    slots.forEach(slot => {
      const startHour = this.parseTimelineHour(slot.startTime || slot.start || slot.beginTime || slot.hour);
      const endHour = this.parseTimelineHour(slot.endTime || slot.end || slot.finishTime);
      if (startHour < 0) return;

      const status = this.normalizeSlotStatus(this.getSlotStatusValue(slot), slot);
      const lastHour = endHour > startHour ? Math.min(24, endHour) : startHour + 1;
      for (let h = startHour; h < lastHour && h < 24; h++) {
        timeline[h] = { ...timeline[h], status };
      }
    });

    return timeline;
  },

  parseTimelineHour(value) {
    const minutes = this.parseSlotMinutes(value);
    if (minutes < 0) return -1;
    return Math.floor(minutes / 60);
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
      if (code === 3 || code === 4 || code === 5) return 'past';
    }

    const text = String(status || '').toLowerCase();
    if (!text) return 'available';
    if (['available', 'free', 'idle', 'open'].includes(text)) return 'available';
    if (text.includes('可约') || text.includes('空闲')) return 'available';
    if (['occupied', 'booked', 'using', 'reserved', 'paid', 'unavailable', 'locked'].includes(text)) return 'booked';
    if (text.includes('已约') || text.includes('预订') || text.includes('预约中') || text.includes('占用') || text.includes('使用中')) return 'booked';
    if (text.includes('待打扫') || text.includes('待清洁') || text.includes('清扫') || text.includes('清洁') || text.includes('保洁')) return 'cleaning';
    if (['past', 'disabled', 'closed'].includes(text)) return 'past';
    if (text.includes('维护') || text.includes('维修') || text.includes('停用') || text.includes('休息') || text.includes('不可约') || text.includes('不可用')) return 'past';
    return 'available';
  },

  getBookedHoursForRoom(roomId) {
    return [];
  },

  loadWalletInfo() {
    const openid = app.globalData.openid;
    const userId = app.globalData.userId || wx.getStorageSync('userId');
    console.log('loadWalletInfo - openid:', openid, 'userId:', userId);
    if (!openid) return;
    if (!userId) {
      ensureUserIdentity().then(() => this.loadWalletInfo()).catch(err => {
        console.error('恢复用户身份失败:', err);
      });
      return;
    }
    const { request } = require('../../utils/api.js');
    const merchantId = this.data.merchantId || (app.getActiveMerchantId ? app.getActiveMerchantId() : config.DEFAULT_MERCHANT_ID);

    // 查商起点会员余额，externalUserId 用我们系统的 userId
    request(`/api/member/recharge/info?merchantId=${merchantId}&externalUserId=${userId}`).then(res => {
      console.log('查询参数 - merchantId:', merchantId, 'externalUserId:', userId);
      console.log('会员余额返回:', JSON.stringify(res));
      if (res.success && res.data) {
        this.setData({
          walletBalance: (res.data.balance / 100).toFixed(2),
          userPoints: res.data.rewardBalance || 0
        });
      }
    }).catch(err => { console.error('查询余额失败:', err); });

    request('/api/wallet/points/earn-rate').then(res => {
      if (res.success) this.setData({ pointsRate: res.earnRate || 2 });
    }).catch(() => {});
  },

  // ========== 预订弹窗 ==========

  selectRoomCard(e) {
    this.viewRoomDetail(e);
  },

  applySelectedRoom(room) {
    if (!room || !room.id) return false;
    if (!this.isResourceBookable(room)) {
      wx.showToast({ title: '当前资源不可约', icon: 'none' });
      return false;
    }
    const existingRoom = this.data.rooms.find(item => `${item.id}` === `${room.id}`);
    const selectedRoom = { ...(existingRoom || room), selected: true };
    const rooms = existingRoom ? this.data.rooms : [selectedRoom, ...this.data.rooms];
    this.setData({
      rooms: this.markSelectedRooms(rooms, selectedRoom),
      selectedRoom,
      showAllStartTimes: false
    }, () => {
      this.refreshStartTimeOptions(selectedRoom);
      this.generatePackages(selectedRoom);
    });
    return true;
  },

  chooseRoomDirect(e) {
    const room = this.data.rooms[e.currentTarget.dataset.index];
    this.applySelectedRoom(room);
  },

  viewRoomDetail(e) {
    const room = this.data.rooms[e.currentTarget.dataset.index];
    if (!room || !room.id) return;
    const meta = this.data.serviceMeta || SERVICE_META.generic;
    const params = [
      `roomId=${room.id || ''}`,
      `resourceId=${room.id || ''}`,
      `storeId=${this.data.storeId || this.getRoomStoreId(room) || ''}`,
      `merchantId=${this.data.merchantId || room.merchantId || ''}`,
      `selectMode=1`,
      `selectedRoomId=${this.data.selectedRoom.id || ''}`,
      `categoryTitle=${encodeURIComponent(meta.categoryTitle || '')}`,
      `resourceLabel=${encodeURIComponent(meta.resourceLabel || '')}`,
      `priceUnitText=${encodeURIComponent(meta.priceUnitText || '')}`
    ].join('&');
    wx.navigateTo({
      url: `/pages/room-detail/room-detail?${params}`,
      success: (res) => {
        const channel = res.eventChannel;
        if (channel && channel.on) {
          channel.on('selectRoom', ({ room: selected }) => {
            if (selected) this.applySelectedRoom(selected);
          });
        }
        if (channel && channel.emit) {
          channel.emit('roomSnapshot', { room, serviceMeta: meta });
        }
      }
    });
  },

  goSelectRoom() {
    if (!this.data.rooms.length) return;
    const meta = this.data.serviceMeta || SERVICE_META.generic;
    const params = [
      `storeId=${this.data.storeId || ''}`,
      `merchantId=${this.data.merchantId || ''}`,
      `selectedRoomId=${this.data.selectedRoom.id || ''}`,
      `startTime=${this.data.startTimeStr || ''}`,
      `endTime=${this.data.endTimeStr || ''}`,
      `hours=${this.data.selectedHours || ''}`,
      `packageName=${encodeURIComponent(this.data.selectedPackageName || '')}`,
      `categoryTitle=${encodeURIComponent(meta.categoryTitle || '')}`,
      `resourceLabel=${encodeURIComponent(meta.resourceLabel || '')}`,
      `priceUnitText=${encodeURIComponent(meta.priceUnitText || '')}`
    ].join('&');
    wx.navigateTo({
      url: `/pages/select-room/select-room?${params}`,
      success: (res) => {
        res.eventChannel.on('selectRoom', ({ room }) => {
          if (!room) return;
          this.applySelectedRoom(room);
        });
      }
    });
  },

  onRoomTap(e) {
    const room = e.currentTarget.dataset.room;
    this.setData({
      selectedRoom: room,
      showBooking: true,
      bookingMode: 'time',
      roomCount: 1
    });
    this.generateTimeSlots();
    this.generatePackages(room);
  },

  closeBooking() {
    this.setData({ showBooking: false });
  },

  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      bookingMode: mode,
      selectedHours: 0,
      totalPrice: 0,
      selectedPackageIdx: -1,
      selectedDuration: 0
    });
    if (mode === 'time') this.generateTimeSlots();
  },

  changeCount(e) {
    let count = this.data.roomCount + parseInt(e.currentTarget.dataset.delta);
    if (count < 1) count = 1;
    if (count > 10) count = 10;
    this.setData({ roomCount: count });
    this.recalculate();
  },

  selectDate(e) {
    const selectedDate = e.currentTarget.dataset.date;
    const selected = this.data.dates.find(item => item.value === selectedDate);
    this.setData({
      selectedDate,
      selectedDateLabel: selected ? selected.label : '',
      startTimeOptions: [],
      startHour: -1,
      startTimeStr: '',
      endHour: -1,
      endTimeStr: '',
      totalPrice: 0,
      timeOptionsEmptyText: '正在加载可约时间'
    });
    this.loadRooms();
  },

  toggleStartTimeExpand() {
    const showAllStartTimes = !this.data.showAllStartTimes;
    this.setData({
      showAllStartTimes,
      ...this.getStartTimeDisplayState(this.data.startTimeOptions, showAllStartTimes, this.data.startHour)
    });
  },

  toggleDurationExpand() {
    const showAllDurations = !this.data.showAllDurations;
    this.setData({
      showAllDurations,
      ...this.getDurationDisplayState(this.data.durationOptions, showAllDurations)
    });
  },

  selectBookingMethod(e) {
    const index = Number(e.currentTarget.dataset.index);
    const pkg = this.data.bookingPackages[index];
    if (!pkg) return;
    const hours = Math.max(1, Number(pkg.hours || 1));
    this.setData({
      bookingMode: pkg.isPackagePrice ? 'package' : 'time',
      selectedPackageIdx: index,
      selectedPackageName: pkg.name,
      selectedPackageIntro: this.buildBookingPackageIntro(pkg),
      selectedHours: hours,
      pkgDurationHours: hours,
      pkgStartLimit: pkg.applicableStartTime || '00:00',
      pkgEndLimit: pkg.applicableEndTime || '23:59',
      showAllStartTimes: false,
      startHour: -1,
      startTimeStr: '',
      endHour: -1,
      endTimeStr: ''
    }, () => {
      this.refreshStartTimeOptions(this.data.selectedRoom);
    });
  },

  selectStartTime(e) {
    const disabled = e.currentTarget.dataset.disabled;
    if (disabled === true || disabled === 'true') return;
    const hour = Number(e.currentTarget.dataset.hour);
    const option = this.data.startTimeOptions.find(item => Number(item.hour) === hour);
    if (!this.isTimeRangeAvailable(hour, this.data.selectedHours || 1)) {
      wx.showToast({ title: '该时段无法覆盖所选时长', icon: 'none' });
      return;
    }
    const pkg = this.data.bookingPackages[this.data.selectedPackageIdx];
    const packageReason = this.getPackageUnavailableReason(pkg, hour, hour + this.data.selectedHours);
    if (packageReason) {
      wx.showToast({ title: packageReason, icon: 'none' });
      return;
    }
    this.setData({
      startHour: hour,
      startTimeStr: option ? option.label : this.formatHourValue(hour),
      endHour: hour + this.data.selectedHours,
      endTimeStr: this.formatHourValue(hour + this.data.selectedHours)
    }, () => {
      this.refreshBookingPackageStates();
      this.updateTotalPrice();
    });
  },

  selectDurationHours(e) {
    if (this.data.startHour < 0) {
      wx.showToast({ title: '请先选择可用开始时间', icon: 'none' });
      return;
    }
    const hours = Number(e.currentTarget.dataset.hours);
    const hourlyIdx = this.data.bookingPackages.findIndex(item => !item.isPackagePrice);
    const hourlyPkg = hourlyIdx >= 0 ? this.data.bookingPackages[hourlyIdx] : null;
    const hourlyTimeFilter = hourlyPkg || { isPackagePrice: false };
    const startHour = this.isTimeRangeAvailable(this.data.startHour, hours)
      ? this.data.startHour
      : this.findFirstAvailableStartForDuration(hours, this.data.selectedRoom, hourlyTimeFilter);
    if (startHour < 0) {
      wx.showToast({ title: '当前时长暂无连续可约时间', icon: 'none' });
      return;
    }
    this.setData({
      bookingMode: 'time',
      selectedPackageIdx: hourlyIdx,
      selectedPackageName: hourlyPkg ? hourlyPkg.name : '',
      selectedPackageIntro: hourlyPkg ? this.buildBookingPackageIntro(hourlyPkg) : '',
      selectedHours: hours,
      startHour,
      startTimeStr: this.formatHourValue(startHour),
      endHour: startHour + hours,
      endTimeStr: this.formatHourValue(startHour + hours)
    }, () => {
      this.refreshBookingPackageStates();
      this.updateTotalPrice();
    });
  },

  updateTotalPrice() {
    const pkg = this.data.bookingPackages[this.data.selectedPackageIdx];
    const room = this.data.selectedRoom || {};
    const unitPrice = Number(room.pricePerHour || 0);
    const total = pkg && pkg.isPackagePrice
      ? pkg.price
      : (unitPrice * (this.data.selectedHours || 1));
    this.setData({ totalPrice: total });
  },

  parseTimeLimitMinutes(value, fallback) {
    const minutes = this.parseSlotMinutes(value);
    return minutes >= 0 ? minutes : fallback;
  },

  parseApplicableDays(value) {
    if (value === undefined || value === null || value === '') return [];
    if (Array.isArray(value)) {
      return value
        .map(item => Number(item))
        .filter(item => Number.isFinite(item) && item >= 1 && item <= 7);
    }
    const text = String(value).trim();
    if (!text) return [];
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return this.parseApplicableDays(parsed);
    } catch (e) {}
    return text.split(/[,，/\s]+/)
      .map(item => Number(item))
      .filter(item => Number.isFinite(item) && item >= 1 && item <= 7);
  },

  formatApplicableDays(value) {
    const days = this.parseApplicableDays(value);
    if (!days.length || days.length === 7) return '';
    const names = {
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六',
      7: '周日'
    };
    return `限${days.map(day => names[day]).filter(Boolean).join('、')}`;
  },

  formatPackageTimeRange(pkg = {}) {
    const startLimit = this.parseTimeLimitMinutes(pkg.applicableStartTime, -1);
    const endLimit = this.parseTimeLimitMinutes(pkg.applicableEndTime, -1);
    if (startLimit < 0 && endLimit < 0) return '';
    const startText = startLimit >= 0 ? this.formatMinutes(startLimit) : '00:00';
    const endText = endLimit >= 0 ? this.formatMinutes(endLimit) : '24:00';
    return `${startText}-${endText}${endLimit >= 0 && startLimit >= 0 && endLimit <= startLimit ? ' 次日' : ''}`;
  },

  buildBookingPackageIntro(pkg = {}) {
    if (!pkg || !pkg.name) return '';
    const parts = [];
    const customIntro = pkg.rawIntro || (pkg._introGenerated ? '' : pkg.intro) || pkg.packageDesc || pkg.packageDescription || pkg.description || pkg.remark || pkg.memo || '';
    const hours = Math.max(1, Number(pkg.hours || 1));
    if (customIntro) {
      parts.push(customIntro);
    } else if (pkg.isPackagePrice) {
      parts.push(`${hours}小时套餐，按套餐价预约`);
    } else {
      parts.push('按实际选择的连续可约时长计费');
    }
    const timeRange = this.formatPackageTimeRange(pkg);
    parts.push(timeRange ? `可用时段 ${timeRange}` : '全天可约');
    const dayText = this.formatApplicableDays(pkg.applicableDays);
    if (dayText) parts.push(dayText);
    return parts.join(' · ');
  },

  getSelectedDayOfWeek() {
    const date = new Date(String(this.data.selectedDate || this.formatDateValue(new Date())).replace(/-/g, '/'));
    const day = Number.isNaN(date.getTime()) ? new Date().getDay() : date.getDay();
    return day === 0 ? 7 : day;
  },

  getPackageUnavailableReason(pkg, startHour, endHour) {
    if (!pkg || !pkg.isPackagePrice) return '';

    const days = this.parseApplicableDays(pkg.applicableDays);
    if (days.length && !days.includes(this.getSelectedDayOfWeek())) {
      return '该套餐当天不可用';
    }

    if (startHour === undefined || startHour === null || startHour < 0 || endHour === undefined || endHour === null) {
      return '';
    }

    const startLimit = this.parseTimeLimitMinutes(pkg.applicableStartTime, -1);
    const endLimit = this.parseTimeLimitMinutes(pkg.applicableEndTime, -1);
    if (startLimit < 0 && endLimit < 0) return '';

    const startMinutes = Math.round(Number(startHour) * 60);
    const endMinutes = Math.round(Number(endHour) * 60);
    if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) return '套餐时间不可用';

    if (startLimit >= 0 && endLimit >= 0 && endLimit <= startLimit) {
      const adjustedStart = startMinutes >= startLimit ? startMinutes : startMinutes + 24 * 60;
      const adjustedEnd = endMinutes >= startMinutes ? adjustedStart + (endMinutes - startMinutes) : endMinutes + 24 * 60;
      if (adjustedStart < startLimit || adjustedEnd > endLimit + 24 * 60) return '所选时间不在套餐可用时段内';
      return '';
    }

    if (startLimit >= 0 && startMinutes < startLimit) return '所选时间不在套餐可用时段内';
    if (endLimit >= 0 && endMinutes > endLimit) return '所选时间不在套餐可用时段内';
    return '';
  },

  isPackageTimeAllowed(pkg, startHour, endHour) {
    return !this.getPackageUnavailableReason(pkg, startHour, endHour);
  },

  decorateBookingPackage(pkg) {
    const hours = Math.max(1, Number(pkg && pkg.hours || 1));
    return {
      ...pkg,
      hours,
      intro: this.buildBookingPackageIntro({ ...pkg, hours }),
      _introGenerated: true,
      disabled: false,
      disabledReason: ''
    };
  },

  refreshBookingPackageStates() {
    const bookingPackages = this.data.bookingPackages.map(item => this.decorateBookingPackage(item));
    let selectedPackageIdx = this.data.selectedPackageIdx;
    const selected = bookingPackages[selectedPackageIdx] || {};
    this.setData({
      bookingPackages,
      selectedPackageIdx,
      selectedPackageName: selected.name || '',
      selectedPackageIntro: selected.intro || this.buildBookingPackageIntro(selected)
    });
  },

  validateBookingSelection(options = {}) {
    const showToast = options.showToast !== false;
    const room = this.data.selectedRoom || {};
    const pkg = this.data.bookingPackages[this.data.selectedPackageIdx];
    const hours = Number(this.data.selectedHours || 0);
    const startHour = Number(this.data.startHour);
    const endHour = Number(this.data.endHour);
    const fail = (title) => {
      if (showToast) wx.showToast({ title, icon: 'none' });
      return false;
    };

    if (!room.id) return fail(`请选择${this.data.serviceMeta.resourceLabel}`);
    if (!this.isResourceBookable(room)) return fail('当前资源不可约');
    if (!this.data.selectedDate) return fail('请选择日期');
    if (!Number.isFinite(hours) || hours <= 0 || !Number.isFinite(startHour) || endHour <= startHour) {
      return fail('请选择时间');
    }
    if (!this.isTimeRangeAvailable(startHour, hours, room)) {
      return fail('所选时间段已不可约，请重新选择');
    }
    const packageReason = this.getPackageUnavailableReason(pkg, startHour, endHour);
    if (packageReason) {
      return fail(packageReason);
    }
    if (Number(this.data.totalPrice || 0) <= 0) return fail('价格信息异常，请重新选择');
    return true;
  },

  // ========== 时长快捷筛选 ==========

  selectDuration(e) {
    const dur = parseInt(e.currentTarget.dataset.dur);
    this.setData({ selectedDuration: dur });

    if (dur === 0) {
      // "其他"模式：清除所有选中，让用户自由选
      const slots = this.data.timeSlots.map(s => ({ ...s, selected: false }));
      this.setData({ timeSlots: slots, selectedHours: 0, totalPrice: 0 });
      return;
    }

    // 自动选中从第一个可用时间段开始的连续N小时
    const slots = this.data.timeSlots.map(s => ({ ...s, selected: false }));
    let count = 0;
    for (let i = 0; i < slots.length && count < dur; i++) {
      if (slots[i].status === 'available') {
        slots[i].selected = true;
        count++;
      }
    }
    this.setData({ timeSlots: slots });
    this.recalculate();
  },

  // ========== 时间格子 ==========

  generateTimeSlots() {
    const now = new Date();
    const isToday = this.data.selectedDate === (this.data.dates[0] && this.data.dates[0].value);
    const currentHour = isToday ? now.getHours() : -1;
    const room = this.data.selectedRoom;
    const price = Number(room.pricePerHour || 0);

    // 用房间真实时间轴数据
    const roomTimeline = room.timeline || this.data.defaultTimeline;
    const slots = roomTimeline.map(seg => {
      const h = seg.hour;
      const hNext = h + 1;
      const timeRange = `${String(h).padStart(2,'0')}:00-${String(hNext === 24 ? 0 : hNext).padStart(2,'0')}:00`;
      const isPast = isToday && h < currentHour;
      const isBooked = seg.status === 'booked' || seg.status === 'occupied';
      return {
        hour: h,
        time: `${String(h).padStart(2,'0')}:00`,
        timeRange,
        price,
        status: isPast ? 'past' : (isBooked ? 'booked' : 'available'),
        selected: false
      };
    }).filter(s => !isToday || s.hour >= currentHour);

    this.setData({ timeSlots: slots, selectedHours: 0, totalPrice: 0 });
  },

  toggleSlot(e) {
    const index = e.currentTarget.dataset.index;
    const slots = this.data.timeSlots;
    if (!slots[index] || slots[index].status !== 'available') return;
    slots[index].selected = !slots[index].selected;
    this.setData({ timeSlots: slots, selectedDuration: 0 });
    this.recalculate();
  },

  recalculate() {
    const { timeSlots, roomCount, bookingMode, bookingPackages, selectedPackageIdx } = this.data;
    if (bookingMode === 'time') {
      const selected = timeSlots.filter(s => s.selected);
      const hours = selected.length;
      const pricePerHour = Number(this.data.selectedRoom.pricePerHour || 0);
      this.setData({
        selectedHours: hours,
        totalPrice: (hours * pricePerHour * roomCount).toFixed(2)
      });
    } else if (bookingMode === 'package' && selectedPackageIdx >= 0) {
      const pkg = bookingPackages[selectedPackageIdx];
      if (!pkg) return;
      this.setData({
        selectedHours: pkg.hours,
        totalPrice: (pkg.price * roomCount).toFixed(2)
      });
    }
  },

  // ========== 套餐 ==========

  generatePackages(room) {
    const fallbackPackages = this.buildDefaultBookingPackages(room);
    this.applyBookingPackages(fallbackPackages);

    const merchantId = this.data.merchantId || (app.getActiveMerchantId ? app.getActiveMerchantId() : config.DEFAULT_MERCHANT_ID);
    if (!merchantId) {
      this.setData({ packages: [], packageNames: ['暂无套餐'] });
      return;
    }
    const { request } = require('../../utils/api.js');
    request('/api/billing/packages', {
      method: 'GET',
      data: { merchantId }
    }).then(res => {
      const rawList = this.extractPackageList(res.data || res);
      const packages = rawList
        .map(item => this.normalizeBillingPackage(item))
        .filter(item => item && this.isPackageApplicableToRoom(item, room));
      const bookingPackages = this.mergeBookingPackages(fallbackPackages, packages.map(p => ({
        name: p.name,
        price: p.price,
        desc: p.hours ? `${p.hours}小时` : '套餐',
        hours: p.hours || 1,
        packageId: p.packageId,
        rawIntro: p.rawIntro,
        applicableStartTime: p.applicableStartTime,
        applicableEndTime: p.applicableEndTime,
        applicableDays: p.applicableDays,
        isPackagePrice: true
      })));
      this.setData({
        packages,
        packageNames: packages.length > 0
          ? ['请选择套餐', ...packages.map(p => `${p.name}  ${p.price}元`)]
          : ['暂无套餐']
      });
      this.applyBookingPackages(bookingPackages.length ? bookingPackages : fallbackPackages);
    }).catch(err => {
      console.error('加载套餐失败:', err);
      this.setData({ packages: [], packageNames: ['暂无套餐'] });
    });
  },

  extractPackageList(payload) {
    if (Array.isArray(payload)) return payload;
    if (typeof payload === 'string') {
      try {
        return this.extractPackageList(JSON.parse(payload));
      } catch (e) {
        return [];
      }
    }
    if (!payload || typeof payload !== 'object') return [];
    const directKeys = ['list', 'records', 'packages', 'packageList', 'items', 'rows', 'data'];
    for (const key of directKeys) {
      const value = payload[key];
      if (Array.isArray(value)) return value;
      if (value && typeof value === 'object') {
        const nested = this.extractPackageList(value);
        if (nested.length) return nested;
      }
    }
    return [];
  },

  normalizeBillingPackage(pkg = {}) {
    const name = pkg.packageName || pkg.package_name || pkg.name || pkg.title || pkg.packageTitle || pkg.productName || '';
    const packageId = pkg.id || pkg.packageId || pkg.package_id;
    const rawDuration = Number(pkg.duration || pkg.durationMinutes || pkg.durationMinute || pkg.minutes || pkg.packageDuration || pkg.timeLength || pkg.serviceMinutes || 0);
    const rawHours = Number(pkg.hours || pkg.hour || pkg.durationHours || 0);
    const hours = rawHours > 0
      ? rawHours
      : (rawDuration > 0 ? (rawDuration > 24 ? Math.round(rawDuration / 60) : rawDuration) : 1);
    const rawPrice = pkg.price || pkg.amount || pkg.packagePrice || pkg.salePrice || pkg.totalAmount || pkg.payAmount || pkg.originalPrice;
    const price = this.normalizePrice(rawPrice);
    const disabled = pkg.isEnabled === 0 || pkg.enabled === false || pkg.isDeleted === 1 || pkg.deleted === true;

    if (disabled || !name || !price) return null;
    return {
      ...pkg,
      id: packageId,
      packageId,
      name,
      hours: Math.max(1, Math.round(hours)),
      duration: rawDuration,
      price,
      rawIntro: pkg.intro || pkg.packageDesc || pkg.packageDescription || pkg.description || pkg.remark || pkg.memo || '',
      applicableStartTime: pkg.applicableStartTime || pkg.startTime || pkg.start || '',
      applicableEndTime: pkg.applicableEndTime || pkg.endTime || pkg.end || '',
      applicableDays: pkg.applicableDays || pkg.days || pkg.weekDays || pkg.weekdays || pkg.availableDays || ''
    };
  },

  isPackageApplicableToRoom(pkg = {}, room = this.data.selectedRoom) {
    const roomId = String(room.id || '');
    const storeId = String(this.data.storeId || this.getRoomStoreId(room) || '');
    const pkgResourceId = pkg.resourceId || pkg.roomId || pkg.resourceID || pkg.resource_id;
    const pkgStoreId = pkg.storeId || pkg.storeID || pkg.store_id;
    if (pkgResourceId && String(pkgResourceId) !== roomId) return false;
    if (pkgStoreId && storeId && String(pkgStoreId) !== storeId) return false;
    return true;
  },

  mergeBookingPackages(hourlyPackages = [], packageList = []) {
    const result = [];
    const seen = {};
    hourlyPackages.concat(packageList).forEach(item => {
      if (!item) return;
      const key = item.packageId ? `pkg-${item.packageId}` : `time-${item.name}-${item.hours}-${item.price}`;
      if (seen[key]) return;
      seen[key] = true;
      result.push(item);
    });
    return result;
  },

  buildDefaultBookingPackages(room = {}) {
    const price = Number(room.pricePerHour || 0);
    if (!Number.isFinite(price) || price <= 0) return [];
    const desc = this.data.serviceMeta.type === 'carwash' ? '次起' : '小时起';
    return [{
      name: '按小时预约',
      price,
      desc,
      hours: 1,
      isPackagePrice: false
    }];
  },

  applyBookingPackages(packages) {
    const list = Array.isArray(packages)
      ? packages.filter(Boolean).map(item => this.decorateBookingPackage(item))
      : [];
    if (!list.length) {
      this.setData({
        bookingPackages: [],
        selectedPackageIdx: -1,
        selectedPackageName: '',
        selectedPackageIntro: '',
        totalPrice: 0
      });
      return;
    }

    const currentIdx = list.findIndex(item => item.name === this.data.selectedPackageName);
    let selectedPackageIdx = currentIdx >= 0 ? currentIdx : 0;
    if (selectedPackageIdx < 0) selectedPackageIdx = 0;
    const pkg = list[selectedPackageIdx];
    const selectedHours = pkg.hours || this.data.selectedHours || 1;
    const packageReason = this.getPackageUnavailableReason(pkg, this.data.startHour, this.data.startHour + selectedHours);
    const startHour = !packageReason && this.isTimeRangeAvailable(this.data.startHour, selectedHours)
      ? this.data.startHour
      : this.findFirstAvailableStartForDuration(selectedHours, this.data.selectedRoom, pkg);
    const hasStartTime = startHour >= 0;
    this.setData({
      bookingPackages: list,
      bookingMode: pkg.isPackagePrice ? 'package' : 'time',
      selectedPackageIdx,
      selectedPackageName: pkg.name,
      selectedPackageIntro: pkg.intro || this.buildBookingPackageIntro(pkg),
      selectedHours,
      startHour: hasStartTime ? startHour : -1,
      startTimeStr: hasStartTime ? this.formatHourValue(startHour) : '',
      endHour: hasStartTime ? startHour + selectedHours : -1,
      endTimeStr: hasStartTime ? this.formatHourValue(startHour + selectedHours) : ''
    }, () => {
      this.refreshStartTimeOptions(this.data.selectedRoom);
      this.updateTotalPrice();
    });
  },

  selectPackage(e) {
    const idx = e.currentTarget.dataset.index;
    const pkg = this.data.packages[idx];
    if (!pkg) return;

    this.setData({ selectedPackageIdx: idx });

    const hours = pkg.hours || Math.round(pkg.duration / 60);
    const price = pkg.price;

    // 判断是固定时间段还是灵活时长
    const startApply = pkg.applicableStartTime;
    const endApply = pkg.applicableEndTime;

    if (startApply && endApply) {
      const startH = parseInt(startApply.split(':')[0]);
      const endH = parseInt(endApply.split(':')[0]);
      const range = endH - startH;

      if (range <= hours) {
        // 固定时间段套餐：时间写死
        this.setData({
          startTimeStr: startApply,
          endTimeStr: endApply,
          startHour: startH,
          endHour: endH,
          selectedHours: hours,
          totalPrice: price,
          isFixedTime: true
        });
      } else {
        // 灵活时长套餐：可在时间段内自由选择
        this.setData({
          startTimeStr: '',
          endTimeStr: '',
          startHour: -1,
          endHour: -1,
          selectedHours: hours,
          totalPrice: price,
          isFixedTime: false,
          pkgDurationHours: hours,
          pkgStartLimit: startApply,
          pkgEndLimit: endApply
        });
      }
    } else {
      // 没有时间限制，灵活选择
      this.setData({
        startTimeStr: '',
        endTimeStr: '',
        startHour: -1,
        endHour: -1,
        selectedHours: hours,
        totalPrice: price,
        isFixedTime: false,
        pkgDurationHours: hours,
        pkgStartLimit: '00:00',
        pkgEndLimit: '23:59'
      });
    }
  },

  onStartTimeChange(e) {
    const time = e.detail.value;
    const hour = parseInt(time.split(':')[0]);
    const min = parseInt(time.split(':')[1]) || 0;

    if (this.data.selectedPackageIdx >= 0 && this.data.pkgDurationHours) {
      // 有套餐，自动算结束时间
      const endH = hour + this.data.pkgDurationHours;
      const endTime = `${String(endH).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
      this.setData({ startTimeStr: time, startHour: hour, endTimeStr: endTime, endHour: endH });
    } else {
      this.setData({ startTimeStr: time, startHour: hour });
      this.calcTimeRange();
    }
  },

  onEndTimeChange(e) {
    const time = e.detail.value;
    const hour = parseInt(time.split(':')[0]);
    const min = parseInt(time.split(':')[1]) || 0;

    if (this.data.selectedPackageIdx >= 0 && this.data.pkgDurationHours) {
      // 有套餐，自动算开始时间
      const startH = hour - this.data.pkgDurationHours;
      if (startH >= 0) {
        const startTime = `${String(startH).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
        this.setData({ endTimeStr: time, endHour: hour, startTimeStr: startTime, startHour: startH });
      } else {
        this.setData({ endTimeStr: time, endHour: hour });
      }
    } else {
      this.setData({ endTimeStr: time, endHour: hour });
      this.calcTimeRange();
    }
  },

  calcTimeRange() {
    const { startHour, endHour } = this.data;
    if (startHour >= 0 && endHour > startHour) {
      const hours = endHour - startHour;
      const price = Number(this.data.selectedRoom.pricePerHour || 0);
      this.setData({ selectedHours: hours, totalPrice: (hours * price).toFixed(2) });
    }
  },

  onPackageSelect(e) {
    const idx = parseInt(e.detail.value) - 1;
    this.setData({ selectedPackageIdx: idx < 0 ? -1 : idx });
    if (idx < 0) this.setData({ selectedHours: 0, totalPrice: 0 });
    else this.recalculate();
  },

  // ========== 操作 ==========

  confirmBooking() {
    if (!this.validateBookingSelection()) return;
    const userId = app.globalData.userId;
    if (!userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    this.setData({
      showConfirmModal: true,
      confirmInfo: this.buildConfirmInfo()
    });
  },

  buildConfirmInfo() {
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    const phone = user.phone || '';
    const contactName = user.nickname || '微信用户';
    return {
      project: this.data.serviceMeta.projectName,
      storeName: this.data.store.name || '门店信息待同步',
      roomName: this.data.selectedRoom.name || this.data.serviceMeta.resourceLabel,
      packageName: this.data.selectedPackageName || '预约服务',
      dateText: this.getConfirmDateText(),
      timeText: `${this.data.startTimeStr} - ${this.data.endTimeStr}`,
      durationText: `${this.data.selectedHours}小时`,
      contactText: `${contactName} ${this.maskPhone(phone)}`,
      amount: this.data.totalPrice || 0
    };
  },

  getConfirmDateText() {
    const now = new Date(String(this.data.selectedDate || this.formatDateValue(new Date())).replace(/-/g, '/'));
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const selected = this.data.dates.find(item => item.value === this.data.selectedDate);
    const label = selected ? selected.label : (this.isSameDate(now, new Date()) ? '今天' : `${mm}-${dd}`);
    const dateText = label === `${mm}-${dd}` ? label : `${label} ${mm}-${dd}`;
    return `${dateText}（${weekDays[now.getDay()]}）`;
  },

  isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  },

  maskPhone(phone) {
    if (!phone || phone === '未绑定手机号') return '未绑定手机号';
    const text = `${phone}`;
    if (text.length < 7) return text;
    return `${text.slice(0, 3)}****${text.slice(-4)}`;
  },

  closeConfirmModal() {
    this.setData({ showConfirmModal: false });
  },

  noop() {},

  pickDeep(source, keys) {
    const stack = [source];
    const seen = [];
    while (stack.length) {
      const current = stack.shift();
      if (!current || typeof current !== 'object' || seen.includes(current)) continue;
      seen.push(current);

      for (const key of keys) {
        if (current[key] !== undefined && current[key] !== null && current[key] !== '') {
          return current[key];
        }
      }

      Object.keys(current).forEach(key => {
        const value = current[key];
        if (value && typeof value === 'object') stack.push(value);
      });
    }
    return '';
  },

  confirmAndPay() {
    if (!this.validateBookingSelection()) {
      this.setData({ showConfirmModal: false });
      return;
    }
    this.setData({ showConfirmModal: false });
    this.submitBooking();
  },

  submitBooking() {
    const { merchantId, selectedRoom, selectedDate, bookingPackages, selectedPackageIdx } = this.data;
    const openid = app.globalData.openid || wx.getStorageSync('openid');
    const { request } = require('../../utils/api.js');

    if (!openid) { wx.showToast({ title: '请先登录', icon: 'none' }); return; }
    if (!this.validateBookingSelection()) return;

    if (merchantId) {
      wx.showLoading({ title: '下单中...' });

      ensureUserIdentity({ refresh: true }).then(identity => {
        const userId = identity.userId;
        const userInfo = identity.userInfo || app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
        const resolvedStoreId = selectedRoom.storeId || this.data.storeId || (this.data.store && this.data.store.id);
        const commonData = {
          merchantId: parseInt(merchantId, 10),
          resourceId: selectedRoom.id,
          externalUserId: String(userId),
          phone: userInfo.phone || userInfo.phoneNumber || '',
          nickname: userInfo.nickname || userInfo.nickName || '',
          realName: userInfo.realName || userInfo.name || userInfo.nickname || userInfo.nickName || '',
          avatarUrl: userInfo.avatarUrl || userInfo.avatar || ''
        };
        if (resolvedStoreId) commonData.storeId = parseInt(resolvedStoreId, 10);
        let apiPath, apiData;

        const selectedPackage = bookingPackages[selectedPackageIdx];
        if (selectedPackage && selectedPackage.isPackagePrice && selectedPackage.packageId) {
          const pkg = selectedPackage;
          const sh = this.data.startHour >= 0 ? this.data.startHour : new Date().getHours();
          const startTime = `${selectedDate}T${this.formatHourValue(sh)}:00`;
          apiPath = '/api/billing/order/package';
          apiData = {
            ...commonData,
            startTime,
            packageId: pkg.packageId || pkg.id
          };
        } else {
          // 按时计费模式 - 用 picker 选的时间
          const sh = this.data.startHour;
          const eh = this.data.endHour;
          if (sh < 0 || eh <= sh) throw new Error('请选择开始和结束时间');
          const startTime = `${selectedDate}T${this.formatHourValue(sh)}:00`;
          const durationMinutes = Math.round((eh - sh) * 60);
          apiPath = '/api/billing/order/prepaid';
          apiData = {
            ...commonData,
            startTime,
            durationMinutes
          };
        }

        return request(apiPath, {
          method: 'POST',
          data: apiData
        }).then(res => ({ res, apiData }));
      }).then(({ res, apiData }) => {
        wx.hideLoading();
        this.setData({ showBooking: false, showConfirmModal: false });

        const payload = res.data || res || {};
        const cashierUrl = this.pickDeep(payload, ['cashierUrl', 'cashierURL', 'payUrl', 'paymentUrl']) || res.cashierUrl || '';
        const orderId = this.pickDeep(payload, ['id', 'orderId', 'billingOrderId', 'billingId']);
        const tradeNo = this.pickDeep(payload, ['tradeNo', 'paymentTradeNo', 'payTradeNo', 'outTradeNo']);
        if (cashierUrl) {
          const bookingSnapshot = {
            orderId,
            merchantId,
            resourceId: selectedRoom.id,
            startTime: apiData.startTime,
            durationMinutes: apiData.durationMinutes || Math.round((this.data.selectedHours || 1) * 60),
            amount: Math.round(Number(this.data.totalPrice || 0) * 100),
            createdAt: Date.now()
          };
          wx.setStorageSync('pendingBillingBooking', bookingSnapshot);
          openCashier({
            cashierUrl,
            tradeNo,
            orderId,
            merchantId,
            resourceId: selectedRoom.id,
            startTime: apiData.startTime,
            durationMinutes: bookingSnapshot.durationMinutes,
            amount: bookingSnapshot.amount,
            title: '预订支付'
          });
        } else {
          wx.showToast({ title: '下单成功，收银台链接为空', icon: 'none' });
          this.loadWalletInfo();
        }
      }).catch(err => {
        wx.hideLoading();
        const message = err.message || '下单失败';
        if (message.indexOf('手机号') >= 0) {
          this.setData({ showPhoneModal: true, modalPhone: '', modalCode: '', modalCountdown: 0 });
        }
        wx.showToast({ title: message, icon: 'none' });
      });

    } else {
      wx.showLoading({ title: '提交中...' });
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({ title: '预订成功', icon: 'success' });
        this.setData({ showBooking: false });
      }, 1000);
    }
  },

  toggleFavorite() {
    const store = this.data.store || {};
    const storeId = String(this.data.storeId || store.id || store.storeId || '');
    if (!storeId) {
      wx.showToast({ title: '门店信息加载中', icon: 'none' });
      return;
    }
    let favorites = wx.getStorageSync('favorites') || [];
    const idx = favorites.findIndex(s => String(s.id) === storeId);
    if (idx >= 0) {
      favorites.splice(idx, 1);
      this.setData({ isFavorited: false });
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      favorites.unshift(this.buildFavoriteStore(storeId, store));
      this.setData({ isFavorited: true });
      wx.showToast({ title: '收藏成功', icon: 'success' });
    }
    wx.setStorageSync('favorites', favorites);
  },

  isStoreFavorited(storeId = this.data.storeId) {
    const id = String(storeId || '');
    if (!id) return false;
    const favorites = wx.getStorageSync('favorites') || [];
    return favorites.some(item => String(item.id) === id);
  },

  buildFavoriteStore(storeId, store) {
    const images = Array.isArray(store.images) && store.images.length
      ? store.images
      : [store.coverUrl || store.logoUrl || DEFAULT_STORE_IMAGE];
    return {
      id: storeId,
      merchantId: this.data.merchantId || store.merchantId || store.merchantID || '',
      name: store.name || store.storeName || '门店信息待同步',
      address: store.address || store.storeAddress || '',
      phone: store.phone || store.contactPhone || '',
      images,
      coverImage: images[0] || DEFAULT_STORE_IMAGE,
      collectedAt: Date.now()
    };
  },

  goToRecharge() {
    const openid = app.globalData.openid;
    const userInfo = app.globalData.userInfo;
    const phone = userInfo && userInfo.phone;
    const merchantId = this.data.merchantId || (app.getActiveMerchantId ? app.getActiveMerchantId() : config.DEFAULT_MERCHANT_ID);
    if (openid && phone) {
      wx.navigateTo({ url: `/pages/recharge/recharge?merchantId=${merchantId || ''}` });
    } else {
      this.setData({ showPhoneModal: true, modalPhone: '', modalCode: '', modalCountdown: 0 });
    }
  },

  closePhoneModal() {
    this.setData({ showPhoneModal: false });
    if (this._timer) clearInterval(this._timer);
  },

  onModalPhoneInput(e) { this.setData({ modalPhone: e.detail.value }); },
  onModalCodeInput(e) { this.setData({ modalCode: e.detail.value }); },

  sendModalCode() {
    const phone = this.data.modalPhone.trim();
    if (!/^1\d{10}$/.test(phone)) { wx.showToast({ title: '请输入正确的手机号', icon: 'none' }); return; }
    const { smsApi } = require('../../utils/api.js');
    smsApi.sendCode(phone, 'LOGIN').then(() => {
      wx.showToast({ title: '验证码已发送', icon: 'success' });
      this.setData({ modalCountdown: 60 });
      this._timer = setInterval(() => {
        if (this.data.modalCountdown <= 1) { clearInterval(this._timer); this.setData({ modalCountdown: 0 }); }
        else this.setData({ modalCountdown: this.data.modalCountdown - 1 });
      }, 1000);
    }).catch(err => wx.showToast({ title: err.message || '发送失败', icon: 'none' }));
  },

  confirmPhone() {
    const { modalPhone, modalCode } = this.data;
    if (!/^1\d{10}$/.test(modalPhone.trim())) { wx.showToast({ title: '请输入正确的手机号', icon: 'none' }); return; }
    if (!modalCode.trim()) { wx.showToast({ title: '请输入验证码', icon: 'none' }); return; }
    this.setData({ modalLoading: true });
    const { request } = require('../../utils/api.js');
    request('/api/auth/phone/bind', {
      method: 'POST',
      data: { userId: app.globalData.userId, phone: modalPhone.trim(), code: modalCode.trim() }
    }).then(res => {
      const user = res.user || {};
      const userInfo = { ...(app.globalData.userInfo || {}), ...user, phone: modalPhone.trim(), isLogin: true };
      app.globalData.userInfo = userInfo;
      if (user.id) { app.globalData.userId = user.id; wx.setStorageSync('userId', user.id); }
      wx.setStorageSync('userInfo', userInfo);
      this.setData({ showPhoneModal: false, modalLoading: false });
      wx.showToast({ title: '绑定成功', icon: 'success' });
      setTimeout(() => wx.navigateTo({ url: `/pages/recharge/recharge?merchantId=${this.data.merchantId || ''}` }), 1000);
    }).catch(err => {
      this.setData({ modalLoading: false });
      wx.showToast({ title: err.message || '验证失败', icon: 'none' });
    });
  },

  callStore() {
    if (this.data.store.phone) wx.makePhoneCall({ phoneNumber: this.data.store.phone });
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

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/index/index' });
  },

  openMap() {
    const s = this.data.store;
    const storeLocation = locationUtil.resolveStoreLocation(s);
    if (storeLocation) {
      wx.openLocation({
        latitude: storeLocation.latitude,
        longitude: storeLocation.longitude,
        name: s.name || '门店位置',
        address: s.address || '',
        scale: 18
      });
    } else if (s.address) {
      wx.showModal({
        title: s.name || '门店地址',
        content: `${s.address}\n\n该门店缺少经纬度，暂无法直接打开地图。`,
        confirmText: '复制地址',
        cancelText: '关闭',
        success: (res) => {
          if (res.confirm) wx.setClipboardData({ data: s.address });
        }
      });
    } else {
      wx.showToast({ title: '暂无位置信息', icon: 'none' });
    }
  }
});
