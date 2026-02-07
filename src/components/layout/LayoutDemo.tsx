import React, { useState } from 'react';
import { Header } from './Header';
import { GameLayout } from './GameLayout';
import { PageContainer } from './PageContainer';
import type { ContainerSize } from './PageContainer';

/**
 * LayoutDemo 组件
 * 
 * 演示布局组件的使用方法和效果。
 * 这个组件仅用于开发和测试，不会在生产环境中使用。
 */
export const LayoutDemo: React.FC = () => {
  const [containerSize, setContainerSize] = useState<ContainerSize>('lg');
  const [showHomeLink, setShowHomeLink] = useState(true);

  return (
    <div className="space-y-8">
      {/* Demo 1: Header 组件 */}
      <section className="border-2 border-dashed border-slate-300 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Header 组件演示</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">基础 Header</h3>
            <Header title="脑力训练平台" />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">带返回链接的 Header</h3>
            <Header 
              title="Stroop 测试" 
              showHomeLink 
              onHomeClick={() => alert('返回主页')} 
            />
          </div>

          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showHomeLink}
                onChange={(e) => setShowHomeLink(e.target.checked)}
                className="w-4 h-4"
              />
              <span>显示返回主页链接</span>
            </label>
          </div>
        </div>
      </section>

      {/* Demo 2: PageContainer 组件 */}
      <section className="border-2 border-dashed border-slate-300 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">PageContainer 组件演示</h2>
        
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {(['sm', 'md', 'lg', 'xl', 'full'] as ContainerSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setContainerSize(size)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  containerSize === size
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="bg-slate-100 p-4 rounded-lg">
            <PageContainer size={containerSize}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">
                  容器尺寸: {containerSize}
                </h3>
                <p className="text-slate-600">
                  这是一个 PageContainer 组件的示例。
                  当前尺寸设置为 <strong>{containerSize}</strong>。
                  调整浏览器窗口大小可以看到响应式效果。
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded">
                  <p className="text-sm text-slate-500">
                    容器会根据屏幕尺寸自动调整宽度和内边距。
                  </p>
                </div>
              </div>
            </PageContainer>
          </div>
        </div>
      </section>

      {/* Demo 3: GameLayout 组件 */}
      <section className="border-2 border-dashed border-slate-300 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">GameLayout 组件演示</h2>
        
        <div className="bg-slate-100 p-4 rounded-lg">
          <p className="mb-4 text-slate-600">
            GameLayout 组件结合了 Header 和主内容区域。
            下面是一个完整的游戏页面布局示例：
          </p>
          
          <div className="border-2 border-slate-300 rounded-lg overflow-hidden">
            <GameLayout 
              gameTitle="示例游戏" 
              showHomeLink={showHomeLink}
              onHomeClick={() => alert('返回主页')}
            >
              <PageContainer size="lg" paddingY="lg">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-4">游戏内容区域</h3>
                  <p className="text-slate-600 mb-4">
                    这里是游戏的主要内容。GameLayout 提供了统一的页面结构，
                    包含 Header 和主内容区域。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">特性 1</h4>
                      <p className="text-sm text-slate-600">
                        统一的页面头部
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2">特性 2</h4>
                      <p className="text-sm text-slate-600">
                        响应式内容区域
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold mb-2">特性 3</h4>
                      <p className="text-sm text-slate-600">
                        灵活的布局配置
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold mb-2">特性 4</h4>
                      <p className="text-sm text-slate-600">
                        可访问性支持
                      </p>
                    </div>
                  </div>
                </div>
              </PageContainer>
            </GameLayout>
          </div>
        </div>
      </section>

      {/* Demo 4: 嵌套容器 */}
      <section className="border-2 border-dashed border-slate-300 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">嵌套容器演示</h2>
        
        <div className="bg-slate-100 p-4 rounded-lg">
          <PageContainer size="full" paddingY="none">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 py-8">
              <PageContainer size="lg">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-2">外层全宽容器</h3>
                  <p className="text-slate-600">
                    外层容器使用 size="full"，内层容器使用 size="lg"。
                    这种嵌套方式可以创建全宽背景但内容限制宽度的布局。
                  </p>
                </div>
              </PageContainer>
            </div>
            
            <PageContainer size="md" paddingY="lg">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">中等宽度容器</h3>
                <p className="text-slate-600">
                  这个容器使用 size="md"，适合显示统计信息或表单。
                </p>
              </div>
            </PageContainer>
          </PageContainer>
        </div>
      </section>

      {/* 响应式提示 */}
      <section className="border-2 border-dashed border-green-300 bg-green-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2 text-green-800">💡 响应式提示</h2>
        <p className="text-green-700">
          调整浏览器窗口大小以查看响应式效果。所有布局组件都会自动适配不同的屏幕尺寸。
        </p>
        <ul className="mt-2 space-y-1 text-sm text-green-600">
          <li>• 移动端：&lt; 768px</li>
          <li>• 平板：768px - 1024px</li>
          <li>• 桌面：&gt; 1024px</li>
        </ul>
      </section>
    </div>
  );
};

export default LayoutDemo;
