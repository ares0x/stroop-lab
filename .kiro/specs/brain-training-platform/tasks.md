# Implementation Plan: Brain Training Platform

## Overview

本实现计划将现有的 Stroop 测试应用升级为支持多游戏的脑力训练平台。实现采用增量式方法，首先建立核心架构和共享组件，然后迁移现有 Stroop 游戏，最后添加新的 Schulte 游戏。每个阶段都包含相应的测试任务，确保代码质量和功能正确性。

## Tasks

- [x] 1. 建立项目基础架构
  - 创建新的文件夹结构（components/common, components/layout, components/games, hooks/common, hooks/games, types, utils/common, utils/games, config, pages）
  - 设置 Vitest 测试框架和 fast-check 属性测试库
  - 配置 React Router v6 用于客户端路由
  - 创建 ErrorBoundary 组件用于全局错误处理
  - _Requirements: 1.1, 1.4, 13.1_

- [x] 2. 实现核心类型定义和接口
  - [x] 2.1 创建通用类型定义
    - 在 types/common.ts 中定义 GameState、DifficultyLevel、GameMetadata、BaseGameConfig、BaseGameResult、GameSession、GameEngine、GameHistory 接口
    - _Requirements: 1.3, 9.1_
  
  - [x] 2.2 创建 Stroop 游戏类型定义
    - 在 types/games/stroop.ts 中定义 StroopConfig、StroopTrial、StroopResult 接口
    - _Requirements: 3.1_
  
  - [x] 2.3 创建 Schulte 游戏类型定义
    - 在 types/games/schulte.ts 中定义 SchulteConfig、SchulteCell、SchulteResult 接口
    - _Requirements: 4.1_

- [x] 3. 实现共享 UI 组件库
  - [x] 3.1 实现 Button 组件
    - 创建 components/common/Button.tsx，支持 primary、secondary、danger 三种变体
    - 支持 sm、md、lg 三种尺寸
    - 确保最小点击区域 44x44px
    - _Requirements: 7.1, 10.5_
  
  - [ ]* 3.2 编写 Button 组件单元测试
    - 测试不同变体和尺寸的渲染
    - 测试点击事件处理
    - 测试禁用状态
    - _Requirements: 7.1_
  
  - [x] 3.3 实现 Card 组件
    - 创建 components/common/Card.tsx，使用 Slate 色系和 rounded-2xl 圆角
    - 支持可选的标题和悬停效果
    - _Requirements: 7.2_
  
  - [x] 3.4 实现 ProgressBar 组件
    - 创建 components/common/ProgressBar.tsx，显示当前进度和总进度
    - 支持可选的标签和自定义颜色
    - _Requirements: 7.3_
  
  - [ ]* 3.5 编写 ProgressBar 属性测试
    - **Property 10: 响应式组件适配**
    - **Validates: Requirements 7.7, 10.4**
  
  - [x] 3.6 实现 LoadingSpinner 组件
    - 创建 components/common/LoadingSpinner.tsx，用于异步加载指示
    - _Requirements: 12.2_

- [x] 4. 实现布局组件
  - [x] 4.1 创建 Header 组件
    - 实现 components/layout/Header.tsx，显示平台标题和导航
    - 提供返回主页的链接
    - _Requirements: 2.4_
  
  - [x] 4.2 创建 GameLayout 组件
    - 实现 components/layout/GameLayout.tsx，为所有游戏页面提供统一布局
    - 包含 Header 和内容区域
    - _Requirements: 5.1, 6.1_
  
  - [x] 4.3 创建 PageContainer 组件
    - 实现 components/layout/PageContainer.tsx，提供响应式容器
    - 支持移动端、平板和桌面布局
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 5. 实现本地存储管理
  - [x] 5.1 创建 StorageManager 类
    - 实现 utils/common/storage.ts 中的 StorageManager 类
    - 实现 saveGameResult、getGameHistory、clearGameHistory、getAllGameHistories 方法
    - 处理 localStorage 不可用的降级情况
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.7_
  
  - [ ]* 5.2 编写存储往返属性测试
    - **Property 15: 存储数据往返一致性**
    - **Validates: Requirements 8.5, 8.6**
  
  - [ ]* 5.3 编写存储隔离属性测试
    - **Property 13: 游戏数据隔离**
    - **Validates: Requirements 8.3**
  
  - [ ]* 5.4 编写最佳记录更新属性测试
    - **Property 14: 最佳记录更新**
    - **Validates: Requirements 8.4**
  
  - [ ]* 5.5 编写存储降级单元测试
    - 测试 localStorage 不可用时的降级行为
    - _Requirements: 8.7_

- [x] 6. 实现通用游戏状态管理 Hook
  - [x] 6.1 创建 useGameState Hook
    - 实现 hooks/common/useGameState.ts
    - 管理游戏状态（IDLE、CONFIGURING、PLAYING、COMPLETED）
    - 提供 startGame、endGame、resetGame 方法
    - _Requirements: 9.1, 9.3_
  
  - [ ]* 6.2 编写游戏状态转换属性测试
    - **Property 17: 游戏状态转换正确性**
    - **Validates: Requirements 9.1**
  
  - [ ]* 6.3 编写配置保护属性测试
    - **Property 19: 游戏进行中配置保护**
    - **Validates: Requirements 9.4**
  
  - [x] 6.4 创建 useLocalStorage Hook
    - 实现 hooks/common/useLocalStorage.ts，封装 StorageManager
    - 提供 React Hook 接口用于组件中使用
    - _Requirements: 8.2_

- [x] 7. 迁移和重构 Stroop 游戏
  - [x] 7.1 实现 Stroop 游戏逻辑
    - 创建 utils/games/stroop/gameLogic.ts
    - 实现 generateStroopTrial 函数（保留原有逻辑）
    - 实现 calculateStroopScore 函数（保留原有计分规则）
    - _Requirements: 3.2_
  
  - [x] 7.2 实现 Stroop 统计工具
    - 创建 utils/games/stroop/statistics.ts
    - 实现准确率、平均反应时间等统计计算
    - _Requirements: 3.4_
  
  - [ ]* 7.3 编写 Stroop 向后兼容性属性测试
    - **Property 3: Stroop 游戏向后兼容性**
    - **Validates: Requirements 3.2, 3.4, 3.5**
  
  - [x] 7.4 创建 useStroopGame Hook
    - 实现 hooks/games/useStroopGame.ts
    - 整合 useGameState 和 Stroop 游戏逻辑
    - 保留所有现有功能
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 7.5 创建 Stroop 游戏组件
    - 实现 components/games/stroop/StroopWelcome.tsx（配置界面）
    - 实现 components/games/stroop/StroopGame.tsx（游戏界面）
    - 实现 components/games/stroop/StroopResults.tsx（结果界面）
    - 保留键盘和鼠标双输入支持
    - _Requirements: 3.1, 3.3, 11.1, 11.2_
  
  - [ ]* 7.6 编写 Stroop 双输入等价性属性测试
    - **Property 20: 双输入方式等价性**
    - **Validates: Requirements 11.2, 11.4**
  
  - [x] 7.7 创建 StroopPage 页面组件
    - 实现 pages/StroopPage.tsx，整合所有 Stroop 组件
    - 使用 GameLayout 布局
    - _Requirements: 3.1_

- [x] 8. Checkpoint - 验证 Stroop 游戏迁移
  - 运行所有 Stroop 相关测试
  - 手动测试 Stroop 游戏功能完整性
  - 确保与原版本行为一致
  - 如有问题，询问用户

- [x] 9. 实现 Schulte 游戏
  - [x] 9.1 实现 Schulte 游戏逻辑
    - 创建 utils/games/schulte/gameLogic.ts
    - 实现 generateSchulteGrid 函数（Fisher-Yates 洗牌算法）
    - 实现 calculateSchulteScore 函数
    - _Requirements: 4.2_
  
  - [ ]* 9.2 编写 Schulte 网格生成属性测试
    - **Property 4: Schulte 网格生成正确性**
    - **Validates: Requirements 4.1, 4.2**
  
  - [x] 9.3 实现 Schulte 统计工具
    - 创建 utils/games/schulte/statistics.ts
    - 实现完成时间、错误次数、平均查找时间等统计
    - _Requirements: 4.6_
  
  - [x] 9.4 创建 useSchulteGame Hook
    - 实现 hooks/games/useSchulteGame.ts
    - 管理网格状态、当前期望数字、错误计数
    - 实现点击验证逻辑
    - _Requirements: 4.3, 4.4_
  
  - [ ]* 9.5 编写 Schulte 点击顺序验证属性测试
    - **Property 5: Schulte 点击顺序验证**
    - **Validates: Requirements 4.3, 4.4**
  
  - [ ]* 9.6 编写 Schulte 结果统计属性测试
    - **Property 6: Schulte 结果统计完整性**
    - **Validates: Requirements 4.6**
  
  - [x] 9.7 创建 Schulte 游戏组件
    - 实现 components/games/schulte/SchulteWelcome.tsx（配置界面，选择网格尺寸）
    - 实现 components/games/schulte/SchulteGame.tsx（游戏界面，显示网格和计时器）
    - 实现 components/games/schulte/SchulteResults.tsx（结果界面）
    - _Requirements: 4.1, 4.5_
  
  - [x] 9.8 创建 SchultePage 页面组件
    - 实现 pages/SchultePage.tsx，整合所有 Schulte 组件
    - 使用 GameLayout 布局
    - _Requirements: 4.1_

- [-] 10. 实现游戏注册和主页
  - [x] 10.1 创建游戏注册配置
    - 实现 config/games.ts
    - 注册 Stroop 和 Schulte 游戏的元数据
    - 配置路由和懒加载组件
    - _Requirements: 1.2, 2.1_
  
  - [x] 10.2 创建 GameCard 组件
    - 实现游戏卡片组件，显示游戏信息
    - 支持点击导航到游戏页面
    - _Requirements: 2.2, 2.3_
  
  - [ ]* 10.3 编写游戏卡片信息完整性属性测试
    - **Property 1: 游戏卡片信息完整性**
    - **Validates: Requirements 2.2**
  
  - [x] 10.4 创建 HomePage 组件
    - 实现 pages/HomePage.tsx
    - 显示所有注册游戏的卡片
    - 使用网格布局，支持响应式
    - _Requirements: 2.1, 2.5_
  
  - [ ]* 10.5 编写游戏导航一致性属性测试
    - **Property 2: 游戏导航一致性**
    - **Validates: Requirements 2.3, 2.4**

- [x] 11. 实现路由和应用入口
  - [x] 11.1 配置 React Router
    - 在 App.tsx 中设置路由配置
    - 从 config/games.ts 动态生成路由
    - 添加 Suspense 和 ErrorBoundary
    - _Requirements: 1.2_
  
  - [x] 11.2 更新应用入口
    - 更新 main.tsx，包裹 BrowserRouter
    - 添加全局错误处理
    - _Requirements: 13.1_
  
  - [ ]* 11.3 编写加载状态指示属性测试
    - **Property 22: 加载状态指示**
    - **Validates: Requirements 12.2**

- [x] 12. 实现配置验证和错误处理
  - [x] 12.1 创建验证工具函数
    - 实现 utils/common/validation.ts
    - 为游戏配置提供验证函数
    - _Requirements: 5.3_
  
  - [ ]* 12.2 编写配置验证属性测试
    - **Property 7: 配置验证一致性**
    - **Validates: Requirements 5.3**
  
  - [x] 12.3 创建错误处理工具
    - 实现 utils/common/errorHandler.ts
    - 实现 ErrorHandler 类的所有方法
    - _Requirements: 13.1, 13.2_
  
  - [ ]* 12.4 编写错误处理属性测试
    - **Property 23: 错误处理完整性**
    - **Validates: Requirements 13.1, 13.2**
  
  - [ ]* 12.5 编写输入验证反馈属性测试
    - **Property 26: 输入验证即时反馈**
    - **Validates: Requirements 13.5**

- [x] 13. 实现结果展示和历史记录功能
  - [x] 13.1 增强结果展示组件
    - 在各游戏的 Results 组件中集成历史记录显示
    - 显示个人最佳成绩
    - 提供"再玩一次"和"返回配置"按钮
    - _Requirements: 6.2, 6.3, 6.5_
  
  - [ ]* 13.2 编写结果数据显示属性测试
    - **Property 8: 结果数据显示完整性**
    - **Validates: Requirements 6.2**
  
  - [ ]* 13.3 编写最佳成绩突出显示属性测试
    - **Property 9: 最佳成绩突出显示**
    - **Validates: Requirements 6.5**
  
  - [ ]* 13.4 编写游戏结果持久化属性测试
    - **Property 12: 游戏结果持久化**
    - **Validates: Requirements 8.2**

- [x] 14. 实现键盘支持和可访问性
  - [x] 14.1 添加键盘快捷键支持
    - 为 Stroop 游戏添加键盘快捷键（保留现有）
    - 为导航添加键盘支持（Tab、Enter）
    - _Requirements: 11.1, 11.2_
  
  - [x] 14.2 添加键盘提示 UI
    - 在游戏界面显示可用的键盘快捷键
    - _Requirements: 11.3_
  
  - [ ]* 14.3 编写键盘提示可见性属性测试
    - **Property 21: 键盘提示可见性**
    - **Validates: Requirements 11.3**
  
  - [x] 14.4 添加 ARIA 标签和语义化 HTML
    - 为所有交互元素添加适当的 ARIA 标签
    - 确保屏幕阅读器友好
    - _Requirements: 10.5_

- [x] 15. 响应式设计优化
  - [x] 15.1 实现移动端适配
    - 优化所有组件在移动设备上的显示
    - 确保触摸目标尺寸符合要求（44x44px）
    - _Requirements: 10.1, 10.5_
  
  - [ ]* 15.2 编写触摸目标尺寸属性测试
    - **Property 11: 触摸目标尺寸要求**
    - **Validates: Requirements 10.5**
  
  - [ ] 15.3 测试不同屏幕尺寸
    - 在 320px、768px、1024px、1920px 宽度下测试
    - 确保布局正确调整
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 16. 性能优化
  - [x] 16.1 实现代码分割
    - 使用 React.lazy 对游戏页面进行懒加载
    - 配置 Vite 的代码分割策略
    - _Requirements: 12.3_
  
  - [x] 16.2 优化组件渲染
    - 使用 React.memo 包装纯组件
    - 使用 useMemo 和 useCallback 优化性能
    - _Requirements: 12.4_
  
  - [ ] 16.3 添加性能监控
    - 使用 React DevTools Profiler 分析性能
    - 优化慢速组件
    - _Requirements: 12.1_

- [x] 17. 国际化准备
  - [x] 17.1 提取文本字符串
    - 创建 i18n/zh-CN.ts 文件
    - 将所有硬编码文本提取到语言文件
    - _Requirements: 14.1, 14.2_
  
  - [x] 17.2 创建文本管理工具
    - 实现 utils/common/i18n.ts
    - 提供 useTranslation Hook
    - _Requirements: 14.3_

- [ ] 18. 最终测试和文档
  - [ ]* 18.1 运行完整测试套件
    - 运行所有单元测试和属性测试
    - 确保测试覆盖率达到目标（整体 ≥80%，核心逻辑 ≥90%）
    - _Requirements: All_
  
  - [ ]* 18.2 编写剩余的属性测试
    - **Property 16: 存储降级处理**
    - **Property 18: 状态变化通知**
    - **Property 24: 数据加载失败恢复**
    - **Property 25: 破坏性操作确认**
    - **Validates: Requirements 8.7, 9.2, 13.3, 13.4**
  
  - [ ] 18.3 端到端测试
    - 手动测试完整的用户流程
    - 测试所有游戏功能
    - 测试跨浏览器兼容性
    - _Requirements: All_
  
  - [ ] 18.4 更新项目文档
    - 更新 README.md，说明新的项目结构
    - 添加开发指南和贡献指南
    - 记录如何添加新游戏
    - _Requirements: 1.2_

- [ ] 19. Final Checkpoint - 完整性验证
  - 确保所有功能正常工作
  - 确保所有测试通过
  - 确保代码质量符合标准
  - 询问用户是否有其他需求或调整

## Notes

- 任务标记 `*` 的为可选任务，可以跳过以加快 MVP 开发
- 每个任务都引用了具体的需求编号以确保可追溯性
- Checkpoint 任务用于增量验证，确保每个阶段的质量
- 属性测试验证通用正确性属性，单元测试验证具体示例和边缘情况
- 所有属性测试都标注了对应的设计文档属性编号
- 建议按顺序执行任务，因为后续任务依赖前面任务的输出
