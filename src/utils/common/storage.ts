import type { BaseGameResult, GameHistory } from '../../types/common';

/**
 * 本地存储管理器
 * 负责游戏结果的持久化存储和检索
 * 
 * 功能：
 * - 保存游戏结果到 localStorage
 * - 检索游戏历史记录
 * - 管理最佳成绩
 * - 处理 localStorage 不可用的降级情况
 */
export class StorageManager {
  private readonly STORAGE_KEY_PREFIX = 'brain_training_';
  private memoryStorage: Map<string, GameHistory> = new Map();
  private isLocalStorageAvailable: boolean;

  constructor() {
    this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
    
    if (!this.isLocalStorageAvailable) {
      console.warn('localStorage is not available. Using in-memory storage as fallback.');
    }
  }

  /**
   * 检查 localStorage 是否可用
   */
  private checkLocalStorageAvailability(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 保存游戏结果
   * 
   * @param gameId - 游戏标识符
   * @param result - 游戏结果对象
   */
  saveGameResult(gameId: string, result: BaseGameResult): void {
    try {
      const history = this.getGameHistory(gameId);
      history.results.push(result);
      history.totalPlays += 1;
      history.lastPlayed = Date.now();
      
      // 更新最佳成绩
      if (result.score > history.bestScore) {
        history.bestScore = result.score;
      }
      
      this.setGameHistory(gameId, history);
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  }

  /**
   * 获取游戏历史记录
   * 
   * @param gameId - 游戏标识符
   * @returns 游戏历史记录对象
   */
  getGameHistory(gameId: string): GameHistory {
    const key = `${this.STORAGE_KEY_PREFIX}${gameId}_history`;
    
    try {
      // 如果 localStorage 可用，从 localStorage 读取
      if (this.isLocalStorageAvailable) {
        const data = localStorage.getItem(key);
        
        if (data) {
          const parsed = JSON.parse(data);
          // 验证数据完整性
          if (this.isValidGameHistory(parsed)) {
            return parsed;
          } else {
            console.warn('Invalid game history data, returning empty history');
          }
        }
      } else {
        // 从内存存储读取
        const memoryData = this.memoryStorage.get(key);
        if (memoryData) {
          return memoryData;
        }
      }
    } catch (error) {
      console.error('Failed to parse game history:', error);
    }
    
    // 返回空的历史记录
    return {
      gameId,
      results: [],
      bestScore: 0,
      totalPlays: 0,
      lastPlayed: 0,
    };
  }

  /**
   * 验证游戏历史记录数据的完整性
   */
  private isValidGameHistory(data: unknown): data is GameHistory {
    if (typeof data !== 'object' || data === null) {
      return false;
    }
    
    const history = data as Partial<GameHistory>;
    
    return (
      typeof history.gameId === 'string' &&
      Array.isArray(history.results) &&
      typeof history.bestScore === 'number' &&
      typeof history.totalPlays === 'number' &&
      typeof history.lastPlayed === 'number'
    );
  }

  /**
   * 设置游戏历史记录
   * 
   * @param gameId - 游戏标识符
   * @param history - 游戏历史记录对象
   */
  private setGameHistory(gameId: string, history: GameHistory): void {
    const key = `${this.STORAGE_KEY_PREFIX}${gameId}_history`;
    
    try {
      if (this.isLocalStorageAvailable) {
        // 保存到 localStorage
        localStorage.setItem(key, JSON.stringify(history));
      } else {
        // 保存到内存存储
        this.memoryStorage.set(key, history);
      }
    } catch (error) {
      console.error('Failed to save game history:', error);
      
      // 如果 localStorage 失败，尝试降级到内存存储
      if (this.isLocalStorageAvailable) {
        console.warn('Falling back to in-memory storage');
        this.isLocalStorageAvailable = false;
        this.memoryStorage.set(key, history);
      }
    }
  }

  /**
   * 清除游戏历史记录
   * 
   * @param gameId - 游戏标识符
   */
  clearGameHistory(gameId: string): void {
    const key = `${this.STORAGE_KEY_PREFIX}${gameId}_history`;
    
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.removeItem(key);
      } else {
        this.memoryStorage.delete(key);
      }
    } catch (error) {
      console.error('Failed to clear game history:', error);
    }
  }

  /**
   * 获取所有游戏的历史记录
   * 
   * @returns 所有游戏的历史记录数组
   */
  getAllGameHistories(): GameHistory[] {
    const histories: GameHistory[] = [];
    
    try {
      if (this.isLocalStorageAvailable) {
        // 从 localStorage 读取所有历史记录
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(this.STORAGE_KEY_PREFIX) && key.endsWith('_history')) {
            const gameId = key
              .replace(this.STORAGE_KEY_PREFIX, '')
              .replace('_history', '');
            histories.push(this.getGameHistory(gameId));
          }
        }
      } else {
        // 从内存存储读取所有历史记录
        this.memoryStorage.forEach((history) => {
          histories.push(history);
        });
      }
    } catch (error) {
      console.error('Failed to get all game histories:', error);
    }
    
    return histories;
  }
}

// 导出单例实例
export const storageManager = new StorageManager();
