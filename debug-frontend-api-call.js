// 模拟前端API调用来调试问题
const https = require('https');

// 模拟微信小程序的wx.request
function mockWxRequest(options) {
  console.log('🔍 模拟wx.request调用...');
  console.log('📋 请求配置:', JSON.stringify(options, null, 2));
  
  const url = new URL(options.url);
  
  const requestOptions = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: options.method || 'GET',
    headers: options.header || {}
  };
  
  const postData = options.data ? JSON.stringify(options.data) : null;
  if (postData) {
    requestOptions.headers['Content-Length'] = Buffer.byteLength(postData);
  }
  
  console.log('🌐 实际HTTP请求配置:', requestOptions);
  console.log('📤 请求数据:', postData);
  
  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      console.log(`📊 HTTP状态码: ${res.statusCode}`);
      console.log('📋 响应头:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📥 原始响应:', data);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ JSON解析成功');
          
          // 模拟wx.request的success回调
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
          
          // 模拟wx.request的fail回调
          if (options.fail) {
            options.fail({
              errMsg: 'request:fail json parse error',
              statusCode: res.statusCode,
              data: data
            });
          }
          
          reject(new Error('JSON parse error'));
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ 网络错误: ${e.message}`);
      
      // 模拟wx.request的fail回调
      if (options.fail) {
        options.fail({
          errMsg: `request:fail ${e.message}`,
          error: e
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

// 模拟前端API模块的request函数
function mockApiRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    // 模拟获取配置
    const baseUrl = 'https://xx.aieo.cn';
    const fullUrl = baseUrl + url;
    
    console.log('📤 API请求:', fullUrl);
    console.log('📋 请求参数:', options);
    
    const requestOptions = {
      url: fullUrl,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        console.log('📥 wx.request success回调:', res);
        
        // 检查HTTP状态码
        if (res.statusCode === 200) {
          // 对于微信登录API，即使业务逻辑失败也应该resolve，让调用方处理
          if (url.includes('/auth/wechat/login') || url.includes('/auth/wechat/test')) {
            console.log('🔄 微信登录API，直接返回数据');
            resolve(res.data);
          } else if (res.data && res.data.success) {
            console.log('✅ 业务逻辑成功');
            resolve(res.data);
          } else {
            console.error('❌ 业务逻辑失败:', res.data);
            console.error('🚨 这里会reject，导致catch被调用');
            reject(new Error(res.data?.message || '请求失败'));
          }
        } else {
          console.error('❌ HTTP状态码错误:', res.statusCode, res.data);
          reject(new Error(`HTTP ${res.statusCode}: ${res.data?.message || '请求失败'}`));
        }
      },
      fail: (err) => {
        console.error('❌ wx.request fail回调:', err);
        reject(err);
      }
    };

    // 模拟wx.request调用
    mockWxRequest(requestOptions);
  });
}

// 模拟app.js中的updateUserInfoToBackend调用
async function simulateFrontendCall() {
  console.log('🎭 模拟前端用户信息更新调用...\n');
  
  // 模拟全局数据
  const mockGlobalData = {
    openid: 'oJJFm17sE5n2UEL3rO3CaBihUh4g'
  };
  
  const mockUserInfo = {
    nickname: '前端模拟用户',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    gender: 1
  };
  
  console.log('🔑 模拟openid:', mockGlobalData.openid);
  console.log('👤 模拟用户信息:', mockUserInfo);
  
  try {
    console.log('\n📤 开始调用API...');
    
    const result = await mockApiRequest('/api/auth/user/update', {
      method: 'POST',
      data: {
        openid: mockGlobalData.openid,
        nickname: mockUserInfo.nickname,
        avatar: mockUserInfo.avatar,
        gender: mockUserInfo.gender || 0
      }
    });
    
    console.log('\n✅ API调用成功:', result);
    
  } catch (error) {
    console.log('\n❌ API调用失败 - 这就是用户看到的错误!');
    console.log('🚨 错误信息:', error.message);
    console.log('📄 错误详情:', error);
    
    console.log('\n💡 分析:');
    console.log('- 后端API实际上是工作的');
    console.log('- 问题在于前端的错误处理逻辑');
    console.log('- 当后端返回success:false时，前端会reject');
    console.log('- 这导致用户看到"请求失败"的错误');
  }
}

// 测试不同的场景
async function testDifferentScenarios() {
  console.log('🧪 测试不同场景...\n');
  
  // 场景1: 正常的用户更新
  console.log('📋 场景1: 正常用户更新');
  await simulateFrontendCall();
  
  // 场景2: 无效的openid
  console.log('\n' + '='.repeat(50));
  console.log('📋 场景2: 无效openid');
  try {
    await mockApiRequest('/api/auth/user/update', {
      method: 'POST',
      data: {
        openid: 'invalid_openid',
        nickname: '测试用户',
        avatar: '/images/default-avatar.png',
        gender: 0
      }
    });
  } catch (error) {
    console.log('❌ 预期的错误:', error.message);
  }
  
  // 场景3: 缺少openid
  console.log('\n' + '='.repeat(50));
  console.log('📋 场景3: 缺少openid');
  try {
    await mockApiRequest('/api/auth/user/update', {
      method: 'POST',
      data: {
        nickname: '测试用户',
        avatar: '/images/default-avatar.png',
        gender: 0
      }
    });
  } catch (error) {
    console.log('❌ 预期的错误:', error.message);
  }
}

// 执行测试
testDifferentScenarios();