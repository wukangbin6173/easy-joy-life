# 使用 SSH 密钥免密码部署到服务器

$server = "121.43.96.127"
$username = "root"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "易享生活棋牌室 - 免密码部署" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 SSH 密钥
$privateKeyPath = "$env:USERPROFILE\.ssh\id_rsa"
if (-not (Test-Path $privateKeyPath)) {
    Write-Host "❌ 未找到 SSH 私钥" -ForegroundColor Red
    Write-Host "请先运行: .\setup-ssh-key-auto.ps1" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "✓ 找到 SSH 密钥" -ForegroundColor Green
Write-Host "服务器: $username@$server" -ForegroundColor Gray
Write-Host ""

# 部署命令
$deployScript = @"
#!/bin/bash
set -e

echo '=========================================='
echo '步骤 1: 更新代码'
echo '=========================================='
cd /opt/easy-joy-life
git config --global http.postBuffer 524288000
git pull origin main

echo ''
echo '=========================================='
echo '步骤 2: 编译后端'
echo '=========================================='
cd backend
./mvnw clean package -DskipTests

echo ''
echo '=========================================='
echo '步骤 3: 重启服务'
echo '=========================================='
cd ../deploy
docker-compose -f docker-compose.prod.yml restart backend

echo ''
echo '=========================================='
echo '步骤 4: 等待服务启动'
echo '=========================================='
sleep 10

echo ''
echo '=========================================='
echo '步骤 5: 查看服务状态'
echo '=========================================='
docker-compose -f docker-compose.prod.yml ps

echo ''
echo '=========================================='
echo '步骤 6: 查看最新日志'
echo '=========================================='
docker-compose -f docker-compose.prod.yml logs --tail=50 backend

echo ''
echo '=========================================='
echo '部署完成！'
echo '=========================================='
echo ''
echo '访问地址:'
echo '- API: https://xx.aieo.cn/api/stores'
echo '- 管理后台: https://xx.aieo.cn/admin.html'
echo ''
"@

Write-Host "开始部署..." -ForegroundColor Yellow
Write-Host ""

try {
    # 使用 SSH 执行部署脚本
    $deployScript | ssh -i $privateKeyPath -o StrictHostKeyChecking=no "$username@$server" "bash -s"
    
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "✓ 部署成功！" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "1. 真机调试小程序" -ForegroundColor White
    Write-Host "2. 测试登录功能" -ForegroundColor White
    Write-Host "3. 确认用户信息卡片显示" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host "❌ 部署失败" -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "错误信息: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因：" -ForegroundColor Yellow
    Write-Host "1. SSH 密钥未配置或配置错误" -ForegroundColor White
    Write-Host "2. 服务器连接失败" -ForegroundColor White
    Write-Host "3. 权限问题" -ForegroundColor White
    Write-Host ""
    Write-Host "解决方案：" -ForegroundColor Yellow
    Write-Host "1. 运行: .\setup-ssh-key-auto.ps1" -ForegroundColor White
    Write-Host "2. 测试连接: ssh root@$server" -ForegroundColor White
    Write-Host "3. 查看详细错误: ssh -v root@$server" -ForegroundColor White
    Write-Host ""
}

Read-Host "按回车键退出"
