/**
 * kebabCase 函数 - TDD 学习笔记
 *
 * 功能：将字符串转换为短横线命名（kebab-case）
 * 学习点：
 * 1. 处理驼峰命名到短横线的转换：/([a-z])([A-Z])/g
 * 2. 统一处理各种分隔符为短横线
 * 3. toLowerCase 统一小写
 */

import { describe, expect, it } from 'vitest'
import { kebabCase } from './kebabCase'

describe('kebabCase', () => {
  it('should convert camelCase to kebab-case', () => {
    const result = kebabCase('helloWorld')
    expect(result).toBe('hello-world')
  })

  it('should convert space separated to kebab-case', () => {
    const result = kebabCase('hello world')
    expect(result).toBe('hello-world')
  })

  it('should convert snake_case to kebab-case', () => {
    const result = kebabCase('hello_world')
    expect(result).toBe('hello-world')
  })

  it('should handle PascalCase', () => {
    const result = kebabCase('HelloWorld')
    expect(result).toBe('hello-world')
  })

  it('should handle mixed case', () => {
    const result = kebabCase('Hello_World-Test foo')
    expect(result).toBe('hello-world-test-foo')
  })

  it('should handle empty string', () => {
    const result = kebabCase('')
    expect(result).toBe('')
  })

  it('should handle single word lowercase', () => {
    const result = kebabCase('hello')
    expect(result).toBe('hello')
  })

  it('should handle multiple capital letters', () => {
    const result = kebabCase('HTMLElement')
    expect(result).toBe('html-element')
  })
})
