/**
 * uniq 函数 - TDD 学习笔记
 *
 * 功能：数组去重，保留首次出现的元素
 * 学习点：
 * 1. Set 构造函数可以接收可迭代对象，是去重的标准做法
 * 2. Array.from 将 Set 转回数组
 * 3. 泛型保证类型一致性
 */

import { describe, expect, it } from 'vitest'
import { uniq } from './uniq'

describe('uniq', () => {
  it('should remove duplicate numbers', () => {
    const result = uniq([1, 2, 2, 3, 3, 4])
    expect(result).toEqual([1, 2, 3, 4])
  })

  it('should remove duplicate strings', () => {
    const result = uniq(['a', 'b', 'b', 'c', 'a'])
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should preserve first occurrence order', () => {
    const result = uniq([2, 1, 2, 3, 1])
    expect(result).toEqual([2, 1, 3])
  })

  it('should handle empty array', () => {
    const result = uniq([])
    expect(result).toEqual([])
  })

  it('should handle array with no duplicates', () => {
    const result = uniq([1, 2, 3])
    expect(result).toEqual([1, 2, 3])
  })

  it('should handle single element array', () => {
    const result = uniq([1])
    expect(result).toEqual([1])
  })
})
