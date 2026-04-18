Page({
  data: {
    order: {}
  },

  onLoad: function(options) {
    const orderId = options.orderId;
    this.loadOrderDetail(orderId);
  },

  loadOrderDetail: function(orderId) {
    // 模拟订单详情数据
    const order = {
      id: orderId,
      orderNo: 'QS' + Date.now(),
      storeName: '雀玺棋牌室(万达店)',
      roomName: '豪华包间A',
      bookingDate: '2025-01-20',
      startTime: '14:00',
      endTime: '18:00',
      phone: '138****8888',
      remark: '需要提供茶水',
      roomPrice: 200,
      discount: 0,
      totalPrice: 200,
      status: 'using',
      statusText: '使用中',
      statusDesc: '房间已开启，请按时使用',
      unlockCode: '123456'
    };

    this.setData({
      order: order
    });
  },

  cancelOrder: function() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？取消后费用将原路退回。',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '处理中...'
          });
          
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '订单已取消',
              icon: 'success'
            });
            
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          }, 1000);
        }
      }
    });
  },

  unlockRoom: function() {
    wx.navigateTo({
      url: `/pages/unlock/unlock?orderId=${this.data.order.id}`
    });
  },

  rateOrder: function() {
    wx.showToast({
      title: '评价功能开发中',
      icon: 'none'
    });
  },

  contactService: function() {
    wx.showModal({
      title: '联系客服',
      content: '客服电话：400-123-4567\n工作时间：9:00-22:00',
      showCancel: false,
      confirmText: '知道了'
    });
  }
});