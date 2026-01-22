# 易享生活无人棋牌室管理系统部署指�?

## 环境要求

### 开发环�?
- JDK 11+
- Maven 3.6+
- MySQL 8.0+
- Redis 6.0+
- Node.js 16+
- 微信开发者工�?

### 生产环境
- Docker 20.10+
- Docker Compose 1.29+
- 服务器配置：2�?G内存�?0G硬盘

## 本地开发部�?

### 1. 数据库初始化
```bash
# 创建数据�?
mysql -u root -p
CREATE DATABASE easy-joy-life_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 导入数据�?
mysql -u root -p easy-joy-life_system < backend/src/main/resources/schema.sql
```

### 2. 后端启动
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3. 管理后台启动
```bash
cd admin-web
npm install
npm run dev
```

### 4. 小程序开�?
1. 使用微信开发者工具打开 `miniprogram` 目录
2. 配置小程序AppID
3. 修改 `app.js` 中的 `baseUrl` 为本地后端地址

## Docker部署

### 1. 构建后端镜像
```bash
cd backend
mvn clean package -DskipTests
docker build -t easy-joy-life-backend:1.0.0 .
```

### 2. 启动所有服�?
```bash
cd docker
docker-compose up -d
```

### 3. 查看服务状�?
```bash
docker-compose ps
docker-compose logs -f backend
```

## 生产环境部署

### 1. 服务器准�?
```bash
# 安装Docker
curl -fsSL https://get.docker.com | bash -s docker
systemctl start docker
systemctl enable docker

# 安装Docker Compose
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 2. 配置文件修改
```bash
# 修改数据库密�?
vim docker/docker-compose.yml

# 修改应用配置
vim backend/src/main/resources/application-prod.yml
```

### 3. 部署脚本
```bash
#!/bin/bash
# deploy.sh

echo "开始部署易享生活无人棋牌室管理系统..."

# 拉取最新代�?
git pull origin main

# 构建后端
cd backend
mvn clean package -DskipTests
cd ..

# 构建前端
cd admin-web
npm install
npm run build
cd ..

# 启动服务
cd docker
docker-compose down
docker-compose up -d --build

echo "部署完成�?
echo "后端API: http://your-domain:8080/api"
echo "管理后台: http://your-domain"
echo "API文档: http://your-domain:8080/api/swagger-ui/index.html"
```

### 4. Nginx配置
```nginx
# /etc/nginx/conf.d/easy-joy-life.conf
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文�?
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端API代理
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 文件上传
    location /uploads/ {
        root /usr/share/nginx/html;
        expires 30d;
    }
}
```

## 微信小程序发�?

### 1. 配置小程序信�?
- 在微信公众平台配置小程序基本信息
- 设置服务器域名白名单
- 配置支付商户�?

### 2. 修改小程序配�?
```javascript
// miniprogram/app.js
globalData: {
  baseUrl: 'https://your-domain.com/api', // 修改为生产环境地址
}
```

### 3. 上传代码
1. 使用微信开发者工具上传代�?
2. 在微信公众平台提交审�?
3. 审核通过后发布上�?

## 监控和维�?

### 1. 日志查看
```bash
# 查看应用日志
docker-compose logs -f backend

# 查看数据库日�?
docker-compose logs -f mysql

# 查看Redis日志
docker-compose logs -f redis
```

### 2. 数据备份
```bash
# 数据库备�?
docker exec easy-joy-life-mysql mysqldump -u root -p123456 easy-joy-life_system > backup_$(date +%Y%m%d).sql

# Redis备份
docker exec easy-joy-life-redis redis-cli BGSAVE
```

### 3. 性能监控
- 使用Prometheus + Grafana监控系统性能
- 配置告警规则
- 定期检查系统资源使用情�?

## 常见问题

### 1. 数据库连接失�?
- 检查数据库服务是否启动
- 确认数据库连接配置正�?
- 检查防火墙设置

### 2. 小程序无法访问API
- 确认服务器域名已在微信后台配�?
- 检查HTTPS证书配置
- 确认API接口正常运行

### 3. 设备连接失败
- 检查MQTT服务是否正常
- 确认设备网络连接
- 检查设备认证配�?

## 安全建议

1. **数据库安�?*
   - 修改默认密码
   - 限制数据库访问IP
   - 定期备份数据

2. **API安全**
   - 启用HTTPS
   - 配置防火墙规�?
   - 实施API限流

3. **设备安全**
   - 使用设备证书认证
   - 定期更新设备固件
   - 监控异常设备行为
