# 使用 SSH.NET 库或者 plink 进行远程部署

$server = "121.43.96.127"
$username = "root"
$password = "Easy8286173"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "开始部署到服务器" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 创建临时脚本文件
$scriptContent = @"
#!/bin/bash
set -e

echo '=========================================='
echo '步骤 1: 更新代码'
echo '=========================================='
cd /opt/easy-joy-life
git config --global http.postBuffer 524288000
git pull origin main || echo '代码已是最新'

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
docker-compose -f docker-compose.prod.yml logs --tail=50 backend

echo ''
echo '=========================================='
echo '部署完成！'
echo '=========================================='
"@

# 保存到临时文件
$tempScript = "deploy-temp.sh"
$scriptContent | Out-File -FilePath $tempScript -Encoding UTF8

Write-Host "已创建部署脚本: $tempScript" -ForegroundColor Green
Write-Host ""
Write-Host "请手动执行以下步骤：" -ForegroundColor Yellow
Write-Host ""
Write-Host "方式一：使用 SCP 上传脚本" -ForegroundColor Cyan
Write-Host "  1. 使用 WinSCP 或其他工具上传 $tempScript 到服务器" -ForegroundColor White
Write-Host "  2. SSH 连接服务器" -ForegroundColor White
Write-Host "  3. 执行: chmod +x $tempScript && ./$tempScript" -ForegroundColor White
Write-Host ""
Write-Host "方式二：直接在服务器执行命令" -ForegroundColor Cyan
Write-Host "  1. 使用 PuTTY 连接: $username@$server" -ForegroundColor White
Write-Host "  2. 密码: $password" -ForegroundColor White
Write-Host "  3. 复制粘贴以下命令：" -ForegroundColor White
Write-Host ""
Write-Host "cd /opt/easy-joy-life && git pull origin main && cd backend && ./mvnw clean package -DskipTests && cd ../deploy && docker-compose -f docker-compose.prod.yml restart backend" -ForegroundColor Gray
Write-Host ""

Read-Host "按回车键退出"
