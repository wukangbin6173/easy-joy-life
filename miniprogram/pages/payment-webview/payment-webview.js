const { request } = require('../../utils/api.js');
const { readCashierPayload, removeCashierPayload } = require('../../utils/payment.js');

const CASHIER_HOST_KEY = '__host';
const CASHIER_HOST_VALUE = 'wxMp';

function safeDecode(value) {
  if (!value) return '';
  const text = String(value);
  try {
    return decodeURIComponent(text);
  } catch (e) {
    return text;
  }
}

function decodeCashierUrlParam(value) {
  const text = String(value || '');
  const url = /^https?:\/\//.test(text) ? text : safeDecode(text);
  return normalizeCashierUrl(url);
}

function normalizeCashierUrl(url) {
  return String(url || '').replace(/^http:\/\/pay\.test-client\.xuancore\.com/i, 'https://pay.test-client.xuancore.com');
}

function pickFirstValue(source, fields) {
  for (const field of fields) {
    const value = source && source[field];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

function appendCashierHost(url) {
  if (!url) return '';

  const hashIndex = url.indexOf('#');
  let base = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';
  const hostReg = new RegExp(`([?&])${CASHIER_HOST_KEY}=[^&#]*`);
  const hostQuery = `${CASHIER_HOST_KEY}=${encodeURIComponent(CASHIER_HOST_VALUE)}`;

  if (hostReg.test(base)) {
    base = base.replace(hostReg, `$1${hostQuery}`);
  } else {
    base = `${base}${base.indexOf('?') >= 0 ? '&' : '?'}${hostQuery}`;
  }

  return `${base}${hash}`;
}

function getUrlDomain(url) {
  const match = String(url || '').match(/^https?:\/\/([^/?#]+)/i);
  return match ? match[1] : '';
}

function maskCashierUrl(url) {
  const text = String(url || '');
  return text.replace(/(token=)[^&#]+/i, '$1***');
}

function getCashierUrlError(url) {
  if (!url) {
    return {
      title: '收银台链接为空',
      text: '下单接口没有返回 cashierUrl，请检查商起点计费订单或收银台创建接口返回。'
    };
  }

  if (!/^https:\/\//i.test(url)) {
    return {
      title: '收银台链接无效',
      text: '小程序 web-view 只能加载 HTTPS 收银台地址，请检查商起点返回的 cashierUrl。'
    };
  }

  return null;
}

function normalizePayStatus(status) {
  if (status === 2) return 'success';
  if (status === 0 || status === 1) return 'pending';
  if (status === 3 || status === -1) return 'fail';

  const text = String(status || '').toUpperCase();
  if (['SUCCESS', 'PAID', 'PAY_SUCCESS', 'TRADE_SUCCESS', 'FINISHED'].includes(text)) return 'success';
  if (['CLOSED', 'CLOSE', 'CANCEL', 'CANCELED', 'CANCELLED'].includes(text)) return 'closed';
  if (['PENDING', 'PROCESSING', 'WAIT_PAY', 'WAITING', 'NOTPAY'].includes(text)) return 'pending';
  if (['FAIL', 'FAILED', 'ERROR', 'PAY_FAIL'].includes(text)) return 'fail';
  return '';
}

function normalizeBillingOrderStatus(status) {
  const value = Number(status);
  if ([10, 20, 30, 40].includes(value)) return 'success';
  if (value === 0) return 'pending';
  if ([50, 55, 60].includes(value)) return 'closed';
  const text = String(status || '').toUpperCase();
  if (['PAID', 'WAIT_USE', 'WAITING_USE', 'RESERVED', 'USING', 'IN_USE', 'COMPLETED'].includes(text)) return 'success';
  return normalizePayStatus(status);
}

function getCashierMessage(messages) {
  const list = Array.isArray(messages) ? messages : [messages];
  return list.filter(item => {
    if (!item) return false;
    return item.type === 'cashier-pay-result' || item.action === 'onCashierPayResult';
  }).pop();
}

Page({
  data: {
    cashierUrl: '',
    rawCashierUrl: '',
    cashierKey: '',
    tradeNo: '',
    orderId: '',
    rechargeId: '',
    merchantId: '',
    resourceId: '',
    startTime: '',
    durationMinutes: '',
    amount: '',
    title: '收银台',
    isPayCompleted: false,
    checking: false,
    cashierDomain: '',
    cashierDebugUrl: '',
    webviewLoaded: false,
    errorTitle: '',
    errorText: ''
  },

  onLoad(options) {
    const { cashierUrl, cashierKey, tradeNo, orderId, rechargeId, merchantId, resourceId, startTime, durationMinutes, amount, title } = options || {};
    const decodedCashierKey = safeDecode(cashierKey || '');
    const cachedPayload = readCashierPayload(decodedCashierKey) || {};
    const decodedCashierUrl = decodeCashierUrlParam(cachedPayload.cashierUrl || cashierUrl || '');
    const cashierUrlError = getCashierUrlError(decodedCashierUrl);
    const pageTitle = safeDecode(title || cachedPayload.title || '') || '收银台';

    this._hasShownOnce = false;
    this._autoCheckTimer = null;
    this._finishTimer = null;
    this._loadTimer = null;
    this._silentCheckAttempts = 0;

    this.setData({
      cashierUrl: cashierUrlError ? '' : appendCashierHost(decodedCashierUrl),
      rawCashierUrl: decodedCashierUrl,
      cashierDomain: getUrlDomain(decodedCashierUrl),
      cashierDebugUrl: maskCashierUrl(decodedCashierUrl),
      cashierKey: decodedCashierKey,
      tradeNo: safeDecode(tradeNo || cachedPayload.tradeNo || ''),
      orderId: safeDecode(orderId || cachedPayload.orderId || ''),
      rechargeId: safeDecode(rechargeId || cachedPayload.rechargeId || ''),
      merchantId: safeDecode(merchantId || cachedPayload.merchantId || ''),
      resourceId: safeDecode(resourceId || cachedPayload.resourceId || ''),
      startTime: safeDecode(startTime || cachedPayload.startTime || ''),
      durationMinutes: safeDecode(durationMinutes || cachedPayload.durationMinutes || ''),
      amount: safeDecode(amount || cachedPayload.amount || ''),
      title: pageTitle,
      errorTitle: cashierUrlError ? cashierUrlError.title : '',
      errorText: cashierUrlError ? cashierUrlError.text : ''
    });
    wx.setNavigationBarTitle({ title: this.data.title });

    if (!cashierUrlError) this.startCashierLoadTimer();
  },

  onShow() {
    if (!this._hasShownOnce) {
      this._hasShownOnce = true;
      return;
    }

    if (this.data.isPayCompleted) return;

    clearTimeout(this._autoCheckTimer);
    this._silentCheckAttempts = 0;
    this._autoCheckTimer = setTimeout(() => {
      this.checkPayResult({ silent: true });
    }, 800);
  },

  onUnload() {
    clearTimeout(this._autoCheckTimer);
    clearTimeout(this._finishTimer);
    clearTimeout(this._loadTimer);
    removeCashierPayload(this.data.cashierKey);
  },

  onCashierMessage(e) {
    const messages = e && e.detail ? e.detail.data : [];
    const last = getCashierMessage(messages);
    if (!last) return;

    const status = normalizePayStatus(pickFirstValue(last, ['status', 'payStatus', 'tradeStatus']));
    if (status === 'success') {
      if (this.data.orderId && !this.data.rechargeId) {
        this.checkPayResult({ silent: false });
      } else {
        this._onPaySuccess();
      }
    } else if (status === 'closed') {
      this._onPayClosed();
    } else if (status === 'fail') {
      this._onPayFail();
    }
  },

  onWebViewMessage(e) {
    this.onCashierMessage(e);
  },

  onWebViewLoad() {
    clearTimeout(this._loadTimer);
    this.setData({ webviewLoaded: true });
  },

  onWebViewError(e) {
    const detail = e && e.detail ? e.detail : {};
    this.showCashierError(
      '收银台加载失败',
      detail.errMsg || '请确认收银台域名已加入小程序业务域名白名单，且 cashierUrl 为 HTTPS 可访问地址。'
    );
  },

  _onPaySuccess() {
    if (this.data.isPayCompleted) return;

    this.setData({ isPayCompleted: true });
    if (this.data.orderId) {
      wx.setStorageSync('bookingPaymentChanged', Date.now());
      wx.setStorageSync('lastPaidBillingOrderId', this.data.orderId);
      wx.removeStorageSync('pendingBillingBooking');
      wx.setStorageSync('lastPaidBooking', {
        orderId: this.data.orderId,
        tradeNo: this.data.tradeNo,
        paymentTradeNo: this.data.tradeNo,
        merchantId: this.data.merchantId,
        resourceId: this.data.resourceId,
        startTime: this.data.startTime,
        durationMinutes: this.data.durationMinutes,
        amount: this.data.amount,
        paidAt: Date.now()
      });
    }
    wx.showToast({ title: '支付成功', icon: 'success' });

    clearTimeout(this._finishTimer);
    this._finishTimer = setTimeout(() => {
      if (this.data.orderId && !this.data.rechargeId) {
        // 支付成功后跳转到订单详情页，用户可以直接开门
        wx.redirectTo({
          url: `/pages/order-detail/order-detail?orderId=${this.data.orderId}&fromPayment=1`
        });
        return;
      }

      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack({ delta: 1 });
      } else {
        wx.switchTab({ url: '/pages/orders/orders' });
      }
    }, 800);
  },

  _onPayClosed(isBillingOrder) {
    wx.showToast({ title: isBillingOrder ? '订单未生效' : '支付已取消', icon: 'none' });
  },

  _onPayFail() {
    wx.showToast({ title: '支付失败，请重试', icon: 'none' });
  },

  checkPayResult(options = {}) {
    if (this.data.checking) return;

    const silent = options && options.silent === true;
    const { rechargeId, tradeNo, orderId } = this.data;
    const queryId = tradeNo || rechargeId || orderId;

    if (!queryId) {
      if (!silent) wx.navigateBack();
      return;
    }

    this.setData({ checking: true });
    if (!silent) wx.showLoading({ title: '查询中...' });

    this.queryPayStatus({ tradeNo, rechargeId, orderId }).then(result => {
      if (!silent) wx.hideLoading();
      this.setData({ checking: false });

      const payload = result.payload;
      const rawStatus = pickFirstValue(payload, ['status', 'orderStatus', 'payStatus', 'tradeStatus', 'paymentStatus']);
      const status = result.source === 'billing'
        ? normalizeBillingOrderStatus(rawStatus)
        : normalizePayStatus(rawStatus);

      if (status === 'success') {
        this._onPaySuccess();
      } else if (status === 'closed') {
        if (!silent) this._onPayClosed(result.source === 'billing');
      } else if (status === 'pending') {
        if (silent) this.schedulePayResultRetry();
        if (!silent) wx.showToast({ title: '支付处理中，请稍候', icon: 'none' });
      } else if (!silent) {
        wx.showToast({ title: '支付处理中，请稍候', icon: 'none' });
      } else {
        this.schedulePayResultRetry();
      }
    }).catch(() => {
      if (!silent) wx.hideLoading();
      this.setData({ checking: false });
      if (!silent) wx.showToast({ title: '查询失败，请重试', icon: 'none' });
      if (silent) this.schedulePayResultRetry();
    });
  },

  schedulePayResultRetry() {
    if (this.data.isPayCompleted) return;
    if (this._silentCheckAttempts >= 8) return;
    this._silentCheckAttempts += 1;
    clearTimeout(this._autoCheckTimer);
    this._autoCheckTimer = setTimeout(() => {
      this.checkPayResult({ silent: true });
    }, 1500);
  },

  queryPayStatus(ids = {}) {
    const paymentQueryId = ids.tradeNo || ids.rechargeId;
    const billingOrderId = ids.orderId;
    const queryBillingOrder = () => {
      if (!/^\d+$/.test(String(billingOrderId || ''))) throw new Error('缺少计费订单号');

      return request(`/api/billing/order/${billingOrderId}`).then(res => ({
        source: 'billing',
        payload: (res && res.data) || res || {}
      }));
    };

    if (billingOrderId && !ids.rechargeId) return queryBillingOrder();
    if (!paymentQueryId) return queryBillingOrder();

    return request('/api/sqd/payment/query', {
      method: 'GET',
      data: { tradeNo: paymentQueryId }
    }).then(res => ({
      source: 'payment',
      payload: (res && res.data) || res || {}
    })).catch(queryBillingOrder);
  },

  reloadCashier() {
    const cashierUrlError = getCashierUrlError(this.data.rawCashierUrl);
    if (cashierUrlError) {
      this.showCashierError(cashierUrlError.title, cashierUrlError.text);
      return;
    }

    this.setData({
      cashierUrl: appendCashierHost(this.data.rawCashierUrl),
      webviewLoaded: false,
      errorTitle: '',
      errorText: ''
    });
    this.startCashierLoadTimer();
  },

  startCashierLoadTimer() {
    clearTimeout(this._loadTimer);
    this._loadTimer = setTimeout(() => {
      if (this.data.webviewLoaded || this.data.errorTitle || !this.data.cashierUrl) return;

      const domain = this.data.cashierDomain || '未知域名';
      this.showCashierError(
        '收银台没有响应',
        `当前仍在加载商起点收银台 H5，尚未进入支付小程序。收银台域名：${domain}，请确认该测试收银台域名已部署并加入小程序业务域名。`
      );
    }, 6000);
  },

  showCashierError(errorTitle, errorText) {
    clearTimeout(this._loadTimer);
    this.setData({
      cashierUrl: '',
      errorTitle,
      errorText
    });
    wx.showToast({ title: errorTitle, icon: 'none' });
  },

  copyCashierUrl() {
    if (!this.data.rawCashierUrl) return;
    wx.setClipboardData({
      data: this.data.rawCashierUrl,
      success: () => wx.showToast({ title: '链接已复制', icon: 'success' })
    });
  },

  cancelPayment() {
    wx.showModal({
      title: '退出收银台',
      content: '退出后订单仍可在订单列表中继续支付。',
      cancelText: '继续支付',
      confirmText: '退出',
      confirmColor: '#08A85C',
      success: (res) => {
        if (res.confirm) wx.navigateBack();
      }
    });
  }
});
