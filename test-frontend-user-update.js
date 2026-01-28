// 测试前端用户信息更新流程
const https = require('https');

async function testFrontendUserUpdate() {
  console.log('🧪 测试前端用户信息更新流程...');
  
  // 模拟前端发送的用户信息更新请求
  const testData = {
    openid: 'oJJFm17sE5n2UEL3rO3CaBihUh4g',
    nickname: '前端测试用户',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
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
  
  console.log('📤 模拟前端请求:', `https://${options.hostname}${options.path}`);
  console.log('📄 请求数据:', testData);
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`📊 状态码: ${res.statusCode}`);
      console.log('📋 响应头:', res.headers);
      
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
              
              // 验证字段是否正确更新
              const user = jsonData.user;
              console.log('\n📋 字段验证:');
              console.log(`  - openid: ${user.openid === testData.openid ? '✅' : '❌'} ${user.openid}`);
              console.log(`  - nickname: ${user.nickname === testData.nickname ? '✅' : '❌'} ${user.nickname}`);
              console.log(`  - avatar: ${user.avatar === testData.avatar ? '✅' : '❌'} ${user.avatar}`);
              console.log(`  - gender: ${user.gender === testData.gender ? '✅' : '❌'} ${user.gender}`);
              console.log(`  - id: ${user.id ? '✅' : '❌'} ${user.id}`);
              console.log(`  - status: ${user.status ? '✅' : '❌'} ${user.status}`);
              
            } else {
              console.log('❌ 业务逻辑失败:', jsonData.message);
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

// 测试微信登录API
async function testWechatLogin() {
  console.log('\n🧪 测试微信登录API...');
  
  const testData = {
    code: 'test_code_123'
  };
  
  const postData = JSON.stringify(testData);
  
  const options = {
    hostname: 'xx.aieo.cn',
    port: 443,
    path: '/api/auth/wechat/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  console.log('📤 测试微信登录:', `https://${options.hostname}${options.path}`);
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
          
          if (jsonData.success) {
            console.log('🎉 微信登录成功!');
          } else {
            console.log('⚠️ 微信登录失败 (这是正常的，因为使用了测试code):', jsonData.message);
            console.log('错误码:', jsonData.errcode);
          }
          
          resolve(jsonData);
        } catch (e) {
          console.log('❌ JSON解析失败:', e.message);
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

// 执行测试
async function runTests() {
  try {
    console.log('🚀 开始测试前端用户更新流程...\n');
    
    // 测试用户信息更新
    console.log('📋 步骤1: 测试用户信息更新API');
    await testFrontendUserUpdate();
    
    // 测试微信登录
    console.log('\n📋 步骤2: 测试微信登录API');
    await testWechatLogin();
    
    console.log('\n🎉 所有测试完成!');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

runTests();