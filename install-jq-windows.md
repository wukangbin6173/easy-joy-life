# Windows 安装 jq 指南

## 方法 1: 使用 Chocolatey（推荐）

如果已安装 Chocolatey：

```powershell
choco install jq
```

## 方法 2: 手动下载安装

### 步骤 1: 下载 jq

访问：https://stedolan.github.io/jq/download/

或直接下载：https://github.com/stedolan/jq/releases/download/jq-1.6/jq-win64.exe

### 步骤 2: 安装到系统

```powershell
# 创建工具目录（如果不存在）
New-Item -ItemType Directory -Force -Path "C:\Tools"

# 下载 jq（使用 PowerShell）
Invoke-WebRequest -Uri "https://github.com/stedolan/jq/releases/download/jq-1.6/jq-win64.exe" -OutFile "C:\Tools\jq.exe"

# 添加到 PATH（临时）
$env:Path += ";C:\Tools"

# 添加到 PATH（永久）
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Tools", [EnvironmentVariableTarget]::User)
```

### 步骤 3: 验证安装

```powershell
jq --version
```

应该显示：`jq-1.6`

## 方法 3: 使用 Git Bash 内置工具

如果安装了 Git for Windows，可以在 Git Bash 中使用：

```bash
# 在 Git Bash 中
bash generate-commit-msg.sh
```

## 快速安装脚本

创建一个 PowerShell 脚本 `install-jq.ps1`：

```powershell
# 检查是否已安装
if (Get-Command jq -ErrorAction SilentlyContinue) {
    Write-Host "jq is already installed" -ForegroundColor Green
    jq --version
    exit 0
}

Write-Host "Installing jq..." -ForegroundColor Yellow

# 创建工具目录
$toolsDir = "C:\Tools"
if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
}

# 下载 jq
$jqUrl = "https://github.com/stedolan/jq/releases/download/jq-1.6/jq-win64.exe"
$jqPath = "$toolsDir\jq.exe"

try {
    Write-Host "Downloading jq from $jqUrl..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $jqUrl -OutFile $jqPath -UseBasicParsing
    Write-Host "Downloaded to $jqPath" -ForegroundColor Green
} catch {
    Write-Host "Failed to download jq: $_" -ForegroundColor Red
    exit 1
}

# 添加到 PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
if ($currentPath -notlike "*$toolsDir*") {
    Write-Host "Adding $toolsDir to PATH..." -ForegroundColor Cyan
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$toolsDir", [EnvironmentVariableTarget]::User)
    $env:Path += ";$toolsDir"
    Write-Host "Added to PATH" -ForegroundColor Green
}

# 验证安装
Write-Host "`nVerifying installation..." -ForegroundColor Cyan
& $jqPath --version

Write-Host "`njq installed successfully!" -ForegroundColor Green
Write-Host "You may need to restart your terminal for PATH changes to take effect." -ForegroundColor Yellow
```

运行：

```powershell
powershell -ExecutionPolicy Bypass -File install-jq.ps1
```

## 测试 jq

```powershell
# 测试 JSON 解析
echo '{"name":"test","value":123}' | jq .

# 应该输出格式化的 JSON
{
  "name": "test",
  "value": 123
}
```

## 故障排除

### 问题 1: 下载失败

```powershell
# 使用代理
$proxy = "http://proxy.example.com:8080"
Invoke-WebRequest -Uri $jqUrl -OutFile $jqPath -Proxy $proxy
```

### 问题 2: PATH 未生效

```powershell
# 刷新环境变量
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 或重启终端
```

### 问题 3: 权限问题

```powershell
# 以管理员身份运行 PowerShell
# 右键点击 PowerShell -> 以管理员身份运行
```

## 完成

安装完成后，就可以使用 AI Git 提交功能了：

```bash
# 在 Git Bash 中
./generate-commit-msg.sh

# 或使用 go.sh
./go.sh 1
```
