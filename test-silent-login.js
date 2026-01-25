// 测试静默登录流程
const https = require('https');

const baseUrl = 'https://xx.aieo.cn';

// 模拟微信登录code（实际使用中这个code是微信提供的）
const mockCode = 'test_code_123456';

// 测试微信登录API
function testWechatLogin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      code: mockCode
    });

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

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('微信登录API测试结果:', result);
          resolve(result);
        } catch (e) {
          console.error('解析响应失败:', e);
          console.log('原始响应:', data);
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      console.error('微信登录API请求失败:', err);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// 测试用户信息更新API
function testUserUpdate(openid) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      openid: openid,
      nickname: '测试用户',
      avatar: 'https://example.com/avatar.jpg',
      gender: 1
    });

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

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('用户信息更新API测试结果:', result);
          resolve(result);
        } catch (e) {
          console.error('解析响应失败:', e);
          console.log('原始响应:', data);
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      console.error('用户信息更新API请求失败:', err);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// 运行测试
async function runTests() {
  console.log('开始测试静默登录流程...');
  console.log('目标服务器:', baseUrl);
  
  try {
    console.log('\n=== 测试微信登录API ===');
    const loginResult = await testWechatLogin();
    
    if (loginResult.success && loginResult.openid) {
      console.log('✓ 微信登录成功，openid:', loginResult.openid);
      
      console.log('\n=== 测试用户信息更新API ===');
      const updateResult = await testUserUpdate(loginResult.openid);
      
      if (updateResult.success) {
        console.log('✓ 用户信息更新成功');
      } else {
        console.log('⚠ 用户信息更新失败:', updateResult.message);
      }
    } else {
      console.log('✗ 微信登录失败:', loginResult.message);
    }
    
    console.log('\n=== 测试完成 ===');
    console.log('静默登录流程测试完成');
    
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

runTests();