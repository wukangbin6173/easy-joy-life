# SSH自动连接脚本
param(
    [string]$Command = ""
)

$server = "121.43.96.127"
$user = "root"
$password = "Easy8286173"
$keyFile = "$env:USERPROFILE\.ssh\id_rsa_easyjoylife"

# 创建SSH连接函数
function Connect-SSH {
    param([string]$cmd)
    
    if ($cmd) {
        # 执行命令
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "ssh"
        $psi.Arguments = "-i `"$keyFile`" -o StrictHostKeyChecking=no $user@$server `"$cmd`""
        $psi.UseShellExecute = $false
        $psi.RedirectStandardInput = $true
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        
        $process = [System.Diagnostics.Process]::Start($psi)
        
        # 如果需要密码，自动输入
        Start-Sleep -Milliseconds 500
        try {
            $process.StandardInput.WriteLine("")  # 空密码
            $process.StandardInput.Close()
        } catch {}
        
        $process.WaitForExit()
        $output = $process.StandardOutput.ReadToEnd()
        $error = $process.StandardError.ReadToEnd()
        
        if ($output) { Write-Host $output }
        if ($error -and $error -notmatch "Warning") { Write-Host $error -ForegroundColor Red }
        
        return $process.ExitCode
    }
}

# 执行命令
if ($Command) {
    Connect-SSH -cmd $Command
} else {
    Write-Host "用法: .\ssh-auto-connect.ps1 -Command '你的命令'"
    Write-Host "示例: .\ssh-auto-connect.ps1 -Command 'ls -la'"
}