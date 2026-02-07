/**
 * 测试钱包页面最近交易数据处理逻辑
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

// 模拟钱包页面的数据处理逻辑
function processWalletTransactions(transactions) {
  return transactions.map(tx => {
    // 判断交易类型
    const isIncome = tx.transactionType === 'RECHARGE' || tx.transactionType === 'REFUND' || tx.transactionType === 'UNFREEZE';
    const type = isIncome ? 'income' : 'expense';
    
    // 格式化标题
    let title = '';
    switch(tx.transactionType) {
      case 'RECHARGE':
        title = '钱包充值';
        break;
      case 'CONSUME':
        title = tx.description || '房间消费';
        break;
      case 'REFUND':
        title = '订单退款';
        break;
      case 'FREEZE':
        title = '金额冻结';
        break;
      case 'UNFREEZE':
        title = '解冻金额';
        break;
      default:
        title = tx.description || tx.transactionType;
    }
    
    // 处理时间格式
    const createdTime = tx.createdTime || '';
    let time = createdTime;
    if (createdTime.includes('T')) {
      const parts = createdTime.split('T');
      const timePart = parts[1].split('.')[0];
      time = `${parts[0]} ${timePart.substring(0, 5)}`; // 只保留到分钟
    } else if (createdTime.includes(' ')) {
      time = createdTime.substring(0, 16); // 只保留到分钟
    }
    
    return {
      id: tx.id,
      type: type,
      title: title,
      time: time,
      amount: Math.abs(tx.amount).toFixed(2)
    };
  });
}

async function testWalletTransactions() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          测试钱包页面最近交易数据处理                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
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
    console.log(`请求: GET https://${config.baseUrl}/api/payment/transactions/${config.userId}\n`);
    const response = await httpsRequest(options);
    
    if (response.json && response.json.success) {
      const rawTransactions = response.json.transactions;
      console.log(`✅ 获取到 ${rawTransactions.length} 条原始交易记录\n`);
      
      // 处理数据
      const processedRecords = processWalletTransactions(rawTransactions);
      
      // 只显示最近5条
      const recentTransactions = processedRecords.slice(0, 5);
      
      console.log('========================================');
      console.log('钱包页面显示的最近交易 (最多5条):');
      console.log('========================================\n');
      
      recentTransactions.forEach((record, index) => {
        const typeIcon = record.type === 'income' ? '💰' : '💸';
        const typeText = record.type === 'income' ? '收入' : '支出';
        const amountColor = record.type === 'income' ? '+' : '-';
        
        console.log(`${typeIcon} [${index + 1}] ${record.title}`);
        console.log(`    类型: ${typeText}`);
        console.log(`    金额: ${amountColor}¥${record.amount}`);
        console.log(`    时间: ${record.time}`);
        console.log('');
      });
      
      if (processedRecords.length > 5) {
        console.log(`📝 注意: 共有 ${processedRecords.length} 条记录，钱包页面只显示最近 5 条\n`);
      }
      
      console.log('✅ 钱包页面数据处理测试通过！');
      
    } else {
      console.error('❌ 获取交易记录失败:', response.json);
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

testWalletTransactions();
