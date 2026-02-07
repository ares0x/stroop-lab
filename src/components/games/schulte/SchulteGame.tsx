import React from 'react';
import type { SchulteCell } from '../../../types/games/schulte';

interface SchulteGameProps {
  grid: SchulteCell[];
  currentNumber: number;
  errors: number;
  progress: { current: number; total: number };
  elapsedMs: number;
  onCellClick: (cell: SchulteCell) => void;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
  }
  return `${seconds}.${tenths}`;
}

/**
 * Schulte 游戏界面组件
 * 
 * 显示网格和当前游戏状态
 */
export const SchulteGame: React.FC<SchulteGameProps> = ({
  grid,
  currentNumber,
  errors,
  progress,
  elapsedMs,
  onCellClick,
}) => {
  const gridSize = Math.sqrt(grid.length);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white select-none p-4">
      {/* 进度条 */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-100">
        <div
          className="h-full bg-slate-900 transition-all duration-300 ease-out"
          style={{
            width: `${((progress.current - 1) / progress.total) * 100}%`,
          }}
        />
      </div>

      {/* 游戏信息：计时器 + 当前数字 + 进度 + 错误 */}
      <div className="mb-8 text-center">
        <div className="text-slate-500 text-sm font-mono mb-2">
          用时 <span className="text-slate-900 text-2xl font-bold tabular-nums">{formatElapsed(elapsedMs)}</span>
        </div>
        <div className="text-slate-400 text-sm font-mono mb-2">
          寻找数字 <span className="text-slate-900 text-xl font-bold mx-2">{currentNumber}</span>
        </div>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="text-slate-500">
            进度: <span className="font-semibold text-slate-900">{progress.current - 1}</span> / {progress.total}
          </div>
          {errors > 0 && (
            <div className="text-red-500">
              错误: <span className="font-semibold">{errors}</span>
            </div>
          )}
        </div>
      </div>

      {/* Schulte 网格 */}
      <div
        className="grid gap-2 md:gap-3 max-w-2xl w-full"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((cell, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onCellClick(cell)}
            disabled={cell.isClicked}
            className={`
              aspect-square rounded-xl text-2xl md:text-3xl font-bold
              transition-all duration-200
              flex items-center justify-center
              focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
              ${
                cell.isClicked
                  ? 'bg-green-100 text-green-400 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 cursor-pointer'
              }
            `}
            style={{
              minWidth: '44px',
              minHeight: '44px',
            }}
            aria-label={cell.isClicked ? `数字 ${cell.value} 已选` : `数字 ${cell.value}`}
            aria-pressed={cell.isClicked}
          >
            {cell.value}
          </button>
        ))}
      </div>

      {/* 输入方式提示 (Requirements 11.5) */}
      <div className="mt-8 text-xs text-slate-400 text-center" role="status" aria-label="操作说明">
        <p>使用鼠标按顺序点击数字 1 到 {progress.total}</p>
      </div>
    </div>
  );
};

export default SchulteGame;
