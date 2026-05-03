const DETAILS = {
  booking: {
    title: '如何预约服务？',
    paragraphs: ['1. 在首页或附近门店页选择门店。', '2. 进入门店详情后选择资源、开始时间和时长。', '3. 核对预约信息后完成支付，系统会锁定资源。']
  },
  unlock: {
    title: '如何自助开门？',
    paragraphs: ['订单到达可使用时间后，进入订单详情页。', '点击“自助开门”，根据页面提示完成开门。', '如设备异常，请立即联系客服处理。']
  },
  pay: {
    title: '支付与退款说明',
    paragraphs: ['待支付订单需在倒计时内完成支付，超时将自动取消。', '如订单符合退款条件，可联系客服或在订单详情中处理。', '退款到账时间以支付渠道实际处理为准。']
  },
  contact: {
    title: '联系人工客服',
    paragraphs: ['客服工作时间为 7×24 小时在线。', '请提供门店、订单号和问题截图，便于快速定位。']
  }
};

Page({
  data: { detail: DETAILS.booking },

  onLoad(options = {}) {
    this.setData({ detail: DETAILS[options.id] || DETAILS.booking });
  },

  contactService() {
    wx.navigateTo({ url: '/pages/customer-service/customer-service' });
  },

  goBack() {
    wx.navigateBack();
  }
});
