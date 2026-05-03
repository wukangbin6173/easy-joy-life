Page({
  data: {
    helps: [
      { id: 'booking', title: '如何预约服务？', desc: '选择门店、资源、时间后确认支付即可', icon: '/images/预约下单.png' },
      { id: 'unlock', title: '如何自助开门？', desc: '订单开始后在订单详情页点击自助开门', icon: '/images/自助开门.png' },
      { id: 'pay', title: '支付与退款说明', desc: '支付超时自动取消，退款按原路退回', icon: '/images/费用.png' },
      { id: 'contact', title: '联系人工客服', desc: '遇到问题可随时联系在线客服', icon: '/images/联系客服.png' }
    ]
  },

  openDetail(e) {
    wx.navigateTo({ url: `/pages/help-detail/help-detail?id=${e.currentTarget.dataset.id}` });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/profile/profile' });
  }
});
