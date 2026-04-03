import { defineConfig } from 'tsup'

export default defineConfig({
  // 入口文件 - 对象形式控制输出文件名
  entry: {
    index: 'src/index.ts',
  },

  // 输出格式
  format: ['esm', 'cjs'],

  // 类型声明
  dts: true,

  // 代码分割 - 共享代码抽离
  splitting: true,

  // 生成 sourcemap
  sourcemap: true,

  // 每次构建前清空 dist
  clean: true,

  // 不需要 minify（npm 包一般不压缩，让用户自己压缩）
  minify: false,
})
