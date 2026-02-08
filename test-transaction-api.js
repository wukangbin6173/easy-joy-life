/**
 * 测试交易记录API
 * 用于诊断小程序交易记录获取不到数据的问题
 */

const https = require('https');

// 配置
const config = {
  host: 'xx.aieo.cn',
  port: 443,
  userId: 1
};

// 测试不同的API路径
const testPaths = [
  `/payment/transactions/${config.userId}`,           // 小程序当前使用的路径（错误）
  `/api/payment/transactions/${config.userId}`,       // 正确的路径
];

console.log('='.repeat(60));
console.log('交易记录API测试');
console.log('='.repeat(60));

testPaths.forEach((path, index) => {
  setTimeout(() => {
    console.log(`\n测试 ${index + 1}: ${path}`);
    console.log('-'.repeat(60));
    
    const options = {
      hostname: config.host,
      port: config.port,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      rejectUnauthorized: false
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`状态码: ${res.statusCode}`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('响应数据:');
          console.log(JSON.stringify(jsonData, null, 2));
          
          if (jsonData.success && jsonData.transactions) {
            console.log(`✓ 成功获取 ${jsonData.transactions.length} 条交易记录`);
          } else {
            console.log('✗ 未获取到交易记录');
          }
        } catch (e) {
          console.log('响应内容（非JSON）:');
          console.log(data.substring(0, 500));
        }
      });
    });

    req.on('error', (e) => {
      console.error(`✗ 请求失败: ${e.message}`);
    });

    req.end();
  }, index * 1000);
});

console.log('\n等待测试完成...\n');
