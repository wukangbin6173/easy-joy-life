-- ============================================================================
-- 银行卡和支付密码功能数据库初始化脚本
-- ============================================================================

-- 1. 创建用户银行卡表
CREATE TABLE IF NOT EXISTS user_bank_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    holder_name VARCHAR(50) NOT NULL COMMENT '持卡人姓名',
    card_no VARCHAR(128) NOT NULL COMMENT '银行卡号（加密）',
    bank_name VARCHAR(50) NOT NULL COMMENT '银行名称',
    bank_code VARCHAR(20) NOT NULL COMMENT '银行代码',
    card_type VARCHAR(20) NOT NULL COMMENT '卡类型：DEBIT-储蓄卡, CREDIT-信用卡',
    phone VARCHAR(20) NOT NULL COMMENT '预留手机号',
    is_default BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否默认',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE-正常, DISABLED-禁用',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_card_no (card_no),
    INDEX idx_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户银行卡表';

-- 2. 创建用户支付密码表
CREATE TABLE IF NOT EXISTS user_pay_passwords (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL UNIQUE COMMENT '用户ID（唯一）',
    password VARCHAR(255) NOT NULL COMMENT '支付密码（加密）',
    salt VARCHAR(64) NOT NULL COMMENT '盐值',
    error_count INT NOT NULL DEFAULT 0 COMMENT '错误次数',
    locked_until DATETIME COMMENT '锁定截止时间',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户支付密码表';

-- 3. 插入测试数据（可选）
-- 注意：实际生产环境不应该插入测试数据

-- 测试银行卡（卡号已加密，这里仅作示例）
-- INSERT INTO user_bank_cards (user_id, holder_name, card_no, bank_name, bank_code, card_type, phone, is_default, status) VALUES
-- (1, '张三', 'ENCRYPTED_CARD_NO_1', '工商银行', 'ICBC', 'DEBIT', '13800138000', TRUE, 'ACTIVE'),
-- (1, '张三', 'ENCRYPTED_CARD_NO_2', '建设银行', 'CCB', 'DEBIT', '13800138000', FALSE, 'ACTIVE');

-- 4. 添加表注释（如果需要更详细的注释）
ALTER TABLE user_bank_cards COMMENT='用户银行卡表|存储用户绑定的银行卡信息';
ALTER TABLE user_pay_passwords COMMENT='用户支付密码表|存储用户的支付密码（加密）';

-- 5. 验证表创建
SELECT 
    TABLE_NAME as '表名',
    TABLE_COMMENT as '表注释',
    TABLE_ROWS as '行数'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME IN ('user_bank_cards', 'user_pay_passwords');

-- 6. 查看表结构
SHOW CREATE TABLE user_bank_cards;
SHOW CREATE TABLE user_pay_passwords;

SELECT '✓ 银行卡和支付密码表创建完成' AS result;
