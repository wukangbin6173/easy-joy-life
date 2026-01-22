# DeepSeek 小说生成器 - PowerShell 版本
param(
    [string]$Theme = "",
    [string]$Genre = "玄幻",
    [int]$Chapters = 15
)

# API 配置
$ApiKey = "sk-33be56d16dfc46338eb606ec7f31b72f"
$Model = "deepseek-reasoner"
$BaseUrl = "https://api.deepseek.com/v1/chat/completions"

# 调用 DeepSeek API 函数
function Call-DeepSeekAPI {
    param(
        [string]$Prompt,
        [int]$MaxTokens = 2000
    )
    
    $headers = @{
        "Authorization" = "Bearer $ApiKey"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        model = $Model
        messages = @(
            @{
                role = "user"
                content = $Prompt
            }
        )
        max_tokens = $MaxTokens
        temperature = 0.7
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri $BaseUrl -Method Post -Headers $headers -Body $body
        return $response.choices[0].message.content
    }
    catch {
        Write-Host "API 调用失败: $($_.Exception.Message)" -ForegroundColor Red
        return ""
    }
}

# 生成小说目录
function Generate-Outline {
    param(
        [string]$Theme,
        [string]$Genre,
        [int]$Chapters
    )
    
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
    
    Write-Host "正在生成小说目录..." -ForegroundColor Yellow
    $outline = Call-DeepSeekAPI -Prompt $prompt -MaxTokens 3000
    
    if ($outline) {
        $outlineFile = "小说目录.txt"
        $outline | Out-File -FilePath $outlineFile -Encoding UTF8
        Write-Host "目录已保存到 '$outlineFile'" -ForegroundColor Green
        return $outline
    }
    return ""
}

# 生成章节内容
function Generate-Chapter {
    param(
        [string]$NovelTitle,
        [int]$ChapterNumber,
        [string]$ChapterTitle,
        [string]$ChapterSummary
    )
    
    $prompt = @"
小说标题：$NovelTitle
章节：第$ChapterNumber 章 $ChapterTitle
概述：$ChapterSummary

请写出这一章的详细内容，要求：
1. 字数在2000-3000字左右
2. 情节生动有趣，对话自然
3. 描写细腻，有画面感
4. 与章节概述保持一致

请直接输出章节内容，不需要其他格式。
"@
    
    Write-Host "正在生成第$ChapterNumber 章内容..." -ForegroundColor Yellow
    $content = Call-DeepSeekAPI -Prompt $prompt -MaxTokens 4000
    
    if ($content) {
        $chapterFile = "第$($ChapterNumber.ToString('00'))章_$ChapterTitle.txt"
        $fullContent = "第$ChapterNumber 章 $ChapterTitle`n`n$content"
        $fullContent | Out-File -FilePath $chapterFile -Encoding UTF8
        Write-Host "第$ChapterNumber 章已保存到 '$chapterFile'" -ForegroundColor Green
        Start-Sleep -Seconds 2  # 避免API调用过于频繁
    }
}

# 主程序
Write-Host "=== DeepSeek 小说生成器 ===" -ForegroundColor Cyan

if (-not $Theme) {
    $Theme = Read-Host "请输入小说主题（例如：修仙者在现代都市的冒险）"
}

if (-not $Theme) {
    Write-Host "必须输入小说主题！" -ForegroundColor Red
    exit
}

$genreInput = Read-Host "请输入小说类型（默认：玄幻）"
if ($genreInput) { $Genre = $genreInput }

$chaptersInput = Read-Host "请输入章节数量（默认：15）"
if ($chaptersInput -and [int]::TryParse($chaptersInput, [ref]$null)) { 
    $Chapters = [int]$chaptersInput 
}

Write-Host "`n开始生成小说..." -ForegroundColor Green
Write-Host "主题: $Theme" -ForegroundColor White
Write-Host "类型: $Genre" -ForegroundColor White
Write-Host "章节数: $Chapters" -ForegroundColor White
Write-Host "=" * 50

# 生成目录
$outline = Generate-Outline -Theme $Theme -Genre $Genre -Chapters $Chapters

if (-not $outline) {
    Write-Host "目录生成失败，程序终止" -ForegroundColor Red
    exit
}

Write-Host "`n目录生成完成！是否继续生成章节内容？(y/n)" -ForegroundColor Yellow
$continue = Read-Host

if ($continue -eq "y" -or $continue -eq "Y" -or $continue -eq "yes") {
    # 解析目录并生成章节
    $lines = $outline -split "`n"
    $novelTitle = ""
    $currentChapter = 0
    
    foreach ($line in $lines) {
        $line = $line.Trim()
        
        if ($line -match "^小说标题：(.+)") {
            $novelTitle = $matches[1]
        }
        elseif ($line -match "^第(\d+)章：(.+)") {
            $currentChapter = [int]$matches[1]
            $chapterTitle = $matches[2]
        }
        elseif ($line -match "^概述：(.+)" -and $currentChapter -gt 0) {
            $chapterSummary = $matches[1]
            Generate-Chapter -NovelTitle $novelTitle -ChapterNumber $currentChapter -ChapterTitle $chapterTitle -ChapterSummary $chapterSummary
            $currentChapter = 0  # 重置
        }
    }
    
    Write-Host "`n小说《$novelTitle》生成完成！" -ForegroundColor Green
} else {
    Write-Host "仅生成目录完成。" -ForegroundColor Yellow
}