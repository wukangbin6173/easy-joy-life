// 测试API连接
const https = require('https');

function testAPI(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'xx.aieo.cn',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ ${description}:`);
          console.log(`   状态码: ${res.statusCode}`);
          console.log(`   数据条数: ${jsonData.data ? jsonData.data.length : 0}`);
          console.log(`   消息: ${jsonData.message}`);
          resolve(jsonData);
        } catch (error) {
          console.log(`❌ ${description} - JSON解析失败:`, error.message);
          console.log(`   原始数据: ${data.substring(0, 200)}...`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${description} - 请求失败:`, error.message);
      reject(error);
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 开始测试API连接...\n');
  
  try {
    await testAPI('/api/stores', '门店列表API');
    await testAPI('/api/rooms', '房间列表API');
    
    console.log('\n✅ 所有API测试完成！');
  } catch (error) {
    console.log('\n❌ 测试过程中出现错误:', error.message);
  }
}

runTests();