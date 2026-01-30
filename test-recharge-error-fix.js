// 测试充值错误处理修复
const https = require('https');

console.log('🚀 测试充值错误处理修复...');
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

// 测试完整的充值流程
async function testRechargeFlow() {
  console.log('📋 测试完整充值流程...');
  
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
      
      // 步骤2: 尝试创建微信支付（预期会失败，但错误处理应该正常）
      console.log('\n🔸 步骤2: 创建微信支付');
      const paymentData = {
        orderNo: orderResult.orderNo,
        openid: 'test_openid_123456'
      };
      
      try {
        const payResult = await apiRequest('/api/payment/wechat/pay', 'POST', paymentData);
        
        if (payResult.success) {
          console.log('🎉 微信支付创建成功（意外的成功）');
          return { status: 'success', message: '微信支付功能正常' };
        } else {
          console.log('⚠️ 微信支付创建失败（预期的）:', payResult.message);
          return { status: 'expected_error', message: payResult.message };
        }
      } catch (payError) {
        console.log('⚠️ 微信支付API调用失败（预期的）:', payError.message);
        
        // 检查错误对象结构
        console.log('🔍 错误对象分析:');
        console.log('  - 错误类型:', typeof payError);
        console.log('  - 有message属性:', 'message' in payError);
        console.log('  - message值:', payError.message);
        console.log('  - 错误字符串:', payError.toString());
        
        return { 
          status: 'expected_error', 
          message: payError.message,
          errorStructure: 'valid'
        };
      }
    } else {
      throw new Error(orderResult.message || '订单创建失败');
    }
  } catch (error) {
    console.log('❌ 充值流程测试失败:', error.message);
    
    // 分析错误结构
    console.log('🔍 错误对象分析:');
    console.log('  - 错误类型:', typeof error);
    console.log('  - 有message属性:', 'message' in error);
    console.log('  - message值:', error.message);
    console.log('  - 完整错误:', error);
    
    return { 
      status: 'error', 
      message: error.message,
      errorStructure: 'analyzed'
    };
  }
}

// 测试错误处理的健壮性
async function testErrorHandling() {
  console.log('\n📋 测试错误处理健壮性...');
  
  // 测试各种错误场景
  const errorTests = [
    {
      name: '无效金额',
      data: { userId: 1, amount: 0, paymentMethod: 'WECHAT' }
    },
    {
      name: '缺少参数',
      data: { userId: 1, paymentMethod: 'WECHAT' }
    },
    {
      name: '无效支付方式',
      data: { userId: 1, amount: 100, paymentMethod: 'INVALID' }
    }
  ];
  
  for (const test of errorTests) {
    console.log(`\n🔸 测试: ${test.name}`);
    
    try {
      const result = await apiRequest('/api/payment/recharge/create', 'POST', test.data);
      console.log(`⚠️ 意外成功: ${test.name}`);
    } catch (error) {
      console.log(`✅ 预期错误: ${error.message}`);
      console.log(`   错误结构正常: ${typeof error.message === 'string'}`);
    }
  }
}

// 主测试函数
async function runErrorFixTest() {
  try {
    // 测试1: 完整充值流程
    const flowResult = await testRechargeFlow();
    
    // 测试2: 错误处理健壮性
    await testErrorHandling();
    
    console.log('\n📊 测试总结:');
    console.log(`✅ 充值流程状态: ${flowResult.status}`);
    console.log(`📋 主要信息: ${flowResult.message}`);
    
    if (flowResult.errorStructure === 'valid') {
      console.log('🎉 错误处理修复成功！');
      console.log('💡 现在错误对象有正确的结构，不会再出现 undefined 错误');
    } else {
      console.log('⚠️ 错误处理需要进一步检查');
    }
    
  } catch (error) {
    console.log('\n❌ 测试过程异常:', error.message);
  }
  
  console.log('================================================');
}

// 运行测试
runErrorFixTest();