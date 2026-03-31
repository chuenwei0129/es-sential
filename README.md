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
<a href="#模块">模块</a> •
<a href="#文档">文档</a> •
<a href="#贡献">贡献</a>
</p>

---

## 简介

**es-sential**（essential：必要的）—— 名字的创意既表达了"这是必需的"，又巧妙嵌入了"ES"（代表 ECMAScript），一语双关。

就像这个库里的工具函数都是 essential。

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

#### 全量导入

```typescript
import { chunk, uniq, pick, omit, camelCase, kebabCase } from '@c6i/es-sential'
```

#### 按需导入（推荐）

```typescript
// 数组工具
import { chunk, uniq } from '@c6i/es-sential/array'

// 对象工具
import { pick, omit } from '@c6i/es-sential/object'

// 字符串工具
import { camelCase, kebabCase } from '@c6i/es-sential/string'
```

## 模块

当前支持的模块：

| 模块 | 导入路径 | 功能 |
|:---:|:---|:---|
| **Array** | `@c6i/es-sential/array` | 数组工具函数：`chunk`, `uniq`... |
| **Object** | `@c6i/es-sential/object` | 对象工具函数：`pick`, `omit`... |
| **String** | `@c6i/es-sential/string` | 字符串工具函数：`camelCase`, `kebabCase`... |

> 更多模块正在开发中...

## 文档

### 在线文档

🌐 **完整文档和 API 参考**: [https://es-sential.c6i.com](https://es-sential.c6i.com)（即将上线）

### 快速参考

<details>
<summary><strong>Array 模块</strong></summary>

#### `chunk<T>(array, size)`
将数组分割成指定大小的块。

```typescript
import { chunk } from '@c6i/es-sential/array'

chunk([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]
```

#### `uniq<T>(array)`
数组去重，保留首次出现的元素。

```typescript
import { uniq } from '@c6i/es-sential/array'

uniq([1, 2, 2, 3, 3, 4])   // [1, 2, 3, 4]
uniq(['a', 'b', 'b', 'a']) // ['a', 'b']
```

</details>

<details>
<summary><strong>Object 模块</strong></summary>

#### `pick(object, keys)`
从对象中选取指定属性。

```typescript
import { pick } from '@c6i/es-sential/object'

pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // { a: 1, c: 3 }
```

#### `omit(object, keys)`
从对象中排除指定属性。

```typescript
import { omit } from '@c6i/es-sential/object'

omit({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // { b: 2 }
```

</details>

<details>
<summary><strong>String 模块</strong></summary>

#### `camelCase(str)`
转换为驼峰命名（camelCase）。

```typescript
import { camelCase } from '@c6i/es-sential/string'

camelCase('hello world')      // 'helloWorld'
camelCase('hello-world')      // 'helloWorld'
camelCase('hello_world')      // 'helloWorld'
```

#### `kebabCase(str)`
转换为短横线命名（kebab-case）。

```typescript
import { kebabCase } from '@c6i/es-sential/string'

kebabCase('helloWorld')       // 'hello-world'
kebabCase('HelloWorld')       // 'hello-world'
kebabCase('hello_world')      // 'hello-world'
```

</details>

## 开发路线图

- [x] 核心工具模块（Array, Object, String）
- [ ] Function 工具模块（`debounce`, `throttle`...）
- [ ] Math 工具模块（`clamp`, `random`...）
- [ ] 日期/时间处理模块
- [ ] 数据处理/验证模块
- [ ] 官方文档站点

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
```

### 项目结构

```
es-sential/
├── src/
│   ├── array/         # 数组工具
│   ├── object/        # 对象工具
│   ├── string/        # 字符串工具
│   └── index.ts       # 主入口
├── docs/              # 文档站点（即将添加）
├── tests/             # 测试文件
└── build/             # 构建配置
```

查看 [NOTES.md](./NOTES.md) 了解开发过程中的学习心得。

## 许可证

[MIT](./LICENSE) © 2025

---

<p align="center">
如果这个项目对你有帮助，请给个 ⭐️
</p>
