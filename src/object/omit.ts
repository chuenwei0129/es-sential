/**
 * omit - 从对象中排除指定属性
 * @param object - 源对象
 * @param keys - 要排除的属性名数组
 * @returns 不包含指定属性的新对象
 *
 * 实现思路：
 * 1. 使用 Set 快速查找要排除的 key
 * 2. 使用 Object.keys 获取所有键
 * 3. 过滤掉要排除的键
 * 4. 用 reduce 构建新对象
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Omit<T, K> {
  const keySet = new Set<keyof T>(keys)
  return Object.keys(object).reduce<Record<string, unknown>>((result, key) => {
    if (!keySet.has(key)) {
      result[key] = object[key]
    }
    return result
  }, {}) as Omit<T, K>
}
