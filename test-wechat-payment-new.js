/**
 * 测试微信支付功能 - 新商户号
 * 商户号: 1671050768 (上海信辉联智信息咨询有限公司)
 */

const https = require('https');

// 配置
const config = {
  baseUrl: 'xx.aieo.cn',
  port: 443,
  // 测试用户信息 - 需要先登录获取真实的token和openid
  token: 'test-token-placeholder',
  openid: 'test-openid-placeholder'
};

/**
 * 发送HTTPS请求
 */
function httpsRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            json: null
          };
          
          try {
            result.json = JSON.parse(data);
          } catch (e) {
            // 不是JSON格式
          }
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

/**
 * 步骤1: 测试微信登录
 */
async function testWechatLogin() {
  console.log('\n========================================');
  console.log('步骤1: 测试微信登录');
  console.log('========================================\n');
  
  const code = 'test-wx-code-' + Date.now();
  
  const options = {
    hostname: config.baseUrl,
    port: config.port,
    path: `/api/auth/wechat/login?code=${code}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    console.log(`请求: POST https://${config.baseUrl}/api/auth/wechat/login?code=${code}`);
    const response = await httpsRequest(options);
    
    console.log(`响应状态: ${response.statusCode}`);
    console.log('响应内容:', response.body);
    
    if (response.json) {
      if (response.json.code === 200 && response.json.data) {
        config.token = response.json.data.token;
        config.openid = response.json.data.openid;
        console.log('\n✅ 登录成功');
        console.log(`Token: ${config.token}`);
        console.log(`OpenID: ${config.openid}`);
        return true;
      } else {
        console.log('\n⚠️ 登录失败，使用测试数据继续');
        // 使用测试数据
        config.token = 'test-token-' + Date.now();
        config.openid = 'oTest-' + Date.now();
        return false;
      }
    }
  } catch (error) {
    console.error('❌ 登录请求失败:', error.message);
    // 使用测试数据
    config.token = 'test-token-' + Date.now();
    config.openid = 'oTest-' + Date.now();
    return false;
  }
}

/**
 * 步骤2: 创建充值订单
 */
async function testCreateRechargeOrder() {
  console.log('\n========================================');
  console.log('步骤2: 创建充值订单');
  console.log('========================================\n');
  
  const orderData = {
    userId: 1,  // 测试用户ID
    amount: 50.00,  // 充值50元
    paymentMethod: 'WECHAT'
  };
  
  const postData = JSON.stringify(orderData);
  
  const options = {
    hostname: config.baseUrl,
    port: config.port,
    path: '/api/payment/recharge/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': `Bearer ${config.token}`
    }
  };
  
  try {
    console.log(`请求: POST https://${config.baseUrl}/api/payment/recharge/create`);
    console.log('请求头:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token.substring(0, 20)}...`
    });
    console.log('请求体:', orderData);
    
    const response = await httpsRequest(options, postData);
    
    console.log(`\n响应状态: ${response.statusCode}`);
    console.log('响应内容:', response.body);
    
    if (response.json) {
      if (response.json.success && response.json.orderNo) {
        console.log('\n✅ 订单创建成功');
        console.log('订单号:', response.json.orderNo);
        console.log('订单金额:', response.json.amount);
        
        return {
          success: true,
          orderNo: response.json.orderNo,
          amount: response.json.amount
        };
      } else {
        console.log('\n❌ 订单创建失败');
        console.log('错误信息:', response.json.message || '未知错误');
        return {
          success: false,
          message: response.json.message || '未知错误'
        };
      }
    } else {
      console.log('\n❌ 响应格式错误');
      return {
        success: false,
        message: '响应格式错误'
      };
    }
  } catch (error) {
    console.error('\n❌ 创建订单请求失败:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * 步骤3: 调用微信支付
 */
async function testWechatPay(orderNo) {
  console.log('\n========================================');
  console.log('步骤3: 调用微信支付');
  console.log('========================================\n');
  
  const payData = {
    orderNo: orderNo,
    openid: config.openid
  };
  
  const postData = JSON.stringify(payData);
  
  const options = {
    hostname: config.baseUrl,
    port: config.port,
    path: '/api/payment/wechat/pay',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': `Bearer ${config.token}`
    }
  };
  
  try {
    console.log(`请求: POST https://${config.baseUrl}/api/payment/wechat/pay`);
    console.log('请求体:', payData);
    
    const response = await httpsRequest(options, postData);
    
    console.log(`\n响应状态: ${response.statusCode}`);
    console.log('响应内容:', response.body);
    
    if (response.json) {
      if (response.json.success && response.json.payParams) {
        console.log('\n✅ 微信支付参数获取成功:');
        console.log('  - timeStamp:', response.json.payParams.timeStamp);
        console.log('  - nonceStr:', response.json.payParams.nonceStr);
        console.log('  - package:', response.json.payParams.package);
        console.log('  - signType:', response.json.payParams.signType);
        console.log('  - paySign:', response.json.payParams.paySign ? '已生成' : '未生成');
        
        return {
          success: true,
          payParams: response.json.payParams
        };
      } else {
        console.log('\n❌ 获取支付参数失败');
        console.log('错误信息:', response.json.message || '未知错误');
        return {
          success: false,
          message: response.json.message || '未知错误'
        };
      }
    } else {
      console.log('\n❌ 响应格式错误');
      return {
        success: false,
        message: '响应格式错误'
      };
    }
  } catch (error) {
    console.error('\n❌ 微信支付请求失败:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * 步骤4: 检查后端日志
 */
async function checkBackendLogs() {
  console.log('\n========================================');
  console.log('步骤3: 检查后端日志（需要SSH访问）');
  console.log('========================================\n');
  
  console.log('请在服务器上执行以下命令查看详细日志:');
  console.log('');
  console.log('  ssh root@xx.aieo.cn "journalctl -u easy-joy-life-backend -n 100 --no-pager | grep -E \'微信支付|WechatPay|createJsapiOrder\'"');
  console.log('');
}

/**
 * 主测试流程
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║          微信支付功能测试 - 新商户号                      ║');
  console.log('║  商户号: 1671050768 (上海信辉联智信息咨询有限公司)       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  try {
    // 步骤1: 登录
    await testWechatLogin();
    
    // 等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 步骤2: 创建充值订单
    const orderResult = await testCreateRechargeOrder();
    
    if (!orderResult.success) {
      console.log('\n❌ 无法继续测试，订单创建失败');
      await checkBackendLogs();
      return;
    }
    
    // 等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 步骤3: 调用微信支付
    const payResult = await testWechatPay(orderResult.orderNo);
    
    // 步骤4: 提示检查日志
    await checkBackendLogs();
    
    // 总结
    console.log('\n========================================');
    console.log('测试总结');
    console.log('========================================\n');
    
    if (orderResult.success && payResult && payResult.success) {
      console.log('✅ 微信支付功能正常！');
      console.log('✅ 订单号:', orderResult.orderNo);
      console.log('✅ 支付参数已生成');
      console.log('\n下一步: 在小程序中使用这些参数调用 wx.requestPayment() 完成支付');
    } else {
      console.log('❌ 微信支付功能异常');
      if (!orderResult.success) {
        console.log('错误阶段: 创建订单');
        console.log('错误信息:', orderResult.message);
      } else if (payResult && !payResult.success) {
        console.log('错误阶段: 获取支付参数');
        console.log('错误信息:', payResult.message);
      }
      console.log('\n请检查:');
      console.log('1. 商户号配置是否正确: 1671050768');
      console.log('2. API v3密钥是否已在商户平台设置');
      console.log('3. 商户证书是否匹配');
      console.log('4. 查看后端日志获取详细错误信息');
    }
    
  } catch (error) {
    console.error('\n❌ 测试过程出错:', error);
  }
}

// 运行测试
main();
