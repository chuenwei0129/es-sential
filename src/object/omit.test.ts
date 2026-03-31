/**
 * omit 函数 - TDD 学习笔记
 *
 * 功能：从对象中排除指定的属性，返回新对象
 * 学习点：
 * 1. Omit<T, K> 内置工具类型
 * 2. Object.keys() 获取所有键
 * 3. filter + reduce 排除指定键
 */

import { describe, expect, it } from 'vitest'
import { omit } from './omit'

describe('omit', () => {
  it('should omit specified properties', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, ['a', 'c'])
    expect(result).toEqual({ b: 2 })
  })

  it('should return same object when omitting no keys', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, [])
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should return empty object when omitting all keys', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, ['a', 'b'])
    expect(result).toEqual({})
  })

  it('should handle single key', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, ['b'])
    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('should return new object (not mutate)', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, ['a'])
    expect(result).not.toBe(obj)
    expect(obj).toEqual({ a: 1, b: 2 }) // 原对象不变
  })

  it('should handle nested values', () => {
    const obj = { a: { nested: 1 }, b: 2 }
    const result = omit(obj, ['b'])
    expect(result).toEqual({ a: { nested: 1 } })
  })
})
