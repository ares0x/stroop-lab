import type { StroopTrial } from '../../../types/games/stroop';

/**
 * 可用的颜色列表
 */
export const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'] as const;

/**
 * 颜色名称（中文）
 */
export const COLOR_NAMES = ['红色', '蓝色', '绿色', '黄色', '紫色'] as const;

/**
 * 颜色类型
 */
export type ColorType = typeof COLORS[number];

/**
 * 颜色名称类型
 */
export type ColorNameType = typeof COLOR_NAMES[number];

/**
 * 颜色到颜色名称的映射
 */
export const COLOR_TO_NAME: Record<ColorType, ColorNameType> = {
  red: '红色',
  blue: '蓝色',
  green: '绿色',
  yellow: '黄色',
  purple: '紫色',
};

/**
 * 颜色到 CSS 颜色值的映射
 */
export const COLOR_TO_CSS: Record<ColorType, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
};

/**
 * 生成单个 Stroop 试验
 * 保留原有逻辑：随机选择文字和颜色
 * 
 * @returns StroopTrial 对象
 */
export function generateStroopTrial(): StroopTrial {
  const wordIndex = Math.floor(Math.random() * COLOR_NAMES.length);
  const colorIndex = Math.floor(Math.random() * COLORS.length);
  
  return {
    word: COLOR_NAMES[wordIndex],
    color: COLORS[colorIndex],
    correctAnswer: COLORS[colorIndex],
  };
}

/**
 * 计算 Stroop 游戏分数
 * 保留原有计分规则：准确率 * 1000 - 平均反应时间 / 10
 * 
 * @param trials 试验结果数组
 * @returns 计算得到的分数
 */
export function calculateStroopScore(
  trials: Array<{
    isCorrect: boolean;
    responseTime: number;
  }>
): number {
  if (trials.length === 0) return 0;
  
  const correctCount = trials.filter(t => t.isCorrect).length;
  const accuracy = correctCount / trials.length;
  const avgResponseTime = trials.reduce((sum, t) => sum + t.responseTime, 0) / trials.length;
  
  // 分数计算：准确率 * 1000 - 平均反应时间 / 10
  return Math.max(0, Math.round(accuracy * 1000 - avgResponseTime / 10));
}

/**
 * 获取颜色的 CSS 值
 * 
 * @param color 颜色类型
 * @returns CSS 颜色值
 */
export function getColorValue(color: ColorType): string {
  return COLOR_TO_CSS[color];
}

/**
 * 获取颜色的中文名称
 * 
 * @param color 颜色类型
 * @returns 中文颜色名称
 */
export function getColorName(color: ColorType): ColorNameType {
  return COLOR_TO_NAME[color];
}
