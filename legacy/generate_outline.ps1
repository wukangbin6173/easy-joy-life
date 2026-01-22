# 生成小说目录
$ApiKey = "sk-33be56d16dfc46338eb606ec7f31b72f"
$Model = "deepseek-reasoner"
$BaseUrl = "https://api.deepseek.com/v1/chat/completions"

# 小说设定
$Theme = "修仙者在现代都市中隐藏身份，一边上班一边修炼，遇到各种超自然事件"
$Genre = "都市修仙"
$Chapters = 15

Write-Host "=== DeepSeek 小说生成器 ===" -ForegroundColor Cyan
Write-Host "主题: $Theme" -ForegroundColor White
Write-Host "类型: $Genre" -ForegroundColor White  
Write-Host "章节数: $Chapters" -ForegroundColor White
Write-Host "=" * 50

$prompt = @"
请为一部$Genre 小说设计 $Chapters 章的详细目录。

主题：$Theme

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

...以此类推到第$Chapters 章
"@

$headers = @{
    "Authorization" = "Bearer $ApiKey"
    "Content-Type" = "application/json"
}

$body = @{
    model = $Model
    messages = @(
        @{
            role = "user"
            content = $prompt
        }
    )
    max_tokens = 3000
    temperature = 0.7
} | ConvertTo-Json -Depth 3

Write-Host "正在生成小说目录..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $BaseUrl -Method Post -Headers $headers -Body $body
    $outline = $response.choices[0].message.content
    
    # 保存到文件
    $outline | Out-File -FilePath "小说目录.txt" -Encoding UTF8
    
    Write-Host "目录生成成功！已保存到 '小说目录.txt'" -ForegroundColor Green
    Write-Host "=" * 50
    Write-Host $outline
    
} catch {
    Write-Host "API调用失败: $($_.Exception.Message)" -ForegroundColor Red
}