USE easy_joy_life_db;

ALTER TABLE users COMMENT='用户主表|存储用户基础信息和认证信息';
ALTER TABLE stores COMMENT='门店主表|存储门店基础信息和位置信息';
ALTER TABLE rooms COMMENT='房间主表|存储房间基础信息和价格信息';
ALTER TABLE payment_orders COMMENT='支付订单|存储充值和预订的支付订单';
ALTER TABLE user_wallets COMMENT='用户钱包|存储用户钱包余额和统计信息';
ALTER TABLE wallet_transactions COMMENT='钱包交易记录|记录钱包所有交易流水';

SELECT '✓ 表注释更新完成' AS result;
