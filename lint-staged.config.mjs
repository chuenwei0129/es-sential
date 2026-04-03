/** @type {import('./lib/index.js').Configuration} */

export default {
  // 注意: tsc 类型检查放 pre-push，不在 lint-staged 跑
  '*.{js,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // 其他文件: Prettier 格式化
  '*.{json,md,yml,yaml,css,html}': 'prettier --write',
}
