-- 测试充值流程
USE easy_joy_life_db;

-- 1. 查看当前余额
SELECT '=== 充值前余额 ===' as step;
SELECT id, user_id, balance, total_recharge FROM user_wallets WHERE user_id = 1;

-- 2. 模拟支付成功 - 更新订单状态
SELECT '=== 更新订单状态为已支付 ===' as step;
UPDATE payment_orders 
SET 
    status = 'PAID',
    trade_no = 'TEST_TRADE_NO_001',
    paid_time = NOW(),
    notify_status = 'SUCCESS',
    updated_time = NOW()
WHERE order_no = 'PAY17704728138947700';

-- 3. 查看订单状态
SELECT '=== 订单状态 ===' as step;
SELECT id, order_no, amount, status, trade_no, paid_time FROM payment_orders WHERE order_no = 'PAY17704728138947700';

-- 4. 手动执行充值逻辑（模拟后端处理）
SELECT '=== 执行充值逻辑 ===' as step;

-- 获取订单信息
SET @order_no = 'PAY17704728138947700';
SET @user_id = 1;
SET @amount = 0.10;

-- 更新钱包余额
UPDATE user_wallets 
SET 
    balance = balance + @amount,
    total_recharge = total_recharge + @amount,
    updated_time = NOW()
WHERE user_id = @user_id;

-- 5. 创建交易记录
INSERT INTO wallet_transactions (
    transaction_no,
    user_id,
    order_no,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    description,
    status,
    created_time
)
SELECT 
    CONCAT('TXN', UNIX_TIMESTAMP() * 1000, FLOOR(RAND() * 10000)),
    @user_id,
    @order_no,
    'RECHARGE',
    @amount,
    0.00,
    @amount,
    '钱包充值',
    'SUCCESS',
    NOW();

-- 6. 查看充值后余额
SELECT '=== 充值后余额 ===' as step;
SELECT id, user_id, balance, total_recharge FROM user_wallets WHERE user_id = 1;

-- 7. 查看交易记录
SELECT '=== 交易记录 ===' as step;
SELECT 
    id,
    transaction_no,
    order_no,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    description,
    status,
    created_time
FROM wallet_transactions 
WHERE user_id = 1 
ORDER BY created_time DESC 
LIMIT 5;
