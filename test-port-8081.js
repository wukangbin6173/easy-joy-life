// 测试8081端口的后端服务
const http = require('http');

console.log('🚀 测试8081端口后端服务...');

// API请求函数
function apiRequest(path, method = 'GET', data = null, port = 8081) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'xx.aieo.cn',
      port: port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Client'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          
          console.log(`📡 ${method} ${path} (端口${port})`);
          console.log(`📊 HTTP状态码: ${res.statusCode}`);
          console.log(`📄 响应数据:`, JSON.stringify(jsonData, null, 2));
          
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (e) {
          console.log(`📡 ${method} ${path} (端口${port})`);
          console.log(`📊 HTTP状态码: ${res.statusCode}`);
          console.log(`📄 响应内容: ${responseData}`);
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ 请求失败 ${method} ${path} (端口${port}):`, e.message);
      reject(e);
    });

    req.setTimeout(10000, () => {
      console.error(`❌ 请求超时 ${method} ${path} (端口${port})`);
      req.destroy();
      reject(new Error('请求超时'));
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testBothPorts() {
  console.log('\n📋 测试两个端口的服务...');
  
  // 测试8080端口
  try {
    console.log('\n🔸 测试8080端口 - 门店API');
    await apiRequest('/api/stores', 'GET', null, 8080);
  } catch (error) {
    console.log('❌ 8080端口测试失败:', error.message);
  }
  
  // 测试8081端口
  try {
    console.log('\n🔸 测试8081端口 - 门店API');
    await apiRequest('/api/stores', 'GET', null, 8081);
  } catch (error) {
    console.log('❌ 8081端口测试失败:', error.message);
  }
  
  // 测试8081端口的充值API
  try {
    console.log('\n🔸 测试8081端口 - 充值API');
    const orderData = {
      userId: 1,
      amount: 1,
      paymentMethod: 'WECHAT'
    };
    
    await apiRequest('/api/payment/recharge/create', 'POST', orderData, 8081);
  } catch (error) {
    console.log('❌ 8081端口充值API测试失败:', error.message);
  }
}

testBothPorts();