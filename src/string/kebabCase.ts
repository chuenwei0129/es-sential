/**
 * kebabCase - 转换为短横线命名
 * @param str - 源字符串
 * @returns 短横线命名字符串
 *
 * 实现思路：
 * 1. 处理小写后接大写（camelCase边界）：/(?<=[a-z])(?=[A-Z])/g
 * 2. 处理连续大写后接小写（ACRONYM边界）：/(?<=[A-Z])(?=[A-Z][a-z])/g
 * 3. 将所有分隔符替换为短横线
 * 4. 统一转小写
 */
export function kebabCase(str: string): string {
  if (!str) return ''

  return str
    // 处理连续大写后接小写的情况：HTML + Element → HTML + - + Element
    .replace(/(?<=[A-Z])(?=[A-Z][a-z])/g, '-')
    // 处理小写后接大写的情况：camelCase → camel-Case
    .replace(/(?<=[a-z])(?=[A-Z])/g, '-')
    // 按非字母数字分割
    .split(/[^a-zA-Z0-9]+/g)
    .filter(Boolean)
    .map((word) => word.toLowerCase())
    .join('-')
}
