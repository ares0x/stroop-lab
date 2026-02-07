/**
 * 全局错误处理工具
 *
 * 满足需求 13.1、13.2：用户友好错误提示、控制台记录。
 * 设计文档 Error Handling 节定义的 ErrorHandler 类实现。
 */

/** 可选的重试回调 */
export type RetryCallback = () => void;

/**
 * 错误处理类
 *
 * - handleValidationError: 用户输入/配置验证错误
 * - handleStorageError: 存储错误（localStorage 等）
 * - handleStateError: 非法状态转换
 * - handleLoadError: 加载失败（懒加载、数据）
 * - handleGlobalError: 未分类全局错误
 */
export class ErrorHandler {
  /**
   * 处理用户输入/配置验证错误
   * 用于字段级错误消息，便于在 UI 上展示
   */
  static handleValidationError(field: string, message: string): void {
    if (import.meta.env.DEV) {
      console.warn(`[Validation] ${field}: ${message}`);
    }
  }

  /**
   * 处理存储错误
   * 调用方应配合降级（如内存存储）并可选显示用户通知
   */
  static handleStorageError(error: Error): void {
    console.error('[Storage]', error.message, error);
  }

  /**
   * 处理状态错误（非法状态转换）
   * 用于忽略非法转换并记录警告
   */
  static handleStateError(
    currentState: string,
    attemptedTransition: string
  ): void {
    if (import.meta.env.DEV) {
      console.warn(
        `[State] Invalid transition: ${currentState} -> ${attemptedTransition}`
      );
    }
  }

  /**
   * 处理加载错误（懒加载组件、数据加载失败等）
   * retry 由调用方在用户点击重试时调用，此处仅记录错误
   */
  static handleLoadError(_error: Error, _retry?: RetryCallback): void {
    console.error('[Load]', _error.message, _error);
  }

  /**
   * 全局未捕获错误处理
   * 可在此接入错误追踪服务（如 Sentry）
   */
  static handleGlobalError(error: Error): void {
    console.error('[Global]', error.message, error);
  }
}
