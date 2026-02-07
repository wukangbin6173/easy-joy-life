# 易享生活无人棋牌室管理系统 - 文档中心

> **项目定位**：微信小程序 + Spring Boot 后端的无人值守棋牌室管理系统
> **文档版本**：v1.0.0
> **最后更新**：2026-02-05

---

## 📚 文档体系

### 三层架构

```
浓缩版（本文件）← 快速导航入口
   ↑ 提炼
精炼版（condensed/）← 开发时快速查阅，100-150行/文件
   ↑ 提炼
完整版（standards/）← 详细规范文档，无行数限制
```

---

## 📂 文档目录

### 1. 开发规范（standards/）

**核心架构**
- [01.arch-01.core.md](standards/01.arch-01.core.md) - 核心架构原则
- [01.arch-02.structure.md](standards/01.arch-02.structure.md) - 项目结构规范

**后端规范**
- [02.backend-01.api.md](standards/02.backend-01.api.md) - API 设计规范
- [02.backend-02.database.md](standards/02.backend-02.database.md) - 数据库设计规范
- [02.backend-03.wechat.md](standards/02.backend-03.wechat.md) - 微信集成规范

**前端规范**
- [03.frontend-01.miniprogram.md](standards/03.frontend-01.miniprogram.md) - 小程序开发规范
- [03.frontend-02.naming.md](standards/03.frontend-02.naming.md) - 命名规范

**质量规范**
- [04.quality-01.git.md](standards/04.quality-01.git.md) - Git 提交规范
- [04.quality-02.error.md](standards/04.quality-02.error.md) - 错误处理规范

**工具规范**
- [05.tool-01.gosh.md](standards/05.tool-01.gosh.md) - go.sh 脚本规范
- [05.tool-02.deployment.md](standards/05.tool-02.deployment.md) - 部署规范

### 2. 工作经验（experiences/）

**问题解决记录**
- [01.wechat-login-fix.md](experiences/01.wechat-login-fix.md) - 微信静默登录问题修复
- [02.wechat-payment-cert.md](experiences/02.wechat-payment-cert.md) - 微信支付证书过期解决方案
- [03.user-info-update.md](experiences/03.user-info-update.md) - 用户信息更新问题修复
- [04.domain-migration.md](experiences/04.domain-migration.md) - 域名更换完整流程
- [05.server-deployment.md](experiences/05.server-deployment.md) - 服务器部署经验总结

**技术实践**
- [06.go-script-optimization.md](experiences/06.go-script-optimization.md) - Go 脚本优化实践
- [07.utf8-console-fix.md](experiences/07.utf8-console-fix.md) - UTF-8 控制台问题解决

### 3. 项目设计（designs/）

**系统设计**
- [01.architecture.md](designs/01.architecture.md) - 系统架构设计
- [02.database-design.md](designs/02.database-design.md) - 数据库设计文档
- [03.api-design.md](designs/03.api-design.md) - API 接口设计

**业务设计**
- [04.business-flow.md](designs/04.business-flow.md) - 核心业务流程
- [05.payment-integration.md](designs/05.payment-integration.md) - 支付集成设计
- [06.device-control.md](designs/06.device-control.md) - 设备控制设计

**功能需求**
- [07.requirements.md](designs/07.requirements.md) - 功能需求文档

### 4. 参考文档（references/）

**快速参考**
- [deployment-checklist.md](references/deployment-checklist.md) - 部署检查清单
- [api-quick-reference.md](references/api-quick-reference.md) - API 快速参考
- [troubleshooting.md](references/troubleshooting.md) - 常见问题排查

---

## 🎯 快速开始

### 新开发者入门
1. 阅读 [系统架构设计](designs/01.architecture.md)
2. 了解 [项目结构规范](standards/01.arch-02.structure.md)
3. 查看 [开发规范](standards/)

### 遇到问题时
1. 查看 [常见问题排查](references/troubleshooting.md)
2. 搜索 [工作经验](experiences/) 中的相关记录
3. 参考 [错误处理规范](standards/04.quality-02.error.md)

### 部署上线时
1. 查看 [部署规范](standards/05.tool-02.deployment.md)
2. 使用 [部署检查清单](references/deployment-checklist.md)
3. 参考 [服务器部署经验](experiences/05.server-deployment.md)

---

## 📋 核心技术栈

| 层级 | 技术 |
|------|------|
| **前端** | 微信小程序原生开发 |
| **后端** | Spring Boot 2.x + Java 11 |
| **数据库** | MySQL 8.0 |
| **缓存** | Redis 6.0 |
| **支付** | 微信支付 V3 API |
| **部署** | Docker + Docker Compose |

---

## 🚀 项目特色

1. **微信生态深度集成**
   - 静默登录
   - 微信支付
   - 用户信息自动获取

2. **无人值守设计**
   - 自动开门
   - 自动计费
   - 远程监控

3. **规范化开发**
   - 统一的 go.sh 脚本
   - 完善的文档体系
   - 标准化的部署流程

---

## 📝 文档更新规范

### 更新顺序
1. 先更新 `standards/` 完整版
2. 提炼到 `condensed/` 精炼版
3. 更新本 README.md 导航索引

### 命名规范
```
{大类编号}.{类别}-{序号}.{主题}.md
```

示例：
- `01.arch-01.core.md` - 架构类第1个文档，主题是核心
- `02.backend-01.api.md` - 后端类第1个文档，主题是API

---

## 🔗 相关资源

- **项目仓库**：[GitHub](https://github.com/your-repo)
- **部署文档**：[deploy/README.md](../deploy/README.md)
- **ZERO 规范**：[ZERO/README.md](../ZERO/README.md)

---

**维护者**：开发团队
**联系方式**：support@easyjoylife.com
