# 07 - 版本管理 (Changesets)

## 语义化版本 (SemVer)

```
版本格式：MAJOR.MINOR.PATCH
示例：    2.1.3

MAJOR - 不兼容的 API 变更 (breaking change)
MINOR - 向下兼容的新功能 (feature)
PATCH - 向下兼容的问题修复 (fix)
```

## 为什么选择 Changesets？

| 工具             | 用途                | 特点                    |
| :--------------- | :------------------ | :---------------------- |
| 手动改版本号     | 小项目              | 容易忘、难追溯          |
| standard-version | 自动生成 changelog  | 已归档，不再维护        |
| **changesets**   | monorepo/单包都支持 | 社区活跃、GitHub 集成好 |

**changesets 核心流程**：

1. 开发时记录变更 → 产生 `.changeset/*.md`
2. 发版时统一消费 → 自动改版本号 + 生成 changelog
3. 推送到 npm

## 安装与初始化

```bash
# 1. 安装
pnpm add -D @changesets/cli

# 2. 初始化
npx changeset init
```

执行后会生成：

```
.changeset/
├── config.json          # changesets 配置
└── README.md            # changesets 说明
```

## 配置 .changeset/config.json

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

**关键配置**：

| 字段                 | 含义                                    |
| :------------------- | :-------------------------------------- |
| `access: "public"`   | 发布到公共 npm（scoped 包默认 private） |
| `baseBranch: "main"` | 主分支名称                              |
| `commit: false`      | 不自动提交 git，手动控制                |

## 日常使用

### 1. 记录变更（开发时）

```bash
npx changeset
```

交互式选择：

1. 选择变更包（单包项目直接回车）
2. 选择版本类型（major/minor/patch）
3. 写变更描述

生成文件：

```
.changeset/lucky-apples-rhyme.md
---
"@c6i/es-sential": minor
---

新增 zip 和 unzip 函数，支持数组压缩和解压
```

### 2. 消费变更（发版时）

```bash
# 合并所有 changeset，更新版本号，生成 changelog
npx changeset version
```

执行后会：

- 修改 `package.json` 中的版本号
- 生成/更新 `CHANGELOG.md`
- 删除已处理的 `.changeset/*.md`

### 3. 发布到 npm

```bash
# 构建 → 发布
pnpm build
npx changeset publish
```

或配合 npm script：

```json
{
  "scripts": {
    "release": "pnpm build && changeset publish"
  }
}
```

## 完整发布流程

```bash
# 1. 确认变更都已合并到 main
git checkout main
git pull origin main

# 2. 消费 changesets，生成 changelog
npx changeset version

# 3. 查看变更，确认无误
git diff

# 4. 提交版本变更
git add .
git commit -m "chore: version packages"
git push origin main

# 5. 发布到 npm
pnpm release

# 6. 打 tag（changeset publish 会自动打 tag）
git push --follow-tags
```

## npm 发布准备

### 1. 登录 npm

```bash
npm login
# 或
pnpm login
```

### 2. 包名检查

```bash
npm view @c6i/es-sential
# 404 表示名字可用 ✅
```

### 3. 发布注意事项

首次发布 scoped 包需要加 `--access public`：

```bash
npm publish --access public
```

或在 `package.json` 配置：

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

## 学到的点

### 什么时候记录 changeset？

每次有意义的变更都要记录：

| 变更类型            | 版本级别 | 示例                 |
| :------------------ | :------- | :------------------- |
| Bug fix             | patch    | 修复 noop 的类型定义 |
| 新功能              | minor    | 新增 delay 函数      |
| API 移除/不兼容变更 | major    | 改变函数参数顺序     |
| 文档更新            | 不需要   | README 修改          |
| 内部重构            | patch    | 代码优化，无行为变化 |

### changelog 格式

changesets 生成的 CHANGELOG.md：

```markdown
# @c6i/es-sential

## 0.1.0

### Minor Changes

- 新增 delay 函数
- 新增 throttle 函数

### Patch Changes

- 修复 chunk 的空数组处理
```

### 撤销错误的 changeset

```bash
# 直接删除未处理的 changeset 文件
rm .changeset/lucky-apples-rhyme.md
```

## npm scripts 汇总

```json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

## 脚手架完结 🎉

现在你已经拥有了完整的 npm 包开发流程：

| 阶段 | 工具                | 命令                           |
| :--- | :------------------ | :----------------------------- |
| 开发 | TypeScript + Vitest | `pnpm dev` / `pnpm test:watch` |
| 提交 | husky + lint-staged | `git commit`                   |
| 版本 | changesets          | `pnpm changeset`               |
| 发布 | npm                 | `pnpm release`                 |

---

**下一步**：开始用 TDD 开发第一个真正的工具函数 → [../02-tdd-workflow/red-green-refactor.md](../02-tdd-workflow/red-green-refactor.md)
