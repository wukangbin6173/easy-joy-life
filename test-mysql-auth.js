// 测试 MySQL 认证连接
const mysql = require('mysql2/promise');

async function testConnection() {
  const config = {
    host: '121.43.96.127',
    port: 3306,
    user: 'root',
    password: 'EasyJoyLife2024!@#',
    database: 'easy_joy_life_db',
    connectTimeout: 10000
  };

  console.log('正在连接到 MySQL...');
  console.log(`主机: ${config.host}:${config.port}`);
  console.log(`用户: ${config.user}`);
  console.log(`数据库: ${config.database}`);
  console.log('');

  try {
    const connection = await mysql.createConnection(config);
    console.log('✓ 连接成功！');
    
    // 测试查询
    const [rows] = await connection.execute('SELECT VERSION() as version, DATABASE() as db');
    console.log('✓ 查询成功！');
    console.log(`MySQL 版本: ${rows[0].version}`);
    console.log(`当前数据库: ${rows[0].db}`);
    
    await connection.end();
    console.log('✓ 连接已关闭');
    process.exit(0);
  } catch (error) {
    console.error('✗ 连接失败:', error.message);
    console.error('错误代码:', error.code);
    if (error.sqlState) {
      console.error('SQL 状态:', error.sqlState);
    }
    process.exit(1);
  }
}

testConnection();
