# Design Document: Brain Training Platform

## Overview

本设计文档描述了脑力训练平台的技术架构和实现方案。该平台将现有的 Stroop 测试应用升级为支持多种认知训练游戏的可扩展平台，采用 React 19 + TypeScript + Vite + Tailwind CSS v4 技术栈。

设计核心原则：
- **可扩展性**：通过插件化架构支持新游戏的轻松添加
- **一致性**：统一的 UI 设计语言和用户体验
- **性能**：优化的代码分割和懒加载策略
- **隐私优先**：100% 客户端运行，无服务器依赖
- **可维护性**：清晰的代码组织和类型安全

## Architecture

### 整体架构

平台采用分层架构设计：

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Pages, Components, UI Elements)       │
├─────────────────────────────────────────┤
│         Application Layer               │
│  (Game Engines, State Management)       │
├─────────────────────────────────────────┤
│         Domain Layer                    │
│  (Game Logic, Business Rules)           │
├─────────────────────────────────────────┤
│         Infrastructure Layer            │
│  (Storage, Utils, Type Definitions)     │
└─────────────────────────────────────────┘
```

### 文件结构

```
src/
├── components/
│   ├── common/              # 共享 UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── LoadingSpinner.tsx
│   ├── layout/              # 布局组件
│   │   ├── Header.tsx
│   │   ├── GameLayout.tsx
│   │   └── PageContainer.tsx
│   └── games/               # 游戏特定组件
│       ├── stroop/
│       │   ├── StroopWelcome.tsx
│       │   ├── StroopGame.tsx
│       │   └── StroopResults.tsx
│       └── schulte/
│           ├── SchulteWelcome.tsx
│           ├── SchulteGame.tsx
│           └── SchulteResults.tsx
├── hooks/
│   ├── common/              # 共享 hooks
│   │   ├── useGameState.ts
│   │   └── useLocalStorage.ts
│   └── games/               # 游戏特定 hooks
│       ├── useStroopGame.ts
│       └── useSchulteGame.ts
├── types/
│   ├── common.ts            # 通用类型定义
│   └── games/
│       ├── stroop.ts
│       └── schulte.ts
├── utils/
│   ├── common/
│   │   ├── storage.ts
│   │   └── validation.ts
│   └── games/
│       ├── stroop/
│       │   ├── gameLogic.ts
│       │   └── statistics.ts
│       └── schulte/
│           ├── gameLogic.ts
│           └── statistics.ts
├── config/
│   └── games.ts             # 游戏注册配置
├── pages/
│   ├── HomePage.tsx
│   ├── StroopPage.tsx
│   └── SchultePage.tsx
├── App.tsx
└── main.tsx
```

### 路由架构

使用 React Router v6 进行客户端路由：

```
/                    → HomePage (游戏选择)
/stroop              → StroopPage (Stroop 测试)
/schulte             → SchultePage (舒尔特方格)
/[future-game]       → [FutureGame]Page (未来游戏)
```

## Components and Interfaces

### 核心类型定义

```typescript
// types/common.ts

/**
 * 游戏状态枚举
 */
export enum GameState {
  IDLE = 'idle',           // 未开始
  CONFIGURING = 'configuring', // 配置中
  PLAYING = 'playing',     // 进行中
  COMPLETED = 'completed'  // 已完成
}

/**
 * 游戏难度级别
 */
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

/**
 * 游戏元数据接口
 */
export interface GameMetadata {
  id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // 分钟
  icon: string;
  color: string; // Tailwind 色值
}

/**
 * 游戏配置基础接口
 */
export interface BaseGameConfig {
  difficulty: DifficultyLevel;
}

/**
 * 游戏结果基础接口
 */
export interface BaseGameResult {
  gameId: string;
  timestamp: number;
  duration: number; // 毫秒
  score: number;
}

/**
 * 游戏会话接口
 */
export interface GameSession<TConfig, TResult> {
  id: string;
  gameId: string;
  state: GameState;
  config: TConfig;
  startTime?: number;
  endTime?: number;
  result?: TResult;
}

/**
 * 游戏引擎接口 - 所有游戏必须实现
 */
export interface GameEngine<TConfig extends BaseGameConfig, TResult extends BaseGameResult> {
  // 初始化游戏
  initialize(config: TConfig): void;
  
  // 开始游戏
  start(): void;
  
  // 处理用户输入
  handleInput(input: unknown): void;
  
  // 结束游戏
  end(): TResult;
  
  // 获取当前状态
  getState(): GameState;
  
  // 重置游戏
  reset(): void;
}

/**
 * 存储的游戏历史记录
 */
export interface GameHistory {
  gameId: string;
  results: BaseGameResult[];
  bestScore: number;
  totalPlays: number;
  lastPlayed: number;
}
```

### Stroop 游戏类型

```typescript
// types/games/stroop.ts

export interface StroopConfig extends BaseGameConfig {
  rounds: number;        // 回合数
  timeLimit?: number;    // 每回合时间限制（秒）
  showTimer: boolean;    // 是否显示计时器
}

export interface StroopTrial {
  word: string;          // 显示的文字
  color: string;         // 文字的颜色
  correctAnswer: string; // 正确答案
}

export interface StroopResult extends BaseGameResult {
  totalRounds: number;
  correctAnswers: number;
  accuracy: number;      // 准确率 (0-1)
  averageResponseTime: number; // 平均反应时间（毫秒）
  trials: {
    trial: StroopTrial;
    userAnswer: string;
    isCorrect: boolean;
    responseTime: number;
  }[];
}
```

### Schulte 游戏类型

```typescript
// types/games/schulte.ts

export interface SchulteConfig extends BaseGameConfig {
  gridSize: 3 | 4 | 5;   // 网格尺寸
}

export interface SchulteCell {
  value: number;
  position: { row: number; col: number };
  isClicked: boolean;
}

export interface SchulteResult extends BaseGameResult {
  gridSize: number;
  totalNumbers: number;
  errors: number;
  averageTimePerNumber: number; // 平均每个数字的查找时间（毫秒）
  clickSequence: {
    expectedNumber: number;
    clickedNumber: number;
    isCorrect: boolean;
    timestamp: number;
  }[];
}
```

### 共享组件接口

```typescript
// components/common/Button.tsx

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

// components/common/Card.tsx

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

// components/common/ProgressBar.tsx

export interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  color?: string;
  className?: string;
}
```

### 游戏注册系统

```typescript
// config/games.ts

export interface GameRegistration {
  metadata: GameMetadata;
  component: React.LazyExoticComponent<React.ComponentType>;
  path: string;
}

export const REGISTERED_GAMES: GameRegistration[] = [
  {
    metadata: {
      id: 'stroop',
      name: 'Stroop 测试',
      description: '测试你的认知控制能力，识别文字颜色而非文字内容',
      difficulty: DifficultyLevel.MEDIUM,
      estimatedDuration: 3,
      icon: '🎨',
      color: 'blue'
    },
    component: lazy(() => import('./pages/StroopPage')),
    path: '/stroop'
  },
  {
    metadata: {
      id: 'schulte',
      name: '舒尔特方格',
      description: '提升注意力和视觉搜索速度，按顺序点击数字',
      difficulty: DifficultyLevel.EASY,
      estimatedDuration: 2,
      icon: '🔢',
      color: 'green'
    },
    component: lazy(() => import('./pages/SchultePage')),
    path: '/schulte'
  }
];
```

## Data Models

### 游戏状态管理

使用 React Hooks 进行状态管理，每个游戏有独立的自定义 Hook：

```typescript
// hooks/common/useGameState.ts

export function useGameState<TConfig, TResult>(
  gameId: string,
  initialConfig: TConfig
) {
  const [state, setState] = useState<GameState>(GameState.IDLE);
  const [config, setConfig] = useState<TConfig>(initialConfig);
  const [result, setResult] = useState<TResult | null>(null);
  const [session, setSession] = useState<GameSession<TConfig, TResult> | null>(null);

  const startGame = useCallback((gameConfig: TConfig) => {
    setConfig(gameConfig);
    setState(GameState.PLAYING);
    setSession({
      id: generateId(),
      gameId,
      state: GameState.PLAYING,
      config: gameConfig,
      startTime: Date.now()
    });
  }, [gameId]);

  const endGame = useCallback((gameResult: TResult) => {
    setState(GameState.COMPLETED);
    setResult(gameResult);
    if (session) {
      setSession({
        ...session,
        state: GameState.COMPLETED,
        endTime: Date.now(),
        result: gameResult
      });
    }
  }, [session]);

  const resetGame = useCallback(() => {
    setState(GameState.IDLE);
    setResult(null);
    setSession(null);
  }, []);

  return {
    state,
    config,
    result,
    session,
    startGame,
    endGame,
    resetGame
  };
}
```

### 本地存储模型

```typescript
// utils/common/storage.ts

export class StorageManager {
  private readonly STORAGE_KEY_PREFIX = 'brain_training_';

  /**
   * 保存游戏结果
   */
  saveGameResult(gameId: string, result: BaseGameResult): void {
    const history = this.getGameHistory(gameId);
    history.results.push(result);
    history.totalPlays += 1;
    history.lastPlayed = Date.now();
    
    if (result.score > history.bestScore) {
      history.bestScore = result.score;
    }
    
    this.setGameHistory(gameId, history);
  }

  /**
   * 获取游戏历史记录
   */
  getGameHistory(gameId: string): GameHistory {
    const key = `${this.STORAGE_KEY_PREFIX}${gameId}_history`;
    const data = localStorage.getItem(key);
    
    if (!data) {
      return {
        gameId,
        results: [],
        bestScore: 0,
        totalPlays: 0,
        lastPlayed: 0
      };
    }
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to parse game history:', error);
      return {
        gameId,
        results: [],
        bestScore: 0,
        totalPlays: 0,
        lastPlayed: 0
      };
    }
  }

  /**
   * 设置游戏历史记录
   */
  private setGameHistory(gameId: string, history: GameHistory): void {
    const key = `${this.STORAGE_KEY_PREFIX}${gameId}_history`;
    try {
      localStorage.setItem(key, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save game history:', error);
    }
  }

  /**
   * 清除游戏历史记录
   */
  clearGameHistory(gameId: string): void {
    const key = `${this.STORAGE_KEY_PREFIX}${gameId}_history`;
    localStorage.removeItem(key);
  }

  /**
   * 获取所有游戏的历史记录
   */
  getAllGameHistories(): GameHistory[] {
    const histories: GameHistory[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.STORAGE_KEY_PREFIX) && key.endsWith('_history')) {
        const gameId = key
          .replace(this.STORAGE_KEY_PREFIX, '')
          .replace('_history', '');
        histories.push(this.getGameHistory(gameId));
      }
    }
    
    return histories;
  }
}
```

### Stroop 游戏逻辑

```typescript
// utils/games/stroop/gameLogic.ts

export const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'] as const;
export const COLOR_NAMES = ['红色', '蓝色', '绿色', '黄色', '紫色'] as const;

export function generateStroopTrial(): StroopTrial {
  const wordIndex = Math.floor(Math.random() * COLOR_NAMES.length);
  const colorIndex = Math.floor(Math.random() * COLORS.length);
  
  return {
    word: COLOR_NAMES[wordIndex],
    color: COLORS[colorIndex],
    correctAnswer: COLORS[colorIndex]
  };
}

export function calculateStroopScore(
  trials: StroopResult['trials']
): number {
  const correctCount = trials.filter(t => t.isCorrect).length;
  const accuracy = correctCount / trials.length;
  const avgResponseTime = trials.reduce((sum, t) => sum + t.responseTime, 0) / trials.length;
  
  // 分数计算：准确率 * 1000 - 平均反应时间 / 10
  return Math.max(0, Math.round(accuracy * 1000 - avgResponseTime / 10));
}
```

### Schulte 游戏逻辑

```typescript
// utils/games/schulte/gameLogic.ts

export function generateSchulteGrid(size: 3 | 4 | 5): SchulteCell[] {
  const totalCells = size * size;
  const numbers = Array.from({ length: totalCells }, (_, i) => i + 1);
  
  // Fisher-Yates 洗牌算法
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  return numbers.map((value, index) => ({
    value,
    position: {
      row: Math.floor(index / size),
      col: index % size
    },
    isClicked: false
  }));
}

export function calculateSchulteScore(
  duration: number,
  errors: number,
  gridSize: number
): number {
  const totalNumbers = gridSize * gridSize;
  const baseScore = 1000;
  const timePenalty = duration / 100; // 每 100ms 扣 1 分
  const errorPenalty = errors * 50;   // 每个错误扣 50 分
  
  return Math.max(0, Math.round(baseScore - timePenalty - errorPenalty));
}
```

## Correctness Properties

*属性（Property）是指在系统所有有效执行中都应该成立的特征或行为——本质上是关于系统应该做什么的形式化陈述。属性是人类可读规范和机器可验证正确性保证之间的桥梁。*

在编写正确性属性之前，让我先进行接受标准的可测试性分析：


### 基于需求的正确性属性

#### Property 1: 游戏卡片信息完整性
*对于任意* 注册的游戏，其游戏卡片渲染结果应该包含游戏名称、简介、难度标识和预计时长信息
**Validates: Requirements 2.2**

#### Property 2: 游戏导航一致性
*对于任意* 游戏卡片，点击后应该导航到对应的游戏页面，且该页面应该提供返回主页的功能
**Validates: Requirements 2.3, 2.4**

#### Property 3: Stroop 游戏向后兼容性
*对于任意* 有效的 Stroop 配置和输入序列，重构后的 Stroop 游戏应该产生与原版本相同的游戏结果（准确率、分数计算、统计数据）
**Validates: Requirements 3.2, 3.4, 3.5**

#### Property 4: Schulte 网格生成正确性
*对于任意* 支持的网格尺寸（3x3、4x4、5x5），生成的网格应该包含从 1 到 n² 的所有数字，且每个数字恰好出现一次
**Validates: Requirements 4.1, 4.2**

#### Property 5: Schulte 点击顺序验证
*对于任意* Schulte 游戏会话，当用户按正确顺序点击所有数字时，游戏应该成功完成；当点击错误数字时，应该记录错误次数
**Validates: Requirements 4.3, 4.4**

#### Property 6: Schulte 结果统计完整性
*对于任意* 完成的 Schulte 游戏，结果对象应该包含完成时间、错误次数和平均每个数字的查找时间
**Validates: Requirements 4.6**

#### Property 7: 配置验证一致性
*对于任意* 游戏配置，当配置值无效时，配置面板应该拒绝该值并提供验证反馈
**Validates: Requirements 5.3**

#### Property 8: 结果数据显示完整性
*对于任意* 游戏结果，结果展示组件应该显示该游戏类型的所有必需统计数据字段
**Validates: Requirements 6.2**

#### Property 9: 最佳成绩突出显示
*对于任意* 游戏结果，如果该结果是新的最佳成绩，结果展示应该突出显示这一信息
**Validates: Requirements 6.5**

#### Property 10: 响应式组件适配
*对于任意* UI 组件，当屏幕宽度改变时，组件应该根据断点自动调整布局
**Validates: Requirements 7.7, 10.4**

#### Property 11: 触摸目标尺寸要求
*对于任意* 可交互元素，其点击区域应该至少为 44x44 像素以确保触摸友好性
**Validates: Requirements 10.5**

#### Property 12: 游戏结果持久化
*对于任意* 完成的游戏会话，游戏结果应该被保存到本地存储，并且可以在后续会话中检索到
**Validates: Requirements 8.2**

#### Property 13: 游戏数据隔离
*对于任意* 两个不同的游戏，它们的历史记录应该独立存储，互不影响
**Validates: Requirements 8.3**

#### Property 14: 最佳记录更新
*对于任意* 游戏，当新的游戏结果分数高于历史最佳分数时，最佳记录应该被更新
**Validates: Requirements 8.4**

#### Property 15: 存储数据往返一致性
*对于任意* 游戏结果对象，序列化到 JSON 然后反序列化应该产生等价的对象
**Validates: Requirements 8.5, 8.6**

#### Property 16: 存储降级处理
*对于任意* 游戏会话，如果 localStorage 不可用，系统应该在内存中保存数据而不崩溃
**Validates: Requirements 8.7**

#### Property 17: 游戏状态转换正确性
*对于任意* 游戏引擎，状态转换应该遵循：IDLE → PLAYING → COMPLETED 的顺序，不允许非法转换
**Validates: Requirements 9.1**

#### Property 18: 状态变化通知
*对于任意* 游戏状态变化，所有订阅的组件应该收到状态更新通知
**Validates: Requirements 9.2**

#### Property 19: 游戏进行中配置保护
*对于任意* 处于 PLAYING 状态的游戏，尝试修改配置应该被阻止
**Validates: Requirements 9.4**

#### Property 20: 双输入方式等价性
*对于任意* 支持键盘和鼠标的游戏操作，使用键盘或鼠标执行相同操作应该产生相同的结果
**Validates: Requirements 11.2, 11.4**

#### Property 21: 键盘提示可见性
*对于任意* 支持键盘输入的游戏界面，应该显示可用的键盘快捷键提示
**Validates: Requirements 11.3**

#### Property 22: 加载状态指示
*对于任意* 异步加载操作，在加载完成前应该显示加载指示器
**Validates: Requirements 12.2**

#### Property 23: 错误处理完整性
*对于任意* 捕获的错误，系统应该同时显示用户友好的错误消息并记录详细错误信息到控制台
**Validates: Requirements 13.1, 13.2**

#### Property 24: 数据加载失败恢复
*对于任意* 数据加载失败的情况，系统应该提供重试选项
**Validates: Requirements 13.3**

#### Property 25: 破坏性操作确认
*对于任意* 破坏性操作（如清除历史记录），执行前应该显示确认对话框
**Validates: Requirements 13.4**

#### Property 26: 输入验证即时反馈
*对于任意* 用户输入字段，当输入无效数据时，应该立即显示验证错误消息
**Validates: Requirements 13.5**

## Error Handling

### 错误分类

1. **用户输入错误**
   - 无效的配置值
   - 错误的游戏操作
   - 处理：即时验证反馈，阻止无效操作

2. **存储错误**
   - localStorage 不可用
   - 存储空间已满
   - 数据损坏
   - 处理：降级到内存存储，显示警告信息

3. **状态错误**
   - 非法状态转换
   - 并发状态修改
   - 处理：忽略非法操作，记录警告

4. **加载错误**
   - 组件加载失败
   - 数据解析失败
   - 处理：显示错误边界，提供重试选项

### 错误处理策略

```typescript
// utils/common/errorHandler.ts

export class ErrorHandler {
  /**
   * 处理用户输入错误
   */
  static handleValidationError(field: string, message: string): void {
    // 显示字段级别的错误消息
    console.warn(`Validation error in ${field}: ${message}`);
  }

  /**
   * 处理存储错误
   */
  static handleStorageError(error: Error): void {
    console.error('Storage error:', error);
    // 降级到内存存储
    // 显示用户通知
  }

  /**
   * 处理状态错误
   */
  static handleStateError(currentState: string, attemptedTransition: string): void {
    console.warn(`Invalid state transition from ${currentState} to ${attemptedTransition}`);
    // 忽略非法转换
  }

  /**
   * 处理加载错误
   */
  static handleLoadError(error: Error, retry?: () => void): void {
    console.error('Load error:', error);
    // 显示错误边界
    // 提供重试按钮
  }

  /**
   * 全局错误处理
   */
  static handleGlobalError(error: Error): void {
    console.error('Unhandled error:', error);
    // 显示通用错误消息
    // 记录到错误追踪服务（如果配置）
  }
}
```

### React Error Boundary

```typescript
// components/common/ErrorBoundary.tsx

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    ErrorHandler.handleGlobalError(error);
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>出错了</h2>
          <p>抱歉，应用遇到了一个错误。</p>
          <button onClick={() => window.location.reload()}>
            重新加载
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Testing Strategy

### 测试方法概述

本项目采用**双重测试策略**，结合单元测试和基于属性的测试（Property-Based Testing, PBT）：

- **单元测试**：验证特定示例、边缘情况和错误条件
- **属性测试**：验证跨所有输入的通用属性

两者互补，共同确保全面的测试覆盖：
- 单元测试捕获具体的 bug
- 属性测试验证通用正确性

### 测试技术栈

- **测试框架**：Vitest（与 Vite 原生集成）
- **属性测试库**：fast-check（TypeScript/JavaScript 的属性测试库）
- **React 测试**：@testing-library/react
- **测试覆盖率**：Vitest 内置覆盖率工具

### 属性测试配置

每个属性测试必须：
- 运行至少 **100 次迭代**（由于随机化）
- 使用注释标签引用设计文档中的属性
- 标签格式：`Feature: brain-training-platform, Property {number}: {property_text}`

示例：
```typescript
import fc from 'fast-check';
import { describe, it, expect } from 'vitest';

describe('Schulte Grid Generation', () => {
  // Feature: brain-training-platform, Property 4: Schulte 网格生成正确性
  it('should generate grid with all numbers from 1 to n² exactly once', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(3, 4, 5), // 网格尺寸
        (size) => {
          const grid = generateSchulteGrid(size);
          const totalCells = size * size;
          const values = grid.map(cell => cell.value).sort((a, b) => a - b);
          
          // 验证所有数字都存在
          expect(values).toEqual(Array.from({ length: totalCells }, (_, i) => i + 1));
          
          // 验证没有重复
          expect(new Set(values).size).toBe(totalCells);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### 单元测试策略

单元测试应该关注：

1. **具体示例**
   - 已知输入和预期输出
   - 典型使用场景

2. **边缘情况**
   - 空输入
   - 边界值
   - 特殊字符

3. **错误条件**
   - 无效输入
   - 异常情况
   - 错误恢复

4. **集成点**
   - 组件交互
   - 状态管理
   - 存储操作

示例：
```typescript
describe('StorageManager', () => {
  it('should save and retrieve game result', () => {
    const storage = new StorageManager();
    const result: BaseGameResult = {
      gameId: 'stroop',
      timestamp: Date.now(),
      duration: 60000,
      score: 850
    };
    
    storage.saveGameResult('stroop', result);
    const history = storage.getGameHistory('stroop');
    
    expect(history.results).toContainEqual(result);
    expect(history.totalPlays).toBe(1);
  });

  it('should handle localStorage unavailable gracefully', () => {
    // 模拟 localStorage 不可用
    const originalLocalStorage = global.localStorage;
    delete (global as any).localStorage;
    
    const storage = new StorageManager();
    
    // 应该不抛出错误
    expect(() => {
      storage.saveGameResult('stroop', {
        gameId: 'stroop',
        timestamp: Date.now(),
        duration: 60000,
        score: 850
      });
    }).not.toThrow();
    
    // 恢复
    (global as any).localStorage = originalLocalStorage;
  });
});
```

### 测试组织

```
src/
├── components/
│   └── __tests__/
│       ├── Button.test.tsx
│       ├── Card.test.tsx
│       └── ProgressBar.test.tsx
├── hooks/
│   └── __tests__/
│       ├── useGameState.test.ts
│       └── useLocalStorage.test.ts
├── utils/
│   └── __tests__/
│       ├── storage.test.ts
│       ├── stroop/
│       │   ├── gameLogic.test.ts
│       │   └── gameLogic.property.test.ts
│       └── schulte/
│           ├── gameLogic.test.ts
│           └── gameLogic.property.test.ts
```

### 测试覆盖率目标

- **整体代码覆盖率**：≥ 80%
- **核心游戏逻辑**：≥ 90%
- **工具函数**：≥ 95%
- **UI 组件**：≥ 70%（重点测试交互逻辑）

### 持续集成

测试应该在以下情况自动运行：
- 每次代码提交
- Pull Request 创建时
- 合并到主分支前

CI 配置示例（GitHub Actions）：
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:coverage
```

## Implementation Notes

### 迁移策略

从现有 Stroop 应用迁移到新平台：

1. **Phase 1: 架构重组**
   - 创建新的文件结构
   - 提取共享组件
   - 建立游戏注册系统

2. **Phase 2: Stroop 游戏迁移**
   - 将现有 Stroop 代码迁移到新结构
   - 确保功能完整性
   - 添加回归测试

3. **Phase 3: Schulte 游戏实现**
   - 实现 Schulte 游戏逻辑
   - 创建 Schulte UI 组件
   - 添加属性测试

4. **Phase 4: 平台功能完善**
   - 实现主页导航
   - 添加数据持久化
   - 优化响应式设计

### 性能优化

1. **代码分割**
   ```typescript
   // 使用 React.lazy 进行路由级别的代码分割
   const StroopPage = lazy(() => import('./pages/StroopPage'));
   const SchultePage = lazy(() => import('./pages/SchultePage'));
   ```

2. **组件优化**
   ```typescript
   // 使用 React.memo 避免不必要的重渲染
   export const GameCard = React.memo<GameCardProps>(({ game }) => {
     // ...
   });
   
   // 使用 useMemo 缓存计算结果
   const statistics = useMemo(() => 
     calculateStatistics(results),
     [results]
   );
   ```

3. **状态管理优化**
   ```typescript
   // 使用 useCallback 避免函数重新创建
   const handleClick = useCallback(() => {
     // ...
   }, [dependencies]);
   ```

### 可访问性

1. **语义化 HTML**
   - 使用正确的 HTML 标签
   - 提供 ARIA 标签

2. **键盘导航**
   - 所有交互元素可通过键盘访问
   - 提供清晰的焦点指示

3. **屏幕阅读器支持**
   - 提供 alt 文本
   - 使用 aria-label 描述交互元素

4. **颜色对比度**
   - 确保文本和背景有足够的对比度
   - 不仅依赖颜色传达信息

### 未来扩展

为未来添加新游戏预留的扩展点：

1. **游戏接口**：所有游戏实现 `GameEngine` 接口
2. **游戏注册**：在 `config/games.ts` 中注册新游戏
3. **路由配置**：自动从游戏注册生成路由
4. **共享组件**：新游戏可复用所有共享 UI 组件
5. **存储系统**：自动为新游戏提供数据持久化

添加新游戏的步骤：
1. 在 `types/games/` 创建游戏类型定义
2. 在 `utils/games/` 实现游戏逻辑
3. 在 `components/games/` 创建游戏 UI 组件
4. 在 `hooks/games/` 创建游戏 Hook
5. 在 `pages/` 创建游戏页面
6. 在 `config/games.ts` 注册游戏
7. 添加测试

## Design Decisions

### 为什么选择 React Hooks 而不是状态管理库？

- 项目规模适中，不需要复杂的全局状态管理
- Hooks 提供足够的状态管理能力
- 减少依赖，降低复杂度
- 每个游戏状态相对独立

### 为什么使用 localStorage 而不是 IndexedDB？

- 数据量小（游戏历史记录）
- localStorage API 更简单
- 同步操作，无需处理异步复杂性
- 浏览器支持广泛

### 为什么选择客户端路由？

- 100% 客户端应用，无服务器
- 更好的用户体验（无页面刷新）
- 支持浏览器前进/后退
- 便于分享特定游戏链接

### 为什么使用 Tailwind CSS？

- 与现有代码库一致
- 快速开发
- 设计系统内置（颜色、间距等）
- 优秀的响应式支持
- 生产构建时自动清除未使用的样式

### 为什么选择 fast-check 进行属性测试？

- TypeScript 原生支持
- 活跃维护
- 丰富的生成器库
- 与 Vitest 集成良好
- 优秀的收缩（shrinking）算法
