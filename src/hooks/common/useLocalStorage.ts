import { useState, useEffect, useCallback } from 'react';
import { storageManager } from '../../utils/common/storage';
import type { BaseGameResult, GameHistory } from '../../types/common';

/**
 * 本地存储 Hook
 * 
 * 封装 StorageManager，提供 React Hook 接口用于组件中使用
 * 自动处理游戏历史记录的读取、保存和更新
 * 
 * @param gameId - 游戏标识符
 * 
 * @returns 本地存储管理对象
 * 
 * @example
 * ```tsx
 * const {
 *   history,
 *   saveResult,
 *   clearHistory,
 *   refreshHistory
 * } = useLocalStorage('stroop');
 * 
 * // 保存游戏结果
 * saveResult({
 *   gameId: 'stroop',
 *   timestamp: Date.now(),
 *   duration: 60000,
 *   score: 850
 * });
 * 
 * // 访问历史记录
 * console.log(history.bestScore);
 * console.log(history.totalPlays);
 * ```
 */
export function useLocalStorage(gameId: string) {
  const [history, setHistory] = useState<GameHistory>(() => 
    storageManager.getGameHistory(gameId)
  );

  /**
   * 刷新历史记录
   * 
   * 从存储中重新加载最新的历史记录
   */
  const refreshHistory = useCallback(() => {
    const updatedHistory = storageManager.getGameHistory(gameId);
    setHistory(updatedHistory);
  }, [gameId]);

  /**
   * 保存游戏结果
   * 
   * 将游戏结果保存到本地存储并更新状态
   * 
   * @param result - 游戏结果对象
   */
  const saveResult = useCallback((result: BaseGameResult) => {
    storageManager.saveGameResult(gameId, result);
    refreshHistory();
  }, [gameId, refreshHistory]);

  /**
   * 清除历史记录
   * 
   * 删除该游戏的所有历史记录并重置状态
   */
  const clearHistory = useCallback(() => {
    storageManager.clearGameHistory(gameId);
    refreshHistory();
  }, [gameId, refreshHistory]);

  /**
   * 当 gameId 改变时，重新加载历史记录
   */
  useEffect(() => {
    refreshHistory();
  }, [gameId, refreshHistory]);

  return {
    history,
    saveResult,
    clearHistory,
    refreshHistory,
  };
}

/**
 * 获取所有游戏历史记录的 Hook
 * 
 * 用于显示所有游戏的统计信息
 * 
 * @returns 所有游戏历史记录管理对象
 * 
 * @example
 * ```tsx
 * const { allHistories, refreshAllHistories } = useAllGameHistories();
 * 
 * // 显示所有游戏的统计
 * allHistories.forEach(history => {
 *   console.log(`${history.gameId}: ${history.totalPlays} plays`);
 * });
 * ```
 */
export function useAllGameHistories() {
  const [allHistories, setAllHistories] = useState<GameHistory[]>(() =>
    storageManager.getAllGameHistories()
  );

  /**
   * 刷新所有历史记录
   */
  const refreshAllHistories = useCallback(() => {
    const histories = storageManager.getAllGameHistories();
    setAllHistories(histories);
  }, []);

  return {
    allHistories,
    refreshAllHistories,
  };
}
