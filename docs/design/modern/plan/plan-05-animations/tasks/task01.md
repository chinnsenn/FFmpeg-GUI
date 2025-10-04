# Task 01: 进度条 Shimmer 动画

## 任务目标

实现高性能的进度条 shimmer 动画,使用 GPU 加速,确保 60fps 帧率。

## 参考文档

- `docs/design/modern/demo/component-progressbar.html` - Shimmer 动画效果
- `docs/design/modern/guide/animation-motion.md` - 动画性能指南

## 实施步骤

### 步骤 1: 添加 Shimmer Keyframes

```css
/* src/renderer/src/index.css */

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    currentColor 0%,
    currentColor 40%,
    rgba(255, 255, 255, 0.5) 50%,
    currentColor 60%,
    currentColor 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
  will-change: background-position;
}

/* 深色模式优化 */
.dark .animate-shimmer {
  background: linear-gradient(
    90deg,
    currentColor 0%,
    currentColor 40%,
    rgba(255, 255, 255, 0.3) 50%,
    currentColor 60%,
    currentColor 100%
  );
}

/* prefers-reduced-motion 支持 */
@media (prefers-reduced-motion: reduce) {
  .animate-shimmer {
    animation: none;
    background: currentColor;
  }
}
```

### 步骤 2: 在 ProgressBar 中应用

ProgressBar 组件已在 Plan-02 Task-04 中实现,确保 `shimmer` prop 正确应用 `animate-shimmer` 类。

### 步骤 3: 性能测试

```tsx
// 使用 Chrome DevTools Performance 面板测试
// 1. 打开 DevTools > Performance
// 2. 开始录制
// 3. 观察 shimmer 动画
// 4. 停止录制
// 5. 确认帧率 >= 60fps
```

## 验收标准

- [ ] Shimmer 效果流畅（60fps）
- [ ] 2s 循环周期准确
- [ ] 使用 GPU 加速（background-position）
- [ ] 深色模式下光泽效果正确
- [ ] prefers-reduced-motion 时禁用

## 预计时间

2-3 小时

---

**优先级**: P0
**依赖**: Plan-02 Task-04 完成
