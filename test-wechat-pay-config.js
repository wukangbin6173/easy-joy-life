// 测试微信支付配置状态
const http = require('http');

console.log('🚀 测试微信支付配置状态...');

// API请求函数
function apiRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'xx.aieo.cn',
      port: 8081,
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
          
          console.log(`📡 ${method} ${path}`);
          console.log(`📊 HTTP状态码: ${res.statusCode}`);
          console.log(`📄 响应数据:`, JSON.stringify(jsonData, null, 2));
          
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (e) {
          console.log(`📡 ${method} ${path}`);
          console.log(`📊 HTTP状态码: ${res.statusCode}`);
          console.log(`📄 响应内容: ${responseData}`);
          resolve({ statusCode: res.statusCode, data: responseData });
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

async function testWechatPayConfig() {
  console.log('\n📋 测试微信支付配置...');
  
  try {
    // 测试1: 创建充值订单
    console.log('\n🔸 步骤1: 创建充值订单');
    const orderData = {
      userId: 1,
      amount: 1,
      paymentMethod: 'WECHAT'
    };
    
    const orderResult = await apiRequest('/api/payment/recharge/create', 'POST', orderData);
    
    if (orderResult.statusCode === 200 && orderResult.data.success) {
      console.log('✅ 订单创建成功');
      console.log(`📋 订单号: ${orderResult.data.orderNo}`);
      
      // 测试2: 尝试创建微信支付
      console.log('\n🔸 步骤2: 创建微信支付');
      const paymentData = {
        orderNo: orderResult.data.orderNo,
        openid: 'test_openid_for_config_check'
      };
      
      const payResult = await apiRequest('/api/payment/wechat/pay', 'POST', paymentData);
      
      console.log('\n🔍 微信支付配置分析:');
      
      if (payResult.statusCode === 500) {
        const errorMsg = payResult.data.message || '';
        
        if (errorMsg.includes('null')) {
          console.log('❌ 微信支付SDK返回null - 可能的原因:');
          console.log('   1. 微信支付配置未正确加载');
          console.log('   2. 证书文件路径问题');
          console.log('   3. 商户信息配置错误');
          console.log('   4. API密钥配置错误');
        } else if (errorMsg.includes('未正确初始化')) {
          console.log('❌ 微信支付服务初始化失败');
          console.log('   检查后端启动日志中的初始化错误信息');
        } else {
          console.log('❌ 其他微信支付错误:', errorMsg);
        }
        
        console.log('\n💡 建议的修复步骤:');
        console.log('1. 检查application.yml中的微信支付配置');
        console.log('2. 确认证书文件存在: backend/src/main/resources/cert/');
        console.log('3. 重新编译并部署后端服务');
        console.log('4. 检查后端启动日志中的微信支付初始化信息');
        
      } else if (payResult.statusCode === 200) {
        console.log('🎉 微信支付配置正常！');
        console.log('✅ 微信支付SDK初始化成功');
        console.log('✅ 支付参数生成正常');
      } else {
        console.log(`⚠️ 意外的响应状态码: ${payResult.statusCode}`);
      }
      
    } else {
      console.log('❌ 订单创建失败，无法测试微信支付');
    }
    
  } catch (error) {
    console.log('❌ 测试过程异常:', error.message);
  }
}

// 运行测试
testWechatPayConfig();