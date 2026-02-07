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
          // API返回失败，显示错误
          console.error('获取钱包数据失败:', res.data);
          wx.showToast({
            title: '获取钱包数据失败',
            icon: 'none'
          });
          this.setData({
            wallet: {
              balance: 0.00,
              frozen: 0.00,
              totalRecharge: 0.00,
              autoRecharge: false
            }
          });
        }
      },
      fail: (error) => {
        console.error('加载钱包数据失败:', error);
        // 显示错误提示
        wx.showToast({
          title: '加载钱包数据失败',
          icon: 'none'
        });
        // 使用默认值
        this.setData({
          wallet: {
            balance: 0.00,
            frozen: 0.00,
            totalRecharge: 0.00,
            autoRecharge: false
          }
        });
      }
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

    // 从后端获取真实交易记录
    wx.request({
      url: `${app.globalData.apiBaseUrl}/payment/transactions/${userId}`,
      method: 'GET',
      success: (res) => {
        console.log('交易记录响应:', res.data);
        
        if (res.data.success && res.data.transactions) {
          const transactions = res.data.transactions.map(tx => {
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
          console.error('获取交易记录失败:', res.data);
          this.setData({ transactions: [] });
        }
      },
      fail: (err) => {
        console.error('请求交易记录失败:', err);
        this.setData({ transactions: [] });
      }
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