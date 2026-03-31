/**
 * 主入口测试 - 确保所有导出正确
 */

import { describe, expect, it } from 'vitest'
import * as es from './index'

describe('index exports', () => {
  it('should export all array utilities', () => {
    expect(typeof es.chunk).toBe('function')
    expect(typeof es.uniq).toBe('function')
  })

  it('should export all object utilities', () => {
    expect(typeof es.pick).toBe('function')
    expect(typeof es.omit).toBe('function')
  })

  it('should export all string utilities', () => {
    expect(typeof es.camelCase).toBe('function')
    expect(typeof es.kebabCase).toBe('function')
  })
})
