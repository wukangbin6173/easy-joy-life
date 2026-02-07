-- 测试第二笔充值
USE easy_joy_life_db;

-- 1. 查看当前余额
SELECT '=== 第二次充值前余额 ===' as step;
SELECT id, user_id, balance, total_recharge FROM user_wallets WHERE user_id = 1;

-- 2. 选择一个新的订单
SELECT '=== 选择新订单 ===' as step;
SELECT id, order_no, amount, status FROM payment_orders WHERE status = 'PENDING' ORDER BY created_time DESC LIMIT 1;

-- 3. 更新订单状态为已支付
SELECT '=== 更新订单状态 ===' as step;
UPDATE payment_orders 
SET 
    status = 'PAID',
    trade_no = 'TEST_TRADE_NO_002',
    paid_time = NOW(),
    notify_status = 'SUCCESS',
    updated_time = NOW()
WHERE order_no = 'PAY17704716522026779';

-- 4. 执行充值逻辑
SELECT '=== 执行第二次充值 ===' as step;

SET @order_no = 'PAY17704716522026779';
SET @user_id = 1;
SET @amount = 0.10;
SET @balance_before = (SELECT balance FROM user_wallets WHERE user_id = @user_id);

-- 更新钱包余额
UPDATE user_wallets 
SET 
    balance = balance + @amount,
    total_recharge = total_recharge + @amount,
    updated_time = NOW()
WHERE user_id = @user_id;

-- 创建交易记录
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
    @balance_before,
    @balance_before + @amount,
    '钱包充值',
    'SUCCESS',
    NOW();

-- 5. 查看充值后余额
SELECT '=== 第二次充值后余额 ===' as step;
SELECT id, user_id, balance, total_recharge FROM user_wallets WHERE user_id = 1;

-- 6. 查看所有交易记录
SELECT '=== 所有交易记录 ===' as step;
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
ORDER BY created_time DESC;
