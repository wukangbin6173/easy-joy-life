CREATE TABLE IF NOT EXISTS payment_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(32) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    subject VARCHAR(100),
    body VARCHAR(200),
    trade_no VARCHAR(64),
    paid_time TIMESTAMP NULL,
    expire_time TIMESTAMP NULL,
    notify_status VARCHAR(20) DEFAULT 'PENDING',
    notify_count INT DEFAULT 0,
    extra_data TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);