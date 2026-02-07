# GO 脚本使用指南

## 概述

本项目使用 Windows 原生批处理脚本进行部署和管理。

**主要文件：**
- **go.bat** - Windows 部署脚本（包含所有功能）
- **generate-commit-msg.ps1** - AI 提交消息生成脚本

## Windows 用户快速开始

### 基本用法
```cmd
go.bat          # 显示交互式菜单（直接回车选择选项1）
go.bat 1        # 快速部署
go.bat 2        # 仅构建后端
go.bat 3        # 清理缓存
go.bat help     # 查看帮助
```

### 特点
✅ **纯 Windows 原生** - 不依赖 Git Bash  
✅ **完全中文化** - 所有提示都是中文  
✅ **智能默认** - 直接回车使用最常用的选项  
✅ **自动检测** - 自动使用 Maven Wrapper  
✅ **快速部署** - 一键完成从构建到部署  

## 系统要求

### Windows 本地开发
- ✅ Windows 10/11
- ✅ Java 11+ (已安装)
- ✅ Git (已安装)
- ✅ Maven Wrapper (项目自带)
- ⚠️ 可选: jq (用于 AI 生成提交消息)

### Linux 服务器
- ✅ CentOS/Ubuntu
- ✅ Java 11+
- ✅ Maven
- ✅ MySQL
- ✅ Nginx

## 功能选项详解

### 选项 0：启动本地开发环境
```cmd
go.bat 0
```
- 启动本地开发服务器
- 适合本地开发和测试
- （待实现）

### 选项 1：Git 提交并部署到服务器（默认）⭐
```cmd
go.bat 1
```

**完整流程：**
1. ✅ 检查 Git 状态
2. ✅ 本地构建后端（使用 Maven Wrapper）
3. ✅ Git 提交（支持 AI 生成提交消息）
4. ✅ 推送到 GitHub
5. ✅ SSH 连接服务器部署
6. ✅ 验证部署结果

**提交消息选项：**
- **选项 1（推荐）**：使用 DeepSeek AI 自动生成
  - 使用 `deepseek-reasoner` 模型（思考模型）
  - 流式输出思考过程（黄色文字）
  - 自动分析代码变更
  - 生成符合规范的中文提交消息
  - 实时显示 AI 的推理过程
  
- **选项 2**：手动输入提交消息
  - 自己编写提交消息
  
- **选项 3**：使用默认时间戳
  - 格式：`部署: 2026-02-07 14:30:00`

### 选项 2：仅构建后端
```cmd
go.bat 2
```
- 只构建 Java 后端项目
- 使用 Maven Wrapper（backend\mvnw.cmd）
- 生成 JAR 文件：`backend\target\easy-joy-life-system-1.0.0.jar`
- 不提交代码，不部署
- 构建时间：约 5-10 秒

### 选项 3：清理缓存
```cmd
go.bat 3
```
- 清理 `backend\target` 目录
- 清理 `node_modules` 目录（如果存在）
- 释放磁盘空间

## 交互式菜单

直接运行 `go.bat` 会显示：

```
================================
  EasyJoyLife - 一键部署
================================

请选择操作:
0. 启动本地开发环境
1. Git 提交并部署到服务器 (默认)
2. 仅构建后端
3. 清理缓存
4. 退出

请输入选择 (直接回车选择 1):
```

- **直接回车** → 自动选择选项 1（部署）
- **输入 0-4** → 执行对应操作
- **输入其他** → 显示错误并退出

## 部署流程详解（选项 1）

### 步骤 1：检查 Git 状态
```
检查 Git 状态...
```
- 检查是否在 Git 仓库中
- 如果有未提交的更改，会询问：
  ```
  警告: 工作目录有未提交的更改
  仍然继续? (y/n, 默认 y):
  ```
- **直接回车** → 继续
- **输入 n** → 取消操作

### 步骤 2：检查 Java 环境
```
检查 Java 环境...
Java 环境正常
```
- 检查 Java 是否安装
- 如果未安装，显示错误并退出

### 步骤 3：本地构建后端
```
本地构建后端...
使用 Maven Wrapper...
[INFO] BUILD SUCCESS
后端构建完成
```
- 自动检测并使用 `backend\mvnw.cmd`
- 执行：`mvnw.cmd clean package -DskipTests`
- 生成 JAR 文件
- 构建时间：约 5-10 秒

### 步骤 4：Git 提交
```
提交消息选项:
  1. 使用 DeepSeek AI 自动生成 (推荐)
  2. 手动输入提交消息
  3. 使用默认时间戳

选择方式 (1-3, 默认: 1):
```

**选择选项 1 后，会看到：**
```
使用 DeepSeek AI 生成提交消息...

思考过程:
[AI 的推理过程会实时流式显示，黄色文字]
用户修改了 readme.md 文件，将版本号从 v1.0.1 更新到 v1.1.2...
这是一个版本号更新，应该使用 chore 类型...

生成的提交消息:
chore: 更新版本号至 v1.1.2

使用此提交消息? (y/n, 默认 y):
```

**特点：**
- ✅ 使用 `deepseek-reasoner` 思考模型
- ✅ 实时显示 AI 的推理过程
- ✅ 更准确的提交消息生成
- ✅ 支持中文输出
- ✅ 无需安装额外工具

### 步骤 5：部署到服务器
```
部署到服务器...
服务器: 121.43.96.127
路径: /opt/easy-joy-life

确认部署到生产服务器? (y/n, 默认 y):
```
- **直接回车** → 确认部署
- **输入 n** → 取消部署

**服务器上执行的操作：**
1. 进入项目目录：`cd /opt/easy-joy-life`
2. 拉取最新代码：`git pull origin main`
3. 停止现有服务：`pkill -f "easy-joy-life-system"`
4. 重新构建项目：`mvn clean package -DskipTests`
5. 启动新服务：`nohup java -jar target/easy-joy-life-system-1.0.0.jar &`
6. 重载 Nginx：`nginx -s reload`

### 步骤 6：验证部署
```
验证部署...
部署验证成功 - API 正常响应
访问地址: https://xx.aieo.cn
```
- 等待 3 秒
- 测试 API：`curl https://xx.aieo.cn/api/stores`
- 显示结果

### 步骤 7：完成
```
================================
部署完成!
================================

部署摘要:
  提交: feat: 添加新功能
  服务器: 121.43.96.127
  网址: https://xx.aieo.cn

后续步骤:
  1. 测试应用: https://xx.aieo.cn
  2. 查看日志: ssh root@121.43.96.127 'tail -f /var/log/easyjoylife.log'
  3. 监控服务: ssh root@121.43.96.127 'ps aux | grep easy-joy-life'

总耗时: 从 23:30:00 到 23:32:15
```

## 配置信息

### 服务器配置（在 go.bat 中）
```batch
set SERVER_HOST=121.43.96.127
set SERVER_USER=root
set SERVER_PATH=/opt/easy-joy-life
set BACKEND_JAR=easy-joy-life-system-1.0.0.jar
set SITE_URL=https://xx.aieo.cn
set GIT_BRANCH=main
```

### DeepSeek AI 配置
```batch
set DEEPSEEK_API_KEY=sk-a1374a0606a744c3888ee224b5b8252c
```

## 常见问题

### Q: 如何安装 jq？
**不需要了！** 新版本使用 PowerShell 原生支持，无需安装 jq。

### Q: AI 生成的提交消息是乱码怎么办？
已修复！新版本使用 UTF-8 编码，支持中文显示。

### Q: Maven Wrapper 找不到怎么办？
确保 `backend\mvnw.cmd` 文件存在。如果不存在，安装系统 Maven：
```powershell
scoop install maven
```

### Q: 如何查看服务器日志？
```bash
ssh root@121.43.96.127 'tail -f /var/log/easyjoylife.log'
```

### Q: 如何检查服务状态？
```bash
ssh root@121.43.96.127 'ps aux | grep easy-joy-life'
```

### Q: 部署失败怎么办？
1. 查看错误信息
2. 检查服务器日志
3. 确认服务器 SSH 连接正常
4. 确认数据库连接正常
5. 手动登录服务器检查

### Q: 构建很慢怎么办？
第一次构建会下载依赖，比较慢。后续构建会使用缓存，速度会快很多。

### Q: 如何跳过某些步骤？
- 只构建不部署：使用 `go.bat 2`
- 只部署不构建：直接 SSH 到服务器手动操作

## 最佳实践

### 1. 快速部署流程（推荐）⭐
```
1. 运行 go.bat
2. 直接回车（选择选项 1）
3. 直接回车（确认继续）
4. 直接回车（使用 AI 生成提交消息）
5. 直接回车（确认部署）
```
**全程只需按 4-5 次回车！**

### 2. 使用 AI 生成提交消息
- 更规范、更清晰
- 自动分析代码变更
- 符合团队规范
- 需要安装 jq

### 3. 部署前先测试
- 先运行 `go.bat 2` 确保本地构建成功
- 检查代码变更
- 确认没有语法错误

### 4. 定期查看日志
```bash
ssh root@121.43.96.127 'tail -f /var/log/easyjoylife.log'
```

### 5. 监控服务状态
```bash
ssh root@121.43.96.127 'systemctl status easy-joy-life'
# 或
ssh root@121.43.96.127 'ps aux | grep easy-joy-life'
```

## 技术细节

### Maven Wrapper 工作原理
1. 检查 `backend\mvnw.cmd` 是否存在
2. 使用项目自带的 Maven 版本
3. 不需要系统安装 Maven
4. 确保团队使用相同的 Maven 版本

### SSH 部署原理
1. 使用 SSH 连接到服务器
2. 在服务器上执行一系列命令
3. 命令通过管道传递
4. 返回执行结果

### 构建优化
- 使用 `-DskipTests` 跳过测试
- 使用 Maven 本地缓存
- 增量编译

## 故障排除

### 问题：Maven Wrapper 下载失败
**原因：** 网络问题或代理设置  
**解决：** 
1. 检查网络连接
2. 配置 Maven 镜像（阿里云）
3. 使用系统 Maven

### 问题：SSH 连接失败
**原因：** 服务器不可达或密钥问题  
**解决：**
1. 检查服务器 IP 和端口
2. 确认 SSH 密钥配置正确
3. 手动测试：`ssh root@121.43.96.127`

### 问题：服务启动失败
**原因：** 端口占用或配置错误  
**解决：**
1. 查看服务器日志
2. 检查端口占用：`lsof -i:8080`
3. 检查配置文件

### 问题：API 测试失败
**原因：** 服务未完全启动或 Nginx 配置问题  
**解决：**
1. 等待更长时间
2. 检查 Nginx 配置
3. 检查防火墙设置

## 更新日志

### v3.0 - 2026-02-07
- ✅ 改为纯 Windows 原生批处理
- ✅ 移除 Git Bash 依赖
- ✅ 优化构建流程
- ✅ 改进错误处理
- ✅ 完善中文提示

### v2.0 - 2026-02-07
- ✅ 全面中文化
- ✅ 默认选项改为 1（部署）
- ✅ 优化交互体验
- ✅ 添加 Windows 批处理文件
- ✅ 完善帮助文档

## 相关文件

- `go.bat` - Windows 部署脚本（主脚本，包含所有功能）
- `generate-commit-msg.ps1` - AI 提交消息生成脚本
- `backend\mvnw.cmd` - Maven Wrapper (Windows)
- `.gitignore` - Git 忽略文件配置
- `.deployignore` - 部署排除文件配置（如果存在）

## 联系支持

如有问题，请查看：
1. 本文档的"常见问题"部分
2. 项目的其他文档
3. 服务器日志文件
