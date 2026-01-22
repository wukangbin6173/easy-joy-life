Page({
  data: {
    room: {},
    storeId: null,
    roomId: null
  },

  onLoad: function(options) {
    const roomId = options.roomId;
    const storeId = options.storeId;
    this.setData({
      storeId: storeId,
      roomId: roomId
    });
    this.loadRoomDetail(storeId, roomId);
  },

  loadRoomDetail: function(storeId, roomId) {
    // 使用与store-detail相同的模拟数据
    const mockRooms = {
      '1': { // 万达店房间
        '101': {
          id: 101,
          name: '梅花厅',
          type: '麻将房',
          price: 80,
          image: '/images/room-default.jpg',
          facilities: '自动麻将机、空调、茶水、零食',
          status: 'available',
          statusText: '可预订',
          capacity: 4,
          description: '环境优雅的麻将房，配备全自动麻将机，提供免费茶水和小食。'
        },
        '102': {
          id: 102,
          name: '兰花厅',
          type: '麻将房',
          price: 80,
          image: '/images/room-default.jpg',
          facilities: '自动麻将机、空调、茶水、零食',
          status: 'available',
          statusText: '可预订',
          capacity: 4,
          description: '温馨舒适的麻将房，设施齐全，适合朋友聚会。'
        },
        '103': {
          id: 103,
          name: '竹叶厅',
          type: '麻将房',
          price: 100,
          image: '/images/room-default.jpg',
          facilities: '豪华自动麻将机、中央空调、高级茶具、按摩椅',
          status: 'occupied',
          statusText: '使用中',
          capacity: 4,
          description: '豪华VIP麻将房，配备按摩椅和高级茶具，享受尊贵体验。'
        },
        '104': {
          id: 104,
          name: '菊花厅',
          type: '扑克房',
          price: 60,
          image: '/images/room-default.jpg',
          facilities: '扑克桌、空调、饮料、小食',
          status: 'available',
          statusText: '可预订',
          capacity: 6,
          description: '专业扑克房，可容纳6人，适合德州扑克等游戏。'
        }
      },
      '2': { // 中心店房间
        '201': {
          id: 201,
          name: 'VIP包间A',
          type: '麻将房',
          price: 120,
          image: '/images/room-default.jpg',
          facilities: '豪华自动麻将机、按摩椅、咖啡机、高级音响',
          status: 'available',
          statusText: '可预订',
          capacity: 4,
          description: '顶级VIP包间，配备按摩椅和咖啡机，享受奢华体验。'
        },
        '202': {
          id: 202,
          name: 'VIP包间B',
          type: '麻将房',
          price: 120,
          image: '/images/room-default.jpg',
          facilities: '豪华自动麻将机、按摩椅、咖啡机、高级音响',
          status: 'available',
          statusText: '可预订',
          capacity: 4,
          description: '顶级VIP包间，设施豪华，服务周到。'
        },
        '203': {
          id: 203,
          name: '标准间C',
          type: '麻将房',
          price: 90,
          image: '/images/room-default.jpg',
          facilities: '自动麻将机、空调、茶水、WiFi',
          status: 'occupied',
          statusText: '使用中',
          capacity: 4,
          description: '标准麻将房，设施完善，性价比高。'
        }
      }
    };

    const storeRooms = mockRooms[storeId] || mockRooms['1'];
    const room = storeRooms[roomId] || storeRooms['101'];
    
    this.setData({
      room: room
    });
  },

  bookRoom: function() {
    if (this.data.room.status !== 'available') {
      wx.showToast({
        title: '房间暂不可用',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/booking/booking?roomId=${this.data.room.id}&storeId=${this.data.storeId}`
    });
  }
});