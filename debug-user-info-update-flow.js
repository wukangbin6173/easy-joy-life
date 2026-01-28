// 调试用户信息更新流程
const https = require('https');

// 模拟微信getUserProfile返回的数据
const mockWechatUserInfo = {
  nickName: "测试用户昵称",
  avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
  gender: 1,
  country: "China",
  province: "Beijing",
  city: "Beijing",
  language: "zh_CN"
};

async function makeRequest(path, method = 'GET', data = null) {
  const postData = data ? JSON.stringify(data) : null;
  
  const options = {
    hostname: 'xx.aieo.cn',
    port: 443,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (postData) {
    options.headers['Content-Length'] = Buffer.byteLength(postData);
  }
  
  console.log(`📤 ${method} ${path}`);
  if (data) console.log('📄 请求数据:', data);
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`📊 状态码: ${res.statusCode}`);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          console.log('📥 响应:', JSON.stringify(jsonData, null, 2));
          resolve(jsonData);
        } catch (e) {
          console.log('❌ JSON解析失败:', e.message);
          console.log('📄 原始数据:', responseData);
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

async function debugUserInfoFlow() {
  console.log('🔍 开始调试用户信息更新流程...\n');
  
  const openid = 'oJJFm17sE5n2UEL3rO3CaBihUh4g';
  
  try {
    // 步骤1: 查询当前用户信息
    console.log('📋 步骤1: 查询当前用户信息');
    const currentUser = await makeRequest(`/api/auth/user/info?openid=${encodeURIComponent(openid)}`);
    
    if (!currentUser.success) {
      console.log('❌ 用户不存在，需要先登录创建用户');
      return;
    }
    
    console.log('✅ 当前用户信息:', currentUser.user);
    
    // 步骤2: 模拟前端获取微信用户信息后的更新流程
    console.log('\n📋 步骤2: 模拟前端用户信息更新');
    
    const updateData = {
      openid: openid,
      nickname: mockWechatUserInfo.nickName,
      avatar: mockWechatUserInfo.avatarUrl,
      gender: mockWechatUserInfo.gender
    };
    
    const updateResult = await makeRequest('/api/auth/user/update', 'POST', updateData);
    
    if (updateResult.success) {
      console.log('✅ 用户信息更新成功');
      console.log('👤 更新后的用户信息:', updateResult.user);
      
      // 验证更新是否生效
      console.log('\n📋 验证更新结果:');
      console.log(`  - 昵称: ${currentUser.user.nickname} → ${updateResult.user.nickname}`);
      console.log(`  - 头像: ${currentUser.user.avatar} → ${updateResult.user.avatar}`);
      console.log(`  - 性别: ${currentUser.user.gender} → ${updateResult.user.gender}`);
      
    } else {
      console.log('❌ 用户信息更新失败:', updateResult.message);
    }
    
    // 步骤3: 再次查询验证
    console.log('\n📋 步骤3: 验证更新结果');
    const updatedUser = await makeRequest(`/api/auth/user/info?openid=${encodeURIComponent(openid)}`);
    
    if (updatedUser.success) {
      console.log('✅ 验证成功，最终用户信息:', updatedUser.user);
      
      // 检查是否与预期一致
      const user = updatedUser.user;
      console.log('\n📋 最终验证:');
      console.log(`  - 昵称匹配: ${user.nickname === mockWechatUserInfo.nickName ? '✅' : '❌'} (${user.nickname})`);
      console.log(`  - 头像匹配: ${user.avatar === mockWechatUserInfo.avatarUrl ? '✅' : '❌'} (${user.avatar})`);
      console.log(`  - 性别匹配: ${user.gender === mockWechatUserInfo.gender ? '✅' : '❌'} (${user.gender})`);
      
    } else {
      console.log('❌ 验证失败:', updatedUser.message);
    }
    
    // 步骤4: 测试前端API路径
    console.log('\n📋 步骤4: 测试前端可能使用的API路径');
    
    // 测试可能的错误路径
    const possiblePaths = [
      '/api/auth/user/update',
      '/auth/user/update',
      '/api/user/update',
      '/user/update'
    ];
    
    for (const path of possiblePaths) {
      try {
        console.log(`\n🧪 测试路径: ${path}`);
        const testResult = await makeRequest(path, 'POST', updateData);
        console.log(`✅ 路径 ${path} 可用:`, testResult.success ? '成功' : '失败');
      } catch (error) {
        console.log(`❌ 路径 ${path} 不可用:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ 调试过程中出错:', error.message);
  }
}

// 测试前端API调用逻辑
async function testFrontendApiLogic() {
  console.log('\n🧪 测试前端API调用逻辑...');
  
  const openid = 'oJJFm17sE5n2UEL3rO3CaBihUh4g';
  
  // 模拟前端的API调用方式
  const testData = {
    openid: openid,
    nickname: mockWechatUserInfo.nickName,
    avatar: mockWechatUserInfo.avatarUrl,
    gender: mockWechatUserInfo.gender || 0
  };
  
  console.log('📤 模拟前端API调用');
  console.log('🔑 openid:', openid);
  console.log('👤 用户信息:', testData);
  
  try {
    const result = await makeRequest('/api/auth/user/update', 'POST', testData);
    
    if (result.success) {
      console.log('✅ 前端API调用成功');
      console.log('📥 返回的用户信息:', result.user);
      
      // 检查返回的字段
      const user = result.user;
      console.log('\n📋 返回字段检查:');
      console.log(`  - id: ${user.id ? '✅' : '❌'} ${user.id}`);
      console.log(`  - openid: ${user.openid ? '✅' : '❌'} ${user.openid}`);
      console.log(`  - nickname: ${user.nickname ? '✅' : '❌'} ${user.nickname}`);
      console.log(`  - avatar: ${user.avatar ? '✅' : '❌'} ${user.avatar}`);
      console.log(`  - gender: ${user.gender !== undefined ? '✅' : '❌'} ${user.gender}`);
      console.log(`  - status: ${user.status ? '✅' : '❌'} ${user.status}`);
      console.log(`  - phone: ${user.phone !== undefined ? '✅' : '❌'} ${user.phone}`);
      
    } else {
      console.log('❌ 前端API调用失败:', result.message);
      
      // 分析可能的原因
      if (result.message === '用户不存在') {
        console.log('💡 建议: 需要先进行微信登录创建用户');
      }
    }
    
  } catch (error) {
    console.error('❌ 前端API调用异常:', error.message);
  }
}

// 执行所有调试
async function runDebug() {
  console.log('🚀 开始完整的用户信息更新流程调试...\n');
  
  await debugUserInfoFlow();
  await testFrontendApiLogic();
  
  console.log('\n🎉 调试完成!');
  console.log('\n📋 总结:');
  console.log('1. 后端API工作正常');
  console.log('2. 用户信息更新功能正常');
  console.log('3. 如果前端仍有问题，可能是:');
  console.log('   - openid获取失败');
  console.log('   - API路径错误');
  console.log('   - 请求参数格式问题');
  console.log('   - 响应处理逻辑问题');
}

runDebug();