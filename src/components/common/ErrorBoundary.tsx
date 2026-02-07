import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorHandler } from '../../utils/common/errorHandler';
import { Button } from './Button';
import { Card } from './Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary 组件
 * 
 * 捕获子组件树中的 JavaScript 错误，记录错误并显示降级 UI
 * 
 * 用法：
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 * 
 * 或提供自定义降级 UI：
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    ErrorHandler.handleGlobalError(error);
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 更新 state 以包含错误信息
    this.setState({
      error,
      errorInfo,
    });

    // 这里可以将错误发送到错误追踪服务
    // 例如：logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定义降级 UI，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <div className="text-center">
              {/* 错误图标 */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>

              {/* 错误标题 */}
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                出错了
              </h2>

              {/* 错误描述 */}
              <p className="text-slate-600 mb-6">
                抱歉，应用遇到了一个错误。您可以尝试重新加载页面或返回上一步。
              </p>

              {/* 错误详情（仅在开发环境显示） */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700 mb-2">
                    错误详情（开发模式）
                  </summary>
                  <div className="bg-slate-100 rounded-lg p-4 text-xs font-mono text-slate-800 overflow-auto max-h-64">
                    <div className="mb-2">
                      <strong>错误消息：</strong>
                      <div className="text-red-600">{this.state.error.message}</div>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>堆栈跟踪：</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo && (
                      <div className="mt-2">
                        <strong>组件堆栈：</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  size="md"
                  onClick={this.handleReload}
                >
                  重新加载页面
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={this.handleReset}
                >
                  尝试恢复
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
