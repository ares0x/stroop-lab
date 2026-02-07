import React from 'react';

/**
 * PageContainer 尺寸类型
 */
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * PageContainer 组件属性接口
 */
export interface PageContainerProps {
  /** 子组件内容 */
  children: React.ReactNode;
  /** 容器最大宽度 */
  size?: ContainerSize;
  /** 是否居中显示 */
  centered?: boolean;
  /** 垂直内边距 */
  paddingY?: 'none' | 'sm' | 'md' | 'lg';
  /** 水平内边距 */
  paddingX?: 'none' | 'sm' | 'md' | 'lg';
  /** 自定义类名 */
  className?: string;
}

/**
 * 获取容器尺寸对应的 Tailwind 类名
 */
const getSizeClass = (size: ContainerSize): string => {
  const sizeMap: Record<ContainerSize, string> = {
    sm: 'max-w-2xl',    // 672px
    md: 'max-w-4xl',    // 896px
    lg: 'max-w-6xl',    // 1152px
    xl: 'max-w-7xl',    // 1280px
    full: 'max-w-full',
  };
  return sizeMap[size];
};

/**
 * 获取垂直内边距对应的 Tailwind 类名
 */
const getPaddingYClass = (padding: 'none' | 'sm' | 'md' | 'lg'): string => {
  const paddingMap = {
    none: '',
    sm: 'py-4',
    md: 'py-6 md:py-8',
    lg: 'py-8 md:py-12',
  };
  return paddingMap[padding];
};

/**
 * 获取水平内边距对应的 Tailwind 类名
 */
const getPaddingXClass = (padding: 'none' | 'sm' | 'md' | 'lg'): string => {
  const paddingMap = {
    none: '',
    sm: 'px-4',
    md: 'px-4 md:px-6',
    lg: 'px-4 md:px-8',
  };
  return paddingMap[padding];
};

/**
 * PageContainer 组件
 * 
 * 提供响应式的页面容器，支持不同的最大宽度和内边距配置。
 * 自动适配移动端、平板和桌面设备的布局需求。
 * 
 * 响应式断点：
 * - 移动端：< 768px
 * - 平板：768px - 1024px
 * - 桌面：> 1024px
 * 
 * @example
 * ```tsx
 * // 基础用法 - 中等尺寸容器
 * <PageContainer>
 *   <h1>内容</h1>
 * </PageContainer>
 * 
 * // 小尺寸容器，适合表单页面
 * <PageContainer size="sm" paddingY="lg">
 *   <form>...</form>
 * </PageContainer>
 * 
 * // 全宽容器，适合游戏界面
 * <PageContainer size="full" paddingY="md" paddingX="md">
 *   <GameBoard />
 * </PageContainer>
 * 
 * // 居中显示的容器
 * <PageContainer size="lg" centered>
 *   <WelcomeScreen />
 * </PageContainer>
 * ```
 * 
 * **Validates: Requirements 10.1, 10.2, 10.3**
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  size = 'lg',
  centered = true,
  paddingY = 'md',
  paddingX = 'md',
  className = '',
}) => {
  const sizeClass = getSizeClass(size);
  const paddingYClass = getPaddingYClass(paddingY);
  const paddingXClass = getPaddingXClass(paddingX);
  const centerClass = centered ? 'mx-auto' : '';

  return (
    <div
      className={`
        w-full
        ${sizeClass}
        ${centerClass}
        ${paddingYClass}
        ${paddingXClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
};

export default PageContainer;
