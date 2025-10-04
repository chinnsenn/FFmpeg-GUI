# Plan-01: Design System Foundation（设计系统基础）

## 阶段概述

建立完整的 Modern Minimalist 设计系统基础，为后续所有 UI 组件提供统一的设计 token 和样式系统。

## 目标

1. ✅ 创建完整的 CSS 变量系统（颜色、间距、字体、阴影）
2. ✅ 配置 Tailwind CSS 主题扩展
3. ✅ 设置字体系统（Inter Variable + JetBrains Mono）
4. ✅ 创建动画工具类和 keyframes

## 参考文档

- `docs/design/modern/guide/overview.md` - 设计哲学和颜色系统
- `docs/design/modern/guide/implementation-guide.md` - CSS 变量和 Tailwind 配置
- `docs/design/modern/demo/*.html` - HTML Demo 中的实际应用

## 任务清单

| 任务 | 描述 | 预计时间 | 优先级 |
|------|------|----------|--------|
| Task 01 | 更新 CSS 变量系统（颜色、间距、阴影） | 2-3 小时 | P0 |
| Task 02 | 配置 Tailwind 主题扩展 | 2-3 小时 | P0 |
| Task 03 | 设置字体系统（Inter Variable + JetBrains Mono） | 1-2 小时 | P0 |
| Task 04 | 创建动画工具类和 keyframes | 2-3 小时 | P1 |

**总计预估时间**：7-11 小时（1-1.5 个工作日）

## 验收标准

### 1. CSS 变量系统

- [x] 浅色主题所有颜色变量定义完整
- [x] 深色主题所有颜色变量定义完整
- [x] 间距系统符合 4px 基础单位
- [x] 阴影系统包含浅色/深色两套
- [x] 字体大小和行高符合设计规范

### 2. Tailwind 配置

- [x] `colors` 扩展正确引用 CSS 变量
- [x] `fontSize` 包含所有设计标记（display、h1-h3、body、caption、micro）
- [x] `spacing` 系统配置完整（0-24）
- [x] `borderRadius` 符合设计规范
- [x] `boxShadow` 包含深色主题变体
- [x] `animation` 和 `keyframes` 配置完整

### 3. 字体系统

- [x] Inter Variable 字体加载成功
- [x] JetBrains Mono 字体加载成功
- [x] 字体 fallback 链配置正确
- [x] 字体在 macOS/Windows/Linux 上渲染正常

### 4. 动画系统

- [x] `shimmer` 动画正常运行
- [x] `indeterminate` 动画正常运行
- [x] `fade-in`、`scale-in`、`slide-in` 动画正常
- [x] `shake` 动画正常
- [x] `prefers-reduced-motion` 支持正常

## 测试步骤

### 1. 颜色系统测试

```tsx
// 创建测试页面显示所有颜色
<div className="bg-background-primary text-text-primary">主要背景</div>
<div className="bg-primary-500">主色</div>
<div className="bg-success-500">成功色</div>
<div className="bg-warning-500">警告色</div>
<div className="bg-error-500">错误色</div>
```

### 2. 深色主题测试

```tsx
// 切换主题后，所有颜色应该正确切换
<button onClick={() => document.documentElement.classList.toggle('dark')}>
  切换主题
</button>
```

### 3. 字体测试

```tsx
// 检查字体是否正确加载
<p className="font-sans">Inter Variable 字体</p>
<p className="font-mono">JetBrains Mono 字体</p>
```

### 4. 动画测试

```tsx
// 检查所有动画是否流畅
<div className="animate-shimmer">Shimmer 动画</div>
<div className="animate-fade-in">淡入动画</div>
<div className="animate-scale-in">缩放动画</div>
```

## 输出产物

1. **`src/renderer/src/index.css`** - 完整的 CSS 变量和全局样式
2. **`tailwind.config.js`** - 完整的 Tailwind 配置（如果存在）
3. **`postcss.config.js`** - PostCSS 配置
4. **字体文件**（如果自托管）- `public/fonts/`

## 依赖安装

```bash
# 核心依赖（已存在）
npm install tailwindcss@latest autoprefixer postcss

# 动画插件
npm install -D tailwindcss-animate

# 工具库
npm install class-variance-authority clsx tailwind-merge
```

## 注意事项

### 1. Tailwind CSS 4.0 差异

当前项目使用 Tailwind CSS 4.0（通过 `@import 'tailwindcss'` 和 `@theme` 语法），与传统配置文件方式不同：

- **新语法**：使用 `@theme` 在 CSS 中定义主题
- **不需要** `tailwind.config.js`（除非需要扩展配置）
- 直接在 `index.css` 中使用 `@theme` 定义变量

**当前方式**（保留）：
```css
@theme {
  --color-primary: 221.2 83.2% 53.3%;
}
```

**扩展方式**（如果需要更多配置）：
- 可以保留传统 `tailwind.config.js` 用于 plugins、content 等配置
- `@theme` 和 `tailwind.config.js` 可以共存

### 2. CSS 变量命名约定

- **Tailwind 4.0 变量**：`--color-primary`、`--radius-md`
- **自定义变量**：`--background-primary`、`--text-secondary`
- 使用 `hsl()` 函数引用：`hsl(var(--color-primary))`

### 3. 浏览器兼容性

- CSS 变量：Chrome 49+、Firefox 31+、Safari 9.1+（Electron 完全支持）
- CSS Grid：所有现代浏览器（Electron 完全支持）
- Backdrop Filter：Chrome 76+、Safari 9+（用于毛玻璃效果）

## 下一步

完成 Plan-01 后，进入 **Plan-02: Core Components**（核心组件），开始重构基础 UI 组件。

---

**创建时间**：2025-10-04
**预计完成时间**：2025-10-05
**负责人**：fullstack-engineer
