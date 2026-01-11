import { v4 as uuidv4 } from "uuid";
import type { ColorType, GameConfig, StroopTrial } from "../types";

const COLORS: ColorType[] = ["RED", "BLUE", "GREEN", "YELLOW"];

export const generateTrials = (config: GameConfig): StroopTrial[] => {
    const trials: StroopTrial[] = [];

    for (let i = 0; i < config.trialCount; i++) {
        const shouldBeIncongruent = Math.random() < config.incongruentRatio;
        const word = COLORS[Math.floor(Math.random() * COLORS.length)];

        let inkColor: ColorType;

        if (shouldBeIncongruent) {
            const availableColors = COLORS.filter((c) => c !== word);
            inkColor =
                availableColors[
                    Math.floor(Math.random() * availableColors.length)
                ];
        } else {
            inkColor = word;
        }

        trials.push({
            id: uuidv4(),
            word,
            inkColor,
            isCongruent: !shouldBeIncongruent,
        });
    }

    return trials;
};

export const getColorValue = (color: ColorType): string => {
    switch (color) {
        case "RED":
            return "#ef4444";
        case "BLUE":
            return "#3b82f6";
        case "GREEN":
            return "#22c55e";
        case "YELLOW":
            return "#eab308";
        default:
            return "#000000";
    }
};
