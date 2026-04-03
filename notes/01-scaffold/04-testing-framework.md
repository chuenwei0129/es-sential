# 04 - 测试框架 Vitest

## 为什么选 Vitest？

| 特性 | Vitest | Jest |
|:---|:---|:---|
| ESM 支持 | 原生支持 | 需要配置 transform |
| TypeScript | 原生支持 | 需要 ts-jest |
| 配置复杂度 | 接近零配置 | 需要较多配置 |
| 与 esbuild 集成 | 内置 | 需额外配置 |
| 迁移成本 | 从 Jest 迁移容易 | 基准 |

**Vitest 的定位**：专为现代 Vite 生态设计的测试框架，但 standalone 使用也完全 OK。

## vitest.config.ts 配置

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,              // 启用全局 API (describe, it, expect)
    environment: 'node',        // 运行环境
    include: ['src/**/*.test.ts'],  // 测试文件匹配
    exclude: ['node_modules', 'dist'], // 排除目录
    coverage: {
      provider: 'v8',           // 覆盖率工具
      reporter: ['text', 'json', 'html'],  // 输出格式
    },
  },
})
```

## TDD 工作流

### Red-Green-Refactor 循环

```
1. Red  - 写测试，确保失败（定义期望行为）
2. Green - 写最少代码让测试通过
3. Refactor - 重构代码，保持测试通过
        ↓
      回到 1，下一个功能
```

### 示例：noop 函数

**Step 1: Red** — 写测试（测试失败）

```typescript
// noop.test.ts
import { noop } from './noop'
import { describe, it, expect } from 'vitest'

describe('noop', () => {
  it('should be a function', () => {
    expect(typeof noop).toBe('function')
  })

  it('should return undefined', () => {
    expect(noop()).toBeUndefined()
  })
})
```

运行 `pnpm test`，**失败**（因为 noop 还没实现）

**Step 2: Green** — 实现（测试通过）

```typescript
// noop.ts
export function noop(): void {}
```

运行 `pnpm test`，**通过**！

**Step 3: Refactor** — 优化（可选）

noop 没什么好重构的，更复杂的函数可以优化实现。

## 常用 API

```typescript
// 基本断言
expect(value).toBe(expected)      // 严格相等 ===
expect(value).toEqual(expected)   // 深度相等
expect(value).toBeNull()
expect(value).toBeDefined()
expect(value).toBeTruthy()
expect(value).toBeFalsy()

// 数组/对象
expect(array).toContain(item)
expect(object).toHaveProperty('key')
expect(fn).toThrow()              // 抛出异常

// 异步
await expect(promise).resolves.toBe(value)
await expect(promise).rejects.toThrow()
```

## npm scripts

```json
{
  "scripts": {
    "test": "vitest run",           // 运行一次测试
    "test:watch": "vitest",         // 监听模式
    "test:coverage": "vitest run --coverage"  // 覆盖率报告
  }
}
```

## 学到的点

### 测试文件放哪里？

两种风格：

```
# 风格1: 同目录
src/
├── utils.ts
└── utils.test.ts      # 测试放一起

# 风格2: 独立目录
src/
└── utils.ts
test/
  └── utils.test.ts    # 测试单独放
```

我们选**风格1**，因为：
- 修改源码时一眼看到测试
- 重构移动文件时测试一起动
- vitest 的 include 配置简单

### Coverage 覆盖率

```
File        | % Stmts | % Branch | % Funcs | % Lines |
------------|---------|----------|---------|---------|
All files   |  100.00 |   100.00 |  100.00 |  100.00 |
```

- **Statements**：语句覆盖率
- **Branch**：分支覆盖率（if/else 都走全了吗）
- **Functions**：函数覆盖率
- **Lines**：行覆盖率

**目标**：核心代码保持 90%+ 覆盖率。

## 下一步

配置代码规范工具 → [05-code-quality.md](./05-code-quality.md)
