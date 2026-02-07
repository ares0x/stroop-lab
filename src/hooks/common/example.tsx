/**
 * Example: Using useGameState and useLocalStorage together
 * 
 * This example demonstrates how to integrate both hooks in a game component.
 * It shows the complete game lifecycle from configuration to completion.
 */

import { useGameState } from './useGameState';
import { useLocalStorage } from './useLocalStorage';
import type { BaseGameConfig, BaseGameResult } from '../../types/common';

// Example game configuration
interface ExampleGameConfig extends BaseGameConfig {
  rounds: number;
  timeLimit: number;
}

// Example game result
interface ExampleGameResult extends BaseGameResult {
  correctAnswers: number;
  accuracy: number;
}

/**
 * Example Game Component
 * 
 * Demonstrates the integration of useGameState and useLocalStorage
 */
export function ExampleGame() {
  // Initialize game state management
  const {
    state,
    config,
    result,
    startGame,
    endGame,
    resetGame
  } = useGameState<ExampleGameConfig, ExampleGameResult>('example-game', {
    difficulty: 'medium',
    rounds: 10,
    timeLimit: 60
  });

  // Initialize local storage
  const { history, saveResult } = useLocalStorage('example-game');

  /**
   * Handle game start
   */
  const handleStartGame = () => {
    const gameConfig: ExampleGameConfig = {
      difficulty: 'medium',
      rounds: 10,
      timeLimit: 60
    };
    startGame(gameConfig);
  };

  /**
   * Handle game completion
   */
  const handleGameComplete = () => {
    const gameResult: ExampleGameResult = {
      gameId: 'example-game',
      timestamp: Date.now(),
      duration: 45000, // 45 seconds
      score: 850,
      correctAnswers: 8,
      accuracy: 0.8
    };

    // Update game state
    endGame(gameResult);

    // Save to local storage
    saveResult(gameResult);
  };

  /**
   * Handle play again
   */
  const handlePlayAgain = () => {
    resetGame();
  };

  // Render based on game state
  return (
    <div className="game-container">
      {/* IDLE State - Show welcome screen */}
      {state === 'idle' && (
        <div className="welcome-screen">
          <h1>Example Game</h1>
          <p>Test your skills with this example game!</p>
          
          {/* Show statistics if available */}
          {history.totalPlays > 0 && (
            <div className="statistics">
              <h2>Your Statistics</h2>
              <p>Total Plays: {history.totalPlays}</p>
              <p>Best Score: {history.bestScore}</p>
              <p>Last Played: {new Date(history.lastPlayed).toLocaleDateString()}</p>
            </div>
          )}
          
          <button onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      )}

      {/* PLAYING State - Show game interface */}
      {state === 'playing' && (
        <div className="game-screen">
          <h2>Playing...</h2>
          <p>Rounds: {config.rounds}</p>
          <p>Time Limit: {config.timeLimit}s</p>
          
          {/* Game content would go here */}
          <div className="game-content">
            <p>Game is in progress...</p>
          </div>
          
          <button onClick={handleGameComplete}>
            Complete Game
          </button>
        </div>
      )}

      {/* COMPLETED State - Show results */}
      {state === 'completed' && result && (
        <div className="results-screen">
          <h2>Game Complete!</h2>
          
          <div className="results">
            <p>Score: {result.score}</p>
            <p>Accuracy: {(result.accuracy * 100).toFixed(1)}%</p>
            <p>Correct Answers: {result.correctAnswers} / {config.rounds}</p>
            <p>Duration: {(result.duration / 1000).toFixed(1)}s</p>
          </div>
          
          {/* Show if this is a new best score */}
          {result.score > history.bestScore && (
            <div className="new-best">
              <p>🎉 New Best Score!</p>
            </div>
          )}
          
          <div className="actions">
            <button onClick={handlePlayAgain}>
              Play Again
            </button>
            <button onClick={() => window.location.href = '/'}>
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Using hooks in a custom game hook
 * 
 * This pattern is useful for encapsulating game-specific logic
 */
export function useExampleGame() {
  const gameState = useGameState<ExampleGameConfig, ExampleGameResult>(
    'example-game',
    {
      difficulty: 'medium',
      rounds: 10,
      timeLimit: 60
    }
  );

  const storage = useLocalStorage('example-game');

  /**
   * Start a new game with custom configuration
   */
  const startNewGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    const config: ExampleGameConfig = {
      difficulty,
      rounds: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
      timeLimit: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45
    };
    gameState.startGame(config);
  };

  /**
   * Complete the game and save results
   */
  const completeGame = (correctAnswers: number, duration: number) => {
    const accuracy = correctAnswers / gameState.config.rounds;
    const score = Math.round(accuracy * 1000 - duration / 100);

    const result: ExampleGameResult = {
      gameId: 'example-game',
      timestamp: Date.now(),
      duration,
      score,
      correctAnswers,
      accuracy
    };

    gameState.endGame(result);
    storage.saveResult(result);
  };

  return {
    ...gameState,
    history: storage.history,
    startNewGame,
    completeGame,
    clearHistory: storage.clearHistory
  };
}
