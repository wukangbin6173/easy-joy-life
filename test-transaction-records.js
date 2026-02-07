/**
 * 测试交易记录页面数据处理逻辑
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

// 模拟小程序的数据处理逻辑
function processTransactionData(transactions) {
  return transactions.map(tx => {
    // 判断交易类型
    const isIncome = tx.transactionType === 'RECHARGE' || tx.transactionType === 'REFUND';
    const type = isIncome ? 'income' : 'expense';
    
    // 格式化标题
    let title = '';
    let desc = tx.description || '';
    
    switch(tx.transactionType) {
      case 'RECHARGE':
        title = '钱包充值';
        break;
      case 'CONSUME':
        title = '房间消费';
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
        title = tx.transactionType;
    }
    
    // 提取日期和时间
    const createdTime = tx.createdTime || '';
    let time = createdTime;
    let date = '';
    
    // 处理时间格式 (2026-02-07T22:08:24 或 2026-02-07 22:08:24)
    if (createdTime.includes('T')) {
      const parts = createdTime.split('T');
      date = parts[0];
      time = `${parts[0]} ${parts[1].split('.')[0]}`; // 移除毫秒部分
    } else if (createdTime.includes(' ')) {
      date = createdTime.split(' ')[0];
      time = createdTime;
    } else {
      date = createdTime;
      time = createdTime;
    }
    
    return {
      id: tx.id,
      type: type,
      title: title,
      desc: desc,
      amount: Math.abs(tx.amount).toFixed(2),
      time: time,
      status: tx.status === 'SUCCESS' ? 'success' : 'failed',
      statusText: tx.status === 'SUCCESS' ? '已完成' : '失败',
      date: date
    };
  });
}

async function testTransactionRecords() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          测试交易记录数据处理                              ║');
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
      const processedRecords = processTransactionData(rawTransactions);
      
      console.log('========================================');
      console.log('处理后的交易记录:');
      console.log('========================================\n');
      
      processedRecords.forEach((record, index) => {
        console.log(`[${index + 1}] ${record.title}`);
        console.log(`    类型: ${record.type === 'income' ? '收入 ✅' : '支出 ❌'}`);
        console.log(`    金额: ¥${record.amount}`);
        console.log(`    描述: ${record.desc}`);
        console.log(`    时间: ${record.time}`);
        console.log(`    日期: ${record.date}`);
        console.log(`    状态: ${record.statusText}`);
        console.log('');
      });
      
      // 计算统计
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      let monthIncome = 0;
      let monthExpense = 0;
      
      processedRecords.forEach(record => {
        const recordDate = new Date(record.date);
        if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
          const amount = parseFloat(record.amount);
          if (record.type === 'income') {
            monthIncome += amount;
          } else {
            monthExpense += amount;
          }
        }
      });
      
      console.log('========================================');
      console.log('本月统计:');
      console.log('========================================');
      console.log(`收入: ¥${monthIncome.toFixed(2)}`);
      console.log(`支出: ¥${monthExpense.toFixed(2)}`);
      console.log('');
      
      console.log('✅ 数据处理测试通过！');
      
    } else {
      console.error('❌ 获取交易记录失败:', response.json);
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

testTransactionRecords();
