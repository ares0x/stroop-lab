export type ColorType = "RED" | "BLUE" | "GREEN" | "YELLOW";

export interface StroopTrial {
    id: string;
    word: ColorType;
    inkColor: ColorType;
    isCongruent: boolean;
}

export interface TrialResult {
    trialId: string;
    expected: ColorType;
    actual: ColorType;
    isCorrect: boolean;
    reactionTimeMs: number;
    timestamp: number;
}

export interface GameConfig {
    trialCount: number;
    incongruentRatio: number;
    stimulusDuration: number;
}

export type GameState = "IDLE" | "RUNNING" | "FINISHED";
