-- 修复payment_orders表结构
ALTER TABLE payment_orders 
MODIFY COLUMN subject VARCHAR(100) NOT NULL,
MODIFY COLUMN body VARCHAR(500);