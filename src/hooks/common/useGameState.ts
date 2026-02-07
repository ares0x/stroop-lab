import { useState, useCallback } from 'react';
import type { BaseGameResult, GameState, GameSession } from '../../types/common';
import { GameState as GameStateEnum } from '../../types/common';
import { storageManager } from '../../utils/common/storage';

/**
 * 生成唯一的会话 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 游戏状态管理 Hook
 * 
 * 管理游戏的生命周期状态和会话信息
 * 
 * @template TConfig - 游戏配置类型
 * @template TResult - 游戏结果类型
 * 
 * @param gameId - 游戏标识符
 * @param initialConfig - 初始配置
 * 
 * @returns 游戏状态管理对象
 * 
 * @example
 * ```tsx
 * const {
 *   state,
 *   config,
 *   result,
 *   session,
 *   startGame,
 *   endGame,
 *   resetGame
 * } = useGameState('stroop', { difficulty: 'medium', rounds: 10 });
 * ```
 */
export function useGameState<TConfig, TResult>(
  gameId: string,
  initialConfig: TConfig
) {
  const [state, setState] = useState<GameState>(GameStateEnum.IDLE);
  const [config, setConfig] = useState<TConfig>(initialConfig);
  const [result, setResult] = useState<TResult | null>(null);
  const [session, setSession] = useState<GameSession<TConfig, TResult> | null>(null);

  /**
   * 开始游戏
   * 
   * 创建新的游戏会话并将状态转换为 PLAYING
   * 
   * @param gameConfig - 游戏配置
   */
  const startGame = useCallback((gameConfig: TConfig) => {
    setConfig(gameConfig);
    setState(GameStateEnum.PLAYING);
    setSession({
      id: generateId(),
      gameId,
      state: GameStateEnum.PLAYING,
      config: gameConfig,
      startTime: Date.now(),
    });
  }, [gameId]);

  /**
   * 结束游戏
   * 
   * 保存游戏结果并将状态转换为 COMPLETED
   * 
   * @param gameResult - 游戏结果
   */
  const endGame = useCallback((gameResult: TResult) => {
    try {
      storageManager.saveGameResult(gameId, gameResult as unknown as BaseGameResult);
    } catch (e) {
      console.warn('Failed to save game result:', e);
    }
    setState(GameStateEnum.COMPLETED);
    setResult(gameResult);
    if (session) {
      setSession({
        ...session,
        state: GameStateEnum.COMPLETED,
        endTime: Date.now(),
        result: gameResult,
      });
    }
  }, [gameId, session]);

  /**
   * 重置游戏
   * 
   * 清除游戏结果和会话，将状态重置为 IDLE
   */
  const resetGame = useCallback(() => {
    setState(GameStateEnum.IDLE);
    setResult(null);
    setSession(null);
  }, []);

  return {
    state,
    config,
    result,
    session,
    startGame,
    endGame,
    resetGame,
  };
}
