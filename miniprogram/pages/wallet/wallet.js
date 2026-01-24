Page({
  data: {
    wallet: {
      balance: 0,
      frozen: 0,
      totalRecharge: 0,
      autoRecharge: false
    },
    transactions: []
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
    const baseUrl = app.globalData.baseUrl;
    const userId = 1; // 临时用户ID，实际应该从登录状态获取
    
    wx.request({
      url: `${baseUrl}/api/payment/wallet/${userId}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          const wallet = res.data.wallet;
          this.setData({
            wallet: {
              balance: wallet.balance || 0.00,
              frozen: wallet.frozenAmount || 0.00,
              totalRecharge: wallet.totalRecharge || 0.00,
              autoRecharge: false
            }
          });
        } else {
          // 使用模拟数据作为后备
          const walletInfo = {
            balance: 168.50,
            frozen: 0.00,
            totalRecharge: 500.00,
            autoRecharge: true
          };
          this.setData({
            wallet: walletInfo
          });
        }
      },
      fail: (error) => {
        console.error('加载钱包数据失败:', error);
        // 使用模拟数据作为后备
        const walletInfo = {
          balance: 168.50,
          frozen: 0.00,
          totalRecharge: 500.00,
          autoRecharge: true
        };
        this.setData({
          wallet: walletInfo
        });
      }
    });
  },

  // 加载交易记录
  loadTransactions() {
    // 模拟交易记录
    const transactions = [
      {
        id: 1,
        type: 'expense',
        title: '房间消费 - 梅花厅',
        time: '2025-01-19 14:30',
        amount: '80.00'
      },
      {
        id: 2,
        type: 'income',
        title: '钱包充值',
        time: '2025-01-19 10:15',
        amount: '200.00'
      },
      {
        id: 3,
        type: 'expense',
        title: '房间消费 - VIP包间A',
        time: '2025-01-18 20:45',
        amount: '120.00'
      },
      {
        id: 4,
        type: 'income',
        title: '退款',
        time: '2025-01-18 16:20',
        amount: '60.00'
      },
      {
        id: 5,
        type: 'expense',
        title: '房间消费 - 兰花厅',
        time: '2025-01-17 19:30',
        amount: '80.00'
      }
    ];

    this.setData({
      transactions: transactions.slice(0, 5) // 只显示最近5条
    });
  },

  // 充值
  goToRecharge() {
    wx.navigateTo({
      url: '/pages/recharge/recharge'
    });
  },

  // 提现
  goToWithdraw() {
    if (this.data.wallet.balance <= 0) {
      wx.showToast({
        title: '余额不足，无法提现',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/withdraw/withdraw'
    });
  },

  // 转账
  goToTransfer() {
    wx.showToast({
      title: '转账功能开发中',
      icon: 'none'
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
    wx.showToast({
      title: '银行卡管理功能开发中',
      icon: 'none'
    });
  },

  // 支付密码
  goToPayPassword() {
    wx.showToast({
      title: '支付密码功能开发中',
      icon: 'none'
    });
  },

  // 自动充值设置
  goToAutoRecharge() {
    wx.showToast({
      title: '自动充值设置开发中',
      icon: 'none'
    });
  },

  // 切换自动充值
  toggleAutoRecharge(e) {
    const autoRecharge = e.detail.value;
    this.setData({
      'wallet.autoRecharge': autoRecharge
    });

    wx.showToast({
      title: autoRecharge ? '已开启自动充值' : '已关闭自动充值',
      icon: 'success'
    });
  }
});