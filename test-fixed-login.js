// 测试修复后的登录逻辑
console.log('🧪 测试修复后的登录逻辑...');

// 模拟修复后的API请求函数
function fixedRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const urlParse = require('url');
    
    const fullUrl = 'https://xx.aieo.cn' + url;
    const parsedUrl = urlParse.parse(fullUrl);
    
    const postData = options.data ? JSON.stringify(options.data) : '';
    
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.header
      }
    };
    
    if (postData) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    console.log('📤 发起请求:', fullUrl);
    
    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('📥 API响应:', jsonData);
          
          // 模拟修复后的success回调逻辑
          console.log('📊 HTTP状态码:', res.statusCode);
          
          if (res.statusCode === 200) {
            // 对于微信登录API，即使业务逻辑失败也应该resolve
            if (url.includes('/auth/wechat/login') || url.includes('/auth/wechat/test')) {
              console.log('✅ 微信登录API - 返回响应数据供调用方处理');
              resolve(jsonData);
            } else if (jsonData && jsonData.code === 200) {
              console.log('✅ 其他API - 业务逻辑成功');
              resolve(jsonData);
            } else {
              console.log('❌ 其他API - 业务逻辑失败');
              reject(new Error(jsonData?.message || '请求失败'));
            }
          } else {
            console.log('❌ HTTP状态码错误');
            reject(new Error(`HTTP ${res.statusCode}: ${jsonData?.message || '请求失败'}`));
          }
        } catch (e) {
          console.log('❌ JSON解析失败');
          reject(new Error('JSON parse error'));
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ 请求错误: ${e.message}`);
      reject(e);
    });
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

// 模拟修复后的登录处理逻辑
function handleWechatLoginResponse(res) {
  console.log('\n🔄 处理微信登录响应...');
  console.log('📄 响应数据:', res);
  
  // 检查是否成功获取到openid
  if (res.success && res.openid) {
    console.log('✅ 登录成功！');
    console.log('🔑 OpenID:', res.openid);
    console.log('👤 用户信息:', res.user);
    return true;
  } else {
    // 登录失败，但不是网络错误
    console.log('⚠️ 微信登录失败:', res.message || res.errmsg);
    console.log('📋 错误码:', res.errcode);
    
    if (res.errcode === '40029') {
      console.log('💡 这是正常的，code已过期或无效');
      console.log('🔧 建议：在真实环境中，这里会设置默认用户信息');
    }
    
    return false;
  }
}

// 执行测试
async function runTest() {
  try {
    console.log('🚀 开始测试修复后的登录流程...\n');
    
    // 测试1: 微信登录API
    console.log('📱 测试1: 微信登录API');
    const loginResponse = await fixedRequest('/api/auth/wechat/login', {
      method: 'POST',
      data: { code: 'test_code_123' }
    });
    
    const loginSuccess = handleWechatLoginResponse(loginResponse);
    
    // 测试2: 普通API（对比）
    console.log('\n🏪 测试2: 普通API（门店列表）');
    const storeResponse = await fixedRequest('/api/stores');
    console.log('✅ 门店API成功，返回', storeResponse.data.length, '个门店');
    
    console.log('\n📋 测试总结:');
    console.log('- 微信登录API:', loginSuccess ? '✅ 成功' : '⚠️ 失败但正常处理');
    console.log('- 普通API:', '✅ 成功');
    console.log('- 修复效果:', '✅ API不再抛出异常，能正常处理响应');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

runTest();