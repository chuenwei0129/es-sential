/**
 * pick 函数 - TDD 学习笔记
 *
 * 功能：从对象中选取指定的属性，返回新对象
 * 学习点：
 * 1. 泛型 keyof 约束确保 keys 是对象的有效属性
 * 2. Pick<T, K> 内置工具类型
 * 3. reduce 构建新对象
 */

import { describe, expect, it } from 'vitest'
import { pick } from './pick'

describe('pick', () => {
  it('should pick specified properties', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pick(obj, ['a', 'c'])
    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('should return empty object when picking no keys', () => {
    const obj = { a: 1, b: 2 }
    const result = pick(obj, [])
    expect(result).toEqual({})
  })

  it('should pick all properties when all keys provided', () => {
    const obj = { a: 1, b: 2 }
    const result = pick(obj, ['a', 'b'])
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should handle single key', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pick(obj, ['b'])
    expect(result).toEqual({ b: 2 })
  })

  it('should return new object (not mutate)', () => {
    const obj = { a: 1, b: 2 }
    const result = pick(obj, ['a'])
    expect(result).not.toBe(obj)
    expect(obj).toEqual({ a: 1, b: 2 }) // 原对象不变
  })

  it('should handle nested values', () => {
    const obj = { a: { nested: 1 }, b: 2 }
    const result = pick(obj, ['a'])
    expect(result).toEqual({ a: { nested: 1 } })
  })
})
