-- ============================================================================
-- 数据库注释规范化脚本 - 简化版（直接执行）
-- ============================================================================

USE easy_joy_life_db;

-- 用户表
ALTER TABLE users COMMENT='用户主表|存储用户基础信息和认证信息';

ALTER TABLE users 
    MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT COMMENT '1|系统|用户ID|用户唯一标识|1',
    MODIFY COLUMN openid VARCHAR(50) NOT NULL COMMENT '2|核心|微信OpenID|微信小程序用户唯一标识|1',
    MODIFY COLUMN unionid VARCHAR(50) COMMENT '3|核心|微信UnionID|微信开放平台统一标识|1',
    MODIFY COLUMN nickname VARCHAR(100) COMMENT '4|资料|昵称|用户显示名称|1',
    MODIFY COLUMN avatar VARCHAR(200) COMMENT '5|资料|头像|用户头像图片URL|1',
    MODIFY COLUMN gender INT DEFAULT 0 COMMENT '6|资料|性别|0=未知, 1=男, 2=女|1',
    MODIFY COLUMN phone VARCHAR(20) COMMENT '7|绑定|手机号|已验证的手机号码|1',
    MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '8|状态|用户状态|ACTIVE=正常, DISABLED=禁用|1',
    MODIFY COLUMN last_login_time DATETIME COMMENT '9|时间|最后登录|最后登录时间|1',
    MODIFY COLUMN created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '10|系统|创建时间|记录创建时间|0',
    MODIFY COLUMN updated_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '11|系统|更新时间|记录更新时间|0';

SELECT '✓ 用户表注释更新完成' AS result;

-- 门店表
ALTER TABLE stores COMMENT='门店主表|存储门店基础信息和位置信息';

ALTER TABLE stores 
    MODIFY COLUMN id BIGINT AUTO_INCREMENT COMMENT '1|系统|门店ID|门店唯一标识|1',
    MODIFY COLUMN name VARCHAR(100) NOT NULL COMMENT '2|核心|门店名称|门店显示名称|1',
    MODIFY COLUMN address VARCHAR(255) NOT NULL COMMENT '3|核心|地址|门店详细地址|1',
    MODIFY COLUMN longitude DECIMAL(10, 6) COMMENT '4|位置|经度|地理位置经度|1',
    MODIFY COLUMN latitude DECIMAL(10, 6) COMMENT '5|位置|纬度|地理位置纬度|1',
    MODIFY COLUMN phone VARCHAR(20) COMMENT '6|联系|电话|门店联系电话|1',
    MODIFY COLUMN description TEXT COMMENT '7|信息|描述|门店详细描述|1',
    MODIFY COLUMN business_hours VARCHAR(50) COMMENT '8|信息|营业时间|营业时间说明|1',
    MODIFY COLUMN facilities TEXT COMMENT '9|信息|设施|门店设施列表|1',
    MODIFY COLUMN status INT DEFAULT 1 COMMENT '10|状态|激活状态|0=禁用, 1=正常|1',
    MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '11|系统|创建时间|记录创建时间|0',
    MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '12|系统|更新时间|记录更新时间|0';

SELECT '✓ 门店表注释更新完成' AS result;

-- 房间表
ALTER TABLE rooms COMMENT='房间主表|存储房间基础信息和价格信息';

ALTER TABLE rooms 
    MODIFY COLUMN id BIGINT AUTO_INCREMENT COMMENT '1|系统|房间ID|房间唯一标识|1',
    MODIFY COLUMN store_id BIGINT NOT NULL COMMENT '2|系统|门店ID|所属门店ID|1',
    MODIFY COLUMN room_no VARCHAR(20) NOT NULL COMMENT '3|核心|房间号|房间编号|1',
    MODIFY COLUMN name VARCHAR(100) NOT NULL COMMENT '4|核心|房间名称|房间显示名称|1',
    MODIFY COLUMN type VARCHAR(50) NOT NULL COMMENT '5|核心|房间类型|麻将房/扑克房等|1',
    MODIFY COLUMN capacity INT NOT NULL COMMENT '6|规格|容量|可容纳人数|1',
    MODIFY COLUMN area DECIMAL(8, 2) COMMENT '7|规格|面积|房间面积(平方米)|1',
    MODIFY COLUMN hourly_rate DECIMAL(10, 2) NOT NULL COMMENT '8|价格|时价|每小时价格|1',
    MODIFY COLUMN facilities TEXT COMMENT '9|信息|设施|房间设施列表|1',
    MODIFY COLUMN status INT DEFAULT 1 COMMENT '10|状态|激活状态|0=禁用, 1=正常|1',
    MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '11|系统|创建时间|记录创建时间|0',
    MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '12|系统|更新时间|记录更新时间|0';

SELECT '✓ 房间表注释更新完成' AS result;

-- 支付订单表
ALTER TABLE payment_orders COMMENT='支付订单|存储充值和预订的支付订单';

ALTER TABLE payment_orders 
    MODIFY COLUMN id BIGINT AUTO_INCREMENT COMMENT '1|系统|订单ID|支付订单唯一标识|1',
    MODIFY COLUMN order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '2|核心|订单号|支付订单号|1',
    MODIFY COLUMN trade_no VARCHAR(64) COMMENT '3|核心|交易号|第三方交易号|1',
    MODIFY COLUMN user_id BIGINT NOT NULL COMMENT '4|系统|用户ID|支付用户ID|1',
    MODIFY COLUMN payment_type VARCHAR(20) NOT NULL COMMENT '5|类型|支付类型|RECHARGE=充值, BOOKING=预订|1',
    MODIFY COLUMN payment_method VARCHAR(20) NOT NULL COMMENT '6|类型|支付方式|ALIPAY=支付宝, WECHAT=微信|1',
    MODIFY COLUMN amount DECIMAL(10,2) NOT NULL COMMENT '7|金额|金额|支付金额|1',
    MODIFY COLUMN subject VARCHAR(100) NOT NULL COMMENT '8|信息|标题|订单标题|1',
    MODIFY COLUMN body VARCHAR(500) COMMENT '9|信息|描述|订单描述|1',
    MODIFY COLUMN status VARCHAR(20) NOT NULL COMMENT '10|状态|订单状态|PENDING=待支付, PAID=已支付, CANCELLED=已取消, REFUNDED=已退款|1',
    MODIFY COLUMN paid_time DATETIME COMMENT '11|时间|支付时间|完成支付时间|1',
    MODIFY COLUMN expire_time DATETIME COMMENT '12|时间|过期时间|订单过期时间|1',
    MODIFY COLUMN notify_status VARCHAR(20) COMMENT '13|通知|状态|PENDING=待通知, SUCCESS=成功, FAILED=失败|1',
    MODIFY COLUMN notify_count INT DEFAULT 0 COMMENT '14|通知|次数|回调通知次数|1',
    MODIFY COLUMN extra_data TEXT COMMENT '15|信息|扩展|扩展信息JSON|0',
    MODIFY COLUMN created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '16|系统|创建时间|记录创建时间|0',
    MODIFY COLUMN updated_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '17|系统|更新时间|记录更新时间|0';

SELECT '✓ 支付订单表注释更新完成' AS result;

-- 用户钱包表
ALTER TABLE user_wallets COMMENT='用户钱包|存储用户钱包余额和统计信息';

ALTER TABLE user_wallets 
    MODIFY COLUMN id BIGINT AUTO_INCREMENT COMMENT '1|系统|钱包ID|钱包唯一标识|1',
    MODIFY COLUMN user_id BIGINT NOT NULL UNIQUE COMMENT '2|系统|用户ID|关联用户ID|1',
    MODIFY COLUMN balance DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '3|余额|当前余额|账户可用余额|1',
    MODIFY COLUMN frozen_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '4|余额|冻结金额|冻结中的金额|1',
    MODIFY COLUMN total_recharge DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '5|统计|累计充值|历史累计充值金额|1',
    MODIFY COLUMN total_consume DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '6|统计|累计消费|历史累计消费金额|1',
    MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '7|状态|钱包状态|ACTIVE=正常, FROZEN=冻结, DISABLED=禁用|1',
    MODIFY COLUMN created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '8|系统|创建时间|记录创建时间|0',
    MODIFY COLUMN updated_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '9|系统|更新时间|记录更新时间|0';

SELECT '✓ 用户钱包表注释更新完成' AS result;

-- 钱包交易记录表
ALTER TABLE wallet_transactions COMMENT='钱包交易记录|记录钱包所有交易流水';

ALTER TABLE wallet_transactions 
    MODIFY COLUMN id BIGINT AUTO_INCREMENT COMMENT '1|系统|交易ID|交易记录唯一标识|1',
    MODIFY COLUMN transaction_no VARCHAR(32) NOT NULL UNIQUE COMMENT '2|核心|交易流水号|交易唯一编号|1',
    MODIFY COLUMN user_id BIGINT NOT NULL COMMENT '3|系统|用户ID|交易用户ID|1',
    MODIFY COLUMN order_no VARCHAR(32) COMMENT '4|关联|订单号|关联的订单号|1',
    MODIFY COLUMN transaction_type VARCHAR(20) NOT NULL COMMENT '5|类型|交易类型|RECHARGE=充值, CONSUME=消费, REFUND=退款, FREEZE=冻结, UNFREEZE=解冻|1',
    MODIFY COLUMN amount DECIMAL(10,2) NOT NULL COMMENT '6|金额|交易金额|正数为收入负数为支出|1',
    MODIFY COLUMN balance_before DECIMAL(10,2) NOT NULL COMMENT '7|金额|交易前余额|交易前账户余额|1',
    MODIFY COLUMN balance_after DECIMAL(10,2) NOT NULL COMMENT '8|金额|交易后余额|交易后账户余额|1',
    MODIFY COLUMN description VARCHAR(200) COMMENT '9|信息|描述|交易描述说明|1',
    MODIFY COLUMN status VARCHAR(20) NOT NULL COMMENT '10|状态|交易状态|SUCCESS=成功, FAILED=失败, PENDING=处理中|1',
    MODIFY COLUMN created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '11|系统|创建时间|记录创建时间|0';

SELECT '✓ 钱包交易记录表注释更新完成' AS result;

SELECT '
============================================================================
✓ 数据库注释规范化完成！

已按照 ZERO 开发规范更新以下表：
1. users - 用户主表
2. stores - 门店主表
3. rooms - 房间主表
4. payment_orders - 支付订单表
5. user_wallets - 用户钱包表
6. wallet_transactions - 钱包交易记录表

所有表和字段的注释已更新为规范格式
============================================================================
' AS '完成提示';
