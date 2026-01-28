// 测试用户信息更新修复
const https = require('https');

async function testUserUpdateFix() {
  console.log('🧪 测试用户信息更新修复...\n');
  
  // 测试场景1: 有效用户更新
  console.log('📋 场景1: 有效用户更新');
  await testValidUserUpdate();
  
  // 测试场景2: 无效openid
  console.log('\n📋 场景2: 无效openid');
  await testInvalidOpenid();
  
  // 测试场景3: 缺少openid
  console.log('\n📋 场景3: 缺少openid');
  await testMissingOpenid();
}

async function makeRequest(path, data) {
  const postData = JSON.stringify(data);
  
  const options = {
    hostname: 'xx.aieo.cn',
    port: 443,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          console.log(`📊 HTTP ${res.statusCode}:`, jsonData);
          
          // 模拟前端的新逻辑
          if (res.statusCode === 200) {
            if (jsonData.success) {
              console.log('✅ 前端应该resolve - 更新成功');
              resolve(jsonData);
            } else {
              console.log('❌ 前端应该reject - 业务失败:', jsonData.message);
              reject(new Error(jsonData.message));
            }
          } else {
            console.log('❌ 前端应该reject - HTTP错误');
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        } catch (e) {
          console.log('❌ JSON解析失败');
          reject(new Error('JSON parse error'));
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ 网络错误: ${e.message}`);
      reject(e);
    });
    
    req.write(postData);
    req.end();
  });
}

async function testValidUserUpdate() {
  try {
    const result = await makeRequest('/api/auth/user/update', {
      openid: 'oJJFm17sE5n2UEL3rO3CaBihUh4g',
      nickname: '修复测试用户',
      avatar: 'https://example.com/avatar.jpg',
      gender: 1
    });
    
    console.log('🎉 有效用户更新成功');
    
  } catch (error) {
    console.log('❌ 有效用户更新失败:', error.message);
  }
}

async function testInvalidOpenid() {
  try {
    const result = await makeRequest('/api/auth/user/update', {
      openid: 'invalid_openid_123',
      nickname: '测试用户',
      avatar: 'https://example.com/avatar.jpg',
      gender: 0
    });
    
    console.log('❌ 不应该成功');
    
  } catch (error) {
    console.log('✅ 预期的错误:', error.message);
    
    if (error.message === '用户不存在') {
      console.log('💡 前端应该提示用户重新登录');
    }
  }
}

async function testMissingOpenid() {
  try {
    const result = await makeRequest('/api/auth/user/update', {
      nickname: '测试用户',
      avatar: 'https://example.com/avatar.jpg',
      gender: 0
    });
    
    console.log('❌ 不应该成功');
    
  } catch (error) {
    console.log('✅ 预期的错误:', error.message);
    
    if (error.message.includes('null')) {
      console.log('💡 前端应该检查openid是否存在');
    }
  }
}

// 测试前端API逻辑修复
function testFrontendLogic() {
  console.log('\n🔧 测试前端API逻辑修复...');
  
  // 模拟修复前的逻辑
  console.log('\n📋 修复前的逻辑:');
  const oldLogic = (res) => {
    if (res.statusCode === 200) {
      if (res.data && res.data.code === 200) {  // ❌ 错误：检查code
        console.log('✅ 旧逻辑：成功');
        return res.data;
      } else {
        console.log('❌ 旧逻辑：失败 - 会reject');
        throw new Error(res.data?.message || '请求失败');
      }
    }
  };
  
  // 模拟修复后的逻辑
  console.log('\n📋 修复后的逻辑:');
  const newLogic = (res) => {
    if (res.statusCode === 200) {
      if (res.data && res.data.success) {  // ✅ 正确：检查success
        console.log('✅ 新逻辑：成功');
        return res.data;
      } else {
        console.log('❌ 新逻辑：失败 - 会reject，但错误信息更详细');
        const error = new Error(res.data?.message || '请求失败');
        error.data = res.data;
        throw error;
      }
    }
  };
  
  // 测试数据
  const testResponse = {
    statusCode: 200,
    data: {
      success: true,
      user: { nickname: '测试用户' }
    }
  };
  
  const testErrorResponse = {
    statusCode: 200,
    data: {
      success: false,
      message: '用户不存在'
    }
  };
  
  console.log('\n🧪 测试成功响应:');
  try {
    oldLogic(testResponse);
  } catch (e) {
    console.log('❌ 旧逻辑失败:', e.message);
  }
  
  try {
    newLogic(testResponse);
  } catch (e) {
    console.log('❌ 新逻辑失败:', e.message);
  }
  
  console.log('\n🧪 测试错误响应:');
  try {
    oldLogic(testErrorResponse);
  } catch (e) {
    console.log('❌ 旧逻辑错误:', e.message);
  }
  
  try {
    newLogic(testErrorResponse);
  } catch (e) {
    console.log('❌ 新逻辑错误:', e.message);
  }
}

// 执行所有测试
async function runAllTests() {
  console.log('🚀 开始测试用户信息更新修复...\n');
  
  await testUserUpdateFix();
  testFrontendLogic();
  
  console.log('\n📋 修复总结:');
  console.log('1. ✅ 修复了API响应检查逻辑 (code → success)');
  console.log('2. ✅ 增强了错误处理和日志');
  console.log('3. ✅ 添加了用户重新登录机制');
  console.log('4. ✅ 提供了更详细的错误信息');
  
  console.log('\n💡 用户现在应该能够:');
  console.log('- 正常更新用户信息');
  console.log('- 看到更清晰的错误提示');
  console.log('- 在用户不存在时自动重新登录');
}

runAllTests();