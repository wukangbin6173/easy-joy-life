const CASHIER_CACHE_PREFIX = 'cashier_payload_';

function buildCashierKey() {
  return `${CASHIER_CACHE_PREFIX}${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function appendQuery(params) {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
}

function openCashier(options = {}) {
  const cashierUrl = options.cashierUrl || '';
  if (!cashierUrl) {
    wx.showToast({ title: '收银台链接为空', icon: 'none' });
    return false;
  }

  const cashierKey = buildCashierKey();
  wx.setStorageSync(cashierKey, {
    cashierUrl,
    tradeNo: options.tradeNo || '',
    orderId: options.orderId || '',
    rechargeId: options.rechargeId || '',
    merchantId: options.merchantId || '',
    resourceId: options.resourceId || '',
    startTime: options.startTime || '',
    durationMinutes: options.durationMinutes || '',
    amount: options.amount || '',
    title: options.title || '收银台',
    createdAt: Date.now()
  });

  wx.navigateTo({
    url: `/pages/payment-webview/payment-webview?${appendQuery({
      cashierKey,
      tradeNo: options.tradeNo || '',
      orderId: options.orderId || '',
      rechargeId: options.rechargeId || '',
      durationMinutes: options.durationMinutes || '',
      amount: options.amount || '',
      title: options.title || '收银台'
    })}`
  });

  return true;
}

function readCashierPayload(cashierKey) {
  if (!cashierKey) return null;
  try {
    return wx.getStorageSync(cashierKey) || null;
  } catch (e) {
    return null;
  }
}

function removeCashierPayload(cashierKey) {
  if (!cashierKey) return;
  try {
    wx.removeStorageSync(cashierKey);
  } catch (e) {}
}

module.exports = {
  openCashier,
  readCashierPayload,
  removeCashierPayload
};
