# 易享生活无人棋牌室管理系统 - 后端服务

## 快速启动

### 开发环境启动（推荐）
使用内存数据库H2，无需安装MySQL和Redis：

```bash
# Windows
start-dev.bat

# 或者直接使用Maven命令
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

### 生产环境启动
需要先启动MySQL和Redis服务：

```bash
# 使用Docker启动数据库服务
cd ../docker
docker-compose up -d mysql redis

# 启动后端服务
mvnw.cmd spring-boot:run
```

## 访问地址

- **API接口**: http://localhost:8080/api
- **接口文档**: http://localhost:8080/api/swagger-ui/index.html
- **数据库监控**: http://localhost:8080/api/druid/index.html (admin/123456)
- **H2数据库控制台**: http://localhost:8080/api/h2-console (仅开发环境)

## 开发环境配置

开发环境使用H2内存数据库，配置文件：`src/main/resources/application-dev.yml`

### H2数据库连接信息
- **JDBC URL**: `jdbc:h2:mem:easy_joy_life_system`
- **用户名**: `sa`
- **密码**: (空)
- **驱动**: `org.h2.Driver`

## 主要功能模块

1. **用户管理** - 微信用户注册登录
2. **门店管理** - 棋牌室门店信息
3. **房间管理** - 房间状态和设备控制
4. **订单管理** - 预订和计费系统
5. **支付管理** - 微信支付集成
6. **设备控制** - 智能门锁和IoT设备

## API接口

主要接口包括：

- `GET /api/stores` - 获取门店列表
- `GET /api/stores/{id}/rooms` - 获取门店房间列表
- `POST /api/orders` - 创建订单
- `POST /api/orders/{id}/pay` - 支付订单
- `POST /api/rooms/{id}/unlock` - 开锁房间

详细接口文档请访问Swagger UI。

## 技术栈

- **框架**: Spring Boot 2.7.18
- **数据库**: MySQL 8.0 / H2 (开发环境)
- **缓存**: Redis 6.2
- **ORM**: MyBatis Plus 3.5.3
- **安全**: Spring Security + JWT
- **文档**: Swagger 3.0
- **消息队列**: MQTT (Eclipse Mosquitto)

## 开发说明

1. 项目使用Maven构建，JDK 11+
2. 开发环境自动初始化数据库表结构
3. 支持热重载，修改代码后自动重启
4. 集成Druid数据库连接池监控
5. 使用Hutool工具库简化开发

## 故障排除

### 端口占用
如果8080端口被占用，可以修改`application-dev.yml`中的端口配置：

```yaml
server:
  port: 8081
```

### 数据库连接问题
开发环境使用H2内存数据库，无需额外配置。如果需要持久化数据，可以修改为文件数据库：

```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/easy_joy_life_system;AUTO_SERVER=TRUE
```

### 微信接口配置
在生产环境中，需要配置真实的微信小程序参数：

```yaml
easyjoylife:
  wechat:
    appid: 你的微信小程序AppID
    secret: 你的微信小程序Secret
    mch-id: 你的微信商户号
    api-key: 你的微信支付API密钥
```