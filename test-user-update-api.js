// 测试用户信息更新API
const https = require('https');

async function testUserUpdateAPI() {
  console.log('🧪 测试用户信息更新API...');
  
  // 测试数据
  const testData = {
    openid: 'test_openid_123',
    nickname: '测试用户',
    avatar: 'https://example.com/avatar.jpg',
    gender: 1
  };
  
  const postData = JSON.stringify(testData);
  
  const options = {
    hostname: 'xx.aieo.cn',
    port: 443,
    path: '/api/auth/user/update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  console.log('📤 发起请求:', `https://${options.hostname}${options.path}`);
  console.log('📄 请求数据:', testData);
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`📊 状态码: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📥 原始响应:', data);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ JSON解析成功:', JSON.stringify(jsonData, null, 2));
          
          if (res.statusCode === 200) {
            if (jsonData.success) {
              console.log('🎉 用户信息更新成功!');
              console.log('👤 更新后的用户信息:', jsonData.user);
            } else {
              console.log('⚠️ 业务逻辑失败:', jsonData.message);
              if (jsonData.message === '用户不存在') {
                console.log('💡 这是正常的，因为使用的是测试openid');
              }
            }
          } else {
            console.log('❌ HTTP状态码错误');
          }
          
          resolve(jsonData);
        } catch (e) {
          console.log('❌ JSON解析失败:', e.message);
          console.log('📄 原始数据:', data);
          reject(new Error('JSON parse error'));
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ 请求错误: ${e.message}`);
      reject(e);
    });
    
    req.write(postData);
    req.end();
  });
}

// 测试API路径是否存在
async function testAPIPath() {
  console.log('\n🔍 测试API路径是否存在...');
  
  const options = {
    hostname: 'xx.aieo.cn',
    port: 443,
    path: '/api/auth/user/update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': 2
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`📊 状态码: ${res.statusCode}`);
      
      if (res.statusCode === 404) {
        console.log('❌ API路径不存在 (404)');
      } else if (res.statusCode === 400) {
        console.log('✅ API路径存在，但请求参数有问题 (400)');
      } else if (res.statusCode === 200) {
        console.log('✅ API路径存在且可访问 (200)');
      } else {
        console.log(`⚠️ 其他状态码: ${res.statusCode}`);
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📥 响应:', data.substring(0, 200));
        resolve(res.statusCode);
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ 请求错误: ${e.message}`);
      reject(e);
    });
    
    req.write('{}');
    req.end();
  });
}

// 执行测试
async function runTests() {
  try {
    await testAPIPath();
    await testUserUpdateAPI();
    
    console.log('\n📋 测试总结:');
    console.log('1. 如果API路径存在，说明后端接口正常');
    console.log('2. 如果返回"用户不存在"，说明API逻辑正常，只是测试数据问题');
    console.log('3. 如果有其他错误，需要检查具体的错误信息');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

runTests();