import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStroopGame } from '../useStroopGame';
import { GameState as GameStateEnum } from '../../../types/common';
import type { StroopConfig } from '../../../types/games/stroop';

describe('useStroopGame Hook', () => {
  it('should initialize with IDLE state', () => {
    const { result } = renderHook(() => useStroopGame());
    
    expect(result.current.gameState).toBe(GameStateEnum.IDLE);
    expect(result.current.currentTrial).toBeNull();
    expect(result.current.result).toBeNull();
  });

  it('should start game with provided config', () => {
    const { result } = renderHook(() => useStroopGame());
    
    const config: StroopConfig = {
      difficulty: 'medium',
      rounds: 5,
      showTimer: true,
    };

    act(() => {
      result.current.startGame(config);
    });

    expect(result.current.gameState).toBe(GameStateEnum.PLAYING);
    expect(result.current.currentTrial).not.toBeNull();
    expect(result.current.totalRounds).toBe(5);
    expect(result.current.progress.total).toBe(5);
    expect(result.current.progress.current).toBe(1);
  });

  it('should advance to next trial on answer submission', () => {
    const { result } = renderHook(() => useStroopGame());
    
    const config: StroopConfig = {
      difficulty: 'easy',
      rounds: 3,
      showTimer: false,
    };

    act(() => {
      result.current.startGame(config);
    });

    const firstTrial = result.current.currentTrial;
    expect(firstTrial).not.toBeNull();

    act(() => {
      result.current.submitAnswer('red');
    });

    expect(result.current.currentRound).toBe(1);
    expect(result.current.progress.current).toBe(2);
    expect(result.current.currentTrial).not.toBe(firstTrial);
  });

  it('should complete game after all rounds', () => {
    const { result } = renderHook(() => useStroopGame());
    
    const config: StroopConfig = {
      difficulty: 'easy',
      rounds: 2,
      showTimer: false,
    };

    act(() => {
      result.current.startGame(config);
    });

    // Answer first trial
    act(() => {
      result.current.submitAnswer('red');
    });

    expect(result.current.gameState).toBe(GameStateEnum.PLAYING);

    // Answer second trial
    act(() => {
      result.current.submitAnswer('blue');
    });

    expect(result.current.gameState).toBe(GameStateEnum.COMPLETED);
    expect(result.current.result).not.toBeNull();
    expect(result.current.result?.totalRounds).toBe(2);
  });

  it('should reset game to IDLE state', () => {
    const { result } = renderHook(() => useStroopGame());
    
    const config: StroopConfig = {
      difficulty: 'medium',
      rounds: 5,
      showTimer: true,
    };

    act(() => {
      result.current.startGame(config);
    });

    expect(result.current.gameState).toBe(GameStateEnum.PLAYING);

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.gameState).toBe(GameStateEnum.IDLE);
    expect(result.current.currentTrial).toBeNull();
    expect(result.current.result).toBeNull();
    expect(result.current.totalRounds).toBe(0);
  });

  it('should calculate result with correct statistics', () => {
    const { result } = renderHook(() => useStroopGame());
    
    const config: StroopConfig = {
      difficulty: 'easy',
      rounds: 3,
      showTimer: false,
    };

    act(() => {
      result.current.startGame(config);
    });

    // Get the correct answers for each trial
    const trial1 = result.current.currentTrial!;
    act(() => {
      result.current.submitAnswer(trial1.correctAnswer as any);
    });

    const trial2 = result.current.currentTrial!;
    act(() => {
      result.current.submitAnswer(trial2.correctAnswer as any);
    });

    const trial3 = result.current.currentTrial!;
    act(() => {
      result.current.submitAnswer(trial3.correctAnswer as any);
    });

    expect(result.current.gameState).toBe(GameStateEnum.COMPLETED);
    expect(result.current.result?.correctAnswers).toBe(3);
    expect(result.current.result?.accuracy).toBe(1); // 100%
    expect(result.current.result?.score).toBeGreaterThan(0);
  });

  it('should not accept answers when not in PLAYING state', () => {
    const { result } = renderHook(() => useStroopGame());
    
    // Try to submit answer in IDLE state
    act(() => {
      result.current.submitAnswer('red');
    });

    expect(result.current.gameState).toBe(GameStateEnum.IDLE);
    expect(result.current.currentRound).toBe(0);
  });
});
