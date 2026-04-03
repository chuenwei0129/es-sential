# es-sential 学习笔记

> 边学边记，从零构建一个现代 npm 包

---

## 目录导航

### 01 脚手架搭建

|                             章节                              | 主题            | 关键内容                |
| :-----------------------------------------------------------: | :-------------- | :---------------------- |
|      [01-project-init](./01-scaffold/01-project-init.md)      | 项目初始化      | pnpm、package.json 配置 |
|  [02-typescript-setup](./01-scaffold/02-typescript-setup.md)  | TypeScript 配置 | tsconfig、strict 模式   |
|        [03-build-tool](./01-scaffold/03-build-tool.md)        | 构建工具        | tsup、ESM/CJS 双输出    |
| [04-testing-framework](./01-scaffold/04-testing-framework.md) | 测试框架        | Vitest、TDD 流程        |
|      [05-code-quality](./01-scaffold/05-code-quality.md)      | 代码规范        | ESLint 9、Prettier      |
|         [06-git-hooks](./01-scaffold/06-git-hooks.md)         | Git Hooks       | husky、lint-staged      |

**可运行代码**：

- [scaffold-checklist.ts](./01-scaffold/snippets/scaffold-checklist.ts) — 检查清单

### 02 TDD 开发工作流

|                             章节                              | 主题       |
| :-----------------------------------------------------------: | :--------- |
| [red-green-refactor](./02-tdd-workflow/red-green-refactor.md) | TDD 方法论 |

---

## 快速命令

```bash
# 开发
pnpm dev           # 监听构建
pnpm test:watch    # 监听测试

# 检查
pnpm check         # 完整检查（类型+格式化+lint+测试）
pnpm lint          # ESLint
pnpm format        # Prettier

# 发布
pnpm build         # 构建
pnpm clean         # 清理
```

---

## 学习目标 checklist

- [x] 搭建现代 npm 包基础设施
- [x] 配置 TypeScript + tsup + Vitest
- [x] 设置 ESLint 9 Flat Config
- [x] 集成 husky + lint-staged
- [ ] 用 TDD 开发第一个工具函数
- [ ] 添加 CI/CD 自动化
- [ ] 发布到 npm

---

_这些笔记是边学边写的，可能有错误，欢迎指正。_
