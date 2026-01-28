// 调试API返回的业务错误
const https = require('https');

async function debugBusinessError() {
  console.log('🔍 调试API业务错误...\n');
  
  // 测试不同的场景来找出具体的业务错误
  const testCases = [
    {
      name: '正常用户更新',
      data: {
        openid: 'oJJFm17sE5n2UEL3rO3CaBihUh4g',
        nickname: '调试用户',
        avatar: 'https://example.com/avatar.jpg',
        gender: 1
      }
    },
    {
      name: '空openid',
      data: {
        openid: '',
        nickname: '测试用户',
        avatar: 'https://example.com/avatar.jpg',
        gender: 0
      }
    },
    {
      name: '无效openid',
      data: {
        openid: 'invalid_openid_123',
        nickname: '测试用户',
        avatar: 'https://example.com/avatar.jpg',
        gender: 0
      }
    },
    {
      name: '缺少openid',
      data: {
        nickname: '测试用户',
        avatar: 'https://example.com/avatar.jpg',
        gender: 0
      }
    },
    {
      name: '空昵称',
      data: {
        openid: 'oJJFm17sE5n2UEL3rO3CaBihUh4g',
        nickname: '',
        avatar: 'https://example.com/avatar.jpg',
        gender: 0
      }
    },
    {
      name: '缺少昵称',
      data: {
        openid: 'oJJFm17sE5n2UEL3rO3CaBihUh4g',
        avatar: 'https://example.com/avatar.jpg',
        gender: 0
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📋 测试场景: ${testCase.name}`);
    console.log('📤 请求数据:', testCase.data);
    
    try {
      const result = await makeRequest('/api/auth/user/update', testCase.data);
      console.log('✅ 成功:', result);
    } catch (error) {
      console.log('❌ 业务错误:', error.message);
      console.log('📄 错误详情:', error.data || 'N/A');
    }
  }
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
          
          if (res.statusCode === 200) {
            if (jsonData.success) {
              resolve(jsonData);
            } else {
              const error = new Error(jsonData.message || '未知业务错误');
              error.data = jsonData;
              reject(error);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        } catch (e) {
          reject(new Error('JSON解析失败'));
        }
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.write(postData);
    req.end();
  });
}

// 检查用户是否存在
async function checkUserExists() {
  console.log('\n🔍 检查用户是否存在...');
  
  const openid = 'oJJFm17sE5n2UEL3rO3CaBihUh4g';
  
  try {
    const result = await makeRequest('/api/auth/user/info?openid=' + encodeURIComponent(openid), null);
    console.log('✅ 用户存在:', result.user);
    return true;
  } catch (error) {
    console.log('❌ 用户不存在或查询失败:', error.message);
    return false;
  }
}

// 检查微信登录状态
async function checkWechatLogin() {
  console.log('\n🔍 检查微信登录状态...');
  
  try {
    const result = await makeRequest('/api/auth/wechat/login', {
      code: 'test_code_for_debug'
    });
    
    console.log('📥 微信登录响应:', result);
    
    if (result.success) {
      console.log('✅ 微信登录成功，用户已存在');
    } else {
      console.log('⚠️ 微信登录失败（预期的，因为使用测试code）:', result.message);
    }
  } catch (error) {
    console.log('❌ 微信登录请求失败:', error.message);
  }
}

// 主函数
async function main() {
  console.log('🚀 开始调试API业务错误...\n');
  
  // 1. 检查用户是否存在
  const userExists = await checkUserExists();
  
  // 2. 检查微信登录
  await checkWechatLogin();
  
  // 3. 测试各种更新场景
  await debugBusinessError();
  
  console.log('\n📋 调试总结:');
  console.log('1. 检查用户是否在数据库中存在');
  console.log('2. 验证openid是否有效');
  console.log('3. 确认请求数据格式是否正确');
  console.log('4. 查看具体的业务错误信息');
  
  console.log('\n💡 常见业务错误原因:');
  console.log('- "用户不存在": openid在数据库中找不到');
  console.log('- "更新失败: null": openid为空或null');
  console.log('- "参数错误": 请求数据格式不正确');
  console.log('- "数据库错误": 后端数据库连接或操作失败');
}

main();