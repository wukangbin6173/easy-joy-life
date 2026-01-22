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

    // 模拟交易记录数据
    const mockRecords = [
      {
        id: 1,
        type: 'expense',
        title: '房间消费',
        desc: '梅花厅 - 4小时',
        amount: '320.00',
        time: '2025-01-19 14:30:25',
        status: 'success',
        statusText: '已完成',
        date: '2025-01-19'
      },
      {
        id: 2,
        type: 'income',
        title: '钱包充值',
        desc: '微信支付',
        amount: '500.00',
        time: '2025-01-19 10:15:30',
        status: 'success',
        statusText: '已到账',
        date: '2025-01-19'
      },
      {
        id: 3,
        type: 'expense',
        title: '房间消费',
        desc: 'VIP包间A - 2小时',
        amount: '240.00',
        time: '2025-01-18 20:45:15',
        status: 'success',
        statusText: '已完成',
        date: '2025-01-18'
      },
      {
        id: 4,
        type: 'income',
        title: '订单退款',
        desc: '取消预订退款',
        amount: '160.00',
        time: '2025-01-18 16:20:10',
        status: 'success',
        statusText: '已到账',
        date: '2025-01-18'
      },
      {
        id: 5,
        type: 'expense',
        title: '房间消费',
        desc: '兰花厅 - 3小时',
        amount: '240.00',
        time: '2025-01-17 19:30:45',
        status: 'success',
        statusText: '已完成',
        date: '2025-01-17'
      },
      {
        id: 6,
        type: 'income',
        title: '钱包充值',
        desc: '支付宝支付',
        amount: '200.00',
        time: '2025-01-17 15:20:30',
        status: 'success',
        statusText: '已到账',
        date: '2025-01-17'
      },
      {
        id: 7,
        type: 'expense',
        title: '房间消费',
        desc: '竹叶厅 - 2小时',
        amount: '200.00',
        time: '2025-01-16 21:15:20',
        status: 'success',
        statusText: '已完成',
        date: '2025-01-16'
      },
      {
        id: 8,
        type: 'expense',
        title: '房间消费',
        desc: '菊花厅 - 4小时',
        amount: '240.00',
        time: '2025-01-15 18:30:15',
        status: 'success',
        statusText: '已完成',
        date: '2025-01-15'
      }
    ];

    setTimeout(() => {
      this.setData({
        allRecords: mockRecords,
        loading: false,
        hasMore: false
      });
      this.filterRecords();
    }, 500);
  },

  // 加载统计信息
  loadStatistics() {
    const statistics = {
      monthIncome: '700.00',
      monthExpense: '1240.00'
    };

    this.setData({
      statistics: statistics
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