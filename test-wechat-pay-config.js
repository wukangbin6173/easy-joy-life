// 测试微信支付配置
const https = require('https');

console.log('🚀 测试微信支付配置...');
console.log('================================================');

// API请求函数
function apiRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL('https://xx.aieo.cn' + path);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Client'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          
          console.log(`📡 ${method} ${path}`);
          console.log(`📊 HTTP状态码: ${res.statusCode}`);
          console.log(`📄 响应数据:`, JSON.stringify(jsonData, null, 2));
          
          if (res.statusCode === 200) {
            resolve(jsonData);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${jsonData.message || '请求失败'}`));
          }
        } catch (e) {
          console.error('❌ JSON解析失败:', e.message);
          console.log('📄 原始响应:', responseData);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ 请求失败 ${method} ${path}:`, e.message);
      reject(e);
    });

    req.setTimeout(10000, () => {
      console.error(`❌ 请求超时 ${method} ${path}`);
      req.destroy();
      reject(new Error('请求超时'));
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 测试微信支付配置
async function testWechatPayConfig() {
  console.log('📋 测试微信支付配置...');
  
  try {
    // 步骤1: 创建充值订单
    console.log('\n🔸 步骤1: 创建充值订单');
    const orderData = {
      userId: 1,
      amount: 1,
      paymentMethod: 'WECHAT'
    };
    
    const orderResult = await apiRequest('/api/payment/recharge/create', 'POST', orderData);
    
    if (orderResult.success) {
      console.log('✅ 订单创建成功');
      console.log(`📋 订单号: ${orderResult.orderNo}`);
      
      // 步骤2: 测试微信支付配置
      console.log('\n🔸 步骤2: 测试微信支付配置');
      const paymentData = {
        orderNo: orderResult.orderNo,
        openid: 'test_openid_for_config_check'
      };
      
      try {
        const payResult = await apiRequest('/api/payment/wechat/pay', 'POST', paymentData);
        
        if (payResult.success) {
          console.log('🎉 微信支付配置正常');
          console.log('📋 支付参数:', payResult.payParams);
          return { status: 'success', message: '微信支付配置正常' };
        } else {
          console.log('⚠️ 微信支付配置有问题:', payResult.message);
          return { status: 'config_error', message: payResult.message };
        }
      } catch (payError) {
        console.log('❌ 微信支付配置错误:', payError.message);
        
        // 分析具体错误
        if (payError.message.includes('private-key-path')) {
          return { 
            status: 'cert_error', 
            message: '证书路径配置错误',
            solution: '需要检查证书文件路径和内容'
          };
        } else if (payError.message.includes('merchant-serial-number')) {
          return { 
            status: 'serial_error', 
            message: '商户证书序列号错误',
            solution: '需要更新商户证书序列号'
          };
        } else if (payError.message.includes('api-v3-key')) {
          return { 
            status: 'key_error', 
            message: 'API v3密钥错误',
            solution: '需要检查API v3密钥配置'
          };
        } else {
          return { 
            status: 'unknown_error', 
            message: payError.message,
            solution: '需要检查完整的微信支付配置'
          };
        }
      }
    } else {
      throw new Error(orderResult.message || '订单创建失败');
    }
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    return { 
      status: 'error', 
      message: error.message
    };
  }
}

// 提供配置修复建议
function provideConfigSolution(result) {
  console.log('\n📊 诊断结果:');
  console.log(`状态: ${result.status}`);
  console.log(`信息: ${result.message}`);
  
  if (result.solution) {
    console.log(`解决方案: ${result.solution}`);
  }
  
  console.log('\n🔧 微信支付配置检查清单:');
  console.log('1. 证书文件路径: classpath:cert/apiclient_key.pem');
  console.log('2. 商户号: 1554487931');
  console.log('3. 商户证书序列号: 68EFFAD8D54020146A1372141B6EEBA1B52D6B64');
  console.log('4. API v3密钥: idNmbaZ0EPgwbvYbJDGp2EGlwQDezU6d');
  console.log('5. 小程序AppID: wx9f4a33e5f2b31a6d');
  
  console.log('\n💡 常见问题解决方案:');
  console.log('1. 证书文件问题: 确保apiclient_key.pem文件存在且格式正确');
  console.log('2. 序列号错误: 重新获取商户证书序列号');
  console.log('3. API密钥错误: 检查微信支付商户平台的API v3密钥');
  console.log('4. 权限问题: 确保商户号有小程序支付权限');
  console.log('5. 网络问题: 检查服务器到微信支付API的网络连接');
}

// 主测试函数
async function runWechatPayConfigTest() {
  try {
    const result = await testWechatPayConfig();
    provideConfigSolution(result);
    
  } catch (error) {
    console.log('\n❌ 测试过程异常:', error.message);
  }
  
  console.log('================================================');
}

// 运行测试
runWechatPayConfigTest();