/**
 * 脚手架搭建检查清单
 * 可以复制到项目根目录运行，验证配置是否完整
 *
 * 使用方法：
 *   npx tsx notes/01-scaffold/snippets/scaffold-checklist.ts
 *   或直接 ts-node 运行
 */

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

interface CheckItem {
  name: string
  check: () => boolean | string
}

const checks: CheckItem[] = [
  {
    name: 'package.json 存在',
    check: () => existsSync('package.json'),
  },
  {
    name: 'package.json 包含 type: module',
    check: () => {
      const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
      return pkg.type === 'module' ? true : '缺少 "type": "module"'
    },
  },
  {
    name: 'tsconfig.json 存在',
    check: () => existsSync('tsconfig.json'),
  },
  {
    name: 'tsup.config.ts 存在',
    check: () => existsSync('tsup.config.ts'),
  },
  {
    name: 'vitest.config.ts 存在',
    check: () => existsSync('vitest.config.ts'),
  },
  {
    name: 'eslint.config.mjs 存在',
    check: () => existsSync('eslint.config.mjs'),
  },
  {
    name: 'prettier.config.mjs 存在',
    check: () => existsSync('prettier.config.mjs'),
  },
  {
    name: '.husky/pre-commit 存在',
    check: () => existsSync('.husky/pre-commit'),
  },
  {
    name: 'lint-staged.config.mjs 存在',
    check: () => existsSync('lint-staged.config.mjs'),
  },
  {
    name: 'src 目录存在',
    check: () => existsSync('src'),
  },
  {
    name: '安装依赖 (node_modules)',
    check: () => existsSync('node_modules'),
  },
]

console.log('📝 es-sential 脚手架检查清单\n')

let passed = 0
let failed = 0

for (const item of checks) {
  const result = item.check()
  const ok = result === true

  if (ok) {
    console.log(`  ✅ ${item.name}`)
    passed++
  } else {
    console.log(`  ❌ ${item.name}`)
    if (typeof result === 'string') {
      console.log(`     ${result}`)
    }
    failed++
  }
}

console.log(`\n${passed}/${checks.length} 项检查通过`)

if (failed > 0) {
  console.log(`⚠️  有 ${failed} 项未通过，请检查配置`)
  process.exit(1)
} else {
  console.log('🎉 脚手架配置完整！可以开始开发了')
  process.exit(0)
}
