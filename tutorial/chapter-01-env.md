# 第 1 章：环境准备

> 目标：搭建开发环境，理解为什么要用这些工具
> 预计时间：30 分钟

---

## 一、本章目标

学完本章，你将：
- ✅ 安装 Node.js 和 pnpm
- ✅ 理解包管理器的选择逻辑
- ✅ 创建项目目录并初始化
- ✅ 运行第一个命令验证环境

---

## 二、概念讲解

### 2.1 什么是 Node.js？

**简单理解**：Node.js 让 JavaScript 可以在电脑上运行（不只是浏览器里）。

**为什么要装它**：
- 我们要写 npm 包，npm 是 Node.js 的包管理器
- 构建工具、测试框架都基于 Node.js

### 2.2 什么是 pnpm？为什么不用 npm？

**官方定义**（来自 [pnpm 文档](https://pnpm.io/)）：
> pnpm 是一个快速、节省磁盘空间的 JavaScript 包管理器，提供闪电般的安装速度、workspace 支持和增强的安全特性。

**核心优势**（对比 npm）：

| 特性 | npm | pnpm | 好处 |
|:---|:---|:---|:---|
| 磁盘空间 | 每个项目独立复制 | 全局存储 + 硬链接 | 节省 70%+ 空间 |
| 安装速度 | 较慢 | 快 | 依赖不重复下载 |
| node_modules | 扁平结构（混乱） | 严格结构 | 防止"幽灵依赖" |
| monorepo | 需要 lerna | 原生支持 | 管理多包项目 |

**什么是"幽灵依赖"？**

```javascript
// 用 npm 时可能发生：
// 你安装了 A，A 依赖 B，然后你在代码里直接 import B
// 这居然能跑！但 package.json 里没有 B
// 这就是幽灵依赖——隐式依赖，项目脆弱

// pnpm 会阻止这种情况，强制你显式声明依赖
```

### 2.3 什么是 Corepack？

Node.js 16+ 内置的工具，可以**不用全局安装**就能使用 pnpm：

```bash
# 启用 corepack
corepack enable

# 然后就能直接用 pnpm 命令了
pnpm --version
```

---

## 三、动手实践

### 步骤 1：安装 Node.js

**方式 A：官方安装（推荐新手）**

1. 访问 https://nodejs.org/
2. 下载 LTS 版本（长期支持版）
3. 双击安装，一路下一步

**方式 B：使用 nvm（推荐进阶）**

```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node.js 20
nvm install 20
nvm use 20
```

**验证安装**：
```bash
node --version
# 输出：v20.x.x

npm --version
# 输出：10.x.x
```

### 步骤 2：启用 pnpm

```bash
# 启用 corepack（Node.js 16+ 内置）
corepack enable

# 验证 pnpm 可用
pnpm --version
# 输出：9.x.x 或 10.x.x
```

**如果 corepack 不可用**：
```bash
# 手动安装 pnpm
npm install -g pnpm

# 或者使用 Homebrew (macOS)
brew install pnpm
```

### 步骤 3：创建项目目录

```bash
# 1. 进入你的代码目录（示例）
cd ~/Documents

# 2. 创建项目文件夹
mkdir my-npm-package

# 3. 进入项目
cd my-npm-package

# 4. 用 pnpm 初始化（我们不用 npm init）
pnpm init
```

**执行 `pnpm init` 后会创建 `package.json`**：

```json
{
  "name": "my-npm-package",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

**字段解释**：
- `name`：你的包名（后面要改成唯一的）
- `version`：版本号（语义化版本，后面讲）
- `main`：入口文件（后面要改）
- `scripts`：命令脚本（后面会加很多）

### 步骤 4：验证环境

创建一个测试文件：

```bash
# 创建 src 目录
mkdir src

# 创建第一个代码文件
echo "console.log('Hello, npm package!')" > src/index.js
```

运行它：
```bash
node src/index.js
# 输出：Hello, npm package!
```

---

## 四、原理解析

### 4.1 为什么要全局安装 pnpm？

你可能想："npm 不是自带吗？为什么还要 pnpm？"

**答案**：开发环境用 pnpm，但你的包发布到 npm 后，**用户使用什么安装都可以**：
```bash
# 你的包发布后，用户可以：
npm install your-package
yarn add your-package
pnpm add your-package
```

选择 pnpm 是为了**开发体验更好**，不是为了限制用户。

### 4.2 pnpm 的 node_modules 长什么样？

**npm 的 node_modules**（混乱）：
```
node_modules/
├── lodash/           # 你安装的
├── axios/            # 你安装的
├── debug/            # 你没装，但 axios 依赖了
├── follow-redirects/ # 你没装，但 axios 依赖了
# ... 几百个文件夹
```

**pnpm 的 node_modules**（严格）：
```
node_modules/
├── lodash/ -> ~/.pnpm-store/lodash@4.17.21/node_modules/lodash
├── axios/ -> ~/.pnpm-store/axios@1.6.0/node_modules/axios
# 只有你自己声明的依赖
```

子依赖被**隔离**了，不能直接用，防止幽灵依赖。

---

## 五、常见问题

### Q1：pnpm 和 npm 命令有什么区别？

大部分一样：

| npm 命令 | pnpm 等价 | 作用 |
|:---|:---|:---|
| `npm install` | `pnpm install` | 安装依赖 |
| `npm install lodash` | `pnpm add lodash` | 添加依赖 |
| `npm install --save-dev typescript` | `pnpm add -D typescript` | 添加开发依赖 |
| `npm run build` | `pnpm run build` | 运行脚本 |
| `npm init` | `pnpm init` | 初始化项目 |

**不同的**：
- `pnpm add` 而不是 `pnpm install`（单包）
- `pnpm dlx` 而不是 `npx`（临时执行包）

### Q2：Windows 怎么安装？

推荐用 [fnm](https://github.com/Schniz/fnm)（类似 nvm 的 Windows 版）：
```powershell
# 用 PowerShell 安装 fnm
winget install Schniz.fnm

# 安装 Node.js
fnm use --install-if-missing 20
```

然后 corepack 启用 pnpm 的步骤相同。

### Q3：我要不要用 yarn？

**可以，但本教程用 pnpm**。三者的选择：
- **npm**：最通用，但速度较慢
- **yarn**：Facebook 出品，经典选择
- **pnpm**：2024 年的推荐，性能最好

选哪个不重要，重要的是**选定一个坚持下去**。

---

## 六、验证检查

请确认你已完成以下步骤：

- [ ] `node --version` 显示 v18+ 或 v20+
- [ ] `pnpm --version` 显示 8+
- [ ] 创建了项目目录并用 `pnpm init` 初始化
- [ ] 创建了 `src/index.js` 并能用 `node` 运行

**如果都完成了，继续下一章！**

---

## 七、下一步

[第 2 章：初始化项目](./chapter-02-init.md)

我们将：
- 理解 package.json 的每个字段
- 配置项目的基本信息
- 设置 Git 版本控制

---

## 参考资源

- [pnpm 官方文档](https://pnpm.io/installation)
- [Node.js 下载页](https://nodejs.org/)
- [Corepack 介绍](https://nodejs.org/api/corepack.html)
