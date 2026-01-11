import React, { useState } from "react";
import type { GameConfig } from "../types";

interface Props {
    onStart: (config: GameConfig) => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
    const [trialCount, setTrialCount] = useState(20);
    const [incongruentRatio, setIncongruentRatio] = useState(0.5);

    const handleStart = () => {
        onStart({
            trialCount,
            incongruentRatio,
            stimulusDuration: 0,
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-2xl mx-auto text-center">
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-2">
                stroop-lab
            </h1>
            <p className="text-xl text-slate-500 mb-12">
                A minimal Stroop task playground for attention & inhibition.
            </p>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md mb-8">
                <div className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Total Trials:{" "}
                            <span className="text-blue-600">{trialCount}</span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={trialCount}
                            onChange={(e) =>
                                setTrialCount(Number(e.target.value))
                            }
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>Short (10)</span>
                            <span>Long (100)</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Interference Ratio:{" "}
                            <span className="text-blue-600">
                                {Math.round(incongruentRatio * 100)}%
                            </span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={incongruentRatio}
                            onChange={(e) =>
                                setIncongruentRatio(Number(e.target.value))
                            }
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>None (0%)</span>
                            <span>Full (100%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleStart}
                className="px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-full hover:bg-slate-800 hover:scale-105 transition-all active:scale-95 shadow-lg"
            >
                Start Experiment
            </button>

            <p className="mt-8 text-xs text-slate-400">
                Press <b>R / G / B / Y</b> on your keyboard or use mouse.
            </p>
        </div>
    );
};
