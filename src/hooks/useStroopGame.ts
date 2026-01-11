import { useState, useCallback, useRef } from "react";
import type {
    GameConfig,
    GameState,
    StroopTrial,
    TrialResult,
    ColorType,
} from "../types";
import { generateTrials } from "../utils/gameLogic";

export const useStroopGame = () => {
    const [gameState, setGameState] = useState<GameState>("IDLE");
    const [trials, setTrials] = useState<StroopTrial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<TrialResult[]>([]);

    const startTimeRef = useRef<number>(0);

    const startGame = useCallback((config: GameConfig) => {
        const newTrials = generateTrials(config);
        setTrials(newTrials);
        setResults([]);
        setCurrentIndex(0);
        setGameState("RUNNING");
        startTimeRef.current = performance.now();
    }, []);

    const submitAnswer = useCallback(
        (selectedColor: ColorType) => {
            if (gameState !== "RUNNING") return;

            const endTime = performance.now();
            const currentTrial = trials[currentIndex];

            const result: TrialResult = {
                trialId: currentTrial.id,
                expected: currentTrial.inkColor,
                actual: selectedColor,
                isCorrect: currentTrial.inkColor === selectedColor,
                reactionTimeMs: endTime - startTimeRef.current,
                timestamp: Date.now(),
            };

            setResults((prev) => [...prev, result]);

            if (currentIndex < trials.length - 1) {
                setCurrentIndex((prev) => prev + 1);
                startTimeRef.current = performance.now();
            } else {
                setGameState("FINISHED");
            }
        },
        [currentIndex, trials, gameState],
    );

    const resetGame = useCallback(() => {
        setGameState("IDLE");
        setTrials([]);
        setResults([]);
    }, []);

    return {
        gameState,
        currentTrial: trials[currentIndex],
        progress: { current: currentIndex + 1, total: trials.length },
        results,
        trials,
        startGame,
        submitAnswer,
        resetGame,
    };
};
