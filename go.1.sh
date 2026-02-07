#!/bin/bash
# ================================================================
# File: go.1.sh
# Description: Option 1 - Commit to Git and deploy to server
# Project: EasyJoyLife
# ================================================================

step "Git 提交并部署到服务器"

# ============================================================
# 1. 检查 Git 状态
# ============================================================

step "检查 Git 状态..."
check_git_status

# ============================================================
# 2. 本地构建后端
# ============================================================

step "本地构建后端..."
build_backend

# ============================================================
# 3. 提交并推送到 GitHub
# ============================================================

# 获取提交消息
echo ""
echo -e "${YELLOW}提交消息选项:${NC}"
echo "  1. 使用 DeepSeek AI 自动生成 (推荐)"
echo "  2. 手动输入提交消息"
echo "  3. 使用默认时间戳"
echo ""
read -p "选择方式 (1-3, 默认: 1): " msg_option

case $msg_option in
    2)
        read -p "请输入提交消息: " COMMIT_MSG
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="部署: $(date '+%Y-%m-%d %H:%M:%S')"
        fi
        git_commit_push "$COMMIT_MSG"
        ;;
    3)
        COMMIT_MSG="部署: $(date '+%Y-%m-%d %H:%M:%S')"
        git_commit_push "$COMMIT_MSG"
        ;;
    *)
        # 默认: 使用 AI 生成
        git_commit_push ""
        ;;
esac

# ============================================================
# 4. 部署到服务器
# ============================================================

echo ""
step "部署到服务器..."
info "服务器: $SERVER_HOST"
info "路径: $SERVER_PATH"
echo ""

if confirm "确认部署到生产服务器?"; then
    deploy_to_server
else
    warn "部署已取消"
    exit 0
fi

# ============================================================
# 5. 验证部署
# ============================================================

echo ""
step "验证部署..."

sleep 3

# 测试外部 API
if curl -s "${SITE_URL}/api/stores" > /dev/null 2>&1; then
    success "部署验证成功 - API 正常响应"
    info "访问地址: ${SITE_URL}"
else
    warn "API 暂未响应，可能需要更多时间"
    info "查看服务器日志: ssh ${SERVER_USER}@${SERVER_HOST} 'tail -f /var/log/easyjoylife.log'"
fi

# ============================================================
# 完成
# ============================================================

echo ""
success "部署完成!"
echo ""
echo -e "${YELLOW}部署摘要:${NC}"
echo "  提交: $COMMIT_MSG"
echo "  服务器: $SERVER_HOST"
echo "  网址: $SITE_URL"
echo ""
echo -e "${YELLOW}后续步骤:${NC}"
echo "  1. 测试应用: ${SITE_URL}"
echo "  2. 查看日志: ssh ${SERVER_USER}@${SERVER_HOST} 'tail -f /var/log/easyjoylife.log'"
echo "  3. 监控服务: ssh ${SERVER_USER}@${SERVER_HOST} 'ps aux | grep easy-joy-life'"
