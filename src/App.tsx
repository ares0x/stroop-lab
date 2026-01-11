import { useStroopGame } from "./hooks/useStroopGame";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { GameScreen } from "./components/GameScreen";
import { ResultsScreen } from "./components/ResultsScreen";

function App() {
    const {
        gameState,
        currentTrial,
        progress,
        startGame,
        submitAnswer,
        resetGame,
        results,
        trials,
    } = useStroopGame();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {gameState === "IDLE" && <WelcomeScreen onStart={startGame} />}

            {gameState === "RUNNING" && currentTrial && (
                <GameScreen
                    trial={currentTrial}
                    progress={progress}
                    onAnswer={submitAnswer}
                />
            )}

            {gameState === "FINISHED" && (
                <ResultsScreen
                    results={results}
                    trials={trials}
                    onRestart={resetGame}
                />
            )}
        </div>
    );
}

export default App;
