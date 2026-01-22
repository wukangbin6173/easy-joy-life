# MySQL数据库配置指南

## 系统已切换到MySQL数据库 ✅

### 配置变更总结
- ✅ 数据库类型: H2内存数据库 → MySQL数据库
- ✅ 数据持久化: 内存存储 → 磁盘存储
- ✅ 配置文件: application.yml已更新
- ✅ 数据初始化: DataInitializer已适配MySQL

## 前置要求 📋

### 1. 安装MySQL
- **版本要求**: MySQL 8.0+
- **下载地址**: https://dev.mysql.com/downloads/mysql/
- **安装后确保**: MySQL服务正在运行

### 2. 验证MySQL安装
```bash
mysql --version
# 应该显示: mysql Ver 8.0.x
```

## 数据库配置 🔧

### 1. 当前配置 (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/qiupai_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8&allowPublicKeyRetrieval=true
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: root  # 请修改为你的MySQL密码
```

### 2. 修改数据库密码
如果你的MySQL root密码不是"root"，请修改 `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    password: 你的MySQL密码
```

## 数据库初始化 🗄️

### 方法1: 自动初始化 (推荐)
1. 启动后端服务，系统会自动创建数据库和表
2. DataInitializer会自动插入测试数据

### 方法2: 手动初始化
```bash
# 运行数据库初始化脚本
setup-mysql.bat

# 或者手动执行SQL
mysql -u root -p < backend/src/main/resources/mysql-init.sql
```

### 方法3: MySQL客户端
```sql
-- 连接MySQL
mysql -u root -p

-- 执行初始化脚本
source backend/src/main/resources/mysql-init.sql;
```

## 启动步骤 🚀

### 1. 确保MySQL服务运行
```bash
# Windows
net start mysql

# 或检查服务状态
sc query mysql
```

### 2. 启动后端服务
```bash
cd backend
./mvnw spring-boot:run
```

### 3. 验证数据库连接
查看控制台输出，应该看到：
```
MySQL数据库测试数据初始化完成！
门店数量: 5
房间数量: 13
```

## 数据验证 ✅

### 1. 通过管理后台验证
- 访问: http://localhost:8080/admin.html
- 查看门店和房间数据

### 2. 通过MySQL客户端验证
```sql
-- 连接数据库
mysql -u root -p

-- 使用数据库
USE qiupai_db;

-- 查看门店数据
SELECT id, name, address FROM store;

-- 查看房间数据
SELECT id, store_id, room_no, name, type FROM room;
```

### 3. 通过小程序验证
- 确保 `mockMode: false`
- 查看门店列表是否显示5个门店

## 数据库结构 📊

### 门店表 (store)
```sql
CREATE TABLE store (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    longitude DECIMAL(10, 6),
    latitude DECIMAL(10, 6),
    phone VARCHAR(20),
    description TEXT,
    images TEXT,
    business_hours VARCHAR(50),
    facilities TEXT,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 房间表 (room)
```sql
CREATE TABLE room (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT NOT NULL,
    room_no VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    area DECIMAL(8, 2),
    price_per_hour DECIMAL(10, 2) NOT NULL,
    images TEXT,
    facilities TEXT,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE
);
```

## 测试数据 📝

### 门店数据 (5个)
1. 雀胜棋牌室(万达店) - 4个房间
2. 雀胜棋牌室(中心店) - 3个房间
3. 雀胜棋牌室(西单店) - 2个房间
4. 雀胜棋牌室(国贸店) - 2个房间
5. 雀胜棋牌室(三里屯店) - 2个房间

### 房间数据 (13个)
- 包含不同类型: 麻将房、扑克房
- 不同价格: 60-150元/小时
- 完整设施信息

## 常见问题 ❓

### 1. 连接失败
**错误**: `Communications link failure`
**解决**: 
- 检查MySQL服务是否启动
- 确认端口3306是否开放
- 检查用户名密码是否正确

### 2. 数据库不存在
**错误**: `Unknown database 'qiupai_db'`
**解决**: 
- 运行 `setup-mysql.bat`
- 或手动创建数据库: `CREATE DATABASE qiupai_db;`

### 3. 权限问题
**错误**: `Access denied for user 'root'`
**解决**: 
- 检查MySQL用户权限
- 确认密码配置正确

### 4. 字符编码问题
**错误**: 中文显示乱码
**解决**: 
- 确保数据库字符集为utf8mb4
- 检查连接URL中的字符编码参数

## 性能优化 ⚡

### 1. 连接池配置
```yaml
spring:
  datasource:
    druid:
      initial-size: 5
      min-idle: 5
      max-active: 20
      max-wait: 60000
```

### 2. 索引优化
```sql
-- 为常用查询字段添加索引
CREATE INDEX idx_store_status ON store(status);
CREATE INDEX idx_room_store_id ON room(store_id);
CREATE INDEX idx_room_status ON room(status);
```

## 备份和恢复 💾

### 备份数据库
```bash
mysqldump -u root -p qiupai_db > qiupai_backup.sql
```

### 恢复数据库
```bash
mysql -u root -p qiupai_db < qiupai_backup.sql
```

---

## 🎉 MySQL配置完成！

**系统现在使用MySQL数据库**：
- ✅ 数据持久化存储
- ✅ 支持并发访问
- ✅ 完整的事务支持
- ✅ 生产环境就绪

**下一步**: 启动后端服务，验证数据库连接和数据初始化

---
**配置时间**: 2025年1月19日
**数据库**: MySQL 8.0+
**状态**: ✅ 配置完成，等待启动验证