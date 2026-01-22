// 模拟数据 - 与后端真实数据保持一致
const mockStores = [
  {
    id: 1,
    name: '雀胜棋牌室(万达店)',
    address: '北京市朝阳区建国路93号万达广场3层',
    longitude: 116.447587,
    latitude: 39.937075,
    phone: '010-12345678',
    description: '环境优雅，设施齐全的高端棋牌室',
    images: ['/images/store-logo-1.jpg'],
    businessHours: '09:00-02:00',
    facilities: '智能门锁,中央空调,免费WiFi,茶水服务,停车位',
    status: 1,
    distance: '1.2km'
  },
  {
    id: 2,
    name: '雀胜棋牌室(中心店)',
    address: '北京市海淀区中关村大街27号中关村大厦',
    longitude: 116.310316,
    latitude: 39.983424,
    phone: '010-87654321',
    description: '科技感十足的智能棋牌室',
    images: ['/images/store-logo-2.jpg'],
    businessHours: '24小时营业',
    facilities: '智能门锁,新风系统,高速WiFi,咖啡机,充电桩',
    status: 1,
    distance: '2.5km'
  },
  {
    id: 3,
    name: '雀胜棋牌室(西单店)',
    address: '北京市西城区西单北大街120号西单商场',
    longitude: 116.366794,
    latitude: 39.906901,
    phone: '010-11223344',
    description: '交通便利，停车方便',
    images: ['/images/store-logo-3.jpg'],
    businessHours: '10:00-24:00',
    facilities: '智能门锁,空气净化,免费WiFi,小食服务',
    status: 1,
    distance: '3.8km'
  },
  {
    id: 4,
    name: '雀胜棋牌室(国贸店)',
    address: '北京市朝阳区建国门外大街1号国贸大厦',
    longitude: 116.458564,
    latitude: 39.908347,
    phone: '010-55667788',
    description: '商务人士首选，高端大气',
    images: ['/images/store-logo-4.jpg'],
    businessHours: '09:00-01:00',
    facilities: '智能门锁,商务设施,高速WiFi,会议室,秘书服务',
    status: 1,
    distance: '4.2km'
  },
  {
    id: 5,
    name: '雀胜棋牌室(三里屯店)',
    address: '北京市朝阳区三里屯路19号三里屯太古里',
    longitude: 116.456621,
    latitude: 39.937456,
    phone: '010-99887766',
    description: '时尚潮流，年轻人聚集地',
    images: ['/images/store-logo-5.jpg'],
    businessHours: '12:00-03:00',
    facilities: '智能门锁,音响系统,免费WiFi,调酒服务,夜宵',
    status: 1,
    distance: '1.8km'
  }
];

const mockRooms = [
  // 万达店房间
  {
    id: 1,
    storeId: 1,
    roomNo: '101',
    name: '梅花厅',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 80.00,
    images: ['/images/room-default.jpg'],
    facilities: '自动麻将机,空调,茶水',
    status: 1
  },
  {
    id: 2,
    storeId: 1,
    roomNo: '102',
    name: '兰花厅',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 80.00,
    images: ['/images/room-default.jpg'],
    facilities: '自动麻将机,空调,茶水',
    status: 1
  },
  {
    id: 3,
    storeId: 1,
    roomNo: '103',
    name: '竹叶厅',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 100.00,
    images: ['/images/room-default.jpg'],
    facilities: '豪华自动麻将机,中央空调,高级茶具',
    status: 1
  },
  {
    id: 4,
    storeId: 1,
    roomNo: '104',
    name: '菊花厅',
    type: '扑克房',
    capacity: 6,
    pricePerHour: 60.00,
    images: ['/images/room-default.jpg'],
    facilities: '扑克桌,空调,饮料',
    status: 1
  },
  // 中心店房间
  {
    id: 5,
    storeId: 2,
    roomNo: '201',
    name: 'VIP包间A',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 120.00,
    images: ['/images/room-default.jpg'],
    facilities: '豪华自动麻将机,按摩椅,咖啡机',
    status: 1
  },
  {
    id: 6,
    storeId: 2,
    roomNo: '202',
    name: 'VIP包间B',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 120.00,
    images: ['/images/room-default.jpg'],
    facilities: '豪华自动麻将机,按摩椅,咖啡机',
    status: 1
  },
  {
    id: 7,
    storeId: 2,
    roomNo: '203',
    name: '标准间C',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 90.00,
    images: ['/images/room-default.jpg'],
    facilities: '自动麻将机,空调,茶水',
    status: 1
  },
  // 西单店房间
  {
    id: 8,
    storeId: 3,
    roomNo: '301',
    name: '雅致包间',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 70.00,
    images: ['/images/room-default.jpg'],
    facilities: '自动麻将机,空调,茶水,小食',
    status: 1
  },
  {
    id: 9,
    storeId: 3,
    roomNo: '302',
    name: '温馨包间',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 70.00,
    images: ['/images/room-default.jpg'],
    facilities: '自动麻将机,空调,茶水,小食',
    status: 1
  },
  // 国贸店房间
  {
    id: 10,
    storeId: 4,
    roomNo: '401',
    name: '商务包间A',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 150.00,
    images: ['/images/room-default.jpg'],
    facilities: '豪华麻将机,商务设施,高级茶具',
    status: 1
  },
  {
    id: 11,
    storeId: 4,
    roomNo: '402',
    name: '商务包间B',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 150.00,
    images: ['/images/room-default.jpg'],
    facilities: '豪华麻将机,商务设施,高级茶具',
    status: 1
  },
  // 三里屯店房间
  {
    id: 12,
    storeId: 5,
    roomNo: '501',
    name: '潮流包间',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 100.00,
    images: ['/images/room-default.jpg'],
    facilities: '智能麻将机,音响系统,调酒台',
    status: 1
  },
  {
    id: 13,
    storeId: 5,
    roomNo: '502',
    name: '时尚包间',
    type: '麻将房',
    capacity: 4,
    pricePerHour: 100.00,
    images: ['/images/room-default.jpg'],
    facilities: '智能麻将机,音响系统,调酒台',
    status: 1
  }
];

const mockUser = {
  id: 1,
  nickname: '测试用户',
  avatar: '/images/logo.png',
  phone: '138****8888',
  level: 1,
  points: 100,
  balance: 50.00
};

// 模拟API响应
function mockRequest(url, options = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = null;
      
      if (url.includes('/stores/search')) {
        // 搜索门店
        const keyword = options.data?.keyword || '';
        if (keyword) {
          data = mockStores.filter(store => 
            store.name.includes(keyword) || 
            store.address.includes(keyword)
          );
        } else {
          data = mockStores;
        }
      } else if (url.includes('/stores/') && url.match(/\/stores\/\d+$/)) {
        // 获取单个门店详情
        const storeId = parseInt(url.match(/\/stores\/(\d+)$/)[1]);
        data = mockStores.find(store => store.id === storeId);
      } else if (url.includes('/stores')) {
        // 获取所有门店
        data = mockStores;
      } else if (url.includes('/rooms/store/')) {
        // 根据门店ID获取房间
        const storeId = parseInt(url.match(/\/rooms\/store\/(\d+)$/)[1]);
        data = mockRooms.filter(room => room.storeId === storeId);
      } else if (url.includes('/rooms/') && url.match(/\/rooms\/\d+$/)) {
        // 获取单个房间详情
        const roomId = parseInt(url.match(/\/rooms\/(\d+)$/)[1]);
        data = mockRooms.find(room => room.id === roomId);
      } else if (url.includes('/rooms')) {
        // 获取所有房间
        data = mockRooms;
      } else if (url.includes('/user/profile')) {
        data = mockUser;
      } else if (url.includes('/auth/wechat-login')) {
        data = {
          token: 'mock_token_123456',
          userInfo: mockUser
        };
      }
      
      resolve({
        code: 200,
        message: '成功',
        data: data
      });
    }, 500); // 模拟网络延迟
  });
}

module.exports = {
  mockStores,
  mockRooms,
  mockUser,
  mockRequest
};