import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header 组件属性接口
 */
export interface HeaderProps {
  /** 平台标题 / 品牌名 */
  title?: string;
  /** 是否显示返回主页链接 */
  showHomeLink?: boolean;
  /** 返回主页的回调函数（如果未使用路由） */
  onHomeClick?: () => void;
  /** 首页时标题是否可点击回首页 */
  titleLinkToHome?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * Header 组件
 * 
 * 为平台提供统一的页面头部，包含标题和导航功能。
 * 支持返回主页的链接，可以通过回调函数或路由实现导航。
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Header title="脑力训练平台" />
 * 
 * // 带返回主页链接
 * <Header 
 *   title="Stroop 测试" 
 *   showHomeLink 
 *   onHomeClick={() => navigate('/')} 
 * />
 * ```
 * 
 * **Validates: Requirements 2.4**
 */
export const Header: React.FC<HeaderProps> = ({
  title = 'Cogni',
  showHomeLink = false,
  onHomeClick,
  titleLinkToHome = false,
  className = '',
}) => {
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onHomeClick) {
      onHomeClick();
    } else {
      // 如果没有提供回调函数，使用默认的导航行为
      window.location.href = '/';
    }
  };

  return (
    <header
      className={`bg-slate-900 text-white shadow-md ${className}`}
      role="banner"
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {titleLinkToHome ? (
            <Link to="/" className="hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h1>
            </Link>
          ) : (
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h1>
          )}

          {/* 导航 */}
          {showHomeLink && (
            <nav role="navigation" aria-label="主导航">
              <a
                href="/"
                onClick={handleHomeClick}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-200 bg-slate-700/80 rounded-lg hover:bg-slate-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="返回主页"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>返回主页</span>
              </a>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
