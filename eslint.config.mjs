/**
 * ESLint 配置文件
 * 使用 ESLint 9.x 的 Flat Config 格式
 */

// ESLint 官方基础规则
import pluginJs from '@eslint/js'
// TypeScript 支持：解析器和推荐规则
import tseslint from 'typescript-eslint'
// 全局变量定义库（node/browser/jest等）
import globals from 'globals'
// Vitest 测试框架的 ESLint 插件
import vitest from '@vitest/eslint-plugin'
// 关闭与 Prettier 冲突的 ESLint 规则
import eslintConfigPrettier from 'eslint-config-prettier'

/**
 * 配置数组说明：
 * ESLint 9.x 使用 config array 格式，每个元素是一个配置对象
 */

/**
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  // ==========================================================
  // 1. 全局忽略配置
  // ==========================================================
  {
    ignores: [
      '.yarn/**', // Yarn 缓存
      'coverage/**', // 测试覆盖率报告
      '**/dist/**', // 编译输出
      '**/cache/**', // 各种缓存
      '.pnp.*', // Yarn PnP 文件
      '**/*.d.ts', // TypeScript 声明文件
      '**/*.tgz', // 压缩包
      'node_modules/**', // 依赖目录
    ],
  },

  // ==========================================================
  // 2. 全局语言选项
  // ==========================================================
  // 为什么需要？ESLint 默认会报错 no-undef，如果你用 console.log()，
  // 它会认为 console 未定义。通过声明这些全局变量，ESLint 就知道它们
  // 是有意使用的，不会报未定义的错误。
  {
    languageOptions: {
      globals: {
        ...globals.node, // Node.js 全局变量 (Buffer, process等)
        ...globals.browser, // 浏览器全局变量 (window, document等)
        ...globals.jest, // Jest 测试全局变量
        ...globals['shared-node-browser'], // 共享全局变量 (console等)
        ...globals.es2015, // ES2015 全局变量
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // 允许使用 JSX 语法
        },
      },
    },
  },

  // ==========================================================
  // 3. ESLint 官方推荐规则
  // ==========================================================
  // 包含: no-unused-vars, no-undef, no-console, eqeqeq 等基础规则
  pluginJs.configs.recommended,

  // ==========================================================
  // 4. TypeScript 推荐规则
  // ==========================================================
  // 包含: @typescript-eslint/no-unused-vars, explicit-module-boundary-types 等
  ...tseslint.configs.recommended,

  // ==========================================================
  // 5. 项目源码专用规则 (src/*, 排除测试文件)
  // ==========================================================
  {
    files: ['src/**/*.ts'], // 只对 src 目录生效
    ignores: ['**/*.test.ts'], // 忽略测试文件
    languageOptions: {
      parser: tseslint.parser, // 使用 TypeScript 解析器
      parserOptions: {
        project: './tsconfig.json', // 关联 tsconfig 以启用类型检查规则
        tsconfigRootDir: import.meta.dirname, // 指定项目根目录
      },
    },
    rules: {
      // 禁止特定语法: console 和 Object.entries
      'no-restricted-syntax': [
        'error', // 设为 error 级别
        {
          // 禁止 console.* 调用
          selector: 'CallExpression[callee.object.name="console"]',
          message: 'console.log() is not allowed in source code.',
        },
        {
          // 禁止 Object.entries() 调用（性能考虑）
          selector: 'CallExpression[callee.object.name="Object"][callee.property.name="entries"]',
          message:
            'Do not use Object.entries for performance. Consider using alternatives like Object.keys() or Object.values().',
        },
      ],
    },
  },

  // ==========================================================
  // 6. 测试文件专用规则 (*.test.ts)
  // ==========================================================
  {
    files: ['**/*.test.ts'],
    plugins: { vitest }, // 启用 Vitest 插件
    settings: { vitest: { typecheck: true } }, // 启用类型检查
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 继承 Vitest 推荐规则
      ...vitest.configs.recommended.rules,
      // 禁止在条件语句中使用 expect
      'vitest/no-conditional-expect': 'warn',
      // 禁止注释掉的测试
      'vitest/no-commented-out-tests': 'warn',
      // 确保 expect 使用正确
      'vitest/valid-expect': 'warn',
      // 测试文件中允许使用 console
      'no-restricted-syntax': 'off',
    },
  },

  // ==========================================================
  // 7. 通用自定义规则
  // ==========================================================
  {
    rules: {
      // 禁止隐式类型转换: !!foo, +foo, "" + foo
      'no-implicit-coercion': 'error',

      // 检测到未完成任务标记时发出警告
      'no-warning-comments': [
        'warn',
        {
          terms: ['TODO', 'FIXME', 'XXX', 'BUG'],
          location: 'anywhere',
        },
      ],

      // 强制所有控制语句使用花括号
      curly: ['error', 'all'],

      // 强制使用 === 替代 ==（但 == null 允许）
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // ============ TypeScript 规则 ============

      // 警告使用 any 类型
      '@typescript-eslint/no-explicit-any': 'warn',

      // 允许在定义前使用变量/函数（函数提升）
      '@typescript-eslint/no-use-before-define': 'off',

      // 允许空接口（用于接口合并）
      '@typescript-eslint/no-empty-interface': 'off',

      // 不强制函数显式声明返回类型
      '@typescript-eslint/explicit-function-return-type': 'off',

      // 允许构造参数自动转成属性
      '@typescript-eslint/no-parameter-properties': 'off',

      // 警告使用 require()，建议用 ES Module
      '@typescript-eslint/no-require-imports': 'warn',

      // 警告 foo?.bar! 这种写法
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',

      // 警告不必要的类型注解（如 let x: string = "str"）
      '@typescript-eslint/no-inferrable-types': 'warn',

      // 允许空函数体
      '@typescript-eslint/no-empty-function': 'off',

      // 不强制导出函数声明返回类型
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // 强制使用 T[] 而非 Array<T>
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

      // 禁止未使用变量，但忽略解构的剩余属性
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, caughtErrors: 'none' }],

      // 命名规范：变量/函数/接口/类型别名
      '@typescript-eslint/naming-convention': [
        'error',
        {
          // 变量：camelCase / UPPER_CASE / PascalCase，允许下划线前缀
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          selector: 'variable',
          leadingUnderscore: 'allow',
        },
        {
          // 函数：camelCase / PascalCase
          format: ['camelCase', 'PascalCase'],
          selector: 'function',
        },
        {
          // 接口：PascalCase
          format: ['PascalCase'],
          selector: 'interface',
        },
        {
          // 类型别名：PascalCase
          format: ['PascalCase'],
          selector: 'typeAlias',
        },
      ],

      // 类成员排序规则
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'public-static-field', // 公共静态字段
            'private-static-field', // 私有静态字段
            'public-instance-field', // 公共实例字段
            'private-instance-field', // 私有实例字段
            'public-constructor', // 公共构造函数
            'private-constructor', // 私有构造函数
            'public-instance-method', // 公共实例方法
            'private-instance-method', // 私有实例方法
          ],
        },
      ],

      // 使用 Object.hasOwn() 替代 hasOwnProperty
      'prefer-object-has-own': 'error',
    },
  },

  // ==========================================================
  // 8. Prettier 兼容配置（必须放最后）
  // ==========================================================
  // 关闭所有与 Prettier 冲突的 ESLint 格式化规则
  // 这样 Prettier 负责格式，ESLint 负责代码质量
  eslintConfigPrettier,
]
