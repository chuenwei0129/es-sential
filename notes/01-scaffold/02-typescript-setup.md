# 02 - TypeScript 配置

## tsconfig.json 逐行解析

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],

    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true,

    "strict": true,
    "noUnusedLocals": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 关键配置解读

### 目标与模块

| 配置                          | 选择         | 理由                              |
| :---------------------------- | :----------- | :-------------------------------- |
| `target: "ES2022"`            | ES2022       | 现代 Node.js 版本都支持           |
| `module: "ES2022"`            | ESM          | 标准模块系统，支持 tree-shaking   |
| `moduleResolution: "bundler"` | bundler 模式 | 支持 `import './file'` 不带扩展名 |

### 输出配置

| 配置                 | 作用                      |
| :------------------- | :------------------------ |
| `declaration: true`  | 生成 `.d.ts` 类型声明文件 |
| `sourceMap: true`    | 生成 source map，调试时用 |
| `outDir` / `rootDir` | 输入输出目录隔离          |

### 严格模式

```json
"strict": true  // 开启所有严格类型检查
```

包含的子选项：

- `noImplicitAny` — 禁止隐式 any
- `strictNullChecks` — 严格的 null 检查
- `strictFunctionTypes` — 函数参数双向协变检查
- 等等...

**建议**：库项目一定要开 strict，能暴露更多潜在问题。

## 学到的点

### 1. SourceMap 是什么？

```
构建前：src/index.ts     ← 你写的代码
           ↓ 编译
构建后：dist/index.js     ← 运行的代码
       dist/index.js.map ← SourceMap（行号映射表）
```

调试时，浏览器/IDE 用 source map 把 dist 代码的报错映射回 src 的位置。

### 2. "moduleResolution": "bundler"

新增于 TS 4.7，专门适配现代构建工具：

```ts
// 可以使用这些写法
import { foo } from './utils' // ✅ 不带扩展名
import { bar } from './utils.js' // ✅ 带 .js（实际指向 .ts）
```

### 3. include / exclude

```json
{
  "include": ["src/**/*"], // 只编译 src 目录
  "exclude": ["**/*.test.ts"] // 排除测试文件
}
```

**匹配规则**：

- `*` 匹配任意字符（不含 /）
- `**/` 匹配任意层级目录

## 常见错误

```
error TS6059: File is not under 'rootDir'
→ 有文件在 rootDir 之外，检查 include 配置

error TS2688: Cannot find type definition file
→ 缺少 @types/xxx，运行 pnpm add -D @types/node
```

## 下一步

配置构建工具 tsup → [03-build-tool.md](./03-build-tool.md)
