# 学习路线与关键要点

## 为什么按这个顺序学习

这是由"依赖关系"决定的——后面的工具依赖前面的工具。

```
TypeScript（类型基础）
    ↓
Vitest（测试 TS 代码）
    ↓
Biome（给 TS 代码定规范）
    ↓
tsup（编译 TS 为 JS）
    ↓
exports 配置（定义包接口）
    ↓
publint（验证包配置）
    ↓
Changeset（管理版本）
    ↓
GitHub Actions（自动化发布）
```

## 每个环节的核心问题

| 环节 | 你要问自己的 | 验证方式 |
|:---|:---|:---|
| TypeScript | 类型声明能准确描述 API 吗？ | 写测试时 IDE 提示正确 |
| Vitest | 边界情况覆盖了吗？ | `pnpm test:ci` 全过 |
| Biome | 团队协作时代码风格统一吗？ | `git commit` 自动格式化 |
| tsup | 产物能在各种环境跑吗？ | ESM 和 CJS 都能 import |
| exports | 使用者导入方式符合直觉吗？ | 对比 lodash/radash 的用法 |
| Changeset | 版本升级可追溯吗？ | `CHANGELOG.md` 自动生成 |
| CI/CD | 发布流程能无人值守吗？ | push 到 main 自动发版 |

## 关键决策记录

### 1. 为什么选择 tsup 而不是 rollup？

**对比过程：**

| 方案 | 优点 | 缺点 | 结论 |
|:---|:---|:---|:---|
| tsc | 简单 | 不能输出双格式 | ❌ |
| rollup | 灵活 | 需要配置多插件 | ⏳ |
| **tsup** | 零配置、双格式、类型生成 | 黑盒，可控性稍弱 | ✅ |
| unbuild | nuxt 生态、强大 | 学习成本高 | 备选 |

**最终选择 tsup**：这是教学项目，tsup 的"开箱即用"减少了配置负担。

### 2. exports 为什么要配置 CJS？

2026 年了，还要兼容 CommonJS 吗？

**答案是：要。**

原因：
- Next.js 等框架的某些版本默认 CJS
- Jest 默认 CJS
- 大型项目迁移需要时间

**投入：** tsup 一行配置 `format: ['esm', 'cjs']` 自动生成
**收益：** 覆盖 100% 的使用场景

这就是为什么选择 tsup——**兼容成本极低**。

### 3. 测试写在源码目录还是单独 tests/ 目录？

两种方案：

```
# 方案 A：并列模式（本项目采用）
src/
  chunk.ts
  chunk.test.ts

# 方案 B：分离模式
src/
tests/
  chunk.test.ts
```

**选择 A 的理由：**
- 修改源码时测试文件就在旁边
- TDD 更直观：写代码和写测试无缝切换
- Vitest 的 `include: ['src/**/*.test.ts']` 配置简单

**选择 B 的场景：**
- 测试文件数量远超源码
- 需要多套测试配置（单元/集成/E2E）

### 4. Biome 还是 ESLint + Prettier？

**对比：**

| 维度 | Biome | ESLint + Prettier |
|:---|:---|:---|
| 启动速度 | 20ms | 500ms+ |
| 配置数量 | 1 个文件 | 多个文件 + 插件 |
| 规则数量 | 覆盖常见场景 | 海量（但配置复杂）|
| 自定义规则 | 有限 | 无限 |

**结论：** 工具库不需要复杂规则，Biome 够用且快。

**什么时候用 ESLint：** 大型应用项目需要复杂的自定义规则时。

### 5. 分包策略的取舍

当前方案：3 个子包（array/object/string）

```
@c6i/es-sential       # 全量
@c6i/es-sential/array # 数组工具
@c6i/es-sential/object
@c6i/es-sential/string
```

**替代方案：函数级分包**

```
@c6i/es-sential/chunk
@c6i/es-sential/uniq
@c6i/es-sential/pick
...
```

**为什么没有选函数级分包：**

1. **维护成本**：6 个函数就要维护 6 × 4 个出口配置（import types/default + require types/default）
2. **认知负担**：用户要记太多路径
3. **实际收益有限**：6 个函数全量只有几百字节

**什么时候需要函数级分包：** 像 lodash 那样有 100+ 函数时。

## 最难理解的概念

### exports 的"条件导出"

```json
{
  "exports": {
    ".": {
      "import": { "types": "...", "default": "..." },
      "require": { "types": "...", "default": "..." }
    }
  }
}
```

**为什么 types 要在 default 前面？**

Node.js 解析规则：按字段顺序匹配，先 `types` 后 `default`。

如果反过来：
```json
"default": "./dist/index.js",  // 先匹配这个
"types": "./dist/index.d.ts"   // 永远不会走到
```

**为什么 import 和 require 要分开？**

因为 ESM 和 CJS 是不同的模块系统：
- ESM 用 `import`
- CJS 用 `require`

Node.js 会根据调用方式自动选择。

### Changeset 的"变更集"思想

不是"记录改了什么代码"，而是"记录改了什么功能"。

```markdown
---
"@c6i/es-sential": minor
---

新增 debounce 和 throttle 函数
```

这个文件的意思是：
- **包名**：@c6i/es-sential
- **变更级别**：minor（新增功能）
- **变更内容**：新增 debounce 和 throttle 函数

等到发版时：
1. `changeset version` 自动升级版本号（0.1.0 → 0.2.0）
2. `CHANGELOG.md` 自动追加记录
3. 文件被删除，标记为已处理

**关键洞察：** 版本升级是"描述性"的，不是"计算性"的。
- ❌ 不是：统计改了 5 个文件 → patch
- ✅ 而是：人工判断这是新增功能 → minor

这就是为什么需要开发者写变更集，而不是自动生成。

## 可以深挖的方向

如果你还想继续学习，这些是值得深挖的点：

### 1. 构建工具深度

- tsup 的底层是 esbuild，学习 esbuild 的 transform API
- 对比 rollup 的插件系统，理解"生态 vs 性能"的权衡
- 尝试手写一个极简 bundler（几百行代码就能跑）

### 2. 类型系统进阶

- 学习条件类型、映射类型、模板字面量类型
- 尝试给现有函数加更精确的类型约束
- 学习类型体操（type-challenges）

### 3. 测试策略

- 加测试覆盖率报告（`--coverage`）
- 配置测试矩阵（Node.js 18/20/22）
- 学习 property-based testing（fast-check）

### 4. 包大小优化

- 配置 bundle analyzer
- 尝试不同 minifier（terser vs esbuild vs swc）
- 研究 side-effects 的精确配置

### 5. monorepo 实践

- 学习 pnpm workspace
- 尝试把多个包放在一个仓库管理
- 学习 Turborepo / Nx 等构建系统

## 一句话总结

> 写 npm 包是**用最标准的工具链，做最保守的工程决策**。

不要炫技，不要过度设计。类型准确、测试通过、构建成功、发布顺畅——这四件事做好，就是一个合格的 npm 包。

剩下的，是业务价值，不是技术复杂度。

---

**学习资源推荐：**

- [Node.js Packages Documentation](https://nodejs.org/api/packages.html) - exports 的权威文档
- [publint 规则说明](https://publint.dev/rules) - 包最佳实践
- [Vitest 文档](https://vitest.dev/) - 测试技巧
- [tsup 文档](https://tsup.egoist.dev/) - 构建配置
