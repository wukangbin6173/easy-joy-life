const app = getApp();
const { request, storeApi, roomApi } = require('../../utils/api.js');
const { openCashier } = require('../../utils/payment.js');
const config = require('../../utils/config.js');

const STATUS_MAP = {
  0: { text: '待支付', desc: '请尽快完成支付，超时将自动取消', key: 'pendingPay' },
  10: { text: '待使用', desc: '资源已为您预留，请按预约时间到店使用。', key: 'pendingUse' },
  20: { text: '使用中', desc: '房间使用中', key: 'using' },
  30: { text: '待结算', desc: '使用结束，等待结算', key: 'using' },
  40: { text: '已完成', desc: '订单已完成', key: 'completed' },
  50: { text: '已退款', desc: '订单已退款', key: 'refunded' },
  55: { text: '已退款', desc: '订单已退款', key: 'refunded' },
  60: { text: '已取消', desc: '订单已取消', key: 'cancelled' }
};

const TYPE_KEYWORDS = {
  mahjong: ['棋牌', '麻将', '包间', '包房', '棋牌室', 'mahjong'],
  billiards: ['台球', '桌球', '球台', '8球', '八球', 'billiard', 'pool'],
  carwash: ['洗车', '洗车机', '自助洗车', 'carwash', 'car wash']
};

const BUSINESS_META = {
  mahjong: { typeText: '棋牌', resourceLabel: '包间', feeLabel: '包间费', useTarget: '包间', showCapacity: true, showPeople: true },
  billiards: { typeText: '台球', resourceLabel: '球台', feeLabel: '球台费', useTarget: '球台', showCapacity: false, showPeople: false },
  carwash: { typeText: '洗车', resourceLabel: '服务', feeLabel: '洗车服务费', useTarget: '洗车服务', showCapacity: false, showPeople: false },
  generic: { typeText: '服务', resourceLabel: '资源', feeLabel: '费用', useTarget: '服务', showCapacity: false, showPeople: false }
};

Page({
  data: {
    order: {},
    loading: true,
    showRefundModal: false,
    refundPreview: {},
    refundReasons: ['行程有变', '时间选错', '临时取消', '其他原因'],
    selectedRefundReason: '行程有变',
    submittingRefund: false
  },

  onLoad(options) {
    this.setData({ orderId: options.orderId });
    this.loadOrderDetail(options.orderId);
  },

  onShow() {
    if (this.data.orderId) this.loadOrderDetail(this.data.orderId);
  },

  loadOrderDetail(orderId) {
    this.setData({ loading: true });
    request(`/api/billing/order/${orderId}`).then(res => {
      const o = res.data || {};
      const statusInfo = STATUS_MAP[o.status] || { text: '未知', desc: '' };
      const order = this.formatOrder(o, statusInfo);
      this.setData({ order, loading: false });
      this.enrichOrder(order);
    }).catch(() => {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  formatOrder(o, statusInfo) {
    const status = Number(o.status);
    const start = this.parseDate(o.bookingStartTime || o.startTime);
    const end = this.parseDate(o.bookingEndTime || o.endTime);
    const durationMinutes = o.bookingDuration || this.calcDurationMinutes(start, end);
    const total = o.prepaidAmount ? (o.prepaidAmount / 100).toFixed(0) : '0';
    const unit = durationMinutes ? (Number(total) / (durationMinutes / 60)).toFixed(0) : total;
    const key = statusInfo.key;
    const businessType = this.detectBusinessType(o);
    const businessMeta = this.getBusinessMeta(businessType);
    const capacityText = o.capacity || this.parseCapacity(o.tags || o.resourceTags) || '';
    const peopleText = o.peopleCount ? `${o.peopleCount}人` : '';
    const refundAction = this.getRefundAction(status, total, businessMeta);
    return {
      ...o,
      status,
      statusKey: key,
      statusText: statusInfo.text,
      statusDesc: this.formatStatusDesc(statusInfo, key, businessMeta),
      statusIcon: key === 'pendingUse' || key === 'using' ? '/images/时间.png' : '/images/订单提醒.png',
      countdownText: key === 'pendingUse' ? this.getCountdownText(start) : '',
      openTip: key === 'pendingUse' ? this.getOpenTip(businessMeta) : '',
      noticeText: key === 'pendingUse' ? this.getNoticeText(businessMeta) : '',
      storeName: this.pickFirstText(o, ['storeName', 'merchantName', 'shopName', 'storeTitle', 'merchantShortName']) || '门店信息待同步',
      roomName: this.pickFirstText(o, ['roomName', 'resourceName', 'resourceTitle', 'resourceNo']) || '资源信息待同步',
      businessType,
      businessTypeText: this.pickFirstText(o, ['businessTypeText', 'businessTypeName']) || businessMeta.typeText,
      resourceLabel: businessMeta.resourceLabel,
      feeLabel: businessMeta.feeLabel,
      packageName: o.packageName || '按小时预约',
      dateText: this.formatDateText(start),
      timeRange: this.formatTimeRange(start, end),
      durationText: this.formatDuration(durationMinutes),
      capacityText: capacityText || '--',
      peopleText: peopleText || '--',
      showCapacity: businessMeta.showCapacity && !!capacityText,
      showPeople: businessMeta.showPeople && !!peopleText,
      tagList: this.parseTagList(o.tags || o.resourceTags || o.roomTags),
      useInstruction: `请按预约时间到店使用${businessMeta.useTarget}。`,
      openInstruction: businessType === 'carwash' ? '请在有效时间内到店使用，具体启用方式以门店设备为准。' : '自助开门将在预约开始前 10 分钟开放，预约结束后自动关闭。',
      address: this.pickFirstText(o, ['address', 'storeAddress', 'detailAddress']) || '门店地址待同步',
      orderNo: o.orderNo || o.id || '--',
      createTimeText: this.formatDateTime(o.createTime || o.createdAt || o.orderTime),
      payTimeText: this.formatDateTime(o.payTime || o.paymentTime) || (o.status === 0 ? '未支付' : '--'),
      payMethodText: o.payMethodText || o.payMethod || '商家收银台支付',
      contactName: o.contactName || (app.globalData.userInfo && app.globalData.userInfo.nickname) || '微信用户',
      phoneText: this.maskPhone(o.phone || (app.globalData.userInfo && app.globalData.userInfo.phone)),
      unitPrice: unit,
      roomFee: total,
      serviceFee: '0',
      discount: '0',
      totalPrice: total,
      amountLabel: status === 0 ? '应付' : '实付',
      coverImage: o.resourcePhoto || o.coverImage || config.DEFAULT_ROOM_IMAGE,
      showNavigate: key === 'pendingUse' || key === 'using',
      showUnlock: key === 'pendingUse' || key === 'using',
      showPay: key === 'pendingPay',
      showRefundEntry: refundAction.available,
      refundEntryTitle: refundAction.entryTitle,
      refundEntryDesc: refundAction.entryDesc,
      refundAction
    };
  },

  detectBusinessType(order = {}) {
    const text = [
      order.businessType,
      order.businessTypeName,
      order.businessTypeText,
      order.roomName,
      order.resourceName,
      order.resourceTitle,
      order.resourceType,
      order.storeName,
      order.merchantName,
      order.tags,
      order.resourceTags,
      order.roomTags
    ].filter(Boolean).join(' ').toLowerCase();

    if (TYPE_KEYWORDS.carwash.some(keyword => text.includes(keyword.toLowerCase()))) return 'carwash';
    if (TYPE_KEYWORDS.billiards.some(keyword => text.includes(keyword.toLowerCase()))) return 'billiards';
    if (TYPE_KEYWORDS.mahjong.some(keyword => text.includes(keyword.toLowerCase()))) return 'mahjong';
    return 'generic';
  },

  getBusinessMeta(type) {
    return BUSINESS_META[type] || BUSINESS_META.generic;
  },

  buildBusinessPatch(order = {}) {
    const businessType = this.detectBusinessType(order);
    const businessMeta = this.getBusinessMeta(businessType);
    const capacityText = order.capacityText && order.capacityText !== '--'
      ? order.capacityText
      : (order.capacity || this.parseCapacity(order.tags || order.resourceTags || order.roomTags) || '');
    const peopleText = order.peopleText && order.peopleText !== '--'
      ? order.peopleText
      : (order.peopleCount ? `${order.peopleCount}人` : '');
    return {
      businessType,
      businessTypeText: businessMeta.typeText,
      resourceLabel: businessMeta.resourceLabel,
      feeLabel: businessMeta.feeLabel,
      showCapacity: businessMeta.showCapacity && !!capacityText,
      showPeople: businessMeta.showPeople && !!peopleText,
      capacityText: capacityText || '--',
      peopleText: peopleText || '--',
      tagList: this.parseTagList(order.tags || order.resourceTags || order.roomTags),
      useInstruction: `请按预约时间到店使用${businessMeta.useTarget}。`,
      openInstruction: businessType === 'carwash' ? '请在有效时间内到店使用，具体启用方式以门店设备为准。' : '自助开门将在预约开始前 10 分钟开放，预约结束后自动关闭。'
    };
  },

  formatStatusDesc(statusInfo, key, businessMeta) {
    if (key === 'pendingUse') return `${businessMeta.resourceLabel}已为您预留，请按预约时间到店使用。`;
    if (key === 'using') return `${businessMeta.useTarget}使用中`;
    return statusInfo.desc || '';
  },

  getCountdownText(start) {
    if (!start) return '';
    const minutes = Math.ceil((start.getTime() - Date.now()) / 60000);
    if (minutes <= 0) return '预约已开始，请按时到店使用';
    if (minutes <= 60) return `距离预约开始还有 ${minutes} 分钟`;
    return '';
  },

  getOpenTip(businessMeta) {
    if (businessMeta === BUSINESS_META.carwash) return '请在预约时段内到店使用。';
    return '自助开门将在预约开始前 10 分钟开放。';
  },

  getNoticeText(businessMeta) {
    if (businessMeta === BUSINESS_META.carwash) return '当前订单已支付，请按预约时段到店使用洗车服务。';
    return `当前已接近预约时间，到店后可使用“自助开门”进入${businessMeta.useTarget}。`;
  },

  getRefundAction(status, totalPrice, businessMeta = BUSINESS_META.generic) {
    status = Number(status);
    if (status === 0) {
      return {
        available: true,
        type: 'cancelUnpaid',
        entryTitle: '取消订单',
        entryDesc: `未支付订单可直接取消，${businessMeta.resourceLabel || '资源'}将立即释放`,
        modalTitle: '取消未支付订单',
        badgeText: '无需退款',
        amountLabel: '退款金额',
        amountText: '¥0',
        policyText: '当前订单尚未支付，取消后不会产生扣款，也不会发起退款。',
        confirmText: '确认取消'
      };
    }

    if (status === 10) {
      return {
        available: true,
        type: 'cancelPaid',
        entryTitle: '取消预约/退款',
        entryDesc: '待使用订单可取消，退款按门店规则处理',
        modalTitle: '取消预约并申请退款',
        badgeText: '按规则退款',
        amountLabel: '已付金额',
        amountText: `¥${totalPrice || 0}`,
        policyText: '当前订单已支付但尚未开始使用，提交后系统会按门店取消规则计算手续费，剩余金额原路退回。',
        confirmText: '提交申请'
      };
    }

    return {
      available: false,
      type: 'disabled',
      entryTitle: '',
      entryDesc: '',
      modalTitle: '',
      badgeText: '',
      amountLabel: '',
      amountText: '',
      policyText: '',
      confirmText: ''
    };
  },

  enrichOrder(order) {
    const merchantId = order.merchantId || this.getActiveMerchantId();
    if (order.resourceId && merchantId) {
      roomApi.getRoomById(order.resourceId, merchantId).then(res => {
        const room = this.extractData(res);
        const patch = {};
        const roomName = this.pickFirstText(room, ['resourceName', 'name', 'roomName', 'title']);
        if (roomName) patch.roomName = roomName;
        if (room.resourcePhoto && !String(room.resourcePhoto).startsWith('file://')) patch.coverImage = room.resourcePhoto;
        if (room.tags) {
          patch.roomTags = room.tags;
          patch.capacityText = this.parseCapacity(room.tags) || order.capacityText;
        }
        if (room.storeId || room.shopId) patch.storeId = room.storeId || room.shopId;
        Object.assign(patch, this.buildBusinessPatch({ ...this.data.order, ...patch, ...room }));
        this.applyOrderPatch(patch);
        if (patch.storeId) this.enrichStore(patch.storeId);
      }).catch(() => {});
    }

    const storeId = order.storeId;
    if (storeId) {
      this.enrichStore(storeId);
    } else if (merchantId) {
      this.enrichMerchant(merchantId);
    }
  },

  enrichStore(storeId) {
    storeApi.getStoreById(storeId).then(res => {
      const store = this.extractData(res);
      const patch = {
        storeId: store.id || store.storeId || storeId,
        storeName: this.pickFirstText(store, ['storeName', 'name', 'title', 'shortName']),
        address: this.pickFirstText(store, ['address', 'storeAddress', 'detailAddress']),
        latitude: store.latitude || store.lat,
        longitude: store.longitude || store.lng || store.lon
      };
      Object.assign(patch, this.buildBusinessPatch({ ...this.data.order, ...patch, ...store }));
      this.applyOrderPatch(patch);
    }).catch(() => {});
  },

  enrichMerchant(merchantId) {
    storeApi.getMerchant(merchantId).then(res => {
      const merchant = this.extractData(res);
      const storeName = this.pickFirstText(merchant, ['storeName', 'merchantName', 'shortName', 'name']);
      const patch = {};
      if (storeName && (!this.data.order.storeName || this.data.order.storeName === '门店信息待同步')) {
        patch.storeName = storeName;
      }
      if (!this.data.order.address || this.data.order.address === '门店地址待同步') {
        patch.address = this.pickFirstText(merchant, ['address', 'storeAddress', 'detailAddress']);
      }
      this.applyOrderPatch(patch);
    }).catch(() => {});
  },

  cancelOrder() {
    this.openRefundModal();
  },

  unlockRoom() {
    wx.navigateTo({ url: `/pages/unlock/unlock?orderId=${this.data.orderId}` });
  },

  payOrder() {
    const cashierUrl = this.data.order.cashierUrl || '';
    if (!cashierUrl) {
      wx.showToast({ title: '支付链接已过期，请重新下单', icon: 'none' });
      return;
    }
    const tradeNo = this.data.order.tradeNo || this.data.order.paymentTradeNo || '';
    openCashier({
      cashierUrl,
      tradeNo,
      orderId: this.data.orderId,
      title: '订单支付'
    });
  },

  navigateToStore() {
    const order = this.data.order;
    if (order.latitude && order.longitude) {
      wx.openLocation({
        latitude: parseFloat(order.latitude),
        longitude: parseFloat(order.longitude),
        name: order.storeName || '门店位置',
        address: order.address || '',
        scale: 18
      });
    } else if (order.address && !['暂无地址', '门店地址待同步'].includes(order.address)) {
      wx.showModal({
        title: order.storeName || '门店地址',
        content: `${order.address}\n\n该门店缺少经纬度，暂无法直接打开地图。`,
        confirmText: '复制地址',
        cancelText: '关闭',
        success: (res) => {
          if (res.confirm) wx.setClipboardData({ data: order.address });
        }
      });
    } else {
      wx.showToast({ title: '暂无门店位置信息', icon: 'none' });
    }
  },

  refundOrder() {
    this.openRefundModal();
  },

  openRefundModal() {
    const order = this.data.order || {};
    const action = order.refundAction || this.getRefundAction(order.status, order.totalPrice);
    if (!action.available) {
      wx.showToast({ title: this.getRefundUnavailableText(order.status), icon: 'none' });
      return;
    }

    this.setData({
      showRefundModal: true,
      refundPreview: action,
      selectedRefundReason: this.data.selectedRefundReason || '行程有变'
    });
  },

  closeRefundModal() {
    if (this.data.submittingRefund) return;
    this.setData({ showRefundModal: false });
  },

  noop() {},

  selectRefundReason(e) {
    this.setData({ selectedRefundReason: e.currentTarget.dataset.reason });
  },

  confirmRefundAction() {
    const order = this.data.order || {};
    const action = this.data.refundPreview || {};
    const status = Number(order.status);
    if (!action.available || (status !== 0 && status !== 10)) {
      wx.showToast({ title: this.getRefundUnavailableText(order.status), icon: 'none' });
      return;
    }

    const reason = encodeURIComponent(this.data.selectedRefundReason || '用户取消');
    const externalUserId = app.globalData.userId || wx.getStorageSync('userId') || '';
    const query = [`reason=${reason}`];
    if (externalUserId) query.push(`externalUserId=${encodeURIComponent(String(externalUserId))}`);
    this.setData({ submittingRefund: true });
    wx.showLoading({ title: action.type === 'cancelPaid' ? '提交中...' : '取消中...' });

    request(`/api/billing/order/${this.data.orderId}/cancel?${query.join('&')}`, { method: 'POST' }).then((res) => {
      wx.hideLoading();
      this.setData({ showRefundModal: false, submittingRefund: false });
      const successTitle = action.type === 'cancelPaid' ? '申请已提交' : '订单已取消';
      if (res.cancelLimit && res.cancelLimit.limited) {
        wx.showModal({
          title: successTitle,
          content: res.cancelLimit.message || '短时间内取消次数较多，稍后才能再次取消',
          showCancel: false,
          confirmText: '知道了'
        });
      } else {
        wx.showToast({ title: successTitle, icon: 'success' });
      }
      this.loadOrderDetail(this.data.orderId);
    }).catch(err => {
      wx.hideLoading();
      this.setData({ submittingRefund: false });
      this.showCancelError(err, '操作失败');
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

  getRefundUnavailableText(status) {
    if (status === 20) return '使用中订单请先退房结算';
    if (status === 30) return '订单待结算，请稍后查看';
    if (status === 40) return '已完成订单暂不支持线上退款';
    if (status === 50 || status === 55) return '订单已退款';
    if (status === 60) return '订单已取消';
    return '当前订单状态不支持退款';
  },

  endUsage() {
    wx.showModal({
      title: '确认退房',
      content: '确定要退房结算吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' });
          request(`/api/billing/order/${this.data.orderId}/end`, { method: 'POST' }).then(() => {
            wx.hideLoading();
            wx.showToast({ title: '退房成功', icon: 'success' });
            this.loadOrderDetail(this.data.orderId);
          }).catch(err => {
            wx.hideLoading();
            wx.showToast({ title: err.message || '退房失败', icon: 'none' });
          });
        }
      }
    });
  },

  rateOrder() {
    wx.showModal({
      title: '订单评价',
      editable: true,
      placeholderText: '请输入评价内容',
      success: (res) => {
        if (!res.confirm) return;
        const merchantId = this.data.order.merchantId || (app.getActiveMerchantId ? app.getActiveMerchantId() : config.DEFAULT_MERCHANT_ID);
        request(`/api/sqd/payment/orders/${this.data.orderId}/review?merchantId=${merchantId}`, {
          method: 'POST',
          data: { rating: 5, content: res.content || '满意' }
        }).then(() => wx.showToast({ title: '评价成功', icon: 'success' }))
          .catch(err => wx.showToast({ title: err.message || '评价失败', icon: 'none' }));
      }
    });
  },

  contactService() {
    wx.navigateTo({ url: '/pages/customer-service/customer-service' });
  },

  copyOrderNo() {
    wx.setClipboardData({ data: `${this.data.order.orderNo || ''}` });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/orders/orders' });
  },

  calcDurationMinutes(start, end) {
    if (!start || !end) return 0;
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  },

  parseDate(value) {
    if (!value) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (typeof value === 'number') {
      const ms = value < 10000000000 ? value * 1000 : value;
      const date = new Date(ms);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const date = new Date(String(value).replace(/-/g, '/'));
    return Number.isNaN(date.getTime()) ? null : date;
  },

  formatDateText(date) {
    if (!date) return '今天';
    const now = new Date();
    const same = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
    return same ? '今天' : `${date.getMonth() + 1}/${date.getDate()}`;
  },

  formatTimeRange(start, end) {
    const fmt = d => d ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` : '--:--';
    return `${fmt(start)}-${fmt(end)}`;
  },

  formatDuration(minutes) {
    if (!minutes) return '--';
    return minutes % 60 === 0 ? `${minutes / 60}小时` : `${(minutes / 60).toFixed(1)}小时`;
  },

  formatDateTime(value) {
    const d = this.parseDate(value);
    if (!d) return '';
    const now = new Date();
    const prefix = now.toDateString() === d.toDateString() ? '今天' : `${d.getMonth() + 1}/${d.getDate()}`;
    return `${prefix} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  },

  maskPhone(phone) {
    if (!phone) return '--';
    const text = `${phone}`;
    if (text.length < 7) return text;
    return `${text.slice(0, 3)} **** ${text.slice(-4)}`;
  },

  parseCapacity(tags) {
    const match = String(tags).match(/\d+\s*[-–]\s*\d+\s*人|\d+\s*人/);
    return match ? match[0].replace(/\s/g, '') : '';
  },

  parseTagList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean).map(item => `${item}`).slice(0, 3);
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(item => `${item}`).slice(0, 3);
    } catch (e) {}
    return String(value).split(/[,，、|/\s]+/).filter(Boolean).slice(0, 3);
  },

  extractData(res) {
    if (!res) return {};
    if (res.data && res.data.data && typeof res.data.data === 'object' && !Array.isArray(res.data.data)) return res.data.data;
    if (res.data && typeof res.data === 'object') return res.data;
    if (res.result && typeof res.result === 'object') return res.result;
    return res;
  },

  pickFirstText(source, fields) {
    if (!source) return '';
    for (const field of fields) {
      const value = source[field];
      if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return '';
  },

  applyOrderPatch(patch) {
    const clean = {};
    Object.keys(patch || {}).forEach(key => {
      const value = patch[key];
      if (value !== undefined && value !== null && value !== '') clean[key] = value;
    });
    if (Object.keys(clean).length) {
      this.setData({ order: { ...this.data.order, ...clean } });
    }
  },

  getActiveMerchantId() {
    return (app.getActiveMerchantId && app.getActiveMerchantId()) || config.DEFAULT_MERCHANT_ID;
  }
});
