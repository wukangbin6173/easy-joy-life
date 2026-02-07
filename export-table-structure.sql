-- 查询所有表的结构信息
SELECT 
    TABLE_NAME as '表名',
    TABLE_COMMENT as '表注释'
FROM 
    information_schema.TABLES 
WHERE 
    TABLE_SCHEMA = 'easy_joy_life_db'
ORDER BY 
    TABLE_NAME;

-- 查询所有表的字段信息
SELECT 
    TABLE_NAME as '表名',
    COLUMN_NAME as '字段名',
    COLUMN_TYPE as '字段类型',
    IS_NULLABLE as '是否可空',
    COLUMN_DEFAULT as '默认值',
    COLUMN_COMMENT as '字段注释',
    ORDINAL_POSITION as '字段顺序'
FROM 
    information_schema.COLUMNS 
WHERE 
    TABLE_SCHEMA = 'easy_joy_life_db'
ORDER BY 
    TABLE_NAME, ORDINAL_POSITION;
