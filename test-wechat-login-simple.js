// 简单测试微信登录API
const https = require('https');

const postData = JSON.stringify({
  code: 'test_code_123'
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

console.log('🔍 测试微信登录API...');
console.log('请求数据:', postData);

const req = https.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('响应数据:', data);
    try {
      const jsonData = JSON.parse(data);
      console.log('解析后的JSON:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log('无法解析为JSON，原始数据:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`请求错误: ${e.message}`);
});

req.write(postData);
req.end();