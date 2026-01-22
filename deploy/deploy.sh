#!/bin/bash

# 易享生活棋牌室小程序 - 自动部署脚本

set -e  # 遇到错误立即退出

echo "=========================================="
echo "易享生活棋牌室小程序 - 自动部署开始"
echo "=========================================="

# 配置变量
APP_NAME="easy-joy-life"
APP_DIR="/opt/easy-joy-life"
BACKUP_DIR="/opt/easy-joy-life-backup"
GITHUB_REPO="https://github.com/wukangbin6173/easy-joy-life.git"

# 检查是否为root用户
if [ "$EUID" -eq 0 ]; then
    echo "请不要使用root用户运行此脚本"
    exit 1
fi

# 1. 备份现有应用（如果存在）
if [ -d "$APP_DIR" ]; then
    echo "1. 备份现有应用..."
    sudo mkdir -p $BACKUP_DIR
    sudo cp -r $APP_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)
    echo "备份完成"
else
    echo "1. 首次部署，跳过备份"
fi

# 2. 克隆或更新代码
echo "2. 获取最新代码..."
if [ -d "$APP_DIR" ]; then
    cd $APP_DIR
    git pull origin main
else
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
    git clone $GITHUB_REPO $APP_DIR
    cd $APP_DIR
fi

# 3. 检查环境变量文件
echo "3. 检查环境配置..."
if [ ! -f "deploy/.env" ]; then
    echo "错误: 请先复制 deploy/.env.example 为 deploy/.env 并配置相关参数"
    exit 1
fi

# 4. 构建后端应用
echo "4. 构建后端应用..."
cd backend
chmod +x mvnw
./mvnw clean package -DskipTests -Pprod
echo "后端构建完成"

# 5. 停止现有服务
echo "5. 停止现有服务..."
sudo docker-compose -f ../deploy/docker-compose.prod.yml down || true

# 6. 启动新服务
echo "6. 启动新服务..."
cd ../deploy
sudo docker-compose -f docker-compose.prod.yml up -d

# 7. 等待服务启动
echo "7. 等待服务启动..."
sleep 30

# 8. 健康检查
echo "8. 健康检查..."
for i in {1..10}; do
    if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
        echo "✓ 后端服务启动成功"
        break
    else
        echo "等待后端服务启动... ($i/10)"
        sleep 10
    fi
    
    if [ $i -eq 10 ]; then
        echo "❌ 后端服务启动失败"
        sudo docker-compose -f docker-compose.prod.yml logs backend
        exit 1
    fi
done

# 9. 配置Nginx
echo "9. 配置Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/easy-joy-life
sudo ln -sf /etc/nginx/sites-available/easy-joy-life /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 10. 设置开机自启
echo "10. 设置开机自启..."
sudo systemctl enable docker
sudo systemctl enable nginx

echo "=========================================="
echo "部署完成！"
echo ""
echo "服务状态:"
echo "- 后端API: http://localhost:8080"
echo "- 管理后台: http://localhost:8080/admin.html"
echo "- Nginx状态: $(sudo systemctl is-active nginx)"
echo ""
echo "下一步:"
echo "1. 配置SSL证书"
echo "2. 更新小程序API地址"
echo "3. 上传小程序代码"
echo "=========================================="