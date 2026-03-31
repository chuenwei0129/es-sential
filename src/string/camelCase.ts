/**
 * camelCase - 转换为驼峰命名
 * @param str - 源字符串
 * @returns 驼峰命名字符串
 *
 * 实现思路：
 * 1. 按非字母数字字符分割：/[^a-zA-Z0-9]+/g
 * 2. filter(Boolean) 过滤空字符串
 * 3. map 处理每个单词：首字母大写其余小写
 * 4. join 拼接，首字母小写
 */
export function camelCase(str: string): string {
  if (!str) return ''

  const words = str.split(/[^a-zA-Z0-9]+/g).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) {
    return words[0]!.toLowerCase()
  }

  return (
    words[0]!.toLowerCase() +
    words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  )
}
