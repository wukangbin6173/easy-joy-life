const mysql = require('mysql2/promise');
const fs = require('fs');

async function updateComments() {
    console.log('============================================');
    console.log('数据库注释更新工具');
    console.log('============================================\n');

    // 创建数据库连接
    const connection = await mysql.createConnection({
        host: '121.43.96.127',
        port: 3306,
        user: 'root',
        password: 'EasyJoyLife2024!@#',
        database: 'easy_joy_life_db',
        multipleStatements: true
    });

    console.log('✓ 数据库连接成功\n');

    try {
        // 读取SQL文件
        const sql = fs.readFileSync('update-comments-simple.sql', 'utf8');
        
        // 分割SQL语句
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`准备执行 ${statements.length} 条SQL语句...\n`);

        let successCount = 0;
        let skipCount = 0;

        for (const statement of statements) {
            try {
                const [results] = await connection.query(statement);
                successCount++;
                
                // 显示进度
                if (statement.includes('✓') || statement.includes('result')) {
                    if (Array.isArray(results) && results.length > 0) {
                        const firstRow = results[0];
                        const value = Object.values(firstRow)[0];
                        if (value) console.log(value);
                    }
                }
            } catch (error) {
                if (error.message.includes("doesn't exist")) {
                    skipCount++;
                } else {
                    console.error(`执行失败: ${error.message}`);
                }
            }
        }

        console.log('\n============================================');
        console.log('✓ 数据库注释更新完成！');
        console.log(`成功: ${successCount} 条`);
        console.log(`跳过: ${skipCount} 条`);
        console.log('============================================');

    } catch (error) {
        console.error('错误:', error.message);
    } finally {
        await connection.end();
    }
}

updateComments().catch(console.error);
