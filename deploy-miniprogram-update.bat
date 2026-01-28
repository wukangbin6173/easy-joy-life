@echo off
chcp 65001 >nul
echo ==========================================
echo 易享生活棋牌室 - 小程序更新部署
echo ==========================================
echo.

echo 步骤 1: 代码已推送到 GitHub ✓
echo.

echo 步骤 2: 手动部署说明
echo ----------------------------------------
echo 由于网络原因，请按以下步骤手动部署：
echo.
echo 1. 使用 PuTTY 或其他 SSH 工具连接服务器
echo    服务器: 121.43.96.127
echo    用户名: root
echo    密码: Easy8286173
echo.
echo 2. 在服务器上执行以下命令：
echo.
echo    cd /opt/easy-joy-life
echo    git config --global http.postBuffer 524288000
echo    git pull origin main
echo.
echo    如果 git pull 失败，使用以下备用方案：
echo    rm -rf /opt/easy-joy-life
echo    git clone https://github.com/wukangbin6173/easy-joy-life.git /opt/easy-joy-life
echo.
echo 3. 重启后端服务（如果有后端改动）：
echo    cd /opt/easy-joy-life/deploy
echo    docker-compose -f docker-compose.prod.yml restart backend
echo.
echo 4. 小程序前端更新：
echo    - 打开微信开发者工具
echo    - 上传小程序代码
echo    - 提交审核
echo.
echo ==========================================
echo.
echo 提示：本次更新内容
echo - 在首页 banner 下添加用户头像和昵称展示
echo - 优化用户信息获取逻辑
echo.
echo ==========================================
pause
