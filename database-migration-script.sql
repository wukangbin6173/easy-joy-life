-- ============================================================================
-- 数据迁移脚本 - 从旧表迁移到规范化新表
-- 创建日期: 2026-02-07
-- ============================================================================

USE easy_joy_life_db;

-- ============================================================================
-- 第一步：迁移用户数据 (users -> users_list)
-- ============================================================================

INSERT INTO users_list (
    id,
    user_core_openid,
    user_core_unionid,
    user_profile_nickname,
    user_profile_avatar,
    user_profile_realname,
    user_profile_gender,
    user_profile_birthday,
    user_profile_idcard,
    user_bind_phone,
    user_level_current,
    user_level_points,
    user_balance_amount,
    user_status_active,
    created_at,
    updated_at
)
SELECT 
    id,
    openid,
    unionid,
    nickname,
    avatar,
    real_name,
    gender,
    birthday,
    id_card,
    phone,
    level,
    points,
    balance,
    status,
    created_at,
    updated_at
FROM users
WHERE NOT EXISTS (SELECT 1 FROM users_list WHERE users_list.id = users.id);

SELECT CONCAT('✓ 用户数据迁移完成，共迁移 ', COUNT(*), ' 条记录') AS result FROM users_list;

-- ============================================================================
-- 第二步：迁移门店数据 (stores -> stores_list)
-- ============================================================================

INSERT INTO stores_list (
    id,
    store_core_name,
    store_core_address,
    store_location_longitude,
    store_location_latitude,
    store_contact_phone,
    store_info_description,
    store_info_images,
    store_info_hours,
    store_info_facilities,
    store_status_active,
    created_at,
    updated_at
)
SELECT 
    id,
    name,
    address,
    longitude,
    latitude,
    phone,
    description,
    COALESCE(images, image),  -- 兼容 images 和 image 字段
    business_hours,
    facilities,
    status,
    created_at,
    updated_at
FROM stores
WHERE NOT EXISTS (SELECT 1 FROM stores_list WHERE stores_list.id = stores.id);

SELECT CONCAT('✓ 门店数据迁移完成，共迁移 ', COUNT(*), ' 条记录') AS result FROM stores_list;

-- ============================================================================
-- 第三步：迁移房间数据 (rooms -> rooms_list)
-- ============================================================================

INSERT INTO rooms_list (
    id,
    store_id,
    room_core_no,
    room_core_name,
    room_core_type,
    room_spec_capacity,
    room_spec_area,
    room_price_hourly,
    room_info_images,
    room_info_facilities,
    room_device_id,
    room_device_locktype,
    room_status_active,
    created_at,
    updated_at
)
SELECT 
    id,
    store_id,
    room_no,
    name,
    type,
    capacity,
    area,
    COALESCE(price_per_hour, hourly_rate),  -- 兼容两种字段名
    COALESCE(images, image),  -- 兼容 images 和 image 字段
    facilities,
    device_id,
    lock_type,
    status,
    created_at,
    updated_at
FROM rooms
WHERE NOT EXISTS (SELECT 1 FROM rooms_list WHERE rooms_list.id = rooms.id);

SELECT CONCAT('✓ 房间数据迁移完成，共迁移 ', COUNT(*), ' 条记录') AS result FROM rooms_list;
