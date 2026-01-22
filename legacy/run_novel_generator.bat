@echo off
chcp 65001 >nul
echo === DeepSeek 小说生成器 ===
echo.

set /p theme="请输入小说主题: "
if "%theme%"=="" (
    echo 必须输入小说主题！
    pause
    exit /b
)

set /p genre="请输入小说类型（默认：玄幻）: "
if "%genre%"=="" set genre=玄幻

set /p chapters="请输入章节数量（默认：15）: "
if "%chapters%"=="" set chapters=15

echo.
echo 开始生成小说...
echo 主题: %theme%
echo 类型: %genre%
echo 章节数: %chapters%
echo ================================================

powershell -Command "& {
    $ApiKey = 'sk-33be56d16dfc46338eb606ec7f31b72f'
    $Model = 'deepseek-reasoner'
    $BaseUrl = 'https://api.deepseek.com/v1/chat/completions'
    
    function Call-DeepSeekAPI {
        param([string]$Prompt, [int]$MaxTokens = 2000)
        $headers = @{
            'Authorization' = 'Bearer ' + $ApiKey
            'Content-Type' = 'application/json'
        }
        $body = @{
            model = $Model
            messages = @(@{ role = 'user'; content = $Prompt })
            max_tokens = $MaxTokens
            temperature = 0.7
        } | ConvertTo-Json -Depth 3
        try {
            $response = Invoke-RestMethod -Uri $BaseUrl -Method Post -Headers $headers -Body $body
            return $response.choices[0].message.content
        } catch {
            Write-Host 'API调用失败: ' $_.Exception.Message -ForegroundColor Red
            return ''
        }
    }
    
    $prompt = @'
请为一部%genre%小说设计%chapters%章的详细目录。

主题：%theme%

要求：
1. 每章要有吸引人的标题
2. 提供每章50-100字的内容概述  
3. 情节要连贯，有起承转合
4. 请按以下格式返回：

小说标题：[标题]

第1章：[章节标题]
概述：[内容概述]

第2章：[章节标题]
概述：[内容概述]

...以此类推
'@
    
    Write-Host '正在生成小说目录...' -ForegroundColor Yellow
    $outline = Call-DeepSeekAPI -Prompt $prompt -MaxTokens 3000
    
    if ($outline) {
        $outline | Out-File -FilePath '小说目录.txt' -Encoding UTF8
        Write-Host '目录已保存到 小说目录.txt' -ForegroundColor Green
        Write-Host $outline
    } else {
        Write-Host '目录生成失败' -ForegroundColor Red
    }
}"

echo.
echo 目录生成完成！请查看 "小说目录.txt" 文件
pause