import type { StroopResult } from '../../../types/games/stroop';

/**
 * Stroop 游戏统计数据接口
 */
export interface StroopStatistics {
  totalRounds: number;
  correctAnswers: number;
  accuracy: number; // 0-100
  averageResponseTime: number; // 毫秒
  congruentResponseTime: number; // 一致试验的平均反应时间
  incongruentResponseTime: number; // 不一致试验的平均反应时间
  stroopEffect: number; // Stroop 效应（不一致 - 一致）
}

/**
 * 计算 Stroop 游戏统计数据
 * 
 * @param result Stroop 游戏结果
 * @returns 统计数据
 */
export function calculateStroopStatistics(result: StroopResult): StroopStatistics {
  const { trials, totalRounds, correctAnswers, accuracy, averageResponseTime } = result;
  
  // 分离一致和不一致试验
  const congruentTrials = trials.filter(t => {
    // 如果文字和颜色相同，则为一致试验
    const wordColor = getColorFromName(t.trial.word);
    return wordColor === t.trial.color;
  });
  
  const incongruentTrials = trials.filter(t => {
    // 如果文字和颜色不同，则为不一致试验
    const wordColor = getColorFromName(t.trial.word);
    return wordColor !== t.trial.color;
  });
  
  // 计算一致试验的平均反应时间（仅计算正确的）
  const correctCongruentTrials = congruentTrials.filter(t => t.isCorrect);
  const congruentResponseTime = correctCongruentTrials.length > 0
    ? correctCongruentTrials.reduce((sum, t) => sum + t.responseTime, 0) / correctCongruentTrials.length
    : 0;
  
  // 计算不一致试验的平均反应时间（仅计算正确的）
  const correctIncongruentTrials = incongruentTrials.filter(t => t.isCorrect);
  const incongruentResponseTime = correctIncongruentTrials.length > 0
    ? correctIncongruentTrials.reduce((sum, t) => sum + t.responseTime, 0) / correctIncongruentTrials.length
    : 0;
  
  // 计算 Stroop 效应
  const stroopEffect = incongruentResponseTime > 0 && congruentResponseTime > 0
    ? incongruentResponseTime - congruentResponseTime
    : 0;
  
  return {
    totalRounds,
    correctAnswers,
    accuracy: accuracy * 100, // 转换为百分比
    averageResponseTime,
    congruentResponseTime,
    incongruentResponseTime,
    stroopEffect,
  };
}

/**
 * 从颜色名称获取颜色值
 * 辅助函数，用于判断试验是否一致
 * 
 * @param colorName 颜色名称（中文）
 * @returns 颜色值
 */
function getColorFromName(colorName: string): string {
  const nameToColor: Record<string, string> = {
    '红色': 'red',
    '蓝色': 'blue',
    '绿色': 'green',
    '黄色': 'yellow',
    '紫色': 'purple',
  };
  
  return nameToColor[colorName] || '';
}

/**
 * 计算准确率
 * 
 * @param correctAnswers 正确答案数
 * @param totalRounds 总回合数
 * @returns 准确率（0-100）
 */
export function calculateAccuracy(correctAnswers: number, totalRounds: number): number {
  if (totalRounds === 0) return 0;
  return (correctAnswers / totalRounds) * 100;
}

/**
 * 计算平均反应时间
 * 
 * @param trials 试验数组
 * @returns 平均反应时间（毫秒）
 */
export function calculateAverageResponseTime(
  trials: Array<{ responseTime: number; isCorrect: boolean }>
): number {
  const correctTrials = trials.filter(t => t.isCorrect);
  if (correctTrials.length === 0) return 0;
  
  return correctTrials.reduce((sum, t) => sum + t.responseTime, 0) / correctTrials.length;
}

/**
 * 格式化时间（毫秒转为秒）
 * 
 * @param ms 毫秒
 * @returns 格式化的时间字符串
 */
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor(ms % 1000);
  return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
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
