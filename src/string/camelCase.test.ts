/**
 * camelCase 函数 - TDD 学习笔记
 *
 * 功能：将字符串转换为驼峰命名（camelCase）
 * 学习点：
 * 1. 正则表达式: /[^a-zA-Z0-9]+/g 匹配非字母数字字符
 * 2. 正则表达式: /(?:^|\s|_|-)+([a-zA-Z])/g 匹配分隔符后的首字母
 * 3. 非捕获分组 (?: ...) 的使用
 */

import { describe, expect, it } from 'vitest'
import { camelCase } from './camelCase'

describe('camelCase', () => {
  it('should convert space separated to camelCase', () => {
    const result = camelCase('hello world')
    expect(result).toBe('helloWorld')
  })

  it('should convert hyphen separated to camelCase', () => {
    const result = camelCase('hello-world')
    expect(result).toBe('helloWorld')
  })

  it('should convert underscore separated to camelCase', () => {
    const result = camelCase('hello_world')
    expect(result).toBe('helloWorld')
  })

  it('should handle mixed separators', () => {
    const result = camelCase('hello_world-test foo')
    expect(result).toBe('helloWorldTestFoo')
  })

  it('should handle empty string', () => {
    const result = camelCase('')
    expect(result).toBe('')
  })

  it('should handle single word', () => {
    const result = camelCase('hello')
    expect(result).toBe('hello')
  })

  it('should handle multiple spaces', () => {
    const result = camelCase('hello   world')
    expect(result).toBe('helloWorld')
  })

  it('should lowercase first char if uppercase', () => {
    const result = camelCase('Hello World')
    expect(result).toBe('helloWorld')
  })
})
