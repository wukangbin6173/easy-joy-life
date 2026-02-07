#!/bin/bash
# ================================================================
# File: go.3.sh
# Description: Option 3 - Clean cache and build artifacts
# Project: EasyJoyLife
# ================================================================

step "Cleaning cache and build artifacts"

# ============================================================
# 1. Clean backend build artifacts
# ============================================================

step "Cleaning backend build artifacts..."

if [ -d "backend/target" ]; then
    rm -rf backend/target
    success "Cleaned backend/target/"
fi

if [ -d "backend/.mvn" ]; then
    info "Maven wrapper preserved"
fi

# ============================================================
# 2. Clean logs
# ============================================================

step "Cleaning logs..."

if [ -d "backend/logs" ]; then
    rm -f backend/logs/*.log
    success "Cleaned backend logs"
fi

if [ -f "/var/log/easyjoylife.log" ]; then
    warn "Server logs not cleaned (requires server access)"
fi

# ============================================================
# 3. Clean temporary files
# ============================================================

step "Cleaning temporary files..."

# Clean temp SQL files
find . -maxdepth 1 -name "temp_*.sql" -delete 2>/dev/null && success "Cleaned temp SQL files"
find . -maxdepth 1 -name "fix_*.sql" -delete 2>/dev/null && success "Cleaned fix SQL files"

# Clean debug files
find . -maxdepth 1 -name "debug-*.js" -delete 2>/dev/null && success "Cleaned debug JS files"
find . -maxdepth 1 -name "test-*.js" -delete 2>/dev/null && success "Cleaned test JS files"

# ============================================================
# 4. Clean IDE files (optional)
# ============================================================

if confirm "Clean IDE configuration files?"; then
    step "Cleaning IDE files..."
    
    if [ -d ".idea" ]; then
        rm -rf .idea
        success "Cleaned .idea/"
    fi
    
    if [ -d ".vscode" ]; then
        rm -rf .vscode
        success "Cleaned .vscode/"
    fi
    
    if [ -d ".kiro" ]; then
        warn ".kiro/ preserved (contains project settings)"
    fi
fi

# ============================================================
# 5. Display summary
# ============================================================

echo ""
success "Cache cleanup complete!"
echo ""
echo -e "${YELLOW}Cleaned items:${NC}"
echo "  ✓ Backend build artifacts"
echo "  ✓ Log files"
echo "  ✓ Temporary files"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Rebuild:  ./go.sh 2"
echo "  2. Run:      ./go.sh 0"
