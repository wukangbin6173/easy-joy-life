// 简单的 WXSS 语法验证
const fs = require('fs');
const path = require('path');

function validateWxssFile(filePath) {
  console.log(`\n🔍 验证文件: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 简单的语法检查
    let openBraces = 0;
    let closeBraces = 0;
    
    // 计算大括号
    for (let char of content) {
      if (char === '{') openBraces++;
      if (char === '}') closeBraces++;
    }
    
    console.log(`  - 左大括号: ${openBraces}`);
    console.log(`  - 右大括号: ${closeBraces}`);
    
    if (openBraces === closeBraces) {
      console.log('  ✅ 大括号匹配');
    } else {
      console.log('  ❌ 大括号不匹配');
      return false;
    }
    
    // 检查是否有明显的语法错误
    const lines = content.split('\n');
    let hasErrors = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;
      
      // 跳过空行和注释
      if (!line || line.startsWith('/*') || line.startsWith('*') || line.startsWith('*/')) {
        continue;
      }
      
      // 检查是否有属性声明但没有在规则内
      if (line.includes(':') && !line.includes('{') && !line.includes('}')) {
        // 检查前面是否有选择器
        let hasSelector = false;
        for (let j = i - 1; j >= 0; j--) {
          const prevLine = lines[j].trim();
          if (!prevLine) continue;
          if (prevLine.includes('{')) {
            hasSelector = true;
            break;
          }
          if (prevLine.includes('}')) {
            break;
          }
        }
        
        if (!hasSelector) {
          console.log(`  ⚠️  第 ${lineNum} 行可能有问题: ${line}`);
        }
      }
    }
    
    console.log('  ✅ 基本语法检查通过');
    return true;
    
  } catch (error) {
    console.log(`  ❌ 读取文件失败: ${error.message}`);
    return false;
  }
}

// 验证所有 WXSS 文件
function validateAllWxss() {
  console.log('🚀 开始验证 WXSS 文件...\n');
  
  const problemFiles = [
    'miniprogram/pages/booking/booking.wxss',
    'miniprogram/pages/orders/orders.wxss',
    'miniprogram/pages/user-profile/user-profile.wxss',
    'miniprogram/pages/wallet/wallet.wxss',
    'miniprogram/pages/transaction-records/transaction-records.wxss'
  ];
  
  let allValid = true;
  
  for (const file of problemFiles) {
    if (fs.existsSync(file)) {
      const isValid = validateWxssFile(file);
      if (!isValid) {
        allValid = false;
      }
    } else {
      console.log(`\n❌ 文件不存在: ${file}`);
      allValid = false;
    }
  }
  
  console.log('\n📊 验证结果:');
  if (allValid) {
    console.log('🎉 所有文件验证通过！');
  } else {
    console.log('⚠️  部分文件可能有问题，建议在微信开发者工具中进一步检查。');
  }
}

validateAllWxss();