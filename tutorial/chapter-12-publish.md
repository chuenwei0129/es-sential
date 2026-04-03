# 第 12 章：发布与维护

> 目标：完成首个 npm 包的发布，学习后续维护流程
> 预计时间：45 分钟

---

## 一、本章目标

学完本章，你将：

- ✅ 完成 npm 包首次发布
- ✅ 理解 prepublishOnly 完整验证流程
- ✅ 学习包的后续迭代维护
- ✅ 掌握常见问题处理

---

## 二、发布前检查清单

### 2.1 完整验证流程

运行完整的发布前检查：

```bash
# 1. 代码规范检查
pnpm lint

# 2. 类型检查
pnpm typecheck

# 3. 运行测试
pnpm test:ci

# 4. 构建
pnpm build

# 5. 检查包内容
pnpm exec publint
```

**publint 会检查**：

- ✅ package.json 配置正确
- ✅ exports 配置有效
- ✅ 入口文件存在
- ✅ 类型声明文件正确

### 2.2 prepublishOnly 脚本

确保 package.json 配置了完整的发布前验证：

```json
{
  "scripts": {
    "prepublishOnly": "pnpm lint && pnpm typecheck && pnpm test:ci && pnpm build && publint"
  }
}
```

**5 阶段验证**：

| 阶段 | 命令             | 检查内容     |
| :--- | :--------------- | :----------- |
| 1    | `pnpm lint`      | 代码规范     |
| 2    | `pnpm typecheck` | 类型正确性   |
| 3    | `pnpm test:ci`   | 所有测试通过 |
| 4    | `pnpm build`     | 构建产物生成 |
| 5    | `publint`        | 包结构正确   |

---

## 三、首次发布

### 3.1 注册 npm 账号

如果你还没有 npm 账号：

```bash
# 命令行注册
npm adduser

# 或者在 https://www.npmjs.com/signup 注册
```

### 3.2 登录 npm

```bash
# 登录
npm login

# 验证登录状态
npm whoami
# 输出：yourname
```

### 3.3 检查包名可用性

```bash
# 检查包名是否已被占用
npm view @yourname/my-package

# 如果返回 404，说明可以注册
```

### 3.4 配置 scoped 包访问权限

对于 scoped 包（`@yourname/package-name`），需要设置公开：

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

### 3.5 执行发布

```bash
# 1. 创建 changeset（记录变更）
npx changeset

# 2. 升级版本号
npx changeset version

# 3. 提交版本变更
git add .
git commit -m "chore: release v0.1.0"

# 4. 创建 tag
git tag v0.1.0

# 5. 发布到 npm
npm publish

# 6. 推送 tag
git push origin main --tags
```

### 3.6 验证发布

```bash
# 查看已发布的包
npm view @yourname/my-package

# 安装测试
mkdir test-install
cd test-install
npm init -y
npm install @yourname/my-package
```

测试安装后的使用：

```typescript
// test.mjs
import { chunk, uniq, pick, omit, camelCase, kebabCase } from '@yourname/my-package'

console.log(chunk([1, 2, 3, 4], 2))
// [[1, 2], [3, 4]]
```

---

## 四、包的维护流程

### 4.1 日常迭代工作流

```bash
# 1. 开发新功能
git checkout -b feature/new-function

# 2. 开发并测试
# ... 写代码 ...
# ... 写测试 ...
pnpm test

# 3. 添加 changeset
npx changeset

# 4. 提交
git add .
git commit -m "feat: add new function"

# 5. 创建 PR 并合并到 main
```

### 4.2 自动发布工作流

如果配置了 Changesets Action，合并到 main 后会自动：

1. 检测 changeset 文件
2. 创建版本升级 PR
3. 合并 PR 后自动发布

### 4.3 手动发布流程

```bash
# 1. 切换到 main 分支
git checkout main
git pull origin main

# 2. 升级版本
npx changeset version

# 3. 查看变更
# - 检查 CHANGELOG.md
# - 检查 package.json 版本

# 4. 提交版本变更
git add .
git commit -m "chore: release v0.2.0"

# 5. 打 tag
git tag v0.2.0

# 6. 推送
git push origin main --tags

# 7. 发布
npm publish
```

---

## 五、常见问题处理

### 5.1 发布失败处理

**错误 1：权限不足**

```
npm ERR! 403 Forbidden
```

**解决**：

- 检查是否登录：`npm whoami`
- 检查包名是否正确
- scoped 包第一次发布需要 `--access public`

**错误 2：版本已存在**

```
npm ERR! 403 You cannot publish over the previously published versions
```

**解决**：

- 升级版本号：`npx changeset version`
- 或使用 `npm version patch/minor/major`

**错误 3：构建产物未包含**

```bash
# 检查 files 字段
"files": ["dist"]
```

### 5.2 包内容验证

发布前预览包内容：

```bash
# 打包但不发布
npm pack

# 解压查看内容
tar -xvf yourname-my-package-0.1.0.tgz
ls -la package/
```

### 5.3 弃用包版本

如果发现某个版本有问题：

```bash
# 弃用特定版本（用户仍能安装但会收到警告）
npm deprecate @yourname/my-package@0.1.0 "This version has critical bug"

# 取消弃用
npm deprecate @yourname/my-package@0.1.0 ""
```

### 5.4 删除已发布版本

**24 小时内可以删除**：

```bash
npm unpublish @yourname/my-package@0.1.0
```

**注意**：

- 超过 24 小时无法删除
- 被大量使用的包无法删除
- 删除后不能再发布相同版本

---

## 六、后续维护建议

### 6.1 监控包的使用情况

```bash
# 查看下载统计
npm stats @yourname/my-package

# 或访问
# https://www.npmjs.com/package/@yourname/my-package
```

### 6.2 回应 Issues

在 GitHub 仓库开启 Issues，及时：

- 修复 bug
- 回答使用问题
- 收集功能建议

### 6.3 持续改进

- 保持依赖更新
- 关注安全问题（`npm audit`）
- 定期发布新版本

---

## 七、完整验证检查

请确认你已完成整个教程：

| 章节     | 检查项               | 完成 |
| :------- | :------------------- | :--: |
| 第 1 章  | 安装 Node.js 和 pnpm |  ☐   |
| 第 2 章  | 配置 package.json    |  ☐   |
| 第 3 章  | 配置 TypeScript      |  ☐   |
| 第 4 章  | 配置 tsup 构建       |  ☐   |
| 第 5 章  | 配置 Vitest 测试     |  ☐   |
| 第 6 章  | 配置 Biome 规范      |  ☐   |
| 第 7 章  | 配置 Git Hooks       |  ☐   |
| 第 8 章  | 配置 Changesets      |  ☐   |
| 第 9 章  | 配置 CI/CD           |  ☐   |
| 第 10 章 | 实现工具函数         |  ☐   |
| 第 11 章 | 编写进阶测试         |  ☐   |
| 第 12 章 | 发布到 npm           |  ☐   |

**最终验证命令**：

```bash
# 完整验证流程
pnpm lint           # 代码规范检查
pnpm typecheck      # 类型检查
pnpm test:ci        # 测试
pnpm build          # 构建
pnpm exec publint   # 包结构检查

# 如果都通过，恭喜！你的包已经准备好了！
```

---

## 八、恭喜你！

完成本教程后，你已经掌握：

✅ **现代前端工程化完整流程**

- TypeScript 类型系统
- 零配置构建工具
- 测试驱动开发

✅ **npm 包开发最佳实践**

- ESM/CJS 双格式输出
- 语义化版本管理
- 自动化 CI/CD

✅ **可复用的实际经验**

- 边界条件处理
- 代码质量保证
- 开源项目维护

---

## 参考资源

- [npm 官方文档](https://docs.npmjs.com/)
- [npm 包发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/lang/zh-CN/)
- [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)

---

**下一步？**

- 探索更多工具函数实现
- 学习 monorepo 管理（pnpm workspace）
- 贡献到开源项目
- 分享你的学习经验

**祝你开发愉快！🎉**
