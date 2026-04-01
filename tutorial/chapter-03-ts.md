# 第 3 章：TypeScript 配置

> 目标：深入理解 tsconfig.json，配置严格类型检查，为 npm 包生成类型声明
> 预计时间：60 分钟

---

## 一、本章目标

学完本章，你将：
- ✅ 理解 tsconfig.json 的核心配置项
- ✅ 掌握严格模式的每个选项及其意义
- ✅ 配置类型声明文件的自动生成
- ✅ 学会使用 TypeScript 进行类型检查

---

## 二、概念讲解

### 2.1 什么是 tsconfig.json？

**官方定义**：
> `tsconfig.json` 是 TypeScript 项目的配置文件，它指定了编译器如何将 TypeScript 代码转换为 JavaScript。

**类比理解**：
- 如果把 TypeScript 编译器想象成一位翻译官
- `tsconfig.json` 就是交给翻译官的"翻译要求清单"
- 告诉它：翻译成什么版本？要不要保留注释？输出到哪里？

### 2.2 严格模式（strict mode）详解

**为什么要用严格模式？**

```typescript
// 不严格模式下，这些都不会报错
function add(a, b) {
  return a + b  // a 和 b 隐含为 any 类型
}

add('1', 2)     // 运行时错误：'12'，但不会提前发现
add(null, 2)    // 运行时错误：NaN，但不会提前发现
```

```typescript
// 严格模式下，编译阶段就能发现问题
function add(a: number, b: number): number {
  return a + b
}

add('1', 2)     // ❌ 编译错误：类型 'string' 不能赋值给 'number'
add(null, 2)    // ❌ 编译错误：null 不能赋值给 number
```

**官方推荐的严格配置**：

```json
{
  "compilerOptions": {
    "strict": true  // 一键开启所有严格选项
  }
}
```

**严格模式的子选项**（开启 `strict: true` 会自动启用）：

| 选项 | 作用 | 推荐值 |
|:---|:---|:---:|
| `strictNullChecks` | 检查 null/undefined 赋值 | `true` |
| `noImplicitAny` | 禁止隐式 any 类型 | `true` |
| `strictFunctionTypes` | 函数参数严格逆变 | `true` |
| `strictBindCallApply` | 严格检查 bind/call/apply | `true` |
| `strictPropertyInitialization` | 严格属性初始化检查 | `true` |
| `noImplicitThis` | 禁止隐式 this 类型 | `true` |
| `alwaysStrict` | 在严格模式下解析 JS | `true` |

### 2.3 模块系统配置

TypeScript 支持多种模块系统，现代 npm 包通常需要 ESM 输出：

```json
{
  "compilerOptions": {
    "target": "ES2022",      // 编译目标：ES2022
    "module": "ESNext"       // 模块系统：ES Modules
  }
}
```

**target 选项对比**：

| 选项 | JavaScript 版本 | 特性支持 | 兼容性 |
|:---|:---|:---|:---|
| `ES2015` | ES6 | 类、箭头函数、模块 | IE11+ |
| `ES2020` | ES11 | BigInt、可选链、空值合并 | 现代浏览器 |
| `ES2022` | ES13 | 类私有字段、顶层 await | Node 16+ |
| `ESNext` | 最新草案 | 实验性特性 | 最新环境 |

**npm 包推荐 `ES2022`**：足够现代，Node 16+ 原生支持。

### 2.4 类型声明文件（.d.ts）

**什么是类型声明文件？**

JavaScript 代码没有类型信息，TypeScript 用户使用时需要"类型说明书"，这就是 `.d.ts` 文件：

```typescript
// src/index.ts - 源码
export function add(a: number, b: number): number {
  return a + b
}

// dist/index.d.ts - 类型声明文件（自动生成）
export declare function add(a: number, b: number): number
```

**声明文件的作用**：
1. 让 TypeScript 用户获得类型提示和检查
2. 不暴露源码实现细节
3. 提高 IDE 的智能提示体验

**生成配置**：

```json
{
  "compilerOptions": {
    "declaration": true,      // 生成 .d.ts 文件
    "declarationMap": true    // 生成 source map 方便调试
  }
}
```

### 2.5 新的模块语法：verbatimModuleSyntax

TypeScript 5.0+ 引入了 `verbatimModuleSyntax` 选项，统一了之前的几个过时选项：

```json
{
  "compilerOptions": {
    "isolatedModules": true,         // 确保每个文件都能独立编译
    "verbatimModuleSyntax": true     // 保留导入/导出的模块语法
  }
}
```

**为什么要用**：
- 在生成声明文件时保留正确的 `import`/`export` 语法
- 避免 CommonJS 和 ESM 之间的混淆
- 这是构建现代 npm 包的最佳实践

---

## 三、动手实践

### 步骤 1：安装 TypeScript

```bash
# 作为开发依赖安装
pnpm add -D typescript

# 验证安装
npx tsc --version
# 输出：Version 5.x.x
```

### 步骤 2：创建基础 tsconfig.json

在项目根目录创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    // 编译目标
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],

    // 模块解析
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,

    // 严格模式基础
    "strict": true,

    // 额外严格检查（推荐开启）
    "noUnusedLocals": true,           // 禁止未使用的变量
    "noUnusedParameters": true,       // 禁止未使用的参数
    "noImplicitReturns": true,        // 要求所有分支都有返回值
    "noFallthroughCasesInSwitch": true, // switch case 必须有 break

    // 类型声明
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,                // 生成 sourcemap 便于调试

    // 模块语法
    "isolatedModules": true,
    "verbatimModuleSyntax": true,

    // 路径解析
    "baseUrl": ".",

    // 其他
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 步骤 3：理解每个配置项

让我们逐个解释关键的配置项：

**编译目标相关**：

```json
{
  "target": "ES2022",      // 编译成 ES2022 语法
  "module": "ESNext",      // 使用 ES 模块
  "lib": ["ES2022"]        // 包含 ES2022 的类型定义
}
```

**模块解析相关**：

```json
{
  "moduleResolution": "bundler"  // 与 Vite、Webpack 等工具兼容的解析策略
}
```

**严格类型相关**：

```json
{
  "strict": true  // 同时开启以下所有选项：
  // strictNullChecks       - 检查 null/undefined
  // noImplicitAny          - 禁止隐式 any
  // strictFunctionTypes    - 严格函数参数类型
  // strictBindCallApply    - 严格 bind/call/apply
  // strictPropertyInitialization - 严格属性初始化
  // noImplicitThis         - 禁止隐式 this
  // alwaysStrict           - 严格模式
}
```

**类型声明相关**：

```json
{
  "declaration": true,       // 生成 .d.ts 类型声明文件
  "declarationMap": true     // 为类型文件生成 sourcemap
}
```

### 步骤 4：第一个类型检查

在 `src/index.ts` 中添加代码：

```typescript
/**
 * 数组分块函数
 * @param array 要分块的数组
 * @param size 每块的大小
 * @returns 分块后的二维数组
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  // 边界检查：size 必须是正整数
  if (!Number.isFinite(size) || size <= 0 || !Number.isInteger(size)) {
    throw new Error('chunk size must be a positive integer')
  }

  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
```

运行类型检查：

```bash
# 只检查类型，不输出文件
npx tsc --noEmit
```

**如果没有报错，说明类型正确！**

### 步骤 5：配置类型检查脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

测试：

```bash
pnpm typecheck
```

### 步骤 6：体验严格模式的力量

修改代码，故意写一个类型错误：

```typescript
export function chunk<T>(array: readonly T[], size: number): T[][] {
  // 错误：忘记处理 size = 0 的情况
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {  // size 可能为 0！
    result.push(array.slice(i, i + size))
  }
  return result
}
```

严格模式不会直接报错，因为 `size` 是 `number` 类型。但我们可以通过更好的类型来约束：

```typescript
// 使用 positive int 类型约束
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (!Number.isFinite(size) || size <= 0 || !Number.isInteger(size)) {
    throw new Error('chunk size must be a positive integer')
  }
  // 现在 size 被收窄为正整数
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
```

---

## 四、原理解析

### 4.1 严格模式如何帮你避免 Bug

**案例 1：null 检查**

```typescript
// strictNullChecks: false
function greet(name: string) {
  return `Hello, ${name.toUpperCase()}`
}

greet(null)  // 编译通过，但运行时报错！
```

```typescript
// strictNullChecks: true
function greet(name: string) {
  return `Hello, ${name.toUpperCase()}`
}

greet(null)  // ❌ 编译错误：不能将 null 赋值给 string

// 正确写法：明确处理 null
function greet(name: string | null) {
  if (name === null) {
    return 'Hello, stranger'
  }
  return `Hello, ${name.toUpperCase()}`
}
```

**案例 2：隐式 any**

```typescript
// noImplicitAny: false
function process(data) {  // data 隐式为 any
  return data.map(x => x * 2)  // 没有类型检查
}
```

```typescript
// noImplicitAny: true
function process(data) {  // ❌ 错误：data 隐含 any 类型
  return data.map(x => x * 2)
}

// 正确写法：显式声明类型
function process(data: number[]) {
  return data.map(x => x * 2)
}
```

### 4.2 为什么用 `moduleResolution: bundler`？

现代打包工具（Vite、Webpack、Rollup、esbuild）使用了略微不同的模块解析策略。`bundler` 模式与这些工具保持一致。

**举例**：

```typescript
// 在 bundler 模式下，可以这样导入
import { foo } from './module'  // 自动识别 ./module.ts

// 而在 node 模式下，需要写完整扩展名
import { foo } from './module.js'  // 或者 .ts
```

这对于 npm 包很重要，因为用户可能用各种工具消费你的包。

### 4.3 为什么用 `verbatimModuleSyntax`？

TypeScript 历史上处理 `import type` 有一些混乱的行为。`verbatimModuleSyntax` 让 TypeScript 明确区分：

```typescript
// 类型导入 - 编译后完全移除
import type { Config } from './types'

// 值导入 - 编译后保留
import { createConfig } from './config'

// 混合导入 - 拆分成两个语句
import { createConfig } from './config'
import type { Config } from './config'
```

这在生成声明文件时尤为重要，确保类型声明正确反映实际导入行为。

---

## 五、常见问题

### Q1：strict 模式报错太多，能不能不开？

**可以但强烈不推荐。** 如果你接手了一个没有 strict 的老项目，可以逐步开启：

```json
{
  "compilerOptions": {
    "strict": false,              // 先关闭
    "strictNullChecks": true,     // 先开 null 检查
    "noImplicitAny": true         // 再开 any 检查
  }
}
```

但对于**新项目**，请务必开启完整 strict 模式。

### Q2：`declaration: true` 和 `emitDeclarationOnly` 有什么区别？

```json
// 配置 A：同时输出 JS 和声明
{
  "declaration": true
}
// 输出：file.js + file.d.ts

// 配置 B：只输出声明
{
  "emitDeclarationOnly": true
}
// 输出：file.d.ts
```

在我们这个项目中，用 tsup 打包 JS，用 tsc 检查类型，所以 `declaration` 对 tsc 来说是辅助性的。

### Q3：提示 "Cannot find module 'xxx' or its corresponding type declarations"

这意味着 TypeScript 找不到某个模块的类型定义：

```bash
# 安装缺少的类型
pnpm add -D @types/xxx

# 或者对于没有类型的包，声明一个占位
```

在 `src/types.d.ts` 中添加：

```typescript
declare module 'xxx' {
  const content: any
  export default content
}
```

### Q4：`skipLibCheck` 有什么用？

```json
{
  "skipLibCheck": true  // 跳过 node_modules 里的类型检查
}
```

推荐开启，因为：
- 第三方包的类型问题不是你的问题
- 加快编译速度
- 避免版本不兼容导致的类型错误

---

## 六、验证检查

请确认你已完成：

- [ ] 安装了 TypeScript (`pnpm add -D typescript`)
- [ ] 创建了 `tsconfig.json` 并包含所有关键配置
- [ ] 配置了 `strict: true` 严格模式
- [ ] 配置了 `declaration: true` 类型声明
- [ ] `pnpm typecheck` 命令可以正常运行且无错误
- [ ] 编写了带类型的 chunk 函数

**验证命令**：

```bash
# 检查 TypeScript 版本
npx tsc --version

# 运行类型检查
pnpm typecheck

# 检查配置是否正确解析
npx tsc --showConfig
```

---

## 七、下一步

[第 4 章：构建工具](./chapter-04-build.md)

我们将：
- 使用 tsup 进行零配置构建
- 理解 ESM/CJS 双格式输出的配置
- 配置 tree-shaking 优化打包体积

---

## 参考资源

- [TypeScript tsconfig 官方文档](https://www.typescriptlang.org/tsconfig)
- [strict mode 详解](https://www.typescriptlang.org/tsconfig#strict)
- [模块解析策略](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [类型声明文件指南](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

