-- ============================================================================
-- 数据库注释规范化脚本 - 仅更新表注释和字段注释
-- 基于 ZERO 开发规范
-- 创建日期: 2026-02-07
-- 说明：本脚本只修改注释，不改变表名和字段名
-- ============================================================================

USE easy_joy_life_db;

-- ============================================================================
-- 第一部分：更新用户表 (users) 的注释
-- ============================================================================

-- 更新表注释
ALTER TABLE users COMMENT='用户主表|存储用户基础信息和认证信息';

-- 更新字段注释
ALTER TABLE users 
    MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT 
        COMMENT '1|系统|用户ID|用户唯一标识|1',
    MODIFY COLUMN openid VARCHAR(100) NOT NULL 
        COMMENT '2|核心|微信OpenID|微信小程序用户唯一标识|1',
    MODIFY COLUMN unionid VARCHAR(100) 
        COMMENT '3|核心|微信UnionID|微信开放平台统一标识|1',
    MODIFY COLUMN nickname VARCHAR(50) 
        COMMENT '4|资料|昵称|用户显示名称|1',
    MODIFY COLUMN avatar VARCHAR(500) 
        COMMENT '5|资料|头像|用户头像图片URL|1',
    MODIFY COLUMN phone VARCHAR(20) 
        COMMENT '6|绑定|手机号|已验证的手机号码|1',
    MODIFY COLUMN real_name VARCHAR(50) 
        COMMENT '7|资料|真实姓名|用户真实姓名|1',
    MODIFY COLUMN id_card VARCHAR(20) 
        COMMENT '8|资料|身份证号|用户身份证号码|0',
    MODIFY COLUMN gender TINYINT DEFAULT 0 
        COMMENT '9|资料|性别|0=未知, 1=男, 2=女|1',
    MODIFY COLUMN birthday DATE 
        COMMENT '10|资料|生日|用户出生日期|1',
    MODIFY COLUMN level TINYINT DEFAULT 1 
        COMMENT '11|等级|当前等级|用户会员等级|1',
    MODIFY COLUMN points INT DEFAULT 0 
        COMMENT '12|等级|积分|用户当前积分|1',
    MODIFY COLUMN balance DECIMAL(10,2) DEFAULT 0.00 
        COMMENT '13|余额|金额|用户账户余额|1',
    MODIFY COLUMN status TINYINT DEFAULT 1 
        COMMENT '14|状态|激活状态|0=禁用, 1=正常|1',
    MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '15|系统|创建时间|记录创建时间|0',
    MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '16|系统|更新时间|记录更新时间|0';

SELECT '✓ 用户表注释更新完成' AS result;

-- ============================================================================
-- 第二部分：更新门店表 (stores) 的注释
-- ============================================================================

-- 更新表注释
ALTER TABLE stores COMMENT='门店主表|存储门店基础信息和位置信息';

-- 更新字段注释
ALTER TABLE stores 
    MODIFY COLUMN id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|门店ID|门店唯一标识|1',
    MODIFY COLUMN name VARCHAR(100) NOT NULL 
        COMMENT '2|核心|门店名称|门店显示名称|1',
    MODIFY COLUMN address VARCHAR(255) NOT NULL 
        COMMENT '3|核心|地址|门店详细地址|1',
    MODIFY COLUMN longitude DECIMAL(10, 6) 
        COMMENT '4|位置|经度|地理位置经度|1',
    MODIFY COLUMN latitude DECIMAL(10, 6) 
        COMMENT '5|位置|纬度|地理位置纬度|1',
    MODIFY COLUMN phone VARCHAR(20) 
        COMMENT '6|联系|电话|门店联系电话|1',
    MODIFY COLUMN description TEXT 
        COMMENT '7|信息|描述|门店详细描述|1',
    MODIFY COLUMN business_hours VARCHAR(50) 
        COMMENT '8|信息|营业时间|营业时间说明|1',
    MODIFY COLUMN facilities TEXT 
        COMMENT '9|信息|设施|门店设施列表|1',
    MODIFY COLUMN status INT DEFAULT 1 
        COMMENT '10|状态|激活状态|0=禁用, 1=正常|1',
    MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '11|系统|创建时间|记录创建时间|0',
    MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '12|系统|更新时间|记录更新时间|0';

-- 处理 image 字段（如果存在）
SET @image_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'stores' 
    AND COLUMN_NAME = 'image');

SET @sql_image = IF(@image_exists > 0,
    'ALTER TABLE stores MODIFY COLUMN image VARCHAR(200) COMMENT ''13|信息|图片|门店图片URL|1''',
    'SELECT ''image字段不存在，跳过'' AS info');

PREPARE stmt_image FROM @sql_image;
EXECUTE stmt_image;
DEALLOCATE PREPARE stmt_image;

-- 处理 images 字段（如果存在）
SET @images_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'stores' 
    AND COLUMN_NAME = 'images');

SET @sql_images = IF(@images_exists > 0,
    'ALTER TABLE stores MODIFY COLUMN images VARCHAR(1000) COMMENT ''13|信息|图片列表|门店图片URL列表|1''',
    'SELECT ''images字段不存在，跳过'' AS info');

PREPARE stmt_images FROM @sql_images;
EXECUTE stmt_images;
DEALLOCATE PREPARE stmt_images;

SELECT '✓ 门店表注释更新完成' AS result;

-- ============================================================================
-- 第三部分：更新房间表 (rooms) 的注释
-- ============================================================================

-- 更新表注释
ALTER TABLE rooms COMMENT='房间主表|存储房间基础信息和价格信息';

-- 更新字段注释
ALTER TABLE rooms 
    MODIFY COLUMN id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|房间ID|房间唯一标识|1',
    MODIFY COLUMN store_id BIGINT NOT NULL 
        COMMENT '2|系统|门店ID|所属门店ID|1',
    MODIFY COLUMN room_no VARCHAR(20) NOT NULL 
        COMMENT '3|核心|房间号|房间编号|1',
    MODIFY COLUMN name VARCHAR(100) NOT NULL 
        COMMENT '4|核心|房间名称|房间显示名称|1',
    MODIFY COLUMN type VARCHAR(50) NOT NULL 
        COMMENT '5|核心|房间类型|麻将房/扑克房等|1',
    MODIFY COLUMN capacity INT NOT NULL 
        COMMENT '6|规格|容量|可容纳人数|1',
    MODIFY COLUMN facilities TEXT 
        COMMENT '7|信息|设施|房间设施列表|1',
    MODIFY COLUMN status INT DEFAULT 1 
        COMMENT '8|状态|激活状态|0=禁用, 1=正常|1',
    MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '9|系统|创建时间|记录创建时间|0',
    MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '10|系统|更新时间|记录更新时间|0';

-- 处理 area 字段（如果存在）
SET @area_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'rooms' 
    AND COLUMN_NAME = 'area');

SET @sql_area = IF(@area_exists > 0,
    'ALTER TABLE rooms MODIFY COLUMN area DECIMAL(8, 2) COMMENT ''11|规格|面积|房间面积(平方米)|1''',
    'SELECT ''area字段不存在，跳过'' AS info');

PREPARE stmt_area FROM @sql_area;
EXECUTE stmt_area;
DEALLOCATE PREPARE stmt_area;

-- 处理 hourly_rate 字段（如果存在）
SET @hourly_rate_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'rooms' 
    AND COLUMN_NAME = 'hourly_rate');

SET @sql_hourly = IF(@hourly_rate_exists > 0,
    'ALTER TABLE rooms MODIFY COLUMN hourly_rate DECIMAL(10, 2) NOT NULL COMMENT ''12|价格|时价|每小时价格|1''',
    'SELECT ''hourly_rate字段不存在，跳过'' AS info');

PREPARE stmt_hourly FROM @sql_hourly;
EXECUTE stmt_hourly;
DEALLOCATE PREPARE stmt_hourly;

-- 处理 price_per_hour 字段（如果存在）
SET @price_per_hour_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'rooms' 
    AND COLUMN_NAME = 'price_per_hour');

SET @sql_price = IF(@price_per_hour_exists > 0,
    'ALTER TABLE rooms MODIFY COLUMN price_per_hour DECIMAL(8,2) NOT NULL COMMENT ''12|价格|时价|每小时价格|1''',
    'SELECT ''price_per_hour字段不存在，跳过'' AS info');

PREPARE stmt_price FROM @sql_price;
EXECUTE stmt_price;
DEALLOCATE PREPARE stmt_price;

-- 处理 image 字段（如果存在）
SET @room_image_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'rooms' 
    AND COLUMN_NAME = 'image');

SET @sql_room_image = IF(@room_image_exists > 0,
    'ALTER TABLE rooms MODIFY COLUMN image VARCHAR(200) COMMENT ''13|信息|图片|房间图片URL|1''',
    'SELECT ''image字段不存在，跳过'' AS info');

PREPARE stmt_room_image FROM @sql_room_image;
EXECUTE stmt_room_image;
DEALLOCATE PREPARE stmt_room_image;

-- 处理 images 字段（如果存在）
SET @room_images_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'rooms' 
    AND COLUMN_NAME = 'images');

SET @sql_room_images = IF(@room_images_exists > 0,
    'ALTER TABLE rooms MODIFY COLUMN images VARCHAR(1000) COMMENT ''13|信息|图片列表|房间图片URL列表|1''',
    'SELECT ''images字段不存在，跳过'' AS info');

PREPARE stmt_room_images FROM @sql_room_images;
EXECUTE stmt_room_images;
DEALLOCATE PREPARE stmt_room_images;

-- 处理 device_id 字段（如果存在）
SET @device_id_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'rooms' 
    AND COLUMN_NAME = 'device_id');

SET @sql_device = IF(@device_id_exists > 0,
    'ALTER TABLE rooms MODIFY COLUMN device_id VARCHAR(50) COMMENT ''14|设备|设备ID|关联的智能设备ID|1''',
    'SELECT ''device_id字段不存在，跳过'' AS info');

PREPARE stmt_device FROM @sql_device;
EXECUTE stmt_device;
DEALLOCATE PREPARE stmt_device;

-- 处理 lock_type 字段（如果存在）
SET @lock_type_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'rooms' 
    AND COLUMN_NAME = 'lock_type');

SET @sql_lock = IF(@lock_type_exists > 0,
    'ALTER TABLE rooms MODIFY COLUMN lock_type VARCHAR(20) DEFAULT ''wifi'' COMMENT ''15|设备|锁类型|智能锁类型|1''',
    'SELECT ''lock_type字段不存在，跳过'' AS info');

PREPARE stmt_lock FROM @sql_lock;
EXECUTE stmt_lock;
DEALLOCATE PREPARE stmt_lock;

SELECT '✓ 房间表注释更新完成' AS result;

-- ============================================================================
-- 第四部分：更新订单表 (orders) 的注释
-- ============================================================================

-- 检查 orders 表是否存在
SET @orders_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'orders');

-- 如果表存在，更新注释
SET @sql_orders = IF(@orders_exists > 0,
    CONCAT(
        'ALTER TABLE orders COMMENT=''订单主表|存储房间预订订单信息'';',
        'ALTER TABLE orders ',
        'MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT COMMENT ''1|系统|订单ID|订单唯一标识|1'',',
        'MODIFY COLUMN order_no VARCHAR(32) NOT NULL COMMENT ''2|核心|订单号|订单唯一编号|1'',',
        'MODIFY COLUMN user_id BIGINT NOT NULL COMMENT ''3|系统|用户ID|下单用户ID|1'',',
        'MODIFY COLUMN store_id BIGINT NOT NULL COMMENT ''4|关联|门店ID|预订门店ID|1'',',
        'MODIFY COLUMN room_id BIGINT NOT NULL COMMENT ''5|关联|房间ID|预订房间ID|1'',',
        'MODIFY COLUMN start_time TIMESTAMP NOT NULL COMMENT ''6|时间|开始时间|预订开始时间|1'',',
        'MODIFY COLUMN end_time TIMESTAMP NOT NULL COMMENT ''7|时间|结束时间|预订结束时间|1'',',
        'MODIFY COLUMN duration INT NOT NULL COMMENT ''8|时间|时长|预订时长(分钟)|1'',',
        'MODIFY COLUMN unit_price DECIMAL(8,2) NOT NULL COMMENT ''9|价格|单价|每小时单价|1'',',
        'MODIFY COLUMN total_amount DECIMAL(10,2) NOT NULL COMMENT ''10|价格|总价|订单总金额|1'',',
        'MODIFY COLUMN discount_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT ''11|价格|优惠|优惠金额|1'',',
        'MODIFY COLUMN actual_amount DECIMAL(10,2) NOT NULL COMMENT ''12|价格|实付|实际支付金额|1'',',
        'MODIFY COLUMN payment_method VARCHAR(20) DEFAULT ''wechat'' COMMENT ''13|支付|方式|支付方式|1'',',
        'MODIFY COLUMN payment_status TINYINT DEFAULT 0 COMMENT ''14|支付|状态|0=待支付, 1=已支付, 2=已退款|1'',',
        'MODIFY COLUMN order_status TINYINT DEFAULT 0 COMMENT ''15|状态|订单状态|0=待支付, 1=已支付, 2=使用中, 3=已完成, 4=已取消|1'',',
        'MODIFY COLUMN unlock_code VARCHAR(20) COMMENT ''16|开锁|密码|开锁密码|1'',',
        'MODIFY COLUMN unlock_time TIMESTAMP COMMENT ''17|时间|开锁时间|门锁开启时间|1'',',
        'MODIFY COLUMN actual_start_time TIMESTAMP COMMENT ''18|时间|实际开始|实际使用开始时间|1'',',
        'MODIFY COLUMN actual_end_time TIMESTAMP COMMENT ''19|时间|实际结束|实际使用结束时间|1'',',
        'MODIFY COLUMN remark VARCHAR(500) COMMENT ''20|信息|备注|订单备注信息|1'',',
        'MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''21|系统|创建时间|记录创建时间|0'',',
        'MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''22|系统|更新时间|记录更新时间|0'''
    ),
    'SELECT ''orders表不存在，跳过'' AS info'
);

PREPARE stmt_orders FROM @sql_orders;
EXECUTE stmt_orders;
DEALLOCATE PREPARE stmt_orders;

SELECT '✓ 订单表注释更新完成' AS result;

-- ============================================================================
-- 第五部分：更新支付记录表 (payments) 的注释
-- ============================================================================

-- 检查 payments 表是否存在
SET @payments_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'payments');

SET @sql_payments = IF(@payments_exists > 0,
    CONCAT(
        'ALTER TABLE payments COMMENT=''支付记录|记录订单支付和退款信息'';',
        'ALTER TABLE payments ',
        'MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT COMMENT ''1|系统|支付ID|支付记录唯一标识|1'',',
        'MODIFY COLUMN order_id BIGINT NOT NULL COMMENT ''2|关联|订单ID|关联的订单ID|1'',',
        'MODIFY COLUMN payment_no VARCHAR(32) NOT NULL COMMENT ''3|核心|支付单号|支付单号|1'',',
        'MODIFY COLUMN third_party_no VARCHAR(64) COMMENT ''4|核心|第三方单号|第三方支付平台单号|1'',',
        'MODIFY COLUMN payment_method VARCHAR(20) NOT NULL COMMENT ''5|支付|方式|wechat=微信, alipay=支付宝|1'',',
        'MODIFY COLUMN amount DECIMAL(10,2) NOT NULL COMMENT ''6|支付|金额|支付金额|1'',',
        'MODIFY COLUMN status TINYINT DEFAULT 0 COMMENT ''7|状态|支付状态|0=待支付, 1=已支付, 2=已退款|1'',',
        'MODIFY COLUMN paid_at TIMESTAMP COMMENT ''8|时间|支付时间|完成支付时间|1'',',
        'MODIFY COLUMN refund_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT ''9|退款|金额|退款金额|1'',',
        'MODIFY COLUMN refund_at TIMESTAMP COMMENT ''10|时间|退款时间|完成退款时间|1'',',
        'MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''11|系统|创建时间|记录创建时间|0'',',
        'MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''12|系统|更新时间|记录更新时间|0'''
    ),
    'SELECT ''payments表不存在，跳过'' AS info'
);

PREPARE stmt_payments FROM @sql_payments;
EXECUTE stmt_payments;
DEALLOCATE PREPARE stmt_payments;

SELECT '✓ 支付记录表注释更新完成' AS result;

-- ============================================================================
-- 第六部分：更新支付订单表 (payment_orders) 的注释
-- ============================================================================

-- 检查 payment_orders 表是否存在
SET @payment_orders_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'payment_orders');

SET @sql_payment_orders = IF(@payment_orders_exists > 0,
    CONCAT(
        'ALTER TABLE payment_orders COMMENT=''支付订单|存储充值和预订的支付订单'';',
        'ALTER TABLE payment_orders ',
        'MODIFY COLUMN id BIGINT AUTO_INCREMENT COMMENT ''1|系统|订单ID|支付订单唯一标识|1'',',
        'MODIFY COLUMN order_no VARCHAR(32) NOT NULL UNIQUE COMMENT ''2|核心|订单号|支付订单号|1'',',
        'MODIFY COLUMN trade_no VARCHAR(64) COMMENT ''3|核心|交易号|第三方交易号|1'',',
        'MODIFY COLUMN user_id BIGINT NOT NULL COMMENT ''4|系统|用户ID|支付用户ID|1'',',
        'MODIFY COLUMN payment_type VARCHAR(20) NOT NULL COMMENT ''5|类型|支付类型|RECHARGE=充值, BOOKING=预订|1'',',
        'MODIFY COLUMN payment_method VARCHAR(20) NOT NULL COMMENT ''6|类型|支付方式|ALIPAY=支付宝, WECHAT=微信|1'',',
        'MODIFY COLUMN amount DECIMAL(10,2) NOT NULL COMMENT ''7|金额|金额|支付金额|1'',',
        'MODIFY COLUMN subject VARCHAR(100) NOT NULL COMMENT ''8|信息|标题|订单标题|1'',',
        'MODIFY COLUMN body VARCHAR(500) COMMENT ''9|信息|描述|订单描述|1'',',
        'MODIFY COLUMN status VARCHAR(20) NOT NULL COMMENT ''10|状态|订单状态|PENDING=待支付, PAID=已支付, CANCELLED=已取消, REFUNDED=已退款|1'',',
        'MODIFY COLUMN paid_time DATETIME COMMENT ''11|时间|支付时间|完成支付时间|1'',',
        'MODIFY COLUMN expire_time DATETIME COMMENT ''12|时间|过期时间|订单过期时间|1'',',
        'MODIFY COLUMN notify_status VARCHAR(20) COMMENT ''13|通知|状态|PENDING=待通知, SUCCESS=成功, FAILED=失败|1'',',
        'MODIFY COLUMN notify_count INT DEFAULT 0 COMMENT ''14|通知|次数|回调通知次数|1'',',
        'MODIFY COLUMN extra_data TEXT COMMENT ''15|信息|扩展|扩展信息JSON|0'',',
        'MODIFY COLUMN created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT ''16|系统|创建时间|记录创建时间|0'',',
        'MODIFY COLUMN updated_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT ''17|系统|更新时间|记录更新时间|0'''
    ),
    'SELECT ''payment_orders表不存在，跳过'' AS info'
);

PREPARE stmt_payment_orders FROM @sql_payment_orders;
EXECUTE stmt_payment_orders;
DEALLOCATE PREPARE stmt_payment_orders;

SELECT '✓ 支付订单表注释更新完成' AS result;

-- ============================================================================
-- 第七部分：更新用户钱包表 (user_wallets) 的注释
-- ============================================================================

-- 检查 user_wallets 表是否存在
SET @user_wallets_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'user_wallets');

SET @sql_user_wallets = IF(@user_wallets_exists > 0,
    CONCAT(
        'ALTER TABLE user_wallets COMMENT=''用户钱包|存储用户钱包余额和统计信息'';',
        'ALTER TABLE user_wallets ',
        'MODIFY COLUMN id BIGINT AUTO_INCREMENT COMMENT ''1|系统|钱包ID|钱包唯一标识|1'',',
        'MODIFY COLUMN user_id BIGINT NOT NULL UNIQUE COMMENT ''2|系统|用户ID|关联用户ID|1'',',
        'MODIFY COLUMN balance DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT ''3|余额|当前余额|账户可用余额|1'',',
        'MODIFY COLUMN frozen_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT ''4|余额|冻结金额|冻结中的金额|1'',',
        'MODIFY COLUMN total_recharge DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT ''5|统计|累计充值|历史累计充值金额|1'',',
        'MODIFY COLUMN total_consume DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT ''6|统计|累计消费|历史累计消费金额|1'',',
        'MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT ''ACTIVE'' COMMENT ''7|状态|钱包状态|ACTIVE=正常, FROZEN=冻结, DISABLED=禁用|1'',',
        'MODIFY COLUMN created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT ''8|系统|创建时间|记录创建时间|0'',',
        'MODIFY COLUMN updated_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT ''9|系统|更新时间|记录更新时间|0'''
    ),
    'SELECT ''user_wallets表不存在，跳过'' AS info'
);

PREPARE stmt_user_wallets FROM @sql_user_wallets;
EXECUTE stmt_user_wallets;
DEALLOCATE PREPARE stmt_user_wallets;

SELECT '✓ 用户钱包表注释更新完成' AS result;

-- ============================================================================
-- 第八部分：更新钱包交易记录表 (wallet_transactions) 的注释
-- ============================================================================

-- 检查 wallet_transactions 表是否存在
SET @wallet_transactions_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'wallet_transactions');

SET @sql_wallet_transactions = IF(@wallet_transactions_exists > 0,
    CONCAT(
        'ALTER TABLE wallet_transactions COMMENT=''钱包交易记录|记录钱包所有交易流水'';',
        'ALTER TABLE wallet_transactions ',
        'MODIFY COLUMN id BIGINT AUTO_INCREMENT COMMENT ''1|系统|交易ID|交易记录唯一标识|1'',',
        'MODIFY COLUMN transaction_no VARCHAR(32) NOT NULL UNIQUE COMMENT ''2|核心|交易流水号|交易唯一编号|1'',',
        'MODIFY COLUMN user_id BIGINT NOT NULL COMMENT ''3|系统|用户ID|交易用户ID|1'',',
        'MODIFY COLUMN order_no VARCHAR(32) COMMENT ''4|关联|订单号|关联的订单号|1'',',
        'MODIFY COLUMN transaction_type VARCHAR(20) NOT NULL COMMENT ''5|类型|交易类型|RECHARGE=充值, CONSUME=消费, REFUND=退款, FREEZE=冻结, UNFREEZE=解冻|1'',',
        'MODIFY COLUMN amount DECIMAL(10,2) NOT NULL COMMENT ''6|金额|交易金额|正数为收入负数为支出|1'',',
        'MODIFY COLUMN balance_before DECIMAL(10,2) NOT NULL COMMENT ''7|金额|交易前余额|交易前账户余额|1'',',
        'MODIFY COLUMN balance_after DECIMAL(10,2) NOT NULL COMMENT ''8|金额|交易后余额|交易后账户余额|1'',',
        'MODIFY COLUMN description VARCHAR(200) COMMENT ''9|信息|描述|交易描述说明|1'',',
        'MODIFY COLUMN status VARCHAR(20) NOT NULL COMMENT ''10|状态|交易状态|SUCCESS=成功, FAILED=失败, PENDING=处理中|1'',',
        'MODIFY COLUMN created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT ''11|系统|创建时间|记录创建时间|0'''
    ),
    'SELECT ''wallet_transactions表不存在，跳过'' AS info'
);

PREPARE stmt_wallet_transactions FROM @sql_wallet_transactions;
EXECUTE stmt_wallet_transactions;
DEALLOCATE PREPARE stmt_wallet_transactions;

SELECT '✓ 钱包交易记录表注释更新完成' AS result;

-- ============================================================================
-- 第九部分：更新设备表 (devices) 的注释
-- ============================================================================

-- 检查 devices 表是否存在
SET @devices_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'devices');

SET @sql_devices = IF(@devices_exists > 0,
    CONCAT(
        'ALTER TABLE devices COMMENT=''设备主表|存储智能设备信息和状态'';',
        'ALTER TABLE devices ',
        'MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT COMMENT ''1|系统|设备ID|设备唯一标识|1'',',
        'MODIFY COLUMN device_id VARCHAR(50) NOT NULL COMMENT ''2|核心|设备编号|设备唯一编号|1'',',
        'MODIFY COLUMN device_name VARCHAR(100) NOT NULL COMMENT ''3|核心|设备名称|设备显示名称|1'',',
        'MODIFY COLUMN device_type VARCHAR(20) NOT NULL COMMENT ''4|核心|设备类型|智能锁/传感器等|1'',',
        'MODIFY COLUMN store_id BIGINT NOT NULL COMMENT ''5|关联|门店ID|所属门店ID|1'',',
        'MODIFY COLUMN room_id BIGINT COMMENT ''6|关联|房间ID|所属房间ID|1'',',
        'MODIFY COLUMN brand VARCHAR(50) COMMENT ''7|规格|品牌|设备品牌|1'',',
        'MODIFY COLUMN model VARCHAR(50) COMMENT ''8|规格|型号|设备型号|1'',',
        'MODIFY COLUMN ip_address VARCHAR(20) COMMENT ''9|网络|IP地址|设备IP地址|1'',',
        'MODIFY COLUMN mac_address VARCHAR(20) COMMENT ''10|网络|MAC地址|设备MAC地址|1'',',
        'MODIFY COLUMN firmware_version VARCHAR(20) COMMENT ''11|规格|固件版本|固件版本号|1'',',
        'MODIFY COLUMN battery_level INT COMMENT ''12|状态|电量|电池电量百分比|1'',',
        'MODIFY COLUMN signal_strength INT COMMENT ''13|状态|信号强度|信号强度值|1'',',
        'MODIFY COLUMN online_status TINYINT DEFAULT 0 COMMENT ''14|状态|在线状态|0=离线, 1=在线|1'',',
        'MODIFY COLUMN last_heartbeat TIMESTAMP COMMENT ''15|时间|心跳时间|最后心跳时间|1'',',
        'MODIFY COLUMN config VARCHAR(1000) COMMENT ''16|配置|配置数据|设备配置JSON|0'',',
        'MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT ''17|状态|激活状态|0=禁用, 1=正常|1'',',
        'MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''18|系统|创建时间|记录创建时间|0'',',
        'MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''19|系统|更新时间|记录更新时间|0'''
    ),
    'SELECT ''devices表不存在，跳过'' AS info'
);

PREPARE stmt_devices FROM @sql_devices;
EXECUTE stmt_devices;
DEALLOCATE PREPARE stmt_devices;

SELECT '✓ 设备表注释更新完成' AS result;

-- ============================================================================
-- 第十部分：更新管理员表 (admins) 的注释
-- ============================================================================

-- 检查 admins 表是否存在
SET @admins_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'admins');

SET @sql_admins = IF(@admins_exists > 0,
    CONCAT(
        'ALTER TABLE admins COMMENT=''管理员主表|存储系统管理员信息'';',
        'ALTER TABLE admins ',
        'MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT COMMENT ''1|系统|管理员ID|管理员唯一标识|1'',',
        'MODIFY COLUMN username VARCHAR(50) NOT NULL COMMENT ''2|核心|用户名|登录用户名|1'',',
        'MODIFY COLUMN password VARCHAR(100) NOT NULL COMMENT ''3|核心|密码|加密后的密码|0'',',
        'MODIFY COLUMN real_name VARCHAR(50) COMMENT ''4|资料|真实姓名|管理员真实姓名|1'',',
        'MODIFY COLUMN phone VARCHAR(20) COMMENT ''5|联系|手机号|联系电话|1'',',
        'MODIFY COLUMN email VARCHAR(100) COMMENT ''6|联系|邮箱|电子邮箱|1'',',
        'MODIFY COLUMN avatar VARCHAR(500) COMMENT ''7|资料|头像|管理员头像URL|1'',',
        'MODIFY COLUMN role VARCHAR(20) DEFAULT ''admin'' COMMENT ''8|角色|角色类型|super=超级管理员, admin=普通管理员|1'',',
        'MODIFY COLUMN store_ids VARCHAR(500) COMMENT ''9|角色|管理门店|可管理的门店ID列表|1'',',
        'MODIFY COLUMN permissions VARCHAR(1000) COMMENT ''10|角色|权限|权限列表JSON|0'',',
        'MODIFY COLUMN last_login_at TIMESTAMP COMMENT ''11|登录|最后登录时间|最后登录时间|1'',',
        'MODIFY COLUMN last_login_ip VARCHAR(50) COMMENT ''12|登录|最后登录IP|最后登录IP地址|1'',',
        'MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT ''13|状态|激活状态|0=禁用, 1=正常|1'',',
        'MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''14|系统|创建时间|记录创建时间|0'',',
        'MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''15|系统|更新时间|记录更新时间|0'''
    ),
    'SELECT ''admins表不存在，跳过'' AS info'
);

PREPARE stmt_admins FROM @sql_admins;
EXECUTE stmt_admins;
DEALLOCATE PREPARE stmt_admins;

SELECT '✓ 管理员表注释更新完成' AS result;

-- ============================================================================
-- 第十一部分：更新系统配置表 (system_config) 的注释
-- ============================================================================

-- 检查 system_config 表是否存在
SET @system_config_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = 'easy_joy_life_db' 
    AND TABLE_NAME = 'system_config');

SET @sql_system_config = IF(@system_config_exists > 0,
    CONCAT(
        'ALTER TABLE system_config COMMENT=''系统配置|存储全局系统配置参数'';',
        'ALTER TABLE system_config ',
        'MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT COMMENT ''1|系统|配置ID|配置记录唯一标识|1'',',
        'MODIFY COLUMN config_key VARCHAR(100) NOT NULL COMMENT ''2|核心|配置键|配置项唯一标识|1'',',
        'MODIFY COLUMN config_value TEXT COMMENT ''3|核心|配置值|配置项的值|1'',',
        'MODIFY COLUMN description VARCHAR(200) COMMENT ''4|信息|说明|配置项用途说明|1'',',
        'MODIFY COLUMN type VARCHAR(20) DEFAULT ''string'' COMMENT ''5|类型|数据类型|string=字符串, number=数字, boolean=布尔, json=JSON对象|1'',',
        'MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''6|系统|创建时间|记录创建时间|0'',',
        'MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''7|系统|更新时间|记录更新时间|0'''
    ),
    'SELECT ''system_config表不存在，跳过'' AS info'
);

PREPARE stmt_system_config FROM @sql_system_config;
EXECUTE stmt_system_config;
DEALLOCATE PREPARE stmt_system_config;

SELECT '✓ 系统配置表注释更新完成' AS result;

-- ============================================================================
-- 完成提示
-- ============================================================================

SELECT '
============================================================================
✓ 数据库注释规范化完成！

已按照 ZERO 开发规范更新以下内容：
1. 所有表的注释格式：中文名称|功能说明
2. 所有字段的注释格式：序号|中文字段分类|中文字段名|详细说明|是否显示

注意事项：
- 表名和字段名保持不变
- 仅更新了注释内容
- 符合 ZERO 规范的三段式命名理念（通过注释体现）

下一步建议：
1. 在数据库客户端中查看更新后的表结构
2. 验证注释是否正确显示
3. 如需调整，可修改本脚本后重新执行
============================================================================
' AS '完成提示';
