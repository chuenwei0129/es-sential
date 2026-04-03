# TDD 方法论：Red-Green-Refactor

## 核心循环

```
🟥 Red   →  🟩 Green  →  ♻️ Refactor
(写测试)    (写代码)     (重构)
   ↑___________________________|
          循环往复
```

## 三个阶段详解

### 1. Red — 编写失败的测试

**目标**：用测试定义「你想让代码做什么」

**规则**：

- 先写测试，再写实现
- 测试必须失败（验证测试本身是有效的）
- 一次只测试一个小行为

**示例**：实现 `delay` 函数

```typescript
// delay.test.ts
import { delay } from './delay'
import { describe, it, expect } from 'vitest'

describe('delay', () => {
  it('should delay for specified milliseconds', async () => {
    const start = Date.now()
    await delay(100)
    const elapsed = Date.now() - start

    expect(elapsed).toBeGreaterThanOrEqual(100)
  })
})
```

运行 `pnpm test` → 失败 ❌（因为 delay 还不存在）

**关键**：看到红色失败，不要慌，这是预期的！

---

### 2. Green — 让测试通过

**目标**：用最简单的代码让测试变绿

**规则**：

- 代码可以丑陋，可以 hardcode
- 目标是「通过测试」，不是「完美实现」
- 不要提前设计，不要预判未来需求

**示例**：最简单的实现

```typescript
// delay.ts
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

运行 `pnpm test` → 通过 ✅

**关键**：绿了就停，不要过度设计！

---

### 3. Refactor — 重构代码

**目标**：在测试保护下改进代码质量

**规则**：

- 测试必须保持通过（绿灯）
- 改进可读性、性能、结构
- 消除重复，但不添加新功能

**示例**：delay 可能需要优化的点

```typescript
// 原始实现 —— 已经够简洁了，可能不需要重构
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 但如果是复杂函数，可以：
// - 提取子函数
// - 改名让意图更清晰
// - 简化条件判断
```

**关键**：重构时只改实现，不改行为。测试是安全网。

---

## 完整示例：delay 函数

### Step 1: Red — 测试失败

```typescript
// delay.test.ts —— 更完整的测试
describe('delay', () => {
  it('should delay for specified milliseconds', async () => {
    const start = Date.now()
    await delay(100)
    const elapsed = Date.now() - start

    expect(elapsed).toBeGreaterThanOrEqual(100)
    expect(elapsed).toBeLessThan(200) // 不会延迟太久
  })

  it('should return a promise', () => {
    const result = delay(0)
    expect(result).toBeInstanceOf(Promise)
  })

  it('should resolve with undefined', async () => {
    const result = await delay(0)
    expect(result).toBeUndefined()
  })
})
```

全部失败 ❌❌❌

### Step 2: Green — 实现通过

```typescript
// delay.ts
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}
```

全部通过 ✅✅✅

### Step 3: Refactor — 简化

```typescript
// delay.ts —— 简化版本
export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))
```

测试仍然通过 ✅✅✅

---

## TDD 的好处

| 好处             | 说明                                   |
| :--------------- | :------------------------------------- |
| **设计压力后置** | 先写代码容易过度设计，先写测试聚焦需求 |
| **测试即文档**   | 测试描述了代码的行为契约               |
| **重构安全网**   | 有测试才能大胆重构                     |
| **减少调试**     | 有问题立即发现，不会累积               |

---

## 常见误区

### ❌ 误区1：追求一开始就完美

```typescript
// 错误：Red 阶段就想太多
it('should handle negative numbers, null, and custom callback', () => {
  // 一次写太多测试
})
```

**纠正**：一次一个测试，逐步推进

### ❌ 误区2：Green 阶段过度设计

```typescript
// 错误：提前实现还没测试的功能
export function delay(ms: number, options?: { signal?: AbortSignal }) {
  // 还没测试 AbortSignal 就实现了
}
```

**纠正**：先让当前测试通过，新功能新测试

### ❌ 误区3：不写测试直接重构

```typescript
// 危险：没有测试就重构
// 结果：改完不知道对不对
```

**纠正**：任何时候重构，都必须有测试保护

---

## es-toolkit 参考

我们的目标是学习 es-toolkit 的风格：

- **小函数**：每个函数只做一件事
- **完整类型**：TypeScript 类型推断最大化
- **详尽的测试**：边界条件全覆盖

### 学习资源

- [es-toolkit GitHub](https://github.com/toss/es-toolkit)
- 看源码：函数实现通常很短
- 看测试：每个函数几十个测试 case

---

## 下一步

选一个简单函数开始实战：

- `delay` — 延迟执行 ✅（已完成示例）
- `noop` — 空操作 ✅（项目中已有）
- `once` — 只执行一次
- `throttle` — 节流
- `debounce` — 防抖

选哪个？或者你有其他想实现的函数？
