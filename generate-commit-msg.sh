#!/bin/bash
# ================================================================
# File: generate-commit-msg.sh
# Description: Standalone script to generate git commit message with DeepSeek AI
# Usage: ./generate-commit-msg.sh [--staged|--all]
# ================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[1;36m'
NC='\033[0m'

# DeepSeek API Configuration
DEEPSEEK_API_KEY="sk-a1374a0606a744c3888ee224b5b8252c"
DEEPSEEK_API_URL="https://api.deepseek.com/v1/chat/completions"

# Check dependencies
check_dependencies() {
    local missing=0
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ git not found${NC}"
        missing=1
    fi
    
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}❌ curl not found${NC}"
        missing=1
    fi
    
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}❌ jq not found${NC}"
        echo -e "${YELLOW}Install with: sudo apt-get install jq${NC}"
        missing=1
    fi
    
    if [ $missing -eq 1 ]; then
        exit 1
    fi
}

# Main function
main() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  AI Commit Message Generator${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Check if in git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ Not a git repository${NC}"
        exit 1
    fi
    
    # Determine what to analyze
    local mode="${1:---staged}"
    local git_diff=""
    local git_diff_detail=""
    
    if [ "$mode" = "--all" ]; then
        echo -e "${CYAN}📊 Analyzing all changes...${NC}"
        git_diff=$(git diff --stat)
        git_diff_detail=$(git diff | head -n 200)
    else
        echo -e "${CYAN}📊 Analyzing staged changes...${NC}"
        git_diff=$(git diff --cached --stat)
        git_diff_detail=$(git diff --cached | head -n 200)
    fi
    
    # Check if there are changes
    if [ -z "$git_diff" ]; then
        echo -e "${YELLOW}⚠️  No changes found${NC}"
        if [ "$mode" = "--staged" ]; then
            echo -e "${YELLOW}💡 Try: ./generate-commit-msg.sh --all${NC}"
        fi
        exit 1
    fi
    
    echo ""
    echo -e "${YELLOW}Changes summary:${NC}"
    echo "$git_diff"
    echo ""
    
    # Prepare prompt
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
    echo -e "${CYAN}🤖 Calling DeepSeek AI...${NC}"
    
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
    
    # Check for API errors
    if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
        echo -e "${RED}❌ API Error:${NC}"
        echo "$response" | jq -r '.error.message'
        exit 1
    fi
    
    # Extract commit message
    local commit_msg=$(echo "$response" | jq -r '.choices[0].message.content' 2>/dev/null)
    
    if [ -z "$commit_msg" ] || [ "$commit_msg" = "null" ]; then
        echo -e "${RED}❌ Failed to generate commit message${NC}"
        echo -e "${YELLOW}API Response:${NC}"
        echo "$response" | jq '.'
        exit 1
    fi
    
    # Clean up message
    commit_msg=$(echo "$commit_msg" | sed 's/^["'\'']*//;s/["'\'']*$//' | xargs)
    
    # Display result
    echo ""
    echo -e "${GREEN}✅ Generated commit message:${NC}"
    echo ""
    echo -e "${CYAN}$commit_msg${NC}"
    echo ""
    
    # Ask if user wants to use it
    read -p "Use this message? (y/n): " answer
    case $answer in
        [Yy]* )
            if [ "$mode" = "--all" ]; then
                git add .
            fi
            git commit -m "$commit_msg"
            echo -e "${GREEN}✅ Committed successfully!${NC}"
            
            # Ask about push
            echo ""
            read -p "Push to remote? (y/n): " push_answer
            case $push_answer in
                [Yy]* )
                    git push
                    echo -e "${GREEN}✅ Pushed successfully!${NC}"
                    ;;
            esac
            ;;
        * )
            echo -e "${YELLOW}ℹ️  Commit cancelled${NC}"
            echo -e "${YELLOW}💡 You can copy the message above and use it manually${NC}"
            ;;
    esac
}

# Show usage
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Usage: $0 [--staged|--all]"
    echo ""
    echo "Options:"
    echo "  --staged    Analyze staged changes only (default)"
    echo "  --all       Analyze all changes (staged + unstaged)"
    echo "  -h, --help  Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                  # Analyze staged changes"
    echo "  $0 --staged         # Analyze staged changes"
    echo "  $0 --all            # Analyze all changes"
    exit 0
fi

# Run main function
main "$@"
