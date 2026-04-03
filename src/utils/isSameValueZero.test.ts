import { isSameValueZero } from './isSameValueZero'
import { describe, it, expect } from 'vitest'

describe('isSameValueZero', () => {
  describe('基本类型相等', () => {
    it('should return true for same numbers', () => {
      expect(isSameValueZero(1, 1)).toBe(true)
      expect(isSameValueZero(0, 0)).toBe(true)
      expect(isSameValueZero(-1, -1)).toBe(true)
    })

    it('should return true for same strings', () => {
      expect(isSameValueZero('a', 'a')).toBe(true)
      expect(isSameValueZero('', '')).toBe(true)
      expect(isSameValueZero('hello', 'hello')).toBe(true)
    })

    it('should return true for same booleans', () => {
      expect(isSameValueZero(true, true)).toBe(true)
      expect(isSameValueZero(false, false)).toBe(true)
    })

    it('should return true for both null', () => {
      expect(isSameValueZero(null, null)).toBe(true)
    })

    it('should return true for both undefined', () => {
      expect(isSameValueZero(undefined, undefined)).toBe(true)
    })

    it('should return true for null and undefined (both falsy but not equal)', () => {
      // 注意：null === undefined 是 false，它们不是 SameValueZero
      expect(isSameValueZero(null, undefined)).toBe(false)
      expect(isSameValueZero(undefined, null)).toBe(false)
    })
  })

  describe('基本类型不等', () => {
    it('should return false for different numbers', () => {
      expect(isSameValueZero(1, 2)).toBe(false)
      expect(isSameValueZero(0, 1)).toBe(false)
    })

    it('should return false for number and string', () => {
      expect(isSameValueZero(1, '1')).toBe(false)
    })

    it('should return false for different strings', () => {
      expect(isSameValueZero('a', 'b')).toBe(false)
    })
  })

  describe('NaN 处理（SameValueZero 的核心特性）', () => {
    it('should return true for NaN equals NaN', () => {
      // 这是 SameValueZero 与 === 的主要区别
      expect(isSameValueZero(NaN, NaN)).toBe(true)
    })

    it('should return true when both values are NaN-like', () => {
      expect(isSameValueZero(Number.NaN, NaN)).toBe(true)
      expect(isSameValueZero(NaN, 0 / 0)).toBe(true) // 0/0 === NaN
    })

    it('should return false for NaN compared to other values', () => {
      expect(isSameValueZero(NaN, 0)).toBe(false)
      expect(isSameValueZero(NaN, '')).toBe(false)
      expect(isSameValueZero(NaN, null)).toBe(false)
      expect(isSameValueZero(NaN, undefined)).toBe(false)
    })
  })

  describe('零值处理（SameValueZero 的核心特性）', () => {
    it('should return true for -0 equals +0', () => {
      // 这是 SameValueZero 与 Object.is 的主要区别
      expect(isSameValueZero(-0, +0)).toBe(true)
      expect(isSameValueZero(0, -0)).toBe(true)
    })

    it('should return true for 0 equals -0', () => {
      expect(isSameValueZero(0, -0)).toBe(true)
    })

    it('should distinguish -0 from non-zero', () => {
      expect(isSameValueZero(-0, 1)).toBe(false)
      expect(isSameValueZero(0, 1)).toBe(false)
    })
  })

  describe('对象比较', () => {
    it('should return false for different object references', () => {
      expect(isSameValueZero({}, {})).toBe(false)
      expect(isSameValueZero([], [])).toBe(false)
    })

    it('should return true for same object reference', () => {
      const obj = {}
      expect(isSameValueZero(obj, obj)).toBe(true)

      const arr = [1, 2, 3]
      expect(isSameValueZero(arr, arr)).toBe(true)
    })

    it('should return false for string and String object', () => {
      expect(isSameValueZero('a', Object('a'))).toBe(false)
      expect(isSameValueZero('5', new String('5'))).toBe(false)
    })

    it('should return false for number and Number object', () => {
      expect(isSameValueZero(5, new Number(5))).toBe(false)
    })
  })

  describe('与 Map/Set 行为一致', () => {
    it('should behave like Map key comparison for NaN', () => {
      const map = new Map()
      map.set(NaN, 'first')
      map.set(NaN, 'second')
      // Map 认为两个 NaN 是同一个键
      expect(map.size).toBe(1)
      expect(map.get(NaN)).toBe('second')

      // isSameValueZero 也这样认为
      expect(isSameValueZero(NaN, NaN)).toBe(true)
    })

    it('should behave like Map key comparison for -0 and +0', () => {
      const map = new Map()
      map.set(-0, 'minus')
      map.set(+0, 'plus')
      // Map 认为 -0 和 +0 是同一个键
      expect(map.size).toBe(1)

      // isSameValueZero 也这样认为
      expect(isSameValueZero(-0, +0)).toBe(true)
    })

    it('should behave like Set value deduplication', () => {
      const set = new Set([NaN, NaN, -0, +0])
      // Set 去重后只有两个元素
      expect(set.size).toBe(2)

      // isSameValueZero 逻辑一致
      expect(isSameValueZero(NaN, NaN)).toBe(true)
      expect(isSameValueZero(-0, +0)).toBe(true)
    })
  })
})
