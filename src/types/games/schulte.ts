import type { BaseGameConfig, BaseGameResult } from '../common';

/**
 * Schulte 游戏配置接口
 */
export interface SchulteConfig extends BaseGameConfig {
  gridSize: 3 | 4 | 5;   // 网格尺寸
}

/**
 * Schulte 网格单元格接口
 */
export interface SchulteCell {
  value: number;
  position: { row: number; col: number };
  isClicked: boolean;
}

/**
 * Schulte 游戏结果接口
 */
export interface SchulteResult extends BaseGameResult {
  gridSize: number;
  totalNumbers: number;
  errors: number;
  averageTimePerNumber: number; // 平均每个数字的查找时间（毫秒）
  clickSequence: {
    expectedNumber: number;
    clickedNumber: number;
    isCorrect: boolean;
    timestamp: number;
  }[];
}
