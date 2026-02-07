import type { DifficultyLevel } from '../../types/common';
import type { StroopConfig } from '../../types/games/stroop';
import type { SchulteConfig } from '../../types/games/schulte';

/**
 * 验证结果：包含是否有效及字段级错误信息
 */
export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string>;
}

const VALID_DIFFICULTIES: DifficultyLevel[] = ['easy', 'medium', 'hard'];

/**
 * 验证难度级别是否有效
 */
export function isDifficultyLevel(value: unknown): value is DifficultyLevel {
  return typeof value === 'string' && VALID_DIFFICULTIES.includes(value as DifficultyLevel);
}

/**
 * 验证数值是否在闭区间内
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

/**
 * 验证 Stroop 游戏配置
 * - rounds: 10–100，步长 10
 * - difficulty: easy | medium | hard
 * - showTimer: boolean
 */
export function validateStroopConfig(config: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (typeof config !== 'object' || config === null) {
    return { valid: false, errors: { config: '配置对象无效' } };
  }

  const c = config as Record<string, unknown>;

  // rounds
  const rounds = c.rounds;
  if (typeof rounds !== 'number' || !Number.isInteger(rounds)) {
    errors.rounds = '回合数必须为整数';
  } else if (!isInRange(rounds, 10, 100)) {
    errors.rounds = '回合数应在 10–100 之间';
  } else if (rounds % 10 !== 0) {
    errors.rounds = '回合数应为 10 的倍数';
  }

  // difficulty
  if (!isDifficultyLevel(c.difficulty)) {
    errors.difficulty = '难度应为：简单、中等或困难';
  }

  // showTimer
  if (typeof c.showTimer !== 'boolean') {
    errors.showTimer = '是否显示计时器必须为是/否';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

/**
 * 验证 Schulte 游戏配置
 * - gridSize: 3 | 4 | 5
 * - difficulty: easy | medium | hard
 */
export function validateSchulteConfig(config: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (typeof config !== 'object' || config === null) {
    return { valid: false, errors: { config: '配置对象无效' } };
  }

  const c = config as Record<string, unknown>;

  // gridSize
  const gridSize = c.gridSize;
  if (typeof gridSize !== 'number' || !Number.isInteger(gridSize)) {
    errors.gridSize = '网格尺寸必须为整数';
  } else if (![3, 4, 5].includes(gridSize)) {
    errors.gridSize = '网格尺寸应为 3、4 或 5';
  }

  // difficulty
  if (!isDifficultyLevel(c.difficulty)) {
    errors.difficulty = '难度应为：简单、中等或困难';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

/**
 * 根据游戏 ID 验证配置
 */
export function validateGameConfig(
  gameId: string,
  config: unknown
): ValidationResult {
  switch (gameId) {
    case 'stroop':
      return validateStroopConfig(config);
    case 'schulte':
      return validateSchulteConfig(config);
    default:
      return { valid: true };
  }
}

/**
 * 类型守卫：确保配置通过 Stroop 验证后为 StroopConfig
 */
export function asValidStroopConfig(config: unknown): StroopConfig | null {
  const result = validateStroopConfig(config);
  return result.valid ? (config as StroopConfig) : null;
}

/**
 * 类型守卫：确保配置通过 Schulte 验证后为 SchulteConfig
 */
export function asValidSchulteConfig(config: unknown): SchulteConfig | null {
  const result = validateSchulteConfig(config);
  return result.valid ? (config as SchulteConfig) : null;
}
