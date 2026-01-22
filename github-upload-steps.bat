@echo off
chcp 65001 >nul
echo ========================================
echo     GitHub项目上传步骤指南
echo ========================================
echo.

echo 第一步：配置Git用户信息（如果还没配置过）
echo ----------------------------------------
echo 请执行以下命令（替换为你的真实信息）：
echo.
echo git config --global user.name "你的GitHub用户名"
echo git config --global user.email "你的GitHub邮箱"
echo.
echo 检查配置：
echo git config --global user.name
echo git config --global user.email
echo.
pause

echo 第二步：在GitHub上创建仓库
echo ----------------------------------------
echo 1. 打开浏览器访问: https://github.com
echo 2. 登录你的GitHub账号
echo 3. 点击右上角的 + 号，选择 "New repository"
echo 4. 填写仓库信息：
echo    - Repository name: easy-joy-life
echo    - Description: Easy Joy Life 管理系统
echo    - 选择 Public 或 Private
echo    - 不要勾选任何额外选项
echo 5. 点击 "Create repository"
echo 6. 复制仓库的HTTPS地址（类似：https://github.com/用户名/easy-joy-life.git）
echo.
pause

echo 第三步：添加文件到Git
echo ----------------------------------------
echo 正在添加所有文件到Git暂存区...
git add .
if %errorlevel% neq 0 (
    echo 错误：添加文件失败！
    pause
    exit /b 1
)
echo 文件添加成功！
echo.

echo 第四步：创建第一次提交
echo ----------------------------------------
echo 正在创建提交...
git commit -m "Initial commit: Easy Joy Life 管理系统"
if %errorlevel% neq 0 (
    echo 错误：提交失败！请检查Git用户配置。
    pause
    exit /b 1
)
echo 提交创建成功！
echo.

echo 第五步：添加远程仓库
echo ----------------------------------------
set /p repo_url="请输入你的GitHub仓库地址（HTTPS格式）: "
git remote add origin %repo_url%
if %errorlevel% neq 0 (
    echo 错误：添加远程仓库失败！
    pause
    exit /b 1
)
echo 远程仓库添加成功！
echo.

echo 第六步：推送到GitHub
echo ----------------------------------------
echo 正在推送到GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo 错误：推送失败！可能的原因：
    echo 1. 网络连接问题
    echo 2. GitHub认证问题
    echo 3. 仓库地址错误
    echo.
    echo 请检查以上问题后重试。
    pause
    exit /b 1
)

echo.
echo ========================================
echo          上传成功！
echo ========================================
echo.
echo 你的项目已成功上传到GitHub！
echo 现在你可以：
echo 1. 在浏览器中访问你的GitHub仓库查看项目
echo 2. 与他人分享你的项目链接
echo 3. 继续开发并使用以下命令更新：
echo    git add .
echo    git commit -m "描述你的更改"
echo    git push
echo.
echo 后续如需帮助，请查看 GitHub上传指南.md 文件
echo.
pause