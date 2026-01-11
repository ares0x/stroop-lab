import React, { useMemo } from "react";
import type { TrialResult, StroopTrial } from "../types";
import { calculateStats } from "../utils/statistics";

interface Props {
    results: TrialResult[];
    trials: StroopTrial[];
    onRestart: () => void;
}

export const ResultsScreen: React.FC<Props> = ({
    results,
    trials,
    onRestart,
}) => {
    const stats = useMemo(
        () => calculateStats(results, trials),
        [results, trials],
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
            <div className="max-w-3xl w-full">
                <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">
                    Session Report
                </h2>

                {/* 核心指标卡片区域 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* 1. Accuracy */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                        <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                            Accuracy
                        </span>
                        <span
                            className={`text-4xl font-bold mt-2 ${stats.accuracy >= 90 ? "text-green-500" : "text-yellow-500"}`}
                        >
                            {Math.round(stats.accuracy)}%
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                            {stats.correctCount} / {stats.totalTrials} Correct
                        </span>
                    </div>

                    {/* 2. Mean RT */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                        <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                            Mean Response
                        </span>
                        <span className="text-4xl font-bold mt-2 text-slate-800">
                            {Math.round(stats.meanReactionTime)}
                            <span className="text-lg text-slate-400 ml-1">
                                ms
                            </span>
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                            Average speed
                        </span>
                    </div>

                    {/* 3. The Stroop Effect (Hero Metric) */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col items-center ring-4 ring-slate-100">
                        <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                            Stroop Effect
                        </span>
                        <span className="text-4xl font-bold mt-2 text-white">
                            {stats.stroopEffect > 0 ? "+" : ""}
                            {Math.round(stats.stroopEffect)}

                            <span className="text-lg text-slate-500 ml-1">
                                ms
                            </span>
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                            Inhibition Cost
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">
                                    Condition
                                </th>
                                <th className="px-6 py-4 font-semibold text-right">
                                    Avg. Latency
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">
                                        Congruent (Easy)
                                    </div>
                                    <div className="text-slate-400 text-xs">
                                        Colors matched words
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-slate-700">
                                    {Math.round(stats.congruentRT)} ms
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">
                                        Incongruent (Hard)
                                    </div>
                                    <div className="text-slate-400 text-xs">
                                        Colors conflicted with words
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-slate-700">
                                    {Math.round(stats.incongruentRT)} ms
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="text-center">
                    <button
                        onClick={onRestart}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
                    >
                        Start New Session
                    </button>
                </div>
            </div>
        </div>
    );
};
