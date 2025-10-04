import * as React from 'react';
import { cn } from '@renderer/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 进度值 0-100
  max?: number; // 最大值（默认 100）
  animated?: boolean; // 是否显示 Shimmer 动画
  indeterminate?: boolean; // 不确定进度模式
  showValue?: boolean; // 是否显示百分比文字
  size?: 'sm' | 'md' | 'lg'; // 尺寸
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      animated = false,
      indeterminate = false,
      showValue = false,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));

    // 尺寸映射
    const sizeClasses = {
      sm: 'h-1', // 4px
      md: 'h-2', // 8px
      lg: 'h-3', // 12px
    };

    // Indeterminate 模式
    if (indeterminate) {
      return (
        <div className="space-y-2">
          <div
            ref={ref}
            className={cn(
              'relative w-full overflow-hidden rounded-full bg-border-light dark:bg-gray-700',
              sizeClasses[size],
              className
            )}
            role="progressbar"
            aria-label="Loading..."
            {...props}
          >
            <div className="absolute inset-0 animate-indeterminate bg-gradient-to-r from-transparent via-primary-500 to-transparent bg-[length:200%_100%]" />
          </div>
          {showValue && (
            <p className="text-center text-xs text-text-secondary">Loading...</p>
          )}
        </div>
      );
    }

    // 正常进度条
    return (
      <div className="space-y-2">
        <div
          ref={ref}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-border-light dark:bg-gray-700',
            sizeClasses[size],
            className
          )}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          {...props}
        >
          <div
            className={cn(
              'h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out',
              animated && 'relative overflow-hidden'
            )}
            style={{ width: `${percent}%` }}
          >
            {animated && (
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}
          </div>
        </div>
        {showValue && (
          <p className="text-center text-xs text-text-secondary">
            {percent.toFixed(0)}%
          </p>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
