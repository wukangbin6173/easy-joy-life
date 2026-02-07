-- ============================================================================
-- 易享生活无人棋牌室管理系统 - 数据库规范化脚本
-- 基于 ZERO 开发规范
-- 创建日期: 2026-02-07
-- ============================================================================

-- 使用数据库
USE easy_joy_life_db;

-- ============================================================================
-- 第一部分：用户相关表
-- ============================================================================

-- 用户主表 (users_list)
-- 表注释格式：中文名称|功能说明
DROP TABLE IF EXISTS users_list;
CREATE TABLE users_list (
    -- 系统字段（固定位置）
    id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|用户ID|用户唯一标识|1',
    
    -- 核心字段（高查看 + 低修改）
    user_core_openid VARCHAR(100) NOT NULL UNIQUE 
        COMMENT '2|核心|微信OpenID|微信小程序用户唯一标识|1',
    user_core_unionid VARCHAR(100) 
        COMMENT '3|核心|微信UnionID|微信开放平台统一标识|1',
    
    -- 资料字段（高查看 + 中修改）
    user_profile_nickname VARCHAR(50) 
        COMMENT '4|资料|昵称|用户显示名称|1',
    user_profile_avatar VARCHAR(500) 
        COMMENT '5|资料|头像|用户头像图片URL|1',
    user_profile_realname VARCHAR(50) 
        COMMENT '6|资料|真实姓名|用户真实姓名|1',
    user_profile_gender TINYINT DEFAULT 0 
        COMMENT '7|资料|性别|0=未知, 1=男, 2=女|1',
    user_profile_birthday DATE 
        COMMENT '8|资料|生日|用户出生日期|1',
    user_profile_idcard VARCHAR(20) 
        COMMENT '9|资料|身份证号|用户身份证号码|0',
    
    -- 绑定字段（中查看 + 低修改）
    user_bind_phone VARCHAR(20) 
        COMMENT '10|绑定|手机号|已验证的手机号码|1',
    
    -- 等级字段（中查看 + 中修改）
    user_level_current TINYINT DEFAULT 1 
        COMMENT '11|等级|当前等级|用户会员等级|1',
    user_level_points INT DEFAULT 0 
        COMMENT '12|等级|积分|用户当前积分|1',
    
    -- 余额字段（高查看 + 高修改）
    user_balance_amount DECIMAL(10,2) DEFAULT 0.00 
        COMMENT '13|余额|金额|用户账户余额|1',
    
    -- 状态字段（高查看 + 高修改）
    user_status_active TINYINT DEFAULT 1 
        COMMENT '14|状态|激活状态|0=禁用, 1=正常|1',
    
    -- 系统时间戳（固定位置）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '15|系统|创建时间|记录创建时间|0',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '16|系统|更新时间|记录更新时间|0',
    
    PRIMARY KEY (id),
    INDEX idx_openid (user_core_openid),
    INDEX idx_phone (user_bind_phone),
    INDEX idx_status (user_status_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='用户主表|存储用户基础信息和认证信息';

-- ============================================================================
-- 第二部分：门店相关表
-- ============================================================================

-- 门店主表 (stores_list)
DROP TABLE IF EXISTS stores_list;
CREATE TABLE stores_list (
    -- 系统字段
    id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|门店ID|门店唯一标识|1',
    
    -- 核心字段
    store_core_name VARCHAR(100) NOT NULL 
        COMMENT '2|核心|门店名称|门店显示名称|1',
    store_core_address VARCHAR(200) NOT NULL 
        COMMENT '3|核心|地址|门店详细地址|1',
    
    -- 位置字段
    store_location_longitude DECIMAL(10,6) 
        COMMENT '4|位置|经度|地理位置经度|1',
    store_location_latitude DECIMAL(10,6) 
        COMMENT '5|位置|纬度|地理位置纬度|1',
    
    -- 联系字段
    store_contact_phone VARCHAR(20) 
        COMMENT '6|联系|电话|门店联系电话|1',
    
    -- 信息字段
    store_info_description TEXT 
        COMMENT '7|信息|描述|门店详细描述|1',
    store_info_images VARCHAR(1000) 
        COMMENT '8|信息|图片|门店图片URL列表|1',
    store_info_hours VARCHAR(500) 
        COMMENT '9|信息|营业时间|营业时间说明|1',
    store_info_facilities VARCHAR(1000) 
        COMMENT '10|信息|设施|门店设施列表|1',
    
    -- 状态字段
    store_status_active TINYINT DEFAULT 1 
        COMMENT '11|状态|激活状态|0=禁用, 1=正常|1',
    
    -- 系统时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '12|系统|创建时间|记录创建时间|0',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '13|系统|更新时间|记录更新时间|0',
    
    PRIMARY KEY (id),
    INDEX idx_status (store_status_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='门店主表|存储门店基础信息和位置信息';

-- 房间主表 (rooms_list)
DROP TABLE IF EXISTS rooms_list;
CREATE TABLE rooms_list (
    -- 系统字段
    id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|房间ID|房间唯一标识|1',
    store_id BIGINT NOT NULL 
        COMMENT '2|系统|门店ID|所属门店ID|1',
    
    -- 核心字段
    room_core_no VARCHAR(20) NOT NULL 
        COMMENT '3|核心|房间号|房间编号|1',
    room_core_name VARCHAR(50) NOT NULL 
        COMMENT '4|核心|房间名称|房间显示名称|1',
    room_core_type VARCHAR(20) NOT NULL 
        COMMENT '5|核心|房间类型|麻将房/扑克房等|1',
    
    -- 规格字段
    room_spec_capacity INT NOT NULL 
        COMMENT '6|规格|容量|可容纳人数|1',
    room_spec_area DECIMAL(5,2) 
        COMMENT '7|规格|面积|房间面积(平方米)|1',
    
    -- 价格字段
    room_price_hourly DECIMAL(8,2) NOT NULL 
        COMMENT '8|价格|时价|每小时价格|1',
    
    -- 信息字段
    room_info_images VARCHAR(1000) 
        COMMENT '9|信息|图片|房间图片URL列表|1',
    room_info_facilities VARCHAR(1000) 
        COMMENT '10|信息|设施|房间设施列表|1',
    
    -- 设备字段
    room_device_id VARCHAR(50) 
        COMMENT '11|设备|设备ID|关联的智能设备ID|1',
    room_device_locktype VARCHAR(20) DEFAULT 'wifi' 
        COMMENT '12|设备|锁类型|智能锁类型|1',
    
    -- 状态字段
    room_status_active TINYINT DEFAULT 1 
        COMMENT '13|状态|激活状态|0=禁用, 1=正常|1',
    
    -- 系统时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '14|系统|创建时间|记录创建时间|0',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '15|系统|更新时间|记录更新时间|0',
    
    PRIMARY KEY (id),
    INDEX idx_store (store_id),
    INDEX idx_status (room_status_active),
    FOREIGN KEY (store_id) REFERENCES stores_list(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='房间主表|存储房间基础信息和价格信息';

-- ============================================================================
-- 第三部分：订单相关表
-- ============================================================================

-- 订单主表 (orders_list)
DROP TABLE IF EXISTS orders_list;
CREATE TABLE orders_list (
    -- 系统字段
    id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|订单ID|订单唯一标识|1',
    user_id BIGINT NOT NULL 
        COMMENT '2|系统|用户ID|下单用户ID|1',
    
    -- 核心字段
    order_core_no VARCHAR(32) NOT NULL UNIQUE 
        COMMENT '3|核心|订单号|订单唯一编号|1',
    
    -- 关联字段
    order_relation_store BIGINT NOT NULL 
        COMMENT '4|关联|门店ID|预订门店ID|1',
    order_relation_room BIGINT NOT NULL 
        COMMENT '5|关联|房间ID|预订房间ID|1',
    
    -- 时间字段
    order_time_start TIMESTAMP NOT NULL 
        COMMENT '6|时间|开始时间|预订开始时间|1',
    order_time_end TIMESTAMP NOT NULL 
        COMMENT '7|时间|结束时间|预订结束时间|1',
    order_time_duration INT NOT NULL 
        COMMENT '8|时间|时长|预订时长(分钟)|1',
    order_time_actualstart TIMESTAMP 
        COMMENT '9|时间|实际开始|实际使用开始时间|1',
    order_time_actualend TIMESTAMP 
        COMMENT '10|时间|实际结束|实际使用结束时间|1',
    order_time_unlock TIMESTAMP 
        COMMENT '11|时间|开锁时间|门锁开启时间|1',
    
    -- 价格字段
    order_price_unit DECIMAL(8,2) NOT NULL 
        COMMENT '12|价格|单价|每小时单价|1',
    order_price_total DECIMAL(10,2) NOT NULL 
        COMMENT '13|价格|总价|订单总金额|1',
    order_price_discount DECIMAL(10,2) DEFAULT 0.00 
        COMMENT '14|价格|优惠|优惠金额|1',
    order_price_actual DECIMAL(10,2) NOT NULL 
        COMMENT '15|价格|实付|实际支付金额|1',
    
    -- 支付字段
    order_payment_method VARCHAR(20) DEFAULT 'wechat' 
        COMMENT '16|支付|方式|支付方式|1',
    order_payment_status TINYINT DEFAULT 0 
        COMMENT '17|支付|状态|0=待支付, 1=已支付, 2=已退款|1',
    
    -- 状态字段
    order_status_current TINYINT DEFAULT 0 
        COMMENT '18|状态|订单状态|0=待支付, 1=已支付, 2=使用中, 3=已完成, 4=已取消|1',
    
    -- 开锁字段
    order_unlock_code VARCHAR(20) 
        COMMENT '19|开锁|密码|开锁密码|1',
    
    -- 备注字段
    order_info_remark VARCHAR(500) 
        COMMENT '20|信息|备注|订单备注信息|1',
    
    -- 系统时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '21|系统|创建时间|记录创建时间|0',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '22|系统|更新时间|记录更新时间|0',
    
    PRIMARY KEY (id),
    INDEX idx_user (user_id),
    INDEX idx_order_no (order_core_no),
    INDEX idx_status (order_status_current),
    INDEX idx_payment_status (order_payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='订单主表|存储房间预订订单信息';

-- ============================================================================
-- 第四部分：支付相关表
-- ============================================================================

-- 支付记录表 (payments_log)
DROP TABLE IF EXISTS payments_log;
CREATE TABLE payments_log (
    -- 系统字段
    id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|支付ID|支付记录唯一标识|1',
    
    -- 关联字段
    payment_relation_order BIGINT NOT NULL 
        COMMENT '2|关联|订单ID|关联的订单ID|1',
    
    -- 核心字段
    payment_core_no VARCHAR(32) NOT NULL UNIQUE 
        COMMENT '3|核心|支付单号|支付单号|1',
    payment_core_thirdno VARCHAR(64) 
        COMMENT '4|核心|第三方单号|第三方支付平台单号|1',
    
    -- 支付字段
    payment_method_type VARCHAR(20) NOT NULL 
        COMMENT '5|支付|方式|wechat=微信, alipay=支付宝|1',
    payment_amount_total DECIMAL(10,2) NOT NULL 
        COMMENT '6|支付|金额|支付金额|1',
    
    -- 状态字段
    payment_status_current TINYINT DEFAULT 0 
        COMMENT '7|状态|支付状态|0=待支付, 1=已支付, 2=已退款|1',
    
    -- 时间字段
    payment_time_paid TIMESTAMP 
        COMMENT '8|时间|支付时间|完成支付时间|1',
    payment_time_refund TIMESTAMP 
        COMMENT '9|时间|退款时间|完成退款时间|1',
    
    -- 退款字段
    payment_refund_amount DECIMAL(10,2) DEFAULT 0.00 
        COMMENT '10|退款|金额|退款金额|1',
    
    -- 系统时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '11|系统|创建时间|记录创建时间|0',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '12|系统|更新时间|记录更新时间|0',
    
    PRIMARY KEY (id),
    INDEX idx_order (payment_relation_order),
    INDEX idx_payment_no (payment_core_no),
    INDEX idx_status (payment_status_current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='支付记录|记录订单支付和退款信息';

-- 支付订单表 (payment_orders_list)
DROP TABLE IF EXISTS payment_orders_list;
CREATE TABLE payment_orders_list (
    -- 系统字段
    id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|订单ID|支付订单唯一标识|1',
    user_id BIGINT NOT NULL 
        COMMENT '2|系统|用户ID|支付用户ID|1',
    
    -- 核心字段
    payorder_core_no VARCHAR(32) NOT NULL UNIQUE 
        COMMENT '3|核心|订单号|支付订单号|1',
    payorder_core_tradeno VARCHAR(64) 
        COMMENT '4|核心|交易号|第三方交易号|1',
    
    -- 类型字段
    payorder_type_payment VARCHAR(20) NOT NULL 
        COMMENT '5|类型|支付类型|RECHARGE=充值, BOOKING=预订|1',
    payorder_type_method VARCHAR(20) NOT NULL 
        COMMENT '6|类型|支付方式|ALIPAY=支付宝, WECHAT=微信|1',
    
    -- 金额字段
    payorder_amount_total DECIMAL(10,2) NOT NULL 
        COMMENT '7|金额|金额|支付金额|1',
    
    -- 信息字段
    payorder_info_subject VARCHAR(100) NOT NULL 
        COMMENT '8|信息|标题|订单标题|1',
    payorder_info_body VARCHAR(500) 
        COMMENT '9|信息|描述|订单描述|1',
    payorder_info_extra TEXT 
        COMMENT '10|信息|扩展|扩展信息JSON|0',
    
    -- 状态字段
    payorder_status_current VARCHAR(20) NOT NULL 
        COMMENT '11|状态|订单状态|PENDING=待支付, PAID=已支付, CANCELLED=已取消, REFUNDED=已退款|1',
    
    -- 时间字段
    payorder_time_paid DATETIME 
        COMMENT '12|时间|支付时间|完成支付时间|1',
    payorder_time_expire DATETIME 
        COMMENT '13|时间|过期时间|订单过期时间|1',
    
    -- 通知字段
    payorder_notify_status VARCHAR(20) 
        COMMENT '14|通知|状态|PENDING=待通知, SUCCESS=成功, FAILED=失败|1',
    payorder_notify_count INT DEFAULT 0 
        COMMENT '15|通知|次数|回调通知次数|1',
    
    -- 系统时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '16|系统|创建时间|记录创建时间|0',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '17|系统|更新时间|记录更新时间|0',
    
    PRIMARY KEY (id),
    INDEX idx_user (user_id),
    INDEX idx_order_no (payorder_core_no),
    INDEX idx_trade_no (payorder_core_tradeno),
    INDEX idx_status (payorder_status_current),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='支付订单|存储充值和预订的支付订单';

-- ============================================================================
-- 第五部分：钱包相关表
-- ============================================================================

-- 用户钱包表 (user_wallets_data)
DROP TABLE IF EXISTS user_wallets_data;
CREATE TABLE user_wallets_data (
    -- 系统字段
    id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|钱包ID|钱包唯一标识|1',
    user_id BIGINT NOT NULL UNIQUE 
        COMMENT '2|系统|用户ID|关联用户ID|1',
    
    -- 余额字段
    wallet_balance_current DECIMAL(10,2) NOT NULL DEFAULT 0.00 
        COMMENT '3|余额|当前余额|账户可用余额|1',
    wallet_balance_frozen DECIMAL(10,2) NOT NULL DEFAULT 0.00 
        COMMENT '4|余额|冻结金额|冻结中的金额|1',
    
    -- 统计字段
    wallet_stat_recharge DECIMAL(10,2) NOT NULL DEFAULT 0.00 
        COMMENT '5|统计|累计充值|历史累计充值金额|1',
    wallet_stat_consume DECIMAL(10,2) NOT NULL DEFAULT 0.00 
        COMMENT '6|统计|累计消费|历史累计消费金额|1',
    
    -- 状态字段
    wallet_status_current VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' 
        COMMENT '7|状态|钱包状态|ACTIVE=正常, FROZEN=冻结, DISABLED=禁用|1',
    
    -- 系统时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '8|系统|创建时间|记录创建时间|0',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '9|系统|更新时间|记录更新时间|0',
    
    PRIMARY KEY (id),
    INDEX idx_user (user_id),
    INDEX idx_status (wallet_status_current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='用户钱包|存储用户钱包余额和统计信息';

-- 钱包交易记录表 (wallet_transactions_log)
DROP TABLE IF EXISTS wallet_transactions_log;
CREATE TABLE wallet_transactions_log (
    -- 系统字段
    id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|交易ID|交易记录唯一标识|1',
    user_id BIGINT NOT NULL 
        COMMENT '2|系统|用户ID|交易用户ID|1',
    
    -- 核心字段
    trans_core_no VARCHAR(32) NOT NULL UNIQUE 
        COMMENT '3|核心|交易流水号|交易唯一编号|1',
    
    -- 关联字段
    trans_relation_order VARCHAR(32) 
        COMMENT '4|关联|订单号|关联的订单号|1',
    
    -- 类型字段
    trans_type_category VARCHAR(20) NOT NULL 
        COMMENT '5|类型|交易类型|RECHARGE=充值, CONSUME=消费, REFUND=退款, FREEZE=冻结, UNFREEZE=解冻|1',
    
    -- 金额字段
    trans_amount_value DECIMAL(10,2) NOT NULL 
        COMMENT '6|金额|交易金额|正数为收入负数为支出|1',
    trans_amount_before DECIMAL(10,2) NOT NULL 
        COMMENT '7|金额|交易前余额|交易前账户余额|1',
    trans_amount_after DECIMAL(10,2) NOT NULL 
        COMMENT '8|金额|交易后余额|交易后账户余额|1',
    
    -- 信息字段
    trans_info_description VARCHAR(200) 
        COMMENT '9|信息|描述|交易描述说明|1',
    
    -- 状态字段
    trans_status_current VARCHAR(20) NOT NULL 
        COMMENT '10|状态|交易状态|SUCCESS=成功, FAILED=失败, PENDING=处理中|1',
    
    -- 系统时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '11|系统|创建时间|记录创建时间|0',
    
    PRIMARY KEY (id),
    INDEX idx_user (user_id),
    INDEX idx_trans_no (trans_core_no),
    INDEX idx_order_no (trans_relation_order),
    INDEX idx_type (trans_type_category),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='钱包交易记录|记录钱包所有交易流水';

-- ============================================================================
-- 第六部分：设备相关表
-- ============================================================================

-- 设备主表 (devices_list)
DROP TABLE IF EXISTS devices_list;
CREATE TABLE devices_list (
    -- 系统字段
    id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|设备ID|设备唯一标识|1',
    
    -- 核心字段
    device_core_id VARCHAR(50) NOT NULL UNIQUE 
        COMMENT '2|核心|设备编号|设备唯一编号|1',
    device_core_name VARCHAR(100) NOT NULL 
        COMMENT '3|核心|设备名称|设备显示名称|1',
    device_core_type VARCHAR(20) NOT NULL 
        COMMENT '4|核心|设备类型|智能锁/传感器等|1',
    
    -- 关联字段
    device_relation_store BIGINT NOT NULL 
        COMMENT '5|关联|门店ID|所属门店ID|1',
    device_relation_room BIGINT 
        COMMENT '6|关联|房间ID|所属房间ID|1',
    
    -- 规格字段
    device_spec_brand VARCHAR(50) 
        COMMENT '7|规格|品牌|设备品牌|1',
    device_spec_model VARCHAR(50) 
        COMMENT '8|规格|型号|设备型号|1',
    device_spec_firmware VARCHAR(20) 
        COMMENT '9|规格|固件版本|固件版本号|1',
    
    -- 网络字段
    device_network_ip VARCHAR(20) 
        COMMENT '10|网络|IP地址|设备IP地址|1',
    device_network_mac VARCHAR(20) 
        COMMENT '11|网络|MAC地址|设备MAC地址|1',
    
    -- 状态字段
    device_status_battery INT 
        COMMENT '12|状态|电量|电池电量百分比|1',
    device_status_signal INT 
        COMMENT '13|状态|信号强度|信号强度值|1',
    device_status_online TINYINT DEFAULT 0 
        COMMENT '14|状态|在线状态|0=离线, 1=在线|1',
    device_status_active TINYINT DEFAULT 1 
        COMMENT '15|状态|激活状态|0=禁用, 1=正常|1',
    
    -- 时间字段
    device_time_heartbeat TIMESTAMP 
        COMMENT '16|时间|心跳时间|最后心跳时间|1',
    
    -- 配置字段
    device_config_data VARCHAR(1000) 
        COMMENT '17|配置|配置数据|设备配置JSON|0',
    
    -- 系统时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '18|系统|创建时间|记录创建时间|0',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '19|系统|更新时间|记录更新时间|0',
    
    PRIMARY KEY (id),
    INDEX idx_device_id (device_core_id),
    INDEX idx_store (device_relation_store),
    INDEX idx_room (device_relation_room),
    INDEX idx_status (device_status_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='设备主表|存储智能设备信息和状态';

-- ============================================================================
-- 第七部分：管理员相关表
-- ============================================================================

-- 管理员主表 (admins_list)
DROP TABLE IF EXISTS admins_list;
CREATE TABLE admins_list (
    -- 系统字段
    id BIGINT AUTO_INCREMENT 
        COMMENT '1|系统|管理员ID|管理员唯一标识|1',
    
    -- 核心字段
    admin_core_username VARCHAR(50) NOT NULL UNIQUE 
        COMMENT '2|核心|用户名|登录用户名|1',
    admin_core_password VARCHAR(100) NOT NULL 
        COMMENT '3|核心|密码|加密后的密码|0',
    
    -- 资料字段
    admin_profile_realname VARCHAR(50) 
        COMMENT '4|资料|真实姓名|管理员真实姓名|1',
    admin_profile_avatar VARCHAR(500) 
        COMMENT '5|资料|头像|管理员头像URL|1',
    
    -- 联系字段
    admin_contact_phone VARCHAR(20) 
        COMMENT '6|联系|手机号|联系电话|1',
    admin_contact_email VARCHAR(100) 
        COMMENT '7|联系|邮箱|电子邮箱|1',
    
    -- 角色字段
    admin_role_type VARCHAR(20) DEFAULT 'admin' 
        COMMENT '8|角色|角色类型|super=超级管理员, admin=普通管理员|1',
    admin_role_stores VARCHAR(500) 
        COMMENT '9|角色|管理门店|可管理的门店ID列表|1',
    admin_role_permissions VARCHAR(1000) 
        COMMENT '10|角色|权限|权限列表JSON|0',
    
    -- 登录字段
    admin_login_lasttime TIMESTAMP 
        COMMENT '11|登录|最后登录时间|最后登录时间|1',
    admin_login_lastip VARCHAR(50) 
        COMMENT '12|登录|最后登录IP|最后登录IP地址|1',
    
    -- 状态字段
    admin_status_active TINYINT DEFAULT 1 
        COMMENT '13|状态|激活状态|0=禁用, 1=正常|1',
    
    -- 系统时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT '14|系统|创建时间|记录创建时间|0',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '15|系统|更新时间|记录更新时间|0',
    
    PRIMARY KEY (id),
    INDEX idx_username (admin_core_username),
    INDEX idx_status (admin_status_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='管理员主表|存储系统管理员信息';

-- ============================================================================
-- 第八部分：系统配置表（Key-Value 纵向表）
-- ============================================================================

-- 系统配置表 (system_config_settings)
DROP TABLE IF EXISTS system_config_settings;
CREATE TABLE system_config_settings (
    -- 配置键（主键）
    settings_core_key VARCHAR(100) NOT NULL 
        COMMENT '1|核心|配置键|配置项唯一标识|1',
    
    -- 配置值
    settings_core_value TEXT 
        COMMENT '2|核心|配置值|配置项的值|1',
    
    -- 名称
    settings_display_label VARCHAR(100) 
        COMMENT '3|显示|名称|配置项中文名称|1',
    
    -- 说明
    settings_info_hint VARCHAR(200) 
        COMMENT '4|信息|说明|配置项用途说明|1',
    
    -- 类型
    settings_type_category VARCHAR(20) DEFAULT 'string' 
        COMMENT '5|类型|数据类型|string=字符串, number=数字, boolean=布尔, json=JSON对象|1',
    
    -- 系统时间戳
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '6|系统|更新时间|记录更新时间|0',
    
    PRIMARY KEY (settings_core_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='系统配置|存储全局系统配置参数';

-- ============================================================================
-- 数据迁移说明
-- ============================================================================
-- 
-- 本脚本创建了符合 ZERO 规范的新表结构
-- 
-- 迁移步骤：
-- 1. 备份现有数据库
-- 2. 执行本脚本创建新表
-- 3. 使用数据迁移脚本将旧表数据迁移到新表
-- 4. 验证数据完整性
-- 5. 更新应用程序代码以使用新表名和字段名
-- 6. 删除旧表
-- 
-- ============================================================================
