# DeepSeek AI Git 提交信息生成集成

## 功能说明

已将 DeepSeek AI 集成到 `go.sh` 脚本中，用于自动生成 Git 提交信息。

## 使用方法

### 1. 基本使用

```bash
./go.sh 1
```

执行后会看到三个选项：
1. **自动生成（推荐）** - 使用 DeepSeek AI 分析代码变更并生成提交信息
2. **手动输入** - 自己输入提交信息
3. **使用默认** - 使用时间戳作为提交信息

### 2. AI 生成流程

当选择选项 1（AI 生成）时：

1. 脚本会自动分析 `git diff` 的内容
2. 将变更信息发送给 DeepSeek API
3. AI 会生成符合规范的中文提交信息
4. 显示生成的信息并询问是否使用
5. 可以选择使用 AI 生成的信息或手动输入

### 3. 提交信息格式

AI 生成的提交信息遵循以下格式：

```
<type>: <description>
```

类型包括：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关

### 4. 示例

```bash
$ ./go.sh 1

🔹 Checking Git status...
🔹 Building backend locally...
✅ Backend build complete

Commit message options:
  1. Auto-generate with DeepSeek AI (recommended)
  2. Enter custom message
  3. Use default timestamp

Choose option (1-3, default: 1): 1

🔹 Committing to Git...
🔹 Generating commit message with DeepSeek AI...
✅ AI generated message: feat: 集成DeepSeek AI自动生成Git提交信息

Use this commit message? (y/n): y
✅ Code committed: feat: 集成DeepSeek AI自动生成Git提交信息
🔹 Pushing to GitHub...
✅ Code pushed to GitHub
```

## 技术实现

### API 配置

在 `go.lib.sh` 中配置：

```bash
DEEPSEEK_API_KEY="sk-a1374a0606a744c3888ee224b5b8252c"
DEEPSEEK_API_URL="https://api.deepseek.com/v1/chat/completions"
```

### 核心函数

#### `generate_commit_message()`

- 获取 git diff 信息
- 构建提示词发送给 DeepSeek API
- 解析 API 响应并返回提交信息

#### `git_commit_push()`

- 添加所有变更到暂存区
- 如果没有提供提交信息，调用 AI 生成
- 提交并推送到 GitHub

## 依赖要求

### 必需工具

- `git` - Git 版本控制
- `curl` - HTTP 请求工具
- `jq` - JSON 解析工具

### 安装 jq

如果系统没有安装 jq：

**Ubuntu/Debian:**
```bash
sudo apt-get install jq
```

**CentOS/RHEL:**
```bash
sudo yum install jq
```

**macOS:**
```bash
brew install jq
```

**Windows (Git Bash):**
```bash
# 下载 jq.exe 并放到 PATH 中
# 或使用 chocolatey
choco install jq
```

## 错误处理

### 如果 AI 生成失败

脚本会自动回退到默认的时间戳提交信息：
```
Deploy: 2026-02-07 15:30:45
```

### 如果没有安装 jq

会显示警告并使用默认提交信息：
```
⚠️  jq not installed, using default message
```

### 如果 API 调用失败

会显示 API 响应信息并使用默认提交信息：
```
⚠️  Failed to generate commit message with AI
ℹ️  API Response: {...}
```

## 优势

1. **自动化** - 无需手动编写提交信息
2. **规范化** - 遵循统一的提交信息格式
3. **智能化** - AI 分析代码变更生成准确描述
4. **灵活性** - 可以选择使用 AI、手动输入或默认信息
5. **容错性** - AI 失败时自动回退到默认方案

## 注意事项

1. **API Key 安全** - 不要将包含 API Key 的文件提交到公开仓库
2. **网络连接** - 需要能够访问 DeepSeek API
3. **变更大小** - 对于超大变更，只会发送前 200 行 diff
4. **中文支持** - 生成的提交信息为中文，确保终端支持 UTF-8

## 未来改进

- [ ] 支持自定义提交信息模板
- [ ] 支持多语言提交信息
- [ ] 缓存常用提交信息
- [ ] 支持更多 AI 模型（GPT、Claude 等）
- [ ] 添加提交信息历史记录
- [ ] 支持交互式编辑 AI 生成的信息

## 相关文件

- `go.sh` - 主入口脚本
- `go.lib.sh` - 通用库，包含 AI 生成函数
- `go.1.sh` - Git 提交和部署脚本
- `.deployignore` - 部署排除规则

## 参考

- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Commit 规范](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
