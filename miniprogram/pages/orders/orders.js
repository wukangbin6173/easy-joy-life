const app = getApp();
const { request } = require('../../utils/api.js');
const { openCashier } = require('../../utils/payment.js');
const { ensureUserIdentity } = require('../../utils/user-session.js');

const STATUS_MAP = {
  0: { text: '待支付', key: 'pendingPay' },
  10: { text: '待使用', key: 'pendingUse' },
  20: { text: '使用中', key: 'using' },
  30: { text: '使用中', key: 'using' },
  40: { text: '已完成', key: 'completed' },
  50: { text: '已退款', key: 'refunded' },
  55: { text: '已退款', key: 'refunded' },
  60: { text: '已取消', key: 'cancelled' }
};

const UNKNOWN_STATUS = { text: '未知', key: 'unknown' };

const STATUS_TABS = [
  { key: 'all', label: '全部' },
  { key: 'pendingPay', label: '待支付' },
  { key: 'pendingUse', label: '待使用' },
  { key: 'using', label: '使用中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
  { key: 'refunding', label: '退款中' },
  { key: 'refunded', label: '已退款' }
];

const TYPE_OPTIONS = [
  { label: '全部业务类型', value: 'all' },
  { label: '棋牌', value: 'mahjong' },
  { label: '台球', value: 'billiards' },
  { label: '洗车', value: 'carwash' }
];

const DATE_OPTIONS = [
  { label: '近30天', value: 30 },
  { label: '近90天', value: 90 },
  { label: '全部时间', value: 0 }
];

const TYPE_KEYWORDS = {
  mahjong: ['棋牌', '麻将', '包间', '包房', '棋牌室', 'ktv'],
  billiards: ['台球', '桌球', '球台', '8球', '八球'],
  carwash: ['洗车', '洗车机', '自助洗车']
};

const EMPTY_ORDER_IMAGE = '/images/提示.png';

const PAY_EXPIRE_MINUTES = 15;
const LOCAL_PAID_OVERLAY_MS = 30 * 60 * 1000;

Page({
  data: {
    activeStatus: 'all',
    orders: [],
    allOrders: [],
    loading: true,
    searchKeyword: '',
    statusTabs: STATUS_TABS.map((item, index) => ({ ...item, active: index === 0 })),
    dateFilterOptions: DATE_OPTIONS,
    dateFilterValue: 30,
    dateFilterText: '近30天',
    storeFilterOptions: [{ label: '全部门店', value: 'all' }],
    storeFilterValue: 'all',
    storeFilterText: '全部门店',
    typeFilterOptions: TYPE_OPTIONS,
    typeFilterValue: 'all',
    typeFilterText: '全部业务类型',
    showCancelConfirm: false,
    cancelConfirmOrderId: '',
    cancelConfirmSubmitting: false,
    cancelConfirm: {}
  },

  onLoad() {
    console.log('orders onLoad, userId:', app.globalData.userId);
    this.loadOrders();
  },

  onShow() {
    console.log('orders onShow, userId:', app.globalData.userId);
    this.loadOrders();
    this.startCountdownTimer();
  },

  onHide() {
    this.stopCountdownTimer();
  },

  onUnload() {
    this.stopCountdownTimer();
  },

  onPullDownRefresh() {
    this.loadOrders();
    setTimeout(() => wx.stopPullDownRefresh(), 2000);
  },

  loadOrders() {
    const loadSeq = (this._loadOrdersSeq || 0) + 1;
    this._loadOrdersSeq = loadSeq;
    const userId = app.globalData.userId || wx.getStorageSync('userId');
    console.log('loadOrders userId:', userId);
    if (!userId) {
      this.setData({ loading: true });
      ensureUserIdentity().then(() => {
        this.loadOrders();
      }).catch(err => {
        console.error('restore user identity failed:', err);
        this.setData({ orders: [], allOrders: [], loading: false });
      });
      return;
    }

    this.setData({ loading: true });

    const lastPaidOrderId = wx.getStorageSync('lastPaidBillingOrderId');
    const pendingBooking = wx.getStorageSync('pendingBillingBooking') || {};
    const detailIds = [lastPaidOrderId, pendingBooking.orderId].filter(Boolean)
      .map(id => String(id))
      .filter((id, index, arr) => arr.indexOf(id) === index);
    const detailOrdersPromise = Promise.all(detailIds.map(id =>
      this.safeRequest(`/api/billing/order/${id}`, {}, `load billing order detail ${id}`).then(res => {
        return res;
      }).catch(err => {
        console.warn('load billing order detail failed:', id, err);
        return null;
      })
    ));
    const merchantIds = this.getOrderMerchantIds();

    Promise.all([
      Promise.all(merchantIds.map(merchantId => this.loadOrderBundle(merchantId, userId))),
      detailOrdersPromise
    ]).then(([bundles, detailOrderResList]) => {
      if (loadSeq !== this._loadOrdersSeq) return;
      const roomMap = {};
      const storeMap = {};
      const merchantMap = {};
      let list = [];

      (bundles || []).forEach(bundle => {
        const merchantId = bundle.merchantId;
        this.extractResponseList(bundle.roomRes).forEach(r => {
          const roomInfo = {
            name: r.resourceName || r.name || '',
            image: (r.resourcePhoto && !r.resourcePhoto.startsWith('file://')) ? r.resourcePhoto : '',
            tags: r.tags || '',
            capacity: r.capacity || r.maxCapacity || r.peopleNum || '',
            storeId: r.storeId || '',
            merchantId
          };
          if (r.id) {
            roomMap[r.id] = roomInfo;
            roomMap[`${merchantId}:${r.id}`] = roomInfo;
          }
        });

        Object.assign(storeMap, this.buildRemoteStoreMap(bundle.storeRes));

        const merchant = (bundle.merchantRes && bundle.merchantRes.data && !Array.isArray(bundle.merchantRes.data))
          ? bundle.merchantRes.data
          : (bundle.merchantRes || {});
        if (merchantId) merchantMap[merchantId] = merchant;

        const bundleOrders = this.extractResponseList(bundle.orderRes)
          .filter(order => !order.externalUserId || String(order.externalUserId) === String(userId))
          .map(order => ({ ...order, merchantId: order.merchantId || merchantId }));
        bundleOrders.forEach(order => {
          if (!this.hasOrder(list, order)) list.push(order);
        });
      });

      (detailOrderResList || []).forEach(detailOrderRes => {
        const detailOrder = this.extractResponseObject(detailOrderRes);
        if (detailOrder && !this.hasOrder(list, detailOrder)) list = [detailOrder, ...list];
      });

      list = this.applyPendingOrderOverlay(list);
      this.syncPendingOrderCache(list);
      list = this.applyLocalPaidOrderOverlay(list);
      const pendingOrder = this.buildPendingBillingOrder();
      if (pendingOrder && !this.hasOrder(list, pendingOrder)) {
        list = [pendingOrder, ...list];
      }
      const localRoomBooking = this.buildLocalRoomBookingOrder();
      if (localRoomBooking && !this.hasOrder(list, localRoomBooking)) {
        list = [localRoomBooking, ...list];
      }

      const localPaidOrder = this.buildLocalPaidOrder();
      if (localPaidOrder && !this.hasOrder(list, localPaidOrder)) {
        list = [localPaidOrder, ...list];
      }
      console.log('订单数量:', list.length);
      const orders = list.map(o => {
        const normalizedStatus = this.resolveOrderStatus(o);
        const statusInfo = STATUS_MAP[normalizedStatus] || UNKNOWN_STATUS;
        const startTime = this.parseDate(o.bookingStartTime || o.startTime);
        const endTime = this.parseDate(o.bookingEndTime || o.endTime);
        const orderMerchantId = o.merchantId || o.merchantID || o.mchId || pendingBooking.merchantId || this.getActiveMerchantId();
        const room = roomMap[`${orderMerchantId}:${o.resourceId}`] || roomMap[o.resourceId] || {};
        const store = storeMap[o.storeId || room.storeId] || {};
        const merchant = merchantMap[orderMerchantId] || {};
        const amountFen = this.pickFirstNumber(o, ['prepaidAmount', 'paidAmount', 'totalAmount', 'amount', 'orderAmount', 'payAmount']);
        return this.decorateOrder({
          ...o,
          merchantId: orderMerchantId,
          status: normalizedStatus,
          statusText: statusInfo.text,
          statusKey: statusInfo.key,
          storeId: o.storeId || room.storeId,
          storeName: this.pickFirstText(o, ['storeName', 'merchantName', 'shopName', 'storeTitle']) ||
            store.name || merchant.shortName || merchant.name || '',
          roomName: this.pickFirstText(o, ['roomName', 'resourceName', 'resourceTitle', 'resourceNo']) || room.name,
          coverImage: this.pickFirstText(o, ['resourcePhoto', 'coverImage', 'roomImage', 'imageUrl', 'storeImage']) ||
            room.image || store.image || merchant.logoUrl || '',
          roomTags: this.pickFirstText(o, ['tags', 'roomTags', 'resourceTags']) || room.tags,
          capacity: this.pickFirstText(o, ['capacity', 'peopleCount', 'peopleNum', 'maxCapacity']) || room.capacity,
          startTime,
          endTime,
          payExpireAt: this.getPayExpireAt(o),
          priceYuan: amountFen ? (amountFen / 100).toFixed(0) : 0
        });
      });
      const sortedOrders = this.sortOrders(orders);
      this.setData({
        allOrders: sortedOrders,
        storeFilterOptions: this.buildStoreOptions(sortedOrders),
        loading: false
      });
      this.applyFilters();
    }).catch(err => {
      if (loadSeq !== this._loadOrdersSeq) return;
      console.error('加载订单失败:', err);
      this.setData({ orders: [], allOrders: [], loading: false });
    });
  },

  safeRequest(url, options = {}, label = '') {
    return request(url, options).catch(err => {
      console.warn(label || 'request failed:', err);
      return null;
    });
  },

  getOrderMerchantIds() {
    const ids = [];
    const add = (value) => {
      if (value === undefined || value === null || value === '') return;
      const text = String(value);
      if (!ids.some(item => String(item) === text)) ids.push(value);
    };
    const pending = wx.getStorageSync('pendingBillingBooking') || {};
    const paid = wx.getStorageSync('lastPaidBooking') || {};
    add(pending.merchantId);
    add(paid.merchantId);
    const activeMerchantId = this.getActiveMerchantId();
    add(app.globalData.currentMerchantId);
    add(wx.getStorageSync('currentMerchantId'));
    add(activeMerchantId);
    if (!ids.length && activeMerchantId) add(activeMerchantId);
    return ids;
  },

  loadOrderBundle(merchantId, userId) {
    const orderData = {
      externalUserId: String(userId),
      merchantId,
      pageNo: 1,
      pageSize: 100
    };
    return Promise.all([
      this.safeRequest('/api/billing/order/list', { method: 'GET', data: orderData }, `load orders ${merchantId}`),
      this.safeRequest('/api/rooms', { method: 'GET', data: { merchantId, pageNo: 1, pageSize: 100 } }, `load rooms ${merchantId}`),
      this.safeRequest('/api/stores', { method: 'GET', data: { merchantId, pageNo: 1, pageSize: 100 } }, `load stores ${merchantId}`),
      this.safeRequest(`/api/stores/merchants/${merchantId}`, { method: 'GET' }, `load merchant ${merchantId}`)
    ]).then(([orderRes, roomRes, storeRes, merchantRes]) => ({
      merchantId,
      orderRes,
      roomRes,
      storeRes,
      merchantRes
    }));
  },

  buildPendingBillingOrder() {
    const booking = wx.getStorageSync('pendingBillingBooking') || {};
    if (!booking.orderId && !booking.resourceId) return null;
    if (!booking.startTime) return null;

    const start = this.parseDate(booking.startTime);
    const durationMinutes = Number(booking.durationMinutes || 60);
    const end = start ? new Date(start.getTime() + durationMinutes * 60000) : null;
    const amount = Number(booking.amount || 0);

    return {
      id: booking.orderId || `pending-${booking.createdAt || Date.now()}`,
      orderId: booking.orderId || '',
      merchantId: booking.merchantId || this.getActiveMerchantId(),
      resourceId: booking.resourceId || '',
      status: 0,
      cashierUrl: booking.cashierUrl || '',
      tradeNo: booking.tradeNo || '',
      paymentTradeNo: booking.paymentTradeNo || booking.tradeNo || '',
      payExpireAt: booking.payExpireAt || booking.unlockDeadline || '',
      unlockDeadline: booking.unlockDeadline || '',
      bookingStartTime: booking.startTime,
      bookingEndTime: end ? this.formatBackendTime(end) : '',
      prepaidAmount: amount,
      amount,
      createdAt: booking.createdAt || Date.now(),
      localPending: true
    };
  },

  buildLocalRoomBookingOrder() {
    const booking = wx.getStorageSync('lastRoomBooking') || {};
    if (!booking.id && !booking.orderId && !booking.resourceId) return null;
    if (!booking.bookingStartTime && !booking.startTime) return null;
    return {
      id: booking.id || booking.orderId || `room-booking-${booking.createdAt || Date.now()}`,
      orderId: booking.orderId || booking.id || '',
      merchantId: booking.merchantId || this.getActiveMerchantId(),
      storeId: booking.storeId || '',
      resourceId: booking.resourceId || '',
      roomName: booking.roomName || '',
      status: this.pickFirstValue(booking, ['status', 'orderStatus']) !== undefined ? this.pickFirstValue(booking, ['status', 'orderStatus']) : 10,
      bookingStartTime: booking.bookingStartTime || booking.startTime,
      bookingEndTime: booking.bookingEndTime || booking.endTime,
      prepaidAmount: Number(booking.amount || 0),
      paidAmount: Number(booking.amount || 0),
      createdAt: booking.createdAt || Date.now(),
      localRoomBooking: true
    };
  },

  syncPendingOrderCache(remoteOrders = []) {
    const pending = wx.getStorageSync('pendingBillingBooking') || {};
    if (!pending.orderId && !pending.resourceId) return;

    const remoteOrder = remoteOrders.find(order => this.ordersMatch(order, pending));
    if (!remoteOrder) return;

    const status = this.resolveOrderStatus(remoteOrder);
    if (status !== null && status !== 0) {
      wx.removeStorageSync('pendingBillingBooking');
    }
  },

  applyPendingOrderOverlay(remoteOrders = []) {
    const pending = wx.getStorageSync('pendingBillingBooking') || {};
    if (!pending.orderId && !pending.resourceId) return remoteOrders;

    return remoteOrders.map(order => {
      if (!this.ordersMatch(order, pending)) return order;
      const status = this.resolveOrderStatus(order);
      if (status !== 0) return order;
      return {
        ...order,
        cashierUrl: order.cashierUrl || pending.cashierUrl || '',
        tradeNo: order.tradeNo || pending.tradeNo || '',
        paymentTradeNo: order.paymentTradeNo || pending.paymentTradeNo || pending.tradeNo || '',
        payExpireAt: order.payExpireAt || pending.payExpireAt || pending.unlockDeadline || '',
        unlockDeadline: order.unlockDeadline || pending.unlockDeadline || ''
      };
    });
  },

  applyLocalPaidOrderOverlay(remoteOrders = []) {
    const paid = wx.getStorageSync('lastPaidBooking') || {};
    if (!paid.orderId && !paid.resourceId) return remoteOrders;

    const paidAt = Number(paid.paidAt || 0);
    if (paidAt && Date.now() - paidAt > LOCAL_PAID_OVERLAY_MS) return remoteOrders;

    return remoteOrders.map(order => {
      if (!this.ordersMatch(order, paid)) return order;
      const status = this.resolveOrderStatus(order);
      if (status !== 0 && status !== null) return order;
      return {
        ...order,
        status: 10,
        orderStatus: 10,
        paidAmount: order.paidAmount || paid.amount || order.prepaidAmount || order.amount,
        localPaid: true
      };
    });
  },

  extractResponseList(source) {
    const queue = [source];
    const seen = [];
    const listKeys = ['list', 'records', 'rows', 'items', 'content', 'orders'];
    while (queue.length) {
      const current = queue.shift();
      if (Array.isArray(current)) return current;
      if (!current || typeof current !== 'object' || seen.includes(current)) continue;
      seen.push(current);

      for (const key of listKeys) {
        if (Array.isArray(current[key])) return current[key];
      }

      ['data', 'result', 'page'].forEach(key => {
        if (current[key] && current[key] !== current) queue.push(current[key]);
      });
    }
    return [];
  },

  buildRemoteStoreMap(storeRes) {
    const map = {};
    this.extractResponseList(storeRes).forEach(store => {
      const id = store.id || store.storeId;
      if (!id) return;
      map[id] = {
        name: store.storeName || store.name || store.shortName || '',
        image: store.coverUrl || store.logoUrl || store.image || ''
      };
    });
    return map;
  },

  sortOrders(orders) {
    const weight = {
      pendingUse: 0,
      using: 0,
      pendingPay: 1,
      completed: 2,
      refunding: 3,
      refunded: 4,
      cancelled: 5
    };
    const getTime = order => {
      const date = this.parseDate(order.createTime || order.createdAt || order.bookingStartTime || order.startTime);
      return date ? date.getTime() : 0;
    };
    return [...orders].sort((a, b) => {
      const aw = weight[a.statusKey] === undefined ? 9 : weight[a.statusKey];
      const bw = weight[b.statusKey] === undefined ? 9 : weight[b.statusKey];
      if (aw !== bw) return aw - bw;
      return getTime(b) - getTime(a);
    });
  },

  extractResponseObject(source) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) return null;
    const isOrderObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj) &&
      (obj.id || obj.orderId || obj.billingOrderId || obj.billingId || obj.resourceId || obj.bookingStartTime || obj.startTime);
    if (isOrderObject(source.order)) return source.order;
    const data = source.data && typeof source.data === 'object' ? source.data : null;
    if (data && !Array.isArray(data)) {
      if (isOrderObject(data.order)) return data.order;
      if (isOrderObject(data.data)) return data.data;
      return isOrderObject(data) ? data : null;
    }
    return isOrderObject(source) ? source : null;
  },

  resolveOrderStatus(order = {}) {
    const orderStatus = this.pickFirstValue(order, ['status', 'orderStatus', 'billingStatus', 'orderState']);
    const normalizedOrderStatus = this.normalizeOrderStatus(orderStatus);
    if (normalizedOrderStatus !== null) return normalizedOrderStatus;

    const paymentStatus = this.pickFirstValue(order, ['payStatus', 'paymentStatus', 'tradeStatus', 'cashierStatus']);
    const normalizedPaymentStatus = this.normalizePaymentStatus(paymentStatus);
    if (normalizedPaymentStatus !== null) return normalizedPaymentStatus;

    return null;
  },

  normalizeOrderStatus(status) {
    if (status === undefined || status === null || status === '') return null;
    const value = Number(status);
    if (!Number.isNaN(value)) return value;

    const text = String(status).toUpperCase();
    if (['WAIT_PAY', 'WAITING_PAY', 'WAIT_PAYMENT', 'WAITING_PAYMENT', 'PENDING', 'PENDING_PAY', 'PENDING_PAYMENT', 'NOTPAY', 'NOT_PAY', 'UNPAID', 'UN_PAID', 'TO_BE_PAID', 'CREATED'].includes(text)) return 0;
    if (['PAID', 'WAIT_USE', 'WAITING_USE', 'RESERVED', 'BOOKED'].includes(text)) return 10;
    if (['USING', 'IN_USE', 'STARTED'].includes(text)) return 20;
    if (['COMPLETED', 'FINISHED', 'DONE'].includes(text)) return 40;
    if (['REFUNDING', 'REFUND_APPLY'].includes(text)) return 50;
    if (['REFUNDED'].includes(text)) return 55;
    if (['CLOSED', 'CANCEL', 'CANCELED', 'CANCELLED'].includes(text)) return 60;
    return null;
  },

  normalizePaymentStatus(status) {
    if (status === undefined || status === null || status === '') return null;
    const value = Number(status);
    if (!Number.isNaN(value)) {
      if (value === 0 || value === 1) return 0;
      if (value === 2) return 10;
      if (value === 3 || value === -1) return 60;
      if (STATUS_MAP[value]) return value;
      return null;
    }

    const text = String(status).toUpperCase();
    if (['WAIT_PAY', 'WAITING_PAY', 'WAIT_PAYMENT', 'WAITING_PAYMENT', 'PENDING', 'PENDING_PAY', 'PENDING_PAYMENT', 'NOTPAY', 'NOT_PAY', 'UNPAID', 'UN_PAID', 'TO_BE_PAID', 'CREATED'].includes(text)) return 0;
    if (['SUCCESS', 'PAY_SUCCESS', 'PAID', 'TRADE_SUCCESS', 'PAYED'].includes(text)) return 10;
    if (['CLOSED', 'CANCEL', 'CANCELED', 'CANCELLED', 'FAILED', 'FAIL', 'PAY_FAIL', 'TRADE_CLOSED'].includes(text)) return 60;
    return null;
  },

  hasOrder(list, target) {
    const targetIds = this.getOrderIdentities(target);
    if (!targetIds.length) return false;
    return list.some(order => this.ordersMatch(order, target));
  },

  ordersMatch(a, b) {
    const aIds = this.getOrderIdentities(a);
    const bIds = this.getOrderIdentities(b);
    if (!aIds.length || !bIds.length) return false;
    return aIds.some(id => bIds.includes(id));
  },

  getOrderIdentities(order) {
    if (!order) return [];
    const values = [
      order.id,
      order.orderId,
      order.billingOrderId,
      order.billingId,
      order.orderNo,
      order.businessOrderNo,
      order.outTradeNo
    ];
    const ids = [];
    values.forEach(value => {
      if (value === undefined || value === null || value === '') return;
      const text = String(value);
      if (!ids.includes(text)) ids.push(text);
    });
    return ids;
  },

  getOrderIdentity(order) {
    return this.getOrderIdentities(order)[0] || '';
  },

  buildLocalPaidOrder() {
    const booking = wx.getStorageSync('lastPaidBooking') || {};
    if (!booking.orderId && !booking.resourceId) return null;
    if (!booking.startTime) return null;

    const start = this.parseDate(booking.startTime);
    const durationMinutes = Number(booking.durationMinutes || 60);
    const end = start ? new Date(start.getTime() + durationMinutes * 60000) : null;
    const amount = Number(booking.amount || 0);

    return {
      id: booking.orderId || `local-paid-${booking.paidAt || Date.now()}`,
      orderId: booking.orderId || '',
      merchantId: booking.merchantId || this.getActiveMerchantId(),
      resourceId: booking.resourceId || '',
      status: 10,
      bookingStartTime: booking.startTime,
      bookingEndTime: end ? this.formatBackendTime(end) : '',
      prepaidAmount: amount,
      paidAmount: amount,
      localPaid: true
    };
  },

  decorateOrder(order) {
    const storeName = this.pickFirstText(order, ['storeName', 'merchantName', 'shopName', 'storeTitle']) || '门店信息待同步';
    const startTime = order.startTime;
    const endTime = order.endTime;
    const durationMinutes = order.bookingDuration || this.calcDurationMinutes(startTime, endTime);
    const typeValue = this.detectBusinessType(order);
    const isPendingPay = order.status === 0;
    const isPendingUse = order.status === 10;
    const isUsing = order.status === 20 || order.status === 30;
    const isCompleted = order.status === 40;
    const isExpiredPendingPay = isPendingPay && this.isPayExpired(order);

    return {
      ...order,
      storeName,
      hasStoreInfo: storeName !== '门店信息待同步',
      businessType: typeValue,
      businessTypeText: this.getBusinessTypeText(typeValue),
      showBusinessType: typeValue !== 'unknown',
      fallbackImage: EMPTY_ORDER_IMAGE,
      displayRoomName: this.formatRoomName(order.roomName, typeValue),
      dateText: this.formatDateText(startTime),
      timeRange: this.formatTimeRange(startTime, endTime),
      durationText: this.formatDuration(durationMinutes),
      capacityText: this.formatCapacity(order.capacity || this.parseCapacity(order.roomTags)),
      showCapacity: !!this.formatCapacity(order.capacity || this.parseCapacity(order.roomTags)),
      amountLabel: isPendingPay ? '应付金额' : '实付',
      tipText: isExpiredPendingPay ? '支付已超时，请重新下单' : this.getTipText(order.status),
      tipType: isPendingPay ? 'warning' : 'success',
      showCancelOrder: isPendingPay && !isExpiredPendingPay,
      showPay: isPendingPay && !isExpiredPendingPay,
      showCancelBooking: isPendingUse,
      showDetail: isPendingUse || isUsing || isCompleted,
      showRenew: isUsing,
      showUnlock: isUsing,
      showRebook: isCompleted
    };
  },

  buildStoreOptions(orders) {
    const map = {};
    orders.forEach(order => {
      if (order.hasStoreInfo) map[order.storeName] = order.storeName;
    });
    return [
      { label: '全部门店', value: 'all' },
      ...Object.keys(map).map(name => ({ label: name, value: name }))
    ];
  },

  getActiveMerchantId() {
    return app.getActiveMerchantId ? app.getActiveMerchantId() : (app.globalData.currentMerchantId || app.globalData.defaultMerchantId || 23);
  },

  switchStatus(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      activeStatus: key,
      statusTabs: this.data.statusTabs.map(item => ({ ...item, active: item.key === key }))
    });
    this.applyFilters();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.applyFilters();
  },

  onDateFilterChange(e) {
    const option = this.data.dateFilterOptions[e.detail.value];
    this.setData({ dateFilterValue: option.value, dateFilterText: option.label });
    this.applyFilters();
  },

  onStoreFilterChange(e) {
    const option = this.data.storeFilterOptions[e.detail.value];
    this.setData({ storeFilterValue: option.value, storeFilterText: option.label });
    this.applyFilters();
  },

  onTypeFilterChange(e) {
    const option = this.data.typeFilterOptions[e.detail.value];
    this.setData({ typeFilterValue: option.value, typeFilterText: option.label });
    this.applyFilters();
  },

  applyFilters() {
    const keyword = (this.data.searchKeyword || '').trim().toLowerCase();
    const now = Date.now();
    let orders = this.data.allOrders;

    if (this.data.activeStatus !== 'all') {
      orders = orders.filter(order => order.statusKey === this.data.activeStatus);
    }

    if (this.data.dateFilterValue) {
      const minTime = now - this.data.dateFilterValue * 24 * 60 * 60 * 1000;
      orders = orders.filter(order => !order.startTime || order.startTime.getTime() >= minTime);
    }

    if (this.data.storeFilterValue !== 'all') {
      orders = orders.filter(order => order.storeName === this.data.storeFilterValue);
    }

    if (this.data.typeFilterValue !== 'all') {
      orders = orders.filter(order => order.businessType === this.data.typeFilterValue);
    }

    if (keyword) {
      orders = orders.filter(order => {
        const text = `${order.orderNo || ''}${order.id || ''}${order.storeName || ''}${order.roomName || ''}`.toLowerCase();
        return text.includes(keyword);
      });
    }

    this.setData({ orders });
  },

  startCountdownTimer() {
    this.stopCountdownTimer();
    this.updateCountdowns();
    this.countdownTimer = setInterval(() => {
      this.updateCountdowns();
    }, 1000);
  },

  stopCountdownTimer() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  },

  updateCountdowns() {
    if (!this.data.allOrders.length) return;

    let hasPendingPay = false;
    const allOrders = this.data.allOrders.map(order => {
      if (order.statusKey !== 'pendingPay') return order;

      hasPendingPay = true;
      if (this.isPayExpired(order)) {
        return {
          ...order,
          tipText: '支付已超时，请重新下单',
          showCancelOrder: false,
          showPay: false
        };
      }

      const tipText = this.getPendingPayTipText(order);
      if (tipText === order.tipText) return order;
      return { ...order, tipText };
    });

    if (!hasPendingPay) return;
    this.setData({ allOrders });
    this.applyFilters();
  },

  isPayExpired(order) {
    return Number(order.payExpireAt || 0) <= Date.now();
  },

  autoCancelExpiredOrder(order) {
    const orderId = order.id;
    if (!orderId) return;

    this.autoCancellingOrders = this.autoCancellingOrders || {};
    if (this.autoCancellingOrders[orderId]) return;
    this.autoCancellingOrders[orderId] = true;

    request(`/api/billing/order/${orderId}/cancel?reason=${encodeURIComponent('支付超时自动取消')}`, {
      method: 'POST'
    }).then(() => {
      this.markOrderCancelled(orderId, '支付超时，订单已自动取消');
    }).catch(err => {
      console.error('自动取消订单失败:', err);
      delete this.autoCancellingOrders[orderId];
      this.markAutoCancelFailed(orderId);
    });
  },

  markOrderCancelled(orderId, tipText) {
    const allOrders = this.data.allOrders.map(order => {
      if (!this.ordersMatch(order, { id: orderId })) return order;
      return {
        ...order,
        status: 60,
        statusText: '已取消',
        statusKey: 'cancelled',
        tipText,
        tipType: 'success',
        showCancelOrder: false,
        showPay: false,
        showCancelBooking: false,
        showDetail: false,
        showRenew: false,
        showUnlock: false,
        showRebook: false
      };
    });
    this.setData({ allOrders });
    this.applyFilters();
  },

  markAutoCancelFailed(orderId) {
    const allOrders = this.data.allOrders.map(order => {
      if (!this.ordersMatch(order, { id: orderId })) return order;
      return {
        ...order,
        tipText: '支付已超时，自动取消失败，请手动取消',
        showCancelOrder: true,
        showPay: false
      };
    });
    this.setData({ allOrders });
    this.applyFilters();
  },

  getPayExpireAt(order) {
    const explicitExpire = this.pickFirstDate(order, [
      'payExpireAt',
      'payExpireTime',
      'payDeadline',
      'paymentDeadline',
      'paymentExpireAt',
      'paymentExpireTime',
      'paymentTimeoutAt',
      'paymentTimeoutTime',
      'expireAt',
      'expireTime',
      'deadline',
      'deadlineTime',
      'expiredAt',
      'expiredTime',
      'cashierExpireAt',
      'cashierExpireTime',
      'unlockDeadline',
      'unlockDeadlineTime',
      'unlockExpireAt',
      'unlockExpireTime'
    ]);
    if (explicitExpire) return explicitExpire.getTime();

    const createdAt = this.pickFirstDate(order, [
      'createdAt',
      'createTime',
      'createdTime',
      'orderCreateTime',
      'orderTime',
      'submitTime',
      'createAt'
    ]);
    if (createdAt) return createdAt.getTime() + PAY_EXPIRE_MINUTES * 60 * 1000;

    const key = `payExpireAt_${order.id || order.orderNo}`;
    const cached = wx.getStorageSync(key);
    if (cached) return Number(cached);

    const fallbackExpireAt = Date.now() + PAY_EXPIRE_MINUTES * 60 * 1000;
    wx.setStorageSync(key, fallbackExpireAt);
    return fallbackExpireAt;
  },

  pickFirstDate(obj, keys) {
    const queue = [obj];
    const seen = [];
    const nestedKeys = ['data', 'order', 'billingOrder', 'payment', 'cashier'];

    while (queue.length) {
      const current = queue.shift();
      if (!current || typeof current !== 'object' || seen.includes(current)) continue;
      seen.push(current);

      for (const key of keys) {
        if (current[key]) {
          const date = this.parseDate(current[key]);
          if (date) return date;
        }
      }

      nestedKeys.forEach(key => {
        if (current[key] && typeof current[key] === 'object') queue.push(current[key]);
      });
    }

    return null;
  },

  parseDate(value) {
    if (!value) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (typeof value === 'number') {
      const ms = value < 10000000000 ? value * 1000 : value;
      const date = new Date(ms);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const normalized = String(value).replace(/-/g, '/');
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  },

  formatBackendTime(date) {
    if (!date || Number.isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  },

  getPendingPayTipText(order) {
    const remainMs = Math.max(0, Number(order.payExpireAt || 0) - Date.now());
    if (!remainMs) return '支付已超时，订单将自动取消';

    const totalSeconds = Math.ceil(remainMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `剩余支付时间 ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}，超时将自动取消`;
  },

  calcDurationMinutes(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    return Math.max(0, Math.round((endTime.getTime() - startTime.getTime()) / 60000));
  },

  formatDateText(date) {
    if (!date) return '--';
    const now = new Date();
    const sameDay = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
    if (sameDay) return '今天';
    return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  formatTimeRange(startTime, endTime) {
    const fmt = d => d ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` : '--:--';
    return `${fmt(startTime)}-${fmt(endTime)}`;
  },

  formatDuration(minutes) {
    if (!minutes) return '';
    if (minutes % 60 === 0) return `${minutes / 60}小时`;
    return `${(minutes / 60).toFixed(1)}小时`;
  },

  detectBusinessType(order) {
    const text = `${order.roomName || ''}${order.roomTags || ''}${order.storeName || ''}`.toLowerCase();
    if (TYPE_KEYWORDS.carwash.some(k => text.includes(k.toLowerCase()))) return 'carwash';
    if (TYPE_KEYWORDS.billiards.some(k => text.includes(k.toLowerCase()))) return 'billiards';
    if (TYPE_KEYWORDS.mahjong.some(k => text.includes(k.toLowerCase()))) return 'mahjong';
    return 'unknown';
  },

  getBusinessTypeText(type) {
    if (type === 'billiards') return '台球';
    if (type === 'carwash') return '洗车';
    if (type === 'mahjong') return '棋牌';
    return '待同步';
  },

  formatRoomName(roomName, type) {
    const name = roomName || '';
    if (name) return name;
    return '资源信息待同步';
  },

  formatCapacity(capacity) {
    if (!capacity) return '';
    const text = String(capacity);
    if (text.includes('人')) return text;
    return `${text}人`;
  },

  formatIdLabel(prefix, id) {
    if (!id) return '';
    return `${prefix} ${id}`;
  },

  pickFirstText(obj, keys) {
    for (const key of keys) {
      const value = obj && obj[key];
      if (value !== undefined && value !== null && String(value).trim() !== '') return String(value).trim();
    }
    return '';
  },

  pickFirstValue(obj, keys) {
    for (const key of keys) {
      const value = obj && obj[key];
      if (value !== undefined && value !== null && value !== '') return value;
    }
    return undefined;
  },

  pickFirstNumber(obj, keys) {
    for (const key of keys) {
      const value = obj && obj[key];
      if (value !== undefined && value !== null && value !== '' && !Number.isNaN(Number(value))) return Number(value);
    }
    return 0;
  },

  parseCapacity(tags) {
    if (!tags) return '';
    const match = String(tags).match(/\d+\s*[-–]\s*\d+\s*人|\d+\s*人/);
    return match ? match[0].replace(/\s/g, '') : '';
  },

  getTipText(status) {
    if (status === 0) return '剩余支付时间 --:--，超时将自动取消';
    if (status === 10) return '如需取消，请在订单详情页中申请或取消预约';
    if (status === 20 || status === 30) return '预约已开始，可自助开门；如需续时，请在结束前申请';
    if (status === 40) return '订单已完成';
    if (status === 60) return '订单已取消';
    if (status === 50) return '退款申请处理中';
    if (status === 55) return '订单已退款';
    return '订单状态已更新';
  },

  viewOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/order-detail/order-detail?orderId=${orderId}` });
  },

  payOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    const order = this.data.allOrders.find(o => this.ordersMatch(o, { id: orderId }));
    const cashierUrl = (order && order.cashierUrl) || '';
    if (cashierUrl) {
      openCashier({
        cashierUrl,
        tradeNo: (order && (order.tradeNo || order.paymentTradeNo)) || '',
        orderId,
        title: '订单支付'
      });
    } else {
      wx.showToast({ title: '支付链接已过期，请重新下单', icon: 'none' });
    }
  },

  cancelOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    const order = this.data.allOrders.find(item => String(item.id) === String(orderId)) || {};
    this.setData({
      showCancelConfirm: true,
      cancelConfirmOrderId: orderId,
      cancelConfirmSubmitting: false,
      cancelConfirm: this.getCancelConfirmInfo(order)
    });
  },

  getCancelConfirmInfo(order) {
    const isPaidBooking = order.statusKey === 'pendingUse';
    const title = isPaidBooking ? '确认取消预约' : '确认取消订单';
    const desc = isPaidBooking
      ? '取消后将释放该预约时段，已支付金额会按门店规则处理。'
      : '取消后订单将关闭，当前未支付订单不会产生扣款。';
    return {
      title,
      desc,
      storeName: order.storeName || '门店信息待同步',
      roomName: order.displayRoomName || order.roomName || '资源信息待同步',
      timeText: `${order.dateText || ''} ${order.timeRange || ''}`.trim() || '--',
      amountText: `￥${order.priceYuan || 0}`,
      confirmText: isPaidBooking ? '确认取消预约' : '确认取消订单'
    };
  },

  closeCancelConfirm() {
    if (this.data.cancelConfirmSubmitting) return;
    this.setData({
      showCancelConfirm: false,
      cancelConfirmOrderId: '',
      cancelConfirm: {}
    });
  },

  noop() {},

  confirmCancelOrder() {
    const orderId = this.data.cancelConfirmOrderId;
    if (!orderId || this.data.cancelConfirmSubmitting) return;

    this.setData({ cancelConfirmSubmitting: true });
    wx.showLoading({ title: '处理中...' });
    const externalUserId = app.globalData.userId || wx.getStorageSync('userId') || '';
    const query = externalUserId ? `?externalUserId=${encodeURIComponent(String(externalUserId))}` : '';
    request(`/api/billing/order/${orderId}/cancel${query}`, { method: 'POST' }).then((res) => {
      wx.hideLoading();
      this.setData({
        showCancelConfirm: false,
        cancelConfirmOrderId: '',
        cancelConfirmSubmitting: false,
        cancelConfirm: {}
      });
      if (res.cancelLimit && res.cancelLimit.limited) {
        wx.showModal({
          title: '订单已取消',
          content: res.cancelLimit.message || '短时间内取消次数较多，稍后才能再次取消',
          showCancel: false,
          confirmText: '知道了'
        });
      } else {
        wx.showToast({ title: '订单已取消', icon: 'success' });
      }
      this.loadOrders();
    }).catch(err => {
      wx.hideLoading();
      this.setData({ cancelConfirmSubmitting: false });
      this.showCancelError(err, '取消失败');
    });
  },

  showCancelError(err, fallbackText) {
    if (err && err.data && err.data.code === 'CANCEL_LIMITED') {
      wx.showModal({
        title: '暂时无法取消',
        content: err.data.message || '取消过于频繁，请稍后再试',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }
    wx.showToast({ title: (err && err.message) || fallbackText, icon: 'none' });
  },

  unlockRoom(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/unlock/unlock?orderId=${orderId}` });
  },

  endUsage(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认退房', content: '确定要退房结算吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' });
          request(`/api/billing/order/${orderId}/end`, { method: 'POST' }).then(() => {
            wx.hideLoading();
            wx.showToast({ title: '退房成功', icon: 'success' });
            this.loadOrders();
          }).catch(err => {
            wx.hideLoading();
            wx.showToast({ title: err.message || '退房失败', icon: 'none' });
          });
        }
      }
    });
  },

  rateOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '订单评价',
      editable: true,
      placeholderText: '请输入评价内容',
      success: (res) => {
        if (!res.confirm) return;
        const merchantId = (this.data.allOrders.find(o => this.ordersMatch(o, { id: orderId })) || {}).merchantId || this.getActiveMerchantId();
        request(`/api/sqd/payment/orders/${orderId}/review?merchantId=${merchantId}`, {
          method: 'POST',
          data: { rating: 5, content: res.content || '满意' }
        }).then(() => {
          wx.showToast({ title: '评价成功', icon: 'success' });
        }).catch(err => {
          wx.showToast({ title: err.message || '评价失败', icon: 'none' });
        });
      }
    });
  },

  renewOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['续时30分钟', '续时1小时', '续时2小时'],
      success: (res) => {
        const minutes = [30, 60, 120][res.tapIndex];
        wx.showLoading({ title: '处理中...' });
        request(`/api/billing/order/${orderId}/renew?additionalMinutes=${minutes}`, {
          method: 'POST'
        }).then(r => {
          wx.hideLoading();
          const cashierUrl = r.cashierUrl || (r.data && r.data.cashierUrl);
          if (cashierUrl) {
            const payload = r.data || r || {};
            openCashier({
              cashierUrl,
              tradeNo: payload.tradeNo || payload.paymentTradeNo || '',
              orderId,
              title: '续时支付'
            });
          } else {
            wx.showToast({ title: '续时成功', icon: 'success' });
            this.loadOrders();
          }
        }).catch(err => {
          wx.hideLoading();
          wx.showToast({ title: err.message || '续时失败', icon: 'none' });
        });
      }
    });
  },

  rebookOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    const order = this.data.allOrders.find(o => this.ordersMatch(o, { id: orderId }));
    if (order && order.resourceId) {
      wx.navigateTo({ url: `/pages/room-detail/room-detail?id=${order.resourceId}&merchantId=${order.merchantId || this.getActiveMerchantId()}` });
    } else {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/index/index' });
  }
});
