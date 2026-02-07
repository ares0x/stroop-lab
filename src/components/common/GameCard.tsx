import React from 'react';
import { Link } from 'react-router-dom';
import type { GameMetadata } from '../../types/common';
import { Card } from './Card';

export interface GameCardProps {
  game: GameMetadata;
  path: string;
}

/**
 * 游戏卡片组件
 * 
 * 显示游戏的基本信息，点击后导航到游戏页面
 * 
 * Props:
 * - game: 游戏元数据
 * - path: 游戏路由路径
 */
export const GameCard: React.FC<GameCardProps> = React.memo(({ game, path }) => {
  // 难度级别颜色映射
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  // 游戏颜色映射（用于图标背景）
  const gameColors = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
    slate: 'bg-slate-100',
  };

  return (
    <Link
      to={path}
      className="block h-full group"
      aria-label={`进入游戏：${game.name}`}
    >
      <Card
        hoverable
        className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300"
      >
        <div className="flex flex-col h-full">
          {/* 游戏图标 */}
          <div className="mb-4">
            <div
              className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl text-2xl md:text-3xl ${
                gameColors[game.color as keyof typeof gameColors] || gameColors.slate
              }`}
            >
              {game.icon}
            </div>
          </div>

          {/* 游戏名称 */}
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
            {game.name}
          </h3>

          {/* 游戏描述 */}
          <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3">
            {game.description}
          </p>

          {/* 元信息 + 明确 CTA */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full font-semibold ${
                  difficultyColors[game.difficulty]
                }`}
              >
                {game.difficulty === 'easy' && '简单'}
                {game.difficulty === 'medium' && '中等'}
                {game.difficulty === 'hard' && '困难'}
              </span>
              <span className="text-slate-500">
                约 {game.estimatedDuration} 分钟
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium group-hover:text-slate-900 group-hover:gap-1.5 transition-all">
              开始训练
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
});
GameCard.displayName = 'GameCard';

export default GameCard;
