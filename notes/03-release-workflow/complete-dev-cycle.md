# 完整开发-测试-发布流程

本文档记录从添加新功能到发布到 npm 的完整端到端流程。

---

## 流程概览

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   1. 规划    │ → │   2. 开发    │ → │   3. 测试    │ → │   4. 构建    │ → │   5. 发布    │
│  (新功能)    │    │  (TDD模式)   │    │  (验证)     │    │  (打包)     │    │  (npm)      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 示例：添加 `delay` 函数

### Step 1: 创建变更集（记录意图）

```bash
npx changeset
```

选择 `minor`（新功能），输入描述：

```md
---
'@c6i/es-sential': minor
---

新增 delay 函数，支持延迟指定毫秒
```

这会生成 `.changeset/*.md` 文件。

---

### Step 2: 编写测试（Red）

创建 `src/delay.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { delay } from './delay'

describe('delay', () => {
  it('should delay for specified milliseconds', async () => {
    const start = Date.now()
    await delay(100)
    const elapsed = Date.now() - start

    expect(elapsed).toBeGreaterThanOrEqual(100)
  })

  it('should resolve with undefined', async () => {
    const result = await delay(0)
    expect(result).toBeUndefined()
  })
})
```

运行测试（预期失败）：

```bash
pnpm test
# ❌ Test failed: delay is not defined
```

---

### Step 3: 实现功能（Green）

创建 `src/delay.ts`：

```typescript
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

运行测试（通过）：

```bash
pnpm test
# ✓ should delay for specified milliseconds
# ✓ should resolve with undefined
```

---

### Step 4: 重构（Refactor）

检查是否有改进空间：

- 代码简洁 ✅
- 类型完整 ✅
- 边界处理 ✅

如果满意则继续，否则重构。

---

### Step 5: 添加到入口文件

修改 `src/index.ts`：

```typescript
export * from './delay'
// ... 其他导出
```

运行类型检查：

```bash
pnpm typecheck
```

---

### Step 6: 完整检查

```bash
pnpm check
```

这会依次运行：

1. `tsc --noEmit` — 类型检查
2. `prettier --check` — 格式检查
3. `eslint` — 代码规范
4. `vitest run` — 测试

---

### Step 7: 提交代码

```bash
git add .
git commit -m "feat: 新增 delay 函数

- 支持延迟指定毫秒
- 包含完整测试用例
- 类型安全"
```

husky + lint-staged 会在提交前自动检查。

---

### Step 8: 生成版本更新

```bash
npx changeset version
```

这会：

- 更新 `package.json` 版本号
- 生成/更新 `CHANGELOG.md`
- 删除已处理的 `.changeset/*.md`

查看变更：

```bash
git diff
```

---

### Step 9: 提交版本变更

```bash
git add .
git commit -m "chore: version bump"
```

---

### Step 10: 构建并发布

```bash
# 构建
pnpm build

# 发布到 npm
pnpm release
# 或: npx changeset publish
```

或使用手动发布：

```bash
pnpm build
pnpm publish --access public
```

---

### Step 11: 推送代码

```bash
git push origin main
git push --tags
```

---

## 快速命令汇总

| 阶段       | 命令                    | 说明                 |
| :--------- | :---------------------- | :------------------- |
| **开发前** | `npx changeset`         | 记录变更意图         |
| **开发中** | `pnpm test:watch`       | 监听测试             |
| **开发后** | `pnpm check`            | 完整检查             |
| **提交**   | `git commit`            | husky 自动检查       |
| **发版前** | `npx changeset version` | 更新版本和 changelog |
| **发版**   | `pnpm release`          | 构建 + 发布          |

---

## 注意事项

### ✅ 必须做的

1. **每个功能都要有 changeset** — 追踪版本变化
2. **测试先行** — TDD 流程
3. **提交前检查** — lint-staged 会拦截问题
4. **验证构建产物** — 发布后检查 npm 上的文件

### ❌ 避免的

1. **跳过测试** — 哪怕是"简单"的功能
2. **版本混乱** — 先 version 再 publish
3. **重复发布** — 同版本不能反复 publish

---

## 故障排查

| 问题                    | 原因              | 解决                   |
| :---------------------- | :---------------- | :--------------------- |
| `E402 Payment Required` | scoped 包默认私有 | 加 `--access public`   |
| `npm ERR! 403`          | 版本已存在        | 先 `changeset version` |
| 测试通过但 CI 失败      | 环境差异          | 检查 Node 版本         |
| husky 权限错误          | 钩子未初始化      | `pnpm prepare`         |

---

## 完整脚本参考

```bash
#!/bin/bash
# release.sh - 一键发布脚本

set -e

echo "🚀 开始发布流程..."

# 1. 检查
pnpm check

# 2. 提交（如果有变更）
if [[ -n $(git status --porcelain) ]]; then
  git add .
  git commit -m "feat: 准备发布"
fi

# 3. 版本更新
npx changeset version
git add .
git commit -m "chore: version bump"

# 4. 构建
pnpm build

# 5. 发布
pnpm release

# 6. 推送
git push origin main --follow-tags

echo "✅ 发布完成！"
```

---

_下次添加功能时，按照此流程执行即可。_
