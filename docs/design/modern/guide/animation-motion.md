# FFmpeg GUI 动画和动效指南

本文档定义了 FFmpeg GUI 应用中所有动画和动效的详细规范，包括时间函数、持续时间、缓动曲线和实现方法。

---

## 目录

1. [动画原则](#1-动画原则)
2. [时间和缓动](#2-时间和缓动)
3. [页面过渡](#3-页面过渡)
4. [组件动画](#4-组件动画)
5. [微交互](#5-微交互)
6. [加载动画](#6-加载动画)
7. [状态转换](#7-状态转换)
8. [手势动画](#8-手势动画)
9. [性能优化](#9-性能优化)
10. [减少动效模式](#10-减少动效模式)

---

## 1. 动画原则

### 1.1 核心原则

#### 有目的性（Purposeful）
- 每个动画都必须服务于特定目的：提供反馈、引导注意力、表达关系
- 避免装饰性动画，不干扰用户工作流程

#### 响应性（Responsive）
- 交互反馈必须立即（< 100ms）
- 让用户感觉应用在"倾听"他们的操作

#### 自然性（Natural）
- 模拟真实世界的物理运动
- 使用缓动函数创造自然的加速和减速

#### 一致性（Consistent）
- 相同类型的交互使用相同的动画参数
- 建立可预测的动画语言

### 1.2 动画分类

**快速交互（< 200ms）：**
- 按钮点击反馈
- 输入框聚焦
- 悬停效果

**标准过渡（200-300ms）：**
- 面板展开/折叠
- 列表项添加/移除
- 状态变化

**慢速动画（300-600ms）：**
- 页面路由切换
- 模态框进入/退出
- 庆祝动画

---

## 2. 时间和缓动

### 2.1 持续时间标准

```css
/* 时间常量 */
--duration-instant: 100ms      /* 即时反馈 */
--duration-fast: 150ms         /* 快速交互 */
--duration-normal: 200ms       /* 标准过渡 */
--duration-medium: 300ms       /* 中等动画 */
--duration-slow: 400ms         /* 慢速动画 */
--duration-slower: 600ms       /* 更慢动画 */
```

**使用场景：**

| 持续时间 | 使用场景 | 示例 |
|---------|---------|------|
| 100ms | 即时反馈 | 按钮按压、焦点环出现 |
| 150ms | 快速交互 | 悬停颜色变化、图标旋转 |
| 200ms | 标准过渡 | 折叠面板、下拉菜单 |
| 300ms | 中等动画 | 进度条更新、列表项添加 |
| 400ms | 慢速动画 | 模态框进入、Toast 出现 |
| 600ms | 更慢动画 | 页面切换、庆祝动画 |

### 2.2 缓动函数（Easing Functions）

#### 标准缓动

```css
/* Tailwind 内置 */
--ease-linear: linear                           /* 线性，用于进度条 */
--ease-in: cubic-bezier(0.4, 0, 1, 1)          /* 加速进入 */
--ease-out: cubic-bezier(0, 0, 0.2, 1)         /* 减速退出（最常用） */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)    /* 平滑进出 */
```

#### 自定义缓动

```css
/* 弹性效果 */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* 平滑过渡 */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)

/* 快速进入 */
--ease-fast-out: cubic-bezier(0.4, 0, 0.6, 1)

/* 精确进入（模态框） */
--ease-precise: cubic-bezier(0.2, 0, 0, 1)
```

**使用指南：**

- **ease-out（最常用）：**用于大多数 UI 交互，元素快速响应后平滑停止
- **ease-in-out：**用于需要平衡感的动画（页面过渡、模态框）
- **ease-in：**较少使用，主要用于元素退出
- **linear：**仅用于进度条、旋转加载器等匀速动画
- **ease-bounce：**用于庆祝动画、成功反馈

### 2.3 Tailwind 配置

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        instant: '100ms',
        fast: '150ms',
        normal: '200ms',
        medium: '300ms',
        slow: '400ms',
        slower: '600ms'
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'fast-out': 'cubic-bezier(0.4, 0, 0.6, 1)',
        precise: 'cubic-bezier(0.2, 0, 0, 1)'
      }
    }
  }
}
```

---

## 3. 页面过渡

### 3.1 路由切换动画

**方案：淡入淡出（Fade）**

**原因：**
- Electron 应用内存储本地状态，快速切换
- 淡入淡出简洁优雅，不引起视觉疲劳
- 避免复杂的滑动动画（可能卡顿）

**实现：**

```tsx
// src/renderer/src/router/index.tsx
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] // ease-out
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.6, 1] // fast-out
    }
  }
};

// 页面包装器组件
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}

// 在每个页面组件中使用
export function Convert() {
  return (
    <PageWrapper>
      {/* 页面内容 */}
    </PageWrapper>
  );
}
```

**时间参数：**
- **进入：**300ms，ease-out，轻微向上移动（y: 10 → 0）
- **退出：**200ms，fast-out，轻微向下移动（y: 0 → -10）

### 3.2 首次加载动画

**应用启动动画：**

```tsx
// Splash Screen
function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex items-center justify-center bg-background-primary"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
      >
        <Logo className="w-24 h-24" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-4 text-lg font-medium text-text-primary"
        >
          FFmpeg GUI
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
```

**参数：**
- Logo 缩放：0.8 → 1，400ms，bounce easing
- 文字淡入：延迟 300ms，300ms，ease-out

---

## 4. 组件动画

### 4.1 折叠面板（Collapsible）

**展开动画：**

```tsx
import * as Collapsible from '@radix-ui/react-collapsible';
import { motion, AnimatePresence } from 'framer-motion';

function CollapsiblePanel() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
        高级设置
      </Collapsible.Trigger>

      <AnimatePresence>
        {open && (
          <Collapsible.Content forceMount asChild>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              {/* 内容 */}
            </motion.div>
          </Collapsible.Content>
        )}
      </AnimatePresence>
    </Collapsible.Root>
  );
}
```

**参数：**
- 箭头旋转：200ms，ease-out
- 内容展开：高度 0 → auto + 透明度 0 → 1，300ms，ease-out

### 4.2 模态框（Modal）

**进入动画：**

```tsx
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.2, 0, 0, 1] // precise easing
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.6, 1]
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

function Modal({ children, isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* 模态框内容 */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**参数：**
- 遮罩淡入：200ms，linear
- 内容：缩放 0.95 → 1 + 位移 y:10 → 0 + 透明度，200ms，precise easing

### 4.3 Toast 通知

**进入动画（从右侧滑入）：**

```tsx
const toastVariants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.6, 1]
    }
  }
};
```

**使用 Sonner（已集成）：**

```tsx
// Sonner 已内置动画，无需自定义
import { toast } from 'sonner';

toast.success('任务完成', {
  description: '视频转换已成功完成',
  duration: 4000
});
```

### 4.4 列表项动画

**添加动画（Stagger）：**

```tsx
const listItemVariants = {
  hidden: {
    opacity: 0,
    x: 20,
    scale: 0.95
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.05, // stagger delay
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  })
};

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-4">
      {tasks.map((task, i) => (
        <motion.div
          key={task.id}
          custom={i}
          variants={listItemVariants}
          initial="hidden"
          animate="visible"
        >
          <TaskCard task={task} />
        </motion.div>
      ))}
    </div>
  );
}
```

**移除动画：**

```tsx
const removeVariants = {
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: {
      opacity: { duration: 0.2 },
      height: { duration: 0.3, delay: 0.1 },
      marginBottom: { duration: 0.3, delay: 0.1 }
    }
  }
};

<motion.div
  variants={removeVariants}
  exit="exit"
  style={{ overflow: 'hidden' }}
>
  <TaskCard task={task} />
</motion.div>
```

---

## 5. 微交互

### 5.1 按钮按压

**实现方式：Tailwind + active 伪类**

```tsx
<button className="transition-transform duration-100 active:scale-98">
  点击我
</button>
```

**CSS 版本：**

```css
.button {
  transition: transform 100ms ease-out;
}

.button:active {
  transform: scale(0.98);
}
```

### 5.2 悬停提升（Hover Lift）

**卡片悬停：**

```tsx
<div className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
  {/* 卡片内容 */}
</div>
```

**参数：**
- 向上移动：translateY(-4px)
- 阴影：Level 1 → Level 2
- 持续时间：200ms，ease-out

### 5.3 图标旋转

**刷新按钮：**

```tsx
const [isRotating, setIsRotating] = useState(false);

const handleRefresh = () => {
  setIsRotating(true);
  // 执行刷新逻辑
  setTimeout(() => setIsRotating(false), 500);
};

<motion.button
  onClick={handleRefresh}
  animate={{ rotate: isRotating ? 360 : 0 }}
  transition={{ duration: 0.5, ease: 'linear' }}
>
  <RefreshCw className="w-4 h-4" />
</motion.button>
```

**展开箭头：**

```tsx
<motion.div
  animate={{ rotate: isOpen ? 180 : 0 }}
  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
>
  <ChevronDown className="w-4 h-4" />
</motion.div>
```

### 5.4 复选框勾选

**缩放弹入：**

```tsx
const checkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

<motion.div variants={checkVariants} initial="hidden" animate="visible">
  <Check className="w-3 h-3 text-white" />
</motion.div>
```

---

## 6. 加载动画

### 6.1 旋转加载器（Spinner）

**实现：**

```tsx
// 使用 Lucide 的 Loader2 图标 + Tailwind 动画
<Loader2 className="w-6 h-6 animate-spin text-primary-600" />
```

**Tailwind 配置：**

```css
/* 内置动画，无需配置 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### 6.2 进度条光晕（Shimmer）

**实现：**

```tsx
<div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
  <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full">
    {/* 光晕效果 */}
    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
</div>
```

**Tailwind 配置：**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite'
      }
    }
  }
}
```

### 6.3 骨架屏脉冲

**实现：**

```tsx
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary",
        "bg-[length:200%_100%]",
        className
      )}
    />
  );
}

// 使用
<Skeleton className="h-4 w-32 rounded" />
```

**动画：**

```js
// tailwind.config.js
pulse: {
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 }
}
```

### 6.4 不确定进度条

**实现：**

```tsx
<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
  <div className="h-full w-1/3 bg-primary-600 rounded-full animate-indeterminate" />
</div>
```

**Tailwind 配置：**

```js
// tailwind.config.js
indeterminate: {
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(400%)' }
}

animation: {
  indeterminate: 'indeterminate 1.5s ease-in-out infinite'
}
```

---

## 7. 状态转换

### 7.1 任务状态转换动画

**Pending → Running：**

```tsx
// 边框颜色变化 + 阴影提升
<motion.div
  animate={{
    borderColor: status === 'running' ? 'var(--primary-500)' : 'var(--border-light)',
    boxShadow: status === 'running'
      ? '0 4px 6px -1px rgba(59, 130, 246, 0.1)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
>
  {/* TaskCard 内容 */}
</motion.div>
```

**Running → Completed：**

```tsx
// 成功动画：边框变绿 + 图标缩放弹入
const successVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15
    }
  }
};

<motion.div variants={successVariants} initial="initial" animate="animate">
  <CheckCircle2 className="w-5 h-5 text-success-600" />
</motion.div>
```

**Running → Failed：**

```tsx
// 错误动画：抖动 + 图标突然出现
const errorVariants = {
  initial: { x: 0 },
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut'
    }
  }
};

<motion.div variants={errorVariants} initial="initial" animate="animate">
  <XCircle className="w-5 h-5 text-error-600" />
</motion.div>
```

### 7.2 边框脉冲（Running 状态）

**实现：**

```tsx
<motion.div
  animate={{
    borderColor: ['var(--primary-500)', 'var(--primary-400)', 'var(--primary-500)']
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }}
  className="border-2 rounded-lg p-6"
>
  {/* 运行中的任务 */}
</motion.div>
```

**或使用 CSS：**

```css
@keyframes border-pulse {
  0%, 100% {
    border-color: var(--primary-500);
    opacity: 1;
  }
  50% {
    border-color: var(--primary-400);
    opacity: 0.8;
  }
}

.task-running {
  animation: border-pulse 2s ease-in-out infinite;
}
```

---

## 8. 手势动画

### 8.1 拖放动画

**拖动中：**

```tsx
import { useDraggable } from '@dnd-kit/core';

function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      animate={{
        scale: isDragging ? 1.05 : 1,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1
      }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined
      }}
    >
      {children}
    </motion.div>
  );
}
```

**参数：**
- 缩放：1.05
- 透明度：0.5
- 持续时间：200ms
- 跟随鼠标：使用 transform translate3d（硬件加速）

### 8.2 滑动删除（移动端）

**实现：**

```tsx
import { motion, useMotionValue, useTransform } from 'framer-motion';

function SwipeToDelete({ onDelete, children }) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0], [0, 1]);
  const background = useTransform(
    x,
    [-200, -100, 0],
    ['#DC2626', '#EF4444', '#FFFFFF']
  );

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -200, right: 0 }}
      dragElastic={0.1}
      style={{ x, opacity, background }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -150) {
          onDelete();
        }
      }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 9. 性能优化

### 9.1 使用 CSS 而非 JS

**优先使用 CSS transitions/animations：**

✅ 好：
```tsx
<div className="transition-all duration-200 hover:scale-105">
  {/* 内容 */}
</div>
```

❌ 避免（除非必要）：
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
>
  {/* 内容 */}
</motion.div>
```

### 9.2 使用 transform 和 opacity

**GPU 加速的属性：**
- `transform`（translate, scale, rotate）
- `opacity`

✅ 高性能：
```css
.element {
  transform: translateY(-4px);
  opacity: 0.5;
}
```

❌ 低性能（触发重排）：
```css
.element {
  top: -4px; /* 触发 layout */
  height: 100px; /* 触发 layout */
}
```

### 9.3 will-change 提示

**对于复杂动画，提前告知浏览器：**

```css
.task-card-running {
  will-change: transform, opacity;
}
```

**注意：**不要滥用，只在真正需要动画的元素上使用。

### 9.4 动画节流

**对于高频更新（如进度条），使用节流：**

```tsx
import { throttle } from 'lodash-es';

const throttledUpdateProgress = useCallback(
  throttle((progress: number) => {
    setProgress(progress);
  }, 500), // 每 500ms 最多更新一次
  []
);

useEffect(() => {
  const unsubscribe = window.electronAPI.on('task:progress', ({ progress }) => {
    throttledUpdateProgress(progress);
  });
  return unsubscribe;
}, []);
```

### 9.5 虚拟化长列表

**对于大量任务（> 50），使用虚拟滚动：**

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function TaskList({ tasks }: { tasks: Task[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // 估计每个任务卡片高度
    overscan: 5
  });

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <TaskCard task={tasks[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 10. 减少动效模式

### 10.1 检测用户偏好

**使用 prefers-reduced-motion：**

```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: 'easeOut'
      }}
    >
      {/* 内容 */}
    </motion.div>
  );
}
```

**CSS 版本：**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 10.2 必要动画

**即使启用减少动效，以下动画应保留：**

1. **加载指示器：**用户需要知道系统正在工作
2. **进度条：**提供重要的状态反馈
3. **焦点指示器：**无障碍访问必需

**实现：**

```tsx
const shouldReduceMotion = useReducedMotion();

// 加载指示器始终显示
<Loader2 className="animate-spin" />

// 装饰性动画可选
{!shouldReduceMotion && (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring' }}
  >
    <CheckCircle2 />
  </motion.div>
)}
```

---

## Tailwind 配置汇总

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // 持续时间
      transitionDuration: {
        instant: '100ms',
        fast: '150ms',
        normal: '200ms',
        medium: '300ms',
        slow: '400ms',
        slower: '600ms'
      },

      // 缓动函数
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'fast-out': 'cubic-bezier(0.4, 0, 0.6, 1)',
        precise: 'cubic-bezier(0.2, 0, 0, 1)'
      },

      // 关键帧动画
      keyframes: {
        // 光晕效果
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },

        // 不确定进度条
        indeterminate: {
          '0%': { transform: 'translateX(-100%)', backgroundPosition: '200% 0' },
          '100%': { transform: 'translateX(100%)', backgroundPosition: '-200% 0' }
        },

        // 旋转（已内置）
        spin: {
          to: { transform: 'rotate(360deg)' }
        },

        // 脉冲（已内置）
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },

        // 弹跳（已内置）
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)'
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)'
          }
        },

        // 淡入
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },

        // 缩放进入
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 }
        },

        // 滑入
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        }
      },

      // 动画
      animation: {
        shimmer: 'shimmer 2s infinite',
        indeterminate: 'indeterminate 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 300ms ease-out',
        'scale-in': 'scale-in 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-in': 'slide-in 300ms ease-out'
      },

      // 缩放值
      scale: {
        98: '0.98',
        102: '1.02'
      }
    }
  },
  plugins: [
    // 添加 @media (prefers-reduced-motion) 支持
    require('tailwindcss-animate')
  ]
}
```

---

## 代码检查清单

实施动画时，请确保：

- [ ] 所有交互都有即时视觉反馈（< 100ms）
- [ ] 使用合适的缓动函数（大多数情况用 ease-out）
- [ ] 避免使用会触发重排的属性（top、left、width、height）
- [ ] 优先使用 CSS transitions，复杂动画用 Framer Motion
- [ ] 长列表使用虚拟滚动（> 50 项）
- [ ] 高频更新使用节流（进度条、滚动）
- [ ] 支持 prefers-reduced-motion
- [ ] 所有动画有明确的目的（不仅仅是装饰）
- [ ] 在低端设备上测试性能

---

## 动画库依赖

推荐使用以下库：

1. **Framer Motion** - React 动画库
   ```bash
   npm install framer-motion
   ```

2. **Tailwind CSS** - 内置动画支持

3. **Radix UI** - 组件已内置动画支持

4. **@tanstack/react-virtual** - 虚拟滚动（可选）

---

## 下一步

参考 `implementation-guide.md` 了解如何将这些动画集成到项目中。
