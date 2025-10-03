# Task 04: 实现 GlassBackground 背景组件

## 任务信息

- **任务ID**: PHASE1-TASK04
- **优先级**: P0
- **预计工时**: 1.5 小时
- **依赖任务**: Task 02, Task 03
- **责任人**: 前端开发

## 任务目标

创建一个动态背景组件,显示设计文档中定义的深蓝色渐变背景,作为整个应用的基础层。

## 详细说明

### 背景
Glassmorphism 效果需要一个有内容的背景才能体现模糊效果。设计文档定义了一个动态渐变背景,从深蓝色 (#0f172a) 过渡到中蓝色 (#334155)。

### 操作步骤

#### 1. 创建组件文件

`src/renderer/src/components/Background/GlassBackground.tsx`:

```typescript
import { memo } from 'react';
import './glass-background.css';

export const GlassBackground = memo(() => {
  return (
    <div className="glass-background">
      <div className="glass-background-gradient" />
      <div className="glass-background-noise" />
    </div>
  );
});

GlassBackground.displayName = 'GlassBackground';
```

#### 2. 创建样式文件

`src/renderer/src/components/Background/glass-background.css`:

```css
.glass-background {
  position: fixed;
  inset: 0;
  z-index: var(--z-base);
  overflow: hidden;
}

.glass-background-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--bg-gradient-start) 0%,
    var(--bg-gradient-mid-1) 25%,
    var(--bg-gradient-mid-2) 50%,
    var(--bg-gradient-mid-1) 75%,
    var(--bg-gradient-end) 100%
  );
  background-size: 400% 400%;
  animation: gradient-shift 30s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.glass-background-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
}
```

#### 3. 在 Layout 中使用

修改 `src/renderer/src/components/Layout/Layout.tsx`:

```typescript
import { GlassBackground } from '@renderer/components/Background/GlassBackground';

export function Layout() {
  return (
    <>
      <GlassBackground />
      <div className="relative flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
```

#### 4. 验证效果

```bash
npm run dev
```

检查：
- 背景渐变动画流畅
- 噪点纹理正确显示
- 不影响前景内容交互

## 验收标准

- [x] GlassBackground 组件创建完成
- [x] 背景渐变动画正常播放（30秒循环）
- [x] 噪点纹理正确叠加
- [x] 组件在 Layout 中正确使用
- [x] 不影响页面性能（60fps）
- [x] 背景固定，不随滚动移动

## 参考资料

- [设计文档 - Color System](../../color-system.md)
- [CSS animation MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
