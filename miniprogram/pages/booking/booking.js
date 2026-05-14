const app = getApp();
const { roomApi, storeApi } = require('../../utils/api.js');
const config = require('../../utils/config.js');
const bookingModeUtil = require('../../utils/booking-mode.js');
const DAY_MINUTES = 24 * 60;

Page({
  data: {
    room: {},
    roomId: '',
    storeId: '',
    merchantId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    phone: '',
    remark: '',
    duration: 0,
    totalPrice: 0,
    bookingEnabled: false
  },

  onLoad: function(options) {
    const roomId = options.roomId;
    const storeId = options.storeId;
    const merchantId = options.merchantId || (app.getActiveMerchantId && app.getActiveMerchantId()) || config.DEFAULT_MERCHANT_ID;
    this.setData({
      roomId,
      storeId,
      merchantId,
      bookingEnabled: false
    });
    this.loadRoomInfo(roomId, storeId, merchantId);
    
    // 设置默认日期为今天
    const today = new Date();
    const dateStr = today.getFullYear() + '-' + 
                   String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(today.getDate()).padStart(2, '0');
    this.setData({
      bookingDate: dateStr
    });
  },

  guardBookingPage() {
    if (this.data.bookingEnabled) return true;
    wx.showToast({ title: '该门店暂未开启预订', icon: 'none' });
    setTimeout(() => {
      if (this.data.storeId) {
        wx.redirectTo({
          url: `/pages/store-detail/store-detail?id=${this.data.storeId}&merchantId=${this.data.merchantId || ''}`
        });
      } else {
        wx.navigateBack();
      }
    }, 800);
    return false;
  },

  loadRoomInfo: function(roomId, storeId, merchantId) {
    if (!roomId || !merchantId) {
      this.setData({
        room: { id: roomId, storeId, name: '资源信息待同步', price: 0 }
      });
      return;
    }

    return this.loadBookingContext(roomId, storeId, merchantId).then(({ room, store, storeLoadFailed }) => {
      const data = room || {};
      const price = data.unitPrice || data.price || data.hourPrice || 0;
      const bookingEnabled = this.resolveCurrentBookingEnabled(store, data, storeLoadFailed);
      this.setData({
        bookingEnabled,
        store,
        room: {
          ...data,
          id: data.id || data.resourceId || roomId,
          storeId: data.storeId || storeId,
          name: data.resourceName || data.name || '资源信息待同步',
          price: Number(price) >= 100 ? Number(price) / 100 : Number(price || 0)
        }
      }, () => {
        if (!bookingEnabled) this.guardBookingPage();
      });
      this.calculatePrice();
    }).catch(() => {
      this.setData({
        bookingEnabled: false,
        room: { id: roomId, storeId, name: '资源信息待同步', price: 0 }
      });
      wx.showToast({ title: '资源信息加载失败', icon: 'none' });
    });
  },

  loadBookingContext(roomId, storeId, merchantId) {
    const roomPromise = roomApi.getRoomById(roomId, merchantId).then(res => (res && res.data) || res || {});
    const storePromise = storeId
      ? storeApi.getStoreWithBookingMode(storeId).then(res => (res && res.data) || res || {}).catch(err => {
          console.warn('加载门店预约设置失败:', err);
          return null;
        })
      : Promise.resolve(null);

    return Promise.all([roomPromise, storePromise]).then(([room, store]) => ({
      room,
      store: store || room.store || room.storeInfo || {},
      storeLoadFailed: !!storeId && !store
    }));
  },

  resolveCurrentBookingEnabled(store = {}, room = {}, storeLoadFailed = false) {
    if (storeLoadFailed) return false;
    return bookingModeUtil.resolveBookingEnabled(store);
  },

  refreshBookingEnabled() {
    const { roomId, storeId, merchantId } = this.data;
    if (!roomId || !merchantId) return Promise.resolve(false);
    return this.loadBookingContext(roomId, storeId, merchantId).then(({ room, store, storeLoadFailed }) => {
      const bookingEnabled = this.resolveCurrentBookingEnabled(store, room, storeLoadFailed);
      this.setData({ bookingEnabled, store });
      return bookingEnabled;
    }).catch(err => {
      console.error('刷新预约设置失败:', err);
      this.setData({ bookingEnabled: false });
      return false;
    });
  },

  onDateChange: function(e) {
    this.setData({
      bookingDate: e.detail.value
    });
  },

  onStartTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    });
    this.calculatePrice();
  },

  onEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    });
    this.calculatePrice();
  },

  onPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  onRemarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  calculatePrice: function() {
    const { startTime, endTime, room } = this.data;
    if (!startTime || !endTime) return;

    const startMinutes = this.parseTimeMinutes(startTime);
    let endMinutes = this.parseTimeMinutes(endTime);
    if (startMinutes < 0 || endMinutes < 0) return;
    if (endMinutes <= startMinutes) endMinutes += DAY_MINUTES;

    const duration = (endMinutes - startMinutes) / 60;
    const totalPrice = Math.ceil(duration * room.price);

    this.setData({
      duration: duration,
      totalPrice: totalPrice
    });
  },

  parseTimeMinutes(time) {
    const match = String(time || '').match(/^(\d{1,2}):(\d{2})/);
    if (!match) return -1;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return -1;
    return hour * 60 + minute;
  },

  getDateByOffset(dateStr, offsetDays = 0) {
    const base = new Date(String(dateStr || '').replace(/-/g, '/'));
    const date = Number.isNaN(base.getTime()) ? new Date() : base;
    date.setDate(date.getDate() + offsetDays);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  confirmBooking: function() {
    const { bookingDate, startTime, endTime, phone, room, totalPrice } = this.data;
    if (!this.guardBookingPage()) return;
    
    if (!bookingDate || !startTime || !endTime || !phone) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '提交中...' });
    this.refreshBookingEnabled().then(enabled => {
      if (!enabled) {
        wx.hideLoading();
        this.guardBookingPage();
        return;
      }

      this.submitBooking({ bookingDate, startTime, endTime, phone, room, totalPrice });
    });
  },

  submitBooking({ bookingDate, startTime, endTime, phone, room, totalPrice }) {
    const startMinutes = this.parseTimeMinutes(startTime);
    let endMinutes = this.parseTimeMinutes(endTime);
    const endDayOffset = endMinutes <= startMinutes ? 1 : 0;
    const startAt = `${bookingDate} ${startTime}:00`;
    const endAt = `${this.getDateByOffset(bookingDate, endDayOffset)} ${endTime}:00`;
    const payload = {
      merchantId: this.data.merchantId,
      resourceId: room.id || this.data.roomId,
      storeId: room.storeId || this.data.storeId,
      bookingStartTime: startAt,
      bookingEndTime: endAt,
      contactPhone: phone,
      remark: this.data.remark,
      amount: Math.round(Number(totalPrice || 0) * 100)
    };

    roomApi.createBooking(payload).then(res => {
      wx.hideLoading();
      const result = (res && res.data) || res || {};
      const orderId = result.id || result.orderId || result.bookingId || result.bookingNo || '';
      wx.setStorageSync('lastRoomBooking', {
        id: orderId || `room-booking-${Date.now()}`,
        orderId,
        merchantId: this.data.merchantId,
        storeId: room.storeId || this.data.storeId,
        resourceId: room.id || this.data.roomId,
        roomName: room.name || '资源信息待同步',
        bookingStartTime: startAt,
        bookingEndTime: endAt,
        contactPhone: phone,
        remark: this.data.remark,
        amount: Math.round(Number(totalPrice || 0) * 100),
        status: result.status !== undefined && result.status !== null && result.status !== '' ? result.status : (result.orderStatus !== undefined && result.orderStatus !== null && result.orderStatus !== '' ? result.orderStatus : 10),
        createdAt: Date.now()
      });
      if (this.data.merchantId && app.setActiveMerchantId) app.setActiveMerchantId(this.data.merchantId);
      wx.showToast({
        title: '预订成功',
        icon: 'success'
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: err.message || '预订失败',
        icon: 'none'
      });
    });
  }
});
