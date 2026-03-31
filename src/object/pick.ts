/**
 * pick - 从对象中选取指定属性
 * @param object - 源对象
 * @param keys - 要选取的属性名数组
 * @returns 包含指定属性的新对象
 *
 * 实现思路：
 * 1. K extends keyof T 约束确保 keys 是对象的有效属性
 * 2. reduce 遍历 keys 构建新对象
 * 3. 返回 Pick<T, K> 类型（TypeScript 内置工具类型）
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    result[key] = object[key]
  }
  return result
}
