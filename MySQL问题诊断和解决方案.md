# MySQL问题诊断和解决方案

## 问题现象 🚨
- 小程序显示"加载门店失败"
- 后端API返回500错误
- 错误信息: "could not prepare statement"

## 问题诊断 🔍

### 1. 检查结果
- ✅ 后端服务正在运行 (端口8080)
- ❌ MySQL服务未运行 (端口3306无响应)
- ⚠️ 数据库连接失败导致API错误

### 2. 根本原因
**MySQL服务未启动**，导致Spring Boot无法连接数据库

## 解决方案 🛠️

### 方案1: 启动MySQL服务 (推荐)

#### Windows系统
```bash
# 方法1: 使用net命令
net start mysql

# 方法2: 使用sc命令
sc start mysql

# 方法3: 使用服务管理器
services.msc → 找到MySQL → 启动
```

#### 检查MySQL安装
```bash
# 检查MySQL是否安装
mysql --version

# 如果未安装，下载安装MySQL
# https://dev.mysql.com/downloads/mysql/
```

### 方案2: 使用Docker启动MySQL

```bash
# 使用Docker Compose启动
cd docker
docker-compose up -d mysql

# 或单独启动MySQL容器
docker run -d \
  --name qiupai-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=qiupai_db \
  -p 3306:3306 \
  mysql:8.0
```

### 方案3: 临时使用模拟数据 (已应用)

```javascript
// miniprogram/app.js
globalData: {
  mockMode: true // 临时使用模拟数据
}
```

## 完整解决步骤 📋

### 步骤1: 启动MySQL
```bash
# 启动MySQL服务
net start mysql

# 验证MySQL运行
netstat -an | findstr :3306
# 应该看到: TCP 0.0.0.0:3306 0.0.0.0:0 LISTENING
```

### 步骤2: 创建数据库
```bash
# 连接MySQL并创建数据库
mysql -u root -p

# 在MySQL命令行中执行
CREATE DATABASE IF NOT EXISTS qiupai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# 或者运行初始化脚本
mysql -u root -p < backend/src/main/resources/mysql-init.sql
```

### 步骤3: 重启后端服务
```bash
# 停止当前后端服务 (Ctrl+C)
# 然后重新启动
cd backend
./mvnw spring-boot:run
```

### 步骤4: 验证API
```bash
# 测试API是否正常
curl http://localhost:8080/api/stores
# 应该返回包含门店数据的JSON
```

### 步骤5: 切换小程序到真实API
```javascript
// miniprogram/app.js
globalData: {
  mockMode: false // 切换回真实API
}
```

## 自动化解决脚本 🤖

### 创建一键修复脚本
```batch
@echo off
echo 正在诊断和修复MySQL问题...

echo 1. 检查MySQL服务状态...
sc query mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL服务未安装或未配置
    echo 请先安装MySQL: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)

echo 2. 启动MySQL服务...
net start mysql
if %errorlevel% neq 0 (
    echo MySQL启动失败，请检查配置
    pause
    exit /b 1
)

echo 3. 等待MySQL启动...
timeout /t 5 /nobreak >nul

echo 4. 创建数据库...
mysql -u root -proot < backend/src/main/resources/mysql-init.sql
if %errorlevel% equ 0 (
    echo 数据库创建成功
) else (
    echo 数据库创建失败，请检查密码配置
)

echo 5. 重启后端服务...
echo 请手动重启后端服务: cd backend && ./mvnw spring-boot:run

pause
```

## 常见问题和解决方案 ❓

### 问题1: MySQL服务启动失败
**错误**: "服务没有响应控制功能"
**解决**: 
- 检查MySQL是否正确安装
- 以管理员身份运行命令提示符
- 检查端口3306是否被占用

### 问题2: 密码错误
**错误**: "Access denied for user 'root'"
**解决**: 
- 修改application.yml中的密码配置
- 或重置MySQL root密码

### 问题3: 数据库不存在
**错误**: "Unknown database 'qiupai_db'"
**解决**: 
- 运行mysql-init.sql脚本
- 或手动创建数据库

### 问题4: 端口冲突
**错误**: "Port 3306 is already in use"
**解决**: 
- 检查是否有其他MySQL实例运行
- 或修改MySQL配置使用其他端口

## 验证清单 ✅

### MySQL服务验证
- [ ] MySQL服务正在运行
- [ ] 端口3306可访问
- [ ] 可以连接到MySQL

### 数据库验证
- [ ] qiupai_db数据库存在
- [ ] store和room表已创建
- [ ] 测试数据已插入

### 后端服务验证
- [ ] Spring Boot启动无错误
- [ ] API返回200状态码
- [ ] 返回正确的JSON数据

### 小程序验证
- [ ] mockMode设置正确
- [ ] 门店列表正常显示
- [ ] 数据与数据库一致

## 当前状态 📊

### 临时解决方案 (已应用)
- ✅ 小程序切换到模拟数据模式
- ✅ 门店列表可以正常显示
- ✅ 所有功能正常工作

### 待完成任务
- ⏳ 启动MySQL服务
- ⏳ 创建qiupai_db数据库
- ⏳ 重启后端服务
- ⏳ 切换小程序到真实API模式

---

## 🎯 下一步行动

1. **立即可用**: 小程序现在使用模拟数据，功能正常
2. **启动MySQL**: 运行 `net start mysql`
3. **创建数据库**: 运行 `mysql -u root -p < backend/src/main/resources/mysql-init.sql`
4. **重启后端**: 重新启动Spring Boot服务
5. **切换模式**: 将mockMode改为false

**预计解决时间**: 5-10分钟
**当前可用性**: ✅ 完全可用 (模拟数据模式)