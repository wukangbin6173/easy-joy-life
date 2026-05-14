const { request, iotApi } = require('../../utils/api.js');
const config = require('../../utils/config.js');
const app = getApp();

Page({
  data: {
    orderId: '',
    order: {},
    room: { name: '加载中…' },
    unlockCode: '',
    unlockStatus: '',
    unlockMessage: '',
    iotLoading: false
  },

  onLoad(options) {
    this._unlockSubmitting = false;
    this._orderLoaded = false;
    const orderId = options.orderId || '';
    const autoStart = options.autoStart === '1';
    this.setData({ orderId });
    if (!orderId) {
      wx.showToast({ title: '缺少订单参数', icon: 'none' });
      this.setData({ room: { name: '—' } });
      return;
    }
    this.loadUnlockInfo(orderId).then(() => {
      if (autoStart && this._orderLoaded) {
        this.executeIotAction('START_USAGE');
      }
    });
  },

  loadUnlockInfo(orderId) {
    return request(`/api/billing/order/${orderId}`).then(res => {
      const o = res.data || {};
      this._orderLoaded = true;
      this.setData({
        order: o,
        room: {
          name: o.roomName || o.resourceName || o.storeName || (o.store && o.store.name) || '当前订单'
        },
        unlockCode: o.unlockCode || o.lockPassword || o.doorPassword || '',
        unlockStatus: '',
        unlockMessage: ''
      });
    }).catch((err) => {
      this._orderLoaded = false;
      const raw = (err && (err.message || err.errMsg)) || '';
      const msg = raw.indexOf('request:fail') === 0 ? '网络异常，请检查网络后重试' : (raw || '加载订单失败');
      wx.showToast({ title: msg.length > 22 ? `${msg.slice(0, 22)}…` : msg, icon: 'none' });
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

  // 远程开门（云端下发指令）
  unlockRemote() {
    if (this.data.iotLoading) return;
    this.executeIotAction('START_USAGE');
  },

  unlockByQR() {
    if (this.data.iotLoading) return;
    wx.scanCode({
      scanType: ['qrCode', 'barCode'],
      success: () => {
        this.executeIotAction('START_USAGE');
      },
      fail: (err) => {
        const msg = (err && err.errMsg) || '';
        if (msg.indexOf('cancel') !== -1 || msg.indexOf('取消') !== -1) return;
        wx.showToast({ title: '扫码失败，请重试', icon: 'none' });
      }
    });
  },

  /**
   * 通过 IoT 接口执行设备动作
   * @param {string} actionType - START_USAGE 或 END_USAGE
   */
  executeIotAction(actionType) {
    const order = this.data.order;
    const orderId = this.data.orderId;
    if (!orderId) {
      this.showUnlockError('缺少订单信息，请返回订单详情后重试');
      return;
    }
    if (this._unlockSubmitting) return;
    this._unlockSubmitting = true;

    const merchantId = order.merchantId || (app.getActiveMerchantId && app.getActiveMerchantId()) || config.DEFAULT_MERCHANT_ID;
    const resourceId = order.resourceId || order.roomId;

    if (!resourceId) {
      this._unlockSubmitting = false;
      this.showUnlockError('缺少资源信息，请返回重试');
      return;
    }

    const actionText = actionType === 'END_USAGE' ? '退房' : '开门';
    this.setData({ iotLoading: true, unlockStatus: '', unlockMessage: '' });

    iotApi.executeAndPoll({
      merchantId: Number(merchantId),
      resourceId: Number(resourceId),
      orderId: orderId,
      actionType: actionType
    }, {
      maxRetries: 5,
      interval: 2000
    }).then(result => {
      const tip = result.message || (actionType === 'END_USAGE' ? '退房成功' : '开门成功，请进入房间');
      this.setData({ unlockStatus: 'success', unlockMessage: tip, iotLoading: false });
      wx.vibrateShort();
      wx.showToast({ title: actionType === 'END_USAGE' ? '退房成功' : '开门成功', icon: 'success' });
    }).catch(err => {
      this.setData({ iotLoading: false });
      const raw = (err && err.message) || '';
      const message = raw.indexOf('request:fail') === 0
        ? '网络异常，请检查网络后重试'
        : (raw || `${actionText}失败，请稍后重试或联系客服`);
      this.showUnlockError(message);
    }).then(() => {
      this._unlockSubmitting = false;
    });
  },

  showUnlockError(message) {
    this.setData({
      unlockStatus: 'error',
      unlockMessage: message
    });
    wx.showModal({
      title: '操作失败',
      content: message,
      confirmText: '重试',
      cancelText: '联系客服',
      success: (res) => {
        if (res.confirm) {
          this.executeIotAction('START_USAGE');
        } else {
          this.contactService();
        }
      }
    });
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
