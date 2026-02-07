# AI Git 提交信息生成 - 快速指南

## 🚀 快速开始

### 方法 1: 使用 go.sh（推荐）

```bash
./go.sh 1
```

选择选项 1 即可使用 AI 自动生成提交信息。

### 方法 2: 使用独立脚本

```bash
# 分析已暂存的变更
./generate-commit-msg.sh

# 分析所有变更（包括未暂存的）
./generate-commit-msg.sh --all
```

### 方法 3: Windows 批处理

```cmd
git-commit-with-ai.bat
```

## 📋 前置要求

### Linux/macOS

```bash
# 检查是否已安装
which git curl jq

# 如果缺少 jq，安装它
# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq

# macOS
brew install jq
```

### Windows

1. 安装 [Git for Windows](https://git-scm.com/download/win)
2. 下载 [jq for Windows](https://stedolan.github.io/jq/download/)
3. 将 jq.exe 放到 PATH 中（如 `C:\Windows\System32`）

## 💡 使用示例

### 示例 1: 完整流程

```bash
# 1. 修改代码
vim backend/src/main/java/com/easyjoylife/service/WechatPayService.java

# 2. 运行 go.sh
./go.sh 1

# 3. 选择 AI 生成
Choose option (1-3, default: 1): 1

# 4. 查看 AI 生成的提交信息
✅ AI generated message: feat: 集成微信支付公钥模式验证

# 5. 确认使用
Use this commit message? (y/n): y

# 6. 自动提交并推送
✅ Code committed
✅ Code pushed to GitHub
```

### 示例 2: 只生成提交信息

```bash
# 只想看看 AI 会生成什么提交信息
./generate-commit-msg.sh

# 查看生成的信息
✅ Generated commit message:
fix: 修复微信支付证书过期问题

# 决定是否使用
Use this message? (y/n): n

# 可以复制这个信息，手动修改后使用
git commit -m "fix: 修复微信支付证书过期问题并添加自动更新机制"
```

### 示例 3: 测试 API 连接

```bash
# 测试 DeepSeek API 是否正常工作
./test-deepseek-api.sh
```

## 🎯 提交信息类型

AI 会根据代码变更自动选择合适的类型：

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | feat: 添加微信支付功能 |
| `fix` | 修复bug | fix: 修复用户登录失败问题 |
| `docs` | 文档更新 | docs: 更新部署文档 |
| `style` | 代码格式 | style: 统一代码缩进格式 |
| `refactor` | 代码重构 | refactor: 重构支付服务代码 |
| `perf` | 性能优化 | perf: 优化数据库查询性能 |
| `test` | 测试相关 | test: 添加支付功能单元测试 |
| `chore` | 构建/工具 | chore: 更新依赖版本 |

## 🔧 配置说明

### API Key 配置

在 `go.lib.sh` 中：

```bash
DEEPSEEK_API_KEY="sk-a1374a0606a744c3888ee224b5b8252c"
DEEPSEEK_API_URL="https://api.deepseek.com/v1/chat/completions"
```

### 自定义配置

如果需要修改 API Key 或其他配置：

```bash
# 编辑 go.lib.sh
vim go.lib.sh

# 找到 DeepSeek API Configuration 部分
# 修改 DEEPSEEK_API_KEY 的值
```

## ⚠️ 注意事项

### 1. API Key 安全

- ⚠️ 不要将包含真实 API Key 的文件提交到公开仓库
- 建议使用环境变量或配置文件管理 API Key
- 可以创建 `.env` 文件并添加到 `.gitignore`

### 2. 网络要求

- 需要能够访问 `api.deepseek.com`
- 如果在国内，可能需要配置代理

### 3. 变更大小限制

- 脚本只会发送前 200 行的 diff 到 API
- 对于超大变更，AI 可能无法完整分析
- 建议将大变更拆分成多个小提交

### 4. 中文支持

- 生成的提交信息为中文
- 确保终端支持 UTF-8 编码
- Windows 用户可能需要设置 `chcp 65001`

## 🐛 故障排除

### 问题 1: jq 命令未找到

```bash
# 错误信息
⚠️  jq not installed, using default message

# 解决方法
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq

# Windows
# 下载 jq.exe 并放到 PATH 中
```

### 问题 2: API 调用失败

```bash
# 错误信息
⚠️  Failed to generate commit message with AI

# 可能原因
1. API Key 无效或过期
2. 网络连接问题
3. API 服务暂时不可用

# 解决方法
1. 检查 API Key 是否正确
2. 测试网络连接: curl https://api.deepseek.com
3. 查看详细错误信息
```

### 问题 3: 没有变更可提交

```bash
# 错误信息
⚠️  No changes found

# 解决方法
# 如果有未暂存的变更
git add .

# 或使用 --all 参数
./generate-commit-msg.sh --all
```

### 问题 4: 中文显示乱码

```bash
# Windows 用户
chcp 65001

# Linux/macOS 用户
export LANG=zh_CN.UTF-8
```

## 📚 相关文件

| 文件 | 说明 |
|------|------|
| `go.sh` | 主入口脚本 |
| `go.lib.sh` | 通用库，包含 AI 生成函数 |
| `go.1.sh` | Git 提交和部署脚本 |
| `generate-commit-msg.sh` | 独立的提交信息生成脚本 |
| `test-deepseek-api.sh` | API 测试脚本 |
| `git-commit-with-ai.bat` | Windows 批处理脚本 |
| `DeepSeek-Git-Integration.md` | 详细文档 |

## 🎓 最佳实践

### 1. 提交前检查

```bash
# 查看将要提交的变更
git status
git diff --cached

# 确保只提交相关的变更
git add <specific-files>
```

### 2. 审查 AI 生成的信息

- 不要盲目接受 AI 生成的信息
- 检查是否准确描述了变更
- 必要时手动修改

### 3. 保持提交原子性

- 每次提交只做一件事
- 避免混合多个不相关的变更
- 这样 AI 才能生成准确的提交信息

### 4. 定期更新

```bash
# 定期拉取最新代码
git pull origin main

# 避免冲突
```

## 🔗 相关链接

- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [Conventional Commits 规范](https://www.conventionalcommits.org/)
- [Git 提交信息最佳实践](https://chris.beams.io/posts/git-commit/)
- [jq 官方文档](https://stedolan.github.io/jq/)

## 💬 反馈与支持

如果遇到问题或有改进建议：

1. 查看详细文档：`DeepSeek-Git-Integration.md`
2. 运行测试脚本：`./test-deepseek-api.sh`
3. 检查 API 响应日志
4. 联系开发团队

---

**祝你使用愉快！🎉**
