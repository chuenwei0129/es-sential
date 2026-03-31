/**
 * chunk 函数 - TDD 学习笔记
 *
 * 功能：将数组分割成指定大小的块
 * 学习点：
 * 1. 使用泛型 T 让函数支持任意类型数组
 * 2. for 循环步长技巧：i += size
 * 3. slice 方法不会越界，自动处理剩余元素
 */

import { describe, expect, it } from 'vitest'
import { chunk } from './chunk'

describe('chunk', () => {
  it('should split array into chunks of specified size', () => {
    // 正常情况：5个元素，每2个一组
    const result = chunk([1, 2, 3, 4, 5], 2)
    expect(result).toEqual([[1, 2], [3, 4], [5]])
  })

  it('should handle empty array', () => {
    // 边界情况：空数组
    const result = chunk([], 3)
    expect(result).toEqual([])
  })

  it('should handle array smaller than chunk size', () => {
    // 边界情况：数组长度小于 chunk size
    const result = chunk([1, 2], 5)
    expect(result).toEqual([[1, 2]])
  })

  it('should handle exact division', () => {
    // 边界情况：刚好整除
    const result = chunk([1, 2, 3, 4], 2)
    expect(result).toEqual([[1, 2], [3, 4]])
  })

  it('should handle size of 1', () => {
    // 边界情况：每块1个元素
    const result = chunk([1, 2, 3], 1)
    expect(result).toEqual([[1], [2], [3]])
  })

  it('should handle non-integer elements', () => {
    // 类型测试：字符串数组
    const result = chunk(['a', 'b', 'c', 'd'], 2)
    expect(result).toEqual([['a', 'b'], ['c', 'd']])
  })
})
