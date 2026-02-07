import React, { useMemo } from 'react';
import type { StroopResult } from '../../../types/games/stroop';
import { storageManager } from '../../../utils/common/storage';
import { calculateStroopStatistics } from '../../../utils/games/stroop/statistics';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';

const STROOP_GAME_ID = 'stroop';
const RECENT_HISTORY_COUNT = 5;

interface StroopResultsProps {
  result: StroopResult;
  onRestart: () => void;
  onBackToConfig: () => void;
  gameId?: string;
}

/**
 * Stroop 游戏结果展示组件
 * 
 * 显示游戏统计数据：
 * - 准确率
 * - 平均反应时间
 * - Stroop 效应
 * - 一致/不一致试验的反应时间对比
 * 
 * 提供"再玩一次"和"返回配置"按钮
 */
function formatRecordTime(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export const StroopResults: React.FC<StroopResultsProps> = ({
  result,
  onRestart,
  onBackToConfig,
  gameId = STROOP_GAME_ID,
}) => {
  const stats = useMemo(() => calculateStroopStatistics(result), [result]);
  const history = useMemo(
    () => storageManager.getGameHistory(gameId),
    [gameId]
  );
  const recentResults = useMemo(
    () => [...history.results].reverse().slice(0, RECENT_HISTORY_COUNT),
    [history.results]
  );
  const isPersonalBest =
    history.results.length > 0 && result.score >= history.bestScore;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl w-full">
        {/* 标题 */}
        <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">
          测试报告
        </h2>

        {/* 核心指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 准确率 */}
          <Card className="flex flex-col items-center">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
              准确率
            </span>
            <span
              className={`text-4xl font-bold mt-2 ${
                stats.accuracy >= 90 ? 'text-green-500' : 'text-yellow-500'
              }`}
            >
              {Math.round(stats.accuracy)}%
            </span>
            <span className="text-xs text-slate-400 mt-1">
              {stats.correctAnswers} / {stats.totalRounds} 正确
            </span>
          </Card>

          {/* 平均反应时间 */}
          <Card className="flex flex-col items-center">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
              平均反应时间
            </span>
            <span className="text-4xl font-bold mt-2 text-slate-800">
              {Math.round(stats.averageResponseTime)}
              <span className="text-lg text-slate-400 ml-1">ms</span>
            </span>
            <span className="text-xs text-slate-400 mt-1">平均速度</span>
          </Card>

          {/* Stroop 效应 */}
          <Card className="flex flex-col items-center bg-slate-900 border-slate-800 ring-4 ring-slate-100">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
              Stroop 效应
            </span>
            <span className="text-4xl font-bold mt-2 text-white">
              {stats.stroopEffect > 0 ? '+' : ''}
              {Math.round(stats.stroopEffect)}
              <span className="text-lg text-slate-500 ml-1">ms</span>
            </span>
            <span className="text-xs text-slate-500 mt-1">抑制成本</span>
          </Card>
        </div>

        {/* 详细统计表格 */}
        <Card className="mb-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">条件</th>
                <th className="px-6 py-4 font-semibold text-right">
                  平均延迟
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    一致试验（简单）
                  </div>
                  <div className="text-slate-400 text-xs">
                    颜色与文字匹配
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">
                  {Math.round(stats.congruentResponseTime)} ms
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    不一致试验（困难）
                  </div>
                  <div className="text-slate-400 text-xs">
                    颜色与文字冲突
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">
                  {Math.round(stats.incongruentResponseTime)} ms
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* 分数显示 */}
        <Card className="mb-6 text-center">
          <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
            总分
          </div>
          <div className="text-5xl font-black text-blue-600">
            {result.score}
          </div>
          {isPersonalBest && (
            <div className="mt-2 inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
              个人最佳
            </div>
          )}
          <div className="text-xs text-slate-400 mt-2">
            基于准确率和反应速度计算
          </div>
        </Card>

        {/* 个人最佳与历史 */}
        <Card className="mb-8">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            历史记录
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mb-3">
            <span>个人最佳：</span>
            <span className="font-bold text-slate-900">{history.bestScore}</span>
            <span className="text-slate-400">· 共玩 {history.totalPlays} 次</span>
          </div>
          {recentResults.length > 0 && (
            <ul className="space-y-1 text-sm text-slate-600" aria-label="最近记录">
              {recentResults.map((r, i) => (
                <li key={r.timestamp} className="flex justify-between">
                  <span>第 {history.totalPlays - recentResults.length + i + 1} 次</span>
                  <span className="font-mono">
                    分数 {r.score} · {formatRecordTime(r.duration)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onRestart}
            className="shadow-lg"
          >
            再玩一次
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onBackToConfig}
            className="shadow-lg"
          >
            返回配置
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StroopResults;
