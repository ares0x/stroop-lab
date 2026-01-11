import type { TrialResult, StroopTrial } from "../types";

export interface GameStats {
    totalTrials: number;
    correctCount: number;
    accuracy: number;
    meanReactionTime: number;
    congruentRT: number;
    incongruentRT: number;
    stroopEffect: number;
}

export const calculateStats = (
    results: TrialResult[],
    trials: StroopTrial[],
): GameStats => {
    const totalTrials = results.length;
    const correctResults = results.filter((r) => r.isCorrect);
    const correctCount = correctResults.length;

    // 1. 准确率
    const accuracy = totalTrials > 0 ? (correctCount / totalTrials) * 100 : 0;

    const meanReactionTime =
        correctResults.length > 0
            ? correctResults.reduce(
                  (acc, curr) => acc + curr.reactionTimeMs,
                  0,
              ) / correctResults.length
            : 0;

    const congruentRTs: number[] = [];
    const incongruentRTs: number[] = [];

    correctResults.forEach((result) => {
        const originalTrial = trials.find((t) => t.id === result.trialId);
        if (!originalTrial) return;

        if (originalTrial.isCongruent) {
            congruentRTs.push(result.reactionTimeMs);
        } else {
            incongruentRTs.push(result.reactionTimeMs);
        }
    });

    const avgCongruent =
        congruentRTs.length > 0
            ? congruentRTs.reduce((a, b) => a + b, 0) / congruentRTs.length
            : 0;

    const avgIncongruent =
        incongruentRTs.length > 0
            ? incongruentRTs.reduce((a, b) => a + b, 0) / incongruentRTs.length
            : 0;

    const stroopEffect =
        avgIncongruent && avgCongruent ? avgIncongruent - avgCongruent : 0;

    return {
        totalTrials,
        correctCount,
        accuracy,
        meanReactionTime,
        congruentRT: avgCongruent,
        incongruentRT: avgIncongruent,
        stroopEffect,
    };
};
