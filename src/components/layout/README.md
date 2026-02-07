# Layout Components

布局组件模块，为脑力训练平台提供统一的页面结构和容器组件。

## 组件列表

### Header

页面头部组件，显示平台标题和导航功能。

**特性：**
- 显示平台或游戏标题
- 可选的返回主页链接
- 支持自定义导航回调
- 响应式设计
- 完整的可访问性支持（ARIA 标签）

**使用示例：**

```tsx
import { Header } from '@/components/layout';

// 基础用法
<Header title="脑力训练平台" />

// 带返回主页链接
<Header 
  title="Stroop 测试" 
  showHomeLink 
  onHomeClick={() => navigate('/')} 
/>
```

**Props：**
- `title?: string` - 平台标题（默认："脑力训练平台"）
- `showHomeLink?: boolean` - 是否显示返回主页链接（默认：false）
- `onHomeClick?: () => void` - 返回主页的回调函数
- `className?: string` - 自定义类名

---

### GameLayout

游戏页面布局组件，为所有游戏提供统一的布局结构。

**特性：**
- 包含 Header 和主内容区域
- 自动处理页面高度（min-h-screen）
- 统一的背景色和间距
- 预留 Footer 扩展位置

**使用示例：**

```tsx
import { GameLayout } from '@/components/layout';

// 基础用法
<GameLayout gameTitle="Stroop 测试">
  <StroopGame />
</GameLayout>

// 带返回主页功能
<GameLayout 
  gameTitle="舒尔特方格" 
  showHomeLink 
  onHomeClick={() => navigate('/')}
>
  <SchulteGame />
</GameLayout>

// 自定义 Header 属性
<GameLayout 
  gameTitle="记忆游戏"
  headerProps={{ className: 'bg-blue-800' }}
>
  <MemoryGame />
</GameLayout>
```

**Props：**
- `children: React.ReactNode` - 游戏内容
- `gameTitle?: string` - 游戏标题
- `showHomeLink?: boolean` - 是否显示返回主页链接（默认：true）
- `onHomeClick?: () => void` - 返回主页的回调函数
- `className?: string` - 主内容区域的自定义类名
- `headerProps?: Partial<HeaderProps>` - Header 的额外属性

---

### PageContainer

响应式页面容器组件，提供不同尺寸和内边距配置。

**特性：**
- 5 种预设尺寸（sm, md, lg, xl, full）
- 可配置的内边距（垂直和水平）
- 自动居中对齐
- 响应式断点适配
- 移动端优先设计

**响应式断点：**
- 移动端：< 768px
- 平板：768px - 1024px
- 桌面：> 1024px

**使用示例：**

```tsx
import { PageContainer } from '@/components/layout';

// 基础用法 - 中等尺寸容器
<PageContainer>
  <h1>内容</h1>
</PageContainer>

// 小尺寸容器，适合表单页面
<PageContainer size="sm" paddingY="lg">
  <form>...</form>
</PageContainer>

// 全宽容器，适合游戏界面
<PageContainer size="full" paddingY="md" paddingX="md">
  <GameBoard />
</PageContainer>

// 居中显示的容器
<PageContainer size="lg" centered>
  <WelcomeScreen />
</PageContainer>

// 无内边距容器
<PageContainer size="xl" paddingY="none" paddingX="none">
  <FullWidthContent />
</PageContainer>
```

**Props：**
- `children: React.ReactNode` - 容器内容
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` - 容器最大宽度（默认：'lg'）
  - `sm`: 672px (max-w-2xl)
  - `md`: 896px (max-w-4xl)
  - `lg`: 1152px (max-w-6xl)
  - `xl`: 1280px (max-w-7xl)
  - `full`: 100% (max-w-full)
- `centered?: boolean` - 是否居中显示（默认：true）
- `paddingY?: 'none' | 'sm' | 'md' | 'lg'` - 垂直内边距（默认：'md'）
- `paddingX?: 'none' | 'sm' | 'md' | 'lg'` - 水平内边距（默认：'md'）
- `className?: string` - 自定义类名

---

## 完整示例

### 游戏页面布局

```tsx
import { GameLayout, PageContainer } from '@/components/layout';

function StroopPage() {
  const navigate = useNavigate();
  
  return (
    <GameLayout 
      gameTitle="Stroop 测试" 
      showHomeLink 
      onHomeClick={() => navigate('/')}
    >
      <PageContainer size="lg" paddingY="lg">
        {/* 游戏内容 */}
        <StroopWelcome />
        <StroopGame />
        <StroopResults />
      </PageContainer>
    </GameLayout>
  );
}
```

### 主页布局

```tsx
import { Header, PageContainer } from '@/components/layout';

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="脑力训练平台" />
      <PageContainer size="xl" paddingY="lg">
        <h1 className="text-4xl font-bold mb-8">选择游戏</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 游戏卡片 */}
        </div>
      </PageContainer>
    </div>
  );
}
```

### 嵌套容器

```tsx
import { GameLayout, PageContainer } from '@/components/layout';

function ComplexGamePage() {
  return (
    <GameLayout gameTitle="复杂游戏">
      {/* 外层容器 - 全宽 */}
      <PageContainer size="full" paddingY="none">
        {/* 游戏区域 - 全宽背景 */}
        <div className="bg-blue-900 py-8">
          <PageContainer size="lg">
            <GameBoard />
          </PageContainer>
        </div>
        
        {/* 统计区域 - 限制宽度 */}
        <PageContainer size="md" paddingY="lg">
          <Statistics />
        </PageContainer>
      </PageContainer>
    </GameLayout>
  );
}
```

## 设计原则

### 1. 一致性
所有布局组件使用统一的设计语言：
- Slate 色系作为主色调
- 统一的间距系统（4px 基准）
- 一致的圆角和阴影

### 2. 响应式
所有组件都支持移动端、平板和桌面设备：
- 移动端优先设计
- 自动适配不同屏幕尺寸
- 触摸友好的交互元素（最小 44x44px）

### 3. 可访问性
所有组件都遵循 WCAG 2.1 标准：
- 语义化 HTML 标签
- ARIA 标签和角色
- 键盘导航支持
- 屏幕阅读器友好

### 4. 可扩展性
组件设计考虑未来扩展：
- 灵活的 props 接口
- 支持自定义类名
- 预留扩展位置（如 Footer）

## 技术要求

**验证的需求：**
- Requirements 2.4: 游戏页面提供返回主页的功能
- Requirements 5.1: 统一的配置界面样式
- Requirements 6.1: 统一的结果展示布局
- Requirements 10.1: 移动设备支持（320px+）
- Requirements 10.2: 平板设备优化
- Requirements 10.3: 桌面设备最佳体验
- Requirements 10.4: 屏幕尺寸改变时自动调整布局

## 测试建议

### 单元测试
```tsx
import { render, screen } from '@testing-library/react';
import { Header, GameLayout, PageContainer } from './index';

describe('Header', () => {
  it('should render title', () => {
    render(<Header title="测试标题" />);
    expect(screen.getByText('测试标题')).toBeInTheDocument();
  });

  it('should show home link when showHomeLink is true', () => {
    render(<Header showHomeLink />);
    expect(screen.getByText('返回主页')).toBeInTheDocument();
  });
});

describe('PageContainer', () => {
  it('should apply correct size class', () => {
    const { container } = render(
      <PageContainer size="sm">Content</PageContainer>
    );
    expect(container.firstChild).toHaveClass('max-w-2xl');
  });
});
```

### 响应式测试
在不同视口尺寸下测试：
- 320px（小型手机）
- 375px（中型手机）
- 768px（平板）
- 1024px（小型桌面）
- 1920px（大型桌面）

## 维护说明

### 添加新的容器尺寸
在 `PageContainer.tsx` 中修改 `getSizeClass` 函数：

```tsx
const sizeMap: Record<ContainerSize, string> = {
  // ... 现有尺寸
  '2xl': 'max-w-screen-2xl', // 新增尺寸
};
```

### 自定义 Header 样式
通过 `headerProps` 传递自定义属性：

```tsx
<GameLayout
  headerProps={{
    className: 'bg-gradient-to-r from-blue-800 to-purple-800'
  }}
>
  {/* 内容 */}
</GameLayout>
```

### 扩展 Footer
在 `GameLayout.tsx` 中取消注释 Footer 区域并添加内容。
