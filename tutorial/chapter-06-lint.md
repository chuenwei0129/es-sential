# 第 6 章：代码规范

> 目标：配置 Biome 替代 ESLint + Prettier，实现一体化代码规范和格式化
> 预计时间：45 分钟

---

## 一、本章目标

学完本章，你将：
- ✅ 理解为什么需要代码规范工具
- ✅ 安装并配置 Biome 一体化工具
- ✅ 理解 Biome 与 ESLint/Prettier 的区别
- ✅ 配置自动检查和格式化脚本

---

## 二、概念讲解

### 2.1 为什么需要代码规范？

**没有规范的代码**：

```typescript
// 文件 A - 使用单引号、无分号、2 空格缩进
const user = {
  name: 'Tom',
  age: 25
}

// 文件 B - 使用双引号、有分号、4 空格缩进
const user = {
    "name": "Tom";
    "age": 25;
};
```

**问题**：
- 代码风格不一致，阅读困难
- 格式化问题争论浪费时间
- 潜在的代码质量问题无法自动发现

### 2.2 Biome 是什么？

**官方定义**：
> Biome 是一个高性能的 Web 项目工具链，提供 JavaScript、TypeScript、JSON、CSS 等语言的快速格式化器和 linter。

**Biome 的核心优势**：

| 特性 | ESLint + Prettier | Biome | 优势 |
|:---|:---|:---|:---|
| 安装依赖 | 10+ 个包 | **1 个包** | 减少 90% |
| 配置文件 | 3+ 个 | **1 个** | 维护简单 |
| 执行速度 | 慢 | **快 10 倍** | Rust 编写 |
| 兼容性 | ESLint 配置复杂 | **零配置起步** | 上手快 |
| 冲突 | 可能冲突 | **一体化设计** | 无冲突 |

### 2.3 Linter vs Formatter

**Formatter（格式化器）**：
- 不关心代码逻辑，只关心代码「外表」
- 自动添加/删除空格、换行、引号
- 保证代码外观一致

```typescript
// 格式化前
function foo(x:number,y:string):void{
if(x>0){
console.log(y)
}
}

// 格式化后
function foo(x: number, y: string): void {
  if (x > 0) {
    console.log(y)
  }
}
```

**Linter（静态分析器）**：
- 检查代码逻辑和质量
- 发现潜在问题和错误
- 强制执行最佳实践

```typescript
// Linter 会报错
var x = 1  // ❌ 使用 let/const 替代 var
console.log(x == 1)  // ❌ 使用 === 替代 ==
```

**Biome 同时提供两者**，解决 ESLint + Prettier 的冲突问题。

### 2.4 Biome 的 VCS 集成

Biome 可以通过 Git 自动识别哪些文件需要检查：

```json
{
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  }
}
```

**作用**：
- Biome 会读取 `.gitignore` 忽略的文件
- 不会检查 `node_modules`、`.git` 等目录
- 与你的工作流程保持一致

---

## 三、动手实践

### 步骤 1：安装 Biome

```bash
# 安装 Biome
pnpm add -D @biomejs/biome

# 验证安装
npx biome --version
# 输出类似：2.4.0
```

### 步骤 2：初始化 Biome 配置

```bash
# 自动生成配置（会询问一些问题）
npx biome init
```

这会创建一个 `biome.json` 配置文件。

### 步骤 3：配置 biome.json

根据现代 npm 包开发的实践，配置以下内容：

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "es5"
    }
  }
}
```

**配置详解**：

| 配置项 | 含义 | 推荐值 |
|:---|:---|:---|
| `vcs.enabled` | 启用版本控制集成 | `true` |
| `vcs.useIgnoreFile` | 使用 `.gitignore` | `true` |
| `formatter.indentStyle` | 缩进风格 | `space` |
| `formatter.indentWidth` | 缩进宽度 | `2` |
| `formatter.lineWidth` | 行宽限制 | `100` |
| `javascript.quoteStyle` | 引号风格 | `single` |
| `javascript.semicolons` | 分号风格 | `asNeeded` |
| `javascript.trailingCommas` | 尾随逗号 | `es5` |

### 步骤 4：配置 package.json 脚本

```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check . --write",
    "format": "biome format . --write"
  }
}
```

**脚本说明**：

```bash
# 检查代码（显示问题但不修改）
pnpm lint

# 检查并自动修复（推荐日常使用）
pnpm lint:fix

# 仅格式化代码
pnpm format
```

### 步骤 5：测试 Biome

创建一个不合规范的测试文件：

```typescript
// src/test-format.ts
var x = 1
const y = 2;
if(x==y){
console.log("equal")
}
```

运行检查：

```bash
pnpm lint
```

**预期输出**：

```
src/test-format.ts:1:1 lint/correctness/noUnusedVariables ━━━━━━━━━
  ✖ This variable is unused.

  > 1 │ var x = 1
      │     ^

src/test-format.ts:1:5 lint/style/noVar ━━━━━━━━━━━━━━━━━━━━━━━━━
  ✖ Use let or const instead of var.

  > 1 │ var x = 1
      │ ^^^

src/test-format.ts:3:5 lint/style/useDoubleEquals ━━━━━━━━━━━━━━━━
  ✖ Use === instead of ==

  > 3 │ if(x==y){
      │     ^^^
```

自动修复：

```bash
pnpm lint:fix

# 修改后的代码：
const x = 1  // var → const
const y = 2  // 删除多余分号
if(x === y){  // == → ===
  console.log("equal")  // 正确缩进
}
```

### 步骤 6：处理特殊情况

**场景 1：某个文件想禁用规则**

```typescript
// biome-ignore lint/correctness/noUnusedVariables: 这是故意留的
const _unused = 'for future use'
```

**场景 2：配置 overrides（测试文件特殊规则）**

```json
{
  "overrides": [
    {
      "include": ["**/*.test.ts", "**/*.spec.ts"],
      "linter": {
        "rules": {
          "suspicious": {
            "noConsole": "off"
          }
        }
      }
    }
  ]
}
```

**场景 3：整个文件禁用所有规则**

```typescript
// biome-ignore-all: 这是生成的代码
const generatedCode = `...`
```

### 步骤 7：进阶配置 - 自定义规则

如果你想要更严格的检查：

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error"
      },
      "suspicious": {
        "noConsole": "warn"
      },
      "style": {
        "useConst": "error",
        "noVar": "error"
      }
    }
  }
}
```

**规则级别**：
- `"error"` - 报错（CI 会失败）
- `"warn"` - 警告（不会导致 CI 失败）
- `"off"` - 关闭

---

## 四、原理解析

### 4.1 Biome 为什么比 ESLint 快？

**ESLint 架构**：
- 基于 JavaScript 运行
- 每个文件需要单独解析
- 插件系统带来额外开销

**Biome 架构**：
- Rust 编写，编译为原生代码
- 并行处理多个文件
- 一体化设计减少 I/O

**实测对比**（中型项目）：

```bash
# ESLint + Prettier
time pnpm eslint . && pnpm prettier --check .
# 约 15-30 秒

# Biome
time pnpm biome check .
# 约 0.5-2 秒
```

### 4.2 为什么推荐 `asNeeded` 分号？

JavaScript 有「自动分号插入（ASI）」机制：

```typescript
// asNeeded: true
const x = 1  // 不需要分号
const y = 2  // 不需要分号

// 但这种情况需要分号
const arr = [1, 2, 3]
;[1, 2].forEach(x => console.log(x))  // 需要前导分号
```

Biome 会自动识别需要分号的地方，你只负责写代码。

### 4.3 `vcs.useIgnoreFile` 的重要性

**问题**：Biome 检查 `node_modules` 会拖慢速度。

**解决**：

```json
{
  "vcs": {
    "useIgnoreFile": true
  }
}
```

这样 Biome 会自动读取 `.gitignore`：

```gitignore
# .gitignore
node_modules/
dist/
*.log
```

**注意**：Biome 2.x 移除了 `files.ignore` 字段，改用 VCS 集成。

---

## 五、常见问题

### Q1：从 ESLint/Prettier 迁移

Biome 提供迁移工具：

```bash
# 从 ESLint 配置迁移
npx @biomejs/biome migrate eslint --write

# 从 Prettier 配置迁移
npx @biomejs/biome migrate prettier --write
```

### Q2：IDE 集成

**VS Code**：
1. 安装 "Biome" 扩展
2. 设置为默认格式化器

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true
}
```

### Q3：CI 中如何使用？

```yaml
# .github/workflows/ci.yml
- name: Lint
  run: |
    pnpm install
    pnpm lint  # 有错误会退出码非 0，导致 CI 失败
```

### Q4：Biome 不支持的 ESLint 规则怎么办？

Biome 目标是替代 ESLint 的大部分使用场景。如果有特殊需求：

1. 检查 Biome 是否已支持（快速发展中）
2. 使用 `--unsafe` 模式启用实验性规则
3. 极少数场景下可以 ESLint + Biome 并存

```bash
# 启用实验性规则
biome check . --unsafe
```

### Q5：`biome.json` 中的 `$schema` 是什么？

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.0/schema.json"
}
```

这是 JSON Schema，作用：
- IDE 提供自动补全
- 验证配置是否正确
- 及时提示配置错误

保持这个地址为最新版本号。

---

## 六、验证检查

请确认你已完成：

- [ ] 安装了 Biome (`pnpm add -D @biomejs/biome`)
- [ ] 创建了 `biome.json` 配置文件
- [ ] 配置了 `vcs.useIgnoreFile: true`
- [ ] 配置了 `format` 和 `linter` 规则
- [ ] 更新了 `package.json` 添加 lint/lint:fix/format 脚本
- [ ] 运行 `pnpm lint` 能看到检查结果
- [ ] 运行 `pnpm lint:fix` 能自动修复问题

**验证命令**：

```bash
# 检查 Biome 版本
npx biome --version

# 检查配置有效性
npx biome check . --verbose

# 查看哪些文件会被检查
npx biome check . --changed  # 只显示 git 变化的文件
```

---

## 七、下一步

[第 7 章：Git Hooks](./chapter-07-git.md)

我们将：
- 配置 husky 在提交前自动检查代码
- 配置 lint-staged 只检查改动的文件
- 实现自动化代码质量保证

---

## 参考资源

- [Biome 官方文档](https://biomejs.dev/)
- [Biome 配置参考](https://biomejs.dev/reference/configuration/)
- [Biome 规则列表](https://biomejs.dev/linter/rules/)
- [迁移指南](https://biomejs.dev/guides/migrate-eslint-prettier/)

