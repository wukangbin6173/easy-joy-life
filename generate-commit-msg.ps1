# ================================================================
# File: generate-commit-msg.ps1
# Description: Generate commit message using DeepSeek AI
# ================================================================

param(
    [string]$DiffFile = "$env:TEMP\git_diff.txt",
    [string]$ApiKey = $env:DEEPSEEK_API_KEY,
    [string]$OutputFile = "$env:TEMP\ai_commit_msg.txt"
)

# 设置输出编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

try {
    # 读取 git diff
    $diff = Get-Content $DiffFile -Raw -Encoding UTF8
    
    if ([string]::IsNullOrWhiteSpace($diff)) {
        Write-Output "NO_CHANGES"
        exit 0
    }
    
    # 构建提示词
    $prompt = @"
Based on the following git changes, generate a concise commit message in Chinese.

Format: <type>: <description>

Types:
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- chore: 构建/工具链相关

Git changes:
$diff

Provide ONLY the commit message, no explanation.
"@
    
    # 构建请求体
    $body = @{
        model = "deepseek-reasoner"
        messages = @(
            @{
                role = "user"
                content = $prompt
            }
        )
        temperature = 0.7
        max_tokens = 200
        stream = $true
    } | ConvertTo-Json -Depth 10 -Compress
    
    # 创建 HTTP 请求
    $request = [System.Net.WebRequest]::Create('https://api.deepseek.com/v1/chat/completions')
    $request.Method = 'POST'
    $request.ContentType = 'application/json; charset=utf-8'
    $request.Headers.Add('Authorization', "Bearer $ApiKey")
    $request.Timeout = 30000
    
    # 发送请求
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
    $request.ContentLength = $bytes.Length
    $stream = $request.GetRequestStream()
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
    
    # 接收响应
    $response = $request.GetResponse()
    $reader = New-Object System.IO.StreamReader($response.GetResponseStream(), [System.Text.Encoding]::UTF8)
    
    $fullContent = ''
    $reasoning = ''
    
    Write-Host ""
    Write-Host "思考过程:" -ForegroundColor Cyan
    Write-Host ""
    
    # 流式读取响应
    while (-not $reader.EndOfStream) {
        $line = $reader.ReadLine()
        
        if ($line.StartsWith('data: ')) {
            $json = $line.Substring(6)
            
            if ($json -ne '[DONE]') {
                try {
                    $data = $json | ConvertFrom-Json
                    $delta = $data.choices[0].delta
                    
                    # 显示推理过程
                    if ($delta.reasoning_content) {
                        $reasoning += $delta.reasoning_content
                        Write-Host $delta.reasoning_content -NoNewline -ForegroundColor Yellow
                    }
                    
                    # 收集最终内容
                    if ($delta.content) {
                        $fullContent += $delta.content
                    }
                } catch {
                    # 忽略解析错误
                }
            }
        }
    }
    
    $reader.Close()
    $response.Close()
    
    Write-Host ""
    Write-Host ""
    Write-Host "生成的提交消息:" -ForegroundColor Green
    Write-Host $fullContent -ForegroundColor White
    Write-Host ""
    
    # 保存到文件
    $fullContent | Out-File -FilePath $OutputFile -Encoding UTF8 -NoNewline
    
} catch {
    Write-Host "错误: $($_.Exception.Message)" -ForegroundColor Red
    Write-Output "API_ERROR" | Out-File -FilePath $OutputFile -Encoding UTF8 -NoNewline
    exit 1
}
