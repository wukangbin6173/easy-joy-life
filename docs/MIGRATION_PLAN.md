# 文档迁移计划

> **目的**：整理项目根目录的散乱 md 文件，迁移到规范的 docs 目录
> **创建日期**：2026-02-05

---

## 📋 迁移原则

1. **保留历史**：不删除原文件，先复制后归档
2. **分类清晰**：按文档类型分类到对应目录
3. **更新引用**：更新文档间的相互引用
4. **版本控制**：迁移过程提交到 Git

---

## 📂 文档分类映射

### 开发规范类 → `docs/standards/`

| 原文件 | 新位置 | 说明 |
|--------|--------|------|
| ARCHITECTURE.md | designs/01.architecture.md | 系统架构设计 |
| - | standards/02.backend-01.api.md | 需新建 |
| - | standards/03.frontend-01.miniprogram.md | 需新建 |

### 工作经验类 → `docs/experiences/`

| 原文件 | 新位置 | 说明 |
|--------|--------|------|
| 微信静默登录问题修复总结.md | experiences/01.wechat-login-fix.md | 已创建模板 |
| 微信支付平台证书过期完整解决方案.md | experiences/02.wechat-payment-cert.md | 已创建 |
| 用户信息更新问题修复完成总结.md | experiences/03.user-info-update.md | 需迁移 |
| 域名更换至www.quexitai.com完成总结.md | experiences/04.domain-migration.md | 需迁移 |
| 后端服务完全修复部署总结.md | experiences/05.server-deployment.md | 需迁移 |
| Go脚本优化完成总结.md | experiences/06.go-script-optimization.md | 需迁移 |
| ZERO/永久解决方案总结.md | experiences/07.utf8-console-fix.md | 需迁移 |

### 项目设计类 → `docs/designs/`

| 原文件 | 新位置 | 说明 |
|--------|--------|------|
| ARCHITECTURE.md | designs/01.architecture.md | 已创建 |
| 无人值守棋牌室小程序功能需求文档.md | designs/07.requirements.md | 需迁移 |
| - | designs/02.database-design.md | 需新建 |
| - | designs/03.api-design.md | 需新建 |
| - | designs/04.business-flow.md | 需新建 |
| - | designs/05.payment-integration.md | 需新建 |
| - | designs/06.device-control.md | 需新建 |

### 参考文档类 → `docs/references/`

| 原文件 | 新位置 | 说明 |
|--------|--------|------|
| deploy/deployment-checklist.md | references/deployment-checklist.md | 需复制 |
| - | references/api-quick-reference.md | 需新建 |
| - | references/troubleshooting.md | 已创建 |

### 操作指南类 → 保留在根目录或 deploy/

| 原文件 | 处理方式 | 说明 |
|--------|---------|------|
| GO脚本使用指南.md | 保留 | 用户常用 |
| GO_SCRIPT_README.md | 保留 | 用户常用 |
| 一键部署使用指南.md | 移至 deploy/ | 部署相关 |
| 小程序发布上线指南.md | 移至 deploy/ | 部署相关 |

### 临时文档类 → 归档到 `archive/`

| 原文件 | 处理方式 | 说明 |
|--------|---------|------|
| 修复登录问题部署指南.md | 归档 | 问题已解决 |
| 充值金额选项更新总结.md | 归档 | 已完成 |
| 充值错误处理修复完成总结.md | 归档 | 已完成 |
| 前端服务器连接配置完成总结.md | 归档 | 已完成 |
| 后端API服务部署完成总结.md | 归档 | 已完成 |
| 门店加载失败问题修复总结.md | 归档 | 已完成 |
| 静默登录问题修复总结.md | 归档 | 已完成 |
| 项目交付说明.md | 归档 | 已交付 |

---

## 🔄 迁移步骤

### 阶段一：创建目录结构（已完成 ✅）

```bash
docs/
├── README.md                   # ✅ 已创建
├── standards/                  # ✅ 已创建
│   ├── 01.arch-01.core.md     # ✅ 已创建
│   └── 01.arch-02.structure.md # ✅ 已创建
├── condensed/                  # ✅ 已创建
│   └── 01.arch-01.core.md     # ✅ 已创建
├── experiences/                # ✅ 已创建
│   └── 02.wechat-payment-cert.md # ✅ 已创建
├── designs/                    # ✅ 已创建
│   └── 01.architecture.md     # ✅ 已创建
└── references/                 # ✅ 已创建
    └── troubleshooting.md     # ✅ 已创建
```

### 阶段二：迁移工作经验文档

```bash
# 1. 创建归档目录
mkdir -p archive/2025-12

# 2. 迁移经验文档
cp "微信静默登录问题修复总结.md" docs/experiences/01.wechat-login-fix.md
cp "用户信息更新问题修复完成总结.md" docs/experiences/03.user-info-update.md
cp "域名更换至www.quexitai.com完成总结.md" docs/experiences/04.domain-migration.md
cp "后端服务完全修复部署总结.md" docs/experiences/05.server-deployment.md
cp "Go脚本优化完成总结.md" docs/experiences/06.go-script-optimization.md

# 3. 归档临时文档
mv "修复登录问题部署指南.md" archive/2025-12/
mv "充值金额选项更新总结.md" archive/2025-12/
mv "充值错误处理修复完成总结.md" archive/2025-12/
# ... 其他临时文档
```

### 阶段三：创建新的规范文档

需要创建的文档：
- [ ] `standards/02.backend-01.api.md` - API 设计规范
- [ ] `standards/02.backend-02.database.md` - 数据库设计规范
- [ ] `standards/02.backend-03.wechat.md` - 微信集成规范
- [ ] `standards/03.frontend-01.miniprogram.md` - 小程序开发规范
- [ ] `standards/03.frontend-02.naming.md` - 命名规范
- [ ] `standards/04.quality-01.git.md` - Git 提交规范
- [ ] `standards/04.quality-02.error.md` - 错误处理规范
- [ ] `standards/05.tool-01.gosh.md` - go.sh 脚本规范
- [ ] `standards/05.tool-02.deployment.md` - 部署规范

### 阶段四：创建设计文档

需要创建的文档：
- [ ] `designs/02.database-design.md` - 数据库设计
- [ ] `designs/03.api-design.md` - API 接口设计
- [ ] `designs/04.business-flow.md` - 核心业务流程
- [ ] `designs/05.payment-integration.md` - 支付集成设计
- [ ] `designs/06.device-control.md` - 设备控制设计
- [ ] `designs/07.requirements.md` - 功能需求文档

### 阶段五：更新引用关系

1. 更新 `docs/README.md` 中的文档链接
2. 更新各文档间的相互引用
3. 更新根目录 `README.md` 指向新文档

### 阶段六：清理根目录

```bash
# 1. 移动部署相关文档
mv "一键部署使用指南.md" deploy/
mv "小程序发布上线指南.md" deploy/

# 2. 归档已完成的临时文档
mv *.md archive/2025-12/  # 除了保留的文档

# 3. 保留的文档
# - README.md
# - ARCHITECTURE.md（可选，已有 docs/designs/01.architecture.md）
# - GO脚本使用指南.md
# - GO_SCRIPT_README.md
# - GO_QUICK_REFERENCE.md
```

---

## ✅ 验证清单

### 文档完整性
- [ ] 所有重要文档已迁移
- [ ] 文档分类正确
- [ ] 文档命名符合规范

### 引用正确性
- [ ] 文档间引用已更新
- [ ] 链接可以正常访问
- [ ] 图片路径正确

### 可访问性
- [ ] docs/README.md 导航清晰
- [ ] 每个目录有 README 或索引
- [ ] 文档结构易于理解

---

## 📝 后续维护

### 新增文档规范

1. **确定文档类型**
   - 开发规范 → `standards/`
   - 工作经验 → `experiences/`
   - 项目设计 → `designs/`
   - 参考文档 → `references/`

2. **命名规范**
   - 规范文档：`{编号}.{类别}-{序号}.{主题}.md`
   - 经验文档：`{序号}.{主题}.md`
   - 设计文档：`{序号}.{主题}.md`

3. **更新索引**
   - 在 `docs/README.md` 中添加链接
   - 创建对应的精炼版（如果是规范文档）

### 定期审查

- 每月审查文档准确性
- 及时更新过时内容
- 归档不再需要的文档

---

## 🎯 预期效果

### 迁移前
```
项目根目录/
├── 50+ 个散乱的 md 文件
├── 难以找到需要的文档
└── 文档间引用混乱
```

### 迁移后
```
项目根目录/
├── README.md（主入口）
├── docs/
│   ├── README.md（文档中心）
│   ├── standards/（开发规范）
│   ├── experiences/（工作经验）
│   ├── designs/（项目设计）
│   └── references/（快速参考）
├── deploy/（部署相关）
└── archive/（历史归档）
```

**优势**：
- ✅ 文档分类清晰
- ✅ 易于查找和维护
- ✅ 符合 ZERO 规范
- ✅ 便于团队协作

---

**创建人**：开发团队
**最后更新**：2026-02-05
