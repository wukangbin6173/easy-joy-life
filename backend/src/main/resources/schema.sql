-- 雀胜无人棋牌室管理系统数据库设计 (H2简化版本)

-- 用户表
CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  openid VARCHAR(100) NOT NULL,
  unionid VARCHAR(100),
  nickname VARCHAR(50),
  avatar VARCHAR(500),
  phone VARCHAR(20),
  real_name VARCHAR(50),
  id_card VARCHAR(20),
  gender TINYINT DEFAULT 0,
  birthday DATE,
  level TINYINT DEFAULT 1,
  points INT DEFAULT 0,
  balance DECIMAL(10,2) DEFAULT 0.00,
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 门店表
CREATE TABLE stores (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(200) NOT NULL,
  longitude DECIMAL(10,6),
  latitude DECIMAL(10,6),
  phone VARCHAR(20),
  description TEXT,
  images VARCHAR(1000),
  business_hours VARCHAR(500),
  facilities VARCHAR(1000),
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 房间表
CREATE TABLE rooms (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  store_id BIGINT NOT NULL,
  room_no VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,
  capacity INT NOT NULL,
  area DECIMAL(5,2),
  price_per_hour DECIMAL(8,2) NOT NULL,
  images VARCHAR(1000),
  facilities VARCHAR(1000),
  device_id VARCHAR(50),
  lock_type VARCHAR(20) DEFAULT 'wifi',
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE orders (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32) NOT NULL,
  user_id BIGINT NOT NULL,
  store_id BIGINT NOT NULL,
  room_id BIGINT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  duration INT NOT NULL,
  unit_price DECIMAL(8,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  actual_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'wechat',
  payment_status TINYINT DEFAULT 0,
  order_status TINYINT DEFAULT 0,
  unlock_code VARCHAR(20),
  unlock_time TIMESTAMP,
  actual_start_time TIMESTAMP,
  actual_end_time TIMESTAMP,
  remark VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 支付记录表
CREATE TABLE payments (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  payment_no VARCHAR(32) NOT NULL,
  third_party_no VARCHAR(64),
  payment_method VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TINYINT DEFAULT 0,
  paid_at TIMESTAMP,
  refund_amount DECIMAL(10,2) DEFAULT 0.00,
  refund_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 设备表
CREATE TABLE devices (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  device_id VARCHAR(50) NOT NULL,
  device_name VARCHAR(100) NOT NULL,
  device_type VARCHAR(20) NOT NULL,
  store_id BIGINT NOT NULL,
  room_id BIGINT,
  brand VARCHAR(50),
  model VARCHAR(50),
  ip_address VARCHAR(20),
  mac_address VARCHAR(20),
  firmware_version VARCHAR(20),
  battery_level INT,
  signal_strength INT,
  online_status TINYINT DEFAULT 0,
  last_heartbeat TIMESTAMP,
  config VARCHAR(1000),
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 管理员表
CREATE TABLE admins (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  real_name VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  avatar VARCHAR(500),
  role VARCHAR(20) DEFAULT 'admin',
  store_ids VARCHAR(500),
  permissions VARCHAR(1000),
  last_login_at TIMESTAMP,
  last_login_ip VARCHAR(50),
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 系统配置表
CREATE TABLE system_config (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(100) NOT NULL,
  config_value TEXT,
  description VARCHAR(200),
  type VARCHAR(20) DEFAULT 'string',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入初始数据
INSERT INTO admins (username, password, real_name, role) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKTY.5zt6C/DVdyFYST0VDYmZ2Oa', '超级管理员', 'super');

INSERT INTO system_config (config_key, config_value, description, type) VALUES 
('wechat.appid', '', '微信小程序AppID', 'string'),
('wechat.secret', '', '微信小程序Secret', 'string'),
('wechat.mch_id', '', '微信商户号', 'string'),
('wechat.api_key', '', '微信支付密钥', 'string'),
('system.name', '雀胜无人棋牌室', '系统名称', 'string'),
('system.version', '1.0.0', '系统版本', 'string');

-- 插入测试数据
INSERT INTO stores (name, address, longitude, latitude, phone, description, images, business_hours, facilities) VALUES 
('雀胜棋牌室(万达店)', '北京市朝阳区建国路93号万达广场3层', 116.447587, 39.937075, '010-12345678', '环境优雅，设施齐全的高端棋牌室', '/images/store-logo-1.jpg', '09:00-02:00', '智能门锁,中央空调,免费WiFi,茶水服务,停车位'),
('雀胜棋牌室(中心店)', '北京市海淀区中关村大街27号中关村大厦', 116.310316, 39.983424, '010-87654321', '科技感十足的智能棋牌室', '/images/store-logo-2.jpg', '24小时营业', '智能门锁,新风系统,高速WiFi,咖啡机,充电桩'),
('雀胜棋牌室(西单店)', '北京市西城区西单北大街120号西单商场', 116.366794, 39.906901, '010-11223344', '交通便利，停车方便', '/images/store-logo-3.jpg', '10:00-24:00', '智能门锁,空气净化,免费WiFi,小食服务'),
('雀胜棋牌室(国贸店)', '北京市朝阳区建国门外大街1号国贸大厦', 116.458564, 39.908347, '010-55667788', '商务人士首选，高端大气', '/images/store-logo-4.jpg', '09:00-01:00', '智能门锁,商务设施,高速WiFi,会议室,秘书服务'),
('雀胜棋牌室(三里屯店)', '北京市朝阳区三里屯路19号三里屯太古里', 116.456621, 39.937456, '010-99887766', '时尚潮流，年轻人聚集地', '/images/store-logo-5.jpg', '12:00-03:00', '智能门锁,音响系统,免费WiFi,调酒服务,夜宵');

INSERT INTO rooms (store_id, room_no, name, type, capacity, price_per_hour, images, facilities) VALUES 
(1, '101', '梅花厅', '麻将房', 4, 80.00, '/images/room-default.jpg', '自动麻将机,空调,茶水'),
(1, '102', '兰花厅', '麻将房', 4, 80.00, '/images/room-default.jpg', '自动麻将机,空调,茶水'),
(1, '103', '竹叶厅', '麻将房', 4, 100.00, '/images/room-default.jpg', '豪华自动麻将机,中央空调,高级茶具'),
(1, '104', '菊花厅', '扑克房', 6, 60.00, '/images/room-default.jpg', '扑克桌,空调,饮料'),
(2, '201', 'VIP包间A', '麻将房', 4, 120.00, '/images/room-default.jpg', '豪华自动麻将机,按摩椅,咖啡机'),
(2, '202', 'VIP包间B', '麻将房', 4, 120.00, '/images/room-default.jpg', '豪华自动麻将机,按摩椅,咖啡机'),
(2, '203', '标准间C', '麻将房', 4, 90.00, '/images/room-default.jpg', '自动麻将机,空调,茶水'),
(3, '301', '雅致包间', '麻将房', 4, 70.00, '/images/room-default.jpg', '自动麻将机,空调,茶水,小食'),
(3, '302', '温馨包间', '麻将房', 4, 70.00, '/images/room-default.jpg', '自动麻将机,空调,茶水,小食'),
(4, '401', '商务包间A', '麻将房', 4, 150.00, '/images/room-default.jpg', '豪华麻将机,商务设施,高级茶具'),
(4, '402', '商务包间B', '麻将房', 4, 150.00, '/images/room-default.jpg', '豪华麻将机,商务设施,高级茶具'),
(5, '501', '潮流包间', '麻将房', 4, 100.00, '/images/room-default.jpg', '智能麻将机,音响系统,调酒台'),
(5, '502', '时尚包间', '麻将房', 4, 100.00, '/images/room-default.jpg', '智能麻将机,音响系统,调酒台');