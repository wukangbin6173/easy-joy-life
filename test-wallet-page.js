/**
 * 测试钱包页面API
 * 验证钱包信息和交易记录是否能正常获取
 */

const https = require('https');

// 配置
const config = {
  host: 'xx.aieo.cn',
  port: 443,
  userId: 1
};

console.log('='.repeat(60));
console.log('钱包页面API测试');
console.log('='.repeat(60));

// 测试1: 获取钱包信息
console.log('\n测试 1: 获取钱包信息');
console.log('-'.repeat(60));

const walletOptions = {
  hostname: config.host,
  port: config.port,
  path: `/api/payment/wallet/${config.userId}`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  rejectUnauthorized: false
};

const walletReq = https.request(walletOptions, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`状态码: ${res.statusCode}`);
    
    try {
      const jsonData = JSON.parse(data);
      console.log('钱包信息:');
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (jsonData.success && jsonData.wallet) {
        console.log(`✓ 余额: ¥${jsonData.wallet.balance}`);
        console.log(`✓ 累计充值: ¥${jsonData.wallet.totalRecharge}`);
      } else {
        console.log('✗ 未获取到钱包信息');
      }
    } catch (e) {
      console.log('响应内容（非JSON）:');
      console.log(data.substring(0, 500));
    }
    
    // 测试2: 获取交易记录
    setTimeout(() => {
      console.log('\n测试 2: 获取交易记录（最近5条）');
      console.log('-'.repeat(60));
      
      const transOptions = {
        hostname: config.host,
        port: config.port,
        path: `/api/payment/transactions/${config.userId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        rejectUnauthorized: false
      };

      const transReq = https.request(transOptions, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.log(`状态码: ${res.statusCode}`);
          
          try {
            const jsonData = JSON.parse(data);
            
            if (jsonData.success && jsonData.transactions) {
              console.log(`✓ 成功获取 ${jsonData.transactions.length} 条交易记录`);
              
              // 显示最近5条
              const recentTransactions = jsonData.transactions.slice(0, 5);
              console.log('\n最近交易记录:');
              recentTransactions.forEach((tx, index) => {
                const type = (tx.transactionType === 'RECHARGE' || tx.transactionType === 'REFUND') ? '收入' : '支出';
                const time = tx.createdTime.substring(0, 16).replace('T', ' ');
                console.log(`  ${index + 1}. [${type}] ${tx.description} - ¥${Math.abs(tx.amount)} (${time})`);
              });
            } else {
              console.log('✗ 未获取到交易记录');
              console.log('响应数据:', JSON.stringify(jsonData, null, 2));
            }
          } catch (e) {
            console.log('响应内容（非JSON）:');
            console.log(data.substring(0, 500));
          }
          
          console.log('\n' + '='.repeat(60));
          console.log('测试完成');
          console.log('='.repeat(60));
        });
      });

      transReq.on('error', (e) => {
        console.error(`✗ 请求失败: ${e.message}`);
      });

      transReq.end();
    }, 1000);
  });
});

walletReq.on('error', (e) => {
  console.error(`✗ 请求失败: ${e.message}`);
});

walletReq.end();
