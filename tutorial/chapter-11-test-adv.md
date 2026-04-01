# 第 11 章：进阶测试

> 目标：学习类型测试、边界条件测试和覆盖率分析
> 预计时间：60 分钟

---

## 一、本章目标

学完本章，你将：
- ✅ 掌握类型测试技巧
- ✅ 深入理解边界条件测试
- ✅ 生成和解读测试覆盖率报告
- ✅ 学习测试最佳实践

---

## 二、类型测试

### 2.1 为什么需要类型测试？

TypeScript 的类型系统在编译时检查，但有时候我们想**确保类型推断是正确的**：

```typescript
// pick 函数返回的类型是否正确？
const result = pick({ a: 1, b: 2 }, ['a'])
// result 应该是 { a: number }，而不是 any
```

**类型测试验证**：
- 返回值类型正确
- 泛型推断符合预期
- 类型约束有效

### 2.2 使用 expect-type

安装类型测试工具：

```bash
pnpm add -D expect-type
```

编写类型测试：

```typescript
// src/object/pick.type.test.ts
import { describe, test, expectTypeOf } from 'vitest'
import { pick } from './pick.js'

describe('pick types', () => {
  test('返回值类型正确', () => {
    const obj = { a: 1, b: 'hello', c: true }
    const result = pick(obj, ['a', 'b'])

    // 验证 result 类型是 { a: number; b: string }
    expectTypeOf(result).toEqualTypeOf<{ a: number; b: string }>()
  })

  test('不会包含未选取的属性', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pick(obj, ['a'])

    // result 不应该有 b 属性
    expectTypeOf(result).not.toHaveProperty('b')
  })

  test('空 keys 返回空对象类型', () => {
    const obj = { a: 1, b: 2 }
    const result = pick(obj, [])

    expectTypeOf(result).toEqualTypeOf<{}>()
  })
})
```

### 2.3 类型测试案例：chunk

```typescript
// src/array/chunk.type.test.ts
import { describe, test, expectTypeOf } from 'vitest'
import { chunk } from './chunk.js'

describe('chunk types', () => {
  test('保持元素类型', () => {
    const result = chunk([1, 2, 3], 2)
    // result 应该是 number[][]，不是 any[][]
    expectTypeOf(result).toEqualTypeOf<number[][]>()
  })

  test('支持复杂类型', () => {
    interface User {
      name: string
    }
    const users: User[] = [{ name: 'Tom' }, { name: 'Jerry' }]
    const result = chunk(users, 1)

    expectTypeOf(result).toEqualTypeOf<User[][]>()
  })

  test('readonly 数组输入', () => {
    const arr: readonly string[] = ['a', 'b', 'c']
    const result = chunk(arr, 2)

    // 应该能处理 readonly 输入
    expectTypeOf(result).toEqualTypeOf<string[][]>()
  })
})
```

---

## 三、边界条件测试进阶

### 3.1 chunk 的边界测试

```typescript
// src/array/chunk.test.ts
describe('chunk edge cases', () => {
  // 数值边界
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

  test('size 为 -Infinity 抛出错误', () => {
    expect(() => chunk([1, 2, 3], -Infinity)).toThrow('chunk size must be a positive integer')
  })

  // 数组边界
  test('空数组', () => {
    expect(chunk([], 2)).toEqual([])
  })

  test('单元素数组', () => {
    expect(chunk([1], 2)).toEqual([[1]])
  })

  test('size 等于数组长度', () => {
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]])
  })

  test('size 大于数组长度', () => {
    expect(chunk([1, 2], 10)).toEqual([[1, 2]])
  })
})
```

### 3.2 字符串函数的 Unicode 测试

```typescript
// src/string/camelCase.test.ts
describe('camelCase unicode support', () => {
  test('支持中文', () => {
    expect(camelCase('你好 世界')).toBe('你好世界')
  })

  test('支持日文', () => {
    expect(camelCase('こんにちは 世界')).toBe('こんにちは世界')
  })

  test('支持 Emoji', () => {
    expect(camelCase('hello👋world')).toBe('helloWorld')
  })

  test('混合 Unicode', () => {
    expect(camelCase('hello 世界 hello')).toBe('hello世界Hello')
  })
})
```

---

## 四、测试覆盖率

### 4.1 安装覆盖率工具

```bash
pnpm add -D @vitest/coverage-v8
```

### 4.2 配置覆盖率

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.type.test.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
```

### 4.3 运行覆盖率测试

```bash
# 运行带覆盖率的测试
pnpm test:ci --coverage

# 或在 package.json 添加脚本
{
  "scripts": {
    "test:coverage": "vitest run --coverage"
  }
}
```

### 4.4 解读覆盖率报告

**输出示例**：

```
 % Coverage report from v8
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   95.23 |    92.85 |     100 |   95.23 |
 chunk.ts |     100 |      100 |     100 |     100 |
 uniq.ts  |     100 |      100 |     100 |     100 |
 pick.ts  |   85.71 |       75 |     100 |   85.71 | 12
 omit.ts  |   92.85 |    83.33 |     100 |   92.85 | 15-16
----------|---------|----------|---------|---------|-------------------
```

**指标说明**：

| 指标 | 含义 | 说明 |
|:---|:---|:---|
| % Stmts | 语句覆盖率 | 执行过的语句占比 |
| % Branch | 分支覆盖率 | if/else、switch 等分支覆盖 |
| % Funcs | 函数覆盖率 | 调用过的函数占比 |
| % Lines | 行覆盖率 | 执行过的代码行占比 |

**HTML 报告**：

```bash
# 打开详细报告
coverage/index.html
```

可以查看哪些行未被覆盖，有针对性地补充测试。

---

## 五、测试最佳实践

### 5.1 AAA 模式

```typescript
test('should calculate sum correctly', () => {
  // Arrange（准备）
  const a = 1
  const b = 2

  // Act（执行）
  const result = add(a, b)

  // Assert（断言）
  expect(result).toBe(3)
})
```

### 5.2 一个测试一个概念

```typescript
// ❌ 不好：测试了多个概念
test('chunk', () => {
  expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]])
  expect(chunk([], 2)).toEqual([])
  expect(() => chunk([1], 0)).toThrow()
})

// ✅ 好：每个测试一个概念
test('将数组分块', () => {
  expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]])
})

test('空数组返回空', () => {
  expect(chunk([], 2)).toEqual([])
})

test('size 为 0 抛出错误', () => {
  expect(() => chunk([1], 0)).toThrow()
})
```

### 5.3 使用描述性的测试名

```typescript
// ❌ 不清楚测试什么
test('chunk works', () => {

// ✅ 清晰描述行为和场景
test('将数组分成指定大小的块（正常情况）', () => {
test('size = 0 时抛出错误（边界防护）', () => {
```

### 5.4 测试隔离

每个测试应该是独立的，不依赖其他测试：

```typescript
// ❌ 不好：测试相互依赖
let counter = 0

test('increment', () => {
  counter++  // counter = 1
  expect(counter).toBe(1)
})

test('increment again', () => {
  counter++  // 依赖上一个测试，counter = 2
  expect(counter).toBe(2)
})

// ✅ 好：每个测试独立
beforeEach(() => {
  counter = 0  // 每个测试前重置
})

test('increment', () => {
  counter++
  expect(counter).toBe(1)
})
```

---

## 六、验证检查

请确认你已完成：

- [ ] 安装了 expect-type (`pnpm add -D expect-type`)
- [ ] 编写了至少一个类型测试文件
- [ ] 补充了边界条件测试
- [ ] 安装了覆盖率工具 (`pnpm add -D @vitest/coverage-v8`)
- [ ] 配置了覆盖率阈值
- [ ] 运行了覆盖率测试并理解报告

**验证命令**：

```bash
# 运行类型测试
pnpm test:ci

# 运行覆盖率测试
pnpm test:ci --coverage

# 检查覆盖率阈值
# 所有指标应该 ≥ 80%
```

---

## 七、下一步

[第 12 章：发布与维护](./chapter-12-publish.md)

我们将：
- 执行完整的发布流程
- 学习包的后续维护
- 总结整个开发流程

---

## 参考资源

- [Vitest 覆盖率文档](https://vitest.dev/guide/coverage.html)
- [expect-type GitHub](https://github.com/mmkal/expect-type)
- [测试金字塔](https://martinfowler.com/articles/practical-test-pyramid.html)

