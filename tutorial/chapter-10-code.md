# 第 10 章：编写功能

> 目标：实现完整的工具函数库，应用 TDD 开发方法
> 预计时间：90 分钟

---

## 一、本章目标

学完本章，你将：

- ✅ 使用 TDD 方法实现多个工具函数
- ✅ 掌握 TypeScript 泛型和类型系统
- ✅ 理解边界条件处理
- ✅ 练习代码重构技巧

---

## 二、功能规划

我们将实现以下工具函数：

| 模块       | 函数        | 功能         |
| :--------- | :---------- | :----------- |
| **array**  | `chunk`     | 数组分块     |
|            | `uniq`      | 数组去重     |
| **object** | `pick`      | 选取对象属性 |
|            | `omit`      | 排除对象属性 |
| **string** | `camelCase` | 转驼峰命名   |
|            | `kebabCase` | 转短横线命名 |

---

## 三、动手实践

### 3.1 实现 chunk 函数（TDD 完整流程）

#### 阶段 1：写测试（RED）

```typescript
// src/array/chunk.test.ts
import { describe, test, expect } from 'vitest'
import { chunk } from './chunk.js'

describe('chunk', () => {
  test('将数组分成指定大小的块', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  test('正好整除', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ])
  })

  test('空数组', () => {
    expect(chunk([], 2)).toEqual([])
  })

  test('size 大于数组长度', () => {
    expect(chunk([1, 2], 10)).toEqual([[1, 2]])
  })

  test('size = 0 抛出错误', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow('chunk size must be a positive integer')
  })

  test('size 为负数抛出错误', () => {
    expect(() => chunk([1, 2, 3], -1)).toThrow('chunk size must be a positive integer')
  })
})
```

运行测试（应该失败）：

```bash
pnpm test:ci
# ❌ 错误：chunk is not defined
```

#### 阶段 2：写实现（GREEN）

```typescript
// src/array/chunk.ts
/**
 * 将数组分成指定大小的块
 * @param array 要分块的数组
 * @param size 每块的大小
 * @returns 分块后的二维数组
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  // 边界检查
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

运行测试（应该通过）：

```bash
pnpm test:ci
# ✓ chunk (6)
```

#### 阶段 3：重构（REFACTOR）

检查代码是否还有改进空间：

```typescript
// 当前实现已经简洁清晰，无需重构
// - 使用 for 循环 + slice 是最优解
// - 边界检查完整
// - 类型定义准确
```

### 3.2 实现 uniq 函数

#### 写测试

```typescript
// src/array/uniq.test.ts
import { describe, test, expect } from 'vitest'
import { uniq } from './uniq.js'

describe('uniq', () => {
  test('去除数字数组重复项', () => {
    expect(uniq([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
  })

  test('去除字符串数组重复项', () => {
    expect(uniq(['a', 'b', 'b', 'c'])).toEqual(['a', 'b', 'c'])
  })

  test('空数组', () => {
    expect(uniq([])).toEqual([])
  })

  test('混合类型', () => {
    expect(uniq([1, '1', 1, '1'])).toEqual([1, '1'])
  })

  test('保留第一个出现的顺序', () => {
    expect(uniq([3, 1, 2, 1, 3])).toEqual([3, 1, 2])
  })
})
```

#### 写实现

```typescript
// src/array/uniq.ts
/**
 * 数组去重，返回新数组
 * @param array 要去重的数组
 * @returns 去重后的数组
 */
export function uniq<T>(array: readonly T[]): T[] {
  return Array.from(new Set(array))
}
```

**原理**：

- `Set` 自动去重
- `Array.from` 将 Set 转回数组

### 3.3 实现 pick 函数

#### 写测试

```typescript
// src/object/pick.test.ts
import { describe, test, expect } from 'vitest'
import { pick } from './pick.js'

describe('pick', () => {
  test('选取单个属性', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, ['a'])).toEqual({ a: 1 })
  })

  test('选取多个属性', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  test('选取不存在属性时忽略', () => {
    const obj = { a: 1, b: 2 }
    expect(pick(obj, ['a', 'x' as keyof typeof obj])).toEqual({ a: 1 })
  })

  test('空 keys 数组返回空对象', () => {
    const obj = { a: 1, b: 2 }
    expect(pick(obj, [])).toEqual({})
  })
})
```

#### 写实现

```typescript
// src/object/pick.ts
/**
 * 从对象中选取指定属性
 * @param object 源对象
 * @param keys 要选取的属性键数组
 * @returns 包含指定属性的新对象
 */
export function pick<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    result[key] = object[key]
  }
  return result
}
```

**类型技巧**：

- `T extends object` 约束 T 是对象类型
- `K extends keyof T` 约束 K 必须是 T 的键
- `Pick<T, K>` TypeScript 内置工具类型

### 3.4 实现 omit 函数

#### 写测试

```typescript
// src/object/omit.test.ts
import { describe, test, expect } from 'vitest'
import { omit } from './omit.js'

describe('omit', () => {
  test('排除单个属性', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(omit(obj, ['a'])).toEqual({ b: 2, c: 3 })
  })

  test('排除多个属性', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(omit(obj, ['a', 'c'])).toEqual({ b: 2 })
  })

  test('排除不存在属性时不报错', () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, ['x' as keyof typeof obj])).toEqual({ a: 1, b: 2 })
  })

  test('排除所有属性返回空对象', () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, ['a', 'b'])).toEqual({})
  })
})
```

#### 写实现

```typescript
// src/object/omit.ts
/**
 * 从对象中排除指定属性
 * @param object 源对象
 * @param keys 要排除的属性键数组
 * @returns 不包含指定属性的新对象
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(object: T, keys: readonly K[]): Omit<T, K> {
  const keySet = new Set<keyof T>(keys)
  return Object.keys(object).reduce<Record<string, unknown>>((result, key) => {
    if (!keySet.has(key)) {
      result[key] = object[key]
    }
    return result
  }, {}) as Omit<T, K>
}
```

**优化点**：

- 使用 `Set` 存储 keys，查找复杂度 O(1)
- 比 `keys.includes(key)`（O(n)）更高效

### 3.5 实现 camelCase 函数

#### 写测试

```typescript
// src/string/camelCase.test.ts
import { describe, test, expect } from 'vitest'
import { camelCase } from './camelCase.js'

describe('camelCase', () => {
  test('空格分隔', () => {
    expect(camelCase('hello world')).toBe('helloWorld')
  })

  test('下划线分隔', () => {
    expect(camelCase('hello_world')).toBe('helloWorld')
  })

  test('短横线分隔', () => {
    expect(camelCase('hello-world')).toBe('helloWorld')
  })

  test('已是驼峰', () => {
    expect(camelCase('helloWorld')).toBe('helloWorld')
  })

  test('大写下划线', () => {
    expect(camelCase('Hello_World')).toBe('helloWorld')
  })

  test('连续大写', () => {
    expect(camelCase('HTMLElement')).toBe('htmlElement')
  })

  test('空字符串', () => {
    expect(camelCase('')).toBe('')
  })
})
```

#### 写实现

```typescript
// src/string/camelCase.ts
/**
 * camelCase - 转换为驼峰命名
 * @param str - 源字符串
 * @returns 驼峰命名字符串
 *
 * 实现思路：
 * 1. 按非字母数字字符分割：/[^\p{L}\p{N}]+/gu （Unicode 感知）
 * 2. filter(Boolean) 过滤空字符串
 * 3. map 处理每个单词：首字符大写，其余小写（支持 Unicode）
 * 4. join 拼接，首单词小写
 */
export function camelCase(str: string): string {
  if (!str) return ''

  // 使用 Unicode 感知的分割：匹配任何非字母数字字符
  const words = str.split(/[^\p{L}\p{N}]+/gu).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) {
    return words[0].toLowerCase()
  }

  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map(word => {
        // 处理首字符（可能是 Unicode）
        const firstChar = String.fromCodePoint(word.codePointAt(0) ?? 0)
        const rest = word.slice(firstChar.length)
        return firstChar.toUpperCase() + rest.toLowerCase()
      })
      .join('')
  )
}
```

> **⚠️ 为什么不用 `charAt(0)`？**
>
> 因为 Emoji 等多字节字符无法被 `charAt` 正确处理：`🎉`.charAt(0) 返回乱码。使用 `String.fromCodePoint` 可以正确处理任何 Unicode 字符。

### 3.6 实现 kebabCase 函数

#### 写测试

```typescript
// src/string/kebabCase.test.ts
import { describe, test, expect } from 'vitest'
import { kebabCase } from './kebabCase.js'

describe('kebabCase', () => {
  test('驼峰命名', () => {
    expect(kebabCase('helloWorld')).toBe('hello-world')
  })

  test('PascalCase', () => {
    expect(kebabCase('HelloWorld')).toBe('hello-world')
  })

  test('大写下划线', () => {
    expect(kebabCase('HELLO_WORLD')).toBe('hello-world')
  })

  test('空格分隔', () => {
    expect(kebabCase('hello world')).toBe('hello-world')
  })

  test('连续大写', () => {
    expect(kebabCase('HTMLElement')).toBe('html-element')
  })

  test('空字符串', () => {
    expect(kebabCase('')).toBe('')
  })
})
```

#### 写实现

```typescript
// src/string/kebabCase.ts
/**
 * kebabCase - 转换为短横线命名
 * @param str - 源字符串
 * @returns 短横线命名字符串
 *
 * 实现思路：
 * 1. 处理连续大写后接小写（ACRONYM边界）：/([A-Z])([A-Z][a-z])/g
 * 2. 处理小写后接大写（camelCase边界）：/([a-z])([A-Z])/g
 * 3. 将所有分隔符替换为短横线
 * 4. 统一转小写
 */
export function kebabCase(str: string): string {
  if (!str) return ''

  return (
    str
      // 处理连续大写后接小写的情况：HTML + Element → HTML + - + Element
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      // 处理小写后接大写的情况：camelCase → camel-Case
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      // 按非字母数字分割（ASCII 范围，与 camelCase 保持一致性）
      .split(/[^a-zA-Z0-9]+/g)
      .filter(Boolean)
      .map(word => word.toLowerCase())
      .join('-')
  )
}
```

> **💡 设计决策：为什么 kebabCase 不用 Unicode 正则？**
>
> `camelCase` 需要正确处理 Unicode 以便将 `你好世界` 转为 `你好世界`。
> `kebabCase` 主要处理代码命名（ASCII），且连字符分隔在中文场景意义不大。
> 保持简单，使用 `/[^a-zA-Z0-9]+/g` 足够覆盖 99% 的使用场景。

````

---

## 四、统一导出

更新索引文件：

```typescript
// src/array/index.ts
export { chunk } from './chunk.js'
export { uniq } from './uniq.js'

// src/object/index.ts
export { pick } from './pick.js'
export { omit } from './omit.js'

// src/string/index.ts
export { camelCase } from './camelCase.js'
export { kebabCase } from './kebabCase.js'

// src/index.ts
export * from './array/index.js'
export * from './object/index.js'
export * from './string/index.js'
````

---

## 五、验证检查

请确认你已完成：

- [ ] 实现了 chunk 函数（含边界检查）
- [ ] 实现了 uniq 函数
- [ ] 实现了 pick 函数
- [ ] 实现了 omit 函数
- [ ] 实现了 camelCase 函数
- [ ] 实现了 kebabCase 函数
- [ ] 所有函数都有完整的单元测试
- [ ] 所有测试通过
- [ ] 代码通过 Biome lint 检查

**验证命令**：

```bash
# 运行所有测试
pnpm test:ci

# 检查代码
pnpm lint

# 构建
pnpm build

# 统计测试数量
# 预期：30+ 个测试
```

---

## 六、下一步

[第 11 章：进阶测试](./chapter-11-test-adv.md)

我们将：

- 学习类型测试
- 测试边界条件的更多技巧
- 生成测试覆盖率报告

---

## 参考资源

- [TypeScript 泛型](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript 工具类型](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [正则表达式 MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
