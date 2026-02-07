import { lazy } from 'react';
import type { GameMetadata } from '../types/common';
import { DifficultyLevel } from '../types/common';

/**
 * 游戏注册接口
 */
export interface GameRegistration {
  metadata: GameMetadata;
  component: React.LazyExoticComponent<React.ComponentType>;
  path: string;
}

/**
 * 注册的游戏列表
 * 
 * 添加新游戏的步骤：
 * 1. 在 pages/ 目录创建游戏页面组件
 * 2. 在此数组中添加游戏注册信息
 * 3. 路由会自动生成
 */
export const REGISTERED_GAMES: GameRegistration[] = [
  {
    metadata: {
      id: 'stroop',
      name: 'Stroop 测试',
      description: '测试你的认知控制能力，识别文字颜色而非文字内容',
      difficulty: DifficultyLevel.MEDIUM,
      estimatedDuration: 3,
      icon: '🎨',
      color: 'blue',
    },
    component: lazy(() => import('../pages/StroopPage')),
    path: '/stroop',
  },
  {
    metadata: {
      id: 'schulte',
      name: '舒尔特方格',
      description: '提升注意力和视觉搜索速度，按顺序点击数字',
      difficulty: DifficultyLevel.EASY,
      estimatedDuration: 2,
      icon: '🔢',
      color: 'green',
    },
    component: lazy(() => import('../pages/SchultePage')),
    path: '/schulte',
  },
];

/**
 * 根据 ID 获取游戏注册信息
 */
export function getGameById(id: string): GameRegistration | undefined {
  return REGISTERED_GAMES.find(game => game.metadata.id === id);
}

/**
 * 获取所有游戏的元数据
 */
export function getAllGameMetadata(): GameMetadata[] {
  return REGISTERED_GAMES.map(game => game.metadata);
}

/**
 * 根据难度级别获取游戏
 */
export function getGamesByDifficulty(difficulty: DifficultyLevel): GameRegistration[] {
  return REGISTERED_GAMES.filter(game => game.metadata.difficulty === difficulty);
}
