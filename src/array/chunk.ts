/**
 * chunk - 将数组分割成指定大小的块
 * @param array - 源数组
 * @param size - 每块大小
 * @returns 分割后的二维数组
 *
 * 实现思路：
 * 1. 用泛型 T 支持任意类型
 * 2. 步长循环：for (let i = 0; i < array.length; i += size)
 * 3. slice(i, i + size) 截取每块，自动处理边界
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
