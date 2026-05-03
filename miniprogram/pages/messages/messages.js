Page({
  data: {
    activeType: 'all',
    tabs: [
      { type: 'all', name: '全部' },
      { type: 'order', name: '订单' },
      { type: 'system', name: '系统' },
      { type: 'coupon', name: '优惠' }
    ],
    allMessages: [],
    messages: []
  },

  onLoad() {
    this.loadMessages();
  },

  loadMessages() {
    const cached = wx.getStorageSync('messages');
    const messages = cached && cached.length ? cached : this.getDefaultMessages();
    this.setData({ allMessages: messages });
    this.applyFilter();
  },

  getDefaultMessages() {
    return [
      {
        id: 'order-1',
        type: 'order',
        title: '预约成功',
        content: '您的预约订单已提交，请在有效时间内完成支付。',
        timeText: '刚刚',
        icon: '/images/订单提醒.png',
        read: false
      },
      {
        id: 'system-1',
        type: 'system',
        title: '自助开门提醒',
        content: '到店后可在订单详情中使用自助开门功能。',
        timeText: '今天',
        icon: '/images/开门提醒.png',
        read: true
      },
      {
        id: 'coupon-1',
        type: 'coupon',
        title: '优惠券到账',
        content: '您有新的优惠券可使用，预订前可查看优惠。',
        timeText: '昨天',
        icon: '/images/优惠券.png',
        read: true
      }
    ];
  },

  switchType(e) {
    this.setData({ activeType: e.currentTarget.dataset.type });
    this.applyFilter();
  },

  applyFilter() {
    const { activeType, allMessages } = this.data;
    const messages = activeType === 'all'
      ? allMessages
      : allMessages.filter(item => item.type === activeType);
    this.setData({ messages });
  },

  openDetail(e) {
    wx.navigateTo({ url: `/pages/message-detail/message-detail?id=${e.currentTarget.dataset.id}` });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/profile/profile' });
  }
});
