# 设置SSH密钥的脚本
$publicKey = Get-Content "$env:USERPROFILE\.ssh\id_rsa_easyjoylife.pub"
$server = "121.43.96.127"
$user = "root"

Write-Host "正在上传SSH公钥到服务器..."

# 使用PowerShell的方式上传公钥
$command = "mkdir -p ~/.ssh && echo '$publicKey' > ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh && echo 'SSH密钥配置完成'"

# 创建临时的expect脚本
$expectScript = @"
spawn ssh -o StrictHostKeyChecking=no $user@$server "$command"
expect "password:"
send "Easy8286173\r"
expect eof
"@

# 保存expect脚本
$expectScript | Out-File -FilePath "temp_ssh_setup.exp" -Encoding ASCII

Write-Host "SSH密钥配置脚本已创建"
Write-Host "请手动执行以下命令来配置SSH密钥："
Write-Host "ssh -o StrictHostKeyChecking=no root@121.43.96.127 `"mkdir -p ~/.ssh && echo '$publicKey' > ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh`""