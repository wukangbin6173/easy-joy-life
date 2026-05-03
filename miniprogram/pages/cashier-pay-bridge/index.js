Page({
  data: {
    loading: true,
    errorMsg: '',
    errorTip: '',
    payAppId: '',
    targetPath: ''
  },

  onLoad(options) {
    this._openedPayMiniProgram = false;
    this._returnHandled = false;
    this.launchFromOptions(options || {});
  },

  onShow() {
    if (!this._openedPayMiniProgram || this._returnHandled || this.data.errorMsg) return;
    this._returnHandled = true;
    wx.navigateBack({ delta: 1 });
  },

  launchFromOptions(options) {
    const payAppId = this.safeDecode(options.payAppId || '');
    const payPath = this.normalizePayPath(this.safeDecode(options.payPath || ''));
    const payQuery = this.decodePayQuery(options.payQuery || '');

    if (!payAppId || !payPath) {
      this.showError('支付参数缺失', '请返回收银台重试，如多次失败请联系客服。');
      return;
    }

    const normalizedQuery = payQuery.replace(/^\?/, '');
    const targetPath = normalizedQuery ? `${payPath}?${normalizedQuery}` : payPath;
    this.setData({ loading: true, errorMsg: '', errorTip: '', payAppId, targetPath });

    wx.navigateToMiniProgram({
      appId: payAppId,
      path: targetPath,
      success: () => {
        this._openedPayMiniProgram = true;
      },
      fail: (err) => {
        const errMsg = (err && err.errMsg) || '';
        if (errMsg.includes('no permission') || errMsg.includes('no app permission')) {
          this.showError(
            '当前小程序无权跳转到支付小程序',
            '请确认已配置支付小程序白名单，并完成微信开放平台绑定。'
          );
          return;
        }
        this.showError('跳转支付小程序失败', errMsg || '请返回收银台重试。');
      }
    });
  },

  retryPay() {
    const { payAppId, targetPath } = this.data;
    if (!payAppId || !targetPath) {
      this.showError('支付参数缺失', '请返回收银台重试。');
      return;
    }
    this.setData({ loading: true, errorMsg: '', errorTip: '' });
    wx.navigateToMiniProgram({
      appId: payAppId,
      path: targetPath,
      success: () => {
        this._openedPayMiniProgram = true;
      },
      fail: (err) => {
        this.showError('跳转支付小程序失败', (err && err.errMsg) || '请返回收银台重试。');
      }
    });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  showError(errorMsg, errorTip) {
    this.setData({ loading: false, errorMsg, errorTip });
  },

  safeDecode(value) {
    if (!value) return '';
    const text = String(value);
    try {
      return decodeURIComponent(text);
    } catch (e) {
      return text;
    }
  },

  decodePayQuery(value) {
    const text = String(value || '').replace(/^\?/, '');
    if (!text) return '';
    if (text.indexOf('=') >= 0 || text.indexOf('&') >= 0) return text;
    return this.safeDecode(text).replace(/^\?/, '');
  },

  normalizePayPath(path) {
    return String(path || '').replace(/^\/+/, '');
  }
});
