import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { HeaderProps } from "./Header";

/**
 * GameLayout 组件属性接口
 */
export interface GameLayoutProps {
    /** 子组件内容 */
    children: React.ReactNode;
    /** 游戏标题（显示在 Header 中） */
    gameTitle?: string;
    /** 是否显示返回主页链接 */
    showHomeLink?: boolean;
    /** 返回主页的回调函数 */
    onHomeClick?: () => void;
    /** 首页时标题是否可点击回首页 */
    titleLinkToHome?: boolean;
    /** 自定义类名 */
    className?: string;
    /** Header 的额外属性 */
    headerProps?: Partial<HeaderProps>;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
    children,
    gameTitle,
    showHomeLink = true,
    onHomeClick,
    titleLinkToHome = false,
    className = "",
    headerProps = {},
}) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header
                title={gameTitle}
                showHomeLink={showHomeLink}
                onHomeClick={onHomeClick}
                titleLinkToHome={titleLinkToHome}
                {...headerProps}
            />

            <main className={`flex-1 ${className}`} role="main">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default GameLayout;
