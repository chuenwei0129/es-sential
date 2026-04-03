# 《从零开始写一个 npm 包》学习路线图

> 适合前端小白的渐进式教程，每一步都有"是什么、为什么、怎么做"
> 基于真实项目 @c6i/es-sential 的实践

---

## 🎯 学习目标

完成本系列学习后，你将：

- 理解现代 npm 包的完整开发流程
- 掌握 TypeScript + 测试 + CI/CD 的工程化能力
- 拥有自己发布的 npm 包

---

## 📚 学习路线（共 12 章）

|                 章节                 | 主题            | 核心知识点                  | ctx7 文档查询    |
| :----------------------------------: | :-------------- | :-------------------------- | :--------------- |
|    [第 1 章](./chapter-01-env.md)    | 环境准备        | Node.js、pnpm、版本管理     | pnpm             |
|   [第 2 章](./chapter-02-init.md)    | 初始化项目      | package.json、项目结构      | npm package.json |
|    [第 3 章](./chapter-03-ts.md)     | TypeScript 配置 | tsconfig、类型系统          | TypeScript       |
|   [第 4 章](./chapter-04-build.md)   | 构建工具        | tsup、ESM/CJS、tree-shaking | tsup             |
|   [第 5 章](./chapter-05-test.md)    | 测试框架        | Vitest、TDD、单元测试       | Vitest           |
|   [第 6 章](./chapter-06-lint.md)    | 代码规范        | Biome、格式化、Lint         | Biome            |
|    [第 7 章](./chapter-07-git.md)    | Git Hooks       | husky、lint-staged          | husky            |
|  [第 8 章](./chapter-08-version.md)  | 版本管理        | Changesets、语义化版本      | changesets       |
|    [第 9 章](./chapter-09-ci.md)     | 自动化          | GitHub Actions、CI/CD       | GitHub Actions   |
|   [第 10 章](./chapter-10-code.md)   | 编写功能        | 工具函数实现                | -                |
| [第 11 章](./chapter-11-test-adv.md) | 进阶测试        | 边界条件、类型测试          | -                |
| [第 12 章](./chapter-12-publish.md)  | 发布与维护      | npm publish、后续迭代       | npm              |

---

## 📝 学习建议

### 每章的结构

每章都包含以下部分：

1. **本章目标** - 学完能做什么
2. **概念讲解** - 用 ctx7 查权威文档
3. **动手实践** - 一步步跟着做
4. **原理解析** - 为什么要这么做
5. **常见问题** - 踩过的坑
6. **验证检查** - 确保你做对了
7. **下一步** - 预告下章内容

### 推荐的节奏

- **每天 1 章**：保持连贯性，不要中断太久
- **边学边做**：不要只看，一定要动手敲
- **记录笔记**：在 NOTES.md 记录自己的理解和问题
- **多问为什么**：不仅要知道怎么做，还要知道为什么

### 前置知识

开始前你需要：

- 基本的 JavaScript 知识
- 会用命令行（终端）
- 有 GitHub 账号
- 安装了 VS Code

不需要：

- TypeScript 经验（我们会讲）
- 测试经验（从零开始）
- CI/CD 经验（从概念讲起）

---

## 🚀 让我们开始

点击 **[第 1 章：环境准备](./chapter-01-env.md)**，开始你的 npm 包开发之旅！

---

## 📖 参考资源

- [本项目 GitHub 仓库](https://github.com/chuenwei0129/es-sential)
- [npm 官方文档](https://docs.npmjs.com/)
- [Node.js 官方文档](https://nodejs.org/docs/latest/api/)

---

## 🎉 学习完成后的成果

完成全部 12 章后，你将拥有一个完整的 npm 包：

```
my-npm-package/
├── src/                      # 源码
│   ├── array/               # 数组工具
│   ├── object/              # 对象工具
│   ├── string/              # 字符串工具
│   └── index.ts             # 统一导出
├── dist/                    # 构建产物（ESM+CJS+类型）
├── .github/workflows/       # CI/CD 配置
├── package.json             # 包配置
├── tsconfig.json            # TypeScript 配置
├── tsup.config.ts           # 构建配置
├── vitest.config.ts         # 测试配置
├── biome.json               # 代码规范
└── .husky/                  # Git Hooks
```

**你将掌握的技能**：

| 技能                   |  掌握程度  |
| :--------------------- | :--------: |
| TypeScript 类型系统    | ⭐⭐⭐⭐⭐ |
| 构建工具 (tsup)        | ⭐⭐⭐⭐⭐ |
| 测试框架 (Vitest)      | ⭐⭐⭐⭐⭐ |
| 代码规范 (Biome)       | ⭐⭐⭐⭐⭐ |
| CI/CD (GitHub Actions) | ⭐⭐⭐⭐⭐ |
| 版本管理 (Changesets)  | ⭐⭐⭐⭐⭐ |

---

## 🛣️ 进阶学习路径

完成本教程后，可以继续：

1. **Monorepo 管理** - 学习 pnpm workspace 管理多包项目
2. **性能优化** - 学习 bundle analyzer、tree-shaking 优化
3. **浏览器测试** - 配置 Playwright 进行 E2E 测试
4. **文档站点** - 使用 VitePress 搭建 API 文档
5. **开源贡献** - 为喜欢的开源项目提交 PR

**祝你学习愉快！🚀**
