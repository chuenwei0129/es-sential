# 05 - 代码规范 (ESLint + Prettier)

## ESLint 和 Prettier 分工

| 工具 | 职责 | 不要做的事 |
|:---|:---|:---|
| ESLint | 代码**质量**（潜在bug、 bad pattern） | 不要管格式（空格、分号） |
| Prettier | 代码**格式**（统一风格） | 不要管逻辑 |

**合作方式**：Prettier 负责格式化，ESLint 关闭冲突的格式规则。

## Prettier 配置

### prettier.config.mjs

```javascript
/** @type {import("prettier").Config} */
const config = {
  semi: false,          // 不要分号
  singleQuote: true,    // 单引号
  tabWidth: 2,          // 缩进2空格
  printWidth: 120,      // 一行最多120字符
  trailingComma: 'es5', // ES5允许的尾随逗号
  arrowParens: 'avoid', // 单参箭头函数无括号: x => x
}

export default config
```

### npm scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## ESLint 9 Flat Config

ESLint 9.x 引入全新配置格式，和旧版 `.eslintrc.json` 完全不兼容。

### eslint.config.mjs

```javascript
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  // 1. 忽略配置
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.d.ts'],
  },

  // 2. 全局语言选项
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },

  // 3. 规则配置
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // 4. 自定义规则
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },

  // 5. Prettier 兼容（必须放最后）
  eslintConfigPrettier,
]
```

### Flat Config 结构

旧版 `.eslintrc.json`：

```json
{
  "extends": ["@eslint/js/recommended"],
  "rules": { ... }
}
```

新版 Flat Config：

```js
export default [
  // 每个元素是一个配置对象
  { rules: { ... } },      // 对象 = 直接配置
  pluginJs.configs.recommended,  // 导入的配置
  // ...
]
```

**关键区别**：
- 旧版用 `extends` 继承，新版用数组**合并**
- 新版的配置顺序**从上到下**合并，后面的覆盖前面的

## npm scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## 学到的点

### TypeScript ESLint 需要特别注意

```js
// ts 文件需要配置 parser
{
  files: ['src/**/*.ts'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.json',  // 启用类型检查规则
    },
  },
}
```

### 常用 ESLint 规则

```js
{
  rules: {
    // 关闭的
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',

    // 警告 
    '@typescript-eslint/no-explicit-any': 'warn',

    // 报错的
    'no-unused-vars': 'error',
    'eqeqeq': ['error', 'always'],  // 必须用 ===
  }
}
```

## 下一步

配置 Git Hooks → [06-git-hooks.md](./06-git-hooks.md)
