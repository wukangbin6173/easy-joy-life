const app = getApp();
const { paymentApi } = require('../../utils/api.js');

Page({
  data: {
    activeTab: 'ongoing',
    orders: [],
    allOrders: []
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  loadOrders() {
    // 暂时使用模拟数据，后续对接商起点订单接口
    const orders = [];
    this.setData({ allOrders: orders, orders: orders });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.filterOrders(tab);
  },

  filterOrders(tab) {
    let filtered = this.data.allOrders;
    if (tab === 'ongoing') {
      filtered = this.data.allOrders.filter(o => o.status === 'pending' || o.status === 'using');
    } else if (tab === 'completed') {
      filtered = this.data.allOrders.filter(o => o.status === 'completed');
    }
    this.setData({ orders: filtered });
  },

  viewOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/order-detail/order-detail?orderId=${orderId}` });
  },

  cancelOrder(e) {
    e.stopPropagation();
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '订单已取消', icon: 'success' });
          this.loadOrders();
        }
      }
    });
  },

  unlockRoom(e) {
    e.stopPropagation();
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/unlock/unlock?orderId=${orderId}` });
  },

  rateOrder(e) {
    e.stopPropagation();
    wx.showToast({ title: '评价功能开发中', icon: 'none' });
  }
});
