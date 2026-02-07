# EasyJoyLife Go Script System

基于 ZERO 框架规范的模块化部署脚本系统。

## 📁 文件结构

```
.
├── go.sh           # 主入口脚本
├── go.lib.sh       # 通用库（颜色、工具函数）
├── go.0.sh         # 选项 0: 启动本地开发环境
├── go.1.sh         # 选项 1: Git提交并部署到服务器
├── go.2.sh         # 选项 2: 仅构建后端
├── go.3.sh         # 选项 3: 清理缓存
└── .deployignore   # 部署排除规则
```

## 🚀 使用方法

### 交互式菜单
```bash
./go.sh
```

### 直接执行选项
```bash
./go.sh 0    # 启动本地开发环境
./go.sh 1    # Git提交并部署到服务器
./go.sh 2    # 仅构建后端
./go.sh 3    # 清理缓存
```

## 📋 功能说明

### 选项 0: 启动本地开发环境
- 检查 Java、MySQL 等依赖
- 自动构建后端（如果需要）
- 启动 Spring Boot 应用
- 显示常用 URL 和命令

**适用场景**: 本地开发和测试

### 选项 1: Git提交并部署到服务器
- 检查 Git 状态
- 本地构建后端
- 提交代码到 GitHub
- 部署到生产服务器
- 验证部署结果

**适用场景**: 完整的生产部署流程

**部署步骤**:
1. 本地构建验证
2. Git 提交推送
3. 服务器拉取代码
4. 服务器重新构建
5. 重启服务
6. 验证 API

### 选项 2: 仅构建后端
- 使用 Maven 构建 Spring Boot 项目
- 生成 JAR 文件
- 显示构建信息

**适用场景**: 快速构建测试

### 选项 3: 清理缓存
- 清理 backend/target
- 清理日志文件
- 清理临时文件
- 可选清理 IDE 配置

**适用场景**: 解决构建问题、释放空间

## ⚙️ 配置

所有配置集中在 `go.lib.sh` 中：

```bash
# 服务器配置
SERVER_HOST="121.43.96.127"
SERVER_USER="root"
SERVER_PATH="/opt/easy-joy-life"
BACKEND_JAR="easy-joy-life-system-1.0.0.jar"
SITE_URL="https://xx.aieo.cn"
GIT_BRANCH="main"
```

## 📝 部署排除规则

`.deployignore` 文件定义了部署时要排除的文件和目录：

- Git 文件
- IDE 配置
- 测试文件
- 调试脚本
- 日志文件
- 临时文件
- 敏感配置

## 🔧 扩展方法

### 添加新选项

1. 创建新的子脚本：
```bash
touch go.4.sh
chmod +x go.4.sh
```

2. 编写脚本内容：
```bash
#!/bin/bash
# ================================================================
# File: go.4.sh
# Description: Option 4 - Your custom task
# ================================================================

step "Your custom task"

# Your code here

success "Task complete!"
```

3. 更新 `go.sh` 菜单（可选）

### 使用库函数

在子脚本中可以使用 `go.lib.sh` 提供的函数：

**输出函数**:
- `success "message"` - 成功消息（绿色）
- `error "message"` - 错误消息（红色）
- `warn "message"` - 警告消息（黄色）
- `info "message"` - 信息消息（蓝色）
- `step "message"` - 步骤提示（青色）

**检查函数**:
- `check_command "cmd" "install_hint"` - 检查命令是否存在
- `check_port port` - 检查端口是否被占用
- `kill_port port` - 释放端口

**Git 函数**:
- `check_git_status` - 检查 Git 状态
- `git_commit_push "message"` - 提交并推送

**构建函数**:
- `build_backend` - 构建后端

**部署函数**:
- `deploy_to_server` - 部署到服务器

**其他函数**:
- `confirm "message"` - 确认操作
- `show_elapsed_time start_time` - 显示耗时

## 🎯 最佳实践

1. **本地开发**: 使用 `./go.sh 0` 启动开发环境
2. **构建测试**: 使用 `./go.sh 2` 快速构建
3. **生产部署**: 使用 `./go.sh 1` 完整部署流程
4. **清理问题**: 使用 `./go.sh 3` 清理缓存后重新构建

## 🔒 安全注意事项

1. **敏感信息**: 不要在脚本中硬编码密码
2. **SSH 密钥**: 使用 SSH 密钥认证而非密码
3. **权限管理**: 确保脚本有执行权限 `chmod +x go*.sh`
4. **备份**: 部署前确保有数据库备份

## 🐛 故障排除

### 构建失败
```bash
./go.sh 3    # 清理缓存
./go.sh 2    # 重新构建
```

### 端口被占用
```bash
# 脚本会自动释放端口，或手动执行：
pkill -f "easy-joy-life-system"
```

### SSH 连接失败
```bash
# 测试 SSH 连接
ssh root@121.43.96.127 "echo 'Connection OK'"
```

### 服务启动失败
```bash
# 查看服务器日志
ssh root@121.43.96.127 "tail -f /var/log/easyjoylife.log"
```

## 📚 参考

- [ZERO Framework](https://github.com/al90slj23/ZERO)
- [EasyJoyLife Project](./readme.md)

## 📄 许可

与主项目相同
