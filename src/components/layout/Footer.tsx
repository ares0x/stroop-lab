import React from 'react';
import { Link } from 'react-router-dom';

const BRAND = 'Cogni';
const TAGLINE = '脑力训练平台';
const YEAR = new Date().getFullYear();

/**
 * Footer 组件
 *
 * 标准站点页脚：品牌、版权、可选链接（关于 / 反馈 / 隐私）。
 */
export const Footer: React.FC = () => {
  return (
    <footer
      className="border-t border-slate-200 bg-white"
      role="contentinfo"
      aria-label="页脚"
    >
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:items-center md:text-left">
          <div>
            <Link
              to="/"
              className="text-lg font-bold text-slate-900 hover:text-slate-700 transition-colors"
            >
              {BRAND}
            </Link>
            <span className="ml-2 text-slate-400 text-sm font-normal">
              {TAGLINE}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
            <span>© {YEAR} {BRAND}</span>
            {/* 预留：关于 / 反馈 / 隐私 */}
            {/* <Link to="/about" className="hover:text-slate-700">关于</Link>
            <Link to="/feedback" className="hover:text-slate-700">反馈</Link>
            <Link to="/privacy" className="hover:text-slate-700">隐私</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
