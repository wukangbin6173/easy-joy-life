# Go Script 改进说明

## 🎯 改进概述

基于 ZERO 框架规范，将原有的单一 `go.sh` 脚本重构为模块化、可扩展的脚本系统。

## 📊 对比表

| 特性 | 原版 go.sh | 增强版 go.sh |
|------|-----------|-------------|
| 文件结构 | 单文件 (200+ 行) | 模块化 (6个文件) |
| 代码复用 | 函数内部复用 | 独立库文件 |
| 可扩展性 | 需修改主文件 | 添加新文件即可 |
| 选项数量 | 4个固定选项 | 无限扩展 |
| 交互方式 | 命令行参数 | 菜单 + 参数 |
| 本地开发 | ❌ 不支持 | ✅ 支持 |
| 部署排除 | ❌ 无 | ✅ .deployignore |
| 错误处理 | 基础 | 增强 |
| 用户体验 | 基础 | 优化 |

## 🆕 新增功能

### 1. 本地开发环境 (go.0.sh)
```bash
./go.sh 0
```
- 自动检查依赖
- 启动开发服务器
- 显示常用 URL
- 实时日志提示

### 2. 模块化架构
```
go.sh       → 主入口（路由）
go.lib.sh   → 通用库（可复用）
go.0.sh     → 本地开发
go.1.sh     → 部署流程
go.2.sh     → 构建功能
go.3.sh     → 清理功能
```

### 3. 部署排除规则
`.deployignore` 文件控制部署时排除的文件：
- IDE 配置
- 测试文件
- 调试脚本
- 临时文件
- 敏感信息

### 4. 增强的工具函数

**输出函数**:
```bash
success "操作成功"    # ✅ 绿色
error "操作失败"      # ❌ 红色
warn "警告信息"       # ⚠️ 黄色
info "提示信息"       # ℹ️ 蓝色
step "执行步骤"       # 🔹 青色
```

**检查函数**:
```bash
check_command "java" "Install Java 11+"
check_port 8080
kill_port 8080
```

**Git 函数**:
```bash
check_git_status
git_commit_push "Custom message"
```

### 5. 交互式菜单
```
================================
    EasyJoyLife - Go Script
================================

Please select an operation:
0. Start local development environment
1. Git commit and deploy to server
2. Build backend only
3. Clean cache and build artifacts
4. Exit

Enter your choice (auto-select 0 in 10s):
```

### 6. 自动超时选择
10秒无输入自动选择默认选项（本地开发）

### 7. 耗时统计
每次操作完成后显示总耗时

## 🔄 功能映射

### 原版 → 增强版

| 原版命令 | 增强版命令 | 说明 |
|---------|-----------|------|
| `./go.sh 1` (build) | `./go.sh 2` | 仅构建 |
| `./go.sh 2` (upload) | 集成到 `./go.sh 1` | Git提交 |
| `./go.sh 3` (deploy) | 集成到 `./go.sh 1` | 部署 |
| `./go.sh 4` (all) | `./go.sh 1` | 完整流程 |
| ❌ 无 | `./go.sh 0` | **新增**: 本地开发 |
| ❌ 无 | `./go.sh 3` | **新增**: 清理缓存 |

## 📈 改进细节

### 1. 代码组织

**原版**:
```bash
# 所有代码在一个文件中
# 200+ 行混合逻辑
# 难以维护和扩展
```

**增强版**:
```bash
# 清晰的职责分离
go.lib.sh   # 通用功能
go.0.sh     # 本地开发
go.1.sh     # 部署流程
go.2.sh     # 构建功能
go.3.sh     # 清理功能
```

### 2. 配置管理

**原版**:
```bash
# 配置分散在各个函数中
SERVER_HOST="121.43.96.127"
# ... 其他配置
```

**增强版**:
```bash
# 集中在 go.lib.sh 顶部
# 易于修改和维护
SERVER_HOST="121.43.96.127"
SERVER_USER="root"
SERVER_PATH="/opt/easy-joy-life"
BACKEND_JAR="easy-joy-life-system-1.0.0.jar"
SITE_URL="https://xx.aieo.cn"
GIT_BRANCH="main"
```

### 3. 错误处理

**原版**:
```bash
set -e  # 全局错误退出
```

**增强版**:
```bash
# 细粒度错误处理
if [ $? -ne 0 ]; then
    error "Operation failed"
    exit 1
fi

# 友好的错误提示
check_command "java" "Install Java 11+"
```

### 4. 用户交互

**原版**:
```bash
# 简单的参数解析
case "${1:-all}" in
    "1"|"build") ... ;;
esac
```

**增强版**:
```bash
# 交互式菜单
echo "Please select an operation:"
echo "0. Start local development"
echo "1. Git commit and deploy"
# ...
read -t 10 -p "Enter choice: " choice

# 支持超时自动选择
if [ -z "$choice" ]; then
    choice=0
    echo "Auto-selected: Start local development"
fi
```

### 5. 部署优化

**原版**:
```bash
# 部署所有文件
ssh ... "git pull && mvn package && ..."
```

**增强版**:
```bash
# 使用 .deployignore 排除不必要的文件
# 减少传输量和部署时间
# 提高安全性（排除敏感文件）

# 支持 rsync 部署（可选）
eval "rsync -avz $RSYNC_EXCLUDES ./ server:path/"
```

## 🎨 用户体验改进

### 1. 视觉反馈
- ✅ 成功：绿色
- ❌ 错误：红色
- ⚠️ 警告：黄色
- ℹ️ 信息：蓝色
- 🔹 步骤：青色

### 2. 进度提示
```
🔹 Building backend...
✅ Backend build complete

🔹 Committing to Git...
✅ Code committed: Deploy: 2026-02-05 12:30:00

🔹 Deploying to server...
✅ Server deployment successful!

⏱️  Total time: 2m 35s
```

### 3. 帮助信息
每个操作完成后显示：
- 操作摘要
- 相关 URL
- 下一步建议
- 故障排除命令

## 🚀 扩展示例

### 添加新功能：运行测试

创建 `go.4.sh`:
```bash
#!/bin/bash
# ================================================================
# File: go.4.sh
# Description: Option 4 - Run tests
# ================================================================

step "Running tests"

cd backend
./mvnw test

if [ $? -eq 0 ]; then
    success "All tests passed"
else
    error "Some tests failed"
    exit 1
fi

cd ..
```

更新 `go.sh` 菜单:
```bash
echo "4. Run tests"
```

就这么简单！

## 📚 ZERO 框架规范

增强版严格遵循 ZERO 框架的设计理念：

1. **模块化**: 功能分离，职责单一
2. **可扩展**: 添加新功能无需修改核心
3. **标准化**: 统一的命名和结构
4. **可维护**: 清晰的代码组织
5. **用户友好**: 良好的交互体验

## 🔧 迁移指南

### 从原版迁移到增强版

1. **备份原版**:
```bash
mv go.sh go.sh.backup
```

2. **使用增强版**:
```bash
# 文件已创建，直接使用
./go.sh
```

3. **命令映射**:
```bash
# 原版                  增强版
./go.sh build      →   ./go.sh 2
./go.sh upload     →   (集成到 ./go.sh 1)
./go.sh deploy     →   (集成到 ./go.sh 1)
./go.sh all        →   ./go.sh 1
```

4. **新功能**:
```bash
./go.sh 0    # 本地开发（新增）
./go.sh 3    # 清理缓存（新增）
```

## 💡 最佳实践

1. **日常开发**: `./go.sh 0`
2. **快速构建**: `./go.sh 2`
3. **生产部署**: `./go.sh 1`
4. **解决问题**: `./go.sh 3` → `./go.sh 2`

## 🎯 总结

增强版 go.sh 提供了：
- ✅ 更好的代码组织
- ✅ 更强的可扩展性
- ✅ 更优的用户体验
- ✅ 更多的功能选项
- ✅ 更规范的架构设计

基于 ZERO 框架，为项目提供了专业、可靠的自动化部署解决方案。
