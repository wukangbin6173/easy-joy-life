-- ============================================
-- 清空所有用户余额脚本
-- 执行时间: 2026-02-07
-- 说明: 将所有用户的钱包余额清零，保留其他数据
-- ============================================

USE easy_joy_life_db;

-- 1. 备份当前钱包数据（可选，用于恢复）
-- CREATE TABLE user_wallet_backup_20260207 AS SELECT * FROM user_wallet;

-- 2. 清空所有用户的钱包余额
UPDATE user_wallet 
SET 
    balance = 0.00,
    frozen_amount = 0.00,
    total_recharge = 0.00,
    total_consume = 0.00,
    updated_time = NOW()
WHERE 1=1;

-- 3. 查看更新结果
SELECT 
    id,
    user_id,
    balance,
    frozen_amount,
    total_recharge,
    total_consume,
    status,
    updated_time
FROM user_wallet
ORDER BY id;

-- 4. 统计信息
SELECT 
    COUNT(*) as total_wallets,
    SUM(balance) as total_balance,
    SUM(frozen_amount) as total_frozen,
    SUM(total_recharge) as total_recharge_sum,
    SUM(total_consume) as total_consume_sum
FROM user_wallet;

-- ============================================
-- 执行说明:
-- 1. 在服务器上执行: mysql -u root -p < clear-user-balance.sql
-- 2. 或者登录MySQL后执行: source clear-user-balance.sql
-- 3. 或者使用命令: ssh root@xx.aieo.cn "mysql -u root -proot easy_joy_life_db < clear-user-balance.sql"
-- ============================================
