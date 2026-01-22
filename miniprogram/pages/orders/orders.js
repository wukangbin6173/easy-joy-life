Page({
  data: {
    activeTab: 'all',
    orders: [],
    allOrders: []
  },

  onLoad: function() {
    this.loadOrders();
  },

  onShow: function() {
    this.loadOrders();
  },

  loadOrders: function() {
    // 模拟订单数据
    const orders = [
      {
        id: '001',
        storeName: '易享生活棋牌室(万达店)',
        roomName: '豪华包间A',
        bookingDate: '2025-01-20',
        startTime: '14:00',
        endTime: '18:00',
        totalPrice: 200,
        status: 'pending',
        statusText: '待使用'
      },
      {
        id: '002',
        storeName: '易享生活棋牌室(中心店)',
        roomName: '标准包间B',
        bookingDate: '2025-01-19',
        startTime: '19:00',
        endTime: '23:00',
        totalPrice: 160,
        status: 'using',
        statusText: '使用中'
      },
      {
        id: '003',
        storeName: '易享生活棋牌室(万达店)',
        roomName: 'VIP包间',
        bookingDate: '2025-01-18',
        startTime: '10:00',
        endTime: '14:00',
        totalPrice: 300,
        status: 'completed',
        statusText: '已完成'
      }
    ];

    this.setData({
      allOrders: orders,
      orders: orders
    });
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
    this.filterOrders(tab);
  },

  filterOrders: function(tab) {
    let filteredOrders = this.data.allOrders;
    
    if (tab !== 'all') {
      filteredOrders = this.data.allOrders.filter(order => order.status === tab);
    }

    this.setData({
      orders: filteredOrders
    });
  },

  viewOrderDetail: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?orderId=${orderId}`
    });
  },

  cancelOrder: function(e) {
    e.stopPropagation();
    const orderId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
          this.loadOrders();
        }
      }
    });
  },

  unlockRoom: function(e) {
    e.stopPropagation();
    const orderId = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `/pages/unlock/unlock?orderId=${orderId}`
    });
  },

  rateOrder: function(e) {
    e.stopPropagation();
    const orderId = e.currentTarget.dataset.id;
    
    wx.showToast({
      title: '评价功能开发中',
      icon: 'none'
    });
  }
});