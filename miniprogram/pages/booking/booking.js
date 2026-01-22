Page({
  data: {
    room: {},
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
    this.loadRoomInfo(roomId, storeId);
    
    // 设置默认日期为今天
    const today = new Date();
    const dateStr = today.getFullYear() + '-' + 
                   String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(today.getDate()).padStart(2, '0');
    this.setData({
      bookingDate: dateStr
    });
  },

  loadRoomInfo: function(roomId, storeId) {
    // 模拟数据
    const room = {
      id: roomId,
      storeId: storeId,
      name: '豪华包间A',
      price: 50
    };
    
    this.setData({
      room: room
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

    // 模拟提交预订
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '预订成功',
        icon: 'success'
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  }
});