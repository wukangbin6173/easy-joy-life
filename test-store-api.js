// 测试门店API连接
const https = require('https');

// 配置
const config = {
  hostname: 'xx.aieo.cn',
  port: 443,
  path: '/api/stores',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Node.js Test Client'
  }
};

console.log('🔍 测试门店API连接...');
console.log('📡 请求地址:', `https://${config.hostname}${config.path}`);

const req = https.request(config, (res) => {
  console.log('📊 HTTP状态码:', res.statusCode);
  console.log('📋 响应头:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📥 原始响应数据:', data);
    
    try {
      const jsonData = JSON.parse(data);
      console.log('✅ JSON解析成功');
      console.log('📊 响应格式:', {
        code: jsonData.code,
        message: jsonData.message,
        dataType: Array.isArray(jsonData.data) ? 'array' : typeof jsonData.data,
        dataLength: Array.isArray(jsonData.data) ? jsonData.data.length : 'N/A'
      });
      
      if (jsonData.code === 200 && jsonData.data) {
        console.log('🎉 门店API工作正常');
        console.log('🏪 门店数量:', jsonData.data.length);
        
        if (jsonData.data.length > 0) {
          console.log('📋 第一个门店信息:');
          const firstStore = jsonData.data[0];
          console.log('  - ID:', firstStore.id);
          console.log('  - 名称:', firstStore.name);
          console.log('  - 地址:', firstStore.address);
          console.log('  - 状态:', firstStore.status);
        }
      } else {
        console.log('❌ 门店API返回错误:', jsonData.message);
      }
      
    } catch (e) {
      console.error('❌ JSON解析失败:', e.message);
      console.log('📄 响应内容:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ 请求失败:', e.message);
  
  if (e.code === 'ENOTFOUND') {
    console.log('💡 可能的原因:');
    console.log('  - 域名解析失败');
    console.log('  - 网络连接问题');
  } else if (e.code === 'ECONNREFUSED') {
    console.log('💡 可能的原因:');
    console.log('  - 服务器未启动');
    console.log('  - 端口未开放');
  }
});

req.setTimeout(10000, () => {
  console.error('❌ 请求超时');
  req.destroy();
});

req.end();

console.log('⏳ 等待响应...');