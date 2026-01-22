// pages/store-detail/store-detail.js
const { storeApi, roomApi } = require('../../utils/api.js');

Page({
  data: {
    storeId: null,
    store: {},
    rooms: []
  },

  onLoad(options) {
    this.setData({
      storeId: options.id
    });
    this.loadStoreDetail();
    this.loadRooms();
  },

  loadStoreDetail() {
    // 使用API获取门店详情
    storeApi.getStoreById(this.data.storeId).then(response => {
      let store = response.data;
      
      // 处理图片路径
      if (store.images && typeof store.images === 'string') {
        store.images = [store.images];
      } else if (!store.images) {
        store.images = ['/images/default-store.jpg'];
      }
      
      // 处理设施信息
      if (store.facilities && typeof store.facilities === 'string') {
        store.facilities = store.facilities.split(',');
      }
      
      this.setData({
        store: store
      });
    }).catch(error => {
      console.error('加载门店详情失败:', error);
      wx.showToast({
        title: '加载门店详情失败',
        icon: 'none'
      });
    });
  },

  loadRooms() {
    // 使用API获取房间列表
    roomApi.getRoomsByStoreId(this.data.storeId).then(response => {
      let rooms = response.data || [];
      
      // 处理房间数据
      rooms = rooms.map(room => {
        // 处理图片路径
        if (room.images && typeof room.images === 'string') {
          room.images = [room.images];
        } else if (!room.images) {
          room.images = ['/images/room-default.jpg'];
        }
        
        // 处理设施信息
        if (room.facilities && typeof room.facilities === 'string') {
          room.facilities = room.facilities;
        }
        
        return room;
      });
      
      this.setData({
        rooms: rooms
      });
    }).catch(error => {
      console.error('加载房间列表失败:', error);
      wx.showToast({
        title: '加载房间列表失败',
        icon: 'none'
      });
    });
  },

  selectRoom(e) {
    const room = e.currentTarget.dataset.room;
    if (room.status !== 1) {
      wx.showToast({
        title: '房间不可用',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/room-detail/room-detail?storeId=${this.data.storeId}&roomId=${room.id}`
    });
  }
});