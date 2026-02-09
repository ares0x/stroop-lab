import React from 'react';
import { useStroopGame } from '../hooks/games/useStroopGame';
import { useDocumentMeta } from '../hooks/common/useDocumentMeta';
import { StroopWelcome } from '../components/games/stroop/StroopWelcome';
import { StroopGame } from '../components/games/stroop/StroopGame';
import { StroopResults } from '../components/games/stroop/StroopResults';
import { GameState as GameStateEnum } from '../types/common';
import type { ColorType } from '../utils/games/stroop/gameLogic';

/**
 * Stroop 测试页面组件
 * 
 * 整合所有 Stroop 游戏组件，管理游戏流程：
 * 1. 配置界面（StroopWelcome）
 * 2. 游戏界面（StroopGame）
 * 3. 结果界面（StroopResults）
 * 
 * 使用 GameLayout 提供统一的页面布局
 */
const STROOP_TITLE = 'Stroop 测试 | Temio';
const STROOP_DESCRIPTION = 'Stroop 斯特鲁普测试：识别文字颜色而非文字内容，锻炼认知控制与反应速度。';

export const StroopPage: React.FC = () => {
  useDocumentMeta(STROOP_TITLE, STROOP_DESCRIPTION);

  const {
    gameState,
    currentTrial,
    progress,
    result,
    startGame,
    submitAnswer,
    resetGame,
  } = useStroopGame();

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
        return <StroopWelcome onStart={startGame} />;

      case GameStateEnum.PLAYING:
        // 游戏界面
        if (!currentTrial) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-slate-400">加载中...</div>
            </div>
          );
        }
        return (
          <StroopGame
            trial={currentTrial}
            progress={progress}
            onAnswer={submitAnswer as (color: ColorType) => void}
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
          <StroopResults
            result={result}
            onRestart={() => {
              resetGame();
              // 可以选择直接开始新游戏或返回配置
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

export default StroopPage;
