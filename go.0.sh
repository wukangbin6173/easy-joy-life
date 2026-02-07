#!/bin/bash
# ================================================================
# File: go.0.sh
# Description: Option 0 - Start local development environment
# Project: EasyJoyLife
# ================================================================

step "Starting local development environment"

# ============================================================
# 1. Check dependencies
# ============================================================

step "Checking dependencies..."

# Check Java
if ! command -v java &> /dev/null; then
    error "Java not installed"
    exit 1
fi
success "Java is available"

# Check MySQL
if command -v mysql &> /dev/null; then
    success "MySQL is available"
else
    warn "MySQL not found, please ensure it's running"
fi

# ============================================================
# 2. Check and start MySQL (if needed)
# ============================================================

step "Checking MySQL service..."

# Try to connect to MySQL
if mysql -uroot -p'EasyJoyLife2024!@#' -e "SELECT 1;" > /dev/null 2>&1; then
    success "MySQL is running"
else
    warn "Cannot connect to MySQL"
    info "Please start MySQL manually or check credentials"
fi

# ============================================================
# 3. Build backend (if needed)
# ============================================================

if [ ! -f "backend/target/${BACKEND_JAR}" ]; then
    step "Backend JAR not found, building..."
    build_backend
else
    info "Backend JAR exists, skipping build"
    info "Run './go.sh build' to rebuild"
fi

# ============================================================
# 4. Start backend service
# ============================================================

step "Starting backend service..."

# Kill existing process on port 8080
kill_port 8080

# Start backend
cd backend
info "Starting Spring Boot application..."
java -jar target/${BACKEND_JAR} &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
sleep 5

if ps -p $BACKEND_PID > /dev/null 2>&1; then
    success "Backend started (PID: $BACKEND_PID)"
    
    # Test API
    if curl -s http://localhost:8080/api/stores > /dev/null 2>&1; then
        success "Backend API is responding"
    else
        warn "Backend started but API not responding yet"
        info "Check logs: tail -f backend/logs/spring.log"
    fi
else
    error "Backend failed to start"
    exit 1
fi

# ============================================================
# 5. Display information
# ============================================================

echo ""
success "Development environment started!"
echo ""
echo -e "${YELLOW}Common URLs:${NC}"
echo "  Backend API: http://localhost:8080"
echo "  API Test:    http://localhost:8080/api/stores"
echo "  Admin:       http://localhost:8080/admin.html"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  View logs:   tail -f backend/logs/spring.log"
echo "  Stop:        pkill -f 'easy-joy-life-system'"
echo "  Rebuild:     ./go.sh build"
echo ""
info "Press Ctrl+C to stop the service"

# Keep script running
wait $BACKEND_PID
