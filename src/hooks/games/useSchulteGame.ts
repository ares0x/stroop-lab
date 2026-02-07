import { useState, useCallback, useRef, useEffect } from 'react';
import { useGameState } from '../common/useGameState';
import type { SchulteConfig, SchulteCell, SchulteResult } from '../../types/games/schulte';
import {
  generateSchulteGrid,
  calculateSchulteScore,
  validateClick,
  isGameComplete,
  getTotalNumbers,
} from '../../utils/games/schulte/gameLogic';
import { GameState as GameStateEnum } from '../../types/common';

/**
 * Schulte 游戏 Hook
 * 
 * 管理 Schulte 游戏的状态和逻辑：
 * - 网格生成和管理
 * - 当前期望数字追踪
 * - 点击验证
 * - 错误计数
 * - 游戏完成检测
 */
export const useSchulteGame = () => {
  const {
    state: gameState,
    config,
    result,
    startGame: startGameState,
    endGame: endGameState,
    resetGame: resetGameState,
  } = useGameState<SchulteConfig, SchulteResult>('schulte', {
    difficulty: 'medium',
    gridSize: 3,
  });

  const [grid, setGrid] = useState<SchulteCell[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [errors, setErrors] = useState(0);
  const [clickSequence, setClickSequence] = useState<SchulteResult['clickSequence']>([]);
  const [elapsedMs, setElapsedMs] = useState(0);

  const startTimeRef = useRef<number>(0);

  /**
   * 开始游戏
   */
  const startGame = useCallback((gameConfig: SchulteConfig) => {
    const newGrid = generateSchulteGrid(gameConfig.gridSize);

    setGrid(newGrid);
    setCurrentNumber(1);
    setErrors(0);
    setClickSequence([]);
    setElapsedMs(0);
    startGameState(gameConfig);
    startTimeRef.current = Date.now();
  }, [startGameState]);

  // 游戏进行中时更新计时器（每 100ms 刷新一次）
  useEffect(() => {
    if (gameState !== GameStateEnum.PLAYING) return;
    const tick = () => setElapsedMs(Date.now() - startTimeRef.current);
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [gameState]);

  /**
   * 处理单元格点击
   */
  const handleCellClick = useCallback((cell: SchulteCell) => {
    if (gameState !== GameStateEnum.PLAYING) return;
    if (cell.isClicked) return; // 已经点击过的单元格不能再点击

    const isCorrect = validateClick(cell.value, currentNumber);
    const timestamp = Date.now() - startTimeRef.current;

    // 记录点击序列
    const newClickRecord = {
      expectedNumber: currentNumber,
      clickedNumber: cell.value,
      isCorrect,
      timestamp,
    };
    const updatedClickSequence = [...clickSequence, newClickRecord];
    setClickSequence(updatedClickSequence);

    if (isCorrect) {
      // 正确点击：标记单元格为已点击，移动到下一个数字
      const updatedGrid = grid.map(c =>
        c.value === cell.value ? { ...c, isClicked: true } : c
      );
      setGrid(updatedGrid);

      const nextNumber = currentNumber + 1;
      const totalNumbers = getTotalNumbers(config.gridSize);

      if (isGameComplete(nextNumber, totalNumbers)) {
        // 游戏完成
        const gameDuration = Date.now() - startTimeRef.current;
        const averageTimePerNumber = gameDuration / totalNumbers;
        const score = calculateSchulteScore(gameDuration, errors);

        const gameResult: SchulteResult = {
          gameId: 'schulte',
          timestamp: Date.now(),
          duration: gameDuration,
          score,
          gridSize: config.gridSize,
          totalNumbers,
          errors,
          averageTimePerNumber,
          clickSequence: updatedClickSequence,
        };

        endGameState(gameResult);
      } else {
        // 继续游戏
        setCurrentNumber(nextNumber);
      }
    } else {
      // 错误点击：增加错误计数
      setErrors(prev => prev + 1);
    }
  }, [gameState, currentNumber, grid, clickSequence, errors, config.gridSize, endGameState]);

  /**
   * 重置游戏
   */
  const resetGame = useCallback(() => {
    setGrid([]);
    setCurrentNumber(1);
    setErrors(0);
    setClickSequence([]);
    resetGameState();
  }, [resetGameState]);

  /**
   * 获取进度信息
   */
  const progress = {
    current: currentNumber,
    total: getTotalNumbers(config.gridSize),
  };

  return {
    gameState,
    config,
    result,
    grid,
    currentNumber,
    errors,
    progress,
    elapsedMs,
    clickSequence,
    startGame,
    handleCellClick,
    resetGame,
  };
};
