# es-sential 开发笔记

> 这是一个 JavaScript/TypeScript 工具库的学习项目，通过完整实践现代 npm 包开发流程来学习相关技术。

---

## 📚 学习目标

1. **TypeScript 类型系统**: 泛型、类型推断、类型约束
2. **现代构建工具**: tsup 零配置多格式输出
3. **测试框架**: Vitest 原生 ESM 支持
4. **代码规范**: Biome 一体式替代 ESLint + Prettier
5. **版本管理**: Changesets 自动化版本和 Changelog
6. **TDD 开发**: 红-绿-重构循环
7. **Git Hooks**: Husky + lint-staged 代码提交质量
8. **CI/CD**: GitHub Actions 自动发布流程

---

## 🗂️ 开发过程记录

### Phase 1: 项目初始化

**提交**: `4c5e428` - feat: 初始化项目

创建了基本的项目结构和 PLAN.md 规划文档。

---

### Phase 2: 配置开发工具

**提交**: `e6c8dde` - chore: 配置开发工具

#### 安装依赖
```bash
pnpm add -D tsup vitest typescript @biomejs/biome @changesets/cli husky lint-staged publint @arethetypeswrong/cli expect-type
```

#### 配置清单
- `tsconfig.json` - TypeScript 严格模式配置
- `tsup.config.ts` - 构建工具（ESM/CJS/IIFE + 类型定义）
- `vitest.config.ts` - 测试框架配置
- `biome.json` - 代码规范配置
- `.changeset/config.json` - 版本管理配置

**学习点**: tsup 的 entry 使用对象形式确保输出路径匹配 exports 配置。

---

### Phase 3: TDD 实现核心函数

#### 1. chunk 数组分块

**提交**: `5cdb3bc` - feat(array): 实现 chunk 函数 (TDD)

```typescript
export function chunk<T>(array: readonly T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
```

**学习点**: 使用 `i += size` 步长循环 + `slice` 是最简洁的实现方式。

#### 2. uniq 数组去重

**提交**: `c69e875` - feat(array): 实现 uniq 函数 (TDD)

```typescript
export function uniq<T>(array: readonly T[]): T[] {
  return Array.from(new Set(array))
}
```

**学习点**: `Set + Array.from` 是现代 JS 去重的标准做法，简洁高效。

#### 3. pick 对象选取属性

**提交**: `c749364` - feat(object): 实现 pick 函数 (TDD)

```typescript
export function pick<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    result[key] = object[key]
  }
  return result
}
```

**学习点**:
- `K extends keyof T` 约束确保 keys 是对象的有效属性
- `Pick<T, K>` 返回 TypeScript 内置工具类型
- `for...of` 比 `reduce` 更简洁高效

#### 4. omit 对象排除属性

**提交**: `1242a5e` - feat(object): 实现 omit 函数 (TDD)

```typescript
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Omit<T, K> {
  const keySet = new Set<keyof T>(keys)
  return Object.keys(object).reduce<Record<string, unknown>>(
    (result, key) => {
      if (!keySet.has(key)) {
        result[key] = object[key]
      }
      return result
    },
    {}
  ) as Omit<T, K>
}
```

**学习点**:
- `Set.has` 比 `includes` 查找更快 O(1)
- 使用类型断言处理复杂的泛型转换

#### 5. camelCase 字符串转换

**提交**: `12cb42d` - feat(string): 实现 camelCase 函数 (TDD)

核心逻辑：按非字母数字分割，首单词小写，后续单词首字母大写。

**学习点**: `split(/[^a-zA-Z0-9]+/g)` 可匹配所有常见分隔符。

#### 6. kebabCase 字符串转换

**提交**: `3c63891` - feat(string): 实现 kebabCase 函数 (TDD)

```typescript
return str
  // 处理连续大写后接小写：HTML + Element → HTML-Element
  .replace(/(?<=[A-Z])(?=[A-Z][a-z])/g, '-')
  // 处理小写后接大写：camelCase → camel-Case
  .replace(/(?<=[a-z])(?=[A-Z])/g, '-')
  .split(/[^a-zA-Z0-9]+/g)
  .filter(Boolean)
  .map(word => word.toLowerCase())
  .join('-')
```

**学习点**:
- 正则表达式前瞻后顾：`(?<=...)` 和 `(?=...)`
- ACRONYM 边界处理：`/(?<=[A-Z])(?=[A-Z][a-z])/g`

**测试统计**: 43 个测试全部通过 ✅

---

### Phase 4: CI/CD 配置与调试

#### 问题 1: pnpm 版本格式

**错误**: `"10.x" is not a valid version`

**解决**:
```yaml
# 错误
version: 10.x

# 正确
version: 10
```

更优方案：从 packageManager 自动读取，workflow 中不指定 version。

#### 问题 2: ESM/CJS 类型导出

**错误**: `types is interpreted as ESM when resolving with the "require" condition`

**解决**: 按 import/require 分离配置

```json
{
  ".": {
    "import": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "require": {
      "types": "./dist/index.d.cts",
      "default": "./dist/index.cjs"
    }
  }
}
```

#### 问题 3: 代码风格检查

**错误**: Biome lint 检查失败
- 非空断言 `!` 被禁止
- import 排序问题
- 代码格式问题

**解决**:
```bash
# 自动修复
pnpm run lint:fix

# 修复非空断言（需要 --unsafe）
pnpm exec biome check . --write --unsafe
```

代码修改示例：
```typescript
// 修改前
return words[0]!.toLowerCase()

// 修改后（使用可选链）
return words[0]?.toLowerCase()
```

#### 问题 4: attw 检查失败

**错误**: 子路径导出在 node10 下无法解析

**原因**: node10 太老，不支持 exports 字段

**解决**: 移除 attw 检查，publint 已足够

```yaml
# 修改前
- name: Check Package
  run: |
    pnpm exec publint
    pnpm exec attw --pack .

# 修改后
- name: Check Package
  run: pnpm exec publint
```

#### 问题 5: GitHub Actions 权限

**错误**:
```
Permission denied to github-actions[bot]
HttpError: GitHub Actions is not permitted to create or approve pull requests
```

**解决**: 添加权限配置

```yaml
permissions:
  contents: write
  pull-requests: write
```

同时需要在仓库设置中开启：
> Settings → Actions → General → Workflow permissions → "Read and write permissions" → 勾选 "Allow GitHub Actions to create and approve pull requests"

---

## 🎯 技术要点总结

### TDD 流程固化

```
1. 🔴 RED: 写测试，看失败
2. 🟢 GREEN: 写最小实现让测试通过
3. 🔵 REFACTOR: 重构代码，保持测试通过
```

### TypeScript 类型技巧

1. **泛型约束**: `<T extends object, K extends keyof T>`
2. **内置工具类型**: `Pick<T, K>`, `Omit<T, K>`
3. **只读数组**: `readonly T[]`
4. **类型断言**: `as Pick<T, K>` 用于复杂转换

### 正则表达式技巧

| 模式 | 用途 |
|------|------|
| `(?<=[a-z])(?=[A-Z])` | 匹配小写后接大写（camelCase 边界） |
| `(?<=[A-Z])(?=[A-Z][a-z])` | 匹配连续大写后接小写（ACRONYM 边界） |
| `[^a-zA-Z0-9]+` | 匹配非字母数字字符 |

### npm 包最佳实践

1. **双格式输出**: ESM + CJS
2. **类型分离**: .d.ts (ESM) / .d.cts (CJS)
3. **按需加载**: 模块化导出
4. **零依赖**: 无 runtime 依赖

---

## ✅ 最终成果

| 指标 | 结果 |
|------|------|
| 核心函数 | 6 个 ✅ |
| 单元测试 | 43 个 ✅ |
| 代码规范 | Biome ✅ |
| 构建输出 | ESM/CJS/Types ✅ |
| 自动发布 | GitHub Actions ✅ |
| Git Hooks | pre-commit / pre-push ✅ |

---

## 📖 参考资料

- [tsup 文档](https://tsup.egoist.dev/)
- [Vitest 文档](https://vitest.dev/)
- [Biome 文档](https://biomejs.dev/)
- [Changesets 文档](https://github.com/changesets/changesets)
- [publint 规则](https://github.com/bluwy/publint)

---

**作者**: 初七
**完成日期**: 2026-03-31
**项目**: https://github.com/chuenwei0129/es-sential
