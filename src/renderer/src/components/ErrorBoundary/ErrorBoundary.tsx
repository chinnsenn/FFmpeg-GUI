import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@renderer/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * React 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，记录错误并显示降级 UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<State> {
    // Update state to show fallback UI on next render
    return { hasError: true };
  }

  /**
   * Categorize error by type for better handling
   * @param error - The caught error
   * @returns Error severity level
   */
  private categorizeError(error: Error): 'critical' | 'warning' | 'info' {
    const message = error.message.toLowerCase();

    // Network and loading errors are usually recoverable
    if (message.includes('chunkloaderror') || message.includes('chunk')) {
      return 'warning';
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'warning';
    }

    // Everything else is critical
    return 'critical';
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Categorize error type
    const errorType = this.categorizeError(error);

    // Log with comprehensive context
    logger.error('ErrorBoundary', 'React Error Boundary caught an error', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
        type: errorType,
      },
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    });

    // Update state
    this.setState({
      error,
      errorInfo,
    });

    // Send to error tracking based on severity (future implementation)
    // if (errorType === 'critical') {
    //   this.reportToService(error, errorInfo);
    // }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {/* 错误图标 */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* 错误标题 */}
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
              哎呀！出现了一个错误
            </h1>

            {/* 错误描述 */}
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              应用程序遇到了一个意外错误。请尝试以下操作：
            </p>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button onClick={this.handleReset} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                重试
              </Button>
              <Button onClick={this.handleReload} variant="secondary" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                重新加载页面
              </Button>
              <Button onClick={this.handleGoHome} variant="secondary" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                返回首页
              </Button>
            </div>

            {/* 错误详情（可折叠） */}
            {this.state.error && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                  查看错误详情
                </summary>
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      错误消息：
                    </h3>
                    <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                    </pre>
                  </div>

                  {this.state.error.stack && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        堆栈跟踪：
                      </h3>
                      <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words overflow-auto max-h-64">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}

                  {this.state.errorInfo && (
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        组件堆栈：
                      </h3>
                      <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words overflow-auto max-h-64">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* 帮助文本 */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>如果问题持续存在，请尝试重新启动应用程序。</p>
              <p className="mt-1">
                需要帮助？请查看应用程序文档或联系技术支持。
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
