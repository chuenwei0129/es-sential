<h1 align="center">es-sential</h1>

<p align="center">
<strong>现代 JavaScript/TypeScript 工具库</strong><br/>
零依赖 · 类型安全 · 按需加载
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@c6i/es-sential"><img src="https://img.shields.io/npm/v/@c6i/es-sential" alt="npm version"/></a>
<img src="https://img.shields.io/badge/dependencies-zero-brightgreen" alt="Zero dependencies"/>
<img src="https://img.shields.io/npm/dm/@c6i/es-sential" alt="Downloads"/>
<img src="https://img.shields.io/badge/license-MIT-blue" alt="License"/>
</p>

<p align="center">
<a href="#快速开始">快速开始</a> •
<a href="#api-文档">API 文档</a> •
<a href="#开发路线图">开发路线图</a> •
<a href="#贡献">贡献</a>
</p>

---

## 简介

**es-sential**（essential：必要的）—— 名字的创意既表达了"这是必需的"，又巧妙嵌入了"ES"（代表 ECMAScript），一语双关。

es-sential 是一个高质量的实用函数库，包含现代 JavaScript 项目中常用的函数。

我们专注于实现那些难以用 JavaScript 内置方法创建，但又经常需要且有用的函数。

我们不实现那些可以轻松被现代 JavaScript 替代的函数，例如：

- `isArray`（改用 `Array.isArray`）
- `isNaN`（改用 `Number.isNaN`）
- `isNumber`（改用 `typeof value === 'number'`）
- `min`（改用 `Math.min()`）

对于 TC39 提案中涵盖的函数，一旦进入 Stage 3，我们将不再实现。

## 特点

- **📝 TypeScript 原生支持** - 完整的类型定义，IDE 智能提示
- **📦 双格式输出** - ESM + CJS，支持现代 Node.js 和浏览器
- **🌲 Tree-shaking 友好** - 按需导入，只打包用到的函数
- **🎯 零依赖** - 无运行时依赖，体积更小
- **✅ 测试覆盖** - 每个函数都有完整的单元测试

## 快速开始

### 安装

```bash
npm install @c6i/es-sential
# or
pnpm add @c6i/es-sential
# or
yarn add @c6i/es-sential
```

### 使用方式

```typescript
import { noop, isSameValueZero } from '@c6i/es-sential'

// 空操作函数 - 作为默认回调
function fetchData(onSuccess = noop, onError = noop) {
  fetch('/api/data')
    .then(data => onSuccess(data))
    .catch(err => onError(err))
}

// SameValueZero 比较 - 与 Map/Set 内部逻辑一致
isSameValueZero(NaN, NaN) // true
isSameValueZero(-0, +0) // true
isSameValueZero(1, 1) // true
```

## API 文档

### `noop()`

空操作函数，执行时什么也不做。

**适用场景：**

- 作为默认回调函数，避免调用时需要反复检查 `if (callback)`
- 作为可选参数的默认值，简化调用方代码
- 在测试中作为桩（stub）函数
- 在高阶函数中作为占位符

```typescript
import { noop } from '@c6i/es-sential'

// 作为默认回调参数
function startAnimation(onFrame = noop) {
  let progress = 0
  requestAnimationFrame(function tick() {
    progress += 0.1
    onFrame(progress) // 始终安全，无需检查 undefined
    if (progress < 1) requestAnimationFrame(tick)
  })
}

// 在数组迭代中临时忽略某些元素
const arr = [1, 2, 3]
arr.forEach(noop) // 什么都不做，只是遍历
```

### `isSameValueZero(value, other)`

比较两个值是否相等，使用 **SameValueZero** 算法。

该算法是 JavaScript 中 `Map` 的键比较、`Set` 的值去重所采用的内部相等性判断规则。

| 比较          | `===`   | `Object.is` | `isSameValueZero` |
| ------------- | ------- | ----------- | ----------------- |
| `NaN === NaN` | `false` | `true`      | `true`            |
| `-0 === +0`   | `true`  | `false`     | `true`            |
| 其他          | 一致    | 一致        | 一致              |

**参数：**

- `value` - 待比较的第一个值
- `other` - 待比较的第二个值

**返回：** 若两个值满足 SameValueZero 相等则返回 `true`，否则返回 `false`

```typescript
import { isSameValueZero } from '@c6i/es-sential'

// 基本类型比较
isSameValueZero(1, 1) // true
isSameValueZero('a', 'a') // true

// NaN 比较（SameValueZero 认为 NaN 等于 NaN）
isSameValueZero(NaN, NaN) // true

// 零值比较（SameValueZero 认为 -0 和 +0 相等）
isSameValueZero(-0, +0) // true

// 对象比较（引用不同则不等）
isSameValueZero({}, {}) // false

// 模拟 Map 键比较
const map = new Map()
map.set(-0, 'minus')
map.set(+0, 'plus')
map.size // 1，键被覆盖
isSameValueZero(-0, +0) // true，与 Map 内部逻辑一致
```

## 开发路线图

**已发布：**

- [x] `noop` - 空操作函数
- [x] `isSameValueZero` - SameValueZero 相等性比较

**规划中：**

- [ ] Array 工具模块（`chunk`, `uniq`...）
- [ ] Object 工具模块（`pick`, `omit`...）
- [ ] String 工具模块（`camelCase`, `kebabCase`...）
- [ ] Function 工具模块（`debounce`, `throttle`...）
- [ ] Math 工具模块（`clamp`, `random`...）

## 贡献

欢迎贡献代码、提交 Issue 或建议新功能！

### 开发指南

```bash
# 安装依赖
pnpm install

# 运行测试
pnpm test

# 构建
pnpm run build

# 代码检查
pnpm run lint

# 类型检查
pnpm run typecheck
```

### 项目结构

```
es-sential/
├── src/
│   ├── function/      # 函数工具（noop）
│   ├── utils/         # 通用工具（isSameValueZero）
│   ├── array/         # 数组工具（待开发）
│   ├── object/        # 对象工具（待开发）
│   ├── string/        # 字符串工具（待开发）
│   └── index.ts       # 主入口
├── notes/             # 开发笔记
└── dist/              # 构建输出
```

查看 [notes/README.md](./notes/README.md) 了解开发过程中的学习心得。

## 许可证

[MIT](./LICENSE) © 2025

---

<p align="center">
如果这个项目对你有帮助，请给个 ⭐️
</p>
