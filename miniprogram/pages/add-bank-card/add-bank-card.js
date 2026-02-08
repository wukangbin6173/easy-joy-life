Page({
  data: {
    holderName: '',
    cardNo: '',
    phone: '',
    code: '',
    bankName: '',
    isDefault: false,
    codeSending: false,
    countdown: 0,
    submitting: false
  },

  onHolderNameInput(e) {
    this.setData({ holderName: e.detail.value });
  },

  onCardNoInput(e) {
    const cardNo = e.detail.value.replace(/\s/g, '');
    this.setData({ cardNo });
    
    // 识别银行
    if (cardNo.length >= 6) {
      this.identifyBank(cardNo);
    } else {
      this.setData({ bankName: '' });
    }
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onCodeInput(e) {
    this.setData({ code: e.detail.value });
  },

  toggleDefault() {
    this.setData({ isDefault: !this.data.isDefault });
  },

  // 识别银行
  identifyBank(cardNo) {
    const app = getApp();
    
    wx.request({
      url: `${app.globalData.apiBaseUrl}/api/user/bank-cards/identify`,
      method: 'POST',
      data: { cardNo: cardNo.substring(0, 6) },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          this.setData({ bankName: res.data.bankName });
        }
      },
      fail: (err) => {
        console.error('识别银行失败:', err);
      }
    });
  },

  // 发送验证码
  sendCode() {
    const { phone, cardNo } = this.data;

    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return;
    }

    if (!cardNo) {
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none'
      });
      return;
    }

    this.setData({ codeSending: true });

    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/api/sms/send-code`,
      method: 'POST',
      data: {
        phone: phone,
        type: 'BIND_CARD'
      },
      success: (res) => {
        this.setData({ codeSending: false });
        
        if (res.statusCode === 200 && res.data.success) {
          // 开发模式：显示验证码
          if (res.data.devMode && res.data.code) {
            wx.showModal({
              title: '开发模式',
              content: `验证码: ${res.data.code}\n(生产环境将通过短信发送)`,
              showCancel: false,
              confirmText: '知道了'
            });
          } else {
            wx.showToast({
              title: '验证码已发送',
              icon: 'success'
            });
          }
          
          // 开始倒计时
          this.startCountdown();
        } else {
          wx.showToast({
            title: res.data.message || '发送失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        this.setData({ codeSending: false });
        wx.showToast({
          title: '发送失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 倒计时
  startCountdown() {
    let countdown = 60;
    this.setData({ countdown });

    const timer = setInterval(() => {
      countdown--;
      this.setData({ countdown });

      if (countdown <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  },

  // 提交银行卡
  submitCard() {
    const { holderName, cardNo, phone, code, isDefault } = this.data;

    // 验证
    if (!holderName) {
      wx.showToast({
        title: '请输入持卡人姓名',
        icon: 'none'
      });
      return;
    }

    if (!cardNo) {
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none'
      });
      return;
    }

    if (cardNo.length < 16 || cardNo.length > 19) {
      wx.showToast({
        title: '银行卡号格式不正确',
        icon: 'none'
      });
      return;
    }

    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return;
    }

    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }

    this.setData({ submitting: true });

    const app = getApp();
    const userId = app.globalData.userId;

    wx.request({
      url: `${app.globalData.apiBaseUrl}/api/user/bank-cards`,
      method: 'POST',
      data: {
        userId: userId,
        holderName: holderName,
        cardNo: cardNo,
        phone: phone,
        code: code,
        isDefault: isDefault
      },
      success: (res) => {
        this.setData({ submitting: false });
        
        if (res.statusCode === 200 && res.data.success) {
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });
          
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.message || '添加失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        this.setData({ submitting: false });
        wx.showToast({
          title: '添加失败，请重试',
          icon: 'none'
        });
      }
    });
  }
});
