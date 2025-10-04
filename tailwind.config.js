/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'], // 深色模式使用 class 策略
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ============ 颜色扩展 ============
      colors: {
        // 背景色
        'background-primary': 'hsl(var(--background-primary) / <alpha-value>)',
        'background-secondary': 'hsl(var(--background-secondary) / <alpha-value>)',
        'background-tertiary': 'hsl(var(--background-tertiary) / <alpha-value>)',
        'background-elevated': 'hsl(var(--background-elevated) / <alpha-value>)',

        // 表面色
        'surface-base': 'hsl(var(--surface-base) / <alpha-value>)',
        'surface-raised': 'hsl(var(--surface-raised) / <alpha-value>)',

        // 文本色
        'text-primary': 'hsl(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'hsl(var(--text-secondary) / <alpha-value>)',
        'text-tertiary': 'hsl(var(--text-tertiary) / <alpha-value>)',
        'text-disabled': 'hsl(var(--text-disabled) / <alpha-value>)',

        // 主色
        primary: {
          50: 'hsl(var(--primary-50) / <alpha-value>)',
          100: 'hsl(var(--primary-100) / <alpha-value>)',
          500: 'hsl(var(--primary-500) / <alpha-value>)',
          600: 'hsl(var(--primary-600) / <alpha-value>)',
          700: 'hsl(var(--primary-700) / <alpha-value>)',
        },

        // 成功色
        success: {
          50: 'hsl(var(--success-50) / <alpha-value>)',
          500: 'hsl(var(--success-500) / <alpha-value>)',
          600: 'hsl(var(--success-600) / <alpha-value>)',
        },

        // 警告色
        warning: {
          50: 'hsl(var(--warning-50) / <alpha-value>)',
          500: 'hsl(var(--warning-500) / <alpha-value>)',
          600: 'hsl(var(--warning-600) / <alpha-value>)',
        },

        // 错误色
        error: {
          50: 'hsl(var(--error-50) / <alpha-value>)',
          500: 'hsl(var(--error-500) / <alpha-value>)',
          600: 'hsl(var(--error-600) / <alpha-value>)',
        },

        // 边框色
        'border-light': 'hsl(var(--border-light) / <alpha-value>)',
        'border-medium': 'hsl(var(--border-medium) / <alpha-value>)',
        'border-dark': 'hsl(var(--border-dark) / <alpha-value>)',
      },

      // ============ 字体扩展 ============
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"SF Mono"',
          'Monaco',
          '"Cascadia Code"',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },

      // ============ 字体大小扩展 ============
      fontSize: {
        display: ['40px', { lineHeight: '48px', letterSpacing: '-0.02em' }],
        h1: ['32px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
        h2: ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        h3: ['18px', { lineHeight: '28px', letterSpacing: '0' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        body: ['14px', { lineHeight: '20px', letterSpacing: '0' }],
        'body-sm': ['13px', { lineHeight: '18px', letterSpacing: '0' }],
        caption: ['12px', { lineHeight: '16px', letterSpacing: '0' }],
        micro: ['11px', { lineHeight: '14px', letterSpacing: '0.01em' }],
      },

      // ============ 间距扩展（4px 基础单位） ============
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
      },

      // ============ 圆角扩展 ============
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },

      // ============ 阴影扩展 ============
      boxShadow: {
        // 浅色主题阴影
        sm: '0 1px 3px 0 hsla(220, 15%, 20%, 0.04), 0 1px 2px 0 hsla(220, 15%, 20%, 0.02)',
        DEFAULT:
          '0 4px 6px -1px hsla(220, 15%, 20%, 0.06), 0 2px 4px -1px hsla(220, 15%, 20%, 0.04)',
        md: '0 4px 6px -1px hsla(220, 15%, 20%, 0.06), 0 2px 4px -1px hsla(220, 15%, 20%, 0.04)',
        lg: '0 10px 15px -3px hsla(220, 15%, 20%, 0.08), 0 4px 6px -2px hsla(220, 15%, 20%, 0.04)',
        xl: '0 20px 25px -5px hsla(220, 15%, 20%, 0.10), 0 10px 10px -5px hsla(220, 15%, 20%, 0.04)',

        // 深色主题阴影（在组件中通过 dark: 前缀使用）
        'sm-dark': '0 1px 3px 0 hsla(0, 0%, 0%, 0.3), 0 1px 2px 0 hsla(0, 0%, 0%, 0.2)',
        'md-dark': '0 4px 6px -1px hsla(0, 0%, 0%, 0.4), 0 2px 4px -1px hsla(0, 0%, 0%, 0.3)',
        'lg-dark': '0 10px 15px -3px hsla(0, 0%, 0%, 0.5), 0 4px 6px -2px hsla(0, 0%, 0%, 0.4)',
        'xl-dark': '0 20px 25px -5px hsla(0, 0%, 0%, 0.6), 0 10px 10px -5px hsla(0, 0%, 0%, 0.5)',
      },

      // ============ 动画时间扩展 ============
      transitionDuration: {
        instant: '100ms',
        fast: '150ms',
        DEFAULT: '200ms',
        normal: '200ms',
        medium: '300ms',
        slow: '400ms',
        slower: '600ms',
      },

      // ============ 缓动函数扩展 ============
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'fast-out': 'cubic-bezier(0.4, 0, 0.6, 1)',
        precise: 'cubic-bezier(0.2, 0, 0, 1)',
      },

      // ============ 关键帧动画 ============
      keyframes: {
        // Shimmer 动画（进度条光晕）
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },

        // Indeterminate 动画（不确定进度条）
        indeterminate: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },

        // Fade In（淡入）
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        // Fade Out（淡出）
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },

        // Scale In（缩放进入，用于完成状态）
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },

        // Slide In（从下方滑入）
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },

        // Slide In from Right（从右侧滑入，Toast 通知）
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },

        // Slide Out to Right（向右侧滑出）
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },

        // Shake（抖动，用于错误状态）
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },

        // Pulse（脉冲，用于运行中状态）
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },

        // Spin（旋转，加载动画）
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },

        // Bounce（弹跳）
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' },
        },
      },

      // ============ 动画配置 ============
      animation: {
        // Shimmer 动画（2秒，无限循环）
        shimmer: 'shimmer 2s infinite',

        // Indeterminate 动画（1.5秒，无限循环）
        indeterminate: 'indeterminate 1.5s ease-in-out infinite',

        // Fade In（300ms，ease-out）
        'fade-in': 'fade-in 300ms ease-out',
        'fade-in-fast': 'fade-in 150ms ease-out',
        'fade-in-slow': 'fade-in 400ms ease-out',

        // Fade Out（200ms）
        'fade-out': 'fade-out 200ms ease-in',
        'fade-out-fast': 'fade-out 150ms ease-in',

        // Scale In（200ms，bounce）
        'scale-in': 'scale-in 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',

        // Slide In（300ms，ease-out）
        'slide-in': 'slide-in 300ms ease-out',
        'slide-in-fast': 'slide-in 200ms ease-out',

        // Slide In from Right（Toast）
        'slide-in-right': 'slide-in-right 300ms ease-out',

        // Slide Out to Right
        'slide-out-right': 'slide-out-right 200ms ease-in',

        // Shake（400ms，错误状态）
        shake: 'shake 400ms ease-in-out',

        // Pulse（2秒，无限循环）
        pulse: 'pulse 2s ease-in-out infinite',
        'pulse-fast': 'pulse 1s ease-in-out infinite',

        // Spin（1秒，无限循环）
        spin: 'spin 1s linear infinite',
        'spin-fast': 'spin 500ms linear infinite',
        'spin-slow': 'spin 2s linear infinite',

        // Bounce
        bounce: 'bounce 1s ease-in-out infinite',
      },

      // ============ 缩放扩展 ============
      scale: {
        98: '0.98', // 按下状态
        102: '1.02', // 悬停状态
      },
    },
  },
  plugins: [
    // tailwindcss-animate 插件提供额外的动画工具
    require('tailwindcss-animate'),
  ],
};
