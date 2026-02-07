/**
 * 测试0.1元充值功能
 */

const https = require('https');

const config = {
  baseUrl: 'xx.aieo.cn',
  port: 443,
  userId: 1,
  token: 'test-token-' + Date.now(),
  openid: 'test-openid-' + Date.now()
};

function httpsRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            json: JSON.parse(data)
          });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data, json: null });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function testRecharge(amount) {
  console.log(`\n========================================`);
  console.log(`测试充值金额: ${amount} 元`);
  console.log(`========================================\n`);
  
  // 创建订单
  const orderData = JSON.stringify({
    userId: config.userId,
    amount: amount,
    paymentMethod: 'WECHAT'
  });
  
  const options = {
    hostname: config.baseUrl,
    port: config.port,
    path: '/api/payment/recharge/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(orderData),
      'Authorization': `Bearer ${config.token}`
    }
  };
  
  try {
    const response = await httpsRequest(options, orderData);
    console.log(`响应状态: ${response.statusCode}`);
    console.log(`响应内容:`, JSON.stringify(response.json, null, 2));
    
    if (response.json && response.json.success) {
      console.log(`\n✅ ${amount}元充值订单创建成功`);
      return { success: true, orderNo: response.json.orderNo };
    } else {
      console.log(`\n❌ ${amount}元充值订单创建失败`);
      console.log(`错误信息:`, response.json ? response.json.message : '未知错误');
      return { success: false, message: response.json ? response.json.message : '未知错误' };
    }
  } catch (error) {
    console.error(`\n❌ 请求失败:`, error.message);
    return { success: false, message: error.message };
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║          测试0.1元最低充值金额功能                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // 测试1: 0.05元 (应该失败)
  const test1 = await testRecharge(0.05);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 测试2: 0.1元 (应该成功)
  const test2 = await testRecharge(0.1);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 测试3: 0.5元 (应该成功)
  const test3 = await testRecharge(0.5);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 测试4: 1元 (应该成功)
  const test4 = await testRecharge(1.0);
  
  // 总结
  console.log('\n========================================');
  console.log('测试总结');
  console.log('========================================\n');
  
  console.log('测试结果:');
  console.log(`  0.05元: ${test1.success ? '✅ 成功' : '❌ 失败'} ${!test1.success ? '(预期失败)' : ''}`);
  console.log(`  0.1元:  ${test2.success ? '✅ 成功' : '❌ 失败'} ${test2.success ? '(预期成功)' : ''}`);
  console.log(`  0.5元:  ${test3.success ? '✅ 成功' : '❌ 失败'} ${test3.success ? '(预期成功)' : ''}`);
  console.log(`  1元:    ${test4.success ? '✅ 成功' : '❌ 失败'} ${test4.success ? '(预期成功)' : ''}`);
  
  const allPassed = !test1.success && test2.success && test3.success && test4.success;
  
  if (allPassed) {
    console.log('\n🎉 所有测试通过！最低充值金额已成功修改为0.1元');
  } else {
    console.log('\n⚠️ 部分测试未通过，请检查配置');
  }
}

main();
