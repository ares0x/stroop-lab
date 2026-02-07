/**
 * 游戏状态类型
 */
export type GameState = 'idle' | 'configuring' | 'playing' | 'completed';

/**
 * 游戏状态常量
 */
export const GameState = {
  IDLE: 'idle' as const,
  CONFIGURING: 'configuring' as const,
  PLAYING: 'playing' as const,
  COMPLETED: 'completed' as const,
} as const;

/**
 * 游戏难度级别类型
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * 游戏难度级别常量
 */
export const DifficultyLevel = {
  EASY: 'easy' as const,
  MEDIUM: 'medium' as const,
  HARD: 'hard' as const,
} as const;

/**
 * 游戏元数据接口
 */
export interface GameMetadata {
  id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // 分钟
  icon: string;
  color: string; // Tailwind 色值
}

/**
 * 游戏配置基础接口
 */
export interface BaseGameConfig {
  difficulty: DifficultyLevel;
}

/**
 * 游戏结果基础接口
 */
export interface BaseGameResult {
  gameId: string;
  timestamp: number;
  duration: number; // 毫秒
  score: number;
}

/**
 * 游戏会话接口
 */
export interface GameSession<TConfig, TResult> {
  id: string;
  gameId: string;
  state: GameState;
  config: TConfig;
  startTime?: number;
  endTime?: number;
  result?: TResult;
}

/**
 * 游戏引擎接口 - 所有游戏必须实现
 */
export interface GameEngine<TConfig extends BaseGameConfig, TResult extends BaseGameResult> {
  // 初始化游戏
  initialize(config: TConfig): void;
  
  // 开始游戏
  start(): void;
  
  // 处理用户输入
  handleInput(input: unknown): void;
  
  // 结束游戏
  end(): TResult;
  
  // 获取当前状态
  getState(): GameState;
  
  // 重置游戏
  reset(): void;
}

/**
 * 存储的游戏历史记录
 */
export interface GameHistory {
  gameId: string;
  results: BaseGameResult[];
  bestScore: number;
  totalPlays: number;
  lastPlayed: number;
}
