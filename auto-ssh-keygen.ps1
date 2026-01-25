$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "ssh-keygen"
$psi.Arguments = "-t rsa -b 4096 -f `"$env:USERPROFILE\.ssh\id_rsa_easyjoylife`" -C `"easyjoylife-auto`""
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true

$process = [System.Diagnostics.Process]::Start($psi)

# 发送空密码
$process.StandardInput.WriteLine("")
$process.StandardInput.WriteLine("")
$process.StandardInput.Close()

$process.WaitForExit()
$output = $process.StandardOutput.ReadToEnd()
$error = $process.StandardError.ReadToEnd()

Write-Host $output
if ($error) { Write-Host $error -ForegroundColor Red }