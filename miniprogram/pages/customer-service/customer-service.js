Page({
  data: {
    servicePhone: '15157903339',
    wechatId: 'quexi_service'
  },

  callPhone() {
    wx.makePhoneCall({ phoneNumber: this.data.servicePhone });
  },

  copyWechat() {
    wx.setClipboardData({
      data: this.data.wechatId,
      success: () => wx.showToast({ title: '已复制微信号', icon: 'success' })
    });
  },

  goHelp() {
    wx.navigateTo({ url: '/pages/help-center/help-center' });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/profile/profile' });
  }
});
