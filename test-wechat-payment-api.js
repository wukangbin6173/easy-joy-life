// 微信支付API接口测试脚本
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
        'User-Agent': 'WeChat-Payment-Test/1.0'
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

// 微信支付测试用例
async function runWechatPaymentTests() {
  console.log('🚀 开始测试微信支付API接口...\n');

  const tests = [
    {
      name: '1. 测试服务器连接',
      path: '/api/stores',
      method: 'GET'
    },
    {
      name: '2. 测试微信登录接口',
      path: '/api/auth/wechat/login',
      method: 'POST',
      data: {
        code: 'test_wx_code_123'
      }
    },
    {
      name: '3. 测试创建充值订单（微信支付）',
      path: '/api/payment/recharge/create',
      method: 'POST',
      data: {
        userId: 1,
        amount: 0.01,  // 测试金额1分钱
        paymentMethod: 'WECHAT'
      }
    },
    {
      name: '4. 测试微信支付接口',
      path: '/api/payment/wechat/pay',
      method: 'POST',
      data: {
        orderNo: 'TEST' + Date.now(),
        openid: 'test_openid_001'
      }
    },
    {
      name: '5. 测试订单状态查询',
      path: '/api/payment/order/TEST' + Date.now(),
      method: 'GET'
    },
    {
      name: '6. 测试用户钱包查询',
      path: '/api/payment/wallet/1',
      method: 'GET'
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`📋 ${test.name}`);
      console.log(`   请求: ${test.method} ${test.path}`);
      
      if (test.data) {
        console.log(`   参数: ${JSON.stringify(test.data, null, 2)}`);
      }
      
      const result = await testAPI(test.path, test.method, test.data);
      
      console.log(`   状态码: ${result.statusCode}`);
      
      if (result.json) {
        console.log(`   响应: ${JSON.stringify(result.json, null, 2)}`);
      } else {
        const preview = result.data.substring(0, 200);
        console.log(`   响应: ${preview}${result.data.length > 200 ? '...' : ''}`);
      }
      
      if (result.statusCode >= 200 && result.statusCode < 300) {
        console.log('   ✅ 测试通过\n');
        passedTests++;
      } else if (result.statusCode === 404) {
        console.log('   ⚠️  接口未找到（可能未部署）\n');
      } else {
        console.log('   ❌ 测试失败\n');
      }
      
    } catch (error) {
      console.log(`   ❌ 请求失败: ${error.message}\n`);
    }
  }

  console.log('🏁 微信支付API测试完成！');
  console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！微信支付功能正常');
  } else {
    console.log('⚠️  部分测试失败，请检查配置和部署状态');
  }

  console.log('\n📝 测试说明：');
  console.log('1. 确保后端服务已启动并部署到服务器');
  console.log('2. 确保微信支付配置正确');
  console.log('3. 确保数据库连接正常');
  console.log('4. 如需真实支付测试，请使用微信开发者工具');
}

// 运行测试
runWechatPaymentTests().catch(console.error);