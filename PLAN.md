# es-sential 工具库开发计划

## 项目背景
创建一个类似 es-toolkit 的现代 JavaScript/TypeScript 工具函数库，作为练习完整 npm 包开发流程的项目。采用 2025-2026 年最佳实践，构建一个最小可用但功能完整的基础版本。

## 目标
- 提供现代 JavaScript/TypeScript 工具函数
- 支持 ESM 和 CJS 双格式输出
- 完整的类型定义支持
- 自动化测试和发布流程
- 最小可用版本：5-10 个核心工具函数

## 技术栈选型 (2026 最佳实践)

### 核心工具
| 用途 | 工具 | 理由 |
|------|------|------|
| 构建 | `tsup` | 零配置，内置 ESM/CJS/IIFE 输出，类型定义生成 |
| 测试 | `vitest` | 原生 ESM 支持，TypeScript 开箱即用，极速 |
| 类型检查 | `TypeScript 5.x` | 现代类型系统 |
| 代码规范 | `Biome` | 取代 ESLint+Prettier，一体式工具，性能更好 |
| 版本管理 | `changesets` | 专业版本管理和 Changelog 生成 |
| 包管理 | `pnpm` | 已全局使用，速度更快，节省磁盘 |
| Git Hooks | `husky` + `lint-staged` | 提交前自动检查，确保代码质量 |

### husky + lint-staged 配置
```json
// package.json
{
  "lint-staged": {
    "*.{ts,js}": ["biome check --write", "biome format --write"],
    "*.{json,md}": ["biome format --write"]
  },
  "scripts": {
    "prepare": "husky" // 安装时自动初始化 hooks
  }
}
```

```bash
# .husky/pre-commit
pnpm exec lint-staged

# .husky/pre-push
pnpm run typecheck && pnpm run test:ci
```

**执行流程**：
- `pre-commit`: lint-staged 只检查**暂存区**文件，快速格式化 + 代码规范检查
- `pre-push`: 完整类型检查 + 单元测试，确保推送安全

**初始化**（安装依赖后执行一次）：
```bash
pnpm exec husky init
```

## 项目结构

```
es-sential/
├── src/                      # 源代码
│   ├── index.ts              # 主入口，统一导出
│   ├── index.test.ts         # 主入口测试
│   ├── array/                # 数组工具
│   │   ├── index.ts          # 统一导出
│   │   ├── chunk.ts          # 分割数组
│   │   ├── chunk.test.ts     # chunk 单元测试
│   │   ├── uniq.ts           # 去重
│   │   └── uniq.test.ts      # uniq 单元测试
│   ├── object/               # 对象工具
│   │   ├── index.ts          # 统一导出
│   │   ├── pick.ts           # 选取属性
│   │   ├── pick.test.ts      # pick 单元测试
│   │   ├── omit.ts           # 排除属性
│   │   └── omit.test.ts      # omit 单元测试
│   └── string/               # 字符串工具
│       ├── index.ts          # 统一导出
│       ├── camelCase.ts      # 转驼峰
│       ├── camelCase.test.ts # camelCase 单元测试
│       ├── kebabCase.ts      # 转短横线
│       └── kebabCase.test.ts # kebabCase 单元测试
├── dist/                     # 构建输出 (gitignore)
├── .github/
│   └── workflows/
│       └── release.yml       # CI/CD 自动发布
├── package.json
├── tsconfig.json             # TypeScript 配置
├── tsup.config.ts            # 构建配置
├── biome.json                # 代码规范配置
├── vitest.config.ts          # 测试配置
├── .changeset/config.json    # changesets 配置
├── README.md                 # 项目文档
└── CHANGELOG.md              # 版本日志
```

## package.json 配置要点

```json
{
  "name": "@c6i/es-sential",
  "version": "0.0.1",
  "description": "现代 JavaScript/TypeScript 工具函数库",
  "type": "module",
  "sideEffects": false,
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "LICENSE", "README.md"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "default": "./dist/index.js"
    },
    "./array": {
      "types": "./dist/array/index.d.ts",
      "import": "./dist/array/index.js",
      "require": "./dist/array/index.cjs",
      "default": "./dist/array/index.js"
    },
    "./object": {
      "types": "./dist/object/index.d.ts",
      "import": "./dist/object/index.js",
      "require": "./dist/object/index.cjs",
      "default": "./dist/object/index.js"
    },
    "./string": {
      "types": "./dist/string/index.d.ts",
      "import": "./dist/string/index.js",
      "require": "./dist/string/index.cjs",
      "default": "./dist/string/index.js"
    },
    "./package.json": "./package.json"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest",
    "test:ci": "vitest run",
    "test:types": "vitest typecheck",
    "typecheck": "tsc --noEmit",
    "lint": "biome check .",
    "lint:fix": "biome check . --write",
    "format": "biome format . --write",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm run build && changeset publish",
    "prepublishOnly": "pnpm build && attw --pack . && publint",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,js}": ["biome check --write", "biome format --write"],
    "*.{json,md}": ["biome format --write"]
  },
  "devDependencies": {
    "@arethetypeswrong/cli": "^0.x",
    "@biomejs/biome": "^1.x",
    "@changesets/cli": "^2.x",
    "expect-type": "^1.x",
    "husky": "^9.x",
    "lint-staged": "^15.x",
    "publint": "^0.x",
    "tsup": "^8.x",
    "typescript": "^5.x",
    "vitest": "^3.x"
  },
  "engines": {
    "node": ">=18"
  },
  "packageManager": "pnpm@10.x"
}
```

## 核心实现函数 (MVP 版本)

### 数组工具
- `chunk(array, size)` - 将数组分割成指定大小的块
- `uniq(array)` - 数组去重

### 对象工具
- `pick(object, keys)` - 从对象中选取指定属性
- `omit(object, keys)` - 从对象中排除指定属性

### 字符串工具
- `camelCase(string)` - 转换为驼峰命名
- `kebabCase(string)` - 转换为短横线命名

## 构建配置详解

### tsup.config.ts
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'array/index': 'src/array/index.ts',
    'object/index': 'src/object/index.ts',
    'string/index': 'src/string/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
})
```

**关键配置说明**：
- `entry` 使用**对象形式**，确保输出路径匹配 exports 配置（如 `dist/array/index.js`）
- `splitting` 启用代码分割，支持按需加载
- `clean` 构建前清理 dist 目录

### tsconfig.json (单一配置)
- 严格模式: 启用
- ES2022 目标
- 模块解析: bundler
- 包含 src/ 和测试文件类型检查

## 测试策略

- 单元测试覆盖率 > 80%
- 类型测试 (使用 expect-type 或直接 TS 断言)
- CI 中自动运行测试

## CI/CD 发布流程

1. 开发者本地开发
2. 提交代码，PR 合并到 main
3. GitHub Actions 触发
4. 运行测试和类型检查
5. 创建 Changeset 版本 PR
6. 合并版本 PR 后自动发布到 npm

## 文件清单 (需创建/修改)

| 文件路径 | 类型 | 说明 |
|---------|------|------|
| `src/index.ts` | 新建 | 主入口统一导出 |
| `src/index.test.ts` | 新建 | 主入口测试 |
| `src/array/index.ts` | 新建 | 数组工具统一导出 |
| `src/array/chunk.ts` | 新建 | chunk 函数实现 |
| `src/array/chunk.test.ts` | 新建 | chunk 单元测试 |
| `src/array/uniq.ts` | 新建 | uniq 函数实现 |
| `src/array/uniq.test.ts` | 新建 | uniq 单元测试 |
| `src/object/index.ts` | 新建 | 对象工具统一导出 |
| `src/object/pick.ts` | 新建 | pick 函数实现 |
| `src/object/pick.test.ts` | 新建 | pick 单元测试 |
| `src/object/omit.ts` | 新建 | omit 函数实现 |
| `src/object/omit.test.ts` | 新建 | omit 单元测试 |
| `src/string/index.ts` | 新建 | 字符串工具统一导出 |
| `src/string/camelCase.ts` | 新建 | camelCase 函数实现 |
| `src/string/camelCase.test.ts` | 新建 | camelCase 单元测试 |
| `src/string/kebabCase.ts` | 新建 | kebabCase 函数实现 |
| `src/string/kebabCase.test.ts` | 新建 | kebabCase 单元测试 |
| `tsconfig.json` | 新建 | TypeScript 配置 |
| `tsup.config.ts` | 新建 | 构建工具配置 |
| `vitest.config.ts` | 新建 | 测试配置 |
| `biome.json` | 新建 | 代码规范配置 |
| `.changeset/config.json` | 新建 | 版本管理配置 |
| `.github/workflows/release.yml` | 新建 | CI/CD 配置 |
| `.husky/pre-commit` | 新建 | Git pre-commit hook |
| `.husky/pre-push` | 新建 | Git pre-push hook |
| `package.json` | 修改 | 更新脚本、lint-staged 和依赖 |
| `README.md` | 新建 | 项目文档 |

## 验证方式

1. 构建成功: `pnpm run build` 生成 `dist/` 目录
2. 类型无误: `pnpm run typecheck` 无错误
3. 测试通过: `pnpm run test:ci` 全部通过
4. 代码规范: `pnpm run lint` 无错误

## 下一步行动

执行本计划，依次完成:
1. 安装开发依赖
2. 配置所有工具
3. 编写核心函数
4. 编写测试
5. 配置 CI/CD
6. 验证发布流程
