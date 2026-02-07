#!/bin/bash
# ================================================================
# File: go.sh
# Description: EasyJoyLife unified entry script
# Project: EasyJoyLife
# Based on: ZERO Framework
# ================================================================
#
# Usage:
#   ./go.sh        # Interactive menu
#   ./go.sh 0      # Start local development
#   ./go.sh 1      # Git commit and deploy to server
#   ./go.sh 2      # Build backend only
#   ./go.sh 3      # Clean cache
#
# ================================================================

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load library file
if [ -f "$SCRIPT_DIR/go.lib.sh" ]; then
    source "$SCRIPT_DIR/go.lib.sh"
else
    echo "❌ Error: go.lib.sh not found"
    exit 1
fi

# Check project root
check_project_root

# Display header
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}    EasyJoyLife - 一键部署${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Get choice (support command line argument or interactive input)
if [ -n "$1" ]; then
    choice="$1"
    echo -e "${GREEN}🔹 执行选项: ${choice}${NC}"
else
    echo -e "${YELLOW}请选择操作:${NC}"
    echo "0. 启动本地开发环境"
    echo "1. Git 提交并部署到服务器 (默认)"
    echo "2. 仅构建后端"
    echo "3. 清理缓存"
    echo "4. 退出"
    echo ""
    read -t 10 -p "请输入选择 (10秒后自动选择 1): " choice

    if [ -z "$choice" ]; then
        choice=1
        echo -e "\n${GREEN}⏱️  自动选择: Git 提交并部署到服务器${NC}"
    fi
fi
echo ""

# Exit option
if [ "$choice" = "4" ]; then
    echo -e "${GREEN}👋 再见!${NC}"
    exit 0
fi

# Record start time
START_TIME=$(date +%s)
export START_TIME

# Check if corresponding sub-script exists
SUB_SCRIPT="$SCRIPT_DIR/go.${choice}.sh"
if [ -f "$SUB_SCRIPT" ]; then
    source "$SUB_SCRIPT"

    # Display elapsed time
    show_elapsed_time "$START_TIME"
else
    echo -e "${RED}❌ 无效选项: ${choice}${NC}"
    echo -e "${YELLOW}💡 可用的子脚本:${NC}"
    ls -1 "$SCRIPT_DIR"/go.*.sh 2>/dev/null | grep -v "go.lib.sh" | while read f; do
        basename "$f"
    done
    exit 1
fi