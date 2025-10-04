# Task 01: 更新 CSS 变量系统

## 任务目标

更新 `src/renderer/src/index.css`，建立完整的 Modern Minimalist 设计系统 CSS 变量体系。

## 参考文档

- `docs/design/modern/guide/implementation-guide.md` - 第3节 CSS 自定义属性
- `docs/design/modern/guide/overview.md` - 颜色系统决策
- `docs/design/modern/demo/*.html` - 实际应用的颜色值

## 实施步骤

### 步骤 1: 分析现有 CSS 变量

**当前状态** (`src/renderer/src/index.css`):

```css
@theme {
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;
  /* ... 其他 ShadCN UI 默认变量 */
}
```

**问题**：
- 变量命名不符合设计系统规范
- 缺少完整的颜色层级（background-primary/secondary/tertiary）
- 缺少语义化颜色（success、warning、error 的 50/500/600 变体）
- 缺少边框颜色层级（light/medium/dark）

### 步骤 2: 定义浅色主题变量

在 `:root` 下添加所有设计 token：

```css
@layer base {
  :root {
    /* ============ 基础颜色 ============ */
    --background-primary: 0 0% 100%;           /* #FFFFFF - 主要背景 */
    --background-secondary: 210 20% 98%;       /* #F9FAFB - 次要背景 */
    --background-tertiary: 210 20% 95%;        /* #F1F3F5 - 第三级背景 */
    --background-elevated: 0 0% 100%;          /* #FFFFFF - 浮起元素背景 */

    /* ============ 表面颜色 ============ */
    --surface-base: 0 0% 100%;                 /* #FFFFFF - 基础表面 */
    --surface-raised: 0 0% 100%;               /* #FFFFFF - 抬起表面 */
    --surface-overlay: 0 0% 100% / 0.95;       /* rgba(255, 255, 255, 0.95) - 覆盖层 */

    /* ============ 文本颜色 ============ */
    --text-primary: 220 20% 10%;               /* #171A1F - 主文本 */
    --text-secondary: 220 10% 45%;             /* #6B7280 - 次要文本 */
    --text-tertiary: 220 8% 60%;               /* #9CA3AF - 辅助文本 */
    --text-disabled: 220 5% 75%;               /* #C4C4C4 - 禁用文本 */

    /* ============ 主色（Primary Blue） ============ */
    --primary-50: 215 100% 97%;                /* #EFF6FF */
    --primary-100: 215 95% 93%;                /* #DBEAFE */
    --primary-500: 217 91% 60%;                /* #3B82F6 - 主色 */
    --primary-600: 217 91% 52%;                /* #2563EB - 深色主色 */
    --primary-700: 217 85% 45%;                /* #1D4ED8 - 更深色主色 */

    /* ============ 成功色（Success Green） ============ */
    --success-50: 142 76% 96%;                 /* #ECFDF5 */
    --success-500: 142 71% 45%;                /* #10B981 - 成功色 */
    --success-600: 142 76% 36%;                /* #059669 - 深色成功色 */

    /* ============ 警告色（Warning Yellow） ============ */
    --warning-50: 48 100% 96%;                 /* #FEFCE8 */
    --warning-500: 45 93% 58%;                 /* #F59E0B - 警告色 */
    --warning-600: 38 92% 50%;                 /* #D97706 - 深色警告色 */

    /* ============ 错误色（Error Red） ============ */
    --error-50: 0 86% 97%;                     /* #FEF2F2 */
    --error-500: 0 84% 60%;                    /* #EF4444 - 错误色 */
    --error-600: 0 72% 51%;                    /* #DC2626 - 深色错误色 */

    /* ============ 边框颜色 ============ */
    --border-light: 220 15% 90%;               /* #E5E7EB - 浅边框 */
    --border-medium: 220 15% 85%;              /* #D1D5DB - 中等边框 */
    --border-dark: 220 15% 75%;                /* #9CA3AF - 深边框 */
  }
}
```

### 步骤 3: 定义深色主题变量

在 `.dark` 类下定义深色主题：

```css
.dark {
  /* ============ 基础颜色 ============ */
  --background-primary: 220 18% 8%;          /* #0F1419 - 主要背景 */
  --background-secondary: 220 16% 12%;       /* #1A1F29 - 次要背景 */
  --background-tertiary: 220 15% 16%;        /* #242933 - 第三级背景 */
  --background-elevated: 220 16% 14%;        /* #1D222C - 浮起元素背景 */

  /* ============ 表面颜色 ============ */
  --surface-base: 220 16% 12%;               /* #1A1F29 - 基础表面 */
  --surface-raised: 220 15% 16%;             /* #242933 - 抬起表面 */
  --surface-overlay: 220 16% 12% / 0.95;     /* rgba(26, 31, 41, 0.95) - 覆盖层 */

  /* ============ 文本颜色 ============ */
  --text-primary: 210 20% 98%;               /* #F9FAFB - 主文本 */
  --text-secondary: 215 15% 75%;             /* #B4BCD0 - 次要文本 */
  --text-tertiary: 215 12% 60%;              /* #8B94A8 - 辅助文本 */
  --text-disabled: 215 10% 45%;              /* #5A6172 - 禁用文本 */

  /* ============ 主色（增亮以适应深色背景） ============ */
  --primary-50: 215 100% 97%;                /* 保持不变 */
  --primary-100: 215 95% 93%;                /* 保持不变 */
  --primary-500: 213 94% 68%;                /* #60A5FA - 增亮主色 */
  --primary-600: 213 90% 62%;                /* #3B82F6 - 增亮 */
  --primary-700: 213 85% 55%;                /* #2563EB - 增亮 */

  /* ============ 成功色（增亮） ============ */
  --success-50: 142 76% 96%;                 /* 保持不变 */
  --success-500: 142 71% 55%;                /* #34D399 - 增亮 */
  --success-600: 142 71% 50%;                /* #10B981 - 增亮 */

  /* ============ 警告色（增亮） ============ */
  --warning-50: 48 100% 96%;                 /* 保持不变 */
  --warning-500: 45 93% 65%;                 /* #FBBF24 - 增亮 */
  --warning-600: 45 93% 58%;                 /* #F59E0B - 增亮 */

  /* ============ 错误色（增亮） ============ */
  --error-50: 0 86% 97%;                     /* 保持不变 */
  --error-500: 0 84% 70%;                    /* #F87171 - 增亮 */
  --error-600: 0 84% 65%;                    /* #EF4444 - 增亮 */

  /* ============ 边框颜色 ============ */
  --border-light: 220 14% 22%;               /* #2E3440 - 浅边框 */
  --border-medium: 220 13% 28%;              /* #3A4250 - 中等边框 */
  --border-dark: 220 12% 35%;                /* #4A5463 - 深边框 */
}
```

### 步骤 4: 添加全局基础样式

```css
@layer base {
  /* ... 颜色变量定义 ... */

  /* ============ 基础样式重置 ============ */
  * {
    @apply border-border-light;
  }

  body {
    @apply bg-background-primary text-text-primary font-sans antialiased;
  }

  /* ============ 滚动条样式 ============ */
  ::-webkit-scrollbar {
    @apply w-2 h-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-background-secondary rounded;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-border-medium rounded hover:bg-border-dark transition-colors;
  }

  /* ============ 选中文本样式 ============ */
  ::selection {
    @apply bg-primary-100 text-primary-700;
  }

  .dark ::selection {
    @apply bg-primary-600/30 text-primary-100;
  }

  /* ============ 焦点样式 ============ */
  :focus-visible {
    @apply outline-none ring-2 ring-primary-500 ring-offset-2 ring-offset-background-primary;
  }
}
```

### 步骤 5: 添加实用工具类

```css
@layer utilities {
  /* 截断文本 */
  .truncate {
    @apply overflow-hidden text-ellipsis whitespace-nowrap;
  }

  /* 仅屏幕阅读器可见 */
  .sr-only {
    @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
    clip: rect(0, 0, 0, 0);
  }

  /* GPU 加速 */
  .gpu-accelerate {
    will-change: transform, opacity;
    transform: translateZ(0);
  }
}
```

## 验收标准

### 1. 颜色对比度测试

使用浏览器 DevTools 检查对比度：

- [ ] `text-primary` on `background-primary` ≥ 4.5:1
- [ ] `text-secondary` on `background-primary` ≥ 4.5:1
- [ ] `primary-500` on `background-primary` ≥ 3:1
- [ ] 深色主题同样通过对比度测试

### 2. 视觉一致性测试

创建测试页面 `tests/visual-tokens.html`：

```html
<div class="p-8 space-y-4">
  <h2>颜色系统测试</h2>

  <!-- 背景色 -->
  <div class="flex gap-4">
    <div class="bg-background-primary p-4 border">Primary</div>
    <div class="bg-background-secondary p-4">Secondary</div>
    <div class="bg-background-tertiary p-4">Tertiary</div>
  </div>

  <!-- 语义色 -->
  <div class="flex gap-4">
    <div class="bg-primary-500 text-white p-4">Primary</div>
    <div class="bg-success-500 text-white p-4">Success</div>
    <div class="bg-warning-500 text-white p-4">Warning</div>
    <div class="bg-error-500 text-white p-4">Error</div>
  </div>

  <!-- 文本色 -->
  <div class="space-y-2">
    <p class="text-text-primary">Primary Text</p>
    <p class="text-text-secondary">Secondary Text</p>
    <p class="text-text-tertiary">Tertiary Text</p>
    <p class="text-text-disabled">Disabled Text</p>
  </div>
</div>
```

对比 HTML Demo（如 `dashboard.html`），确保颜色一致。

### 3. 深色主题切换测试

```tsx
// 添加到 App.tsx 或测试页面
<button
  onClick={() => document.documentElement.classList.toggle('dark')}
  className="fixed top-4 right-4 bg-primary-500 text-white px-4 py-2 rounded"
>
  切换主题
</button>
```

切换后检查：
- [ ] 所有颜色正确切换
- [ ] 对比度仍然符合要求
- [ ] 无闪烁或延迟

## 潜在问题

### 问题 1: Tailwind CSS 4.0 语法冲突

**症状**：`@apply` 指令不生效

**解决方案**：
确保 `index.css` 包含：
```css
@import 'tailwindcss';

@layer base {
  /* 变量定义 */
}
```

### 问题 2: 颜色变量不生效

**症状**：`bg-background-primary` 不渲染颜色

**原因**：Tailwind CSS 4.0 使用 `--color-*` 前缀

**解决方案**：
在 Task 02 中配置 Tailwind 扩展，将自定义变量映射到 Tailwind 颜色系统。

### 问题 3: HSL 值格式错误

**症状**：颜色显示异常

**检查**：
```css
/* ✅ 正确格式 */
--primary-500: 217 91% 60%;

/* ❌ 错误格式 */
--primary-500: hsl(217, 91%, 60%);
```

Tailwind CSS 需要无单位的 HSL 值，使用时通过 `hsl(var(--primary-500))` 包裹。

## 输出产物

**更新的文件**：
- `src/renderer/src/index.css`（约 150-200 行新增代码）

**新增测试文件**（可选）：
- `src/renderer/src/pages/__tests__/VisualTokens.tsx`

## 预计时间

- **实施**：1.5-2 小时
- **测试**：0.5-1 小时
- **总计**：2-3 小时

---

**创建时间**：2025-10-04
**优先级**：P0
**依赖**：无
**后续任务**：Task 02（配置 Tailwind 主题）
