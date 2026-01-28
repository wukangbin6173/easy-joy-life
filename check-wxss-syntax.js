// 检查 WXSS 文件语法错误
const fs = require('fs');
const path = require('path');

function findWxssFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.wxss')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function checkWxssFile(filePath) {
  console.log(`\n🔍 检查文件: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const errors = [];
    
    let inRule = false;
    let braceCount = 0;
    let currentSelector = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;
      
      // 跳过空行和注释
      if (!line || line.startsWith('/*') || line.startsWith('*') || line.startsWith('*/')) {
        continue;
      }
      
      // 检查选择器
      if (line.includes('{')) {
        if (!line.match(/^[.#a-zA-Z][a-zA-Z0-9_-]*(\s*[.#a-zA-Z][a-zA-Z0-9_-]*)*\s*\{/)) {
          // 可能是选择器，检查是否有效
          const selectorPart = line.split('{')[0].trim();
          if (selectorPart && !selectorPart.includes(':') && !selectorPart.includes(';')) {
            currentSelector = selectorPart;
            inRule = true;
            braceCount++;
          }
        } else {
          currentSelector = line.split('{')[0].trim();
          inRule = true;
          braceCount++;
        }
      }
      
      // 检查属性声明
      if (inRule && line.includes(':') && !line.includes('{')) {
        // 检查是否缺少分号
        if (!line.endsWith(';') && !line.endsWith('}')) {
          errors.push(`第 ${lineNum} 行: 可能缺少分号 - "${line}"`);
        }
        
        // 检查是否有选择器
        if (!currentSelector) {
          errors.push(`第 ${lineNum} 行: 属性声明缺少选择器 - "${line}"`);
        }
      }
      
      // 检查孤立的属性（没有选择器的属性）
      if (!inRule && line.includes(':') && !line.includes('/*') && !line.includes('*/')) {
        // 检查是否是CSS属性
        const colonIndex = line.indexOf(':');
        const property = line.substring(0, colonIndex).trim();
        
        // 常见的CSS属性
        const cssProperties = [
          'color', 'background', 'font-size', 'margin', 'padding', 'border',
          'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom',
          'flex', 'align-items', 'justify-content', 'border-radius', 'box-shadow',
          'text-align', 'font-weight', 'line-height', 'opacity', 'z-index'
        ];
        
        if (cssProperties.some(prop => property.includes(prop))) {
          errors.push(`第 ${lineNum} 行: 孤立的属性声明，缺少选择器 - "${line}"`);
        }
      }
      
      // 检查大括号
      if (line.includes('}')) {
        braceCount--;
        if (braceCount === 0) {
          inRule = false;
          currentSelector = '';
        }
      }
    }
    
    // 检查大括号是否匹配
    if (braceCount !== 0) {
      errors.push(`大括号不匹配，缺少 ${braceCount > 0 ? '右' : '左'}大括号`);
    }
    
    if (errors.length === 0) {
      console.log('✅ 语法检查通过');
    } else {
      console.log('❌ 发现语法错误:');
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    return errors;
    
  } catch (error) {
    console.log(`❌ 读取文件失败: ${error.message}`);
    return [`读取文件失败: ${error.message}`];
  }
}

// 主函数
function main() {
  console.log('🚀 开始检查 WXSS 文件语法...\n');
  
  const miniprogramDir = './miniprogram';
  
  if (!fs.existsSync(miniprogramDir)) {
    console.log('❌ miniprogram 目录不存在');
    return;
  }
  
  const wxssFiles = findWxssFiles(miniprogramDir);
  console.log(`📋 找到 ${wxssFiles.length} 个 WXSS 文件`);
  
  let totalErrors = 0;
  const problemFiles = [];
  
  for (const file of wxssFiles) {
    const errors = checkWxssFile(file);
    if (errors.length > 0) {
      totalErrors += errors.length;
      problemFiles.push({
        file: file,
        errors: errors
      });
    }
  }
  
  console.log('\n📊 检查结果汇总:');
  console.log(`  - 总文件数: ${wxssFiles.length}`);
  console.log(`  - 有问题的文件: ${problemFiles.length}`);
  console.log(`  - 总错误数: ${totalErrors}`);
  
  if (problemFiles.length > 0) {
    console.log('\n🔧 需要修复的文件:');
    problemFiles.forEach(item => {
      console.log(`\n📄 ${item.file}:`);
      item.errors.forEach(error => {
        console.log(`  ❌ ${error}`);
      });
    });
  } else {
    console.log('\n🎉 所有 WXSS 文件语法检查通过！');
  }
}

main();