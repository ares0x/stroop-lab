import { useState, useCallback, useRef } from 'react';
import { useGameState } from '../common/useGameState';
import type { StroopConfig, StroopTrial, StroopResult } from '../../types/games/stroop';
import { 
  generateStroopTrial, 
  calculateStroopScore,
  type ColorType 
} from '../../utils/games/stroop/gameLogic';
import { GameState as GameStateEnum } from '../../types/common';

export const useStroopGame = () => {
  const {
    state: gameState,
    config,
    result,
    startGame: startGameState,
    endGame: endGameState,
    resetGame: resetGameState,
  } = useGameState<StroopConfig, StroopResult>('stroop', {
    difficulty: 'medium',
    rounds: 20,
    showTimer: true,
  });

  const [trials, setTrials] = useState<StroopTrial[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [trialResults, setTrialResults] = useState<StroopResult['trials']>([]);
  
  const startTimeRef = useRef<number>(0);
  const gameStartTimeRef = useRef<number>(0);

  const startGame = useCallback((gameConfig: StroopConfig) => {
    const newTrials: StroopTrial[] = [];
    for (let i = 0; i < gameConfig.rounds; i++) {
      newTrials.push(generateStroopTrial());
    }
    
    setTrials(newTrials);
    setCurrentRound(0);
    setTrialResults([]);
    startGameState(gameConfig);
    gameStartTimeRef.current = Date.now();
    startTimeRef.current = performance.now();
  }, [startGameState]);

  const submitAnswer = useCallback((selectedColor: ColorType) => {
    if (gameState !== GameStateEnum.PLAYING) return;
    if (currentRound >= trials.length) return;

    const endTime = performance.now();
    const currentTrial = trials[currentRound];
    const responseTime = endTime - startTimeRef.current;
    const isCorrect = currentTrial.correctAnswer === selectedColor;

    const newTrialResult = {
      trial: currentTrial,
      userAnswer: selectedColor,
      isCorrect,
      responseTime,
    };

    const updatedResults = [...trialResults, newTrialResult];
    setTrialResults(updatedResults);

    if (currentRound < trials.length - 1) {
      setCurrentRound(prev => prev + 1);
      startTimeRef.current = performance.now();
    } else {
      const gameDuration = Date.now() - gameStartTimeRef.current;
      const correctAnswers = updatedResults.filter(r => r.isCorrect).length;
      const accuracy = correctAnswers / updatedResults.length;
      const avgResponseTime = updatedResults.reduce((sum, r) => sum + r.responseTime, 0) / updatedResults.length;
      const score = calculateStroopScore(updatedResults);

      const gameResult: StroopResult = {
        gameId: 'stroop',
        timestamp: Date.now(),
        duration: gameDuration,
        score,
        totalRounds: trials.length,
        correctAnswers,
        accuracy,
        averageResponseTime: avgResponseTime,
        trials: updatedResults,
      };

      endGameState(gameResult);
    }
  }, [gameState, currentRound, trials, trialResults, endGameState]);

  const resetGame = useCallback(() => {
    setTrials([]);
    setCurrentRound(0);
    setTrialResults([]);
    resetGameState();
  }, [resetGameState]);

  const currentTrial = trials[currentRound] || null;
  const progress = {
    current: currentRound + 1,
    total: trials.length,
  };

  return {
    gameState,
    config,
    result,
    currentTrial,
    currentRound,
    totalRounds: trials.length,
    progress,
    trials,
    startGame,
    submitAnswer,
    resetGame,
  };
};
