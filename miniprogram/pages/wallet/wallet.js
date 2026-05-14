Page({
  data: {
    wallet: { balance: 0, frozen: 0, totalRecharge: 0 },
    transactions: [],
    showPhoneModal: false,
    modalPhone: '',
    modalCode: '',
    modalCountdown: 0,
    modalLoading: false
  },

  onLoad() {
    this.loadWalletInfo();
    this.loadTransactions();
  },

  onShow() {
    this.loadWalletInfo();
  },

  // 加载钱包信息
  loadWalletInfo() {
    const app = getApp();
    const userId = app.globalData.userId;
    
    if (!userId) {
      console.log('用户未登录，无法加载钱包信息');
      return;
    }
    
    const { request } = require('../../utils/api.js');
    request(`/api/wallet/${userId}`).then(res => {
      if (res.success) {
        const wallet = res.wallet || {};
        this.setData({
          wallet: {
            balance: wallet.balance || 0,
            frozen: wallet.frozenAmount || 0,
            totalRecharge: wallet.totalRecharge || 0
          }
        });
      }
    }).catch(err => {
      console.error('加载钱包数据失败:', err);
      this.setData({
        wallet: { balance: 0, frozen: 0, totalRecharge: 0 }
      });
    });
  },

  // 加载交易记录
  loadTransactions() {
    const app = getApp();
    const userId = app.globalData.userId;

    if (!userId) {
      console.log('用户未登录，无法加载交易记录');
      this.setData({ transactions: [] });
      return;
    }

    // 使用统一的API模块
    const api = require('../../utils/api.js');
    
    api.walletApi.getTransactions(userId)
      .then(data => {
        console.log('交易记录响应:', data);
        
        if (data.success && data.transactions) {
          const transactions = data.transactions.map(tx => {
            // 判断交易类型
            const isIncome = tx.transactionType === 'RECHARGE' || tx.transactionType === 'REFUND' || tx.transactionType === 'UNFREEZE';
            const type = isIncome ? 'income' : 'expense';
            
            // 格式化标题
            let title = '';
            switch(tx.transactionType) {
              case 'RECHARGE':
                title = '钱包充值';
                break;
              case 'CONSUME':
                title = tx.description || '房间消费';
                break;
              case 'REFUND':
                title = '订单退款';
                break;
              case 'FREEZE':
                title = '金额冻结';
                break;
              case 'UNFREEZE':
                title = '解冻金额';
                break;
              default:
                title = tx.description || tx.transactionType;
            }
            
            // 处理时间格式
            const createdTime = tx.createdTime || '';
            let time = createdTime;
            if (createdTime.includes('T')) {
              const parts = createdTime.split('T');
              const timePart = parts[1].split('.')[0];
              time = `${parts[0]} ${timePart.substring(0, 5)}`; // 只保留到分钟
            } else if (createdTime.includes(' ')) {
              time = createdTime.substring(0, 16); // 只保留到分钟
            }
            
            return {
              id: tx.id,
              type: type,
              title: title,
              time: time,
              amount: Math.abs(tx.amount).toFixed(2)
            };
          });
          
          // 只显示最近5条
          this.setData({
            transactions: transactions.slice(0, 5)
          });
        } else {
          console.error('获取交易记录失败:', data);
          this.setData({ transactions: [] });
        }
      })
      .catch(err => {
        console.error('请求交易记录失败:', err);
        
        let errorMsg = '加载交易记录失败';
        if (err.message && err.message.includes('404')) {
          errorMsg = 'API接口不存在';
        } else if (err.message && err.message.includes('timeout')) {
          errorMsg = '请求超时';
        }
        
        console.error(errorMsg, err);
        this.setData({ transactions: [] });
      });
  },

  // 充值
  goToRecharge() {
    const app = getApp();
    const openid = app.globalData.openid;
    const userInfo = app.globalData.userInfo;
    const phone = userInfo && userInfo.phone;
    const merchantId = app.getActiveMerchantId ? app.getActiveMerchantId() : '';

    if (openid && phone) {
      // 已登录且有手机号，直接跳充值页
      wx.navigateTo({ url: `/pages/recharge/recharge?merchantId=${merchantId || ''}` });
    } else {
      // 没有登录或没有手机号，弹验证窗口
      this.setData({ showPhoneModal: true, modalPhone: '', modalCode: '', modalCountdown: 0 });
    }
  },

  // 提现
  goToWithdraw() {
    wx.showModal({
      title: '提现暂未开放',
      content: '当前钱包余额主要用于门店消费和充值优惠。如需处理资金问题，请联系客服：15157903339',
      confirmText: '联系客服',
      cancelText: '查看明细',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({ url: '/pages/customer-service/customer-service' });
        } else {
          this.goToRecords();
        }
      }
    });
  },

  // 转账
  goToTransfer() {
    wx.showModal({
      title: '转账说明',
      content: '当前钱包余额仅支持门店消费、充值和提现。如需处理资金问题，请联系客服。',
      confirmText: '联系客服',
      cancelText: '查看明细',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({ url: '/pages/customer-service/customer-service' });
        } else {
          this.goToRecords();
        }
      }
    });
  },

  // 交易明细
  goToRecords() {
    wx.navigateTo({
      url: '/pages/transaction-records/transaction-records'
    });
  },

  // 银行卡管理
  goToBankCard() {
    wx.navigateTo({
      url: '/pages/bank-card/bank-card'
    });
  },

  // 支付密码
  goToPayPassword() {
    wx.navigateTo({ url: '/pages/pay-password/pay-password' });
  },

  // ===== 手机验证弹窗 =====
  closePhoneModal() {
    this.setData({ showPhoneModal: false });
    if (this._timer) clearInterval(this._timer);
  },

  onModalPhoneInput(e) { this.setData({ modalPhone: e.detail.value }); },
  onModalCodeInput(e) { this.setData({ modalCode: e.detail.value }); },

  sendModalCode() {
    const phone = this.data.modalPhone.trim();
    if (!/^1\d{10}$/.test(phone)) { wx.showToast({ title: '请输入正确的手机号', icon: 'none' }); return; }
    const { smsApi } = require('../../utils/api.js');
    smsApi.sendCode(phone, 'LOGIN').then(() => {
      wx.showToast({ title: '验证码已发送', icon: 'success' });
      this.setData({ modalCountdown: 60 });
      this._timer = setInterval(() => {
        if (this.data.modalCountdown <= 1) { clearInterval(this._timer); this.setData({ modalCountdown: 0 }); }
        else this.setData({ modalCountdown: this.data.modalCountdown - 1 });
      }, 1000);
    }).catch(err => wx.showToast({ title: err.message || '发送失败', icon: 'none' }));
  },

  confirmPhone() {
    const { modalPhone, modalCode } = this.data;
    if (!/^1\d{10}$/.test(modalPhone.trim())) { wx.showToast({ title: '请输入正确的手机号', icon: 'none' }); return; }
    if (!modalCode.trim()) { wx.showToast({ title: '请输入验证码', icon: 'none' }); return; }
    this.setData({ modalLoading: true });
    const { request } = require('../../utils/api.js');
    const app = getApp();
    request('/api/auth/phone/bind', {
      method: 'POST',
      data: { userId: app.globalData.userId, phone: modalPhone.trim(), code: modalCode.trim() }
    }).then(res => {
      const user = res.user || {};
      const userInfo = { ...(app.globalData.userInfo || {}), ...user, phone: modalPhone.trim(), isLogin: true };
      app.globalData.userInfo = userInfo;
      if (user.id) { app.globalData.userId = user.id; wx.setStorageSync('userId', user.id); }
      wx.setStorageSync('userInfo', userInfo);
      this.setData({ showPhoneModal: false, modalLoading: false });
      wx.showToast({ title: '绑定成功', icon: 'success' });
      const merchantId = app.getActiveMerchantId ? app.getActiveMerchantId() : '';
      setTimeout(() => wx.navigateTo({ url: `/pages/recharge/recharge?merchantId=${merchantId || ''}` }), 1000);
    }).catch(err => {
      this.setData({ modalLoading: false });
      wx.showToast({ title: err.message || '验证失败', icon: 'none' });
    });
  }
});
