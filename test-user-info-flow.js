// 测试用户信息自动获取流程
const https = require('https');

const baseUrl = 'https://xx.aieo.cn';

// 测试门店API
function testStoresAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'xx.aieo.cn',
      port: 443,
      path: '/api/stores',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('门店API测试结果:', result);
          resolve(result);
        } catch (e) {
          console.error('解析响应失败:', e);
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      console.error('门店API请求失败:', err);
      reject(err);
    });

    req.end();
  });
}

// 测试房间API
function testRoomsAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'xx.aieo.cn',
      port: 443,
      path: '/api/rooms',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('房间API测试结果:', result);
          resolve(result);
        } catch (e) {
          console.error('解析响应失败:', e);
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      console.error('房间API请求失败:', err);
      reject(err);
    });

    req.end();
  });
}

// 运行测试
async function runTests() {
  console.log('开始测试API连接...');
  console.log('目标服务器:', baseUrl);
  
  try {
    console.log('\n=== 测试门店API ===');
    const storesResult = await testStoresAPI();
    
    console.log('\n=== 测试房间API ===');
    const roomsResult = await testRoomsAPI();
    
    console.log('\n=== 测试完成 ===');
    console.log('门店数量:', storesResult.data ? storesResult.data.length : 0);
    console.log('房间数量:', roomsResult.data ? roomsResult.data.length : 0);
    
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

runTests();