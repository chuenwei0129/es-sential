/**
 * 空操作函数，执行时什么也不做。
 *
 * 该函数在以下场景中非常有用：
 * - 作为默认回调函数，避免调用时需要反复检查 `if (callback)`
 * - 作为可选参数的默认值，简化调用方代码
 * - 在测试中作为桩（stub）函数，表示“我们不关心这个调用”
 * - 在高阶函数中作为占位符，满足函数签名要求但不执行任何逻辑
 *
 * @returns {void} 不返回任何值
 *
 * @example
 * 作为默认回调参数
 * function fetchData(onSuccess = noop, onError = noop) {
 *   任何时候都可以直接调用，无需检查 undefined
 *   onSuccess(data);
 *   onError(error);
 * }
 *
 * @example
 * 在数组迭代中临时忽略某些元素
 * const arr = [1, 2, 3];
 * arr.forEach(noop); // 什么都不做，只是遍历
 *
 * @example
 * 测试中替换真实回调
 * import { render, fireEvent } from '@testing-library/react';
 * const onClose = jest.fn();
 * render(<Modal onClose={onClose} />);
 * fireEvent.click(closeButton);
 * expect(onClose).toHaveBeenCalled(); // 真实回调测试
 * 如果不关心点击效果，可以传 noop：
 * render(<Modal onClose={noop} />);
 *
 * @example
 * 作为可选参数默认值，避免条件判断
 * function startAnimation(onFrame = noop) {
 *   let progress = 0;
 *   requestAnimationFrame(function tick() {
 *     progress += 0.1;
 *     onFrame(progress); // 始终安全
 *     if (progress < 1) requestAnimationFrame(tick);
 *   });
 * }
 *
 * @note
 * `noop` 函数的执行成本几乎为零，但它的价值在于消除条件分支和重复的空函数字面量。
 * 相比每次写 `() => {}`，`noop` 提供了一致的标识（引用相同），在某些性能敏感场景（如事件监听器）可以避免反复创建新函数。
 * 不过，在绝大多数业务代码中，这种微优化并不重要，主要好处是代码可读性和减少样板。
 */
export function noop(): void {}
