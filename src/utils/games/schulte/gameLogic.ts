import type { SchulteCell } from '../../../types/games/schulte';

/**
 * 生成 Schulte 网格
 * 使用 Fisher-Yates 洗牌算法随机排列数字
 * 
 * @param size 网格尺寸（3、4 或 5）
 * @returns 包含随机排列数字的网格单元格数组
 */
export function generateSchulteGrid(size: 3 | 4 | 5): SchulteCell[] {
  const totalCells = size * size;
  const numbers = Array.from({ length: totalCells }, (_, i) => i + 1);
  
  // Fisher-Yates 洗牌算法
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  // 将数字转换为网格单元格
  return numbers.map((value, index) => ({
    value,
    position: {
      row: Math.floor(index / size),
      col: index % size,
    },
    isClicked: false,
  }));
}

/**
 * 计算 Schulte 游戏分数
 * 
 * 分数计算公式：
 * - 基础分数：1000 分
 * - 时间惩罚：每 100ms 扣 1 分
 * - 错误惩罚：每个错误扣 50 分
 * 
 * @param duration 完成时间（毫秒）
 * @param errors 错误次数
 * @returns 计算得到的分数（最小为 0）
 */
export function calculateSchulteScore(
  duration: number,
  errors: number
): number {
  const baseScore = 1000;
  const timePenalty = duration / 100; // 每 100ms 扣 1 分
  const errorPenalty = errors * 50;   // 每个错误扣 50 分
  
  return Math.max(0, Math.round(baseScore - timePenalty - errorPenalty));
}

/**
 * 验证点击是否正确
 * 
 * @param clickedValue 点击的数字
 * @param expectedValue 期望的数字
 * @returns 是否正确
 */
export function validateClick(clickedValue: number, expectedValue: number): boolean {
  return clickedValue === expectedValue;
}

/**
 * 检查游戏是否完成
 * 
 * @param currentNumber 当前期望的数字
 * @param totalNumbers 总数字数量
 * @returns 是否完成
 */
export function isGameComplete(currentNumber: number, totalNumbers: number): boolean {
  return currentNumber > totalNumbers;
}

/**
 * 获取网格尺寸对应的总数字数量
 * 
 * @param size 网格尺寸
 * @returns 总数字数量
 */
export function getTotalNumbers(size: 3 | 4 | 5): number {
  return size * size;
}
