/**
 * 比较两个值是否相等，使用 **SameValueZero** 算法。
 *
 * 该算法是 JavaScript 中 `Map` 的键比较、`Set` 的值去重所采用的内部相等性判断规则。
 * 它与严格相等（`===`）和 `Object.is` 的区别如下：
 *
 * | 比较               | `===`      | `Object.is` | `isSameValueZero` |
 * | ----------------- | ---------- | ----------- | ----------------- |
 * | `NaN === NaN`     | `false`    | `true`      | `true`            |
 * | `-0 === +0`       | `true`     | `false`     | `true`            |
 * | 其他（同值性）     | 一致       | 一致        | 一致              |
 *
 * 因此，`isSameValueZero` 可以看作是 `Object.is` 但将 `-0` 和 `+0` 视为相等，
 * 正好对应 `Map` / `Set` 的行为：
 * - `new Set([-0, +0])` 只含有一个元素（`-0` 或 `+0`，保留先添加的）
 * - `new Map().set(-0, 1).set(+0, 2)` 最终键为 `-0`，值为 `2`
 *
 * @param value  - 待比较的第一个值
 * @param other  - 待比较的第二个值
 * @returns 若两个值满足 SameValueZero 相等则返回 `true`，否则返回 `false`
 *
 * @example
 * 基本类型比较
 * isSameValueZero(1, 1);               // true
 * isSameValueZero('a', 'a');           // true
 *
 * NaN 比较
 * isSameValueZero(NaN, NaN);           // true
 *
 * 零值比较（SameValueZero 认为 -0 和 +0 相等）
 * isSameValueZero(-0, +0);             // true
 *
 * 对象比较（引用不同则不等）
 * isSameValueZero({}, {});             // false
 * isSameValueZero('a', Object('a'));   // false
 *
 * 模拟 Map 键比较
 * const map = new Map();
 * map.set(-0, 'minus');
 * map.set(+0, 'plus');
 * map.size;                            // 1，键被覆盖
 * isSameValueZero(-0, +0);             // true，与 Map 内部逻辑一致
 */

export function isSameValueZero(value: unknown, other: unknown): boolean {
  // SameValueZero 核心逻辑：
  // 1. 严格相等可覆盖大部分情况（包括 -0 === +0 为 true）
  // 2. 特殊处理 NaN：两个 NaN 之间返回 true（因为 NaN === NaN 为 false）
  return value === other || (Number.isNaN(value) && Number.isNaN(other))
}
