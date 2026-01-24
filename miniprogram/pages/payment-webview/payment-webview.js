Page({
  data: {
    paymentUrl: '',
    orderNo: ''
  },

  onLoad(options) {
    const { url, orderNo } = options;
    this.setData({
      paymentUrl: decodeURIComponent(url),
      orderNo: orderNo
    });
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: '支付宝支付'
    });
  },

  // 处理webview消息
  onWebViewMessage(e) {
    console.log('WebView消息:', e.detail.data);
    // 可以处理支付完成的消息
  },

  // 取消支付
  cancelPayment() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消支付吗？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    });
  },

  // 查看支付状态
  checkPaymentStatus() {
    const { orderNo } = this.data;
    const app = getApp();
    const baseUrl = app.globalData.baseUrl;
    
    wx.showLoading({
      title: '查询中...'
    });
    
    wx.request({
      url: `${baseUrl}/api/payment/order/${orderNo}`,
      method: 'GET',
      success: (res) => {
        wx.hideLoading();
        
        if (res.statusCode === 200 && res.data.success) {
          const order = res.data.order;
          
          if (order.status === 'PAID') {
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            });
            
            setTimeout(() => {
              wx.navigateBack({
                delta: 2 // 返回到充值页面的上一页
              });
            }, 1500);
            
          } else if (order.status === 'PENDING') {
            wx.showToast({
              title: '支付处理中',
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            });
          }
        } else {
          wx.showToast({
            title: '查询失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        });
      }
    });
  }
});