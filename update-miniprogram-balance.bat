@echo off
echo ========================================
echo 更新小程序余额显示
echo ========================================
echo.

echo 正在上传修改后的文件...
scp miniprogram/pages/wallet/wallet.js root@xx.aieo.cn:/opt/easy-joy-life/miniprogram/pages/wallet/
scp miniprogram/pages/profile/profile.js root@xx.aieo.cn:/opt/easy-joy-life/miniprogram/pages/profile/
scp miniprogram/pages/recharge/recharge.js root@xx.aieo.cn:/opt/easy-joy-life/miniprogram/pages/recharge/

echo.
echo ========================================
echo 文件上传完成！
echo ========================================
echo.
echo 请在微信开发者工具中：
echo 1. 重新编译小程序
echo 2. 清除缓存（工具 - 清除缓存 - 清除全部缓存）
echo 3. 重新预览或上传
echo.
pause
