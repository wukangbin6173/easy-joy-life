# GitHub项目上传完整指南

## 第一步：准备工作

### 1.1 配置Git用户信息
在命令行中执行以下命令（替换为你的信息）：

```bash
# 设置用户名（替换为你的GitHub用户名）
git config --global user.name "你的用户名"

# 设置邮箱（替换为你的GitHub邮箱）
git config --global user.email "你的邮箱@example.com"
```

### 1.2 检查配置
```bash
git config --global user.name
git config --global user.email
```

## 第二步：创建GitHub仓库

### 2.1 登录GitHub
1. 打开浏览器，访问 https://github.com
2. 登录你的GitHub账号（如果没有账号需要先注册）

### 2.2 创建新仓库
1. 点击右上角的 "+" 号
2. 选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `qiupai-chess-room` （建议的项目名）
   - **Description**: `无人值守棋牌室小程序管理系统`
   - **Public/Private**: 选择Public（公开）或Private（私有）
   - **不要勾选** "Add a README file"
   - **不要勾选** "Add .gitignore"
   - **不要勾选** "Choose a license"
4. 点击 "Create repository"

## 第三步：准备项目文件

### 3.1 创建.gitignore文件
在项目根目录创建`.gitignore`文件，排除不需要上传的文件：

```gitignore
# 编译输出
backend/target/
backend/build/
*.class
*.jar
*.war

# 日志文件
*.log
logs/

# 数据库文件
*.db
*.sqlite

# IDE文件
.idea/
.vscode/
*.iml
*.ipr
*.iws

# 系统文件
.DS_Store
Thumbs.db

# Node.js (如果有)
node_modules/
npm-debug.log*

# 临时文件
*.tmp
*.temp
*.swp
*.swo

# 敏感信息
application-prod.yml
application-local.yml
*.env

# MySQL数据
mysql-data/
mysql-download/
mysql-installer/

# Python缓存
__pycache__/
*.pyc
*.pyo

# 测试文件
test_*.py
*_test.py
```

### 3.2 创建README.md文件
创建项目说明文件：

```markdown
# 雀胜无人棋牌室管理系统

## 项目简介
这是一个完整的无人值守棋牌室管理系统，包含微信小程序前端和Spring Boot后端。

## 功能特性
- 🏪 门店管理：多门店支持，位置信息管理
- 🏠 房间管理：房间预订、智能门锁控制
- 👥 用户管理：微信登录、会员系统
- 💰 支付系统：微信支付、余额充值
- 📊 后台管理：数据统计、订单管理
- 🔒 智能硬件：门锁控制、设备监控

## 技术栈

### 后端
- Spring Boot 2.7+
- MySQL 8.0
- Spring Data JPA
- Spring Security
- Maven

### 前端（微信小程序）
- 微信小程序原生开发
- WeUI组件库
- 实时API调用

### 数据库
- MySQL 8.0
- 5个门店数据
- 13个房间配置

## 快速开始

### 环境要求
- JDK 11+
- MySQL 8.0+
- 微信开发者工具

### 后端启动
1. 克隆项目到本地
2. 配置MySQL数据库
3. 运行后端服务：
```bash
cd backend
./mvnw spring-boot:run
```

### 小程序启动
1. 使用微信开发者工具打开`miniprogram`目录
2. 配置API地址
3. 编译运行

## 项目结构
```
├── backend/                 # Spring Boot后端
│   ├── src/main/java/      # Java源码
│   ├── src/main/resources/ # 配置文件
│   └── target/             # 编译输出
├── miniprogram/            # 微信小程序
│   ├── pages/              # 页面文件
│   ├── utils/              # 工具类
│   └── images/             # 图片资源
├── docs/                   # 文档
├── docker/                 # Docker配置
└── README.md              # 项目说明
```

## 功能截图
- 门店列表页面
- 房间预订界面
- 后台管理系统
- 支付充值功能

## 部署说明
详见 `docs/deployment.md`

## 开发文档
- [API接口文档](http://localhost:8080/api/swagger-ui/index.html)
- [数据库设计](docs/database.md)
- [小程序开发指南](小程序开发环境配置指南.md)

## 贡献指南
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证
MIT License

## 联系方式
如有问题，请提交Issue或联系开发者。
```

## 第四步：初始化Git仓库

在项目根目录执行以下命令：

```bash
# 初始化Git仓库
git init

# 添加所有文件到暂存区
git add .

# 创建第一次提交
git commit -m "Initial commit: 雀胜无人棋牌室管理系统"

# 添加远程仓库地址（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/qiupai-chess-room.git

# 推送到GitHub
git push -u origin main
```

## 第五步：后续更新

### 5.1 日常提交流程
```bash
# 查看文件状态
git status

# 添加修改的文件
git add .
# 或添加特定文件
git add 文件名

# 提交更改
git commit -m "描述你的更改"

# 推送到GitHub
git push
```

### 5.2 常用Git命令
```bash
# 查看提交历史
git log

# 查看当前状态
git status

# 查看文件差异
git diff

# 撤销未提交的更改
git checkout -- 文件名

# 创建新分支
git checkout -b 新分支名

# 切换分支
git checkout 分支名

# 合并分支
git merge 分支名
```

## 第六步：GitHub仓库设置

### 6.1 设置仓库描述
1. 在GitHub仓库页面点击右上角的"Settings"
2. 在"General"部分添加描述和标签
3. 设置主页URL（如果有演示地址）

### 6.2 创建Release
1. 点击"Releases"
2. 点击"Create a new release"
3. 填写版本号（如v1.0.0）
4. 添加发布说明

### 6.3 设置分支保护（可选）
1. 在Settings -> Branches
2. 添加分支保护规则
3. 要求Pull Request审查

## 注意事项

### ⚠️ 安全提醒
- **不要上传敏感信息**：数据库密码、API密钥等
- **检查.gitignore**：确保排除了所有敏感文件
- **使用环境变量**：敏感配置使用环境变量

### 📝 最佳实践
- **提交信息要清晰**：描述具体做了什么更改
- **经常提交**：小步快跑，避免大批量更改
- **使用分支**：新功能在分支上开发，完成后合并
- **写好README**：让其他人能快速理解项目

### 🔧 常见问题
1. **推送失败**：可能是网络问题或权限问题
2. **文件太大**：GitHub单文件限制100MB
3. **合并冲突**：多人协作时需要解决冲突

## 完成检查清单
- [ ] 配置Git用户信息
- [ ] 创建GitHub仓库
- [ ] 创建.gitignore文件
- [ ] 创建README.md文件
- [ ] 初始化本地Git仓库
- [ ] 添加远程仓库地址
- [ ] 首次推送成功
- [ ] 检查GitHub页面显示正常