import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSchulteGame } from '../hooks/games/useSchulteGame';
import { useDocumentMeta } from '../hooks/common/useDocumentMeta';
import { SchulteWelcome } from '../components/games/schulte/SchulteWelcome';
import { SchulteGame } from '../components/games/schulte/SchulteGame';
import { SchulteResults } from '../components/games/schulte/SchulteResults';
import { GameState as GameStateEnum } from '../types/common';

/**
 * Schulte 游戏页面组件
 * 
 * 整合所有 Schulte 游戏组件，管理游戏流程：
 * 1. 配置界面（SchulteWelcome）
 * 2. 游戏界面（SchulteGame）
 * 3. 结果界面（SchulteResults）
 * 
 * 使用 GameLayout 提供统一的页面布局
 */
const SCHULTE_TITLE = '舒尔特方格 | Temio';
const SCHULTE_DESCRIPTION = '舒尔特方格：按顺序点击数字，提升注意力与视觉搜索速度。';

export const SchultePage: React.FC = () => {
  useDocumentMeta(SCHULTE_TITLE, SCHULTE_DESCRIPTION);

  const {
    gameState,
    grid,
    currentNumber,
    errors,
    progress,
    elapsedMs,
    result,
    startGame,
    handleCellClick,
    resetGame,
  } = useSchulteGame();

//   const navigate = useNavigate();

//   // 处理返回主页
//   const handleHomeClick = () => {
//     if (gameState === GameStateEnum.PLAYING) {
//       const confirmed = window.confirm('游戏正在进行中，确定要离开吗？');
//       if (!confirmed) return;
//     }
//     navigate('/');
//   };

  // 渲染不同的游戏阶段
  const renderGameContent = () => {
    switch (gameState) {
      case GameStateEnum.IDLE:
        // 配置界面
        return <SchulteWelcome onStart={startGame} />;

      case GameStateEnum.PLAYING:
        // 游戏界面
        if (grid.length === 0) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-slate-400">加载中...</div>
            </div>
          );
        }
        return (
          <SchulteGame
            grid={grid}
            currentNumber={currentNumber}
            errors={errors}
            progress={progress}
            elapsedMs={elapsedMs}
            onCellClick={handleCellClick}
          />
        );

      case GameStateEnum.COMPLETED:
        // 结果界面
        if (!result) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-slate-400">计算结果中...</div>
            </div>
          );
        }
        return (
          <SchulteResults
            result={result}
            onRestart={() => {
              resetGame();
            }}
            onBackToConfig={resetGame}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-slate-400">未知状态</div>
          </div>
        );
    }
  };

  return (
    <div>
      {renderGameContent()}
    </div>
  );
};

export default SchultePage;
