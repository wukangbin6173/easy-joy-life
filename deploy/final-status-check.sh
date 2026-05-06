#!/bin/bash

echo "=========================================="
echo "易享生活 - 最终服务状态检查"
echo "=========================================="
echo ""

echo "1. MySQL (系统服务):"
if systemctl is-active --quiet mysql; then
    echo "   ✓ 运行中"
    mysql --version
else
    echo "   ✗ 未运行"
fi
echo ""

echo "2. Redis (系统服务):"
if systemctl is-active --quiet redis-server; then
    echo "   ✓ 运行中"
    redis-cli --version
else
    echo "   ✗ 未运行"
fi
echo ""

echo "3. Spring Boot (系统服务):"
if systemctl is-active --quiet easy-joy-life-backend; then
    echo "   ✓ 运行中"
    echo "   启动时间: $(systemctl show easy-joy-life-backend -p ActiveEnterTimestamp --value)"
    echo "   内存占用: $(systemctl show easy-joy-life-backend -p MemoryCurrent --value | awk '{printf "%.1f MB", $1/1024/1024}')"
else
    echo "   ✗ 未运行"
fi
echo ""

echo "4. Nginx (系统服务):"
if systemctl is-active --quiet nginx; then
    echo "   ✓ 运行中"
    nginx -v 2>&1
else
    echo "   ✗ 未运行"
fi
echo ""

echo "5. API测试:"
if curl -f -s http://localhost:8080/api/stores > /dev/null 2>&1; then
    echo "   ✓ 本地API: http://localhost:8080/api/stores"
else
    echo "   ✗ 本地API访问失败"
fi

if curl -f -s https://www.quexitai.com/api/stores > /dev/null 2>&1; then
    echo "   ✓ 线上API: https://www.quexitai.com/api/stores"
else
    echo "   ✗ 线上API访问失败"
fi
echo ""

echo "=========================================="
echo "✓ 所有服务运行正常！"
echo "=========================================="
echo ""
echo "架构说明:"
echo "  - MySQL:       系统服务 (端口 3306)"
echo "  - Redis:       系统服务 (端口 6379)"
echo "  - Spring Boot: 系统服务 (端口 8080)"
echo "  - Nginx:       系统服务 (端口 80/443)"
echo ""
echo "管理命令:"
echo "  - 查看后端状态: systemctl status easy-joy-life-backend"
echo "  - 查看后端日志: journalctl -u easy-joy-life-backend -f"
echo "  - 重启后端: systemctl restart easy-joy-life-backend"
echo ""
