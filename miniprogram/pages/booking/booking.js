const app = getApp();
const { roomApi } = require('../../utils/api.js');
const config = require('../../utils/config.js');

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
    totalPrice: 0
  },

  onLoad: function(options) {
    const roomId = options.roomId;
    const storeId = options.storeId;
    const merchantId = options.merchantId || (app.getActiveMerchantId && app.getActiveMerchantId()) || config.DEFAULT_MERCHANT_ID;
    this.setData({ roomId, storeId, merchantId });
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

  loadRoomInfo: function(roomId, storeId, merchantId) {
    if (!roomId || !merchantId) {
      this.setData({
        room: { id: roomId, storeId, name: '资源信息待同步', price: 0 }
      });
      return;
    }

    roomApi.getRoomById(roomId, merchantId).then(res => {
      const data = res.data || {};
      const price = data.unitPrice || data.price || data.hourPrice || 0;
      this.setData({
        room: {
          ...data,
          id: data.id || data.resourceId || roomId,
          storeId: data.storeId || storeId,
          name: data.resourceName || data.name || '资源信息待同步',
          price: Number(price) >= 100 ? Number(price) / 100 : Number(price || 0)
        }
      });
      this.calculatePrice();
    }).catch(() => {
      this.setData({
        room: { id: roomId, storeId, name: '资源信息待同步', price: 0 }
      });
      wx.showToast({ title: '资源信息加载失败', icon: 'none' });
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

    const start = new Date('2000-01-01 ' + startTime);
    const end = new Date('2000-01-01 ' + endTime);
    
    if (end <= start) {
      wx.showToast({
        title: '结束时间必须大于开始时间',
        icon: 'none'
      });
      return;
    }

    const duration = (end - start) / (1000 * 60 * 60);
    const totalPrice = Math.ceil(duration * room.price);

    this.setData({
      duration: duration,
      totalPrice: totalPrice
    });
  },

  confirmBooking: function() {
    const { bookingDate, startTime, endTime, phone, room, totalPrice } = this.data;
    
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

    wx.showLoading({
      title: '提交中...'
    });

    const startAt = `${bookingDate} ${startTime}:00`;
    const endAt = `${bookingDate} ${endTime}:00`;
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

    roomApi.createBooking(payload).then(() => {
      wx.hideLoading();
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
