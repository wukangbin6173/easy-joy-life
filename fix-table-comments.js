const mysql = require('mysql2/promise');
const fs = require('fs');

async function fixTableComments() {
    const conn = await mysql.createConnection({
        host: '121.43.96.127',
        port: 3306,
        user: 'root',
        password: 'EasyJoyLife2024!@#',
        database: 'easy_joy_life_db'
    });
    
    console.log('修复表注释...\n');
    
    const sql = fs.readFileSync('fix-table-comments.sql', 'utf8');
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    for (const statement of statements) {
        try {
            const [results] = await conn.query(statement);
            if (Array.isArray(results) && results.length > 0) {
                const value = Object.values(results[0])[0];
                if (value) console.log(value);
            }
        } catch (error) {
            console.error(`错误: ${error.message}`);
        }
    }
    
    await conn.end();
}

fixTableComments();
