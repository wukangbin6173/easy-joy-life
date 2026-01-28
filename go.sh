#!/bin/bash

# EasyJoyLife 一键部署脚本
# 功能：本地构建 + 上传GitHub + 服务器部署

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
SERVER_HOST="121.43.96.127"
SERVER_USER="root"
SERVER_PATH="/opt/easy-joy-life"
BACKEND_JAR="easy-joy-life-system-1.0.0.jar"

# 函数：打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 函数：检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_message $RED "错误: $1 命令未找到，请先安装"
        exit 1
    fi
}

# 函数：检查Git状态
check_git_status() {
    if [ -n "$(git status --porcelain)" ]; then
        print_message $YELLOW "警告: 工作目录有未提交的更改"
        read -p "是否继续? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_message $RED "部署已取消"
            exit 1
        fi
    fi
}

# 函数：本地构建
local_build() {
    print_message $BLUE "🔨 开始本地构建..."
    
    # 检查Java环境
    if ! command -v java &> /dev/null; then
        print_message $RED "错误: Java未安装或未配置到PATH"
        exit 1
    fi
    
    # 进入后端目录并构建
    cd backend
    print_message $YELLOW "正在编译后端项目..."
    
    # 使用Maven构建
    if [ -f "mvnw" ]; then
        ./mvnw clean package -DskipTests -Dmaven.compiler.source=11 -Dmaven.compiler.target=11
    elif command -v mvn &> /dev/null; then
        mvn clean package -DskipTests -Dmaven.compiler.source=11 -Dmaven.compiler.target=11
    else
        print_message $RED "错误: Maven未找到"
        exit 1
    fi
    
    # 检查JAR文件是否生成
    if [ ! -f "target/${BACKEND_JAR}" ]; then
        print_message $RED "错误: JAR文件构建失败"
        exit 1
    fi
    
    print_message $GREEN "✅ 后端构建完成"
    cd ..
}

# 函数：提交并推送到GitHub
upload_to_github() {
    print_message $BLUE "📤 上传代码到GitHub..."
    
    # 添加所有更改
    git add .
    
    # 检查是否有更改需要提交
    if git diff --staged --quiet; then
        print_message $YELLOW "没有新的更改需要提交"
    else
        # 提交更改
        COMMIT_MSG="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
        git commit -m "$COMMIT_MSG"
        print_message $GREEN "✅ 代码已提交: $COMMIT_MSG"
    fi
    
    # 推送到远程仓库
    git push origin main
    print_message $GREEN "✅ 代码已推送到GitHub"
}

# 函数：服务器部署
deploy_to_server() {
    print_message $BLUE "🚀 开始服务器部署..."
    
    # 检查SSH连接
    if ! ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_HOST "echo 'SSH连接正常'" &> /dev/null; then
        print_message $RED "错误: 无法连接到服务器 $SERVER_HOST"
        exit 1
    fi
    
    print_message $YELLOW "正在服务器上执行部署..."
    
    # 在服务器上执行部署脚本
    ssh $SERVER_USER@$SERVER_HOST << 'EOF'
        set -e
        
        echo "🔄 进入项目目录..."
        cd /opt/easy-joy-life
        
        echo "📥 拉取最新代码..."
        git pull origin main
        
        echo "🛑 停止现有服务..."
        pkill -f "easy-joy-life-system" || true
        sleep 2
        
        echo "🔨 重新编译项目..."
        cd backend
        mvn clean package -DskipTests
        
        echo "🗄️ 检查数据库连接..."
        mysql -uroot -p'EasyJoyLife2024!@#' -e "SELECT 1;" > /dev/null
        
        echo "🚀 启动新服务..."
        nohup java -jar target/easy-joy-life-system-1.0.0.jar > /var/log/easyjoylife.log 2>&1 &
        
        echo "⏳ 等待服务启动..."
        sleep 10
        
        echo "🔄 重新加载Nginx配置..."
        nginx -s reload
        
        echo "🔍 检查服务状态..."
        if pgrep -f "easy-joy-life-system" > /dev/null; then
            echo "✅ 服务启动成功"
            
            # 测试API接口
            if curl -s http://localhost:8080/api/stores > /dev/null; then
                echo "✅ 本地API接口测试通过"
                
                # 测试外网接口
                if curl -s https://xx.aieo.cn/api/stores > /dev/null; then
                    echo "✅ 外网API接口测试通过"
                else
                    echo "⚠️ 外网API接口测试失败，请检查Nginx配置"
                fi
            else
                echo "⚠️ 本地API接口测试失败，请检查日志"
            fi
        else
            echo "❌ 服务启动失败"
            echo "最近的日志:"
            tail -20 /var/log/easyjoylife.log
            exit 1
        fi
        
        echo "🎉 部署完成!"
EOF
    
    if [ $? -eq 0 ]; then
        print_message $GREEN "✅ 服务器部署成功!"
    else
        print_message $RED "❌ 服务器部署失败"
        exit 1
    fi
}

# 函数：显示帮助信息
show_help() {
    echo "EasyJoyLife 一键部署脚本"
    echo ""
    echo "用法: ./go.sh [选项]"
    echo ""
    echo "选项:"
    echo "  1, build     仅本地构建"
    echo "  2, upload    仅上传到GitHub"
    echo "  3, deploy    仅服务器部署"
    echo "  4, all       完整部署流程 (默认)"
    echo "  -h, --help   显示帮助信息"
    echo ""
    echo "示例:"
    echo "  ./go.sh          # 完整部署"
    echo "  ./go.sh build    # 仅构建"
    echo "  ./go.sh deploy   # 仅部署到服务器"
}

# 主函数
main() {
    print_message $GREEN "🚀 EasyJoyLife 一键部署脚本启动"
    print_message $BLUE "================================================"
    
    # 检查必要的命令
    check_command git
    
    # 检查是否在项目根目录
    if [ ! -f "backend/pom.xml" ]; then
        print_message $RED "错误: 请在项目根目录运行此脚本"
        exit 1
    fi
    
    # 解析命令行参数
    case "${1:-all}" in
        "1"|"build")
            local_build
            ;;
        "2"|"upload")
            check_git_status
            upload_to_github
            ;;
        "3"|"deploy")
            deploy_to_server
            ;;
        "4"|"all"|"")
            check_git_status
            local_build
            upload_to_github
            deploy_to_server
            ;;
        "-h"|"--help")
            show_help
            exit 0
            ;;
        *)
            print_message $RED "错误: 未知选项 '$1'"
            show_help
            exit 1
            ;;
    esac
    
    print_message $GREEN "🎉 所有操作完成!"
}

# 执行主函数
main "$@"