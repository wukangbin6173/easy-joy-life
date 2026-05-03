-- 易享生活棋牌室数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS easy_joy_life_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE easy_joy_life_db;

-- 删除已存在的表（如果有）
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS store;

-- 创建门店表（使用复数形式）
CREATE TABLE stores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '门店名称',
    address VARCHAR(255) NOT NULL COMMENT '门店地址',
    longitude DECIMAL(10, 6) COMMENT '经度',
    latitude DECIMAL(10, 6) COMMENT '纬度',
    phone VARCHAR(20) COMMENT '联系电话',
    description TEXT COMMENT '门店描述',
    image VARCHAR(200) COMMENT '门店图片',
    business_hours VARCHAR(50) COMMENT '营业时间',
    facilities TEXT COMMENT '设施信息',
    status INT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='门店表';

-- 创建房间表（使用复数形式）
CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT NOT NULL COMMENT '所属门店ID',
    room_no VARCHAR(20) NOT NULL COMMENT '房间号',
    name VARCHAR(100) NOT NULL COMMENT '房间名称',
    type VARCHAR(50) NOT NULL COMMENT '房间类型',
    capacity INT NOT NULL COMMENT '容量',
    area DECIMAL(8, 2) COMMENT '面积(平方米)',
    hourly_rate DECIMAL(10, 2) NOT NULL COMMENT '每小时价格',
    image VARCHAR(200) COMMENT '房间图片',
    facilities TEXT COMMENT '设施信息',
    status INT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间表';

-- 插入门店测试数据
INSERT INTO stores (name, address, longitude, latitude, phone, description, image, business_hours, facilities, status) VALUES
('易享生活棋牌室(万达店)', '北京市朝阳区建国路93号万达广场3层', 116.447587, 39.937075, '010-12345678', '环境优雅，设施齐全的高端棋牌室', '/images/store-logo-1.jpg', '09:00-02:00', '智能门锁,中央空调,免费WiFi,茶水服务,停车位', 1),
('易享生活棋牌室(中心店)', '北京市海淀区中关村大街27号中关村大厦', 116.310316, 39.983424, '010-87654321', '科技感十足的智能棋牌室', '/images/store-logo-2.jpg', '24小时营业', '智能门锁,新风系统,高速WiFi,咖啡机,充电桩', 1),
('易享生活棋牌室(西单店)', '北京市西城区西单北大街120号西单商场', 116.366794, 39.906901, '010-11223344', '交通便利，停车方便', '/images/store-logo-3.jpg', '10:00-24:00', '智能门锁,空气净化,免费WiFi,小食服务', 1),
('易享生活棋牌室(国贸店)', '北京市朝阳区建国门外大街1号国贸大厦', 116.458564, 39.908347, '010-55667788', '商务人士首选，高端大气', '/images/store-logo-4.jpg', '09:00-01:00', '智能门锁,商务设施,高速WiFi,会议室,秘书服务', 1),
('易享生活棋牌室(三里屯店)', '北京市朝阳区三里屯路19号三里屯太古里', 116.456621, 39.937456, '010-99887766', '时尚潮流，年轻人聚集地', '/images/store-logo-5.jpg', '12:00-03:00', '智能门锁,音响系统,免费WiFi,调酒服务,夜宵', 1);

-- 插入房间测试数据
INSERT INTO rooms (store_id, room_no, name, type, capacity, hourly_rate, image, facilities, status) VALUES
-- 万达店房间
(1, '101', '梅花厅', '麻将房', 4, 80.00, '/images/room-default.jpg', '自动麻将机,空调,茶水', 1),
(1, '102', '兰花厅', '麻将房', 4, 80.00, '/images/room-default.jpg', '自动麻将机,空调,茶水', 1),
(1, '103', '竹叶厅', '麻将房', 4, 100.00, '/images/room-default.jpg', '豪华自动麻将机,中央空调,高级茶具', 1),
(1, '104', '菊花厅', '扑克房', 6, 60.00, '/images/room-default.jpg', '扑克桌,空调,饮料', 1),
-- 中心店房间
(2, '201', 'VIP包间A', '麻将房', 4, 120.00, '/images/room-default.jpg', '豪华自动麻将机,按摩椅,咖啡机', 1),
(2, '202', 'VIP包间B', '麻将房', 4, 120.00, '/images/room-default.jpg', '豪华自动麻将机,按摩椅,咖啡机', 1),
(2, '203', '标准间C', '麻将房', 4, 90.00, '/images/room-default.jpg', '自动麻将机,空调,茶水', 1),
-- 西单店房间
(3, '301', '雅致包间', '麻将房', 4, 70.00, '/images/room-default.jpg', '自动麻将机,空调,茶水,小食', 1),
(3, '302', '温馨包间', '麻将房', 4, 70.00, '/images/room-default.jpg', '自动麻将机,空调,茶水,小食', 1),
-- 国贸店房间
(4, '401', '商务包间A', '麻将房', 4, 150.00, '/images/room-default.jpg', '豪华麻将机,商务设施,高级茶具', 1),
(4, '402', '商务包间B', '麻将房', 4, 150.00, '/images/room-default.jpg', '豪华麻将机,商务设施,高级茶具', 1),
-- 三里屯店房间
(5, '501', '潮流包间', '麻将房', 4, 100.00, '/images/room-default.jpg', '智能麻将机,音响系统,调酒台', 1),
(5, '502', '时尚包间', '麻将房', 4, 100.00, '/images/room-default.jpg', '智能麻将机,音响系统,调酒台', 1);
-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(50) NOT NULL UNIQUE COMMENT '微信openid',
    unionid VARCHAR(50) COMMENT '微信unionid',
    nickname VARCHAR(100) COMMENT '用户昵称',
    avatar VARCHAR(200) COMMENT '头像URL',
    gender INT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
    phone VARCHAR(20) COMMENT '手机号',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '用户状态：ACTIVE-正常，DISABLED-禁用',
    last_login_time DATETIME COMMENT '最后登录时间',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_openid (openid),
    INDEX idx_phone (phone),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 支付订单表
CREATE TABLE IF NOT EXISTS payment_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号',
    trade_no VARCHAR(64) COMMENT '第三方支付订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    payment_type VARCHAR(20) NOT NULL COMMENT '支付类型：RECHARGE-充值, BOOKING-预订',
    payment_method VARCHAR(20) NOT NULL COMMENT '支付方式：ALIPAY-支付宝, WECHAT-微信',
    amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    subject VARCHAR(100) NOT NULL COMMENT '订单标题',
    body VARCHAR(500) COMMENT '订单描述',
    status VARCHAR(20) NOT NULL COMMENT '订单状态：PENDING-待支付, PAID-已支付, CANCELLED-已取消, REFUNDED-已退款',
    paid_time DATETIME COMMENT '支付时间',
    expire_time DATETIME COMMENT '过期时间',
    notify_status VARCHAR(20) COMMENT '回调通知状态：PENDING-待通知, SUCCESS-成功, FAILED-失败',
    notify_count INT DEFAULT 0 COMMENT '回调通知次数',
    extra_data TEXT COMMENT '扩展信息（JSON格式）',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_order_no (order_no),
    INDEX idx_trade_no (trade_no),
    INDEX idx_status (status),
    INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付订单表';

-- 用户取消订单记录表
CREATE TABLE IF NOT EXISTS order_cancel_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    external_user_id VARCHAR(64) NOT NULL COMMENT '外部用户ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    merchant_id BIGINT COMMENT '商户ID',
    reason VARCHAR(200) COMMENT '取消原因',
    source VARCHAR(20) NOT NULL COMMENT '取消来源：USER-用户主动取消',
    cancelled_at DATETIME NOT NULL COMMENT '取消时间',
    lock_until DATETIME COMMENT '限制取消截止时间',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_order_cancel_user_time (external_user_id, cancelled_at),
    INDEX idx_order_cancel_lock (external_user_id, lock_until),
    INDEX idx_order_cancel_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户取消订单记录表';

-- 用户钱包表
CREATE TABLE IF NOT EXISTS user_wallets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE COMMENT '用户ID',
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '账户余额',
    frozen_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '冻结金额',
    total_recharge DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '累计充值金额',
    total_consume DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '累计消费金额',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '钱包状态：ACTIVE-正常, FROZEN-冻结, DISABLED-禁用',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户钱包表';

-- 钱包交易记录表
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_no VARCHAR(32) NOT NULL UNIQUE COMMENT '交易流水号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    order_no VARCHAR(32) COMMENT '关联订单号',
    transaction_type VARCHAR(20) NOT NULL COMMENT '交易类型：RECHARGE-充值, CONSUME-消费, REFUND-退款, FREEZE-冻结, UNFREEZE-解冻',
    amount DECIMAL(10,2) NOT NULL COMMENT '交易金额（正数为收入，负数为支出）',
    balance_before DECIMAL(10,2) NOT NULL COMMENT '交易前余额',
    balance_after DECIMAL(10,2) NOT NULL COMMENT '交易后余额',
    description VARCHAR(200) COMMENT '交易描述',
    status VARCHAR(20) NOT NULL COMMENT '交易状态：SUCCESS-成功, FAILED-失败, PENDING-处理中',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_transaction_no (transaction_no),
    INDEX idx_order_no (order_no),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='钱包交易记录表';

-- 插入测试用户数据
INSERT INTO users (openid, nickname, avatar, gender) VALUES 
('test_openid_001', '测试用户1', '/images/avatar1.png', 1),
('test_openid_002', '测试用户2', '/images/avatar2.png', 2),
('test_openid_003', '测试用户3', '/images/avatar3.png', 0)
ON DUPLICATE KEY UPDATE 
nickname = VALUES(nickname);

-- 插入测试用户钱包数据
INSERT INTO user_wallets (user_id, balance, total_recharge) VALUES 
(1, 168.50, 200.00),
(2, 88.00, 100.00),
(3, 256.80, 300.00)
ON DUPLICATE KEY UPDATE 
balance = VALUES(balance),
total_recharge = VALUES(total_recharge);

-- 插入测试交易记录
INSERT INTO wallet_transactions (transaction_no, user_id, transaction_type, amount, balance_before, balance_after, description, status) VALUES 
('TXN202601230001', 1, 'RECHARGE', 100.00, 68.50, 168.50, '钱包充值', 'SUCCESS'),
('TXN202601230002', 1, 'RECHARGE', 100.00, 0.00, 100.00, '钱包充值', 'SUCCESS'),
('TXN202601230003', 1, 'CONSUME', -31.50, 100.00, 68.50, '房间消费', 'SUCCESS'),
('TXN202601230004', 2, 'RECHARGE', 100.00, 0.00, 100.00, '钱包充值', 'SUCCESS'),
('TXN202601230005', 2, 'CONSUME', -12.00, 100.00, 88.00, '房间消费', 'SUCCESS'),
('TXN202601230006', 3, 'RECHARGE', 200.00, 0.00, 200.00, '钱包充值', 'SUCCESS'),
('TXN202601230007', 3, 'RECHARGE', 100.00, 200.00, 300.00, '钱包充值', 'SUCCESS'),
('TXN202601230008', 3, 'CONSUME', -43.20, 300.00, 256.80, '房间消费', 'SUCCESS')
ON DUPLICATE KEY UPDATE 
transaction_no = VALUES(transaction_no);
