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

`.husky/pre-commit`：提交前执行

```bash
pnpm lint-staged
```

### pre-push Hook（可选）

`.husky/pre-push`：推送前执行

```bash
pnpm typecheck && pnpm test
```

## lint-staged 配置

**作用**：只对 staged（已 git add）的文件运行检查，而不是整个项目。

### lint-staged.config.mjs

```javascript
export default {
  // JS/MJS 文件：先 eslint fix，再 prettier
  '*.{js,mjs}': ['eslint --fix', 'prettier --write'],

  // TS 文件：先类型检查，再 eslint，再 prettier
  '*.ts': [() => 'tsc --noEmit', 'eslint --fix', 'prettier --write'],

  // JSON/Markdown：只 prettier
  '*.{json,md}': ['prettier --write'],
}
```

**TS 文件的特殊处理**：

```js
'*.ts': [
  () => 'tsc --noEmit',  // 箭头函数返回命令字符串
  'eslint --fix',
  'prettier --write',
]
```

为什么用 `() => 'tsc --noEmit'`？

- lint-staged 默认会给命令传文件名参数
- tsc 不需要文件名（它自己读 tsconfig.include）
- 用箭头函数返回字符串，lint-staged 就不会追加文件名

## 完整检查流程

```
git add .
   ↓
git commit -m "xxx"
   ↓
├─→ .husky/pre-commit 触发
│     ↓
│   lint-staged 运行
│     ├─ 检查所有 staged .ts 文件
│     ├─ tsc --noEmit（类型检查）
│     ├─ eslint --fix（自动修复问题）
│     └─ prettier --write（格式化）
│     ↓
│   全部通过 → commit 成功
│   任一失败 → commit 中断，需修复后重试
```

## 学到的点

### 跳过 hooks（紧急情况）

```bash
git commit -m "xxx" --no-verify  # 跳过 pre-commit
```

**但不推荐**，除非你知道自己在做什么。

### 配置对比总结

| 文件                | 触发时机     | 执行内容                |
| :------------------ | :----------- | :---------------------- |
| `.husky/pre-commit` | `git commit` | lint-staged（快速检查） |
| `.husky/pre-push`   | `git push`   | 完整检查（类型 + 测试） |

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
