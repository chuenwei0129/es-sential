# 第 4 章：构建工具

> 目标：使用 tsup 配置零构建流程，输出 ESM/CJS 双格式，理解 tree-shaking
> 预计时间：60 分钟

---

## 一、本章目标

学完本章，你将：
- ✅ 理解为什么需要构建工具
- ✅ 掌握 tsup 零配置使用方法
- ✅ 配置 ESM/CJS/IIFE 多格式输出
- ✅ 理解 tree-shaking 和代码分割
- ✅ 生成完整的类型声明文件

---

## 二、概念讲解

### 2.1 为什么需要构建工具？

**问题：TypeScript 不能直接运行**

```typescript
// src/index.ts - 你写的代码
type User = { name: string }
const user: User = { name: 'Tom' }
export { user }
```

浏览器和 Node.js 都不认识 `.ts` 文件，需要转换成 `.js`：

```javascript
// dist/index.js - 编译后的代码
const user = { name: 'Tom' }
export { user }
```

**构建工具的工作**：
1. 编译 TypeScript → JavaScript
2. 处理多个模块格式 (ESM/CJS)
3. 生成类型声明文件 (.d.ts)
4. 优化代码体积 (tree-shaking/minify)

### 2.2 tsup 是什么？

**官方定义**：
> tsup 是一个基于 esbuild 的零配置 TypeScript 打包工具，支持多种输出格式、类型声明和代码分割。

**核心优势**：

| 特性 | tsc | Rollup | tsup |
|:---|:---:|:---:|:---:|
| 编译速度 | 慢 | 中等 | **极快** |
| 配置复杂度 | 中等 | 高 | **极低** |
| 多格式输出 | 需手动 | 需插件 | **内置** |
| 类型声明 | 支持 | 需插件 | **内置** |
| 代码分割 | 不支持 | 支持 | **支持** |

**为什么选 tsup**：
- 速度极快（基于 Go 写的 esbuild）
- 一行命令打包多种格式
- 与 package.json exports 完美配合

### 2.3 ESM、CJS、IIFE 的区别

**ESM (ES Modules)** - 现代标准：

```javascript
// 导入
import { add } from './math.js'

// 导出
export function add(a, b) {
  return a + b
}

// 动态导入
const module = await import('./dynamic.js')
```

**CJS (CommonJS)** - Node.js 传统：

```javascript
// 导入
const { add } = require('./math.js')

// 导出
module.exports = { add }

// 动态导入
const module = require('./dynamic.js')
```

**IIFE (Immediately Invoked Function Expression)** - 浏览器直接引入：

```html
<script src="https://cdn.example.com/lib.js"></script>
<script>
  // 库挂载在全局变量上
  console.log(window.myLib.add(1, 2))
</script>
```

**现代 npm 包的最佳实践**：
- 同时提供 ESM 和 CJS 两种格式
- 让用户无论用什么导入方式都能正常工作

### 2.4 什么是 Tree-shaking？

**概念**：构建时自动删除未使用的代码，减小最终包体积。

**示例**：

```typescript
// src/utils.ts
export function used() {
  return 'I am used'
}

export function unused() {
  return 'I am dead code'
}

// src/index.ts
import { used } from './utils'
export { used }  // 只导出 used
```

打包结果（启用 tree-shaking）：

```javascript
// dist/index.js - 只有 used 函数
function used() {
  return 'I am used'
}
export { used }
```

`unused` 函数被自动删除了！

### 2.5 sourcemap 是什么？

**问题**：打包后的代码和源码不同，调试时怎么对应？

```typescript
// 源码 (src/math.ts)
export function add(a: number, b: number): number {
  return a + b  // TypeScript
}
```

```javascript
// 打包后 (dist/math.js)
function add(n,t){return n+t}  // 压缩后的代码
```

**sourcemap 的作用**：记录源码和产物的映射关系，让调试器能「还原」出原始代码。

```javascript
// dist/math.js.map
{
  "version": 3,
  "sources": ["src/math.ts"],
  "names": ["add", "a", "b"],
  "mappings": "AAAA,OAAM,SAASA..."
}
```

---

## 三、动手实践

### 步骤 1：安装 tsup

```bash
# 作为开发依赖安装
pnpm add -D tsup

# 验证安装
npx tsup --version
# 输出类似：8.4.0
```

### 步骤 2：基础打包命令

先准备测试代码：

```bash
mkdir -p src/array src/object src/string
```

```typescript
// src/array/index.ts
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (!Number.isFinite(size) || size <= 0 || !Number.isInteger(size)) {
    throw new Error('chunk size must be a positive integer')
  }
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export function uniq<T>(array: readonly T[]): T[] {
  return Array.from(new Set(array))
}
```

```typescript
// src/index.ts
// 统一导出
export * from './array/index.js'
```

运行基础打包：

```bash
# 单行命令打包 ESM + CJS
npx tsup src/index.ts --format esm,cjs --dts
```

**输出**：

```
dist/
├── index.js      # ESM 格式
├── index.cjs     # CJS 格式
├── index.d.ts    # ESM 类型声明
└── index.d.cts   # CJS 类型声明
```

### 步骤 3：创建 tsup.config.ts

虽然命令行可以工作，但配置文件更易于维护和分享：

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  // 入口文件 - 对象形式控制输出文件名
  entry: {
    index: 'src/index.ts',
    'array/index': 'src/array/index.ts',
  },

  // 输出格式
  format: ['esm', 'cjs'],

  // 类型声明
  dts: true,

  // 代码分割 - 共享代码抽离
  splitting: true,

  // 生成 sourcemap
  sourcemap: true,

  // 每次构建前清空 dist
  clean: true,

  // 不需要 minify（npm 包一般不压缩，让用户自己压缩）
  minify: false,
})
```

**为什么选择对象形式的 entry？**

```typescript
// 数组形式 - 输出文件名和源码相同
entry: ['src/index.ts', 'src/array/index.ts']
// 输出：dist/index.js, dist/index.js (冲突！)

// 对象形式 - 明确指定输出路径
entry: {
  index: 'src/index.ts',           // 输出 dist/index.js
  'array/index': 'src/array/index.ts',  // 输出 dist/array/index.js
}
```

### 步骤 4：理解 splitting（代码分割）

修改配置，对比 splitting 开关的差异：

```typescript
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'array/index': 'src/array/index.ts',
  },
  format: ['esm', 'cjs'],
  splitting: true,  // 开启代码分割
  dts: true,
})
```

当两个入口都依赖 `chunk` 函数时：

```typescript
// src/index.ts 和 src/array/index.ts 都导出了 chunk
// 它们共享 chunk 的实现代码
```

**开启 splitting 后的输出**：

```
dist/
├── index.js              # 主入口
├── array/
│   └── index.js          # 子包入口
├── chunk-XXXXX.js        # 共享代码抽离到这里
├── index.d.ts
└── array/
    └── index.d.ts
```

**好处**：用户如果只导入 `array/index`，不会下载主包的代码，按需加载更高效。

### 步骤 5：配置 package.json 的 exports

构建产物生成后，需要在 package.json 中正确配置 exports 字段：

```json
{
  "name": "@yourname/my-package",
  "type": "module",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./array": {
      "import": {
        "types": "./dist/array/index.d.ts",
        "default": "./dist/array/index.js"
      },
      "require": {
        "types": "./dist/array/index.d.cts",
        "default": "./dist/array/index.cjs"
      }
    }
  },
  "files": ["dist"]
}
```

**为什么这么配置？**

- `.` 表示主入口 `import pkg from 'your-package'`
- `./array` 表示子路径 `import { chunk } from 'your-package/array'`
- `import` 给 ESM 用户使用
- `require` 给 CJS 用户使用
- `types` 始终放在第一位（Node.js 约定）

### 步骤 6：添加构建脚本

```json
{
  "scripts": {
    "build": "tsup",
    "typecheck": "tsc --noEmit"
  }
}
```

测试构建：

```bash
# 运行构建
pnpm build

# 查看输出
ls -la dist/
```

### 步骤 7：验证双格式输出

创建测试文件验证 ESM 和 CJS 都能正常工作：

```javascript
// test-esm.mjs
import { chunk } from './dist/index.js'
console.log('ESM:', chunk([1, 2, 3, 4], 2))
```

```javascript
// test-cjs.cjs
const { chunk } = require('./dist/index.cjs')
console.log('CJS:', chunk([1, 2, 3, 4], 2))
```

运行测试：

```bash
node test-esm.mjs
# 输出：ESM: [ [ 1, 2 ], [ 3, 4 ] ]

node test-cjs.cjs
# 输出：CJS: [ [ 1, 2 ], [ 3, 4 ] ]
```

---

## 四、原理解析

### 4.1 tsup 为什么这么快？

**传统工具链**：
```
TypeScript 源码
    ↓ tsc 编译（JavaScript，慢）
编译后的 JavaScript
    ↓ Rollup 打包（JavaScript，中等）
最终产物
```

**tsup 的工作原理**：
```
TypeScript 源码
    ↓ esbuild 编译+打包（Go，极快）
最终产物
```

esbuild 用 Go 编写，编译成原生机器码，比 JavaScript 工具快 10-100 倍。

### 4.2 ESM 和 CJS 类型文件为什么要分开？

TypeScript 4.7+ 要求：
- `.d.ts` → 给 ESM 使用的类型声明
- `.d.cts` → 给 CJS 使用的类型声明

**如果不分开会发生什么？**

```bash
# 用户的 CJS 项目
const pkg = require('your-package')
# TypeScript 报错：
# types is interpreted as ESM when resolving with "require" condition
```

这是因为 TypeScript 需要知道类型文件对应的模块系统，避免混用导致的问题。

### 4.3 Tree-shaking 怎么工作？

esbuild 使用「基于副作用分析」的 tree-shaking：

```typescript
// utils.ts
export const a = 1           // ✅ 被使用，保留
export const b = 2           // ❌ 未使用，删除
export function init() {     // ⚠️ 可能有副作用，保留
  console.log('init')
}
```

**让 tree-shaking 更有效的技巧**：

```typescript
// ❌ 不利于 tree-shaking - 所有方法都在类里
class Utils {
  method1() {}
  method2() {}
  method3() {}
}
export const utils = new Utils()

// ✅ 利于 tree-shaking - 单独导出
export function method1() {}
export function method2() {}
export function method3() {}
```

---

## 五、常见问题

### Q1：构建报错 "Cannot find module 'xxx'"

检查 `include` 配置：

```json
// tsconfig.json
{
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Q2：类型声明文件没有生成

确保 `dts: true` 并且 TypeScript 配置正确：

```typescript
// tsup.config.ts
export default defineConfig({
  dts: true,  // 启用类型声明
  // ...
})
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true  // 配合 tsc 生成 .d.ts
  }
}
```

### Q3：exports 配置复杂，有没有简化的方法？

可以使用社区工具自动生成，但建议手动配置以理解原理。完整配置模板：

```json
{
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    },
    "./package.json": "./package.json"
  }
}
```

### Q4：要不要启用 minify？

**npm 包不推荐 minify**，原因：
1. 用户最终打包时会自己 minify
2. 源码可读性便于调试
3. 可分析 bundle 大小

**什么时候需要 minify**：
- CDN 直接引用的库（IIFE 格式）
- 需要极致减小包体积的特殊场景

```typescript
// tsup.config.ts
export default defineConfig({
  minify: process.env.NODE_ENV === 'production',
})
```

---

## 六、验证检查

请确认你已完成：

- [ ] 安装了 tsup (`pnpm add -D tsup`)
- [ ] 创建了 `tsup.config.ts` 配置文件
- [ ] 配置了 ESM + CJS 双格式输出
- [ ] 配置了 `dts: true` 生成类型声明
- [ ] 配置了 `splitting: true` 代码分割
- [ ] 更新了 package.json 的 `exports` 字段
- [ ] `pnpm build` 能成功运行
- [ ] ESM 和 CJS 测试文件都能正常运行

**验证命令**：

```bash
# 运行构建
pnpm build

# 验证输出文件存在
ls dist/index.js dist/index.cjs dist/index.d.ts

# 验证 ESM 导入
node -e "import('./dist/index.js').then(m => console.log('ESM OK:', typeof m.chunk))"

# 验证 CJS 导入
node -e "console.log('CJS OK:', typeof require('./dist/index.cjs').chunk)"
```

---

## 七、下一步

[第 5 章：测试框架](./chapter-05-test.md)

我们将：
- 配置 Vitest 测试框架
- 学习 TDD（测试驱动开发）方法
- 编写第一个单元测试

---

## 参考资源

- [tsup 官方文档](https://tsup.egoist.dev/)
- [esbuild 文档](https://esbuild.github.io/)
- [Node.js ESM 指南](https://nodejs.org/api/esm.html)
- [Package Exports 规范](https://nodejs.org/api/packages.html#package-entry-points)

