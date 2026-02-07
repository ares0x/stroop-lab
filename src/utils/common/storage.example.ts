/**
 * StorageManager 使用示例
 * 
 * 此文件展示了如何使用 StorageManager 类来管理游戏历史记录
 */

import { storageManager } from './storage';
import type { BaseGameResult } from '../../types/common';

// 示例 1: 保存游戏结果
function exampleSaveGameResult() {
  const stroopResult: BaseGameResult = {
    gameId: 'stroop',
    timestamp: Date.now(),
    duration: 60000, // 60 秒
    score: 850,
  };
  
  storageManager.saveGameResult('stroop', stroopResult);
  console.log('Game result saved successfully');
}

// 示例 2: 获取游戏历史记录
function exampleGetGameHistory() {
  const history = storageManager.getGameHistory('stroop');
  
  console.log('Game History:', {
    gameId: history.gameId,
    totalPlays: history.totalPlays,
    bestScore: history.bestScore,
    lastPlayed: new Date(history.lastPlayed).toLocaleString(),
    resultsCount: history.results.length,
  });
  
  return history;
}

// 示例 3: 获取所有游戏的历史记录
function exampleGetAllHistories() {
  const allHistories = storageManager.getAllGameHistories();
  
  console.log('All Game Histories:');
  allHistories.forEach(history => {
    console.log(`- ${history.gameId}: ${history.totalPlays} plays, best score: ${history.bestScore}`);
  });
  
  return allHistories;
}

// 示例 4: 清除游戏历史记录
function exampleClearGameHistory() {
  storageManager.clearGameHistory('stroop');
  console.log('Game history cleared');
}

// 示例 5: 测试最佳成绩更新
function exampleBestScoreUpdate() {
  // 保存第一个结果
  storageManager.saveGameResult('test-game', {
    gameId: 'test-game',
    timestamp: Date.now(),
    duration: 30000,
    score: 500,
  });
  
  let history = storageManager.getGameHistory('test-game');
  console.log('First best score:', history.bestScore); // 应该是 500
  
  // 保存一个更高的分数
  storageManager.saveGameResult('test-game', {
    gameId: 'test-game',
    timestamp: Date.now(),
    duration: 25000,
    score: 750,
  });
  
  history = storageManager.getGameHistory('test-game');
  console.log('Updated best score:', history.bestScore); // 应该是 750
  
  // 保存一个更低的分数
  storageManager.saveGameResult('test-game', {
    gameId: 'test-game',
    timestamp: Date.now(),
    duration: 35000,
    score: 400,
  });
  
  history = storageManager.getGameHistory('test-game');
  console.log('Best score after lower score:', history.bestScore); // 应该仍然是 750
  
  // 清理测试数据
  storageManager.clearGameHistory('test-game');
}

// 导出示例函数供测试使用
export {
  exampleSaveGameResult,
  exampleGetGameHistory,
  exampleGetAllHistories,
  exampleClearGameHistory,
  exampleBestScoreUpdate,
};
