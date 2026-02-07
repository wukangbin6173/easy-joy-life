const mysql = require('mysql2/promise');

async function verifyComments() {
    const conn = await mysql.createConnection({
        host: '121.43.96.127',
        port: 3306,
        user: 'root',
        password: 'EasyJoyLife2024!@#',
        database: 'easy_joy_life_db'
    });
    
    console.log('============================================');
    console.log('数据库注释验证');
    console.log('============================================\n');
    
    // 查看表注释
    const [tables] = await conn.query(`
        SELECT TABLE_NAME, TABLE_COMMENT 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = 'easy_joy_life_db'
        ORDER BY TABLE_NAME
    `);
    
    console.log('表注释:');
    tables.forEach(t => {
        console.log(`  ${t.TABLE_NAME}: ${t.TABLE_COMMENT}`);
    });
    
    console.log('\n示例：users表字段注释:');
    const [columns] = await conn.query(`
        SELECT COLUMN_NAME, COLUMN_COMMENT 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
        AND TABLE_NAME = 'users'
        ORDER BY ORDINAL_POSITION
    `);
    
    columns.forEach(c => {
        console.log(`  ${c.COLUMN_NAME}: ${c.COLUMN_COMMENT}`);
    });
    
    await conn.end();
}

verifyComments();
