// 调试小程序登录问题
console.log('🔍 开始调试小程序登录问题...');

// 模拟小程序的wx.request
function mockWxRequest(options) {
  const https = require('https');
  const url = require('url');
  
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(options.url);
    
    const postData = options.data ? JSON.stringify(options.data) : '';
    
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.0(0x18000029) NetType/WIFI Language/zh_CN',
        ...options.header
      }
    };
    
    if (postData) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    console.log('📤 发起请求:', options.url);
    console.log('📋 请求配置:', JSON.stringify(requestOptions, null, 2));
    console.log('📄 请求数据:', postData);
    
    const req = https.request(requestOptions, (res) => {
      console.log(`📊 状态码: ${res.statusCode}`);
      console.log(`📋 响应头:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📥 原始响应:', data);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ JSON解析成功:', JSON.stringify(jsonData, null, 2));
          
          // 模拟小程序的success回调
          if (options.success) {
            options.success({
              statusCode: res.statusCode,
              data: jsonData,
              header: res.headers
            });
          }
          resolve(jsonData);
        } catch (e) {
          console.log('❌ JSON解析失败:', e.message);
          console.log('📄 原始数据:', data);
          
          // 模拟小程序的fail回调
          if (options.fail) {
            options.fail({
              errMsg: 'JSON parse error',
              statusCode: res.statusCode,
              data: data
            });
          }
          reject(new Error('JSON parse error'));
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ 请求错误: ${e.message}`);
      if (options.fail) {
        options.fail({
          errMsg: e.message
        });
      }
      reject(e);
    });
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

// 测试1: 基本连通性测试
async function testBasicConnectivity() {
  console.log('\n🧪 测试1: 基本连通性测试');
  try {
    await mockWxRequest({
      url: 'https://xx.aieo.cn/api/stores',
      method: 'GET',
      success: (res) => {
        console.log('✅ 基本连通性测试成功');
      },
      fail: (err) => {
        console.log('❌ 基本连通性测试失败:', err);
      }
    });
  } catch (error) {
    console.log('❌ 基本连通性测试异常:', error.message);
  }
}

// 测试2: 微信登录API测试
async function testWechatLogin() {
  console.log('\n🧪 测试2: 微信登录API测试');
  try {
    await mockWxRequest({
      url: 'https://xx.aieo.cn/api/auth/wechat/login',
      method: 'POST',
      data: { code: 'test_code_from_miniprogram' },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log('✅ 微信登录API测试成功');
        if (res.data && res.data.success === false && res.data.errcode === '40029') {
          console.log('✅ API正常工作，返回预期的"invalid code"错误');
        }
      },
      fail: (err) => {
        console.log('❌ 微信登录API测试失败:', err);
      }
    });
  } catch (error) {
    console.log('❌ 微信登录API测试异常:', error.message);
  }
}

// 测试3: 模拟真实的小程序请求流程
async function testRealMiniProgramFlow() {
  console.log('\n🧪 测试3: 模拟真实小程序请求流程');
  
  // 模拟wx.login获取code的过程
  const mockCode = 'mock_wx_login_code_' + Date.now();
  console.log('📱 模拟wx.login获取code:', mockCode);
  
  try {
    await mockWxRequest({
      url: 'https://xx.aieo.cn/api/auth/wechat/login',
      method: 'POST',
      data: { code: mockCode },
      header: {
        'Content-Type': 'application/json',
        'User-Agent': 'MiniProgram'
      },
      success: (res) => {
        console.log('✅ 真实流程测试 - success回调被调用');
        console.log('📊 响应状态:', res.statusCode);
        console.log('📄 响应数据:', res.data);
        
        if (res.data && res.data.code === 200) {
          console.log('🎉 登录成功！');
        } else if (res.data && res.data.success === false) {
          console.log('⚠️ 登录失败，但API正常响应:', res.data.message);
        }
      },
      fail: (err) => {
        console.log('❌ 真实流程测试 - fail回调被调用');
        console.log('📄 错误信息:', err);
      }
    });
  } catch (error) {
    console.log('❌ 真实流程测试异常:', error.message);
  }
}

// 执行所有测试
async function runAllTests() {
  await testBasicConnectivity();
  await testWechatLogin();
  await testRealMiniProgramFlow();
  
  console.log('\n📋 测试总结:');
  console.log('1. 如果基本连通性测试成功，说明网络和域名没问题');
  console.log('2. 如果微信登录API返回"invalid code"错误，说明API正常工作');
  console.log('3. 如果所有测试都成功，问题可能在小程序端的代码逻辑');
  console.log('\n💡 建议检查:');
  console.log('- 小程序开发者工具的网络面板');
  console.log('- 小程序的错误日志');
  console.log('- wx.login是否成功获取到code');
}

runAllTests();