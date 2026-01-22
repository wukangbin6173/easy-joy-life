Page({
  data: {
    orderId: '',
    room: {},
    unlockCode: '',
    unlockStatus: '',
    unlockMessage: ''
  },

  onLoad: function(options) {
    const orderId = options.orderId;
    this.setData({
      orderId: orderId
    });
    this.loadUnlockInfo(orderId);
  },

  loadUnlockInfo: function(orderId) {
    // 模拟获取开门信息
    const unlockInfo = {
      room: {
        name: '豪华包间A',
        lockId: 'LOCK001'
      },
      unlockCode: '123456'
    };

    this.setData({
      room: unlockInfo.room,
      unlockCode: unlockInfo.unlockCode
    });
  },

  unlockByCode: function() {
    wx.setClipboardData({
      data: this.data.unlockCode,
      success: () => {
        wx.showToast({
          title: '密码已复制',
          icon: 'success'
        });
      }
    });
  },

  unlockByBluetooth: function() {
    wx.showLoading({
      title: '连接中...'
    });

    // 模拟蓝牙开门
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟成功/失败
      const success = Math.random() > 0.3;
      
      if (success) {
        this.setData({
          unlockStatus: 'success',
          unlockMessage: '开门成功！请进入房间'
        });
        
        wx.vibrateShort();
        wx.showToast({
          title: '开门成功',
          icon: 'success'
        });
      } else {
        this.setData({
          unlockStatus: 'error',
          unlockMessage: '开门失败，请重试或联系客服'
        });
        
        wx.showToast({
          title: '开门失败',
          icon: 'error'
        });
      }
    }, 2000);
  },

  unlockByQR: function() {
    wx.scanCode({
      success: (res) => {
        wx.showLoading({
          title: '验证中...'
        });
        
        // 模拟扫码开门
        setTimeout(() => {
          wx.hideLoading();
          
          this.setData({
            unlockStatus: 'success',
            unlockMessage: '扫码开门成功！'
          });
          
          wx.vibrateShort();
          wx.showToast({
            title: '开门成功',
            icon: 'success'
          });
        }, 1500);
      },
      fail: () => {
        wx.showToast({
          title: '扫码失败',
          icon: 'error'
        });
      }
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