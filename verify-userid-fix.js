/**
 * 验证小程序中所有临时用户ID已被移除
 * 检查是否正确使用 app.globalData.userId
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('验证用户ID修复');
console.log('='.repeat(60));

// 需要检查的文件
const filesToCheck = [
  'miniprogram/pages/wallet/wallet.js',
  'miniprogram/pages/recharge/recharge.js',
  'miniprogram/pages/profile/profile.js',
  'miniprogram/pages/payment-test/payment-test.js',
  'miniprogram/pages/transaction-records/transaction-records.js'
];

let allPassed = true;
let totalIssues = 0;

filesToCheck.forEach(filePath => {
  console.log(`\n检查文件: ${filePath}`);
  console.log('-'.repeat(60));
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let hasIssues = false;
    let fileIssues = [];
    
    // 检查1: 是否还有临时用户ID注释
    lines.forEach((line, index) => {
      if (line.includes('临时用户ID') || line.includes('临时用户id')) {
        hasIssues = true;
        fileIssues.push({
          line: index + 1,
          issue: '发现临时用户ID注释',
          content: line.trim()
        });
      }
    });
    
    // 检查2: 是否还有硬编码的 userId = 1 或 userId: 1
    lines.forEach((line, index) => {
      if (line.match(/userId\s*[=:]\s*1[,;\s}]/)) {
        hasIssues = true;
        fileIssues.push({
          line: index + 1,
          issue: '发现硬编码的用户ID',
          content: line.trim()
        });
      }
    });
    
    // 检查3: 确认使用了 app.globalData.userId
    const hasGlobalUserId = content.includes('app.globalData.userId');
    
    if (hasIssues) {
      console.log('❌ 发现问题:');
      fileIssues.forEach(issue => {
        console.log(`   行 ${issue.line}: ${issue.issue}`);
        console.log(`   代码: ${issue.content}`);
      });
      totalIssues += fileIssues.length;
      allPassed = false;
    } else if (hasGlobalUserId) {
      console.log('✅ 通过 - 正确使用 app.globalData.userId');
    } else {
      console.log('⚠️  警告 - 未使用 app.globalData.userId（可能不需要）');
    }
    
  } catch (error) {
    console.log(`❌ 无法读取文件: ${error.message}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(60));
console.log('验证结果');
console.log('='.repeat(60));

if (allPassed) {
  console.log('✅ 所有文件验证通过！');
  console.log('✅ 已移除所有临时用户ID');
  console.log('✅ 正确使用 app.globalData.userId');
} else {
  console.log(`❌ 发现 ${totalIssues} 个问题需要修复`);
}

console.log('\n建议的测试步骤:');
console.log('1. 确保用户已登录（app.globalData.userId 有值）');
console.log('2. 测试钱包页面加载');
console.log('3. 测试充值功能');
console.log('4. 测试交易记录页面');
console.log('5. 测试个人中心页面');
console.log('\n如果用户未登录，应该显示"请先登录"提示');
