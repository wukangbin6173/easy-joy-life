# 易享生活棋牌室 - 自动部署到服务器
# PowerShell 脚本

$serverIP = "121.43.96.127"
$username = "root"
$password = "Easy8286173"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "易享生活棋牌室 - 自动部署到服务器" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "服务器: $serverIP" -ForegroundColor Yellow
Write-Host "用户: $username" -ForegroundColor Yellow
Write-Host ""

# 部署命令
$deployCommands = @"
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
echo '部署完成！'
echo '=========================================='
echo ''
echo '访问地址:'
echo '- API: https://xx.aieo.cn/api/stores'
echo '- 管理后台: https://xx.aieo.cn/admin.html'
echo ''
"@

Write-Host "准备执行部署命令..." -ForegroundColor Green
Write-Host ""

# 检查是否有 plink
$plinkPath = "C:\Program Files\PuTTY\plink.exe"
if (Test-Path $plinkPath) {
    Write-Host "使用 plink 连接服务器..." -ForegroundColor Green
    
    # 使用 plink 执行命令
    $deployCommands | & $plinkPath -ssh -batch -pw $password "$username@$serverIP" "bash -s"
    
} else {
    Write-Host "未找到 plink，请手动部署" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请按以下步骤操作：" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. 使用 PuTTY 或其他 SSH 工具连接服务器" -ForegroundColor White
    Write-Host "   服务器: $serverIP" -ForegroundColor Gray
    Write-Host "   用户名: $username" -ForegroundColor Gray
    Write-Host "   密码: $password" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. 执行以下命令：" -ForegroundColor White
    Write-Host ""
    Write-Host $deployCommands -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "提示" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "本次更新内容：" -ForegroundColor Yellow
Write-Host "1. 添加 RestTemplateConfig 支持 text/plain 响应" -ForegroundColor White
Write-Host "2. 修复微信登录 API HttpMessageConverter 错误" -ForegroundColor White
Write-Host "3. 优化首页用户信息显示" -ForegroundColor White
Write-Host ""
Write-Host "部署后测试：" -ForegroundColor Yellow
Write-Host "1. 真机调试小程序" -ForegroundColor White
Write-Host "2. 测试登录功能" -ForegroundColor White
Write-Host "3. 确认用户信息卡片显示" -ForegroundColor White
Write-Host ""

Read-Host "按回车键退出"
