# Chrome DevTools MCP 服务器安装总结

## 🎉 安装成功！

我已经成功为你安装了 Chrome DevTools MCP 服务器。

## 📋 安装过程

### 1. 环境准备
- ✅ 安装了 uv (Python 包管理器) v0.9.24
- ✅ 安装了 Node.js v25.2.1 和 npm v11.6.2
- ✅ 配置了环境变量

### 2. MCP 服务器安装
- ✅ 安装了 Chrome DevTools MCP v0.12.1
- ✅ 创建了 MCP 配置文件 `.kiro/settings/mcp.json`
- ✅ 验证了服务器可以正常运行

## 📄 配置文件

已创建的 MCP 配置文件位于：`.kiro/settings/mcp.json`

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## 🚀 如何使用

### 1. 重启 Kiro
重启 Kiro IDE 以加载新的 MCP 服务器配置。

### 2. 测试 MCP 服务器
在 Kiro 中尝试以下提示：

```
请打开 https://www.google.com 并截图
```

或者：

```
请帮我访问 https://github.com 并获取页面标题
```

### 3. 高级用法示例
```
请打开 https://example.com，分析页面性能，并提供优化建议
```

```
请访问我的网站，检查控制台是否有错误，并截图保存
```

## 🛠️ 功能特性

Chrome DevTools MCP 服务器提供以下功能：

### 🌐 浏览器控制
- 打开网页和导航
- 点击元素和填写表单
- 滚动和页面交互

### 📸 截图和录制
- 页面截图
- 元素截图
- 性能追踪录制

### 🔍 调试和分析
- 控制台日志检查
- 网络请求分析
- 性能指标收集

### 📊 性能监控
- 页面加载时间分析
- 资源使用情况
- 性能瓶颈识别

## ⚙️ 配置选项

如果需要自定义配置，可以在 MCP 配置中添加参数：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--headless",
        "--viewport", "1920x1080"
      ],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### 常用参数
- `--headless`: 无头模式运行（不显示浏览器窗口）
- `--viewport 1920x1080`: 设置浏览器窗口大小
- `--isolated`: 使用临时用户数据目录
- `--executablePath /path/to/chrome`: 指定 Chrome 可执行文件路径

## 🔧 故障排除

### 如果 MCP 服务器无法启动：
1. 检查 Node.js 和 npm 是否正确安装
2. 确保网络连接正常（需要下载 Chrome DevTools MCP 包）
3. 重启 Kiro IDE

### 如果浏览器无法启动：
1. 确保系统已安装 Chrome 浏览器
2. 检查防火墙设置
3. 尝试添加 `--no-sandbox` 参数（仅在必要时使用）

## 📚 更多资源

- [Chrome DevTools MCP 官方文档](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [Kiro MCP 配置指南](https://docs.kiro.ai/mcp)

## 🎊 总结

Chrome DevTools MCP 服务器已成功安装并配置完成！你现在可以：

1. ✅ 通过 AI 助手控制 Chrome 浏览器
2. ✅ 自动化网页测试和调试
3. ✅ 进行性能分析和优化
4. ✅ 截图和数据收集

重启 Kiro 后即可开始使用这些强大的浏览器自动化功能！