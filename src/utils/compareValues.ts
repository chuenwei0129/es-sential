/**
 * 根据指定的排序顺序（升序或降序）比较两个值。
 *
 * 该比较函数可直接用于数组的 `sort` 方法，例如：
 * - 升序：`[...arr].sort((a, b) => compareValues(a, b, 'asc'))`
 * - 降序：`[...arr].sort((a, b) => compareValues(a, b, 'desc'))`
 *
 * **比较规则**：
 * - 使用 JavaScript 原生的 `<` 和 `>` 运算符，遵循标准的关系比较算法。
 * - 当比较不同类型时，会发生隐式类型转换（例如，字符串与数字比较时，字符串会先转换为数字）。
 * - `NaN` 与任何值（包括自身）比较均返回 `false`，因此两个 `NaN` 之间会返回 `0`（视为相等）。
 * - `null` 会被转换为 `0`，`undefined` 会被转换为 `NaN`，可能导致非预期的结果。
 *
 * **注意事项**：
 * - 若需要处理 `NaN`、`null`、`undefined` 等特殊值并明确定义排序顺序（如将 `NaN` 排在末尾），
 *   建议先对数组进行预处理，或使用更复杂的比较逻辑。
 * - 对于对象，`<` 和 `>` 会调用其 `valueOf` / `toString` 方法，结果可能不符合直观预期。
 *
 * @param a - 待比较的第一个值
 * @param b - 待比较的第二个值
 * @param order - 排序顺序，`'asc'` 表示升序，`'desc'` 表示降序
 * @returns 返回 `-1`、`1` 或 `0`，表示 `a` 相对于 `b` 在指定顺序下的位置：
 *          - `-1`：`a` 应排在 `b` 之前
 *          - `1`：`a` 应排在 `b` 之后
 *          - `0`：`a` 与 `b` 视为相等，顺序不变
 *
 * @example
 * 数字升序
 * compareValues(1, 2, 'asc');   // -1
 * compareValues(2, 1, 'asc');   // 1
 * compareValues(1, 1, 'asc');   // 0
 *
 * 数字降序
 * compareValues(1, 2, 'desc');  // 1
 * compareValues(2, 1, 'desc');  // -1
 *
 * 字符串比较（基于字典序）
 * compareValues('a', 'b', 'asc');  // -1
 * compareValues('b', 'a', 'asc');  // 1
 *
 * 混合类型：字符串 "2" 与数字 10 比较，字符串被转换为数字
 * compareValues('2', 10, 'asc');   // -1（因为 2 < 10）
 *
 * 特殊值：NaN 与 NaN 比较返回 0
 * compareValues(NaN, NaN, 'asc');  // 0
 *
 * 数组排序示例
 * const numbers = [3, 1, 4, 1, 5];
 * numbers.sort((a, b) => compareValues(a, b, 'asc'));
 * console.log(numbers); // [1, 1, 3, 4, 5]
 *
 * 降序排序
 * const words = ['banana', 'apple', 'cherry'];
 * words.sort((a, b) => compareValues(a, b, 'desc'));
 * console.log(words); // ['cherry', 'banana', 'apple']
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareValues(a: any, b: any, order: 'asc' | 'desc'): 0 | -1 | 1 {
  // 核心比较逻辑：
  // - 使用 < 和 > 运算符进行关系比较（支持隐式类型转换）
  // - 根据 order 参数决定返回 -1 还是 1（升序时 a<b 返回 -1，降序时返回 1）
  if (a < b) {
    return order === 'asc' ? -1 : 1
  }
  if (a > b) {
    return order === 'asc' ? 1 : -1
  }
  return 0
}
