import React, { useState } from 'react';
import type { StroopConfig } from '../../../types/games/stroop';
import { DifficultyLevel } from '../../../types/common';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';

interface StroopWelcomeProps {
  onStart: (config: StroopConfig) => void;
}

/**
 * Stroop 游戏欢迎/配置界面
 * 
 * 允许用户配置游戏参数：
 * - 回合数
 * - 难度级别
 * - 是否显示计时器
 * 
 * 保留原有的配置选项和 UI 风格
 */
export const StroopWelcome: React.FC<StroopWelcomeProps> = ({ onStart }) => {
  const [rounds, setRounds] = useState(20);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [showTimer, setShowTimer] = useState(true);

  const handleStart = () => {
    const config: StroopConfig = {
      rounds,
      difficulty,
      showTimer,
    };
    onStart(config);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-2xl mx-auto text-center bg-slate-50">
      {/* 标题 */}
      <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-2">
        Stroop 测试
      </h1>
      <p className="text-xl text-slate-500 mb-12">
        测试你的认知控制能力，识别文字颜色而非文字内容
      </p>

      {/* 配置卡片 */}
      <Card className="w-full max-w-md mb-8">
        <div className="space-y-6 text-left">
          {/* 回合数配置 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              回合数：{' '}
              <span className="text-blue-600">{rounds}</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>短 (10)</span>
              <span>长 (100)</span>
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

          {/* 显示计时器选项 */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              显示计时器
            </label>
            <button
              type="button"
              onClick={() => setShowTimer(!showTimer)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showTimer ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showTimer ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
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
        开始测试
      </Button>

      {/* 键盘提示 */}
      <p className="mt-8 text-xs text-slate-400">
        使用键盘 <b>R / G / B / Y / P</b> 或鼠标点击按钮
      </p>
    </div>
  );
};

export default StroopWelcome;
