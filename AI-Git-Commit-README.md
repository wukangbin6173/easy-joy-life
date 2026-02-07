# 🤖 AI Git 提交信息生成 - EasyJoyLife 项目

> 使用 DeepSeek AI 自动生成规范化的 Git 提交信息

## 🚀 快速开始

### Windows 用户

```cmd
# 一键安装和配置
setup-ai-git.bat

# 使用 AI 提交
bash -c "./go.sh 1"
```

### Linux/macOS 用户

```bash
# 安装 jq（如果未安装）
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq

# 使用 AI 提交
./go.sh 1
```

## 📁 文件说明

### 核心文件

| 文件 | 说明 |
|------|------|
| `go.sh` | 主入口脚本，选项 1 支持 AI 提交 |
| `go.lib.sh` | 核心库，包含 AI 生成函数 |
| `go.1.sh` | Git 提交和部署脚本 |

### 工具脚本

| 文件 | 说明 |
|------|------|
| `generate-commit-msg.sh` | 独立的提交信息生成工具 |
| `test-deepseek-api.sh` | API 连接测试工具 |
| `git-commit-with-ai.bat` | Windows 批处理工具 |
| `setup-ai-git.bat` | 一键安装配置工具 |
| `install-jq.ps1` | jq 自动安装脚本 |

### 文档

| 文件 | 说明 |
|------|------|
| `AI-Git-Commit-README.md` | 本文件 - 项目概览 |
| `AI-Git-Commit-快速指南.md` | 快速使用指南 |
| `DeepSeek-Git-Integration.md` | 详细技术文档 |
| `DeepSeek-AI-集成完成总结.md` | 项目完成总结 |
| `install-jq-windows.md` | Windows jq 安装指南 |

## 💡 使用方法

### 方法 1: 集成工作流（推荐）

```bash
./go.sh 1
```

这会：
1. 构建后端项目
2. 让你选择提交信息方式（AI/手动/默认）
3. 提交并推送到 GitHub
4. 部署到生产服务器

### 方法 2: 只生成提交信息

```bash
# 分析已暂存的变更
./generate-commit-msg.sh

# 分析所有变更
./generate-commit-msg.sh --all
```

### 方法 3: Windows 批处理

```cmd
git-commit-with-ai.bat
```

## 🎯 功能特性

### ✨ 智能生成

- 自动分析代码变更
- 识别变更类型（feat/fix/docs 等）
- 生成符合规范的中文提交信息

### 🔄 灵活选择

提供三种提交信息输入方式：

1. **AI 自动生成**（推荐）- 智能分析并生成
2. **手动输入** - 完全自定义
3. **默认时间戳** - 快速提交

### 🛡️ 容错机制

- API 调用失败自动回退
- 缺少依赖时给出安装提示
- 网络问题时使用默认方案

### 📊 提交规范

遵循 Conventional Commits 规范：

```
<type>: <description>

类型：
feat     - 新功能
fix      - 修复bug
docs     - 文档更新
style    - 代码格式调整
refactor - 代码重构
perf     - 性能优化
test     - 测试相关
chore    - 构建/工具链相关
```

## 📋 安装要求

### 必需工具

- ✅ **Git** - 版本控制系统
- ✅ **curl** - HTTP 请求工具（通常系统自带）
- ✅ **jq** - JSON 解析工具（需要安装）
- ✅ **bash** - Shell 环境（Linux/macOS 自带，Windows 需 Git Bash）

### 安装 jq

#### Windows

```cmd
# 方法 1: 使用自动安装脚本（推荐）
setup-ai-git.bat

# 方法 2: 使用 PowerShell 脚本
powershell -ExecutionPolicy Bypass -File install-jq.ps1

# 方法 3: 使用 Chocolatey
choco install jq
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq

# Arch Linux
sudo pacman -S jq
```

#### macOS

```bash
brew install jq
```

## 🔧 配置说明

### API Key 配置

在 `go.lib.sh` 中：

```bash
DEEPSEEK_API_KEY="sk-a1374a0606a744c3888ee224b5b8252c"
DEEPSEEK_API_URL="https://api.deepseek.com/v1/chat/completions"
```

### 自定义配置

如需修改配置：

```bash
# 编辑配置文件
vim go.lib.sh

# 找到 DeepSeek API Configuration 部分
# 修改相应的值
```

## 📖 使用示例

### 示例 1: 新功能开发

```bash
$ ./go.sh 1

🔹 Building backend locally...
✅ Backend build complete

Commit message options:
  1. Auto-generate with DeepSeek AI (recommended)
  2. Enter custom message
  3. Use default timestamp

Choose option (1-3, default: 1): 1

🔹 Generating commit message with DeepSeek AI...
✅ AI generated message: feat: 添加微信支付自动续费功能

Use this commit message? (y/n): y
✅ Code committed
✅ Code pushed to GitHub
```

### 示例 2: Bug 修复

```bash
$ ./generate-commit-msg.sh

📊 Analyzing staged changes...

Changes summary:
 backend/src/.../WechatPayService.java | 15 ++++++++-------
 1 file changed, 8 insertions(+), 7 deletions(-)

🤖 Calling DeepSeek AI...

✅ Generated commit message:

fix: 修复微信支付证书过期验证问题

Use this message? (y/n): y
✅ Committed successfully!
```

## 🐛 故障排除

### 问题 1: jq 命令未找到

```bash
# 错误信息
⚠️  jq not installed, using default message

# 解决方法
# Windows
setup-ai-git.bat

# Linux/macOS
sudo apt-get install jq  # Ubuntu/Debian
brew install jq          # macOS
```

### 问题 2: API 调用失败

```bash
# 可能原因
1. API Key 无效或过期
2. 网络连接问题
3. API 服务暂时不可用

# 解决方法
1. 检查 API Key 是否正确
2. 测试网络: curl https://api.deepseek.com
3. 查看详细错误信息
```

### 问题 3: 中文显示乱码

```bash
# Windows
chcp 65001

# Linux/macOS
export LANG=zh_CN.UTF-8
```

### 问题 4: Git Bash 未找到（Windows）

```cmd
# 安装 Git for Windows
# 下载地址: https://git-scm.com/download/win

# 或使用 Chocolatey
choco install git
```

## 🎓 最佳实践

### 1. 提交前检查

```bash
# 查看变更
git status
git diff

# 只暂存相关文件
git add <specific-files>
```

### 2. 审查 AI 生成的信息

- ✅ 检查类型是否正确
- ✅ 确认描述是否准确
- ✅ 必要时手动调整

### 3. 保持提交原子性

- 每次提交只做一件事
- 避免混合多个不相关的变更
- 这样 AI 才能生成准确的提交信息

### 4. 定期更新

```bash
# 定期拉取最新代码
git pull origin main
```

## 📚 相关资源

### 文档

- 📖 [快速指南](AI-Git-Commit-快速指南.md) - 简明使用指南
- 📖 [详细文档](DeepSeek-Git-Integration.md) - 完整技术文档
- 📖 [完成总结](DeepSeek-AI-集成完成总结.md) - 项目总结
- 📖 [jq 安装](install-jq-windows.md) - Windows jq 安装指南

### 外部链接

- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git 提交规范](https://chris.beams.io/posts/git-commit/)
- [jq 官方文档](https://stedolan.github.io/jq/)

## ⚠️ 注意事项

### API Key 安全

⚠️ **重要**：不要将包含真实 API Key 的文件提交到公开仓库

建议做法：
- 使用环境变量
- 使用 .env 文件（添加到 .gitignore）
- 使用密钥管理服务

### 网络要求

- 需要能够访问 `api.deepseek.com`
- 国内用户可能需要配置代理
- API 调用失败会自动回退

### 变更大小限制

- 脚本只发送前 200 行 diff
- 超大变更建议拆分成多个提交

## 🎉 总结

### 核心价值

1. **提高效率** - 无需手动编写提交信息
2. **规范统一** - 所有提交遵循统一格式
3. **智能准确** - AI 分析代码生成准确描述
4. **灵活易用** - 多种使用方式适应不同场景
5. **容错性强** - 完善的错误处理机制

### 快速命令参考

```bash
# 完整工作流
./go.sh 1

# 只生成提交信息
./generate-commit-msg.sh

# 测试 API
./test-deepseek-api.sh

# Windows 一键安装
setup-ai-git.bat
```

---

**项目**: EasyJoyLife  
**集成时间**: 2026-02-07  
**API**: DeepSeek Chat  

**祝使用愉快！🎉**
