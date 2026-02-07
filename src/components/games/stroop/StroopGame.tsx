import React, { useEffect } from 'react';
import type { StroopTrial } from '../../../types/games/stroop';
import { 
  getColorValue, 
  type ColorType 
} from '../../../utils/games/stroop/gameLogic';

interface StroopGameProps {
  trial: StroopTrial;
  progress: { current: number; total: number };
  onAnswer: (color: ColorType) => void;
}

/**
 * 颜色按钮配置
 */
const COLOR_BUTTONS: Array<{
  color: ColorType;
  label: string;
  key: string;
  keyCode: string;
}> = [
  { color: 'red', label: '红色', key: 'R', keyCode: 'KeyR' },
  { color: 'green', label: '绿色', key: 'G', keyCode: 'KeyG' },
  { color: 'blue', label: '蓝色', key: 'B', keyCode: 'KeyB' },
  { color: 'yellow', label: '黄色', key: 'Y', keyCode: 'KeyY' },
  { color: 'purple', label: '紫色', key: 'P', keyCode: 'KeyP' },
];

/**
 * Stroop 游戏界面组件
 * 
 * 显示当前试验的文字和颜色，接收用户输入
 * 保留键盘和鼠标双输入支持
 */
export const StroopGame: React.FC<StroopGameProps> = ({
  trial,
  progress,
  onAnswer,
}) => {
  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const match = COLOR_BUTTONS.find((btn) => btn.keyCode === e.code);
      
      if (match) {
        e.preventDefault();
        onAnswer(match.color);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAnswer]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white select-none">
      {/* 进度条 */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-100">
        <div
          className="h-full bg-slate-900 transition-all duration-300 ease-out"
          style={{
            width: `${(progress.current / progress.total) * 100}%`,
          }}
        />
      </div>

      {/* 回合计数器 */}
      <div className="text-slate-400 text-sm font-mono mb-12">
        回合 {progress.current} / {progress.total}
      </div>

      {/* 刺激词 - 显示文字和颜色 */}
      <div className="mb-24 flex flex-col items-center">
        <h1
          className="text-9xl font-black transition-colors duration-100"
          style={{ color: getColorValue(trial.color as ColorType) }}
        >
          {trial.word}
        </h1>
        <p className="mt-4 text-slate-400 text-sm">
          选择 <b className="text-slate-900">文字颜色</b>（不是文字内容）
        </p>
      </div>

      {/* 颜色按钮 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl px-4">
        {COLOR_BUTTONS.map((btn) => (
          <button
            key={btn.color}
            type="button"
            onClick={() => onAnswer(btn.color)}
            className="h-24 rounded-2xl border-2 border-slate-200 font-bold text-xl transition-all active:scale-95 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            style={{
              minWidth: '44px',
              minHeight: '44px',
            }}
            aria-label={`选择${btn.label} (${btn.key})`}
          >
            {/* 颜色标签 */}
            <span className="z-10">{btn.label}</span>

            {/* 键盘快捷键提示 */}
            <span className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono border border-slate-200 px-1.5 rounded bg-slate-50" aria-hidden>
              {btn.key}
            </span>

            {/* 点击效果 */}
            <div className="absolute inset-0 bg-slate-100 opacity-0 group-active:opacity-100 transition-opacity" aria-hidden />
          </button>
        ))}
      </div>

      {/* 键盘提示 (Requirements 11.3) */}
      <div className="mt-8 text-xs text-slate-400" role="status" aria-label="键盘快捷键说明">
        <p>键盘快捷键：<kbd className="font-mono px-1 rounded bg-slate-100">R</kbd> 红色 · <kbd className="font-mono px-1 rounded bg-slate-100">G</kbd> 绿色 · <kbd className="font-mono px-1 rounded bg-slate-100">B</kbd> 蓝色 · <kbd className="font-mono px-1 rounded bg-slate-100">Y</kbd> 黄色 · <kbd className="font-mono px-1 rounded bg-slate-100">P</kbd> 紫色</p>
      </div>
    </div>
  );
};

export default StroopGame;
