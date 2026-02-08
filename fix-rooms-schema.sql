-- 修复 rooms 和 stores 表的 facilities 字段类型
-- 从 TEXT 改为 VARCHAR(1000) 以匹配实体定义

USE easy_joy_life_db;

-- 修改 rooms 表 facilities 字段类型
ALTER TABLE rooms MODIFY COLUMN facilities VARCHAR(1000) COMMENT '设施列表（JSON格式）';

-- 修改 stores 表 facilities 字段类型
ALTER TABLE stores MODIFY COLUMN facilities VARCHAR(1000) COMMENT '设施列表（JSON格式）';

-- 验证修改
SHOW CREATE TABLE rooms;
SHOW CREATE TABLE stores;

SELECT '✓ rooms 和 stores 表 facilities 字段已修复' AS result;
