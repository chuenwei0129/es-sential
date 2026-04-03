# CJS/ESM 互操作性测试设计

日期: 2025-04-03
作者: Claude Code

## 背景

项目 es-sential 是一个 TypeScript 工具库，使用 tsup 构建输出双格式：

- ESM: `dist/index.js` + `dist/index.d.ts`
- CJS: `dist/index.cjs` + `dist/index.d.cts`

需要验证打包后的产物在消费者端能正常工作，避免发布后出现 `ERR_PACKAGE_PATH_NOT_EXPORTED` 或运行时错误。

## 目标

建立轻量级、自动化的互操作性测试，集成到本地开发流程，在发布前发现问题。

## 方案选择

### 选用方案：Node.js 子进程执行测试（方案1）

**原因：**

- 最接近真实消费者环境
- 进程隔离能暴露构建产物问题
- 可扩展性良好

**未选方案2（Vitest 动态导入）原因：**

- 与源码测试同进程，可能掩盖真实路径解析差异

**未选方案3（npm pack + 临时目录）：**

- 执行速度慢，流程复杂
- 当前阶段轻量测试已足够

## 测试覆盖范围

| 序号 | 测试项           | 验证内容                                       | 优先级 |
| ---- | ---------------- | ---------------------------------------------- | ------ |
| 1    | ESM 命名导入     | `import { noop } from './dist/index.js'`       | P0     |
| 2    | ESM 全量导入     | `import * as pkg from './dist/index.js'`       | P0     |
| 3    | **ESM 导入 CJS** | `import pkg from './dist/index.cjs'`           | P0     |
| 4    | CJS 解构导入     | `const { noop } = require('./dist/index.cjs')` | P0     |
| 5    | CJS 全量导入     | `const pkg = require('./dist/index.cjs')`      | P0     |
| 6    | 函数行为一致性   | 跨格式相同输入输出一致                         | P1     |

### 设计决策笔记

**Q: 为什么不测试 CJS → ESM？**

CJS 项目通过动态 `import()` 加载 ESM 的场景相对少见，Node.js 中异步导入会引入额外复杂度。当前测试矩阵已覆盖主要消费者场景，此用例**暂不提供**——如后续有明确需求可添加。

## 架构设计

### 文件结构

```
test/
├── interop.test.ts      # 核心测试文件
└── fixtures/
    ├── esm-test.mjs     # ESM 测试脚本
    ├── esm-import-cjs.mjs   # ESM 导入 CJS 测试脚本
    ├── cjs-test.cjs     # CJS 测试脚本
    └── verify-behavior.mjs  # 行为一致性验证脚本
```

使用 `fixtures/` 分离脚本代码，避免测试文件中硬编码复杂命令。

### 运行流程

```
pnpm test:interop
├── 步骤1: 检查 dist/ 是否存在，不存在则执行 pnpm run build
├── 步骤2: 使用 execSync 执行 fixtures/*.mjs/*.cjs
├── 步骤3: 验证输出是否符合预期
└── 失败时: 显示具体命令和返回结果，便于调试
```

### 与现有流程集成

**新增脚本：**

```json
{
  "scripts": {
    "test:interop": "vitest run test/interop.test.ts"
  }
}
```

**可选集成到 check：**

```json
{
  "scripts": {
    "check": "pnpm typecheck && pnpm lint && pnpm test && pnpm test:interop"
  }
}
```

注意：`test:interop` 依赖 `dist/` 目录，执行前需确保已构建。

## 验证矩阵

### ESM 导入 CJS 的要点

```typescript
// ESM 导入 CJS 的方式
import pkg from './dist/index.cjs' // 默认导入（Node.js 自动处理）
// 或
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const pkg = require('./dist/index.cjs') // 使用 createRequire
```

测试中采用**默认导入方式**，因为它最接近消费者实际使用场景。

## 失败诊断

| 错误模式                                | 可能原因                      | 排查方向                 |
| --------------------------------------- | ----------------------------- | ------------------------ |
| `ERR_MODULE_NOT_FOUND`                  | 路径错误或文件不存在          | 检查 dist/ 是否已构建    |
| `ERR_PACKAGE_PATH_NOT_EXPORTED`         | package.json exports 配置问题 | 检查 exports 字段        |
| `TypeError: pkg.noop is not a function` | 导出方式不匹配                | 检查 tsup 配置和导出语法 |
| `undefined` 返回                        | 命名导出/默认导出混淆         | 检查 ESM/CJS 的导出语句  |

## 后续扩展

- 添加子路径导出测试（如 `@c6i/es-sential/array`）
- 添加 TypeScript 类型定义验证（使用 tsc --noEmit）
- 添加 npm pack 场景验证（方案3补充）
