const mysql = require('mysql2/promise');

async function checkColumns() {
    const conn = await mysql.createConnection({
        host: '121.43.96.127',
        port: 3306,
        user: 'root',
        password: 'EasyJoyLife2024!@#',
        database: 'easy_joy_life_db'
    });
    
    const [rows] = await conn.query('SHOW COLUMNS FROM users');
    console.log('users表字段:');
    rows.forEach(r => console.log(`- ${r.Field} (${r.Type})`));
    
    await conn.end();
}

checkColumns();
