import React, { useCallback } from 'react';
import { REGISTERED_GAMES } from '../config/games';
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '../config/site';
import { GameCard } from '../components/common/GameCard';
import { useDocumentMeta } from '../hooks/common/useDocumentMeta';

const GAMES_SECTION_ID = 'games';

const gameGridClass =
  REGISTERED_GAMES.length >= 3
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
    : 'grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto';

/**
 * 首页：标准站点结构
 * Header（Cogni）→ Hero（价值主张 + CTA）→ 选择训练项目（#games）→ Footer
 */
export const HomePage: React.FC = () => {
  useDocumentMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION);

  const scrollToGames = useCallback(() => {
    document.getElementById(GAMES_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div>
      {/* Hero：品牌 + 价值主张 + 主 CTA */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 px-4"
        aria-label="介绍"
      >
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
            脑力与认知训练平台
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            专注 · 反应 · 记忆
          </h2>
          <p className="text-slate-600 text-base md:text-lg mb-8 max-w-xl mx-auto">
            每日几分钟，科学锻炼大脑。选择下方训练项目即可开始。
          </p>
          <button
            type="button"
            onClick={scrollToGames}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            aria-label="跳转到训练项目"
          >
            选择训练项目
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* 训练项目区：功能卡片放在独立区块，符合平台与标准站格式 */}
      <section
        id={GAMES_SECTION_ID}
        className="py-12 md:py-16 px-4 bg-white border-t border-slate-100"
        aria-labelledby="games-heading"
      >
        <div className="container mx-auto max-w-6xl">
          <h3 id="games-heading" className="text-xl md:text-2xl font-bold text-slate-900 mb-8 text-center">
            选择训练项目
          </h3>
          <div
            className={gameGridClass}
            role="list"
            aria-label="可用游戏列表"
          >
            {REGISTERED_GAMES.map(({ metadata, path }) => (
              <div key={metadata.id} role="listitem">
                <GameCard game={metadata} path={path} />
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
  );
  
};

export default HomePage;
