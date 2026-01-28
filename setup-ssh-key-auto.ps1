# SSH 密钥自动配置脚本
# 用于配置免密码登录到服务器

$server = "121.43.96.127"
$username = "root"
$password = "Easy8286173"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SSH 密钥配置 - 免密码登录设置" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查公钥是否存在
$publicKeyPath = "$env:USERPROFILE\.ssh\id_rsa.pub"
if (-not (Test-Path $publicKeyPath)) {
    Write-Host "❌ 未找到 SSH 公钥" -ForegroundColor Red
    Write-Host "请先运行: ssh-keygen -t rsa -b 4096" -ForegroundColor Yellow
    exit 1
}

# 读取公钥
$publicKey = Get-Content $publicKeyPath -Raw
$publicKey = $publicKey.Trim()

Write-Host "✓ 找到 SSH 公钥" -ForegroundColor Green
Write-Host "公钥内容: $($publicKey.Substring(0, 50))..." -ForegroundColor Gray
Write-Host ""

# 创建上传公钥的命令
$setupCommands = @"
# 创建 .ssh 目录
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 添加公钥到 authorized_keys
echo '$publicKey' >> ~/.ssh/authorized_keys

# 设置正确的权限
chmod 600 ~/.ssh/authorized_keys

# 确保 SSH 配置允许密钥登录
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/g' /etc/ssh/sshd_config
sed -i 's/PubkeyAuthentication no/PubkeyAuthentication yes/g' /etc/ssh/sshd_config

# 重启 SSH 服务
systemctl restart sshd || service ssh restart

echo ''
echo '=========================================='
echo 'SSH 密钥配置完成！'
echo '=========================================='
echo ''
echo '现在可以使用以下命令免密码登录：'
echo 'ssh root@121.43.96.127'
echo ''
"@

Write-Host "准备配置服务器..." -ForegroundColor Yellow
Write-Host ""

# 保存命令到临时文件
$tempFile = "setup-ssh-temp.sh"
$setupCommands | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline

Write-Host "已创建配置脚本: $tempFile" -ForegroundColor Green
Write-Host ""

# 尝试使用 scp 上传并执行
Write-Host "方式一：使用 SSH 命令（推荐）" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "复制以下命令到 PowerShell 执行：" -ForegroundColor White
Write-Host ""
Write-Host "type `"$tempFile`" | ssh root@$server `"bash -s`"" -ForegroundColor Yellow
Write-Host ""
Write-Host "密码: $password" -ForegroundColor Gray
Write-Host ""

Write-Host "方式二：手动配置" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "1. 使用 PuTTY 连接服务器: $username@$server" -ForegroundColor White
Write-Host "2. 执行以下命令：" -ForegroundColor White
Write-Host ""
Write-Host "mkdir -p ~/.ssh && chmod 700 ~/.ssh" -ForegroundColor Yellow
Write-Host "echo '$publicKey' >> ~/.ssh/authorized_keys" -ForegroundColor Yellow
Write-Host "chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Yellow
Write-Host ""

Write-Host "方式三：使用 PuTTY 的 plink（如果已安装）" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
$plinkPath = "C:\Program Files\PuTTY\plink.exe"
if (Test-Path $plinkPath) {
    Write-Host "检测到 plink，正在自动配置..." -ForegroundColor Green
    Write-Host ""
    
    try {
        # 使用 plink 执行命令
        $setupCommands | & $plinkPath -ssh -batch -pw $password "$username@$server" "bash -s"
        
        Write-Host ""
        Write-Host "✓ SSH 密钥配置成功！" -ForegroundColor Green
        Write-Host ""
        Write-Host "测试免密码登录：" -ForegroundColor Yellow
        Write-Host "ssh root@$server" -ForegroundColor White
        Write-Host ""
        
    } catch {
        Write-Host "❌ 自动配置失败: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "请使用方式一或方式二手动配置" -ForegroundColor Yellow
    }
} else {
    Write-Host "未找到 plink，请使用方式一或方式二" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "配置完成后测试" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "测试免密码登录：" -ForegroundColor Yellow
Write-Host "  ssh root@$server" -ForegroundColor White
Write-Host ""
Write-Host "如果成功，以后部署时可以直接运行：" -ForegroundColor Yellow
Write-Host "  .\deploy-with-ssh-key.ps1" -ForegroundColor White
Write-Host ""

Read-Host "按回车键退出"
