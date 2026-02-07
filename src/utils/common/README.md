# Common Utilities

此目录包含平台共享的工具函数和类。

## StorageManager

`StorageManager` 类负责管理游戏结果的本地存储和检索。

### 功能特性

1. **游戏结果持久化**: 将游戏结果保存到 localStorage
2. **历史记录管理**: 检索和管理游戏历史记录
3. **最佳成绩追踪**: 自动更新和维护每个游戏的最佳成绩
4. **数据验证**: 验证从存储中读取的数据完整性
5. **降级处理**: 当 localStorage 不可用时，自动降级到内存存储

### 使用方法

```typescript
import { storageManager } from './utils/common/storage';
import type { BaseGameResult } from './types/common';

// 保存游戏结果
const result: BaseGameResult = {
  gameId: 'stroop',
  timestamp: Date.now(),
  duration: 60000,
  score: 850,
};
storageManager.saveGameResult('stroop', result);

// 获取游戏历史记录
const history = storageManager.getGameHistory('stroop');
console.log('Total plays:', history.totalPlays);
console.log('Best score:', history.bestScore);

// 获取所有游戏的历史记录
const allHistories = storageManager.getAllGameHistories();

// 清除游戏历史记录
storageManager.clearGameHistory('stroop');
```

### API 文档

#### `saveGameResult(gameId: string, result: BaseGameResult): void`

保存游戏结果到存储。自动更新总游戏次数、最后游戏时间和最佳成绩。

**参数:**
- `gameId`: 游戏标识符（如 'stroop', 'schulte'）
- `result`: 游戏结果对象，必须包含 gameId, timestamp, duration, score

#### `getGameHistory(gameId: string): GameHistory`

获取指定游戏的历史记录。如果没有历史记录，返回空的历史对象。

**参数:**
- `gameId`: 游戏标识符

**返回:**
- `GameHistory` 对象，包含 results, bestScore, totalPlays, lastPlayed

#### `clearGameHistory(gameId: string): void`

清除指定游戏的所有历史记录。

**参数:**
- `gameId`: 游戏标识符

#### `getAllGameHistories(): GameHistory[]`

获取所有游戏的历史记录。

**返回:**
- `GameHistory[]` 数组，包含所有游戏的历史记录

### 错误处理

StorageManager 实现了完善的错误处理机制：

1. **localStorage 不可用**: 自动降级到内存存储，不会抛出错误
2. **数据解析失败**: 返回空的历史记录对象，记录错误到控制台
3. **存储空间已满**: 尝试降级到内存存储
4. **数据验证失败**: 返回空的历史记录对象，记录警告

### 存储格式

数据以 JSON 格式存储在 localStorage 中，键名格式为：

```
brain_training_{gameId}_history
```

示例：
```
brain_training_stroop_history
brain_training_schulte_history
```

### 数据结构

```typescript
interface GameHistory {
  gameId: string;           // 游戏标识符
  results: BaseGameResult[]; // 所有游戏结果
  bestScore: number;         // 最佳成绩
  totalPlays: number;        // 总游戏次数
  lastPlayed: number;        // 最后游戏时间（时间戳）
}
```

### 测试

参考 `storage.example.ts` 文件查看使用示例和测试场景。

### 需求映射

此实现满足以下需求：

- **Requirement 8.1**: 使用浏览器 localStorage 存储游戏数据
- **Requirement 8.2**: 游戏完成时保存结果到本地存储
- **Requirement 8.3**: 为每个游戏维护独立的历史记录
- **Requirement 8.4**: 存储每个游戏的个人最佳记录
- **Requirement 8.5**: 序列化数据为 JSON 格式
- **Requirement 8.6**: 反序列化 JSON 数据并验证数据完整性
- **Requirement 8.7**: localStorage 不可用时优雅降级到内存存储
