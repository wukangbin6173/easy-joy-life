// 支付API测试脚本
const https = require('https');

const baseUrl = 'https://xx.aieo.cn';

// 测试API请求函数
function testAPI(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Payment-Test-Script/1.0'
      }
    };

    if (data && method !== 'GET') {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          };
          
          if (res.headers['content-type']?.includes('application/json')) {
            result.json = JSON.parse(responseData);
          }
          
          resolve(result);
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData,
            parseError: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 测试用例
async function runTests() {
  console.log('🚀 开始测试支付API功能...\n');

  const tests = [
    {
      name: '测试基础API连接',
      path: '/api/stores',
      method: 'GET'
    },
    {
      name: '测试用户钱包API',
      path: '/api/payment/wallet/1',
      method: 'GET'
    },
    {
      name: '测试用户交易记录API',
      path: '/api/payment/transactions/1',
      method: 'GET'
    },
    {
      name: '测试创建充值订单API',
      path: '/api/payment/recharge/create',
      method: 'POST',
      data: {
        userId: 1,
        amount: 100.00,
        paymentMethod: 'ALIPAY'
      }
    }
  ];

  for (const test of tests) {
    try {
      console.log(`📋 ${test.name}`);
      console.log(`   请求: ${test.method} ${test.path}`);
      
      const result = await testAPI(test.path, test.method, test.data);
      
      console.log(`   状态码: ${result.statusCode}`);
      
      if (result.json) {
        console.log(`   响应: ${JSON.stringify(result.json, null, 2)}`);
      } else {
        console.log(`   响应: ${result.data.substring(0, 200)}${result.data.length > 200 ? '...' : ''}`);
      }
      
      if (result.statusCode >= 200 && result.statusCode < 300) {
        console.log('   ✅ 测试通过\n');
      } else {
        console.log('   ❌ 测试失败\n');
      }
      
    } catch (error) {
      console.log(`   ❌ 请求失败: ${error.message}\n`);
    }
  }

  console.log('🏁 测试完成！');
}

// 运行测试
runTests().catch(console.error);