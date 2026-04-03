/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config¨}
 */
const config = {
  // 箭头函数参数是否使用括号
  // 'avoid' - 单个参数时省略括号，如：x => x + 1
  arrowParens: 'avoid',

  // HTML/Vue/Angular 标签的右括号是否放在最后一行末尾（而不是新行）
  bracketSameLine: false,

  // 对象字面量中的括号内是否添加空格
  // true: { foo: bar }, false: {foo: bar}
  bracketSpacing: true,

  // 行尾换行符样式
  // 'lf' - Linux/Mac 风格 (\n), 'crlf' - Windows 风格 (\r\n)
  endOfLine: 'lf',

  // JSX 中是否使用单引号
  // false - 使用双引号，与 HTML 保持一致
  jsxSingleQuote: false,

  // 每行最大字符数，超出则换行
  printWidth: 120,

  // Markdown/纯文本中换行处理方式
  // 'preserve' - 保持原有换行，不自动换行
  proseWrap: 'preserve',

  // 对象属性引号的使用方式
  // 'as-needed' - 仅在需要时添加引号（如含有特殊字符的属性名）
  quoteProps: 'as-needed',

  // 语句末尾是否添加分号
  semi: false,

  // 是否使用单引号（替代双引号）
  // 影响字符串字面量，JSX 除外
  singleQuote: true,

  // 缩进空格数
  tabWidth: 2,

  // 多行结构中是否添加尾随逗号
  // 'es5' - 在 ES5 有效的位置添加（对象、数组等）
  trailingComma: 'es5',
}

export default config
