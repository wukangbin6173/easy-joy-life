---
name: "Database Design and MySQL"
description: "Complete database design principles and MySQL optimization techniques"
tags: ["mysql", "database", "sql", "optimization", "design"]
version: "1.0.0"
---

# 数据库设计与MySQL技能

## 数据库设计原则

### 范式设计
1. **第一范式(1NF)**: 原子性，每个字段不可再分
2. **第二范式(2NF)**: 完全函数依赖，消除部分依赖
3. **第三范式(3NF)**: 消除传递依赖

### 反范式化
在性能要求高的场景下，适当反范式化:
- 冗余常用字段减少JOIN
- 预计算统计数据
- 空间换时间策略

## 表结构设计

### 基础表设计
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 字段设计规范
- **主键**: 使用BIGINT AUTO_INCREMENT
- **字符集**: 统一使用utf8mb4
- **时间字段**: 使用TIMESTAMP或DATETIME
- **状态字段**: 使用ENUM或TINYINT
- **金额字段**: 使用DECIMAL(10,2)

## 索引优化

### 索引类型
```sql
-- 普通索引
CREATE INDEX idx_name ON users(name);

-- 唯一索引
CREATE UNIQUE INDEX idx_email ON users(email);

-- 复合索引
CREATE INDEX idx_status_created ON users(status, created_at);

-- 前缀索引
CREATE INDEX idx_title_prefix ON articles(title(10));

-- 全文索引
CREATE FULLTEXT INDEX idx_content ON articles(content);
```

### 索引优化原则
1. **最左前缀**: 复合索引遵循最左前缀原则
2. **选择性**: 高选择性字段优先
3. **覆盖索引**: 查询字段都在索引中
4. **避免冗余**: 删除重复和无用索引

## 查询优化

### EXPLAIN分析
```sql
EXPLAIN SELECT * FROM users WHERE status = 'ACTIVE' AND created_at > '2024-01-01';

-- 关键指标
-- type: ALL(全表扫描) < index < range < ref < eq_ref < const
-- key: 使用的索引
-- rows: 扫描行数
-- Extra: 额外信息
```

### 查询优化技巧
```sql
-- 避免SELECT *
SELECT id, name, email FROM users WHERE id = 1;

-- 使用LIMIT限制结果
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- 合理使用JOIN
SELECT u.name, p.title 
FROM users u 
INNER JOIN posts p ON u.id = p.user_id 
WHERE u.status = 'ACTIVE';

-- 子查询优化
-- 不推荐
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);
-- 推荐
SELECT DISTINCT u.* FROM users u INNER JOIN orders o ON u.id = o.user_id;
```

## 事务管理

### 事务特性(ACID)
- **原子性(Atomicity)**: 全部成功或全部失败
- **一致性(Consistency)**: 数据完整性约束
- **隔离性(Isolation)**: 并发事务互不干扰
- **持久性(Durability)**: 提交后永久保存

### 隔离级别
```sql
-- 查看当前隔离级别
SELECT @@transaction_isolation;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 四种隔离级别
-- READ UNCOMMITTED: 读未提交
-- READ COMMITTED: 读已提交
-- REPEATABLE READ: 可重复读(MySQL默认)
-- SERIALIZABLE: 串行化
```

### 事务使用
```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 检查余额是否足够
IF (SELECT balance FROM accounts WHERE id = 1) >= 0 THEN
    COMMIT;
ELSE
    ROLLBACK;
END IF;
```

## 锁机制

### 锁类型
```sql
-- 共享锁(S锁)
SELECT * FROM users WHERE id = 1 LOCK IN SHARE MODE;

-- 排他锁(X锁)
SELECT * FROM users WHERE id = 1 FOR UPDATE;

-- 表级锁
LOCK TABLES users READ;
LOCK TABLES users WRITE;
UNLOCK TABLES;
```

### 死锁处理
```sql
-- 查看死锁信息
SHOW ENGINE INNODB STATUS;

-- 死锁预防
-- 1. 按相同顺序访问表和行
-- 2. 缩短事务时间
-- 3. 降低隔离级别
-- 4. 使用索引避免锁升级
```

## 分区表

### 分区类型
```sql
-- 范围分区
CREATE TABLE orders (
    id BIGINT,
    order_date DATE,
    amount DECIMAL(10,2)
) PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026)
);

-- 哈希分区
CREATE TABLE users (
    id BIGINT,
    name VARCHAR(50)
) PARTITION BY HASH(id) PARTITIONS 4;

-- 列表分区
CREATE TABLE sales (
    id BIGINT,
    region VARCHAR(10)
) PARTITION BY LIST COLUMNS(region) (
    PARTITION p_north VALUES IN ('北京', '上海'),
    PARTITION p_south VALUES IN ('广州', '深圳')
);
```

## 主从复制

### 主从配置
```sql
-- 主库配置
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog-format = ROW

-- 从库配置
[mysqld]
server-id = 2
relay-log = relay-bin
read-only = 1

-- 创建复制用户
CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- 配置从库
CHANGE MASTER TO
    MASTER_HOST='master_ip',
    MASTER_USER='repl',
    MASTER_PASSWORD='password',
    MASTER_LOG_FILE='mysql-bin.000001',
    MASTER_LOG_POS=154;

START SLAVE;
```

## 备份恢复

### 逻辑备份
```bash
# mysqldump备份
mysqldump -u root -p --single-transaction --routines --triggers database_name > backup.sql

# 恢复
mysql -u root -p database_name < backup.sql

# 备份所有数据库
mysqldump -u root -p --all-databases > all_databases.sql
```

### 物理备份
```bash
# 使用Percona XtraBackup
xtrabackup --backup --target-dir=/backup/

# 恢复
xtrabackup --prepare --target-dir=/backup/
xtrabackup --copy-back --target-dir=/backup/
```

## 性能监控

### 慢查询日志
```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';

-- 分析慢查询
-- 使用mysqldumpslow工具
mysqldumpslow -s c -t 10 /var/log/mysql/slow.log
```

### 性能监控指标
```sql
-- 查看连接数
SHOW STATUS LIKE 'Threads_connected';

-- 查看QPS/TPS
SHOW STATUS LIKE 'Questions';
SHOW STATUS LIKE 'Com_commit';

-- 查看缓冲池命中率
SHOW STATUS LIKE 'Innodb_buffer_pool_read%';

-- 查看锁等待
SHOW STATUS LIKE 'Innodb_row_lock%';
```

## 配置优化

### 内存配置
```ini
[mysqld]
# InnoDB缓冲池(物理内存的70-80%)
innodb_buffer_pool_size = 8G

# 查询缓存
query_cache_size = 256M
query_cache_type = 1

# 排序缓冲区
sort_buffer_size = 2M

# 连接缓冲区
read_buffer_size = 1M
read_rnd_buffer_size = 2M
```

### 连接配置
```ini
# 最大连接数
max_connections = 1000

# 连接超时
wait_timeout = 28800
interactive_timeout = 28800

# 线程缓存
thread_cache_size = 100
```

## 常见问题解决

### 表锁问题
```sql
-- 查看锁状态
SHOW PROCESSLIST;
SHOW ENGINE INNODB STATUS;

-- 杀死阻塞进程
KILL CONNECTION process_id;
```

### 空间不足
```sql
-- 查看表空间大小
SELECT 
    table_schema,
    table_name,
    ROUND(data_length/1024/1024, 2) AS data_mb,
    ROUND(index_length/1024/1024, 2) AS index_mb
FROM information_schema.tables
ORDER BY data_length DESC;

-- 清理binlog
PURGE BINARY LOGS BEFORE '2024-01-01';
```

### 字符集问题
```sql
-- 查看字符集
SHOW VARIABLES LIKE 'character_set%';

-- 修改字符集
ALTER TABLE table_name CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```