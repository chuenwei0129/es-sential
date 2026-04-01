# 第 8 章：版本管理

> 目标：理解语义化版本规范，配置 Changesets 自动化版本管理
> 预计时间：60 分钟

---

## 一、本章目标

学完本章，你将：
- ✅ 深入理解语义化版本（SemVer）
- ✅ 掌握 Changesets 工作流
- ✅ 配置自动化版本升级和 Changelog 生成
- ✅ 理解 npm 版本发布流程

---

## 二、概念讲解

### 2.1 语义化版本（SemVer）详解

**格式**：`MAJOR.MINOR.PATCH`

```
1.2.3
│ │ │
│ │ └── PATCH: 修复 bug
│ └──── MINOR: 新增功能（向后兼容）
└────── MAJOR: 破坏性变更
```

**版本升级规则**：

| 场景 | 当前版本 | 新版本 | 说明 |
|:---|:---:|:---:|:---|
| 修复 typo | 1.2.3 | `1.2.4` | PATCH 升级 |
| 修复 bug | 1.2.3 | `1.2.4` | PATCH 升级 |
| 新增函数 | 1.2.3 | `1.3.0` | MINOR 升级 |
| 重写内部实现 | 1.2.3 | `1.3.0` | MINOR（API 不变） |
| 删除/修改 API | 1.2.3 | `2.0.0` | MAJOR 升级 |
| Node.js 最低版本变更 | 1.2.3 | `2.0.0` | MAJOR（破坏性变更） |

**0.x.x 的特殊含义**：

```
0.1.0 → 0.1.1  修复
0.1.1 → 0.2.0  新增功能（但 API 可能不稳定）
0.2.0 → 0.3.0  破坏性变更（在 0.x 允许）
0.9.9 → 1.0.0  正式发布，API 稳定
```

> 0.x.x 表示"还在开发中，API 可能大变"。

### 2.2 为什么需要 Changesets？

**手动版本管理的痛点**：

```bash
# 1. 改代码
git commit -m "feat: add new function"

# 2. 忘记升级版本号...
# 3. 直接发布，版本号还是旧的
npm publish

# 4. 发现 changelog 也没更新
```

**Changesets 的解决方案**：

```
开发阶段                  发布阶段
─────────                ─────────
1. 写代码                  1. 运行 version 命令
   ↓                         ↓
2. 添加 changeset      →   2. 自动升级版本号
   (描述变更)                自动更新 changelog
   ↓                         ↓
3. 提交代码              →   3. 运行 publish 命令
                              发布到 npm
```

### 2.3 Changeset 文件是什么？

**格式**：`.changeset/<随机ID>.md`

```markdown
---
"@yourname/my-package": patch
---

修复 chunk 函数在 size=0 时的死循环问题
```

**文件含义**：

```markdown
---
"包名": 升级类型
---

变更描述（会写入 CHANGELOG.md）
```

**升级类型**：
- `patch` - 修复问题
- `minor` - 新增功能
- `major` - 破坏性变更

---

## 三、动手实践

### 步骤 1：安装 Changesets

```bash
# 安装
pnpm add -D @changesets/cli

# 初始化
npx changeset init
```

**初始化后会创建**：
- `.changeset/` 目录
- `.changeset/config.json` 配置文件
- `.changeset/README.md` 说明文档

### 步骤 2：配置 Changesets

修改 `.changeset/config.json`：

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

**配置说明**：

| 配置项 | 含义 | 推荐值 |
|:---|:---|:---|
| `commit` | 是否自动 commit changeset | `false`（手动控制） |
| `access` | 包访问权限 | `public` 或 `restricted` |
| `baseBranch` | 主分支 | `main` |
| `changelog` | Changelog 生成器 | 默认即可 |

### 步骤 3：创建第一个 Changeset

假设你修复了一个 bug：

```bash
# 添加 changeset
npx changeset

# 交互式提示：
# ? Which packages would you like to include? ...
# ? Which packages should have a major bump? ...
# ? Which packages should have a minor bump? ...
# ? Please enter a summary for this change: 修复 chunk 函数边界条件问题
```

生成的 `.changeset/funny-apples-jump.md`：

```markdown
---
"@yourname/my-package": patch
---

修复 chunk 函数边界条件问题

- size=0 时抛出错误而非死循环
- size 为负数时抛出错误
- 添加 NaN 和 Infinity 检查
```

### 步骤 4：提交 Changeset

```bash
git add .changeset/funny-apples-jump.md
git commit -m "docs(changeset): 修复 chunk 函数边界条件"
git push
```

### 步骤 5：版本升级

当准备发布时：

```bash
# 升级版本号（根据 changeset 计算新版本）
npx changeset version
```

这会：
1. 读取所有未消费的 changeset
2. 计算新版本号
3. 更新 `package.json` 中的版本
4. 生成/更新 `CHANGELOG.md`
5. 删除已消费的 changeset 文件

**示例**：

```
版本变化：
package.json: 0.1.0 → 0.1.1

CHANGELOG.md 新增：
## 0.1.1

### Patch Changes

- 修复 chunk 函数边界条件问题
```

### 步骤 6：发布到 npm

```bash
# 构建项目
pnpm build

# 发布（需要 npm 登录）
npx changeset publish
```

或者直接：

```bash
npm publish --access public
```

### 步骤 7：配置自动化脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

---

## 四、原理解析

### 4.1 Changeset 消费流程

```
初始化
  │
  ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   开发中    │     │  准备发布    │     │    发布后    │
│             │     │              │     │              │
│ ┌─────────┐ │     │ ┌──────────┐ │     │ ┌──────────┐ │
│ │ change- │ │     │ │ version  │ │     │ │ publish  │ │
│ │ set-1   │ │ ──▶ │ │ 命令     │ │ ──▶ │ │  命令    │ │
│ └─────────┘ │     │ └──────────┘ │     │ └──────────┘ │
│ ┌─────────┐ │     │      │       │     │              │
│ │ change- │ │     │      ▼       │     │              │
│ │ set-2   │ │     │ 更新版本号   │     │              │
│ └─────────┘ │     │ 更新 CHANGELOG     │              │
│             │     │ 删除 changeset     │              │
└─────────────┘     └──────────────┘     └──────────────┘
```

### 4.2 多包项目中的版本管理

对于 monorepo：

```json
// .changeset/config.json
{
  "linked": [
    ["@scope/package-a", "@scope/package-b"]
  ]
}
```

**linked** 表示这些包共享版本号，一起升级。

**fixed** 表示这些包固定版本（必须完全一致）：

```json
{
  "fixed": [
    ["@scope/core", "@scope/utils"]
  ]
}
```

### 4.3 Changelog 生成原理

Changesets 根据 changeset 文件自动生成标准格式的 Changelog：

```markdown
# @yourname/my-package

## 0.2.0

### Minor Changes

- 新增 camelCase 和 kebabCase 字符串函数

### Patch Changes

- 优化 chunk 函数性能
- 修复 uniq 对 null 值的处理

## 0.1.0

### Minor Changes

- 初始发布，包含 chunk、uniq、pick、omit 函数
```

---

## 五、常见问题

### Q1：changeset 文件命名规则

文件名是随机的，如 `funny-apples-jump.md`，目的是：
- 避免多人同时创建时冲突
- 无需关心文件名具体内容

### Q2：可以修改已创建的 changeset 吗？

可以！直接编辑 `.changeset/*.md` 文件：

```bash
# 修改描述
vim .changeset/funny-apples-jump.md

git add .changeset/funny-apples-jump.md
git commit --amend --no-edit
```

### Q3：如何跳过某个包的版本升级？

在 `config.json` 中配置 `ignore`：

```json
{
  "ignore": ["@scope/internal-package"]
}
```

### Q4：发布时提示 "You must be logged in"

```bash
# 登录 npm
npm login

# 或使用 npm token
npm config set //registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

### Q5：如何撤销已发布的版本？

**24 小时内可以 unpublish**：

```bash
npm unpublish @yourname/my-package@0.1.1
```

**超过 24 小时只能 deprecate**：

```bash
npm deprecate @yourname/my-package@0.1.1 "This version has a critical bug"
```

> 慎重！已发布的版本不应随意撤销，遵循"发布即承诺"原则。

---

## 六、验证检查

请确认你已完成：

- [ ] 安装了 @changesets/cli (`pnpm add -D @changesets/cli`)
- [ ] 运行了 `npx changeset init` 初始化
- [ ] 配置了 `.changeset/config.json`
- [ ] 创建并提交了一个 changeset 文件
- [ ] 测试了 `pnpm version-packages` 升级版本号
- [ ] 生成了 CHANGELOG.md
- [ ] 配置了 package.json 的 changeset/version-packages/release 脚本

**验证命令**：

```bash
# 检查 changeset 配置
npx changeset status

# 查看当前待发布的变更
npx changeset status --verbose

# 模拟版本升级（不实际修改文件）
npx changeset version --snapshot
```

---

## 七、下一步

[第 9 章：自动化 CI/CD](./chapter-09-ci.md)

我们将：
- 配置 GitHub Actions 自动化流水线
-实现代码提交时自动运行测试
- 实现合并到 main 后自动发布

---

## 参考资源

- [Changesets 官方文档](https://github.com/changesets/changesets)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [npm 发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)

