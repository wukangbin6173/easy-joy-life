#!/bin/bash
# ================================================================
# File: go.lib.sh
# Description: Common library - Color definitions and utility functions
# Project: EasyJoyLife
# ================================================================

# ============================================================
# Color Definitions
# ============================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[1;36m'
MAGENTA='\033[1;35m'
NC='\033[0m' # No Color

# ============================================================
# Project Configuration
# ============================================================
SERVER_HOST="121.43.96.127"
SERVER_USER="root"
SERVER_PATH="/opt/easy-joy-life"
BACKEND_JAR="easy-joy-life-system-1.0.0.jar"
SITE_URL="https://xx.aieo.cn"
GIT_BRANCH="main"

# ============================================================
# Basic Utility Functions
# ============================================================

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if in correct directory
check_project_root() {
    if [ ! -f "backend/pom.xml" ]; then
        error "请在项目根目录运行此脚本"
        exit 1
    fi
}

# Calculate and display elapsed time
show_elapsed_time() {
    local start_time=$1
    local end_time=$(date +%s)
    local elapsed=$((end_time - start_time))
    local minutes=$((elapsed / 60))
    local seconds=$((elapsed % 60))
    echo ""
    echo -e "${CYAN}⏱️  Total time: ${minutes}m ${seconds}s${NC}"
}

# ============================================================
# Output Functions
# ============================================================

# Success message
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Error message
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Warning message
warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Info message
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Step prompt
step() {
    echo -e "${CYAN}🔹 $1${NC}"
}

# ============================================================
# Check Functions
# ============================================================

# Check if command exists
check_command() {
    local cmd=$1
    local install_hint=$2
    if ! command -v "$cmd" &> /dev/null; then
        error "需要 $cmd，但未安装"
        if [ -n "$install_hint" ]; then
            info "安装方法: $install_hint"
        fi
        exit 1
    fi
}

# Check port usage
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port in use
    else
        return 1  # Port available
    fi
}

# Kill process using port
kill_port() {
    local port=$1
    if check_port $port; then
        warn "端口 $port 正在使用，正在释放..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 1
        success "端口 $port 已释放"
    fi
}

# ============================================================
# Service Management Functions
# ============================================================

# Start background process
start_background() {
    local name=$1
    local command=$2
    local log_file="${3:-/dev/null}"

    step "启动 $name..."
    nohup $command > "$log_file" 2>&1 &
    local pid=$!
    sleep 1

    if ps -p $pid > /dev/null 2>&1; then
        success "$name 已启动 (PID: $pid)"
        return 0
    else
        error "$name 启动失败"
        return 1
    fi
}

# Wait for service to be ready
wait_for_service() {
    local url=$1
    local timeout=${2:-30}
    local name=${3:-"服务"}

    info "等待 $name 就绪..."
    local count=0
    while [ $count -lt $timeout ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            success "$name 已就绪"
            return 0
        fi
        sleep 1
        count=$((count + 1))
    done

    error "$name 启动超时"
    return 1
}

# ============================================================
# Confirmation Functions
# ============================================================

# Confirm operation
confirm() {
    local message=${1:-"继续?"}
    read -p "$message (y/n, 默认 y): " answer
    # 如果为空（直接回车），默认为 y
    if [ -z "$answer" ]; then
        answer="y"
    fi
    case $answer in
        [Yy]* ) return 0;;
        * ) return 1;;
    esac
}

# ============================================================
# Deployment Exclusion Rules
# ============================================================

DEPLOY_IGNORE=".deployignore"

# Build rsync exclude parameters
build_rsync_excludes() {
    local excludes=""
    if [ -f "$DEPLOY_IGNORE" ]; then
        while IFS= read -r line || [ -n "$line" ]; do
            # Skip empty lines and comments
            [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
            # Remove leading/trailing spaces
            line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            [ -n "$line" ] && excludes="$excludes --exclude='$line'"
        done < "$DEPLOY_IGNORE"
    fi
    echo "$excludes"
}

# Pre-build exclude parameters
RSYNC_EXCLUDES=$(build_rsync_excludes)

# ============================================================
# Git Functions
# ============================================================

# DeepSeek API Configuration
DEEPSEEK_API_KEY="sk-a1374a0606a744c3888ee224b5b8252c"
DEEPSEEK_API_URL="https://api.deepseek.com/v1/chat/completions"

# Generate commit message using DeepSeek API
generate_commit_message() {
    step "使用 DeepSeek AI 生成提交消息..."
    
    # Get git diff
    local git_diff=$(git diff --cached --stat)
    local git_diff_detail=$(git diff --cached | head -n 200)
    
    if [ -z "$git_diff" ]; then
        warn "未找到暂存的更改"
        return 1
    fi
    
    # Prepare prompt for DeepSeek
    local prompt="Based on the following git changes, generate a concise and clear commit message in Chinese. The message should follow the format: <type>: <description>

Types can be:
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- chore: 构建/工具链相关

Git changes summary:
$git_diff

Detailed changes (first 200 lines):
$git_diff_detail

Please provide ONLY the commit message, no explanation."
    
    # Call DeepSeek API
    local response=$(curl -s -X POST "$DEEPSEEK_API_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
        -d "{
            \"model\": \"deepseek-chat\",
            \"messages\": [
                {
                    \"role\": \"user\",
                    \"content\": $(echo "$prompt" | jq -Rs .)
                }
            ],
            \"temperature\": 0.7,
            \"max_tokens\": 200
        }")
    
    # Extract commit message from response
    local commit_msg=$(echo "$response" | jq -r '.choices[0].message.content' 2>/dev/null)
    
    if [ -z "$commit_msg" ] || [ "$commit_msg" = "null" ]; then
        warn "AI 生成提交消息失败"
        info "API 响应: $response"
        return 1
    fi
    
    # Clean up the message (remove quotes and extra whitespace)
    commit_msg=$(echo "$commit_msg" | sed 's/^["'\'']*//;s/["'\'']*$//' | xargs)
    
    echo "$commit_msg"
    return 0
}

# Check Git status
check_git_status() {
    if [ -n "$(git status --porcelain)" ]; then
        warn "工作目录有未提交的更改"
        if ! confirm "仍然继续?"; then
            error "操作已取消"
            exit 1
        fi
    fi
}

# Git commit and push with AI-generated message
git_commit_push() {
    local message="$1"
    
    step "提交到 Git..."
    
    # Add all changes
    git add .
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        warn "没有新的更改需要提交"
        return 0
    fi
    
    # If no message provided, try to generate one with AI
    if [ -z "$message" ]; then
        info "尝试使用 DeepSeek AI 生成提交消息..."
        
        # Check if jq is installed (required for JSON parsing)
        if ! command -v jq &> /dev/null; then
            warn "未安装 jq，使用默认消息"
            message="部署: $(date '+%Y-%m-%d %H:%M:%S')"
        else
            local ai_message=$(generate_commit_message)
            if [ $? -eq 0 ] && [ -n "$ai_message" ]; then
                success "AI 生成的消息: $ai_message"
                echo ""
                if confirm "使用此提交消息?"; then
                    message="$ai_message"
                else
                    read -p "请输入自定义提交消息: " message
                    if [ -z "$message" ]; then
                        message="部署: $(date '+%Y-%m-%d %H:%M:%S')"
                    fi
                fi
            else
                warn "AI 生成失败，使用默认消息"
                message="部署: $(date '+%Y-%m-%d %H:%M:%S')"
            fi
        fi
    fi
    
    # Commit with the message
    git commit -m "$message"
    success "代码已提交: $message"
    
    # Push to remote
    step "推送到 GitHub..."
    git push origin $GIT_BRANCH
    success "代码已推送到 GitHub"
}

# ============================================================
# Build Functions
# ============================================================

# Build backend
build_backend() {
    step "构建后端..."
    
    # Check Java environment
    check_command java "安装 Java 11+"
    
    # Build with Maven (run in backend directory)
    if [ -f "backend/mvnw.cmd" ]; then
        # Windows: use mvnw.cmd
        info "使用 Maven Wrapper (Windows)..."
        (cd backend && cmd //c "mvnw.cmd clean package -DskipTests")
    elif [ -f "backend/mvnw" ]; then
        # Linux/Mac: use mvnw
        info "使用 Maven Wrapper (Linux/Mac)..."
        (cd backend && ./mvnw clean package -DskipTests)
    elif command -v mvn &> /dev/null; then
        # Fallback: use system maven
        info "使用系统 Maven..."
        (cd backend && mvn clean package -DskipTests)
    else
        error "未找到 Maven"
        info "请安装 Maven: scoop install maven"
        info "或者确保 backend/mvnw 文件存在"
        exit 1
    fi
    
    # Check if JAR was built
    if [ ! -f "backend/target/${BACKEND_JAR}" ]; then
        error "JAR 构建失败"
        info "请检查构建日志"
        exit 1
    fi
    
    success "后端构建完成"
}

# ============================================================
# Deployment Functions
# ============================================================

# Deploy to server
deploy_to_server() {
    step "部署到服务器..."
    
    # Check SSH connection
    if ! ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_HOST "echo 'SSH OK'" &> /dev/null; then
        error "无法连接到服务器 $SERVER_HOST"
        exit 1
    fi
    
    info "在服务器上执行部署..."
    
    # Execute deployment script on server
    ssh $SERVER_USER@$SERVER_HOST << 'ENDSSH'
        set -e
        
        echo "🔄 进入项目目录..."
        cd /opt/easy-joy-life
        
        echo "📥 拉取最新代码..."
        git pull origin main
        
        echo "🛑 停止现有服务..."
        pkill -f "easy-joy-life-system" || true
        sleep 2
        
        echo "🔨 重新构建项目..."
        cd backend
        mvn clean package -DskipTests
        
        echo "🗄️ 检查数据库连接..."
        mysql -uroot -p'EasyJoyLife2024!@#' -e "SELECT 1;" > /dev/null
        
        echo "🚀 启动新服务..."
        nohup java -jar target/easy-joy-life-system-1.0.0.jar > /var/log/easyjoylife.log 2>&1 &
        
        echo "⏳ 等待服务启动..."
        sleep 10
        
        echo "🔄 重载 Nginx..."
        nginx -s reload
        
        echo "🔍 检查服务状态..."
        if pgrep -f "easy-joy-life-system" > /dev/null; then
            echo "✅ 服务启动成功"
            
            # Test local API
            if curl -s http://localhost:8080/api/stores > /dev/null; then
                echo "✅ 本地 API 测试通过"
                
                # Test external API
                if curl -s https://xx.aieo.cn/api/stores > /dev/null; then
                    echo "✅ 外部 API 测试通过"
                else
                    echo "⚠️ 外部 API 测试失败，请检查 Nginx 配置"
                fi
            else
                echo "⚠️ 本地 API 测试失败，请查看日志"
            fi
        else
            echo "❌ 服务启动失败"
            echo "最近的日志:"
            tail -20 /var/log/easyjoylife.log
            exit 1
        fi
        
        echo "🎉 部署完成!"
ENDSSH
    
    if [ $? -eq 0 ]; then
        success "服务器部署成功!"
        info "访问地址: ${SITE_URL}"
    else
        error "服务器部署失败"
        exit 1
    fi
}
