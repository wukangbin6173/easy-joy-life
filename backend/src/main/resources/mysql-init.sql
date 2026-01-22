-- 创建数据库
CREATE DATABASE IF NOT EXISTS easy_joy_life_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE easy_joy_life_db;

-- 创建门店表
CREATE TABLE IF NOT EXISTS store (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '门店名称',
    address VARCHAR(255) NOT NULL COMMENT '门店地址',
    longitude DECIMAL(10, 6) COMMENT '经度',
    latitude DECIMAL(10, 6) COMMENT '纬度',
    phone VARCHAR(20) COMMENT '联系电话',
    description TEXT COMMENT '门店描述',
    images TEXT COMMENT '门店图片',
    business_hours VARCHAR(50) COMMENT '营业时间',
    facilities TEXT COMMENT '设施信息',
    status INT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='门店表';

-- 创建房间表
CREATE TABLE IF NOT EXISTS room (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT NOT NULL COMMENT '所属门店ID',
    room_no VARCHAR(20) NOT NULL COMMENT '房间号',
    name VARCHAR(100) NOT NULL COMMENT '房间名称',
    type VARCHAR(50) NOT NULL COMMENT '房间类型',
    capacity INT NOT NULL COMMENT '容量',
    area DECIMAL(8, 2) COMMENT '面积(平方米)',
    price_per_hour DECIMAL(10, 2) NOT NULL COMMENT '每小时价格',
    images TEXT COMMENT '房间图片',
    facilities TEXT COMMENT '设施信息',
    status INT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间表';

-- 插入门店测试数据
INSERT INTO store (name, address, longitude, latitude, phone, description, images, business_hours, facilities, status) VALUES
('易享生活棋牌室(万达店)', '北京市朝阳区建国路93号万达广场3层', 116.447587, 39.937075, '010-12345678', '环境优雅，设施齐全的高端棋牌室', '/images/store-logo-1.jpg', '09:00-02:00', '智能门锁,中央空调,免费WiFi,茶水服务,停车位', 1),
('易享生活棋牌室(中心店)', '北京市海淀区中关村大街27号中关村大厦', 116.310316, 39.983424, '010-87654321', '科技感十足的智能棋牌室', '/images/store-logo-2.jpg', '24小时营业', '智能门锁,新风系统,高速WiFi,咖啡机,充电桩', 1),
('易享生活棋牌室(西单店)', '北京市西城区西单北大街120号西单商场', 116.366794, 39.906901, '010-11223344', '交通便利，停车方便', '/images/store-logo-3.jpg', '10:00-24:00', '智能门锁,空气净化,免费WiFi,小食服务', 1),
('易享生活棋牌室(国贸店)', '北京市朝阳区建国门外大街1号国贸大厦', 116.458564, 39.908347, '010-55667788', '商务人士首选，高端大气', '/images/store-logo-4.jpg', '09:00-01:00', '智能门锁,商务设施,高速WiFi,会议室,秘书服务', 1),
('易享生活棋牌室(三里屯店)', '北京市朝阳区三里屯路19号三里屯太古里', 116.456621, 39.937456, '010-99887766', '时尚潮流，年轻人聚集地', '/images/store-logo-5.jpg', '12:00-03:00', '智能门锁,音响系统,免费WiFi,调酒服务,夜宵', 1);

-- 插入房间测试数据
INSERT INTO room (store_id, room_no, name, type, capacity, price_per_hour, images, facilities, status) VALUES
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