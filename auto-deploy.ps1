# 易享生活棋牌室 - 自动部署脚本
# 使用 PowerShell 执行

$serverIP = "121.43.96.127"
$username = "root"
$password = "Easy8286173"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "易享生活棋牌室 - 自动部署" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否安装了 plink (PuTTY 命令行工具)
$plinkPath = "C:\Program Files\PuTTY\plink.exe"
if (-not (Test-Path $plinkPath)) {
    Write-Host "未找到 plink.exe，尝试使用 ssh..." -ForegroundColor Yellow
    
    # 使用 ssh 命令
    Write-Host "正在连接服务器并更新代码..." -ForegroundColor Green
    
    $commands = @"
cd /opt/easy-joy-life
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
git pull origin main || (rm -rf /opt/easy-joy-life && git clone https://github.com/wukangbin6173/easy-joy-life.git /opt/easy-joy-life)
"@
    
    Write-Host "执行命令：" -ForegroundColor Yellow
    Write-Host $commands -ForegroundColor Gray
    Write-Host ""
    
    # 提示用户手动执行
    Write-Host "请手动执行以下步骤：" -ForegroundColor Yellow
    Write-Host "1. 打开 PuTTY 或其他 SSH 客户端" -ForegroundColor White
    Write-Host "2. 连接到: $username@$serverIP" -ForegroundColor White
    Write-Host "3. 密码: $password" -ForegroundColor White
    Write-Host "4. 执行上述命令" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host "使用 plink 连接服务器..." -ForegroundColor Green
    
    $commands = "cd /opt/easy-joy-life && git pull origin main"
    
    & $plinkPath -ssh -pw $password "$username@$serverIP" $commands
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "部署说明" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ 代码已推送到 GitHub" -ForegroundColor Green
Write-Host ""
Write-Host "接下来的步骤：" -ForegroundColor Yellow
Write-Host "1. 确保服务器代码已更新" -ForegroundColor White
Write-Host "2. 打开微信开发者工具" -ForegroundColor White
Write-Host "3. 点击'上传'按钮上传小程序代码" -ForegroundColor White
Write-Host "4. 在微信公众平台提交审核" -ForegroundColor White
Write-Host ""
Write-Host "本次更新内容：" -ForegroundColor Cyan
Write-Host "- 在首页 banner 下添加用户头像和昵称展示" -ForegroundColor White
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan

Read-Host "按回车键退出"
