import React, { useEffect } from "react";
import type { ColorType, StroopTrial } from "../types";
import { getColorValue } from "../utils/gameLogic";
import clsx from "clsx";

interface Props {
    trial: StroopTrial;
    progress: { current: number; total: number };
    onAnswer: (color: ColorType) => void;
}

const BUTTONS: {
    color: ColorType;
    label: string;
    code: string;
    displayKey: string;
}[] = [
    { color: "RED", label: "Red", code: "KeyR", displayKey: "R" },
    { color: "GREEN", label: "Green", code: "KeyG", displayKey: "G" },
    { color: "BLUE", label: "Blue", code: "KeyB", displayKey: "B" },
    { color: "YELLOW", label: "Yellow", code: "KeyY", displayKey: "Y" },
];

export const GameScreen: React.FC<Props> = ({ trial, progress, onAnswer }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            console.log(`Key pressed: code=${e.code}, key=${e.key}`);

            const match = BUTTONS.find((b) => b.code === e.code);

            if (match) {
                e.preventDefault();
                onAnswer(match.color);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onAnswer]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white select-none">
            <div className="fixed top-0 left-0 w-full h-2 bg-slate-100">
                <div
                    className="h-full bg-slate-900 transition-all duration-300 ease-out"
                    style={{
                        width: `${(progress.current / progress.total) * 100}%`,
                    }}
                />
            </div>

            <div className="text-slate-400 text-sm font-mono mb-12">
                TRIAL {progress.current} / {progress.total}
            </div>

            {/* 刺激词 */}
            <div className="mb-24 flex flex-col items-center">
                <h1
                    className="text-9xl font-black transition-colors duration-100"
                    style={{ color: getColorValue(trial.inkColor) }}
                >
                    {trial.word}
                </h1>
                <p className="mt-4 text-slate-400 text-sm">
                    Press key for <b className="text-slate-900">INK COLOR</b>
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
                {BUTTONS.map((btn) => (
                    <button
                        key={btn.color}
                        onClick={() => onAnswer(btn.color)}
                        className={clsx(
                            "h-24 rounded-2xl border-2 font-bold text-xl transition-all active:scale-95 flex flex-col items-center justify-center relative overflow-hidden group",
                            "hover:bg-slate-50 border-slate-200 text-slate-700",
                        )}
                    >
                        <span className="z-10">{btn.label}</span>

                        <span className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono border border-slate-200 px-1.5 rounded bg-slate-50">
                            {btn.displayKey}
                        </span>

                        <div className="absolute inset-0 bg-slate-100 opacity-0 group-active:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>
        </div>
    );
};
