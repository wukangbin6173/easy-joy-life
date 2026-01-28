// 使用真实用户数据测试更新API
const https = require('https');

async function testRealUserUpdate() {
  console.log('🧪 使用真实用户数据测试更新API...');
  
  // 使用数据库中实际存在的openid
  const realOpenid = 'oJJFm17sE5n2UEL3rO3CaBihUh4g';
  
  const testData = {
    openid: realOpenid,
    nickname: '更新后的用户名',
    avatar: 'https://example.com/new-avatar.jpg',
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
              
              // 验证更新是否生效
              if (jsonData.user.nickname === testData.nickname) {
                console.log('✅ 昵称更新成功');
              }
              if (jsonData.user.avatar === testData.avatar) {
                console.log('✅ 头像更新成功');
              }
              if (jsonData.user.gender === testData.gender) {
                console.log('✅ 性别更新成功');
              }
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

// 查询更新后的用户信息
async function checkUpdatedUser() {
  console.log('\n🔍 查询更新后的用户信息...');
  
  const realOpenid = 'oJJFm17sE5n2UEL3rO3CaBihUh4g';
  
  const options = {
    hostname: 'xx.aieo.cn',
    port: 443,
    path: `/api/auth/user/info?openid=${encodeURIComponent(realOpenid)}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  console.log('📤 查询用户信息:', `https://${options.hostname}${options.path}`);
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`📊 状态码: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('📥 用户信息查询结果:', JSON.stringify(jsonData, null, 2));
          
          if (jsonData.success && jsonData.user) {
            console.log('✅ 用户信息查询成功');
            console.log('👤 当前用户信息:');
            console.log('  - ID:', jsonData.user.id);
            console.log('  - OpenID:', jsonData.user.openid);
            console.log('  - 昵称:', jsonData.user.nickname);
            console.log('  - 头像:', jsonData.user.avatar);
            console.log('  - 性别:', jsonData.user.gender);
            console.log('  - 状态:', jsonData.user.status);
          } else {
            console.log('❌ 用户信息查询失败:', jsonData.message);
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
    
    req.end();
  });
}

// 执行测试
async function runTests() {
  try {
    console.log('🚀 开始测试真实用户更新功能...\n');
    
    // 先查询当前用户信息
    console.log('📋 步骤1: 查询更新前的用户信息');
    await checkUpdatedUser();
    
    // 执行更新
    console.log('\n📋 步骤2: 执行用户信息更新');
    await testRealUserUpdate();
    
    // 再次查询验证更新结果
    console.log('\n📋 步骤3: 验证更新结果');
    await checkUpdatedUser();
    
    console.log('\n🎉 测试完成!');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

runTests();