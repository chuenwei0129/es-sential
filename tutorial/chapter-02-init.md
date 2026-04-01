# 第 2 章：初始化项目

> 目标：配置 package.json，理解每个字段的作用，建立项目骨架
> 预计时间：45 分钟

---

## 一、本章目标

学完本章，你将：
- ✅ 理解 package.json 的核心字段
- ✅ 配置一个现代 npm 包的 package.json
- ✅ 初始化 Git 仓库
- ✅ 编写第一个 TypeScript 函数

---

## 二、概念讲解

### 2.1 package.json 是什么？

**官方定义**（来自 [npm 文档](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)）：
> package.json 是项目的清单文件，包含元数据（名称、版本、作者）和配置（脚本、依赖）。

**简单理解**：它是项目的"身份证"和"说明书"。

### 2.2 包名（name）的规则

**官方命名规范**：
- 只能包含小写字母、数字、连字符（`-`）、下划线（`_`）
- 不能以点（`.`）或下划线（`_`）开头
- 不能超过 214 个字符
- 不能包含大写字母

**命名建议**：
- 作用型：`lodash`（实用工具）、`vue`（框架）
- 功能型：`chalk`（终端着色）、`axios`（HTTP 请求）
- 双关型：`express`（表达/快递）、`es-sential`（essential + ES）

**scoped 包**（推荐）：
```json
{
  "name": "@yourname/package-name"
}
```
- `@yourname` 是你的 npm 用户名或组织名
- 避免名称冲突
- 看起来专业

### 2.3 版本号（version）：语义化版本

格式：`MAJOR.MINOR.PATCH`

| 位置 | 含义 | 什么时候加 |
|:---|:---|:---|
| MAJOR | 主版本 | 不兼容的 API 变更 |
| MINOR | 次版本 | 向后兼容的功能新增 |
| PATCH | 补丁版本 | 向后兼容的问题修复 |

**示例**：
- `1.0.0` → `1.0.1`：修了个 bug
- `1.0.1` → `1.1.0`：加了新功能
- `1.1.0` → `2.0.0`： Breaking Change，旧代码可能跑不了

**初始版本为什么是 `0.1.0` 而不是 `1.0.0`？**

> 0.x.x 表示"还在开发中，API 可能大变"。等你觉得稳定了，再发布 1.0.0。

### 2.4 type: "module" 是什么意思？

JavaScript 有两种模块系统：

**CommonJS (CJS)** - 老标准：
```javascript
const lodash = require('lodash')
module.exports = { foo }
```

**ES Modules (ESM)** - 新标准：
```javascript
import lodash from 'lodash'
export { foo }
```

**type: "module" 的作用**：
告诉 Node.js："我的项目默认用 ESM，`.js` 文件当作 ES Module 处理"。

如果不加：
```javascript
// 报错！require is not defined in ES module scope
import { foo } from './foo.js'
```

### 2.5 files 字段：控制发布内容

**默认行为**：发布整个项目（除了 `.gitignore` 里的）

**问题**：
- 源码、测试、配置文件全发上去
- 安装包的人下载了一堆没用的东西

**最佳实践**：
```json
{
  "files": ["dist"]
}
```
- 只发布 `dist` 目录（构建产物）
- 源码留在 GitHub，不发布到 npm

**对比**：
```
你的项目（GitHub）
├── src/          # 源码 ✅
├── dist/         # 构建产物 ✅
├── tests/        # 测试 ✅
├── docs/         # 文档 ✅
└── package.json  # 配置 ✅

发布的包（npm）
├── dist/         # 只有构建产物
├── package.json  # 配置
└── README.md     # 文档
```

---

## 三、动手实践

### 步骤 1：完善 package.json

编辑 `package.json`，改成这样：

```json
{
  "name": "@yourname/my-first-package",
  "version": "0.1.0",
  "description": "我的第一个 npm 包，学习现代前端工程化",
  "type": "module",
  "sideEffects": false,
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./array": {
      "import": {
        "types": "./dist/array/index.d.ts",
        "default": "./dist/array/index.js"
      },
      "require": {
        "types": "./dist/array/index.d.cts",
        "default": "./dist/array/index.cjs"
      }
    },
    "./object": {
      "import": {
        "types": "./dist/object/index.d.ts",
        "default": "./dist/object/index.js"
      },
      "require": {
        "types": "./dist/object/index.d.cts",
        "default": "./dist/object/index.cjs"
      }
    },
    "./string": {
      "import": {
        "types": "./dist/string/index.d.ts",
        "default": "./dist/string/index.js"
      },
      "require": {
        "types": "./dist/string/index.d.cts",
        "default": "./dist/string/index.cjs"
      }
    },
    "./package.json": "./package.json"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["utils", "typescript"],
  "author": "你的名字 <your.email@example.com>",
  "license": "MIT",
  "engines": {
    "node": ">=18"
  }
}
```

**字段解释**：

| 字段 | 作用 | 注意点 |
|:---|:---|:---|
| `name` | 包的唯一标识 | 把 `@yourname` 换成你的 npm 用户名 |
| `version` | 语义化版本 | 从 `0.1.0` 开始 |
| `type` | 模块类型 | `"module"` 启用 ESM |
| `sideEffects` | **标记是否有副作用** | **必须 `false`**，否则 tree-shaking 失效 |
| `main` | CJS 入口 | 传统 Node.js 用 |
| `module` | ESM 入口 | 现代打包工具用 |
| `types` | 类型声明入口 | TypeScript 用 |
| `files` | 发布内容 | 只发 `dist`，节省空间 |
| `exports` | 条件导出 | 支持主入口和子路径导入 |
| `engines` | Node 版本要求 | `>=18` 表示 Node 18 以上 |

> **⚠️ `sideEffects: false` 是 tree-shaking 的关键**
>
> ```typescript
> // 用户只导入 chunk
> import { chunk } from 'your-package'
>
> // sideEffects: false → 只打包 chunk 代码
> // 无 sideEffects → 可能打包整个库
> ```

### 步骤 1b：理解子路径导出

上面的 exports 配置了多个入口：

```typescript
// 主入口 - 全量导入
import { chunk, camelCase } from 'your-package'

// 子路径 - 按需导入（推荐）
import { chunk } from 'your-package/array'
import { camelCase } from 'your-package/string'
```

**为什么需要子路径？**
- 只导入需要的模块，减小打包体积
- 这是现代工具库的标准做法 (lodash-es、ramda)

### 步骤 2：创建项目结构

```bash
# 创建目录
mkdir -p src

# 创建空文件（占位）
touch src/index.ts
```

项目结构：
```
my-npm-package/
├── src/
│   └── index.ts      # 源码入口
├── package.json      # 项目配置
└── .gitignore        # Git 忽略规则（下一步创建）
```

### 步骤 3：创建 .gitignore

```bash
# 创建 .gitignore 文件
cat > .gitignore << 'EOF'
# 依赖目录
node_modules/

# 构建产物
dist/

# 日志
*.log

# 编辑器
.vscode/
.idea/
*.swp

# 操作系统
.DS_Store
Thumbs.db

# 测试覆盖率
coverage/

# 本地环境变量
.env
.env.local
EOF
```

**为什么要忽略 `node_modules`？**
- 依赖可以通过 `pnpm install` 重新生成
- 文件太多，Git 仓库会爆炸
- 不同电脑的依赖版本可能不同

**为什么要忽略 `dist`？**
- dist 是构建产物，不是源码
- 每构建一次就会变化
- 发布到 npm 时再生成，不需要进 Git

### 步骤 4：初始化 Git

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "init: 初始化项目"
```

**验证**：
```bash
git log
# 输出：commit xxx - init: 初始化项目
```

### 步骤 5：写第一个 TypeScript 函数

安装 TypeScript：
```bash
pnpm add -D typescript
```

创建 `src/index.ts`：
```typescript
/**
 * 简单的加法函数
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之和
 */
export function add(a: number, b: number): number {
  return a + b
}
```

**验证 TypeScript 编译**：
```bash
# 创建 tsconfig.json（简单配置）
echo '{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true
  }
}' > tsconfig.json

# 编译
npx tsc --noEmit
```

如果没有报错，说明类型正确！

---

## 四、原理解析

### 4.1 exports 字段为什么这么复杂？

**问题背景**：
- ESM 用户用 `import` → 需要 `.js` 文件
- CJS 用户用 `require` → 需要 `.cjs` 文件
- TypeScript 用户 → 需要 `.d.ts` 文件

**exports 让所有人满意**：
```json
{
  "exports": {
    ".": {
      "import": {           // ESM 用户走这里
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {          // CJS 用户走这里
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  }
}
```

Node.js 会根据用户的导入方式**自动选择**正确的入口。

### 4.2 为什么需要 d.cts 类型文件？

TypeScript 4.7 之后，CJS 和 ESM 的类型声明需要区分：
- `.d.ts` → ESM 类型
- `.d.cts` → CJS 类型

这样能避免 "类型的模块系统不匹配" 的错误。

---

## 五、常见问题

### Q1：package.json 能写注释吗？

**不能**。JSON 格式不支持注释：
```json
{
  // 这是错误的！JSON 不支持注释
  "name": "my-package"
}
```

但你可以：
1. 用额外的字段存注释：`"_comment": "这是版本号"`
2. 单独写 `package.md` 文件解释

### Q2：engines.node 有什么用？

安装时会检查 Node 版本：
```bash
pnpm install
# 如果你的 Node 是 16，会警告：
# Engine "node" is incompatible with >=18
```

### Q3：我可以不发 dist，发 src 吗？

**可以但不推荐**：
- 用户需要下载源码自己编译
- 安装时间变长
- 编译失败的风险转嫁给用户

现代 npm 包的标准做法是发构建产物。

### Q4：scoped 包 (@xxx/xxx) 有什么好处？

1. **名字不会冲突**：`lodash` 被占了，但 `@yourname/lodash` 可以
2. **组织感强**：一看就是某人/某公司的包
3. **权限管理**：可以用 npm 团队管理权限

**怎么创建 scoped 包**：
1. 注册 npm 账号
2. 免费用户可以创建 public scoped 包
3. 发布时加 `--access public`

---

## 六、验证检查

请确认你已完成：

- [ ] package.json 填写完整，包含所有关键字段
- [ ] 创建了 `src/` 目录和 `src/index.ts`
- [ ] 创建了 `.gitignore` 并忽略了 `node_modules` 和 `dist`
- [ ] 初始化了 Git 仓库并提交了第一次 commit
- [ ] TypeScript 编译无错误

**验证命令**：
```bash
# 检查 package.json 格式
node -e "console.log(JSON.parse(require('fs').readFileSync('package.json')))"

# 检查 Git 状态
git status
# 应该是 "nothing to commit, working tree clean"
```

---

## 七、下一步

[第 3 章：TypeScript 配置](./chapter-03-ts.md)

我们将：
- 深入 tsconfig.json 的每个选项
- 理解严格模式的意义
- 配置类型声明生成

---

## 参考资源

- [npm package.json 官方文档](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [Node.js ESM 文档](https://nodejs.org/api/esm.html)
