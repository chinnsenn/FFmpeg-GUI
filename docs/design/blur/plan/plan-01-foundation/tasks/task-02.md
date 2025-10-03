# Task 02: 配置 Tailwind CSS 玻璃效果 Utilities

## 任务信息

- **任务ID**: PHASE1-TASK02
- **优先级**: P0
- **预计工时**: 1 小时
- **依赖任务**: Task 01
- **责任人**: 前端开发

## 任务目标

扩展 Tailwind CSS 配置，添加 glassmorphism 设计系统所需的自定义 utilities，包括 backdrop-blur 级别、玻璃背景颜色、自定义阴影等。

## 详细说明

### 背景
Tailwind CSS v4 采用了新的配置方式，使用 CSS `@import` 和 `@theme` 指令来定义自定义配置，替代了 v3 的 `tailwind.config.js` 文件。我们需要在项目的主 CSS 文件中添加自定义配置。

### 操作步骤

#### 1. 定位主 CSS 文件

找到项目的主 CSS 入口文件（通常是 `src/renderer/src/index.css` 或 `src/renderer/src/styles/globals.css`）。

#### 2. 添加 Tailwind v4 自定义 Backdrop Blur

在主 CSS 文件中添加以下配置：

```css
@import "tailwindcss";

/* Glassmorphism Design Tokens */
@theme {
  /* Custom Backdrop Blur Levels */
  --blur-glass-subtle: 5px;
  --blur-glass-light: 8px;
  --blur-glass-medium: 10px;
  --blur-glass-strong: 12px;
  --blur-glass-heavy: 15px;

  /* Glass Background Colors */
  --color-glass-white-5: rgba(255, 255, 255, 0.05);
  --color-glass-white-8: rgba(255, 255, 255, 0.08);
  --color-glass-white-10: rgba(255, 255, 255, 0.10);
  --color-glass-white-12: rgba(255, 255, 255, 0.12);
  --color-glass-white-15: rgba(255, 255, 255, 0.15);
  --color-glass-white-18: rgba(255, 255, 255, 0.18);
  --color-glass-white-20: rgba(255, 255, 255, 0.20);
  --color-glass-white-25: rgba(255, 255, 255, 0.25);

  /* Glass Border Colors */
  --color-glass-border-primary: rgba(255, 255, 255, 0.12);
  --color-glass-border-secondary: rgba(255, 255, 255, 0.08);

  /* Glass Shadows */
  --shadow-glass-sm: 0 2px 8px rgba(0, 0, 0, 0.12);
  --shadow-glass-md: 0 4px 16px rgba(0, 0, 0, 0.16);
  --shadow-glass-lg: 0 8px 24px rgba(0, 0, 0, 0.20);
  --shadow-glass-xl: 0 16px 32px rgba(0, 0, 0, 0.24);
}
```

#### 3. 创建自定义 Utility Classes

在同一文件中添加自定义 utility classes：

```css
@layer utilities {
  /* Glass Surface Utilities */
  .glass-surface-primary {
    background: linear-gradient(135deg, var(--color-glass-white-12), var(--color-glass-white-8));
    backdrop-filter: blur(var(--blur-glass-strong));
    border: 1px solid var(--color-glass-border-primary);
    box-shadow: var(--shadow-glass-md);
  }

  .glass-surface-secondary {
    background: linear-gradient(135deg, var(--color-glass-white-15), var(--color-glass-white-8));
    backdrop-filter: blur(var(--blur-glass-medium));
    border: 1px solid var(--color-glass-border-primary);
    box-shadow: var(--shadow-glass-md);
  }

  .glass-surface-tertiary {
    background: var(--color-glass-white-10);
    backdrop-filter: blur(var(--blur-glass-light));
    border: 1px solid var(--color-glass-border-secondary);
    box-shadow: var(--shadow-glass-sm);
  }

  /* Glass Hover Effects */
  .glass-hover {
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-hover:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glass-lg);
  }

  /* GPU Acceleration for Performance */
  .glass-optimized {
    transform: translateZ(0);
    will-change: transform, opacity;
  }
}
```

#### 4. 配置背景渐变

添加应用背景渐变配置：

```css
@theme {
  /* Background Gradients */
  --gradient-background: linear-gradient(
    135deg,
    #0f172a 0%,
    #1e293b 25%,
    #334155 50%,
    #1e293b 75%,
    #0f172a 100%
  );
}

@layer base {
  body {
    background: var(--gradient-background);
    background-size: 400% 400%;
    animation: gradient-shift 30s ease infinite;
  }

  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
}
```

#### 5. 验证配置

```bash
# 检查 TypeScript 类型
npm run type-check

# 启动开发服务器
npm run dev
```

在浏览器开发者工具中检查 CSS 变量是否正确加载：

```javascript
// 在控制台执行
getComputedStyle(document.documentElement).getPropertyValue('--blur-glass-medium')
// 应该输出: "10px"
```

### 预期产出

- ✅ 主 CSS 文件包含所有玻璃效果相关的 Tailwind 自定义配置
- ✅ CSS 变量可在浏览器中正确访问
- ✅ 自定义 utility classes 可用（如 `.glass-surface-primary`）
- ✅ 背景渐变效果正常显示

## 潜在问题和解决方案

### 问题 1: Tailwind v4 配置不生效

**现象**: CSS 变量未定义，自定义 utilities 无法使用

**原因**: Tailwind v4 的 `@theme` 指令可能不被识别

**解决方案**:
1. 确认 `tailwindcss` 版本 >= 4.0
2. 确认 PostCSS 配置正确
3. 检查 `postcss.config.js`:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### 问题 2: backdrop-filter 不生效

**现象**: 玻璃效果没有模糊背后的内容

**原因**: backdrop-filter 需要特定的浏览器支持和正确的层级结构

**解决方案**:
1. 确保元素后面有内容（backdrop-filter 模糊的是背后的内容）
2. 添加 `-webkit-backdrop-filter` 前缀（Safari）:
```css
.glass-surface-primary {
  -webkit-backdrop-filter: blur(var(--blur-glass-strong));
  backdrop-filter: blur(var(--blur-glass-strong));
}
```

### 问题 3: 性能问题

**现象**: 页面滚动或动画时出现卡顿

**原因**: backdrop-filter 是性能密集型属性

**解决方案**:
1. 限制使用 backdrop-filter 的元素数量
2. 为所有玻璃元素添加 `.glass-optimized` class 启用 GPU 加速
3. 避免在动画中改变 blur 值

## 验收标准

- [x] 主 CSS 文件包含至少 5 个自定义 blur 级别变量
- [x] 至少包含 8 个玻璃背景颜色变量（white-5 到 white-25）
- [x] 定义了 3 种 glass-surface utilities（primary、secondary、tertiary）
- [x] 背景渐变效果正常显示
- [x] `npm run dev` 启动成功，无 CSS 错误
- [x] 在浏览器中可以访问所有 CSS 变量
- [x] 应用一个 `.glass-surface-primary` class 后可以看到玻璃效果

## 后续任务

- Task 03: 创建 CSS Design Tokens
- Task 04: 实现 GlassBackground 背景组件
- Task 05-07: 使用这些 utilities 实现玻璃组件

## 参考资料

- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
- [CSS backdrop-filter MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [设计文档 - Design Tokens](../../design-tokens.md)
- [设计文档 - Implementation Guide](../../implementation-guide.md)
