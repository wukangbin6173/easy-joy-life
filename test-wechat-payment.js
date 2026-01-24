// 微信支付功能测试脚本
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
  console.log('🚀 开始测试微信支付功能...\n');

  const tests = [
    {
      name: '测试微信登录接口',
      path: '/api/auth/wechat/login',
      method: 'POST',
      data: {
        code: 'test_wx_code_123'
      }
    },
    {
      name: '测试创建充值订单（微信支付）',
      path: '/api/payment/recharge/create',
      method: 'POST',
      data: {
        userId: 1,
        amount: 50.00,
        paymentMethod: 'WECHAT'
      }
    },
    {
      name: '测试微信支付接口',
      path: '/api/payment/wechat/pay',
      method: 'POST',
      data: {
        orderNo: 'PAY20260123001',
        openid: 'test_openid_001'
      }
    },
    {
      name: '测试用户信息查询',
      path: '/api/auth/user/info?openid=test_openid_001',
      method: 'GET'
    }
  ];

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

  console.log('🏁 微信支付功能测试完成！');
  console.log('\n📝 注意事项：');
  console.log('1. 需要配置真实的微信支付商户信息');
  console.log('2. 需要部署商户API证书文件');
  console.log('3. 需要在微信商户平台配置回调地址');
  console.log('4. 小程序需要申请支付功能并通过审核');
}

// 运行测试
runWechatPaymentTests().catch(console.error);