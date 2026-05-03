const app = getApp();
const { request } = require('../../utils/api.js');

Page({
  data: {
    orderId: '',
    order: {},
    room: {},
    unlockCode: '',
    unlockStatus: '',
    unlockMessage: ''
  },

  onLoad(options) {
    this.setData({ orderId: options.orderId });
    this.loadUnlockInfo(options.orderId);
  },

  loadUnlockInfo(orderId) {
    request(`/api/billing/order/${orderId}`).then(res => {
      const o = res.data || {};
      this.setData({
        order: o,
        room: {
          name: o.roomName || o.resourceName || o.storeName || (o.store && o.store.name) || ''
        },
        // 开门密码从订单数据里取，字段名根据后端实际返回调整
        unlockCode: o.unlockCode || o.lockPassword || o.doorPassword || ''
      });
    }).catch(() => {
      wx.showToast({ title: '加载订单失败', icon: 'none' });
    });
  },

  unlockByCode() {
    const code = this.data.unlockCode;
    if (!code) { wx.showToast({ title: '暂无开门密码', icon: 'none' }); return; }
    wx.setClipboardData({
      data: code,
      success: () => wx.showToast({ title: '密码已复制', icon: 'success' })
    });
  },

  unlockByBluetooth() {
    this.submitUnlockRequest('BLUETOOTH');
  },

  unlockByQR() {
    wx.scanCode({
      success: (res) => {
        this.submitUnlockRequest('QR', { qrCode: res.result || res.path || '' });
      },
      fail: () => wx.showToast({ title: '扫码失败', icon: 'error' })
    });
  },

  submitUnlockRequest(unlockType, extraData = {}) {
    const orderId = this.data.orderId;
    if (!orderId) {
      this.showUnlockError('缺少订单信息，请返回订单详情后重试');
      return;
    }

    wx.showLoading({ title: '开门中...' });
    request(`/api/billing/order/${orderId}/unlock`, {
      method: 'POST',
      data: {
        unlockType,
        ...extraData
      }
    }).then(() => {
      wx.hideLoading();
      this.setData({ unlockStatus: 'success', unlockMessage: '开门成功，请进入房间' });
      wx.vibrateShort();
      wx.showToast({ title: '开门成功', icon: 'success' });
    }).catch(err => {
      wx.hideLoading();
      const message = err && err.message
        ? err.message
        : '暂未接入真实开门接口，请使用密码开门或联系客服。';
      this.showUnlockError(message);
    });
  },

  showUnlockError(message) {
    this.setData({
      unlockStatus: 'error',
      unlockMessage: message
    });
    wx.showToast({ title: message, icon: 'none' });
  },

  contactService() {
    wx.showModal({
      title: '联系客服',
      variant: 'service',
      servicePhone: '15157903339',
      serviceTime: '7×24小时在线',
      serviceDesc: '开门异常、订单核验、设备问题都可以联系人工客服',
      showCancel: true,
      cancelText: '知道了',
      confirmText: '拨打电话',
      success: (res) => {
        if (res.confirm) wx.makePhoneCall({ phoneNumber: '15157903339' });
      }
    });
  }
});
