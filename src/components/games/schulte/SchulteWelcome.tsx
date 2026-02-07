import React, { useState } from 'react';
import type { SchulteConfig } from '../../../types/games/schulte';
import { DifficultyLevel } from '../../../types/common';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';

interface SchulteWelcomeProps {
  onStart: (config: SchulteConfig) => void;
}

/**
 * Schulte 游戏欢迎/配置界面
 * 
 * 允许用户配置游戏参数：
 * - 网格尺寸（3x3、4x4、5x5）
 * - 难度级别
 */
export const SchulteWelcome: React.FC<SchulteWelcomeProps> = ({ onStart }) => {
  const [gridSize, setGridSize] = useState<3 | 4 | 5>(3);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');

  const handleStart = () => {
    const config: SchulteConfig = {
      gridSize,
      difficulty,
    };
    onStart(config);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-2xl mx-auto text-center bg-slate-50">
      {/* 标题 */}
      <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-2">
        舒尔特方格
      </h1>
      <p className="text-xl text-slate-500 mb-12">
        提升注意力和视觉搜索速度，按顺序点击数字
      </p>

      {/* 配置卡片 */}
      <Card className="w-full max-w-md mb-8">
        <div className="space-y-6 text-left">
          {/* 网格尺寸配置 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              网格尺寸
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGridSize(3)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  gridSize === 3
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                3×3
                <div className="text-xs opacity-75 mt-1">简单</div>
              </button>
              <button
                type="button"
                onClick={() => setGridSize(4)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  gridSize === 4
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                4×4
                <div className="text-xs opacity-75 mt-1">中等</div>
              </button>
              <button
                type="button"
                onClick={() => setGridSize(5)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  gridSize === 5
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                5×5
                <div className="text-xs opacity-75 mt-1">困难</div>
              </button>
            </div>
          </div>

          {/* 难度级别配置 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              难度级别
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDifficulty('easy')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  difficulty === 'easy'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                简单
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('medium')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  difficulty === 'medium'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                中等
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('hard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  difficulty === 'hard'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                困难
              </button>
            </div>
          </div>

          {/* 游戏说明 */}
          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-700 mb-2">游戏规则：</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>按照从 1 开始的顺序依次点击数字</li>
              <li>点击错误会增加错误计数</li>
              <li>完成所有数字后显示结果</li>
              <li>尽可能快速准确地完成</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 开始按钮 */}
      <Button
        variant="primary"
        size="lg"
        onClick={handleStart}
        className="shadow-lg hover:scale-105 active:scale-95"
      >
        开始游戏
      </Button>

      {/* 提示 */}
      <p className="mt-8 text-xs text-slate-400">
        使用鼠标或触摸屏点击数字
      </p>
    </div>
  );
};

export default SchulteWelcome;
