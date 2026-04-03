import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 启用全局 API（describe/test/expect 无需导入）
    globals: true,

    // 测试环境（这里是纯 Node.js 项目）
    environment: 'node',

    // 测试文件匹配模式
    include: ['src/**/*.test.ts'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
    },
  },
})
