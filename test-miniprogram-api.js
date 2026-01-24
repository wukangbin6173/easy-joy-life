// 小程序API连接测试脚本
// 在微信开发者工具控制台中运行此脚本来测试API连接

console.log('=== 易享生活小程序API连接测试 ===');

// 获取当前配置
const app = getApp();
console.log('当前API地址:', app.globalData.baseUrl);
console.log('模拟模式:', app.globalData.mockMode);

// 测试门店API
function testStoreAPI() {
  console.log('\n--- 测试门店API ---');
  
  const { storeApi } = require('./utils/api.js');
  
  storeApi.getStores()
    .then(response => {
      console.log('✅ 门店API测试成功');
      console.log('门店数量:', response.data.length);
      console.log('第一个门店:', response.data[0]);
    })
    .catch(error => {
      console.error('❌ 门店API测试失败:', error);
    });
}

// 测试房间API
function testRoomAPI() {
  console.log('\n--- 测试房间API ---');
  
  const { roomApi } = require('./utils/api.js');
  
  roomApi.getAllRooms()
    .then(response => {
      console.log('✅ 房间API测试成功');
      console.log('房间数量:', response.data.length);
      console.log('第一个房间:', response.data[0]);
    })
    .catch(error => {
      console.error('❌ 房间API测试失败:', error);
    });
}

// 测试网络连接
function testNetworkConnection() {
  console.log('\n--- 测试网络连接 ---');
  
  wx.request({
    url: app.globalData.baseUrl + '/api/stores',
    method: 'GET',
    success: (res) => {
      console.log('✅ 网络连接测试成功');
      console.log('状态码:', res.statusCode);
      console.log('响应数据:', res.data);
    },
    fail: (err) => {
      console.error('❌ 网络连接测试失败:', err);
    }
  });
}

// 运行所有测试
function runAllTests() {
  console.log('开始运行API测试...\n');
  
  testNetworkConnection();
  
  setTimeout(() => {
    testStoreAPI();
  }, 1000);
  
  setTimeout(() => {
    testRoomAPI();
  }, 2000);
}

// 导出测试函数
module.exports = {
  runAllTests,
  testStoreAPI,
  testRoomAPI,
  testNetworkConnection
};

// 如果直接运行，执行所有测试
if (typeof module === 'undefined') {
  runAllTests();
}