const app = getApp();
const { request, smsApi } = require('../../utils/api.js');
const { openCashier } = require('../../utils/payment.js');
const config = require('../../utils/config.js');
const { ensureUserIdentity } = require('../../utils/user-session.js');

Page({
  data: {
    currentBalance: 0,
    userPoints: 0,
    amountOptions: [10, 20, 50, 100, 200, 500],
    selectedAmount: 0,
    customAmount: '',
    finalAmount: 0,
    merchantId: config.DEFAULT_MERCHANT_ID,
    selectedPayment: 'wechat',
    // 手机验证弹窗
    showPhoneModal: false,
    modalPhone: '',
    modalCode: '',
    modalCountdown: 0,
    modalLoading: false
  },

  onLoad(options = {}) {
    const merchantId = options.merchantId || (app.getActiveMerchantId ? app.getActiveMerchantId() : config.DEFAULT_MERCHANT_ID);
    if (merchantId && app.setActiveMerchantId) app.setActiveMerchantId(merchantId);
    this.setData({ merchantId });
    this.loadCurrentBalance();
  },

  onShow() {
    this.loadCurrentBalance();
  },

  loadCurrentBalance() {
    const userId = app.globalData.userId || wx.getStorageSync('userId');
    if (!userId) {
      ensureUserIdentity().then(() => this.loadCurrentBalance()).catch(err => {
        console.error('恢复用户身份失败:', err);
      });
      return;
    }

    const merchantId = this.getMerchantId();
    if (!merchantId) return;

    request('/api/member/recharge/info', {
      method: 'GET',
      data: {
        merchantId,
        externalUserId: userId
      }
    }).then(res => {
      if ((res.success || res.code == 200) && res.data) {
        this.setData({
          currentBalance: this.formatFen(res.data.balance),
          userPoints: res.data.rewardBalance || res.data.points || 0
        });
      }
    }).catch(err => {
      console.error('查询会员余额失败，尝试旧钱包余额:', err);
      this.loadLegacyWalletBalance(userId);
    });
  },

  loadLegacyWalletBalance(userId) {
    request(`/api/wallet/${userId}`).then(res => {
      if (res.success) {
        this.setData({
          currentBalance: this.formatMoney(res.wallet ? res.wallet.balance : 0),
          userPoints: res.points || 0
        });
      }
    }).catch(() => {});
  },

  getMerchantId() {
    return this.data.merchantId ||
      (app.getActiveMerchantId ? app.getActiveMerchantId() : '') ||
      app.globalData.currentMerchantId ||
      app.globalData.defaultMerchantId ||
      config.DEFAULT_MERCHANT_ID;
  },

  formatFen(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) return '0.00';
    return (amount / 100).toFixed(2);
  },

  formatMoney(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) return '0.00';
    return amount.toFixed(2);
  },

  selectAmount(e) {
    const amount = e.currentTarget.dataset.amount;
    this.setData({ selectedAmount: amount, customAmount: '', finalAmount: amount });
  },

  onCustomAmountInput(e) {
    const amount = parseFloat(e.detail.value) || 0;
    this.setData({ customAmount: e.detail.value, selectedAmount: 0, finalAmount: amount });
  },

  onCustomAmountBlur(e) {
    this.setData({ finalAmount: parseFloat(e.detail.value) || 0 });
  },

  selectPayment(e) {
    this.setData({ selectedPayment: e.currentTarget.dataset.id });
  },

  confirmRecharge() {
    const finalAmount = this.getRechargeAmount();
    this.setData({ finalAmount });
    if (finalAmount <= 0) { wx.showToast({ title: '请选择充值金额', icon: 'none' }); return; }
    if (finalAmount > 10000) { wx.showToast({ title: '单次充值不能超过10000元', icon: 'none' }); return; }

    // 检查是否已绑定手机号
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.phone) {
      // 直接弹出手机验证窗口
      this.setData({ showPhoneModal: true, modalPhone: '', modalCode: '' });
      return;
    }

    wx.showModal({
      title: '确认充值',
      content: `确定充值 ¥${finalAmount} 吗？`,
      success: (res) => { if (res.confirm) this.processRecharge(); }
    });
  },

  getRechargeAmount() {
    if (this.data.selectedAmount > 0) return Number(this.data.selectedAmount);
    return parseFloat(this.data.customAmount) || Number(this.data.finalAmount) || 0;
  },

  // ===== 手机验证弹窗 =====
  closePhoneModal() {
    this.setData({ showPhoneModal: false });
    if (this._timer) clearInterval(this._timer);
  },

  onModalPhoneInput(e) {
    this.setData({ modalPhone: e.detail.value });
  },

  onModalCodeInput(e) {
    this.setData({ modalCode: e.detail.value });
  },

  sendModalCode() {
    const phone = this.data.modalPhone.trim();
    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    smsApi.sendCode(phone, 'REGISTER').then(() => {
      wx.showToast({ title: '验证码已发送', icon: 'success' });
      this.startCountdown();
    }).catch(err => {
      wx.showToast({ title: err.message || '发送失败', icon: 'none' });
    });
  },

  startCountdown() {
    this.setData({ modalCountdown: 60 });
    this._timer = setInterval(() => {
      if (this.data.modalCountdown <= 1) {
        clearInterval(this._timer);
        this.setData({ modalCountdown: 0 });
      } else {
        this.setData({ modalCountdown: this.data.modalCountdown - 1 });
      }
    }, 1000);
  },

  onUnload() {
    if (this._timer) clearInterval(this._timer);
  },

  confirmPhone() {
    const { modalPhone, modalCode } = this.data;
    if (!/^1\d{10}$/.test(modalPhone.trim())) { wx.showToast({ title: '请输入正确的手机号', icon: 'none' }); return; }
    if (!modalCode.trim()) { wx.showToast({ title: '请输入验证码', icon: 'none' }); return; }
    this.setData({ modalLoading: true });
    const { smsApi } = require('../../utils/api.js');
    smsApi.verifyCode(modalPhone.trim(), modalCode.trim(), 'REGISTER').then(() => {
      // 保存手机号到后端
      return request('/api/auth/user/update', {
        method: 'POST',
        data: { openid: app.globalData.openid, phone: modalPhone.trim() }
      });
    }).then(() => {
      const userInfo = wx.getStorageSync('userInfo') || {};
      userInfo.phone = modalPhone.trim();
      wx.setStorageSync('userInfo', userInfo);
      app.globalData.userInfo = userInfo;
      this.setData({ showPhoneModal: false, modalLoading: false });
      wx.showToast({ title: '绑定成功', icon: 'success' });
      setTimeout(() => this.processRecharge(), 1000);
    }).catch(err => {
      this.setData({ modalLoading: false });
      wx.showToast({ title: err.message || '验证码错误', icon: 'none' });
    });
  },

  // ===== 充值流程 =====
  async processRecharge() {
    const finalAmount = this.getRechargeAmount();
    const openid = app.globalData.openid;

    if (!openid) {
      this.setData({ showPhoneModal: true });
      return;
    }

    wx.showLoading({ title: '处理中...' });
    try {
      const outTradeNo = 'R' + Date.now() + Math.floor(Math.random() * 1000);
      const amountFen = Math.round(finalAmount * 100);

      const res = await request('/api/sqd/payment/cashier/create', {
        method: 'POST',
        data: {
          merchantId: Number(this.data.merchantId) || config.DEFAULT_MERCHANT_ID,
          outTradeNo,
          subject: '雀玺棋牌室充值',
          totalAmount: amountFen,
          expireMinutes: 30,
          returnUrl: 'https://www.quexitai.com/pay/result'
        }
      });

      const cashierUrl = res.data && res.data.cashierUrl;
      const tradeNo = res.data && res.data.tradeNo;
      if (!cashierUrl) throw new Error('创建支付失败');

      wx.hideLoading();
      openCashier({
        cashierUrl,
        tradeNo: tradeNo || outTradeNo,
        rechargeId: tradeNo || outTradeNo,
        title: '充值'
      });
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err.message || '充值失败', icon: 'none' });
    }
  }
});
