# 06 - Git Hooks (husky + lint-staged)

## 为什么要用 Git Hooks？

**问题**：代码提交到仓库前，怎么确保：

- ✅ 没有类型错误
- ✅ 代码格式正确
- ✅ 测试能通过

**解决方案**：Git Hooks —— 在 git 操作的特定时机执行脚本。

## husky 配置

### 安装与启用

```bash
pnpm add -D husky
npx husky init  # 创建 .husky/ 目录和配置
```

### pre-commit Hook

`.husky/pre-commit`：提交前自动修复格式

```bash
#!/bin/sh
set -e

echo "🎨 pre-commit: 代码格式化和规范检查..."

npx lint-staged

echo "✅ pre-commit 通过"
```

### commit-msg Hook

`.husky/commit-msg`：检查提交信息格式

```bash
#!/bin/sh
# 验证 Conventional Commits 格式
# 如: feat: 新增功能, fix: 修复问题
```

### pre-push Hook

`.husky/pre-push`：推送前类型检查和测试

```bash
#!/bin/sh
set -e

echo "🔍 pre-push: 类型检查 + 测试..."

pnpm typecheck && pnpm test

echo "✅ pre-push 通过"
```

## lint-staged 配置

**作用**：只对 staged（已 git add）的文件运行检查，而不是整个项目。

### lint-staged.config.mjs

```javascript
export default {
  // JS/TS 文件：ESLint 自动修复 + Prettier 格式化
  '*.{js,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // 其他文件：Prettier 格式化
  '*.{json,md,yml,yaml,css,html}': 'prettier --write',
}
```

**注意**：TypeScript 类型检查（`tsc --noEmit`）**不放在 lint-staged**，因为：

- 类型检查需要全项目上下文
- lint-staged 是单文件处理
- 放 `pre-push` 中更合适

## 完整检查流程

```
git add .
   ↓
git commit -m "xxx"
   ↓
├─→ .husky/pre-commit 触发
│     ↓
│   lint-staged 运行
│     ├─ 检查所有 staged 文件
│     ├─ eslint --fix（自动修复问题）
│     └─ prettier --write（格式化）
│     ↓
│   全部通过 → commit 成功
│   任一失败 → commit 中断，需修复后重试
   ↓
git push
   ↓
└─→ .husky/pre-push 触发
      ↓
    pnpm typecheck && pnpm test
      ↓
    通过 → push 成功
```

## 学到的点

### 跳过 hooks（紧急情况）

```bash
git commit -m "xxx" --no-verify  # 跳过 pre-commit
```

**但不推荐**，除非你知道自己在做什么。

### 配置对比总结

| 文件                | 触发时机     | 执行内容              |
| :------------------ | :----------- | :-------------------- |
| `.husky/pre-commit` | `git commit` | lint-staged（格式化） |
| `.husky/commit-msg` | `git commit` | 提交信息格式检查      |
| `.husky/pre-push`   | `git push`   | 类型检查 + 测试       |

为什么分开？

- `pre-commit` 要快（秒级），否则影响commit体验
- `pre-push` 可以慢一点，因为 push 频率低

### 手动运行检查

```bash
# 和 hooks 相同的检查
pnpm check          # typecheck + format + lint + test
```

## 脚手架完成！

现在你已经有了一个现代 npm 包的完整基础：

✅ pnpm 包管理  
✅ TypeScript 类型系统  
✅ tsup 构建（ESM + CJS）  
✅ Vitest 测试 + TDD  
✅ ESLint + Prettier 代码规范  
✅ husky + lint-staged 提交检查

## 下一步

开始用 TDD 开发函数 → [../02-tdd-workflow/red-green-refactor.md](../02-tdd-workflow/red-green-refactor.md)
