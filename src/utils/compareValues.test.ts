import { describe, it, expect } from 'vitest'
import { compareValues } from './compareValues'

describe('compareValues', () => {
  describe('数字比较', () => {
    describe('升序 (asc)', () => {
      it('a < b 时返回 -1', () => {
        expect(compareValues(1, 2, 'asc')).toBe(-1)
        expect(compareValues(-5, 0, 'asc')).toBe(-1)
        expect(compareValues(0, 10, 'asc')).toBe(-1)
      })

      it('a > b 时返回 1', () => {
        expect(compareValues(2, 1, 'asc')).toBe(1)
        expect(compareValues(0, -5, 'asc')).toBe(1)
        expect(compareValues(10, 0, 'asc')).toBe(1)
      })

      it('a === b 时返回 0', () => {
        expect(compareValues(1, 1, 'asc')).toBe(0)
        expect(compareValues(0, 0, 'asc')).toBe(0)
        expect(compareValues(-5, -5, 'asc')).toBe(0)
      })
    })

    describe('降序 (desc)', () => {
      it('a < b 时返回 1', () => {
        expect(compareValues(1, 2, 'desc')).toBe(1)
        expect(compareValues(-5, 0, 'desc')).toBe(1)
        expect(compareValues(0, 10, 'desc')).toBe(1)
      })

      it('a > b 时返回 -1', () => {
        expect(compareValues(2, 1, 'desc')).toBe(-1)
        expect(compareValues(0, -5, 'desc')).toBe(-1)
        expect(compareValues(10, 0, 'desc')).toBe(-1)
      })

      it('a === b 时返回 0', () => {
        expect(compareValues(1, 1, 'desc')).toBe(0)
        expect(compareValues(0, 0, 'desc')).toBe(0)
        expect(compareValues(-5, -5, 'desc')).toBe(0)
      })
    })

    describe('特殊数字值', () => {
      it('NaN 与 NaN 比较返回 0', () => {
        expect(compareValues(NaN, NaN, 'asc')).toBe(0)
        expect(compareValues(NaN, NaN, 'desc')).toBe(0)
      })

      it('NaN 与数字比较时，NaN 不小于也不大于任何值', () => {
        // NaN < 任何值 都是 false，NaN > 任何值 也是 false
        expect(compareValues(NaN, 1, 'asc')).toBe(0)
        expect(compareValues(1, NaN, 'asc')).toBe(0)
      })

      it('+0 和 -0 被视为相等', () => {
        expect(compareValues(+0, -0, 'asc')).toBe(0)
        expect(compareValues(-0, +0, 'asc')).toBe(0)
      })

      it('Infinity 比较', () => {
        expect(compareValues(Infinity, 100, 'asc')).toBe(1)
        expect(compareValues(100, Infinity, 'asc')).toBe(-1)
        expect(compareValues(Infinity, Infinity, 'asc')).toBe(0)
      })

      it('-Infinity 比较', () => {
        expect(compareValues(-Infinity, 100, 'asc')).toBe(-1)
        expect(compareValues(100, -Infinity, 'asc')).toBe(1)
        expect(compareValues(-Infinity, -Infinity, 'asc')).toBe(0)
      })
    })
  })

  describe('字符串比较', () => {
    describe('升序 (asc)', () => {
      it('按字典序比较', () => {
        expect(compareValues('a', 'b', 'asc')).toBe(-1)
        expect(compareValues('b', 'a', 'asc')).toBe(1)
        expect(compareValues('a', 'a', 'asc')).toBe(0)
      })

      it('区分大小写', () => {
        // 大写字母的 ASCII 码小于小写字母
        expect(compareValues('A', 'a', 'asc')).toBe(-1)
        expect(compareValues('a', 'A', 'asc')).toBe(1)
      })

      it('按长度逐字符比较', () => {
        expect(compareValues('apple', 'banana', 'asc')).toBe(-1)
        expect(compareValues('hello', 'world', 'asc')).toBe(-1)
        expect(compareValues('test', 'testing', 'asc')).toBe(-1)
      })
    })

    describe('降序 (desc)', () => {
      it('按字典序的反向比较', () => {
        expect(compareValues('a', 'b', 'desc')).toBe(1)
        expect(compareValues('b', 'a', 'desc')).toBe(-1)
        expect(compareValues('a', 'a', 'desc')).toBe(0)
      })
    })
  })

  describe('混合类型比较', () => {
    it('字符串数字与数字比较时发生隐式类型转换', () => {
      // '2' 会被转换为数字 2
      expect(compareValues('2', 10, 'asc')).toBe(-1)
      expect(compareValues(10, '2', 'asc')).toBe(1)
      expect(compareValues('10', 10, 'asc')).toBe(0)
    })

    it('无法转换的字符串与数字比较', () => {
      // 'abc' 转换为数字是 NaN
      expect(compareValues('abc', 1, 'asc')).toBe(0)
      expect(compareValues(1, 'abc', 'asc')).toBe(0)
    })
  })

  describe('边界值', () => {
    it('null 比较', () => {
      // null 会被转换为 0
      expect(compareValues(null, 0, 'asc')).toBe(0)
      expect(compareValues(null, -1, 'asc')).toBe(1)
      expect(compareValues(null, 1, 'asc')).toBe(-1)
    })

    it('undefined 比较', () => {
      // undefined 会被转换为 NaN
      expect(compareValues(undefined, 0, 'asc')).toBe(0)
      expect(compareValues(undefined, undefined, 'asc')).toBe(0)
    })

    it('空字符串比较', () => {
      // 空字符串会被转换为 0
      expect(compareValues('', 0, 'asc')).toBe(0)
      expect(compareValues('', '', 'asc')).toBe(0)
    })
  })

  describe('实际使用场景：数组排序', () => {
    it('数字数组升序排序', () => {
      const arr = [3, 1, 4, 1, 5, 9, 2, 6]
      const sorted = [...arr].sort((a, b) => compareValues(a, b, 'asc'))
      expect(sorted).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('数字数组降序排序', () => {
      const arr = [3, 1, 4, 1, 5, 9, 2, 6]
      const sorted = [...arr].sort((a, b) => compareValues(a, b, 'desc'))
      expect(sorted).toEqual([9, 6, 5, 4, 3, 2, 1, 1])
    })

    it('字符串数组升序排序', () => {
      const arr = ['banana', 'apple', 'Cherry', 'date']
      const sorted = [...arr].sort((a, b) => compareValues(a, b, 'asc'))
      expect(sorted).toEqual(['Cherry', 'apple', 'banana', 'date'])
    })

    it('字符串数组降序排序', () => {
      const arr = ['banana', 'apple', 'Cherry', 'date']
      const sorted = [...arr].sort((a, b) => compareValues(a, b, 'desc'))
      expect(sorted).toEqual(['date', 'banana', 'apple', 'Cherry'])
    })

    it('对象数组按属性排序', () => {
      const arr = [{ age: 30 }, { age: 25 }, { age: 35 }]
      const sorted = [...arr].sort((a, b) => compareValues(a.age, b.age, 'asc'))
      expect(sorted).toEqual([{ age: 25 }, { age: 30 }, { age: 35 }])
    })

    it('已排序数组保持稳定（相同元素不交换）', () => {
      const arr = [1, 1, 1]
      const sorted = [...arr].sort((a, b) => compareValues(a, b, 'asc'))
      expect(sorted).toEqual([1, 1, 1])
    })
  })
})
