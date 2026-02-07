# Common Hooks

This directory contains reusable React hooks that are shared across all games in the brain training platform.

## Available Hooks

### `useGameState`

Manages the lifecycle state of a game session.

**Features:**
- Tracks game state (IDLE, CONFIGURING, PLAYING, COMPLETED)
- Manages game configuration
- Stores game results
- Maintains session information with timestamps

**Usage:**
```tsx
import { useGameState } from './hooks/common/useGameState';

function MyGame() {
  const {
    state,
    config,
    result,
    session,
    startGame,
    endGame,
    resetGame
  } = useGameState('my-game', { difficulty: 'medium' });

  const handleStart = () => {
    startGame({ difficulty: 'hard', rounds: 10 });
  };

  const handleEnd = () => {
    endGame({
      gameId: 'my-game',
      timestamp: Date.now(),
      duration: 60000,
      score: 850
    });
  };

  return (
    <div>
      <p>Current state: {state}</p>
      {state === 'idle' && <button onClick={handleStart}>Start Game</button>}
      {state === 'playing' && <button onClick={handleEnd}>End Game</button>}
      {state === 'completed' && (
        <>
          <p>Score: {result?.score}</p>
          <button onClick={resetGame}>Play Again</button>
        </>
      )}
    </div>
  );
}
```

### `useLocalStorage`

Provides a React interface to the StorageManager for persisting game data.

**Features:**
- Automatically loads game history on mount
- Saves game results to localStorage (with fallback to memory)
- Tracks best scores and play counts
- Provides methods to clear history

**Usage:**
```tsx
import { useLocalStorage } from './hooks/common/useLocalStorage';

function GameResults() {
  const { history, saveResult, clearHistory } = useLocalStorage('stroop');

  const handleSaveResult = () => {
    saveResult({
      gameId: 'stroop',
      timestamp: Date.now(),
      duration: 45000,
      score: 920
    });
  };

  return (
    <div>
      <h2>Game Statistics</h2>
      <p>Total Plays: {history.totalPlays}</p>
      <p>Best Score: {history.bestScore}</p>
      <p>Last Played: {new Date(history.lastPlayed).toLocaleString()}</p>
      
      <button onClick={handleSaveResult}>Save Result</button>
      <button onClick={clearHistory}>Clear History</button>
    </div>
  );
}
```

### `useAllGameHistories`

Retrieves history for all games in the platform.

**Usage:**
```tsx
import { useAllGameHistories } from './hooks/common/useLocalStorage';

function AllGamesStats() {
  const { allHistories, refreshAllHistories } = useAllGameHistories();

  return (
    <div>
      <h2>All Games Statistics</h2>
      {allHistories.map(history => (
        <div key={history.gameId}>
          <h3>{history.gameId}</h3>
          <p>Plays: {history.totalPlays}</p>
          <p>Best: {history.bestScore}</p>
        </div>
      ))}
      <button onClick={refreshAllHistories}>Refresh</button>
    </div>
  );
}
```

## Type Safety

All hooks are fully typed with TypeScript generics to ensure type safety:

```tsx
// TConfig and TResult are inferred from usage
const gameState = useGameState<StroopConfig, StroopResult>(
  'stroop',
  { difficulty: 'medium', rounds: 10 }
);
```

## Integration with StorageManager

The `useLocalStorage` hook wraps the `StorageManager` class and provides:
- Automatic state synchronization
- React-friendly API
- Graceful error handling
- Memory fallback when localStorage is unavailable

## Best Practices

1. **Use `useGameState` for game lifecycle management**: It handles state transitions and session tracking automatically.

2. **Use `useLocalStorage` for persistence**: It ensures game results are saved and can be retrieved across sessions.

3. **Combine both hooks**: Most games will use both hooks together:
   ```tsx
   const gameState = useGameState('my-game', initialConfig);
   const storage = useLocalStorage('my-game');
   
   const handleGameEnd = (result) => {
     gameState.endGame(result);
     storage.saveResult(result);
   };
   ```

4. **Keep gameId consistent**: Use the same gameId across hooks and components for a single game.

5. **Handle state transitions properly**: Follow the state flow: IDLE → PLAYING → COMPLETED → IDLE (via reset).
