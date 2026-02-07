# Easy Joy Life 管理系统 v1.0.1

## 项目简�?
这是一个完整的无人值守棋牌室管理系统，包含微信小程序前端和Spring Boot后端，支持门店管理、房间预订、智能门锁控制等功能�?

## 功能特�?
- 🏪 **门店管理**：多门店支持，位置信息管理，门店筛选功�?
- 🏠 **房间管理**：房间预订、状态管理、价格设�?
- 👥 **用户管理**：微信登录、用户信息管�?
- 💰 **钱包系统**：余额充值、交易记录、支付管�?
- 📊 **后台管理**：数据统计、订单管理、房间筛�?
- 🔒 **智能硬件**：门锁控制、设备监控（预留接口�?

## 技术栈

### 后端
- **框架**: Spring Boot 2.7+
- **数据�?*: MySQL 8.0
- **ORM**: Spring Data JPA
- **安全**: Spring Security
- **构建工具**: Maven
- **API文档**: Swagger/OpenAPI

### 前端（微信小程序�?
- **开发方�?*: 微信小程序原生开�?
- **UI组件**: 自定义组�?+ 原生组件
- **网络请求**: 统一API服务封装
- **状态管�?*: 全局数据管理

### 数据库设�?
- **门店�?*: 5个测试门店数�?
- **房间�?*: 13个房间配�?
- **用户�?*: 用户信息管理
- **订单�?*: 预订记录管理

## 项目结构
```
easy-joy-life/
├── backend/                    # Spring Boot后端
�?  ├── src/main/java/         # Java源码
�?  �?  └── com/easyjoylife/        # 主包
�?  �?      ├── controller/    # 控制器层
�?  �?      ├── service/       # 服务�?
�?  �?      ├── repository/    # 数据访问�?
�?  �?      ├── entity/        # 实体�?
�?  �?      ├── config/        # 配置�?
�?  �?      └── common/        # 通用�?
�?  ├── src/main/resources/    # 配置文件
�?  �?  ├── static/           # 静态资源（后台管理页面�?
�?  �?  └── application.yml   # 应用配置
�?  └── target/               # 编译输出（已忽略�?
├── miniprogram/              # 微信小程�?
�?  ├── pages/               # 页面文件
�?  �?  ├── index/          # 首页
�?  �?  ├── stores/         # 门店列表
�?  �?  ├── store-detail/   # 门店详情
�?  �?  ├── wallet/         # 钱包页面
�?  �?  └── ...             # 其他页面
�?  ├── utils/              # 工具�?
�?  �?  ├── api.js         # API接口封装
�?  �?  └── mockData.js    # 模拟数据
�?  ├── images/             # 图片资源
�?  ├── app.js             # 小程序入�?
�?  └── app.json           # 小程序配�?
├── docs/                   # 文档目录
├── docker/                 # Docker配置
├── *.md                   # 各种说明文档
├── *.py                   # Python工具脚本
├── .gitignore            # Git忽略文件
└── README.md             # 项目说明
```

## 快速开�?

### 环境要求
- **JDK**: 11 或更高版�?
- **MySQL**: 8.0 或更高版�?
- **Maven**: 3.6 或更高版�?
- **微信开发者工�?*: 最新版�?

### 后端启动
1. **克隆项目**
   ```bash
   git clone https://github.com/你的用户�?easy-joy-life.git
   cd easy-joy-life
   ```

2. **配置数据�?*
   - 创建MySQL数据�?`easy_joy_life_db`
   - 修改 `backend/src/main/resources/application.yml` 中的数据库配�?
   - 系统会自动初始化数据表和测试数据

3. **启动后端服务**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

4. **访问后台管理**
   - 地址: http://localhost:8080/admin.html
   - API文档: http://localhost:8080/api/swagger-ui/index.html

### 小程序启�?
1. **使用微信开发者工具打开** `miniprogram` 目录
2. **配置网络设置**
   - 在开发者工具中启用"不校验合法域�?
   - 确保能访�?`http://localhost:8080` 或你的服务器地址
3. **编译运行**

## 功能模块

### 后台管理系统
- **门店管理**: 新增、编辑、删除门店信�?
- **房间管理**: 房间配置、状态管理、按门店筛�?
- **订单管理**: 预订记录查看（开发中�?
- **用户管理**: 用户信息管理（开发中�?

### 微信小程�?
- **首页**: 轮播图、快捷操作、附近门�?
- **门店列表**: 门店搜索、位置导�?
- **门店详情**: 房间列表、预订功�?
- **钱包功能**: 余额充值、交易记�?
- **个人中心**: 用户信息、订单历�?

## 数据库信�?

### 测试数据
- **门店数量**: 5个（万达店、中心店、西单店、国贸店、三里屯店）
- **房间数量**: 13个（包含麻将房、扑克房等不同类型）
- **价格范围**: 60-150�?小时

### 数据初始�?
系统启动时会自动执行 `DataInitializer` 创建测试数据，包括：
- 门店基础信息（名称、地址、坐标、设施等�?
- 房间配置信息（房间号、类型、容量、价格等�?

## API接口

### 主要接口
- `GET /api/stores` - 获取门店列表
- `GET /api/stores/{id}` - 获取门店详情
- `GET /api/rooms/store/{storeId}` - 获取门店房间列表
- `POST /api/orders` - 创建预订订单

### 管理接口
- `GET /api/stores/admin/all` - 管理后台获取所有门�?
- `GET /api/rooms/admin/all` - 管理后台获取所有房�?
- `GET /api/rooms/admin/store/{storeId}` - 按门店筛选房�?

## 部署说明

### 开发环�?
- 后端: `http://localhost:8080`
- 数据�? `localhost:3306/easy_joy_life_db`
- 小程�? 微信开发者工�?

### 生产环境
详见 `docs/deployment.md`（如果存在）

## 开发文�?

### 相关文档
- [小程序开发环境配置指南](小程序开发环境配置指�?md)
- [MySQL配置指南](MySQL配置指南.md)
- [后端API开发完成总结](后端API开发完成总结.md)
- [后台房间筛选功能完成总结](后台房间筛选功能完成总结.md)

### 功能说明
- [无人值守棋牌室小程序功能需求文档](无人值守棋牌室小程序功能需求文�?md)
- [微信小程序开发清单](微信小程序开发清�?md)
- [门店后台管理使用指南](门店后台管理使用指南.md)

## 更新日志

### v1.0.0 (2026-01-20)
- �?完成基础门店和房间管理功�?
- �?实现微信小程序前端界�?
- �?完成后台管理系统
- �?添加房间按门店筛选功�?
- �?集成MySQL数据�?
- �?完成钱包和支付功能界�?

## 贡献指南
1. Fork 本项�?
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可�?
本项目采�?MIT 许可�?- 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式
如有问题或建议，请：
- 提交 [Issue](https://github.com/你的用户�?easy-joy-life/issues)
- 发送邮件至开发�?
- 在项目中创建 Discussion

## 致谢
感谢所有为这个项目做出贡献的开发者和测试人员�?

---

**注意**: 这是一个演示项目，包含完整的前后端代码和数据库设计。如需商业使用，请确保遵守相关法律法规�
