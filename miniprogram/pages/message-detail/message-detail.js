Page({
  data: { message: {} },

  onLoad(options = {}) {
    const list = wx.getStorageSync('messages') || this.getDefaultMessages();
    const message = list.find(item => item.id === options.id) || list[0] || {};
    this.setData({ message });
  },

  getDefaultMessages() {
    return [
      { id: 'order-1', type: 'order', title: '预约成功', content: '您的预约订单已提交，请在有效时间内完成支付。', timeText: '刚刚', icon: '/images/订单提醒.png' },
      { id: 'system-1', type: 'system', title: '自助开门提醒', content: '到店后可在订单详情中使用自助开门功能。', timeText: '今天', icon: '/images/开门提醒.png' }
    ];
  },

  goAction() {
    if (this.data.message.type === 'order') wx.switchTab({ url: '/pages/orders/orders' });
    else wx.navigateBack();
  },

  goBack() {
    wx.navigateBack();
  }
});
