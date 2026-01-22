Page({
  data: {
    currentBalance: 168.50,
    amountOptions: [50, 100, 200, 300, 500, 1000],
    selectedAmount: 0,
    customAmount: '',
    finalAmount: 0,
    paymentMethods: [
      {
        id: 'wechat',
        name: '微信支付',
        desc: '推荐使用',
        icon: '/images/wechat-pay-icon.png'
      },
      {
        id: 'alipay',
        name: '支付宝',
        desc: '安全便捷',
        icon: '/images/alipay-icon.png'
      }
    ],
    selectedPayment: 'wechat',
    promotion: null
  },

  onLoad() {
    this.loadCurrentBalance();
    this.checkPromotion();
  },

  // 加载当前余额
  loadCurrentBalance() {
    // 从全局数据或接口获取当前余额
    const app = getApp();
    // 这里可以从app.globalData或发起请求获取
    this.setData({
      currentBalance: 168.50
    });
  },

  // 检查优惠活动
  checkPromotion() {
    // 模拟优惠活动
    const promotions = [
      '首次充值满100元送20元',
      '充值满500元享9.5折优惠',
      null // 无优惠
    ];
    
    const randomPromotion = promotions[Math.floor(Math.random() * promotions.length)];
    this.setData({
      promotion: randomPromotion
    });
  },

  // 选择预设金额
  selectAmount(e) {
    const amount = e.currentTarget.dataset.amount;
    this.setData({
      selectedAmount: amount,
      customAmount: '',
      finalAmount: amount
    });
  },

  // 自定义金额输入
  onCustomAmountInput(e) {
    const value = e.detail.value;
    this.setData({
      customAmount: value,
      selectedAmount: 0
    });
  },

  // 自定义金额输入完成
  onCustomAmountBlur(e) {
    const value = parseFloat(e.detail.value) || 0;
    this.setData({
      finalAmount: value
    });
  },

  // 选择支付方式
  selectPayment(e) {
    const paymentId = e.currentTarget.dataset.id;
    this.setData({
      selectedPayment: paymentId
    });
  },

  // 确认充值
  confirmRecharge() {
    const { finalAmount, selectedPayment } = this.data;
    
    if (finalAmount <= 0) {
      wx.showToast({
        title: '请输入充值金额',
        icon: 'none'
      });
      return;
    }

    if (finalAmount < 1) {
      wx.showToast({
        title: '充值金额不能少于1元',
        icon: 'none'
      });
      return;
    }

    if (finalAmount > 10000) {
      wx.showToast({
        title: '单次充值不能超过10000元',
        icon: 'none'
      });
      return;
    }

    // 显示确认对话框
    wx.showModal({
      title: '确认充值',
      content: `确定要充值 ¥${finalAmount} 吗？`,
      success: (res) => {
        if (res.confirm) {
          this.processRecharge();
        }
      }
    });
  },

  // 处理充值
  processRecharge() {
    const { finalAmount, selectedPayment } = this.data;
    
    wx.showLoading({
      title: '正在充值...'
    });

    // 模拟充值过程
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟充值成功
      const success = Math.random() > 0.1; // 90%成功率
      
      if (success) {
        wx.showToast({
          title: '充值成功',
          icon: 'success'
        });
        
        // 更新余额
        const newBalance = this.data.currentBalance + finalAmount;
        this.setData({
          currentBalance: newBalance
        });
        
        // 延迟返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
        
      } else {
        wx.showModal({
          title: '充值失败',
          content: '网络异常，请稍后重试',
          showCancel: false,
          confirmText: '知道了'
        });
      }
    }, 2000);
  }
});