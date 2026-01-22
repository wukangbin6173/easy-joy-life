@echo off
chcp 65001 >nul

echo Testing DeepSeek API...

curl -X POST "https://api.deepseek.com/v1/chat/completions" ^
  -H "Authorization: Bearer sk-33be56d16dfc46338eb606ec7f31b72f" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"deepseek-reasoner\",\"messages\":[{\"role\":\"user\",\"content\":\"Create a 5-chapter urban cultivation novel outline in Chinese. Include novel title and chapter titles with brief descriptions.\"}],\"max_tokens\":1500,\"temperature\":0.7}" ^
  > api_result.json

echo.
echo API call completed. Check api_result.json for results.
type api_result.json

pause