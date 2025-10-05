import { useState, useEffect } from 'react';

/**
 * 检测用户是否启用了"减少动画"辅助功能
 *
 * @returns boolean - true 表示用户偏好减少动画
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * return (
 *   <motion.div
 *     animate={{ opacity: 1 }}
 *     transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
 *   />
 * );
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // 创建媒体查询
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // 设置初始值
    setPrefersReducedMotion(mediaQuery.matches);

    // 监听变化
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // 兼容新旧API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    // 清理函数
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}
