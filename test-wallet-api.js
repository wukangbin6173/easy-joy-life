/**
 * 测试钱包API接口
 */

const https = require('https');

const config = {
  baseUrl: 'xx.aieo.cn',
  port: 443,
  userId: 1
};

function httpsRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: data,
            json: JSON.parse(data)
          });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data, json: null });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function testWalletAPI() {
  console.log('\n========================================');
  console.log('测试钱包API');
  console.log('========================================\n');
  
  const options = {
    hostname: config.baseUrl,
    port: config.port,
    path: `/api/payment/wallet/${config.userId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    console.log(`请求: GET https://${config.baseUrl}/api/payment/wallet/${config.userId}`);
    const response = await httpsRequest(options);
    
    console.log(`\n响应状态: ${response.statusCode}`);
    console.log('响应内容:', JSON.stringify(response.json, null, 2));
    
    if (response.json && response.json.success) {
      const wallet = response.json.wallet;
      console.log('\n✅ 钱包信息获取成功:');
      console.log(`  余额: ¥${wallet.balance}`);
      console.log(`  冻结金额: ¥${wallet.frozenAmount}`);
      console.log(`  累计充值: ¥${wallet.totalRecharge}`);
      console.log(`  累计消费: ¥${wallet.totalConsume}`);
      console.log(`  状态: ${wallet.status}`);
      return { success: true, wallet };
    } else {
      console.log('\n❌ 获取钱包信息失败');
      return { success: false };
    }
  } catch (error) {
    console.error('\n❌ 请求失败:', error.message);
    return { success: false, error: error.message };
  }
}

async function testTransactionsAPI() {
  console.log('\n========================================');
  console.log('测试交易记录API');
  console.log('========================================\n');
  
  const options = {
    hostname: config.baseUrl,
    port: config.port,
    path: `/api/payment/transactions/${config.userId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    console.log(`请求: GET https://${config.baseUrl}/api/payment/transactions/${config.userId}`);
    const response = await httpsRequest(options);
    
    console.log(`\n响应状态: ${response.statusCode}`);
    console.log('响应内容:', JSON.stringify(response.json, null, 2));
    
    if (response.json && response.json.success) {
      const transactions = response.json.transactions;
      console.log(`\n✅ 交易记录获取成功 (共${transactions.length}条):`);
      transactions.forEach((tx, index) => {
        console.log(`\n  [${index + 1}] ${tx.description}`);
        console.log(`      交易号: ${tx.transactionNo}`);
        console.log(`      类型: ${tx.transactionType}`);
        console.log(`      金额: ¥${tx.amount}`);
        console.log(`      余额变化: ¥${tx.balanceBefore} → ¥${tx.balanceAfter}`);
        console.log(`      时间: ${tx.createdTime}`);
        console.log(`      状态: ${tx.status}`);
      });
      return { success: true, transactions };
    } else {
      console.log('\n❌ 获取交易记录失败');
      return { success: false };
    }
  } catch (error) {
    console.error('\n❌ 请求失败:', error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║          测试钱包和交易记录API接口                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // 测试钱包API
  const walletResult = await testWalletAPI();
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 测试交易记录API
  const transactionsResult = await testTransactionsAPI();
  
  // 总结
  console.log('\n========================================');
  console.log('测试总结');
  console.log('========================================\n');
  
  if (walletResult.success && transactionsResult.success) {
    console.log('✅ 所有API测试通过！');
    console.log(`✅ 当前余额: ¥${walletResult.wallet.balance}`);
    console.log(`✅ 交易记录数: ${transactionsResult.transactions.length}条`);
  } else {
    console.log('❌ 部分API测试失败');
    if (!walletResult.success) console.log('  - 钱包API失败');
    if (!transactionsResult.success) console.log('  - 交易记录API失败');
  }
}

main();
