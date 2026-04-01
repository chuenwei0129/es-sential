# 2026 你该怎么写一个 npm 包

> 一份从 0 到 1 的现代前端工具库实战指南
> 基于真实项目 `@c6i/es-sential` 的完整复盘

---

## 前言：为什么写这本小册

2026 年了，写 npm 包的"标准答案"已经变了。

以前的教程教你：`npm init` → 写代码 → `npm publish`。
现在的工程化要求你：TypeScript → 双格式输出 → 自动化测试 → CI/CD → Changeset 版本管理。

**这本小册不教你写函数，只教你把函数变成"合格的 npm 包"。**

---

## 目录

1. [项目初始化：从零开始](#1-项目初始化从零开始)
2. [TypeScript 配置：类型的艺术](#2-typescript-配置类型的艺术)
3. [分包策略：exports 的玩法](#3-分包策略exports-的玩法)
4. [构建工具链：tsup 为什么是神器](#4-构建工具链tsup-为什么是神器)
5. [测试体系：Vitest 实战](#5-测试体系vitest-实战)
6. [代码质量：Biome 配置](#6-代码质量biome-配置)
7. [Git Hooks：husky + lint-staged](#7-git-hooks husky--lint-staged)
8. [版本管理：Changeset 完整实践](#8-版本管理changeset-完整实践)
9. [CI/CD：GitHub Actions 自动发布](#9-cicdgithub-actions-自动发布)
10. [发包验证：publint 与本地测试](#10-发包验证publint-与本地测试)
11. [踩坑记录：真实踩过的坑](#11-踩坑记录真实踩过的坑)

---

## 1. 项目初始化：从零开始

### 1.1 目录结构设计

```
es-sential/
├── src/                    # 源代码
│   ├── array/             # 数组模块
│   │   ├── chunk.ts
│   │   ├── chunk.test.ts
│   │   ├── uniq.ts
│   │   ├── uniq.test.ts
│   │   └── index.ts       # 子包入口
│   ├── object/            # 对象模块
│   ├── string/            # 字符串模块
│   └── index.ts           # 主入口
├── dist/                  # 构建产物（gitignore）
├── .changeset/           # Changeset 配置
├── .github/workflows/    # CI/CD
├── .husky/               # Git hooks
├── biome.json            # 代码规范
├── package.json          # 包配置（核心）
├── tsconfig.json         # TS 配置
├── tsup.config.ts        # 构建配置
└── vitest.config.ts      # 测试配置
```

**关键决策：**
- ✅ 按功能分目录（array/object/string），便于分包导出
- ✅ 每个函数独立文件 + 同名测试文件，TDD 友好
- ✅ `src/index.ts` 作为主入口，统一导出所有功能

### 1.2 package.json 核心配置

```json
{
  "name": "@c6i/es-sential",
  "version": "0.1.0",
  "type": "module",
  "sideEffects": false,
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    },
    "./array": {
      "import": { "types": "./dist/array/index.d.ts", "default": "./dist/array/index.js" },
      "require": { "types": "./dist/array/index.d.cts", "default": "./dist/array/index.cjs" }
    }
  },
  "engines": { "node": ">=18" },
  "packageManager": "pnpm@10.0.0"
}
```

**字段解析：**

| 字段 | 作用 | 2026 年必须项 |
|:---:|:---|:---:|
| `type: "module"` | 默认 ESM | ✅ |
| `sideEffects: false` | 允许 tree-shaking | ✅ |
| `exports` | 分包导出 + 条件导出 | ✅ |
| `files: ["dist"]` | 只发布构建产物 | ✅ |
| `engines` | 指定 Node 版本 | ✅ |
| `packageManager` | 锁定包管理器 | 推荐 |

---

## 2. TypeScript 配置：类型的艺术

### 2.1 现代库的 TS 配置

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,          // 生成 .d.ts
    "declarationMap": true,       // 类型映射（跳转源码）
    "sourceMap": true,            // 源码映射
    "noUnusedLocals": true,       // 严格检查
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2.2 类型设计的颗粒度

**过度工程化的反面教材：**

```typescript
// 过度约束，对调用者不友好
export function pick<
  T extends Record<string, unknown>,
  K extends keyof T
>(
  object: T,
  keys: readonly K[]  // readonly 真的有必要吗？
): Omit<T, K>
```

**务实的写法：**

```typescript
// 足够精确，足够简单
export function pick<T extends object, K extends keyof T>(
  object: T,
  keys: K[]
): Pick<T, K>
```

---

## 3. 分包策略：exports 的玩法

### 3.1 为什么要分包

```typescript
// 全量导入 - 打包工具需要分析整个包
import { chunk } from '@c6i/es-sential'

// 按需导入 - 直接定位到子模块
import { chunk } from '@c6i/es-sential/array'
```

**exports 配置详解：**

```json
{
  "exports": {
    // 主入口
    ".": {
      "import": {
        "types": "./dist/index.d.ts",    // ESM 类型
        "default": "./dist/index.js"      // ESM 代码
      },
      "require": {
        "types": "./dist/index.d.cts",   // CJS 类型（注意 .cts 扩展名）
        "default": "./dist/index.cjs"     // CJS 代码
      }
    },
    // 子包入口
    "./array": { ... },
    "./object": { ... }
  }
}
```

### 3.2 条件导出的优先级

Node.js 解析 `exports` 的规则：

1. 匹配子路径（如 `./array`）
2. 根据导入方式选择 `import` 或 `require`
3. 按字段顺序：`types` → `default`

---

## 4. 构建工具链：tsup 为什么是神器

### 4.1 tsup vs 其他方案

| 工具 | 配置复杂度 | 类型生成 | 双格式输出 | 推荐指数 |
|:---|:---:|:---:|:---:|:---:|
| tsc | 低 | ✅ | ❌ | ⭐⭐ |
| rollup + plugins | 中 | 需插件 | ✅ | ⭐⭐⭐ |
| tsup | 极低 | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| unbuild | 低 | ✅ | ✅ | ⭐⭐⭐⭐ |

### 4.2 tsup 配置实战

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'array/index': 'src/array/index.ts',
    'object/index': 'src/object/index.ts',
    'string/index': 'src/string/index.ts',
  },
  format: ['esm', 'cjs'],     // 一次构建，双格式输出
  dts: {
    compilerOptions: {
      ignoreDeprecations: '6.0',  // TS 6.0 兼容
    },
  },
  splitting: true,            // 代码分割
  sourcemap: true,            // 生成 sourcemap
  clean: true,                // 清理 dist
})
```

### 4.3 构建产物分析

```bash
$ pnpm run build

ESM Build:
  dist/index.js              # 主入口
  dist/array/index.js        # 子包入口
  dist/chunk-*.js            # 共享代码（splitting 生成）
  dist/*.js.map              # sourcemap

CJS Build:
  dist/index.cjs
  dist/array/index.cjs
  ...

DTS Build:
  dist/index.d.ts
  dist/index.d.cts           # CJS 类型声明
  ...
```

---

## 5. 测试体系：Vitest 实战

### 5.1 为什么选择 Vitest

- ✅ 原生 ESM 支持（Jest 需要配置）
- ✅ 内置 TypeScript 支持
- ✅ 与 Vite 生态一致
- ✅ 类型测试支持

### 5.2 配置详解

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,              // 全局 describe/it/expect
    environment: 'node',        // Node.js 环境
    include: ['src/**/*.test.ts'],
    typecheck: {
      enabled: true,            // 启用类型测试
      tsconfig: './tsconfig.json',
    },
  },
})
```

### 5.3 测试文件组织

```typescript
// chunk.test.ts
import { describe, expect, it } from 'vitest'
import { chunk } from './chunk'

describe('chunk', () => {
  // Happy path
  it('should split array into chunks of specified size', () => {
    const result = chunk([1, 2, 3, 4, 5], 2)
    expect(result).toEqual([[1, 2], [3, 4], [5]])
  })

  // 边界情况
  it('should handle empty array', () => {
    expect(chunk([], 3)).toEqual([])
  })

  // 类型测试（Vitest 特有）
  it('should preserve types', () => {
    const result = chunk(['a', 'b'], 1)
    expectTypeOf(result).toEqualTypeOf<string[][]>()
  })
})
```

### 5.4 运行测试

```bash
pnpm test           # 交互式模式
pnpm test:ci        # CI 模式（一次性运行）
pnpm test:types     # 仅类型检查
```

---

## 6. 代码质量：Biome 配置

### 6.1 为什么选 Biome

> ⚡ Rust 编写，ESLint + Prettier 的 20 倍速度

| 功能 | Biome | ESLint + Prettier |
|:---|:---:|:---:|
| Lint | ✅ | ✅ |
| Format | ✅ | ✅ |
| 配置复杂度 | 单文件 | 多文件 + 插件 |
| 速度 | 极快 | 较慢 |

### 6.2 配置详解

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.10/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": false
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "es5"
    }
  }
}
```

### 6.3 配合 lint-staged

```json
// package.json
{
  "lint-staged": {
    "*.{ts,js}": [
      "biome check --write",
      "biome format --write"
    ]
  }
}
```

---

## 7. Git Hooks：husky + lint-staged

### 7.1 安装配置

```bash
# 初始化 husky
npx husky init

# 配置 pre-commit 钩子
# .husky/pre-commit
pnpm exec lint-staged

# 配置 pre-push 钩子
# .husky/pre-push
pnpm run typecheck && pnpm run test:ci
```

### 7.2 完整钩子脚本

```bash
#!/bin/sh
# .husky/pre-commit
. "$(dirname "$0")/_/husky.sh"

pnpm exec lint-staged
```

```bash
#!/bin/sh
# .husky/pre-push
. "$(dirname "$0")/_/husky.sh"

pnpm run typecheck
pnpm run test:ci
```

**效果：**
- `git commit` 前自动格式化 + lint
- `git push` 前必须类型检查 + 测试通过

---

## 8. 版本管理：Changeset 完整实践

### 8.1 初始化

```bash
npx changeset init
```

会生成：
- `.changeset/config.json` - 配置
- `.changeset/` - 存放变更集文件

### 8.2 工作流

```bash
# 1. 开发完成后，添加变更集
npx changeset

# 回答两个问题：
# - 哪些包有变更？
# - 变更类型？（major / minor / patch）
# - 变更描述？

# 这会生成：.changeset/xxxx-xxxx.md
```

### 8.3 变更集文件示例

```markdown
---
"@c6i/es-sential": minor
---

新增 debounce 和 throttle 函数
```

### 8.4 版本升级与发布

```bash
# 查看当前变更集
npx changeset status

# 升级版本（根据变更集类型自动 bump）
npx changeset version

# 这个命令会：
# 1. 修改 package.json 版本号
# 2. 更新 CHANGELOG.md
# 3. 删除已处理的变更集文件

# 发布到 npm
npx changeset publish
```

### 8.5 package.json 脚本配置

```json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm run build && changeset publish"
  }
}
```

---

## 9. CI/CD：GitHub Actions 自动发布

### 9.1 完整 workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

permissions:
  contents: write      # 创建 Release
  pull-requests: write # 创建版本 PR

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: CI Checks
        run: |
          pnpm run lint
          pnpm run typecheck
          pnpm run test:ci
          pnpm run build

      - name: Check Package
        run: pnpm exec publint

      - name: Create Release
        uses: changesets/action@v1
        with:
          publish: pnpm run release
          version: pnpm run version-packages
          commit: 'chore: version packages'
          title: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 9.2 必要的 Secrets 配置

在 GitHub 仓库 → Settings → Secrets and variables → Actions：

| Secret | 说明 | 获取方式 |
|:---|:---|:---|
| `NPM_TOKEN` | npm 发布令牌 | npm 网站 → Access Tokens → Generate |

**Token 类型选择：**
- **Classic Token**: `publish`
- **Granular Token**: 指定组织/包权限

---

## 10. 发包验证：publint 与本地测试

### 10.1 publint：包质量检查

```bash
# 检查当前包是否符合 npm 最佳实践
pnpm exec publint

# 输出示例：
# Running publint v0.3.18 for @c6i/es-sential...
# Packing files with `pnpm pack`...
# Linting...
# All good!
```

**publint 检查的内容：**
- ✅ `exports` 配置是否正确
- ✅ 类型声明文件是否存在
- ✅ ESM/CJS 格式是否完整
- ✅ 文件权限是否正确

### 10.2 本地 link 测试

```bash
# 在包目录
pnpm link --global

# 在测试项目
pnpm link --global @c6i/es-sential

# 测试各种导入方式
import { chunk } from '@c6i/es-sential'
import { chunk } from '@c6i/es-sential/array'

# 结束测试后取消 link
pnpm unlink --global @c6i/es-sential
```

### 10.3 pack 预览

```bash
# 生成 tarball 但不发布
pnpm pack

# 查看包内容
tar -tzf c6i-es-sential-0.1.0.tgz
```

---

## 11. 踩坑记录：真实踩过的坑

### 坑 1：类型声明文件扩展名

**问题：** CJS 格式的类型声明应该用 `.d.ts` 还是 `.d.cts`？

**答案：** Node.js 16+ 开始，CJS 的类型声明应该用 `.d.cts`。

tsup 会自动生成 `index.d.cts`，exports 里要配对配置：

```json
"require": {
  "types": "./dist/index.d.cts",  // ← 是 .cts 不是 .ts
  "default": "./dist/index.cjs"
}
```

### 坑 2：changeset 首次发布

**问题：** 新包第一次用 changeset 发布，提示包不存在。

**解决：** 首次发布必须手动：

```bash
npm publish --access public
```

后续才能用 changeset 自动化。

### 坑 3：@scope 包需要公开

**问题：** `@c6i/es-sential` 这样的 scope 包，默认是 private。

**解决：**

```bash
npm publish --access public
```

或在 package.json 加：

```json
{ "publishConfig": { "access": "public" } }
```

### 坑 4：sourcemap 路径问题

**问题：** 发布后 sourcemap 指向本地路径。

**答案：** tsup 自动生成相对路径，无需额外配置。

### 坑 5：依赖要不要 external

**问题：** 如果代码依赖了其他包，要不要打包进去？

**答案：**
- **工具库**：dependencies 声明 + 不打包（让使用者安装）
- **零依赖库**：确保不 import 任何外部包

检查：

```bash
# 查看包依赖
npm info @c6i/es-sential dependencies
# 期望输出：空（零依赖）
```

---

## 附录：检查清单

### 发布前检查

- [ ] `pnpm run test:ci` 通过
- [ ] `pnpm run typecheck` 通过
- [ ] `pnpm run build` 成功
- [ ] `pnpm exec publint` All good!
- [ ] `pnpm pack` 检查内容
- [ ] `npm info <name>` 确认包名未被占用
- [ ] 已添加 `.changeset/*.md`

### 发布后验证

- [ ] npm 页面可访问
- [ ] `npm install` 能安装
- [ ] `import` 正常工作
- [ ] TypeScript 提示正常
- [ ] sourcemap 能跳转到源码

---

## 结语

写 npm 包不是写代码，是**工程化能力的系统训练**。

2026 年的标准工具链：
- **TypeScript** 类型安全
- **tsup** 高效构建
- **Vitest** 测试体系
- **Biome** 代码质量
- **Changeset** 版本管理
- **GitHub Actions** 自动化

掌握这套组合拳，不仅是会写一个包，是具备了现代前端基础设施的构建能力。

---

**祝你发包顺利，版本号只升不降。** 🚀

---

*本文档基于 `@c6i/es-sential` v0.1.0 项目实践编写*
*作者：初七*
*时间：2026.04*
