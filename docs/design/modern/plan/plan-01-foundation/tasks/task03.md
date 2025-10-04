# Task 03: 设置字体系统

## 任务目标

配置并加载 Inter Variable 和 JetBrains Mono 字体，确保在所有平台（macOS、Windows、Linux）上正确渲染。

## 参考文档

- `docs/design/modern/guide/overview.md` - 第2节 排版系统
- `docs/design/modern/guide/implementation-guide.md` - 字体配置
- Google Fonts - Inter Variable
- Google Fonts - JetBrains Mono

## 字体选择理由

### Inter Variable
- **用途**：UI 文本、标题、正文
- **优势**：
  - 专为屏幕显示优化
  - Variable Font 支持（400-700 字重）
  - 优秀的中文字体回退
  - 开源免费（OFL 许可证）
  - 支持 OpenType 特性

### JetBrains Mono
- **用途**：代码、文件路径、FFmpeg 命令、日志输出
- **优势**：
  - 等宽字体，代码友好
  - 清晰区分相似字符（0O、1lI）
  - 支持连字（ligatures）
  - 开源免费

## 实施步骤

### 步骤 1: 选择字体加载方式

**方式 A：Google Fonts CDN（推荐，快速）**

优点：
- 快速集成，无需下载
- Google CDN 全球加速
- 自动优化（子集化、WOFF2）

缺点：
- 需要网络连接
- 首次加载可能慢
- 隐私考虑（Google Analytics）

**方式 B：自托管字体（生产环境推荐）**

优点：
- 无网络依赖
- 完全控制
- 隐私友好

缺点：
- 需要手动优化
- 文件体积较大

### 步骤 2: 使用 Google Fonts CDN

在 `src/renderer/index.html` 的 `<head>` 中添加：

```html
<!-- src/renderer/index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- 预连接 Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- 加载 Inter Variable 字体 -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- 加载 JetBrains Mono 字体 -->
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <title>FFmpeg GUI</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

**参数说明**：
- `wght@400;500;600;700` - 仅加载需要的字重，减少文件大小
- `display=swap` - 使用系统字体占位，字体加载完成后替换（防止 FOIT）

### 步骤 3: 配置字体 Fallback 链

在 `src/renderer/src/index.css` 中定义字体 fallback：

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

@layer base {
  :root {
    /* 字体系统 */
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
                 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
                 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

    --font-mono: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas',
                 'Liberation Mono', 'Courier New', monospace;
  }

  body {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 代码相关元素使用等宽字体 */
  code,
  kbd,
  samp,
  pre {
    font-family: var(--font-mono);
  }
}
```

**Fallback 链解释**：
1. **Inter** - 首选字体
2. **-apple-system** - macOS 系统字体（SF Pro）
3. **BlinkMacSystemFont** - macOS Chrome 系统字体
4. **Segoe UI** - Windows 系统字体
5. **Roboto** - Android 系统字体
6. **Noto Sans** - Linux 推荐字体
7. **sans-serif** - 浏览器默认字体

### 步骤 4: 在 Tailwind 中配置字体

在 `tailwind.config.js` 中添加（如果 Task 02 已配置，跳过此步）：

```js
export default {
  theme: {
    extend: {
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
    },
  },
};
```

### 步骤 5: 字体预加载优化（可选）

对于关键字体，可以在 `index.html` 中预加载：

```html
<head>
  <!-- 预加载关键字体文件 -->
  <link
    rel="preload"
    as="font"
    href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
    type="font/woff2"
    crossorigin
  >
</head>
```

**注意**：
- 仅预加载最关键的字体（通常是 Regular 400 字重）
- URL 需要从 Google Fonts CSS 中获取
- 过多预加载会影响性能

### 步骤 6: 自托管字体（生产环境推荐）

**下载字体文件**：

1. 访问 Google Fonts
2. 选择 Inter 和 JetBrains Mono
3. 下载 WOFF2 格式文件

**文件结构**：

```
public/
└── fonts/
    ├── inter/
    │   ├── inter-400.woff2
    │   ├── inter-500.woff2
    │   ├── inter-600.woff2
    │   └── inter-700.woff2
    └── jetbrains-mono/
        ├── jetbrains-mono-400.woff2
        └── jetbrains-mono-500.woff2
```

**定义 @font-face**：

在 `src/renderer/src/index.css` 中添加：

```css
@layer base {
  /* Inter 字体 */
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter/inter-400.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter/inter-500.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter/inter-600.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter/inter-700.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  /* JetBrains Mono 字体 */
  @font-face {
    font-family: 'JetBrains Mono';
    src: url('/fonts/jetbrains-mono/jetbrains-mono-400.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'JetBrains Mono';
    src: url('/fonts/jetbrains-mono/jetbrains-mono-500.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
}
```

## 验收标准

### 1. 字体加载测试

打开浏览器 DevTools → Network 面板：

- [ ] 看到 Inter 字体请求（WOFF2 格式）
- [ ] 看到 JetBrains Mono 字体请求
- [ ] 字体文件大小合理（每个 < 100KB）
- [ ] 字体加载时间 < 500ms

### 2. 字体渲染测试

创建测试页面：

```tsx
// src/renderer/src/pages/__tests__/FontTest.tsx
export function FontTest() {
  return (
    <div className="p-8 space-y-8">
      <section>
        <h2 className="text-h2 mb-4">Inter 字体测试（Sans）</h2>
        <div className="space-y-2">
          <p className="font-sans font-normal">Regular 400: The quick brown fox jumps over the lazy dog</p>
          <p className="font-sans font-medium">Medium 500: The quick brown fox jumps over the lazy dog</p>
          <p className="font-sans font-semibold">Semibold 600: The quick brown fox jumps over the lazy dog</p>
          <p className="font-sans font-bold">Bold 700: The quick brown fox jumps over the lazy dog</p>
        </div>

        <div className="mt-4">
          <p className="font-sans">中文测试：快速的棕色狐狸跳过懒狗</p>
          <p className="font-sans">数字测试：0123456789</p>
          <p className="font-sans">符号测试：!@#$%^&*()</p>
        </div>
      </section>

      <section>
        <h2 className="text-h2 mb-4">JetBrains Mono 字体测试（Mono）</h2>
        <div className="space-y-2">
          <p className="font-mono">Regular 400: The quick brown fox jumps over the lazy dog</p>
          <p className="font-mono font-medium">Medium 500: The quick brown fox jumps over the lazy dog</p>
        </div>

        <div className="mt-4 space-y-2">
          <p className="font-mono">代码测试：const foo = 'bar';</p>
          <p className="font-mono">路径测试：/Users/user/Documents/video.mp4</p>
          <p className="font-mono">命令测试：ffmpeg -i input.mp4 output.webm</p>
          <p className="font-mono">相似字符：0O 1lI rn m</p>
        </div>
      </section>

      <section>
        <h2 className="text-h2 mb-4">字号测试</h2>
        <p className="text-display">Display 40px</p>
        <p className="text-h1">H1 32px</p>
        <p className="text-h2">H2 24px</p>
        <p className="text-h3">H3 18px</p>
        <p className="text-body-lg">Body Large 16px</p>
        <p className="text-body">Body 14px</p>
        <p className="text-caption">Caption 12px</p>
        <p className="text-micro">Micro 11px</p>
      </section>
    </div>
  );
}
```

添加路由：

```tsx
{
  path: '/__test__/fonts',
  element: <FontTest />,
}
```

访问 `http://localhost:5173/#/__test__/fonts`，检查：

- [ ] Inter 字体正确渲染（边缘平滑）
- [ ] JetBrains Mono 字体正确渲染（等宽）
- [ ] 中文使用 fallback 字体（macOS 用 PingFang SC）
- [ ] 所有字重（400/500/600/700）正确显示
- [ ] 相似字符可区分（0O、1lI）

### 3. 跨平台测试

**macOS**：
- [ ] 字体渲染平滑（使用 subpixel antialiasing）
- [ ] Fallback 到 -apple-system 正常

**Windows**：
- [ ] 字体渲染清晰（ClearType）
- [ ] Fallback 到 Segoe UI 正常

**Linux**：
- [ ] 字体渲染正常
- [ ] Fallback 到 Noto Sans 或其他系统字体

### 4. 性能测试

使用 Lighthouse 或浏览器 DevTools 测试：

- [ ] 字体加载不阻塞首次内容渲染（FCP）
- [ ] 无 FOIT（Flash of Invisible Text）
- [ ] 无 FOUT（Flash of Unstyled Text）明显闪烁

## 潜在问题

### 问题 1: 字体加载慢，白屏时间长

**原因**：字体文件过大或网络慢

**解决方案**：
1. 使用 `font-display: swap`（已配置）
2. 预加载关键字体
3. 减少加载的字重（仅 400/500/600/700）
4. 考虑自托管字体

### 问题 2: Linux 上 Inter 渲染模糊

**原因**：Linux 字体渲染引擎差异

**解决方案**：
添加 CSS 优化：
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

### 问题 3: 中文字体 fallback 不理想

**症状**：中文显示为宋体或其他不美观字体

**解决方案**：
在 fallback 链中明确指定中文字体：
```js
fontFamily: {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"PingFang SC"',      // macOS 中文
    '"Microsoft YaHei"',  // Windows 中文
    '"Noto Sans SC"',     // Linux 中文
    'sans-serif',
  ],
}
```

### 问题 4: JetBrains Mono 连字（ligatures）不显示

**解决方案**：
启用 OpenType 特性：
```css
.font-mono {
  font-variant-ligatures: common-ligatures;
  font-feature-settings: "liga" 1, "calt" 1;
}
```

## 输出产物

**更新文件**：
- `src/renderer/index.html`（添加 Google Fonts 链接）
- `src/renderer/src/index.css`（定义字体变量和 fallback）
- `tailwind.config.js`（配置 fontFamily 扩展）

**新增测试文件**：
- `src/renderer/src/pages/__tests__/FontTest.tsx`

**（可选）自托管文件**：
- `public/fonts/inter/*.woff2`
- `public/fonts/jetbrains-mono/*.woff2`

## 预计时间

- **Google Fonts 方式**：0.5-1 小时
- **自托管方式**：1-1.5 小时
- **测试**：0.5 小时
- **总计**：1-2 小时

---

**创建时间**：2025-10-04
**优先级**：P0
**依赖**：Task 02（Tailwind 配置）
**后续任务**：Task 04（动画工具类）
