import React, { useMemo } from 'react';
import type { SchulteResult } from '../../../types/games/schulte';
import { storageManager } from '../../../utils/common/storage';
import {
  calculateSchulteStatistics,
  formatCompletionTime,
  formatAccuracy,
  getPerformanceRating,
} from '../../../utils/games/schulte/statistics';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';

const SCHULTE_GAME_ID = 'schulte';
const RECENT_HISTORY_COUNT = 5;

interface SchulteResultsProps {
  result: SchulteResult;
  onRestart: () => void;
  onBackToConfig: () => void;
  gameId?: string;
}

/**
 * Schulte 游戏结果展示组件
 * 
 * 显示游戏统计数据：
 * - 完成时间
 * - 错误次数
 * - 平均每个数字的查找时间
 * - 准确率
 * - 性能评级
 */
export const SchulteResults: React.FC<SchulteResultsProps> = ({
  result,
  onRestart,
  onBackToConfig,
  gameId = SCHULTE_GAME_ID,
}) => {
  const stats = useMemo(() => calculateSchulteStatistics(result), [result]);
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

  const rating = useMemo(
    () => getPerformanceRating(result.duration, result.errors, result.gridSize),
    [result.duration, result.errors, result.gridSize]
  );

  // 评级颜色映射
  const ratingColors = {
    '优秀': 'text-green-600 bg-green-50',
    '良好': 'text-blue-600 bg-blue-50',
    '一般': 'text-yellow-600 bg-yellow-50',
    '需要提高': 'text-red-600 bg-red-50',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl w-full">
        {/* 标题 */}
        <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">
          游戏报告
        </h2>

        {/* 性能评级 */}
        <div className="mb-8 text-center">
          <div
            className={`inline-block px-6 py-3 rounded-full text-2xl font-bold ${ratingColors[rating]}`}
          >
            {rating}
          </div>
        </div>

        {/* 核心指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 完成时间 */}
          <Card className="flex flex-col items-center">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
              完成时间
            </span>
            <span className="text-4xl font-bold mt-2 text-slate-800">
              {formatCompletionTime(stats.completionTime)}
            </span>
            <span className="text-xs text-slate-400 mt-1">总用时</span>
          </Card>

          {/* 错误次数 */}
          <Card className="flex flex-col items-center">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
              错误次数
            </span>
            <span
              className={`text-4xl font-bold mt-2 ${
                stats.errors === 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {stats.errors}
            </span>
            <span className="text-xs text-slate-400 mt-1">点击错误</span>
          </Card>

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
              {formatAccuracy(stats.accuracy)}
            </span>
            <span className="text-xs text-slate-400 mt-1">点击准确度</span>
          </Card>
        </div>

        {/* 详细统计表格 */}
        <Card className="mb-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">指标</th>
                <th className="px-6 py-4 font-semibold text-right">数值</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">网格尺寸</div>
                  <div className="text-slate-400 text-xs">游戏难度</div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">
                  {stats.gridSize}×{stats.gridSize}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">总数字数量</div>
                  <div className="text-slate-400 text-xs">需要找到的数字</div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">
                  {stats.totalNumbers}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">平均查找时间</div>
                  <div className="text-slate-400 text-xs">每个数字的平均用时</div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">
                  {Math.round(stats.averageTimePerNumber)} ms
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">平均点击次数</div>
                  <div className="text-slate-400 text-xs">每个数字的平均点击</div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">
                  {stats.clicksPerNumber.toFixed(2)}
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
          <div className="text-5xl font-black text-blue-600">{result.score}</div>
          {isPersonalBest && (
            <div className="mt-2 inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
              个人最佳
            </div>
          )}
          <div className="text-xs text-slate-400 mt-2">
            基于完成时间和准确率计算
          </div>
        </Card>

        {/* 历史记录 */}
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
                    分数 {r.score} · {(r.duration / 1000).toFixed(1)} s
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

export default SchulteResults;
