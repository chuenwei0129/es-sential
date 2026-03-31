/**
 * omit - 从对象中排除指定属性
 * @param object - 源对象
 * @param keys - 要排除的属性名数组
 * @returns 不包含指定属性的新对象
 *
 * 实现思路：
 * 1. 使用 Object.keys 获取所有键
 * 2. filter 过滤掉要排除的键
 * 3. for...of 构建新对象
 * 4. 返回 Omit<T, K> 类型
 */
export function omit<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Omit<T, K> {
  const keySet = new Set(keys as (string | number | symbol)[])
  const result = {} as Omit<T, K>
  for (const key in object) {
    if (!keySet.has(key)) {
      result[key] = object[key]
    }
  }
  return result
}
