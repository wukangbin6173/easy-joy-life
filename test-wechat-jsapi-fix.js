// 测试微信JSAPI支付修复
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
        'User-Agent': 'WeChat-JSAPI-Fix-Test/1.0'
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

async function testWechatJSAPIFix() {
  console.log('🚀 测试微信JSAPI支付修复...\n');

  try {
    // 步骤1: 创建充值订单
    console.log('📋 步骤1: 创建充值订单');
    const orderData = {
      userId: 1,
      amount: 1.00,  // 测试最小金额
      paymentMethod: 'WECHAT'
    };
    
    const orderResult = await testAPI('/api/payment/recharge/create', 'POST', orderData);
    console.log(`   状态码: ${orderResult.statusCode}`);
    
    if (orderResult.statusCode === 200 && orderResult.json?.success) {
      console.log('   ✅ 订单创建成功');
      console.log(`   📋 订单号: ${orderResult.json.orderNo}`);
      
      // 步骤2: 测试微信支付
      console.log('\n📱 步骤2: 测试微信JSAPI支付');
      const paymentData = {
        orderNo: orderResult.json.orderNo,
        openid: 'test_openid_jsapi_fix'
      };
      
      const payResult = await testAPI('/api/payment/wechat/pay', 'POST', paymentData);
      console.log(`   状态码: ${payResult.statusCode}`);
      
      if (payResult.statusCode === 200 && payResult.json?.success) {
        console.log('   🎉 微信JSAPI支付修复成功！');
        console.log('   ✅ 支付参数生成正常');
        
        const payParams = payResult.json.payParams;
        console.log('   📱 支付参数:');
        console.log(`      timeStamp: ${payParams.timeStamp}`);
        console.log(`      nonceStr: ${payParams.nonceStr}`);
        console.log(`      package: ${payParams.package}`);
        console.log(`      signType: ${payParams.signType}`);
        console.log(`      paySign: ${payParams.paySign ? '已生成' : '未生成'}`);
        
        // 验证参数完整性
        const requiredParams = ['timeStamp', 'nonceStr', 'package', 'signType', 'paySign'];
        const missingParams = requiredParams.filter(param => !payParams[param]);
        
        if (missingParams.length === 0) {
          console.log('   ✅ 所有必需参数都已生成');
          console.log('   ✅ total_fee参数错误已修复');
        } else {
          console.log(`   ❌ 缺少参数: ${missingParams.join(', ')}`);
        }
        
      } else {
        console.log('   ❌ 微信支付仍然失败');
        if (payResult.json?.message) {
          console.log(`   错误信息: ${payResult.json.message}`);
          
          // 分析错误类型
          const errorMsg = payResult.json.message.toLowerCase();
          if (errorMsg.includes('total_fee')) {
            console.log('   🔍 仍然存在total_fee参数错误');
            console.log('   💡 建议: 检查SDK版本和导入的类');
          } else if (errorMsg.includes('null')) {
            console.log('   🔍 SDK返回null，可能是配置问题');
            console.log('   💡 建议: 检查微信支付配置和证书');
          } else if (errorMsg.includes('初始化')) {
            console.log('   🔍 微信支付服务初始化失败');
            console.log('   💡 建议: 检查后端启动日志');
          }
        }
      }
      
    } else {
      console.log('   ❌ 订单创建失败，无法测试支付');
      if (orderResult.json?.message) {
        console.log(`   错误信息: ${orderResult.json.message}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ 测试过程异常: ${error.message}`);
  }

  console.log('\n📝 修复说明:');
  console.log('1. 更新微信支付SDK到最新版本 (0.2.17)');
  console.log('2. 增强参数验证和错误处理');
  console.log('3. 修复total_fee参数问题 (使用amount.total)');
  console.log('4. 添加详细的日志输出');
  
  console.log('\n🔧 如果仍有问题，请检查:');
  console.log('- 后端服务是否重新编译部署');
  console.log('- 微信支付配置是否正确');
  console.log('- 证书文件是否存在且有效');
  console.log('- 后端启动日志中的错误信息');
}

// 运行测试
testWechatJSAPIFix().catch(console.error);