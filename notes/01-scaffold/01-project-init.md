# 01 - 项目初始化

## 为什么选 pnpm？

### 核心优势

| 特性 | pnpm | npm | yarn |
|:---:|:---:|:---:|:---:|
| 磁盘效率 | ⭐⭐⭐ 硬链接 | 复制 | 复制/硬链接(v3+) |
| 安装速度 | ⭐⭐⭐ 快 | ⭐ 慢 | ⭐⭐ 中等 |
| monorepo | ⭐⭐⭐ 原生支持 | ⭐ 需第三方 | ⭐⭐ 支持 |

**一句话总结**：pnpm 通过**内容寻址存储**（CAS）实现了磁盘空间的极致节省。

### 硬链接 vs 软链接

```
npm install lodash
→ node_modules/lodash/  # 复制一份，占磁盘空间

pnpm install lodash
→ node_modules/lodash → .pnpm/lodash@4.x.x/node_modules/lodash  # 软链接
→ .pnpm/lodash@4.x.x/node_modules/lodash → 全局 store  # 硬链接
```

**全局 store** 只存一份实际的 lodash 代码，所有项目共享。

## 创建项目

### 1. 初始化 package.json

```bash
pnpm init
```

关键配置项：

```json
{
  "name": "@c6i/es-sential",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

| 字段 | 含义 |
|:---|:---|
| `type: "module"` | 默认使用 ESM，文件可用 `.js` 而不是 `.mjs` |
| `exports` | 条件导出，让用户用 `import` 或 `require` 都能正确引入 |

### 2. 锁定包管理器

```json
{
  "packageManager": "pnpm@10.33.0"
}
```

**作用**：
- 团队协作时统一包管理器版本
- Corepack 会自动使用指定版本
- 避免「我这边能跑，你那不行」的问题

## 目录结构设计

```
es-sential/
├── src/              # 源码
│   ├── function/     # 函数模块
│   ├── array/        # 数组模块
│   ├── object/       # 对象模块
│   └── index.ts      # 统一导出
├── dist/             # 构建产物（gitignore）
├── notes/            # 学习笔记（就是你正在看的）
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── eslint.config.mjs
```

## 学到的坑

1. **pnpm 全局 store 位置**：`~/Library/pnpm/store/v3` (macOS)
2. **`.pnpm-store`** 不需要提交，已经默认在 `.gitignore` 了
3. **workspace 协议**：`"foo": "workspace:*"` 用于 monorepo 内部依赖

## 下一步

配置 TypeScript → [02-typescript-setup.md](./02-typescript-setup.md)
