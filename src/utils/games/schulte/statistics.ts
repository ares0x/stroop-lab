import type { SchulteResult } from '../../../types/games/schulte';

/**
 * Schulte 游戏统计数据接口
 */
export interface SchulteStatistics {
  gridSize: number;
  totalNumbers: number;
  completionTime: number; // 毫秒
  errors: number;
  averageTimePerNumber: number; // 毫秒
  accuracy: number; // 百分比 (0-100)
  clicksPerNumber: number; // 平均每个数字的点击次数
}

/**
 * 计算 Schulte 游戏统计数据
 * 
 * @param result Schulte 游戏结果
 * @returns 统计数据
 */
export function calculateSchulteStatistics(result: SchulteResult): SchulteStatistics {
  const { gridSize, totalNumbers, duration, errors, clickSequence } = result;
  
  // 计算平均每个数字的查找时间
  const averageTimePerNumber = duration / totalNumbers;
  
  // 计算准确率
  const correctClicks = clickSequence.filter(c => c.isCorrect).length;
  const totalClicks = clickSequence.length;
  const accuracy = totalClicks > 0 ? (correctClicks / totalClicks) * 100 : 0;
  
  // 计算平均每个数字的点击次数
  const clicksPerNumber = totalClicks / totalNumbers;
  
  return {
    gridSize,
    totalNumbers,
    completionTime: duration,
    errors,
    averageTimePerNumber,
    accuracy,
    clicksPerNumber,
  };
}

/**
 * 计算完成时间（格式化为秒）
 * 
 * @param ms 毫秒
 * @returns 格式化的时间字符串
 */
export function formatCompletionTime(ms: number): string {
  const seconds = (ms / 1000).toFixed(2);
  return `${seconds}s`;
}

/**
 * 计算平均每个数字的查找时间
 * 
 * @param totalTime 总时间（毫秒）
 * @param totalNumbers 总数字数量
 * @returns 平均时间（毫秒）
 */
export function calculateAverageTimePerNumber(
  totalTime: number,
  totalNumbers: number
): number {
  if (totalNumbers === 0) return 0;
  return totalTime / totalNumbers;
}

/**
 * 计算准确率
 * 
 * @param correctClicks 正确点击次数
 * @param totalClicks 总点击次数
 * @returns 准确率（0-100）
 */
export function calculateAccuracy(correctClicks: number, totalClicks: number): number {
  if (totalClicks === 0) return 0;
  return (correctClicks / totalClicks) * 100;
}

/**
 * 格式化准确率
 * 
 * @param accuracy 准确率（0-100）
 * @returns 格式化的准确率字符串
 */
export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy)}%`;
}

/**
 * 获取性能评级
 * 基于完成时间和错误次数
 * 
 * @param duration 完成时间（毫秒）
 * @param errors 错误次数
 * @param gridSize 网格尺寸
 * @returns 评级（优秀、良好、一般、需要提高）
 */
export function getPerformanceRating(
  duration: number,
  errors: number,
  gridSize: number
): '优秀' | '良好' | '一般' | '需要提高' {
  const totalNumbers = gridSize * gridSize;
  const avgTimePerNumber = duration / totalNumbers;
  
  // 根据网格尺寸设定不同的标准
  let excellentThreshold: number;
  let goodThreshold: number;
  let fairThreshold: number;
  
  switch (gridSize) {
    case 3:
      excellentThreshold = 800;  // 每个数字 < 800ms
      goodThreshold = 1200;      // 每个数字 < 1200ms
      fairThreshold = 1800;      // 每个数字 < 1800ms
      break;
    case 4:
      excellentThreshold = 1000; // 每个数字 < 1000ms
      goodThreshold = 1500;      // 每个数字 < 1500ms
      fairThreshold = 2200;      // 每个数字 < 2200ms
      break;
    case 5:
      excellentThreshold = 1200; // 每个数字 < 1200ms
      goodThreshold = 1800;      // 每个数字 < 1800ms
      fairThreshold = 2500;      // 每个数字 < 2500ms
      break;
    default:
      excellentThreshold = 1000;
      goodThreshold = 1500;
      fairThreshold = 2000;
  }
  
  // 如果有太多错误，降低评级
  if (errors > totalNumbers * 0.3) {
    return '需要提高';
  }
  
  if (avgTimePerNumber < excellentThreshold && errors <= 2) {
    return '优秀';
  } else if (avgTimePerNumber < goodThreshold && errors <= 5) {
    return '良好';
  } else if (avgTimePerNumber < fairThreshold) {
    return '一般';
  } else {
    return '需要提高';
  }
}
