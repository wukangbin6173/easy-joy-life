Page({
  data: {
    wallet: {
      balance: 0,
      frozen: 0,
      totalRecharge: 0
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
    wx.navigateTo({
      url: '/pages/bank-card/bank-card'
    });
  },

  // 支付密码
  goToPayPassword() {
    wx.navigateTo({
      url: '/pages/pay-password/pay-password'
    });
  }
});