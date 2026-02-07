@echo off
chcp 65001 >nul
echo ========================================
echo 文档迁移脚本
echo ========================================
echo.

REM 创建归档目录
echo [1/5] 创建归档目录...
if not exist "archive\2025-12" mkdir "archive\2025-12"
echo ✓ 归档目录已创建

REM 迁移工作经验文档
echo.
echo [2/5] 迁移工作经验文档...

if exist "微信静默登录问题修复总结.md" (
    copy "微信静默登录问题修复总结.md" "docs\experiences\01.wechat-login-fix.md" >nul
    echo ✓ 微信登录问题修复文档已迁移
)

if exist "用户信息更新问题修复完成总结.md" (
    copy "用户信息更新问题修复完成总结.md" "docs\experiences\03.user-info-update.md" >nul
    echo ✓ 用户信息更新问题文档已迁移
)

if exist "域名更换至xx.aieo.cn完成总结.md" (
    copy "域名更换至xx.aieo.cn完成总结.md" "docs\experiences\04.domain-migration.md" >nul
    echo ✓ 域名更换文档已迁移
)

if exist "后端服务完全修复部署总结.md" (
    copy "后端服务完全修复部署总结.md" "docs\experiences\05.server-deployment.md" >nul
    echo ✓ 服务器部署经验文档已迁移
)

if exist "Go脚本优化完成总结.md" (
    copy "Go脚本优化完成总结.md" "docs\experiences\06.go-script-optimization.md" >nul
    echo ✓ Go脚本优化文档已迁移
)

REM 迁移设计文档
echo.
echo [3/5] 迁移设计文档...

if exist "无人值守棋牌室小程序功能需求文档.md" (
    copy "无人值守棋牌室小程序功能需求文档.md" "docs\designs\07.requirements.md" >nul
    echo ✓ 功能需求文档已迁移
)

REM 移动部署文档
echo.
echo [4/5] 移动部署文档...

if exist "一键部署使用指南.md" (
    move "一键部署使用指南.md" "deploy\" >nul 2>&1
    echo ✓ 一键部署指南已移至 deploy/
)

if exist "小程序发布上线指南.md" (
    move "小程序发布上线指南.md" "deploy\" >nul 2>&1
    echo ✓ 小程序发布指南已移至 deploy/
)

REM 归档临时文档
echo.
echo [5/5] 归档临时文档...

set "temp_docs=修复登录问题部署指南.md 充值金额选项更新总结.md 充值错误处理修复完成总结.md 前端服务器连接配置完成总结.md 后端API服务部署完成总结.md 门店加载失败问题修复总结.md 静默登录问题修复总结.md 项目交付说明.md"

for %%f in (%temp_docs%) do (
    if exist "%%f" (
        move "%%f" "archive\2025-12\" >nul 2>&1
        echo ✓ %%f 已归档
    )
)

echo.
echo ========================================
echo 迁移完成！
echo ========================================
echo.
echo 下一步：
echo 1. 查看 docs/README.md 了解新的文档结构
echo 2. 查看 docs/MIGRATION_PLAN.md 了解迁移详情
echo 3. 根据需要创建新的规范文档
echo.
echo 保留的文档：
echo - README.md
echo - GO脚本使用指南.md
echo - GO_SCRIPT_README.md
echo - GO_QUICK_REFERENCE.md
echo.
pause
