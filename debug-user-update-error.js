// 调试用户信息更新失败问题
const https = require('https');

async function testUserUpdateAPI() {
  console.log('🔍 调试用户信息更新失败问题...\n');
  
  const openid = 'oJJFm17sE5n2UEL3rO3CaBihUh4g';
  
  // 测试数据
  const testData = {
    openid: openid,
    nickname: '调试测试用户',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    gender: 1
  };
  
  console.log('📤 测试数据:', testData);
  
  const postData = JSON.stringify(testData);
  
  const options = {
    hostname: 'xx.aieo.cn',
    port: 443,
    path: '/api/auth/user/update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'Mozilla/5.0 (compatible; MiniProgram/1.0)'
    }
  };
  
  console.log('🌐 请求配置:', {
    url: `https://${options.hostname}${options.path}`,
    method: options.method,
    headers: options.headers
  });
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`📊 HTTP状态码: ${res.statusCode}`);
      console.log('📋 响应头:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📥 原始响应数据:', data);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ JSON解析成功:', JSON.stringify(jsonData, null, 2));
          
          if (res.statusCode === 200) {
            if (jsonData.success) {
              console.log('🎉 用户信息更新成功!');
              console.log('👤 更新后的用户信息:', jsonData.user);
            } else {
              console.log('⚠️ 业务逻辑失败:', jsonData.message);
            }
          } else {
            console.log('❌ HTTP状态码错误');
          }
          
          resolve(jsonData);
        } catch (e) {
          console.log('❌ JSON解析失败:', e.message);
          console.log('📄 尝试解析的数据:', data);
          
          // 检查是否是HTML错误页面
          if (data.includes('<html>') || data.includes('<!DOCTYPE')) {
            console.log('🚨 服务器返回了HTML页面，可能是错误页面或重定向');
          }
          
          reject(new Error('JSON parse error: ' + e.message));
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ 网络请求错误: ${e.message}`);
      console.error('🔍 错误详情:', e);
      reject(e);
    });
    
    req.on('timeout', () => {
      console.error('⏰ 请求超时');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    // 设置超时
    req.setTimeout(10000);
    
    console.log('📤 发送请求数据...');
    req.write(postData);
    req.end();
  });
}

// 测试服务器连通性
async function testServerConnectivity() {
  console.log('🌐 测试服务器连通性...\n');
  
  const options = {
    hostname: 'xx.aieo.cn',
    port: 443,
    path: '/',
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MiniProgram/1.0)'
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`📊 服务器响应状态: ${res.statusCode}`);
      console.log('📋 服务器响应头:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📥 服务器响应长度:', data.length, '字符');
        console.log('📄 响应内容预览:', data.substring(0, 200) + '...');
        
        if (res.statusCode === 200) {
          console.log('✅ 服务器连通性正常');
        } else {
          console.log('⚠️ 服务器返回非200状态码');
        }
        
        resolve(res.statusCode);
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ 服务器连接失败: ${e.message}`);
      reject(e);
    });
    
    req.setTimeout(5000);
    req.end();
  });
}

// 测试具体的API端点
async function testAPIEndpoint() {
  console.log('🔗 测试API端点可用性...\n');
  
  const options = {
    hostname: 'xx.aieo.cn',
    port: 443,
    path: '/api/auth/user/info?openid=test',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; MiniProgram/1.0)'
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`📊 API端点状态: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📥 API响应:', data);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ API端点正常，返回JSON格式');
          resolve(jsonData);
        } catch (e) {
          console.log('⚠️ API端点返回非JSON格式');
          console.log('📄 原始响应:', data.substring(0, 500));
          resolve(null);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ API端点测试失败: ${e.message}`);
      reject(e);
    });
    
    req.setTimeout(5000);
    req.end();
  });
}

// 执行所有测试
async function runDiagnostics() {
  console.log('🚀 开始诊断用户信息更新失败问题...\n');
  
  try {
    // 1. 测试服务器连通性
    console.log('='.repeat(50));
    console.log('📋 步骤1: 测试服务器连通性');
    console.log('='.repeat(50));
    await testServerConnectivity();
    
    // 2. 测试API端点
    console.log('\n' + '='.repeat(50));
    console.log('📋 步骤2: 测试API端点');
    console.log('='.repeat(50));
    await testAPIEndpoint();
    
    // 3. 测试用户更新API
    console.log('\n' + '='.repeat(50));
    console.log('📋 步骤3: 测试用户更新API');
    console.log('='.repeat(50));
    await testUserUpdateAPI();
    
    console.log('\n🎉 诊断完成!');
    
  } catch (error) {
    console.error('\n❌ 诊断过程中出错:', error.message);
    console.error('🔍 错误详情:', error);
    
    console.log('\n💡 可能的解决方案:');
    console.log('1. 检查服务器是否正常运行');
    console.log('2. 检查网络连接');
    console.log('3. 检查API路径是否正确');
    console.log('4. 检查请求格式是否正确');
    console.log('5. 查看服务器日志');
  }
}

runDiagnostics();