# 第 9 章：自动化 CI/CD

> 目标：配置 GitHub Actions 实现自动化测试和发布
> 预计时间：60 分钟

---

## 一、本章目标

学完本章，你将：
- ✅ 理解 CI/CD 的概念和价值
- ✅ 配置 GitHub Actions 工作流
- ✅ 实现 Pull Request 时自动测试
- ✅ 实现合并后自动发布 npm 包

---

## 二、概念讲解

### 2.1 什么是 CI/CD？

**CI（Continuous Integration）持续集成**：
- 代码提交后自动运行测试
- 确保新代码不会破坏现有功能
- 及时发现问题，降低修复成本

**CD（Continuous Deployment）持续部署**：
- 测试通过后自动发布
- 减少人工操作失误
- 加快发布频率

**工作流程**：

```
本地开发
    │
    ▼
推送代码 ────────────▶ 触发 CI（自动测试）
    │                       │
    │                   测试通过？
    │                  ↙        ↘
    │            通过            失败
    │               │               │
    ▼               ▼               ▼
创建 PR      允许合并         阻止合并
    │                           │
    ▼                           ▼
合并到 main ←─────── 修复代码重新推送
    │
    ▼
触发 CD（自动发布）
    │
    ▼
  npm 包更新
```

### 2.2 什么是 GitHub Actions？

**GitHub Actions** 是 GitHub 提供的自动化工作流服务。

**核心概念**：

| 概念 | 含义 | 类比 |
|:---|:---|:---|
| **Workflow** | 工作流，一个完整的自动化流程 | Jenkins Job |
| **Job** | 任务，工作流中的一个执行单元 | Pipeline Stage |
| **Step** | 步骤，任务中的一个执行步骤 | Shell Command |
| **Action** | 预定义的可复用代码块 | Shared Library |
| **Event** | 触发工作流的事件 | Webhook |
| **Runner** | 执行工作流的虚拟机 | Build Agent |

### 2.3 GitHub Actions 文件结构

```yaml
# .github/workflows/ci.yml
name: CI  # 工作流名称

on:       # 触发条件
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:     # 任务定义
  test:   # 任务名称
    runs-on: ubuntu-latest  # 运行环境
    steps:  # 执行步骤
      - uses: actions/checkout@v4  # 检出代码
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm test
```

---

## 三、动手实践

### 步骤 1：创建 GitHub 仓库

如果你还没有推送到 GitHub：

```bash
# 初始化 Git（如果还没做）
git init
git add .
git commit -m "init: 初始化项目"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/yourname/my-npm-package.git
git branch -M main
git push -u origin main
```

### 步骤 2：创建 CI 工作流

创建目录和文件：

```bash
mkdir -p .github/workflows
```

编辑 `.github/workflows/ci.yml`：

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm typecheck

      - name: Test
        run: pnpm test:ci

      - name: Build
        run: pnpm build
```

### 步骤 3：配置文件详解

**触发条件**：

```yaml
on:
  push:
    branches: [main]      # main 分支的 push 触发
  pull_request:
    branches: [main]      # 针对 main 分支的 PR 触发
```

**并发控制**：

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

- 防止多个 workflow 同时运行
- 新的 push 会取消旧的运行

**使用 pnpm**：

```yaml
- uses: pnpm/action-setup@v4
  # 自动读取 package.json 中的 packageManager 字段
```

确保 `package.json` 有：

```json
{
  "packageManager": "pnpm@10.0.0"
}
```

### 步骤 4：创建发布工作流

编辑 `.github/workflows/release.yml`：

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    if: github.repository == 'yourname/my-npm-package'
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version-packages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 步骤 5：配置 NPM Token

发布到 npm 需要认证信息：

1. 登录 npm，创建 Access Token：
   - 访问 https://www.npmjs.com/settings/yourname/tokens
   - 点击 "Generate New Token" → "Classic Token"
   - 选择 "Automation" 类型

2. 在 GitHub 仓库设置中添加 Secret：
   - 进入仓库 → Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: 复制的 npm token

### 步骤 6：配置 GitHub Actions 权限

在仓库设置中开启 Actions 权限：

1. Settings → Actions → General
2. Workflow permissions 选择 "Read and write permissions"
3. 勾选 "Allow GitHub Actions to create and approve pull requests"

### 步骤 7：测试 CI 工作流

创建一个 Pull Request：

```bash
# 创建新分支
git checkout -b test-ci

# 修改代码
echo "// test" >> src/index.ts
git add . && git commit -m "test: ci workflow"

# 推送并创建 PR
git push origin test-ci
```

在 GitHub 上创建 Pull Request，观察：

1. PR 页面显示 "All checks have passed" 或失败信息
2. 点击 "Details" 查看详细的 CI 日志

---

## 四、原理解析

### 4.1 GitHub Actions 的工作原理

```
1. Git 事件触发（push、pull_request）
           │
           ▼
2. GitHub 解析 .github/workflows/*.yml
           │
           ▼
3. 分配 Runner（虚拟机）
           │
           ▼
4. Runner 执行 workflow
   - git clone 代码
   - 按顺序执行 steps
   - 报告结果
           │
           ▼
5. GitHub 显示状态（✅ / ❌）
```

### 4.2 Changeset Action 的工作流程

```
push to main
    │
    ▼
release.yml 触发
    │
    ▼
changesets/action@v1
    │
    ▼
检测是否有未发布的 changeset?
    │
    ├── 有 ──▶ 创建版本升级 PR
    │
    └── 无 ──▶ 检查是否已合并版本 PR?
                 │
                 └── 是 ──▶ 执行 publish
                              │
                              ▼
                          发布到 npm
```

### 4.3 权限配置详解

```yaml
permissions:
  contents: write       # 创建 Release、打 tag
  pull-requests: write  # 创建版本升级 PR
```

**为什么需要这些权限**：
- `contents: write` - Changesets 需要创建 Git tag 和 Release
- `pull-requests: write` - Changesets 需要创建版本升级 PR

---

## 五、常见问题

### Q1：CI 报错 "Cannot find module 'pnpm'"

确保使用 `pnpm/action-setup`：

```yaml
- uses: pnpm/action-setup@v4
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'
```

### Q2：pnpm 版本不匹配

在 `package.json` 中指定：

```json
{
  "packageManager": "pnpm@10.0.0"
}
```

或在 workflow 中指定：

```yaml
- uses: pnpm/action-setup@v4
  with:
    version: 10
```

### Q3：发布报错 "Permission denied"

检查：
1. NPM_TOKEN 已正确设置
2. Token 类型是 "Automation"
3. 包名未被占用（npm 上检查）

**scoped 包首次发布需要 --access public**：

```bash
npm publish --access public
```

### Q4：如何只运行特定 workflow？

使用 `paths` 过滤：

```yaml
on:
  push:
    paths:
      - 'src/**'
      - '.github/workflows/ci.yml'
```

### Q5：CI 太慢怎么办？

优化建议：

```yaml
# 启用缓存
- uses: actions/setup-node@v4
  with:
    cache: 'pnpm'

# 缓存构建输出
- uses: actions/cache@v4
  with:
    path: dist
    key: ${{ runner.os }}-build-${{ hashFiles('src/**') }}
```

---

## 六、完整工作流示例

### 场景 1：简单的测试工作流

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:ci
```

### 场景 2：多版本 Node.js 测试

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

### 场景 3：发布前的额外检查

```yaml
- name: Check package
  run: |
    pnpm exec publint
    pnpm exec attw --pack .
```

---

## 七、验证检查

请确认你已完成：

- [ ] 代码已推送到 GitHub
- [ ] 创建了 `.github/workflows/ci.yml`
- [ ] 创建了 `.github/workflows/release.yml`（可选）
- [ ] 配置了 NVM TOKEN（用于自动发布）
- [ ] 测试了 Pull Request 能触发 CI
- [ ] CI 所有步骤都能通过

**验证命令**：

```bash
# 推送代码触发电流
git push origin main

# 在 GitHub 查看 Actions
# https://github.com/yourname/my-npm-package/actions
```

---

## 八、下一步

[第 10 章：编写功能](./chapter-10-code.md)

我们将：
- 实现更多工具函数
- 应用 TDD 方法开发
- 编写完整的单元测试

---

## 参考资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Changesets Action](https://github.com/changesets/action)
- [pnpm Action](https://github.com/pnpm/action-setup)
- [GitHub Actions 工作流语法](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

