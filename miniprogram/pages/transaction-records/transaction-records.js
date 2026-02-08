Page({
  data: {
    activeFilter: 'all',
    filterOptions: [
      { key: 'all', name: '全部' },
      { key: 'income', name: '收入' },
      { key: 'expense', name: '支出' }
    ],
    allRecords: [],
    groupedRecords: [],
    hasMore: true,
    loading: false,
    page: 1,
    statistics: null
  },

  onLoad() {
    this.loadRecords();
    this.loadStatistics();
  },

  // 加载交易记录
  loadRecords() {
    this.setData({ loading: true });

    const app = getApp();
    const userId = app.globalData.userId;

    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      this.setData({ loading: false });
      return;
    }

    // 使用统一的API模块
    const api = require('../../utils/api.js');
    
    api.walletApi.getTransactions(userId)
      .then(data => {
        console.log('交易记录响应:', data);
        
        if (data.success && data.transactions) {
          const records = data.transactions.map(tx => {
            // 判断交易类型
            const isIncome = tx.transactionType === 'RECHARGE' || tx.transactionType === 'REFUND';
            const type = isIncome ? 'income' : 'expense';
            
            // 格式化标题
            let title = '';
            let desc = tx.description || '';
            
            switch(tx.transactionType) {
              case 'RECHARGE':
                title = '钱包充值';
                break;
              case 'CONSUME':
                title = '房间消费';
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
                title = tx.transactionType;
            }
            
            // 提取日期和时间
            const createdTime = tx.createdTime || '';
            let time = createdTime;
            let date = '';
            
            // 处理时间格式 (2026-02-07T22:08:24 或 2026-02-07 22:08:24)
            if (createdTime.includes('T')) {
              const parts = createdTime.split('T');
              date = parts[0];
              time = `${parts[0]} ${parts[1].split('.')[0]}`; // 移除毫秒部分
            } else if (createdTime.includes(' ')) {
              date = createdTime.split(' ')[0];
              time = createdTime;
            } else {
              date = createdTime;
              time = createdTime;
            }
            
            return {
              id: tx.id,
              type: type,
              title: title,
              desc: desc,
              amount: Math.abs(tx.amount).toFixed(2),
              time: time,
              status: tx.status === 'SUCCESS' ? 'success' : 'failed',
              statusText: tx.status === 'SUCCESS' ? '已完成' : '失败',
              date: date
            };
          });
          
          this.setData({
            allRecords: records,
            loading: false,
            hasMore: false
          });
          this.filterRecords();
          this.calculateStatistics(records);
        } else {
          console.error('获取交易记录失败:', data);
          this.setData({
            allRecords: [],
            loading: false,
            hasMore: false
          });
          this.filterRecords();
        }
      })
      .catch(err => {
        console.error('请求交易记录失败:', err);
        
        let errorMsg = '加载失败，请重试';
        if (err.message && err.message.includes('404')) {
          errorMsg = 'API接口不存在';
        } else if (err.message && err.message.includes('timeout')) {
          errorMsg = '请求超时，请检查网络';
        }
        
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 3000
        });
        
        this.setData({
          allRecords: [],
          loading: false,
          hasMore: false
        });
        this.filterRecords();
      });
  },

  // 加载统计信息
  loadStatistics() {
    // 统计信息将从交易记录中计算
  },

  // 计算统计信息
  calculateStatistics(records) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let monthIncome = 0;
    let monthExpense = 0;
    
    records.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
        const amount = parseFloat(record.amount);
        if (record.type === 'income') {
          monthIncome += amount;
        } else {
          monthExpense += amount;
        }
      }
    });
    
    this.setData({
      statistics: {
        monthIncome: monthIncome.toFixed(2),
        monthExpense: monthExpense.toFixed(2)
      }
    });
  },

  // 切换筛选
  switchFilter(e) {
    const filterKey = e.currentTarget.dataset.key;
    this.setData({
      activeFilter: filterKey
    });
    this.filterRecords();
  },

  // 筛选记录
  filterRecords() {
    const { allRecords, activeFilter } = this.data;
    
    let filteredRecords = allRecords;
    if (activeFilter !== 'all') {
      filteredRecords = allRecords.filter(record => record.type === activeFilter);
    }

    // 按日期分组
    const grouped = this.groupRecordsByDate(filteredRecords);
    
    this.setData({
      groupedRecords: grouped
    });
  },

  // 按日期分组记录
  groupRecordsByDate(records) {
    const groups = {};
    
    records.forEach(record => {
      const date = record.date;
      if (!groups[date]) {
        groups[date] = {
          date: this.formatDate(date),
          records: [],
          totalIncome: 0,
          totalExpense: 0
        };
      }
      
      groups[date].records.push(record);
      
      if (record.type === 'income') {
        groups[date].totalIncome += parseFloat(record.amount);
      } else {
        groups[date].totalExpense += parseFloat(record.amount);
      }
    });

    // 转换为数组并添加汇总信息
    const groupedArray = Object.keys(groups).map(date => {
      const group = groups[date];
      let summary = '';
      
      if (group.totalIncome > 0 && group.totalExpense > 0) {
        summary = `收入¥${group.totalIncome.toFixed(2)} 支出¥${group.totalExpense.toFixed(2)}`;
      } else if (group.totalIncome > 0) {
        summary = `收入¥${group.totalIncome.toFixed(2)}`;
      } else if (group.totalExpense > 0) {
        summary = `支出¥${group.totalExpense.toFixed(2)}`;
      }
      
      return {
        ...group,
        summary: summary
      };
    });

    // 按日期倒序排列
    return groupedArray.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // 格式化日期
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return '今天';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return '昨天';
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
    }
  },

  // 加载更多
  loadMore() {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({ loading: true });
    
    // 模拟加载更多数据
    setTimeout(() => {
      this.setData({
        loading: false,
        hasMore: false
      });
      
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      });
    }, 1000);
  }
});