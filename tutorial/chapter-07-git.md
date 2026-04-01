# 第 7 章：Git Hooks

> 目标：配置 husky 在提交前自动检查代码，lint-staged 只检查改动的文件
> 预计时间：45 分钟

---

## 一、本章目标

学完本章，你将：
- ✅ 理解 Git Hooks 的作用和原理
- ✅ 配置 husky 管理 Git Hooks
- ✅ 配置 lint-staged 只对改动文件进行检查
- ✅ 建立提交前代码质量保证流程

---

## 二、概念讲解

### 2.1 什么是 Git Hooks？

**Git Hooks** 是 Git 在特定事件发生时自动执行的脚本。

**常见 Hooks**：

| Hook | 触发时机 | 用途 |
|:---|:---|:---|
| `pre-commit` | 执行 `git commit` 之前 | 检查代码格式、lint |
| `prepare-commit-msg` | 打开编辑器前 | 自动生成 commit message 模板 |
| `commit-msg` | 提交信息编辑完成后 | 验证 commit message 格式 |
| `post-commit` | 提交完成后 | 发送通知、更新日志 |
| `pre-push` | 执行 `git push` 之前 | 运行测试、检查构建 |

**工作原理**：

```
git commit -m "fix bug"
    ↓
触发 pre-commit hook
    ↓
检查通过？
  ↓ 是          ↓ 否
继续提交      阻止提交
```

### 2.2 为什么需要 Husky？

**原生 Git Hooks 的问题**：

1. 存储在 `.git/hooks/` 目录下
2. 不会被 Git 跟踪（`.git` 目录不提交）
3. 团队成员无法共享 hooks 配置

**Husky 的解决方式**：

```
项目目录
├── .husky/           ← Husky 管理的 hooks（可提交到 Git）
│   ├── pre-commit    ← 代码检查
│   └── pre-push      ← 运行测试
├── .git/hooks/       ← 原生 hooks（Husky 自动链接）
└── package.json
```

**Husky 的工作流程**：

```
1. husky 安装时设置 git config core.hooksPath = ".husky/_"
2. .husky/_ 链接到 .husky/pre-commit 等脚本
3. Git 触发 hook → 执行 .husky/pre-commit → 运行你的命令
```

### 2.3 什么是 lint-staged？

**问题**：`pre-commit` 运行 `pnpm lint` 会检查整个项目，很慢！

**解决**：lint-staged 只检查**本次提交涉及的文件**。

```bash
# 你修改了 src/utils.ts
git add src/utils.ts
git commit -m "update utils"

# lint-staged 只检查 src/utils.ts，而不是整个项目！
```

**对比**：

| 方式 | 检查范围 | 耗时 |
|:---|:---|:---|
| pnpm lint | 所有文件 | 10-30 秒 |
| lint-staged | 仅改动的文件 | 1-3 秒 |

---

## 三、动手实践

### 步骤 1：安装 husky

```bash
# 安装 husky
pnpm add -D husky

# 初始化（创建 .husky 目录）
npx husky init
```

**初始化后会**：
1. 创建 `.husky/` 目录
2. 创建 `.husky/pre-commit` 文件
3. 在 `package.json` 添加 `"prepare": "husky"`

### 步骤 2：配置 pre-commit Hook

查看默认创建的 `.husky/pre-commit`：

```bash
cat .husky/pre-commit
# 默认内容是：npm test
```

修改为运行 lint：

```bash
# 方法 1：直接编辑文件
echo "pnpm lint" > .husky/pre-commit

# 方法 2：使用 husky CLI
npx husky add .husky/pre-commit "pnpm lint"
```

现在的 `.husky/pre-commit`：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint
```

### 步骤 3：测试 pre-commit

故意写一段不合规范的代码：

```typescript
// src/bad-code.ts
var x=1
if(x == 1){
console.log("ok")
}
```

提交测试：

```bash
git add src/bad-code.ts
git commit -m "test bad code"

# 报错！Biome 检查失败，提交被阻止
```

修复后再提交：

```bash
# 自动修复
pnpm lint:fix

git add src/bad-code.ts
git commit -m "fix code style"

# 通过！提交成功
```

### 步骤 4：安装 lint-staged

```bash
# 安装 lint-staged
pnpm add -D lint-staged
```

### 步骤 5：配置 lint-staged

在 `package.json` 中添加配置：

```json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": [
      "biome check --write --unsafe --no-errors-on-unmatched",
      "git add"
    ]
  }
}
```

**也可以**在 `.lintstagedrc.json` 中配置：

```json
{
  "*.{js,ts,jsx,tsx}": [
    "biome check --write --unsafe --no-errors-on-unmatched"
  ]
}
```

**配置说明**：

| 参数 | 作用 |
|:---|:---|
| `--write` | 自动修复问题 |
| `--unsafe` | 启用不安全的自动修复 |
| `--no-errors-on-unmatched` | 没有匹配文件时不报错 |
| `*.{js,ts,jsx,tsx}` | 只检查这些类型的文件 |

### 步骤 6：更新 pre-commit 使用 lint-staged

修改 `.husky/pre-commit`：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

现在 `pre-commit` 只检查本次提交的文件。

### 步骤 7：配置 pre-push Hook

创建 `pre-push` 钩子，在推送前运行测试：

```bash
echo "pnpm test:ci" > .husky/pre-push
```

`.husky/pre-push`：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm test:ci
```

**为什么需要 pre-push？**

```bash
# 你可能多次本地提交都没有问题
git commit -m "commit 1"  # 通过 lint
git commit -m "commit 2"  # 通过 lint

# 但推送前需要确保所有测试通过
git push origin main
# 触发 pre-push → 运行 pnpm test:ci
```

### 步骤 8：完整流程测试

创建一个完整的工作流：

```bash
# 1. 修改代码
echo "const x = 1" > src/test.ts

# 2. 添加到暂存区
git add src/test.ts

# 3. 尝试提交（触发 pre-commit）
git commit -m "add test file"

# 预期输出：
# ✔️ lint-staged: 只检查 src/test.ts
# ✔️ biome 自动格式化
# ✔️ 提交成功

# 4. 推送（触发 pre-push）
git push origin main

# 预期输出：
# ✔️ 运行所有测试
# ✔️ 推送成功
```

---

## 四、原理解析

### 4.1 husky v9 的新架构

**husky v8（旧版）**：
```
.husky/
├── _/
│   └── husky.sh    # 辅助脚本
└── pre-commit      # hook 脚本
```

**husky v9（新版，推荐）**：
```
.husky/
├── _/
│   └── ...         # Husky 内部文件
├── pre-commit      # 你的 hook
└── pre-push        # 你的 hook
```

**简化**：v9 移除了 `.husky/_/husky.sh`，直接运行命令。

### 4.2 `prepare` 脚本的作用

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

**触发时机**：
- `pnpm install` 后自动运行
- 确保新克隆的项目自动安装 hooks

**如果不配置 prepare**：
- 新成员 clone 项目后没有 hooks
- 需要手动运行 `npx husky install`

### 4.3 lint-staged 的工作原理

```bash
git commit -m "message"
    ↓
触发 pre-commit
    ↓
lint-staged 执行
    ↓
1. 获取 git staged 的文件列表
2. 匹配配置中的正则
3. 对每个文件运行指定命令
    ↓
所有命令成功 → 提交继续
任一命令失败 → 提交中止
```

**示例**：

```json
{
  "lint-staged": {
    "*.{js,ts}": ["biome check --write"],
    "*.md": ["prettier --write"]
  }
}
```

- 修改 `.ts` 文件 → 运行 Biome
- 修改 `.md` 文件 → 运行 Prettier
- 同时修改 → 分别运行对应的工具

---

## 五、常见问题

### Q1：跳过 hooks 提交（紧急情况下）

```bash
# 使用 --no-verify 跳过所有 hooks
git commit -m "emergency fix" --no-verify

# 注意：这是紧急逃生通道，平时不要用！
```

### Q2：Windows 上 hooks 不执行

检查文件换行符：

```bash
# 确保 hooks 使用 LF 换行符
git config core.autocrlf false

# 或者在 .gitattributes 中设置
* text=auto eol=lf
```

### Q3：lint-staged 失败但不知道原因

添加调试模式：

```bash
# 调试模式
DEBUG=lint-staged git commit -m "test"
```

### Q4：husky 命令找不到

如果使用 pnpm，确保使用完整路径：

```bash
# ❌ 可能找不到
biome check .

# ✅ 完整路径
./node_modules/.bin/biome check .
# 或
npx biome check .
# 或
pnpm biome check .
```

### Q5：如何禁用某些文件的检查？

```json
{
  "lint-staged": {
    "*.{js,ts}": [
      "biome check --write --no-errors-on-unmatched"
    ]
  }
}
```

Biome 会读取 `.gitignore` 和 `biome.json` 的 ignore 配置。

---

## 六、验证检查

请确认你已完成：

- [ ] 安装了 husky (`pnpm add -D husky`)
- [ ] 运行了 `npx husky init` 初始化
- [ ] 创建了 `.husky/pre-commit` 钩子
- [ ] 安装了 lint-staged (`pnpm add -D lint-staged`)
- [ ] 配置了 `lint-staged`（package.json 或 .lintstagedrc.json）
- [ ] 更新了 pre-commit 使用 `npx lint-staged`
- [ ] 创建了 `.husky/pre-push` 钩子运行测试
- [ ] 测试提交代码时能触发自动检查和格式化

**验证命令**：

```bash
# 检查 husky 是否配置
ls -la .husky/

# 检查 Git hooks 路径
git config core.hooksPath
# 输出：.husky/_

# 测试 pre-commit（故意写错格式）
echo "var x=1" > test.ts
git add test.ts
git commit -m "test"  # 应该被阻止

# 清理测试文件
rm test.ts
git reset HEAD test.ts
```

---

## 七、下一步

[第 8 章：版本管理](./chapter-08-version.md)

我们将：
- 理解语义化版本规范
- 配置 Changesets 自动化版本管理
- 学习如何发布 npm 包

---

## 参考资源

- [Husky 官方文档](https://typicode.github.io/husky/)
- [lint-staged 文档](https://github.com/okonet/lint-staged)
- [Git Hooks 文档](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Git 提交规范](https://www.conventionalcommits.org/)

