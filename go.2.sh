#!/bin/bash
# ================================================================
# File: go.2.sh
# Description: Option 2 - Build backend only
# Project: EasyJoyLife
# ================================================================

step "Building backend"

# ============================================================
# Build backend
# ============================================================

build_backend

# ============================================================
# Display build info
# ============================================================

echo ""
success "Build complete!"
echo ""
echo -e "${YELLOW}Build artifacts:${NC}"
echo "  JAR file: backend/target/${BACKEND_JAR}"
echo "  Size:     $(du -h backend/target/${BACKEND_JAR} | cut -f1)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Run locally:  ./go.sh 0"
echo "  2. Deploy:       ./go.sh 1"
echo "  3. Test JAR:     java -jar backend/target/${BACKEND_JAR}"
