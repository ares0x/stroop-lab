import type { BaseGameConfig, BaseGameResult } from '../common';

/**
 * Stroop 游戏配置接口
 */
export interface StroopConfig extends BaseGameConfig {
  rounds: number;        // 回合数
  timeLimit?: number;    // 每回合时间限制（秒）
  showTimer: boolean;    // 是否显示计时器
}

/**
 * Stroop 测试试验接口
 */
export interface StroopTrial {
  word: string;          // 显示的文字
  color: string;         // 文字的颜色
  correctAnswer: string; // 正确答案
}

/**
 * Stroop 游戏结果接口
 */
export interface StroopResult extends BaseGameResult {
  totalRounds: number;
  correctAnswers: number;
  accuracy: number;      // 准确率 (0-1)
  averageResponseTime: number; // 平均反应时间（毫秒）
  trials: {
    trial: StroopTrial;
    userAnswer: string;
    isCorrect: boolean;
    responseTime: number;
  }[];
}
