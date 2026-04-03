# 第 10 章补充：如何添加新函数

> 目标：掌握为 npm 包添加新函数的完整流程
> 示例：添加 `debounce` 防抖函数

---

## 一、添加新函数需要修改哪些地方？

当你想添加一个新函数（如 `debounce`），需要在 **5 个地方**进行修改：

| 序号 | 文件                            | 作用       | 必改？ |
| :--: | :------------------------------ | :--------- | :----: |
|  1   | `src/function/debounce.ts`      | 函数实现   |   ✅   |
|  2   | `src/function/debounce.test.ts` | 单元测试   |   ✅   |
|  3   | `src/function/index.ts`         | 模块导出   |   ✅   |
|  4   | `tsup.config.ts`                | 构建入口   |   ✅   |
|  5   | `package.json` exports          | 子路径导出 |   ✅   |

---

## 二、完整步骤演示（以 debounce 为例）

### 步骤 1：创建目录和实现文件

```bash
# 创建 function 模块目录
mkdir -p src/function

# 创建实现文件
touch src/function/debounce.ts
```

### 步骤 2：编写函数实现

```typescript
// src/function/debounce.ts
/**
 * debounce - 防抖函数
 * @param fn - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), wait)
  }
}
```

### 步骤 3：编写测试

```typescript
// src/function/debounce.test.ts
import { describe, test, expect, vi } from 'vitest'
import { debounce } from './debounce.js'

describe('debounce', () => {
  test('延迟执行', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test('多次调用只执行最后一次', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    debounced()
    debounced()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })
})
```

### 步骤 4：创建模块索引文件

```typescript
// src/function/index.ts
export { debounce } from './debounce.js'
```

### 步骤 5：更新主索引

```typescript
// src/index.ts
export * from './array/index.js'
export * from './object/index.js'
export * from './string/index.js'
export * from './function/index.js' // 新增
```

### 步骤 6：更新 tsup.config.ts

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'array/index': 'src/array/index.ts',
    'object/index': 'src/object/index.ts',
    'string/index': 'src/string/index.ts',
    'function/index': 'src/function/index.ts', // 新增
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
})
```

### 步骤 7：更新 package.json exports

```json
{
  "exports": {
    ".": { ... },
    "./array": { ... },
    "./object": { ... },
    "./string": { ... },
    "./function": {
      "import": {
        "types": "./dist/function/index.d.ts",
        "default": "./dist/function/index.js"
      },
      "require": {
        "types": "./dist/function/index.d.cts",
        "default": "./dist/function/index.cjs"
      }
    }
  }
}
```

---

## 三、验证添加成功

```bash
# 1. 运行测试
pnpm test:ci src/function/debounce.test.ts

# 2. 构建
pnpm build

# 3. 验证导出
echo "import { debounce } from './dist/function/index.js'" | node --input-type=module

# 4. 验证类型
npx tsc --noEmit src/function/debounce.ts
```

---

## 四、快速添加模板

复制以下模板快速添加新函数：

### 文件模板：`src/{module}/{name}.ts`

```typescript
/**
 * {name} - {description}
 * @param param - 参数说明
 * @returns 返回值说明
 */
export function {name}<T>(param: T): T {
  // 实现
}
```

### 测试模板：`src/{module}/{name}.test.ts`

```typescript
import { describe, test, expect } from 'vitest'
import { {name} } from './{name}.js'

describe('{name}', () => {
  test('should work correctly', () => {
    expect({name}(input)).toBe(expected)
  })
})
```

---

## 五、常见问题

### Q: 新函数应该放在哪个模块？

| 函数类型   | 模块        | 示例                        |
| :--------- | :---------- | :-------------------------- |
| 数组操作   | `array/`    | chunk, uniq, flatten        |
| 对象操作   | `object/`   | pick, omit, merge           |
| 字符串操作 | `string/`   | camelCase, kebabCase        |
| 函数工具   | `function/` | debounce, throttle, memoize |
| 类型工具   | `type/`     | isString, isArray           |

### Q: 如何快速创建新函数？

创建脚本 `scripts/add-function.sh`：

```bash
#!/bin/bash
MODULE=$1
NAME=$2

mkdir -p src/$MODULE
cat > src/$MODULE/$NAME.ts << EOF
export function $NAME() {
  // TODO: implement
}
EOF

cat > src/$MODULE/$NAME.test.ts << EOF
import { describe, test, expect } from 'vitest'
import { $NAME } from './$NAME.js'

describe('$NAME', () => {
  test('basic', () => {
    expect($NAME()).toBeDefined()
  })
})
EOF

echo "Created src/$MODULE/$NAME.ts and test"
echo "Don't forget to:"
echo "1. Add export to src/$MODULE/index.ts"
echo "2. Update tsup.config.ts entry"
echo "3. Update package.json exports"
```

使用：

```bash
./scripts/add-function.sh function debounce
```

---

## 六、检查清单

添加新函数后，确认以下检查项：

- [ ] 函数实现文件 `src/{module}/{name}.ts`
- [ ] 测试文件 `src/{module}/{name}.test.ts`
- [ ] 模块索引 `src/{module}/index.ts` 导出新函数
- [ ] 主索引 `src/index.ts` 导出模块
- [ ] `tsup.config.ts` entry 包含新模块
- [ ] `package.json` exports 包含子路径
- [ ] 所有测试通过 (`pnpm test:ci`)
- [ ] 构建成功 (`pnpm build`)
- [ ] 类型检查通过 (`pnpm typecheck`)

---

[返回第 10 章](./chapter-10-code.md)
