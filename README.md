# @c6i/es-sential

现代 JavaScript/TypeScript 工具函数库

[![Test](https://github.com/c6i/es-sential/actions/workflows/release.yml/badge.svg)](https://github.com/c6i/es-sential/actions)

> **学**** ****项**** **：**** ****通**** ****过**** ****实**** ****践**** ****现**** ****代**** ****n****p****m**** ****包**** ****开**** ****发**** ****流**** ****程**

## 📦 安装

```bash
npm install @c6i/es-sential
# or
pnpm add @c6i/es-sential
# or
yarn add @c6i/es-sential
```

## 🚀 使用

### 全量导入

```typescript
import { chunk, uniq, pick, omit, camelCase, kebabCase } from '@c6i/es-sential'
```

### 按需导入

```typescript
// 只导入数组工具
import { chunk, uniq } from '@c6i/es-sential/array'

// 只导入对象工具
import { pick, omit } from '@c6i/es-sential/object'

// 只导入字符串工具
import { camelCase, kebabCase } from '@c6i/es-sential/string'
```

## 📖 API

### Array

#### `chunk<T>(array: readonly T[], size: number): T[][]`

将数组分割成指定大小的块。

```typescript
import { chunk } from '@c6i/es-sential/array'

chunk([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]
```

#### `uniq<T>(array: readonly T[]): T[]`

数组去重，保留首次出现的元素。

```typescript
import { uniq } from '@c6i/es-sential/array'

uniq([1, 2, 2, 3, 3, 4])   // [1, 2, 3, 4]
uniq(['a', 'b', 'b', 'a']) // ['a', 'b']
```

### Object

#### `pick<T, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K>`

从对象中选取指定属性。

```typescript
import { pick } from '@c6i/es-sential/object'

pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // { a: 1, c: 3 }
```

#### `omit<T, K extends keyof T>(object: T, keys: readonly K[]): Omit<T, K>`

从对象中排除指定属性。

```typescript
import { omit } from '@c6i/es-sential/object'

omit({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // { b: 2 }
```

### String

#### `camelCase(str: string): string`

转换为驼峰命名（camelCase）。

```typescript
import { camelCase } from '@c6i/es-sential/string'

camelCase('hello world')      // 'helloWorld'
camelCase('hello-world')      // 'helloWorld'
camelCase('hello_world')      // 'helloWorld'
camelCase('Hello World')      // 'helloWorld'
```

#### `kebabCase(str: string): string`

转换为短横线命名（kebab-case）。

```typescript
import { kebabCase } from '@c6i/es-sential/string'

kebabCase('helloWorld')       // 'hello-world'
kebabCase('HelloWorld')       // 'hello-world'
kebabCase('hello world')      // 'hello-world'
kebabCase('hello_world')      // 'hello-world'
kebabCase('HTMLElement')      // 'html-element'
```

## 🎯 技术亮点

- **TypeScript 支持**: 完整的类型定义，让你的 IDE 有最好的代码提示
- **双格式输出**: ESM + CJS，支持现代 Node.js 和浏览器
- **按需加载**: 模块化导出，配合 tree-shaking 实现最小打包
- **零依赖**: 无运行时依赖，体积更小
- **TDD 开发**: 每个函数都有完整的单元测试覆盖

## 🛠️ 开发

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

## 📚 学习笔记

查看 [NOTES.md](./NOTES.md) 了解开发过程中的学习心得。

## 📄 许可证

MIT
