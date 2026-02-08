Page({
  data: {
    hasPassword: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    focusOld: false,
    focusNew: false,
    focusConfirm: false,
    submitting: false
  },

  onLoad() {
    this.checkHasPassword();
  },

  // 检查是否已设置密码
  checkHasPassword() {
    const app = getApp();
    const userId = app.globalData.userId;

    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: `${app.globalData.apiBaseUrl}/api/user/has-pay-password/${userId}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          this.setData({
            hasPassword: res.data.hasPassword,
            focusOld: res.data.hasPassword,
            focusNew: !res.data.hasPassword
          });
        }
      },
      fail: (err) => {
        console.error('检查支付密码失败:', err);
      }
    });
  },

  onOldPasswordInput(e) {
    this.setData({ oldPassword: e.detail.value });
  },

  onNewPasswordInput(e) {
    this.setData({ newPassword: e.detail.value });
  },

  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  // 忘记密码
  forgotPassword() {
    wx.showModal({
      title: '忘记密码',
      content: '请联系客服重置支付密码',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 提交密码
  submitPassword() {
    const { hasPassword, oldPassword, newPassword, confirmPassword } = this.data;

    // 验证
    if (hasPassword && !oldPassword) {
      wx.showToast({
        title: '请输入原密码',
        icon: 'none'
      });
      return;
    }

    if (!newPassword) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      });
      return;
    }

    if (newPassword.length !== 6) {
      wx.showToast({
        title: '密码必须为6位数字',
        icon: 'none'
      });
      return;
    }

    // 检查简单密码
    if (this.isSimplePassword(newPassword)) {
      wx.showModal({
        title: '密码过于简单',
        content: '为了您的账户安全，请设置更复杂的密码',
        showCancel: false
      });
      return;
    }

    if (!confirmPassword) {
      wx.showToast({
        title: '请确认新密码',
        icon: 'none'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return;
    }

    this.setData({ submitting: true });

    const app = getApp();
    const userId = app.globalData.userId;

    wx.request({
      url: `${app.globalData.apiBaseUrl}/api/user/pay-password`,
      method: 'POST',
      data: {
        userId: userId,
        oldPassword: hasPassword ? oldPassword : null,
        newPassword: newPassword
      },
      success: (res) => {
        this.setData({ submitting: false });
        
        if (res.statusCode === 200 && res.data.success) {
          wx.showToast({
            title: hasPassword ? '修改成功' : '设置成功',
            icon: 'success'
          });
          
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.message || '操作失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        this.setData({ submitting: false });
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 检查是否为简单密码
  isSimplePassword(password) {
    const simplePasswords = [
      '123456', '654321', '111111', '222222', '333333',
      '444444', '555555', '666666', '777777', '888888', '999999', '000000'
    ];
    
    if (simplePasswords.includes(password)) {
      return true;
    }
    
    // 检查连续数字
    let isSequential = true;
    for (let i = 0; i < password.length - 1; i++) {
      if (parseInt(password[i]) + 1 !== parseInt(password[i + 1])) {
        isSequential = false;
        break;
      }
    }
    
    return isSequential;
  }
});
