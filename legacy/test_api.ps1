# 测试 DeepSeek API
$ApiKey = "sk-33be56d16dfc46338eb606ec7f31b72f"
$Model = "deepseek-reasoner"
$BaseUrl = "https://api.deepseek.com/v1/chat/completions"

$prompt = "请为我创作一个小说标题和第一章的标题。小说类型：都市修仙。主角：普通上班族获得修仙能力。"

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
    max_tokens = 1000
    temperature = 0.7
} | ConvertTo-Json -Depth 3

Write-Host "测试 DeepSeek API..." -ForegroundColor Yellow
Write-Host "提示词: $prompt" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $BaseUrl -Method Post -Headers $headers -Body $body
    $result = $response.choices[0].message.content
    
    Write-Host "API 调用成功！" -ForegroundColor Green
    Write-Host "返回内容:" -ForegroundColor White
    Write-Host $result
    
    # 保存结果
    $result | Out-File -FilePath "api_test_result.txt" -Encoding UTF8
    
} catch {
    Write-Host "API 调用失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "错误详情: $($_.Exception)" -ForegroundColor Red
}