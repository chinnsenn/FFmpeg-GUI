# Plan-05: Animations（动画与交互）

## 阶段概述

完善应用中的所有动画效果,确保流畅的用户体验和视觉反馈,同时支持 prefers-reduced-motion 无障碍需求。

## 目标

1. 完善进度条 shimmer 动画（GPU 加速）
2. 完善任务状态动画（scale-in、shake、pulse）
3. 完善拖放交互动画（hover、drop 状态）
4. 实现主题切换动画（smooth transition）
5. 实现页面过渡动画（fade、slide）
6. 实现 prefers-reduced-motion 支持

## 参考文档

- `docs/design/modern/demo/*.html` - 所有 Demo 中的动画效果
- `docs/design/modern/guide/animation-motion.md` - 动画规范
- `docs/design/modern/guide/interaction-patterns.md` - 交互模式

## 任务清单

| 任务 | 描述 | 预计时间 | 优先级 |
|------|------|----------|--------|
| Task 01 | 进度条 shimmer 动画 | 2-3 小时 | P0 |
| Task 02 | 任务状态动画（scale-in/shake/pulse） | 2-3 小时 | P0 |
| Task 03 | 拖放交互动画 | 2-3 小时 | P1 |
| Task 04 | 主题切换动画 | 2-3 小时 | P1 |
| Task 05 | 页面过渡动画 | 2-3 小时 | P1 |
| Task 06 | prefers-reduced-motion 支持 | 1-2 小时 | P0 |

**总计预估时间**：11-17 小时（1.5-2 个工作日）

## 验收标准

### 1. 进度条 Shimmer 动画

- [ ] Shimmer 效果流畅（60fps）
- [ ] 2s 循环周期
- [ ] 使用 GPU 加速（transform、opacity）
- [ ] 光泽从左到右移动
- [ ] 在 Running 状态的 TaskCard 中正确应用

### 2. 任务状态动画

#### Scale-in（完成状态）
- [ ] 从 scale(0.95) 到 scale(1)
- [ ] 200ms 持续时间
- [ ] ease-out 缓动函数
- [ ] opacity 0 到 1

#### Shake（失败状态）
- [ ] 左右晃动效果
- [ ] 400ms 持续时间
- [ ] 晃动 3 次
- [ ] 使用 translateX

#### Pulse（暂停状态）
- [ ] 边框脉冲效果
- [ ] 2s 循环周期
- [ ] opacity 0.5 到 1
- [ ] 无限循环

### 3. 拖放交互动画

- [ ] hover 状态：边框颜色过渡（200ms）
- [ ] 拖放中状态：背景颜色过渡（200ms）+ scale(1.02)
- [ ] 释放动画：scale 回弹（150ms）
- [ ] 文件添加到列表时：fade-in + slide-down（300ms）

### 4. 主题切换动画

- [ ] 所有颜色平滑过渡（300ms）
- [ ] 使用 CSS transition-property: background-color, color, border-color
- [ ] 避免闪烁
- [ ] 保存主题偏好

### 5. 页面过渡动画

- [ ] 页面切换：fade-out + fade-in（200ms）
- [ ] 或 slide-left/right（适用于前进/后退导航）
- [ ] 使用 React Router transition
- [ ] 或使用 Framer Motion AnimatePresence

### 6. prefers-reduced-motion 支持

- [ ] 检测系统设置
- [ ] 禁用所有装饰性动画
- [ ] 保留必要的状态变化（如 fade）
- [ ] 减少 duration 到 100ms 或 instant

## 测试步骤

### 1. 动画性能测试

使用 Chrome DevTools Performance 面板:

```bash
1. 打开 DevTools > Performance
2. 开始录制
3. 触发动画（如进度条、状态切换）
4. 停止录制
5. 检查帧率 >= 60fps
6. 检查无 long tasks (>50ms)
```

### 2. prefers-reduced-motion 测试

```tsx
// 模拟系统设置
describe('Animations with reduced motion', () => {
  beforeEach(() => {
    // 模拟 prefers-reduced-motion: reduce
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it('should disable shimmer animation', () => {
    render(<ProgressBar value={50} shimmer />);
    const fill = screen.getByRole('progressbar').querySelector('.progress-fill');

    // 检查 animation 是否禁用
    expect(fill).not.toHaveClass('animate-shimmer');
  });
});
```

### 3. 视觉测试

对比 HTML Demo 和实际应用,确保动画效果一致。

## 输出产物

### 1. 动画 CSS

```css
/* src/renderer/src/index.css */

/* ============ Keyframes ============ */
@keyframes shimmer { /* ... */ }
@keyframes indeterminate { /* ... */ }
@keyframes scale-in { /* ... */ }
@keyframes shake { /* ... */ }
@keyframes pulse-border { /* ... */ }
@keyframes fade-in { /* ... */ }
@keyframes slide-in { /* ... */ }

/* ============ Animation Classes ============ */
.animate-shimmer { /* ... */ }
.animate-indeterminate { /* ... */ }
.animate-scale-in { /* ... */ }
.animate-shake { /* ... */ }
.animate-pulse-border { /* ... */ }

/* ============ Transitions ============ */
.transition-colors { /* ... */ }
.transition-transform { /* ... */ }
.transition-all { /* ... */ }

/* ============ Reduced Motion ============ */
@media (prefers-reduced-motion: reduce) {
  /* 禁用或简化动画 */
}
```

### 2. 动画 Hook

```tsx
// src/renderer/src/hooks/useReducedMotion.ts
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
```

### 3. 动画组件

```tsx
// src/renderer/src/components/animations/FadeIn.tsx
export function FadeIn({ children, delay = 0 }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : 0.3,
        delay: prefersReducedMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
```

## 依赖安装

```bash
# 动画库（可选）
npm install framer-motion

# 如果使用 CSS-in-JS
npm install @emotion/react @emotion/styled
```

## 注意事项

### 1. GPU 加速

只对 `transform` 和 `opacity` 使用动画:

```css
/* ✅ GPU 加速 */
.animate-shimmer {
  transform: translateX(0);
  opacity: 1;
  will-change: transform, opacity;
}

/* ❌ 触发重排 */
.bad-animation {
  width: 100px;
  left: 0;
}
```

### 2. will-change 使用

谨慎使用 `will-change`,仅在动画开始前设置:

```tsx
const [isAnimating, setIsAnimating] = useState(false);

return (
  <div
    style={{ willChange: isAnimating ? 'transform, opacity' : 'auto' }}
    onAnimationStart={() => setIsAnimating(true)}
    onAnimationEnd={() => setIsAnimating(false)}
  >
    {children}
  </div>
);
```

### 3. 动画时长指南

- **Instant**: 100ms - 用户触发的即时反馈（hover、focus）
- **Fast**: 150ms - 小元素的进入/退出
- **Normal**: 200ms - 标准过渡
- **Medium**: 300ms - 复杂元素、页面切换
- **Slow**: 400ms - 大型元素、特殊效果

## 下一步

完成 Plan-05 后,进入 **Plan-06: Testing**（测试与优化）,进行全面测试和性能优化。

---

**创建时间**：2025-10-04
**预计完成时间**：2025-10-13
**依赖**：Plan-02、Plan-03、Plan-04 完成
**负责人**：fullstack-engineer
