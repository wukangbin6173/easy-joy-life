#!/bin/bash

# 易享生活棋牌室 - 服务器环境检查脚本
# 检查所有必需的组件和配置

set -e

echo "=========================================="
echo "易享生活棋牌室 - 服务器环境检查"
echo "服务器: 121.43.96.127"
echo "域名: easyjoylife.xin"
echo "检查时间: $(date)"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查函数
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

check_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. 系统信息检查
echo -e "\n${BLUE}1. 系统信息检查${NC}"
echo "----------------------------------------"
echo "操作系统: $(lsb_release -d | cut -f2)"
echo "内核版本: $(uname -r)"
echo "架构: $(uname -m)"
echo "主机名: $(hostname)"
echo "运行时间: $(uptime -p)"

# 2. 网络连接检查
echo -e "\n${BLUE}2. 网络连接检查${NC}"
echo "----------------------------------------"
ping -c 1 8.8.8.8 > /dev/null 2>&1
check_success "互联网连接"

ping -c 1 github.com > /dev/null 2>&1
check_success "GitHub连接"

# 检查域名解析
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short easyjoylife.xin @8.8.8.8 | tail -n1)
echo "服务器IP: $SERVER_IP"
echo "域名解析IP: $DOMAIN_IP"
if [ "$SERVER_IP" = "$DOMAIN_IP" ]; then
    check_success "域名解析正确"
else
    check_warning "域名解析不匹配，可能影响SSL证书申请"
fi

# 3. 端口检查
echo -e "\n${BLUE}3. 端口检查${NC}"
echo "----------------------------------------"
netstat -tlnp | grep :22 > /dev/null 2>&1
check_success "SSH端口22开放"

netstat -tlnp | grep :80 > /dev/null 2>&1
check_success "HTTP端口80开放"

netstat -tlnp | grep :443 > /dev/null 2>&1
check_success "HTTPS端口443开放"

netstat -tlnp | grep :8080 > /dev/null 2>&1
check_success "应用端口8080开放"

# 4. 基础软件检查
echo -e "\n${BLUE}4. 基础软件检查${NC}"
echo "----------------------------------------"
which curl > /dev/null 2>&1
check_success "curl已安装"

which wget > /dev/null 2>&1
check_success "wget已安装"

which git > /dev/null 2>&1
check_success "git已安装"

which vim > /dev/null 2>&1
check_success "vim已安装"

which unzip > /dev/null 2>&1
check_success "unzip已安装"

# 5. Java环境检查
echo -e "\n${BLUE}5. Java环境检查${NC}"
echo "----------------------------------------"
if java -version > /dev/null 2>&1; then
    JAVA_VERSION=$(java -version 2>&1 | head -n1 | cut -d'"' -f2)
    echo "Java版本: $JAVA_VERSION"
    check_success "Java已安装"
    
    if echo "$JAVA_VERSION" | grep -q "^11\|^1\.8"; then
        check_success "Java版本兼容"
    else
        check_warning "Java版本可能不兼容，推荐Java 11"
    fi
else
    check_warning "Java未安装"
fi

# 检查JAVA_HOME
if [ -n "$JAVA_HOME" ]; then
    echo "JAVA_HOME: $JAVA_HOME"
    check_success "JAVA_HOME已设置"
else
    check_warning "JAVA_HOME未设置"
fi

# 6. MySQL检查
echo -e "\n${BLUE}6. MySQL数据库检查${NC}"
echo "----------------------------------------"
systemctl is-active mysql > /dev/null 2>&1
check_success "MySQL服务运行中"

systemctl is-enabled mysql > /dev/null 2>&1
check_success "MySQL开机自启"

# 检查MySQL版本
if mysql --version > /dev/null 2>&1; then
    MYSQL_VERSION=$(mysql --version | cut -d' ' -f6 | cut -d',' -f1)
    echo "MySQL版本: $MYSQL_VERSION"
    check_success "MySQL客户端可用"
else
    check_warning "MySQL客户端不可用"
fi

# 检查数据库连接
if mysql -u root -pEasyJoyLife2024!@# -e "SELECT 1;" > /dev/null 2>&1; then
    check_success "MySQL root用户连接正常"
    
    # 检查数据库
    if mysql -u root -pEasyJoyLife2024!@# -e "USE easy_joy_life_db; SELECT COUNT(*) FROM stores;" > /dev/null 2>&1; then
        STORE_COUNT=$(mysql -u root -pEasyJoyLife2024!@# -e "USE easy_joy_life_db; SELECT COUNT(*) FROM stores;" 2>/dev/null | tail -n1)
        echo "门店数量: $STORE_COUNT"
        check_success "数据库和数据表正常"
    else
        check_warning "数据库或数据表不存在"
    fi
else
    check_warning "MySQL连接失败，请检查密码"
fi

# 7. Nginx检查
echo -e "\n${BLUE}7. Nginx Web服务器检查${NC}"
echo "----------------------------------------"
systemctl is-active nginx > /dev/null 2>&1
check_success "Nginx服务运行中"

systemctl is-enabled nginx > /dev/null 2>&1
check_success "Nginx开机自启"

nginx -t > /dev/null 2>&1
check_success "Nginx配置语法正确"

if [ -f "/etc/nginx/sites-available/easy-joy-life" ]; then
    check_success "项目Nginx配置文件存在"
else
    check_warning "项目Nginx配置文件不存在"
fi

# 8. Docker检查
echo -e "\n${BLUE}8. Docker容器化检查${NC}"
echo "----------------------------------------"
systemctl is-active docker > /dev/null 2>&1
check_success "Docker服务运行中"

which docker-compose > /dev/null 2>&1
check_success "Docker Compose已安装"

if docker --version > /dev/null 2>&1; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    echo "Docker版本: $DOCKER_VERSION"
    check_success "Docker可用"
else
    check_warning "Docker不可用"
fi

# 9. SSL证书检查
echo -e "\n${BLUE}9. SSL证书检查${NC}"
echo "----------------------------------------"
which certbot > /dev/null 2>&1
check_success "Certbot已安装"

if [ -d "/etc/letsencrypt/live/easyjoylife.xin" ]; then
    check_success "SSL证书目录存在"
    
    # 检查证书有效期
    if openssl x509 -checkend 86400 -noout -in /etc/letsencrypt/live/easyjoylife.xin/cert.pem > /dev/null 2>&1; then
        CERT_EXPIRY=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/easyjoylife.xin/cert.pem | cut -d= -f2)
        echo "证书到期时间: $CERT_EXPIRY"
        check_success "SSL证书有效"
    else
        check_warning "SSL证书即将过期或已过期"
    fi
else
    check_warning "SSL证书未安装"
fi

# 10. 项目文件检查
echo -e "\n${BLUE}10. 项目文件检查${NC}"
echo "----------------------------------------"
if [ -d "/opt/easy-joy-life" ]; then
    check_success "项目目录存在"
    
    # 检查关键文件
    [ -f "/opt/easy-joy-life/backend/pom.xml" ] && check_success "后端项目文件存在" || check_warning "后端项目文件缺失"
    [ -d "/opt/easy-joy-life/miniprogram" ] && check_success "小程序文件存在" || check_warning "小程序文件缺失"
    [ -f "/opt/easy-joy-life/deploy/docker-compose.prod.yml" ] && check_success "Docker配置文件存在" || check_warning "Docker配置文件缺失"
    [ -f "/opt/easy-joy-life/deploy/.env" ] && check_success "环境配置文件存在" || check_warning "环境配置文件缺失"
else
    check_warning "项目目录不存在"
fi

# 11. 应用服务检查
echo -e "\n${BLUE}11. 应用服务检查${NC}"
echo "----------------------------------------"
if [ -f "/opt/easy-joy-life/deploy/docker-compose.prod.yml" ]; then
    cd /opt/easy-joy-life/deploy
    
    # 检查容器状态
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        check_success "应用容器运行中"
        
        # 检查应用健康状态
        if curl -f http://localhost:8080/api/stores > /dev/null 2>&1; then
            check_success "后端API响应正常"
        else
            check_warning "后端API无响应"
        fi
    else
        check_warning "应用容器未运行"
    fi
else
    check_warning "Docker Compose配置不存在"
fi

# 12. HTTPS访问检查
echo -e "\n${BLUE}12. HTTPS访问检查${NC}"
echo "----------------------------------------"
if curl -f https://easyjoylife.xin > /dev/null 2>&1; then
    check_success "HTTPS网站访问正常"
else
    check_warning "HTTPS网站访问失败"
fi

if curl -f https://easyjoylife.xin/api/stores > /dev/null 2>&1; then
    check_success "HTTPS API访问正常"
else
    check_warning "HTTPS API访问失败"
fi

# 13. 系统资源检查
echo -e "\n${BLUE}13. 系统资源检查${NC}"
echo "----------------------------------------"
# CPU使用率
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
echo "CPU使用率: ${CPU_USAGE}%"
if (( $(echo "$CPU_USAGE < 80" | bc -l) )); then
    check_success "CPU使用率正常"
else
    check_warning "CPU使用率较高"
fi

# 内存使用率
MEM_USAGE=$(free | grep Mem | awk '{printf("%.1f"), $3/$2 * 100.0}')
echo "内存使用率: ${MEM_USAGE}%"
if (( $(echo "$MEM_USAGE < 80" | bc -l) )); then
    check_success "内存使用率正常"
else
    check_warning "内存使用率较高"
fi

# 磁盘使用率
DISK_USAGE=$(df -h / | awk 'NR==2{print $5}' | cut -d'%' -f1)
echo "磁盘使用率: ${DISK_USAGE}%"
if [ "$DISK_USAGE" -lt 80 ]; then
    check_success "磁盘使用率正常"
else
    check_warning "磁盘使用率较高"
fi

# 14. 防火墙检查
echo -e "\n${BLUE}14. 防火墙检查${NC}"
echo "----------------------------------------"
if ufw status | grep -q "Status: active"; then
    check_success "UFW防火墙已启用"
    
    # 检查端口规则
    ufw status | grep -q "22" && check_success "SSH端口22已开放" || check_warning "SSH端口22未开放"
    ufw status | grep -q "80" && check_success "HTTP端口80已开放" || check_warning "HTTP端口80未开放"
    ufw status | grep -q "443" && check_success "HTTPS端口443已开放" || check_warning "HTTPS端口443未开放"
else
    check_warning "UFW防火墙未启用"
fi

# 15. 自动续期检查
echo -e "\n${BLUE}15. 自动续期检查${NC}"
echo "----------------------------------------"
if crontab -l | grep -q "certbot"; then
    check_success "SSL证书自动续期已配置"
else
    check_warning "SSL证书自动续期未配置"
fi

if [ -f "/usr/local/bin/ssl-renewal.sh" ]; then
    check_success "SSL续期脚本存在"
else
    check_warning "SSL续期脚本不存在"
fi

# 总结报告
echo -e "\n${BLUE}=========================================="
echo "检查完成 - 总结报告"
echo "==========================================${NC}"

echo -e "\n${GREEN}✅ 成功项目:${NC}"
echo "- 基础系统环境配置完整"
echo "- Java运行环境正常"
echo "- MySQL数据库服务正常"
echo "- Nginx Web服务器运行"
echo "- Docker容器化环境就绪"

echo -e "\n${YELLOW}⚠️  需要注意的项目:${NC}"
echo "- 请检查上述警告项目"
echo "- 确保SSL证书正常工作"
echo "- 监控系统资源使用情况"

echo -e "\n${BLUE}📋 下一步操作建议:${NC}"
echo "1. 如果所有检查都通过，你的服务器已准备就绪"
echo "2. 访问 https://easyjoylife.xin 测试网站"
echo "3. 访问 https://easyjoylife.xin/admin.html 测试管理后台"
echo "4. 在微信开发者工具中配置小程序域名"
echo "5. 上传小程序代码并提交审核"

echo -e "\n${GREEN}🎉 易享生活棋牌室小程序服务器环境检查完成！${NC}"