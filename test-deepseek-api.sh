#!/bin/bash
# ================================================================
# File: test-deepseek-api.sh
# Description: Test DeepSeek API integration for git commit messages
# ================================================================

# Load library
source go.lib.sh

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  DeepSeek API Test${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    error "jq is not installed"
    info "Install with: sudo apt-get install jq (Ubuntu/Debian)"
    info "            or: brew install jq (macOS)"
    exit 1
fi

success "jq is installed"

# Check if there are staged changes
step "Checking for staged changes..."
git add .

if git diff --staged --quiet; then
    warn "No staged changes found"
    info "Making a test change..."
    echo "# Test change at $(date)" >> test-deepseek-api.log
    git add test-deepseek-api.log
fi

# Get git diff
step "Getting git diff..."
GIT_DIFF=$(git diff --cached --stat)
echo "$GIT_DIFF"
echo ""

# Test DeepSeek API
step "Testing DeepSeek API..."
AI_MESSAGE=$(generate_commit_message)

if [ $? -eq 0 ] && [ -n "$AI_MESSAGE" ]; then
    success "API call successful!"
    echo ""
    echo -e "${GREEN}Generated commit message:${NC}"
    echo -e "${CYAN}$AI_MESSAGE${NC}"
    echo ""
    
    # Ask if user wants to commit with this message
    if confirm "Commit with this message?"; then
        git commit -m "$AI_MESSAGE"
        success "Committed successfully!"
        
        # Clean up test file if it was created
        if [ -f "test-deepseek-api.log" ]; then
            rm test-deepseek-api.log
            git add test-deepseek-api.log
            git commit -m "chore: 清理测试文件"
        fi
    else
        info "Commit cancelled"
        git reset HEAD
    fi
else
    error "API call failed"
    exit 1
fi

echo ""
success "Test complete!"
