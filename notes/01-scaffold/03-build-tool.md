# 03 - 构建工具 tsup

## 为什么选 tsup？

| 工具    | 优点                     | 缺点                 |
| :------ | :----------------------- | :------------------- |
| tsc     | 官方出品，类型检查       | 不能打包，不处理依赖 |
| tsup    | 零配置、快、内置 ESM+CJS | 功能相对单一         |
| Rollup  | 灵活、插件丰富           | 配置复杂             |
| esbuild | 极快                     | 类型声明需额外处理   |

**tsup 定位**：简单场景下的最佳工具，一行配置搞定。

## tsup.config.ts 配置

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // 入口文件
  format: ['esm', 'cjs'], // 输出 ESM + CJS 双格式
  dts: true, // 生成类型声明
  sourcemap: true, // 生成 source map
  clean: true, // 清理 dist 目录
  splitting: true, // 代码分割
  minify: true, // 压缩代码
})
```

## 配置详解

### format: ['esm', 'cjs']

```
构建后：
dist/
├── index.js       # ESM 格式 (import/export)
├── index.cjs      # CJS 格式 (require/module.exports)
└── index.d.ts     # 类型声明
```

**为什么需要双格式？**

- **ESM** — 现代项目首选，支持 tree-shaking
- **CJS** — CommonJS 兼容旧项目，Node.js 默认

用户安装后可以这样用：

```js
// ESM 项目
import { noop } from '@c6i/es-sential'

// CJS 项目
const { noop } = require('@c6i/es-sential')
```

### dts: true

自动生成 `.d.ts` 类型声明文件，TypeScript 用户能获得类型提示。

### splitting: true

自动代码分割，如果 entry 有多个，共享的代码会抽离到 chunk。

## package.json 联动

```json
{
  "type": "module",
  "main": "./dist/index.cjs", // CJS 入口
  "module": "./dist/index.js", // ESM 入口
  "types": "./dist/index.d.ts", // 类型入口
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

`exports` 字段是现代标准，优先于 `main`/`module`。

## npm scripts

```json
{
  "scripts": {
    "dev": "tsup --watch", // 开发模式，监听变化
    "build": "tsup", // 生产构建
    "clean": "rm -rf dist" // 清理产物
  }
}
```

## 学到的点

### ESM vs CJS 的区别

| 特性         | ESM             | CJS                      |
| :----------- | :-------------- | :----------------------- |
| 语法         | `import/export` | `require/module.exports` |
| 静态分析     | ✅ 编译时确定   | ❌ 运行时动态            |
| tree-shaking | ✅ 支持         | ❌ 不支持                |
| 顶层 await   | ✅ 支持         | ❌ 不支持                |

### Tree Shaking 是什么？

```js
// 库的源代码
export const add = (a, b) => a + b
export const subtract = (a, b) => a - b
export const multiply = (a, b) => a * b

// 用户只用 add
import { add } from 'library'
console.log(add(1, 2))

// Tree-shaking 后，subtract 和 multiply 不会被打包进去
```

ESM 的静态结构让构建工具能分析哪些导出被使用，移除未使用的代码。

## 下一步

配置测试框架 Vitest → [04-testing-framework.md](./04-testing-framework.md)
