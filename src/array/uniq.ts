/**
 * uniq - 数组去重
 * @param array - 源数组
 * @returns 去重后的数组
 *
 * 实现思路：
 * 1. 使用 Set 数据结构天然去重的特性
 * 2. Array.from(Set) 将 Set 转回数组
 * 3. Set 会保留首次出现的顺序
 */
export function uniq<T>(array: readonly T[]): T[] {
  return Array.from(new Set(array))
}
