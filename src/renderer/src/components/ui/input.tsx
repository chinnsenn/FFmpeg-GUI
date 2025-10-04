import * as React from 'react';
import { cn } from '@renderer/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, type, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              // 基础样式
              'w-full h-10 px-3 rounded-lg border bg-background-primary text-text-primary text-sm',
              'transition-all duration-200',
              'placeholder:text-text-tertiary placeholder:italic',
              // 焦点状态
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-transparent',
              // 错误状态
              error
                ? 'border-error-500 focus:ring-error-500'
                : 'border-border-medium hover:border-border-dark',
              // 禁用状态
              'disabled:bg-background-secondary disabled:text-text-disabled disabled:cursor-not-allowed disabled:opacity-60',
              // 图标内边距
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-error-600 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="flex-shrink-0">
              <circle cx="6" cy="6" r="5" stroke="currentColor" fill="none" strokeWidth="1.5"/>
              <path d="M6 3v3.5M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
