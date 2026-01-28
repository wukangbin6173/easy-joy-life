@echo off
echo [92m🚀 部署前端修改到服务器[0m
echo [94m================================================[0m

echo [93m📤 上传前端文件到服务器...[0m

scp -i ~/.ssh/id_rsa -r miniprogram root@xx.aieo.cn:/root/easy-joy-life/

if %ERRORLEVEL% EQU 0 (
    echo [92m✅ 前端文件上传成功[0m
    echo [94m================================================[0m
    echo [92m🎉 前端部署完成！[0m
    echo [93m💡 用户现在可以看到完善信息的提示了[0m
) else (
    echo [91m❌ 前端文件上传失败[0m
    exit /b 1
)

pause