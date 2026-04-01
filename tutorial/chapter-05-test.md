# 第 5 章：测试框架

> 目标：配置 Vitest，学习 TDD 方法，编写第一个单元测试
> 预计时间：60 分钟

---

## 一、本章目标

学完本章，你将：
- ✅ 理解测试的重要性和 TDD 流程
- ✅ 配置 Vitest 测试框架
- ✅ 学会编写单元测试
- ✅ 掌握常用断言方法
- ✅ 理解边界条件测试

---

## 二、概念讲解

### 2.1 为什么要写测试？

**没有测试的代码**：

```typescript
export function divide(a: number, b: number): number {
  return a / b
}

// 使用时
console.log(divide(10, 0))  // Infinity，但没有报错
// 调用者不知道这是 bug 还是特性
```

**有测试的代码**：

```typescript
// 测试明确告诉我们预期行为
import { test, expect } from 'vitest'

// 测试用例 1：正常情况
expect(divide(10, 2)).toBe(5)

// 测试用例 2：边界情况 - 除数为 0
expect(() => divide(10, 0)).toThrow('Division by zero')
```

**测试的好处**：
1. **安全重构**：改代码时知道有没有破坏功能
2. **文档作用**：测试是最好的使用说明
3. **防回归**：确保已修复的问题不会再次出现
4. **驱动设计**：先写测试迫使你想清楚接口

### 2.2 什么是 TDD（测试驱动开发）？

**TDD 循环**：

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│   🔴    │ ──→ │   🟢    │ ──→ │   🔵    │
│   RED   │     │  GREEN  │     │ REFACTOR│
│ 写测试   │     │ 写实现  │     │  重构   │
└─────────┘     └─────────┘     └─────────┘
     ↑                               │
     └───────────────────────────────┘
```

**步骤详解**：

1. **🔴 RED**：写一个失败的测试
   ```typescript
   test('add(1, 2) 应该返回 3', () => {
     expect(add(1, 2)).toBe(3)  // Error: add is not defined
   })
   ```

2. **🟢 GREEN**：写最小实现让测试通过
   ```typescript
   function add(a: number, b: number): number {
     return 3  // 最简单的实现
   }
   ```

3. **🔵 REFACTOR**：重构代码，保持测试通过
   ```typescript
   function add(a: number, b: number): number {
     return a + b  // 正确的实现
   }
   ```

### 2.3 为什么选择 Vitest？

**测试框架对比**：

| 特性 | Jest | Vitest | 优势 |
|:---|:---:|:---:|:---|
| 启动速度 | 慢（需配置） | **极快** | Vite 驱动 |
| ESM 支持 | 需配置 | **原生** | 现代项目首选 |
| TypeScript | 需 ts-jest | **内置** | 零配置 |
| 热更新 | 不支持 | **支持** | 开发体验好 |
| Jest 兼容 | - | **兼容** | 迁移简单 |

**Vitest 特点**：
- 由 Vite 作者开发，与 Vite 共享配置
- 原生支持 ESM，无需转译
- API 与 Jest 几乎相同（describe/test/expect）
- 智能 watch 模式，只重新跑相关测试

### 2.4 测试结构：describe / test / expect

```typescript
import { describe, test, expect } from 'vitest'
import { add } from '../src/math'

// describe: 测试套件，按功能分组
describe('add 函数', () => {
  // test: 单个测试用例
  test('两个正数相加', () => {
    // expect + matcher: 断言
    expect(add(1, 2)).toBe(3)
  })

  test('负数相加', () => {
    expect(add(-1, -2)).toBe(-3)
  })

  test('包含零', () => {
    expect(add(0, 5)).toBe(5)
    expect(add(5, 0)).toBe(5)
  })
})
```

**常用匹配器（Matchers）**：

| 匹配器 | 用途 | 示例 |
|:---|:---|:---|
| `toBe(value)` | 严格相等 | `expect(1 + 1).toBe(2)` |
| `toEqual(obj)` | 深度相等 | `expect({a:1}).toEqual({a:1})` |
| `toBeTruthy()` | 真值 | `expect('hello').toBeTruthy()` |
| `toBeNull()` | 是 null | `expect(null).toBeNull()` |
| `toThrow(msg)` | 抛出错误 | `expect(fn).toThrow('error')` |
| `toHaveLength(n)` | 数组/字符串长度 | `expect([1,2]).toHaveLength(2)` |

### 2.5 什么是边界条件测试？

**边界条件是 Bug 的高发区**：

```typescript
// 看似简单的 chunk 函数
export function chunk<T>(array: readonly T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

// 问题：size = 0 会怎样？
chunk([1, 2, 3], 0)  // 死循环！

// 问题：size = -1 会怎样？
chunk([1, 2, 3], -1)  // 奇怪的行为

// 问题：size = Infinity 会怎样？
chunk([1, 2, 3], Infinity)  // 内存溢出
```

**必须测试的边界**：
- 空值：`null`, `undefined`, `[]`
- 极限值：`0`, `Infinity`, `-Infinity`, `Number.MAX_SAFE_INTEGER`
- 类型边界：整数 vs 小数，正数 vs 负数
- 资源边界：超大数组，超长字符串

---

## 三、动手实践

### 步骤 1：安装 Vitest

```bash
# 安装 Vitest
pnpm add -D vitest

# 验证安装
npx vitest --version
# 输出：3.x.x
```

### 步骤 2：创建 Vitest 配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 启用全局 API（describe/test/expect 无需导入）
    globals: true,

    // 测试环境（这里是纯 Node.js 项目）
    environment: 'node',

    // 测试文件匹配模式
    include: ['src/**/*.test.ts'],

    // 排除的目录
    exclude: ['node_modules', 'dist'],
  },
})
```

**为什么启用 globals？**

```typescript
// globals: false（默认）- 每个文件都要导入
import { describe, test, expect } from 'vitest'
import { add } from './math'

describe('add', () => {
  test('should work', () => {
    expect(add(1, 2)).toBe(3)
  })
})

// globals: true - 可以直接使用
describe('add', () => {
  test('should work', () => {
    expect(add(1, 2)).toBe(3)
  })
})
```

### 步骤 3：更新 TypeScript 配置

启用 globals 后，需要告诉 TypeScript describe/test/expect 是全局的：

```json
// tsconfig.json
{
  "compilerOptions": {
    // ... 其他配置
    "types": ["vitest/globals"]
  }
}
```

### 步骤 4：编写第一个测试

使用 TDD 方式实现 `add` 函数：

**阶段 1：写测试（RED）**

```typescript
// src/math.test.ts
describe('add', () => {
  test('两个正数相加', () => {
    expect(add(1, 2)).toBe(3)
  })
})
```

运行测试：

```bash
npx vitest run
# ❌ 失败：ReferenceError: add is not defined
```

**阶段 2：写实现（GREEN）**

```typescript
// src/math.ts
export function add(a: number, b: number): number {
  return a + b
}
```

```typescript
// src/math.test.ts
import { add } from './math.js'  // ESM 需要 .js 扩展名

describe('add', () => {
  test('两个正数相加', () => {
    expect(add(1, 2)).toBe(3)
  })
})
```

再次运行：

```bash
npx vitest run
# ✓ src/math.test.ts (1)
```

### 步骤 5：为 chunk 函数写完整测试

```typescript
// src/array/chunk.test.ts
import { chunk } from './chunk.js'

describe('chunk', () => {
  // 正常情况
  test('将数组分成指定大小的块', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  test('正好整除', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]])
  })

  // 边界情况
  test('空数组', () => {
    expect(chunk([], 2)).toEqual([])
  })

  test('size 大于数组长度', () => {
    expect(chunk([1, 2], 10)).toEqual([[1, 2]])
  })

  test('size = 1', () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]])
  })

  // 错误情况
  test('size = 0 抛出错误', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow('chunk size must be a positive integer')
  })

  test('size 为负数抛出错误', () => {
    expect(() => chunk([1, 2, 3], -1)).toThrow('chunk size must be a positive integer')
  })

  test('size 为小数抛出错误', () => {
    expect(() => chunk([1, 2, 3], 2.5)).toThrow('chunk size must be a positive integer')
  })

  test('size 为 NaN 抛出错误', () => {
    expect(() => chunk([1, 2, 3], NaN)).toThrow('chunk size must be a positive integer')
  })

  test('size 为 Infinity 抛出错误', () => {
    expect(() => chunk([1, 2, 3], Infinity)).toThrow('chunk size must be a positive integer')
  })
})
```

运行测试：

```bash
npx vitest run
```

### 步骤 6：添加 watch 模式脚本

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ci": "vitest run"  // CI 环境用，不进入 watch 模式
  }
}
```

测试：

```bash
# 开发模式 - 文件改变自动重新运行
pnpm test

# CI 模式 - 只运行一次
pnpm test:ci
```

### 步骤 7：体验 watch 模式的高级用法

Vitest watch 模式支持交互式命令：

```bash
pnpm test

# 进入 watch 模式后按：
# a - 运行所有测试
# f - 只运行失败的测试
# p - 按文件名过滤
# t - 按测试名过滤
# q - 退出
```

---

## 四、原理解析

### 4.1 Vitest 为什么比 Jest 快？

**Jest 的工作流程**：

```
TypeScript 源码
    ↓ ts-jest 编译（慢，基于 TypeScript 编译器）
编译后的 JavaScript
    ↓ Jest 运行测试（基于自己的运行时）
测试结果
```

**Vitest 的工作流程**：

```
TypeScript/Vite 源码
    ↓ Vite 即时编译（快，基于 esbuild）
原生 ESM 模块
    ↓ Node.js 原生 ESM 运行（最快）
测试结果
```

**关键差异**：
- Vitest 利用 Vite 的 esbuild 预构建，跳过类型检查
- 使用原生 ESM，无需 CommonJS 转换
- 智能缓存，只重新跑受影响的测试

### 4.2 为什么 TDD 能提高代码质量？

**传统开发**：
```
写代码 → 手动测试 → 发现 Bug → 修改 → 发现新 Bug → ...
```
- 测试场景想到什么测什么
- 容易遗漏边界条件
- 重构时提心吊胆

**TDD 开发**：
```
写测试（考虑各种情况）→ 写代码（明确目标）→ 重构（安全）
```
- 先写测试强制思考各种场景
- 代码满足测试就停止（防止过度设计）
- 测试通过才敢重构

**chunk 函数的 TDD 过程**：

```
🔴 测试 size = 0 应该报错
   → 但实现没有检查，测试失败

🟢 添加检查代码
   if (size <= 0) throw new Error(...)

🔵 重构检查逻辑
   if (!Number.isFinite(size) || size <= 0 || !Number.isInteger(size))

→ 完整覆盖了所有边界！
```

### 4.3 测试的结构化思考

好测试遵循 "AAA" 模式：

```typescript
test('描述清晰的行为', () => {
  // Arrange（准备）- 设置测试数据
  const input = [1, 2, 3, 4, 5]
  const size = 2

  // Act（执行）- 调用被测函数
  const result = chunk(input, size)

  // Assert（断言）- 验证结果
  expect(result).toEqual([[1, 2], [3, 4], [5]])
})
```

---

## 五、常见问题

### Q1：测试报错 "Cannot find module"?

确保使用 ESM 导入语法：

```typescript
// ✅ 正确
import { chunk } from './chunk.js'

// ❌ 错误 - ESM 需要 .js 扩展名
import { chunk } from './chunk'

// ❌ 错误 - 不要用 require
const { chunk } = require('./chunk')
```

### Q2：TypeScript 报 "Cannot find name 'describe'"

检查配置：

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]  // 启用全局类型
  }
}
```

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true  // 启用全局 API
  }
})
```

### Q3：如何只运行特定测试？

```bash
# 运行特定文件
npx vitest run src/array/chunk.test.ts

# 运行匹配名称的测试
npx vitest run -t "size = 0"

# watch 模式下按 p 按文件名过滤
```

### Q4：测试覆盖率怎么配置？

```bash
# 安装覆盖率工具
pnpm add -D @vitest/coverage-v8
```

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
    },
  },
})
```

```bash
# 运行带覆盖率的测试
npx vitest run --coverage
```

### Q5：异步代码怎么测试？

```typescript
// 测试 Promise
test('异步操作', async () => {
  const result = await fetchData()
  expect(result).toBe('data')
})

// 测试异步错误
test('异步错误', async () => {
  await expect(fetchData()).rejects.toThrow('error')
})
```

---

## 六、验证检查

请确认你已完成：

- [ ] 安装了 Vitest (`pnpm add -D vitest`)
- [ ] 创建了 `vitest.config.ts` 配置文件
- [ ] 配置了 `globals: true` 和 `environment: 'node'`
- [ ] 更新了 `tsconfig.json` 包含 `vitest/globals` 类型
- [ ] 编写了至少一个测试文件（如 `chunk.test.ts`）
- [ ] 测试覆盖了正常情况和边界情况
- [ ] `pnpm test` 可以进入 watch 模式
- [ ] `pnpm test:ci` 可以完成单次测试
- [ ] 所有测试顺利通过

**验证命令**：

```bash
# 运行测试
pnpm test:ci

# 应该看到类似输出：
#  ✓ src/array/chunk.test.ts (10)
#  ✓ src/math.test.ts (3)
#
#  Test Files  2 passed (2)
#       Tests  13 passed (13)
```

---

## 七、下一步

[第 6 章：代码规范](./chapter-06-lint.md)

我们将：
- 配置 Biome 替代 ESLint + Prettier
- 统一代码风格
- 配置自动格式化

---

## 参考资源

- [Vitest 官方文档](https://vitest.dev/)
- [Vitest API 参考](https://vitest.dev/api/)
- [Jest 文档](https://jestjs.io/)（Vitest API 兼容）
- [测试金字塔理论](https://martinfowler.com/articles/practical-test-pyramid.html)

