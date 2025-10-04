# FFmpeg GUI 页面布局规范

## 总体布局结构

### 应用整体框架

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────┐  ┌─────────────────────────────────────────────┐ │
│  │           │  │                                             │ │
│  │  Sidebar  │  │           Main Content Area                 │ │
│  │           │  │                                             │ │
│  │  (240px)  │  │           (Flex 1)                          │ │
│  │           │  │                                             │ │
│  └───────────┘  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**整体布局规范：**
- 最小窗口尺寸：1024px × 768px
- 推荐窗口尺寸：1280px × 800px
- 侧边栏固定宽度：240px
- 主内容区域：flex-1（自适应）
- 背景色：`--background-primary`

### 侧边栏（Sidebar）布局

```
┌──────────────┐
│ ┌──────────┐ │  ← App Logo & Title (高度: 64px)
│ │ FFmpeg   │ │
│ │   GUI    │ │
│ └──────────┘ │
│              │
│ ┌──────────┐ │  ← 导航菜单项
│ │ 🏠 首页  │ │     高度: 40px
│ └──────────┘ │     间距: 4px
│ ┌──────────┐ │
│ │ 🔄 转换  │ │  ← 当前激活
│ └──────────┘ │     (深色背景)
│ ┌──────────┐ │
│ │ 🗜️ 压缩  │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │ 📋 队列  │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │ ⚙️ 设置  │ │
│ └──────────┘ │
│              │
│   (spacer)   │  ← flex-grow 占据剩余空间
│              │
│ ┌──────────┐ │  ← 底部操作区
│ │ 🌙/☀️    │ │     主题切换按钮
│ └──────────┘ │     高度: 48px
└──────────────┘
```

**侧边栏详细规范：**

- **尺寸：**
  - 宽度：240px（固定）
  - 高度：100vh（全高）
  - 内边距：`--space-4`（16px）

- **背景和边框：**
  - 背景色（浅色）：`--background-secondary` (#F9FAFB)
  - 背景色（深色）：`--background-secondary` (#1A1F29)
  - 右边框：1px solid `--border-light`

- **Logo 区域：**
  - 高度：64px
  - 内边距：`--space-4`（16px）
  - 字体大小：18px
  - 字重：700（bold）
  - 颜色：`--text-primary`

- **导航菜单项：**
  - 高度：40px
  - 内边距：`--space-3 --space-4`（12px 16px）
  - 圆角：`--radius-md`（8px）
  - 字体大小：14px
  - 字重：500（medium）
  - 图标尺寸：20px
  - 图标与文字间距：`--space-3`（12px）
  - 项目间距：`--space-1`（4px）

  **状态样式：**
  - **默认：**
    - 颜色：`--text-secondary`
    - 背景：透明
    - 过渡：all 150ms ease

  - **悬停（Hover）：**
    - 颜色：`--text-primary`
    - 背景（浅色）：`--background-tertiary`
    - 背景（深色）：`--background-tertiary`

  - **激活（Active）：**
    - 颜色：`--primary-600`
    - 背景（浅色）：`--primary-50`
    - 背景（深色）：`--primary-500` (10% opacity)
    - 字重：600（semibold）
    - 左侧边框：3px solid `--primary-500`

- **主题切换按钮：**
  - 位置：底部固定
  - 高度：48px
  - 内边距：`--space-3`（12px）
  - 图标尺寸：24px
  - 过渡：transform 200ms ease

**代码实现示例：**

```tsx
<aside className="w-60 h-screen bg-background-secondary border-r border-border-light p-4 flex flex-col">
  {/* Logo */}
  <div className="h-16 flex items-center px-4 mb-6">
    <h1 className="text-lg font-bold text-text-primary">FFmpeg GUI</h1>
  </div>

  {/* Navigation */}
  <nav className="space-y-1 flex-1">
    <NavLink to="/" className={({ isActive }) => cn(
      "flex items-center gap-3 h-10 px-4 rounded-lg transition-all duration-150",
      "text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-tertiary",
      isActive && "text-primary-600 bg-primary-50 dark:bg-primary-500/10 font-semibold border-l-3 border-primary-500"
    )}>
      <Home className="w-5 h-5" />
      <span>首页</span>
    </NavLink>
    {/* 其他导航项... */}
  </nav>

  {/* Theme Toggle */}
  <button className="h-12 flex items-center justify-center rounded-lg hover:bg-background-tertiary transition-transform hover:scale-105">
    <Moon className="w-6 h-6" />
  </button>
</aside>
```

---

## 页面详细布局

### 1. 首页（Dashboard）

**设计目标：**
- 快速概览任务状态
- 提供快捷操作入口
- 展示最近任务历史

```
┌───────────────────────────────────────────────────────────────┐
│  首页                                                          │
│  查看任务概览和快速开始                                        │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  📊 任务统计                                              │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │ │
│  │  │ 运行中   │ │ 队列中   │ │ 已完成   │ │ 失败     │   │ │
│  │  │    2     │ │    5     │ │   156    │ │    3     │   │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌────────────────────┐  ┌────────────────────┐              │
│  │  快速转换          │  │  快速压缩          │              │
│  │  🔄                │  │  🗜️                │              │
│  │  点击开始格式转换  │  │  点击开始视频压缩  │              │
│  └────────────────────┘  └────────────────────┘              │
│                                                                │
│  📋 最近任务                                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  [TaskCard] video1.mp4 → video1.webm (已完成)           │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  [TaskCard] video2.mp4 → video2.mp4 (运行中 - 45%)      │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  [TaskCard] video3.avi → video3.mp4 (队列中)            │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

**布局规范：**

- **页面容器：**
  - 内边距：`--space-8`（32px）
  - 最大宽度：1400px
  - 居中对齐

- **页面标题：**
  - 字体大小：40px（Display）
  - 字重：700（bold）
  - 行高：48px
  - 字间距：-0.02em
  - 颜色：`--text-primary`
  - 底部间距：`--space-2`（8px）

- **页面描述：**
  - 字体大小：14px（Body）
  - 颜色：`--text-secondary`
  - 底部间距：`--space-8`（32px）

- **任务统计卡片容器：**
  - 布局：Grid 4列
  - 列间距：`--space-6`（24px）
  - 底部间距：`--space-8`（32px）
  - 响应式：< 1200px 时变为 2×2 网格

- **统计卡片：**
  - 尺寸：自适应宽度 × 120px
  - 内边距：`--space-6`（24px）
  - 圆角：`--radius-lg`（12px）
  - 背景：`--surface-raised`
  - 阴影：Level 1
  - 边框：1px solid `--border-light`

  **结构：**
  ```tsx
  <div className="h-30 p-6 rounded-lg bg-surface-raised shadow-sm border border-border-light">
    <div className="text-sm font-medium text-text-secondary mb-2">运行中</div>
    <div className="text-4xl font-bold text-primary-600">2</div>
  </div>
  ```

- **快速操作卡片容器：**
  - 布局：Grid 2列
  - 列间距：`--space-6`（24px）
  - 底部间距：`--space-8`（32px）

- **快速操作卡片：**
  - 尺寸：自适应 × 160px
  - 内边距：`--space-8`（32px）
  - 圆角：`--radius-lg`（12px）
  - 背景：`--surface-raised`
  - 阴影：Level 1
  - 边框：2px solid `--border-light`
  - 过渡：all 200ms ease
  - **悬停状态：**
    - 阴影：Level 2
    - 边框：2px solid `--primary-500`
    - 变换：translateY(-2px)
    - 光标：pointer

- **最近任务列表：**
  - 标题字体：18px（H3）
  - 标题字重：600（semibold）
  - 标题底部间距：`--space-4`（16px）
  - 任务卡片间距：`--space-3`（12px）
  - 最多显示：5 个任务
  - "查看全部"链接：右对齐，14px，`--primary-600`

---

### 2. 格式转换页面（Convert）

**设计目标：**
- 左右分栏，左侧文件管理，右侧配置
- 支持拖放和批量文件选择
- 提供预设快速选择和高级自定义

```
┌────────────────────────────────────────────────────────────────┐
│  格式转换                                                       │
│  支持多种视频和音频格式互转                                     │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐ │
│  │ 📁 文件上传区            │  │ ⚙️ 转换配置                 │ │
│  │                         │  │                             │ │
│  │  ┌───────────────────┐  │  │  输出格式                   │ │
│  │  │                   │  │  │  ┌────────────────────────┐ │ │
│  │  │   拖放文件到此处   │  │  │  │ MP4 ▾                  │ │ │
│  │  │      或            │  │  │  └────────────────────────┘ │ │
│  │  │  [点击选择文件]    │  │  │                             │ │
│  │  │                   │  │  │  快速预设                   │ │
│  │  └───────────────────┘  │  │  ┌──┐ ┌──┐ ┌──┐           │ │
│  │                         │  │  │高│ │中│ │低│           │ │
│  │  已选择文件 (3)         │  │  │质│ │等│ │质│           │ │
│  │  ┌───────────────────┐  │  │  │量│ │  │ │量│           │ │
│  │  │[🎬] video1.mp4 [×]│  │  │  └──┘ └──┘ └──┘           │ │
│  │  │     256 MB        │  │  │                             │ │
│  │  └───────────────────┘  │  │  ┌──────────────┐          │ │
│  │  ┌───────────────────┐  │  │  │ 高级设置 ▾   │          │ │
│  │  │[🎬] video2.mp4 [×]│  │  │  └──────────────┘          │ │
│  │  │     512 MB        │  │  │                             │ │
│  │  └───────────────────┘  │  │  (展开后显示详细选项)       │ │
│  │  ┌───────────────────┐  │  │                             │ │
│  │  │[🎬] video3.avi [×]│  │  │                             │ │
│  │  │     1.2 GB        │  │  │  ┌────────────────────────┐ │ │
│  │  └───────────────────┘  │  │  │  [开始转换]            │ │ │
│  │                         │  │  └────────────────────────┘ │ │
│  └─────────────────────────┘  └─────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**布局规范：**

- **页面容器：**
  - 内边距：`--space-8`（32px）
  - 最大宽度：无限制

- **两栏布局：**
  - 布局方式：Grid 2列
  - 列比例：1:1（相等宽度）
  - 列间距：`--space-6`（24px）
  - 响应式：< 1024px 时变为单列堆叠

#### 左栏：文件上传和列表

**文件上传区（FileUploader）：**

- **拖放区域：**
  - 最小高度：200px
  - 内边距：`--space-8`（32px）
  - 圆角：`--radius-lg`（12px）
  - 边框：2px dashed `--border-medium`
  - 背景（默认）：`--background-secondary`
  - 背景（拖放悬停）：`--primary-50` (浅色) / `--primary-500` 5% opacity (深色)
  - 边框（拖放悬停）：2px dashed `--primary-500`
  - 过渡：all 200ms ease

  **内容布局：**
  - 图标：上传图标（UploadCloud）
    - 尺寸：48px
    - 颜色：`--text-tertiary`
    - 底部间距：`--space-4`（16px）
  - 主文本："拖放文件到此处"
    - 字体大小：16px
    - 字重：500
    - 颜色：`--text-primary`
  - 分隔文本："或"
    - 字体大小：14px
    - 颜色：`--text-secondary`
    - 上下间距：`--space-3`（12px）
  - 按钮："点击选择文件"
    - 样式：Primary Button
    - 尺寸：medium

**文件列表（FileList）：**

- **容器：**
  - 顶部间距：`--space-6`（24px）

- **列表标题：**
  - 字体大小：14px
  - 字重：500
  - 颜色：`--text-secondary`
  - 底部间距：`--space-3`（12px）
  - 格式："已选择文件 (数量)"

- **文件列表项（折叠状态）：**
  - 高度：自适应（最小 72px）
  - 内边距：`--space-4`（16px）
  - 圆角：`--radius-md`（8px）
  - 背景：`--surface-raised`
  - 边框：1px solid `--border-light`
  - 阴影：Level 1
  - 项目间距：`--space-2`（8px）
  - 过渡：all 150ms ease

  **悬停状态：**
  - 背景：`--background-tertiary`
  - 阴影：Level 2

  **布局结构：**
  ```
  ┌──────────────────────────────────────┐
  │ [🎬]  video.mp4             [▾] [×]  │
  │       256.5 MB                       │
  └──────────────────────────────────────┘
  ```

  - 图标（FileVideo/Music）：20px，左对齐，`--primary-600`
  - 文件名：14px，font-medium，`--text-primary`，允许省略（truncate）
  - 文件大小：12px，`--text-tertiary`
  - 展开按钮：图标按钮，16px
  - 删除按钮：图标按钮（X），16px，悬停变红色

- **文件列表项（展开状态）：**
  - 显示 MediaInfo 组件
  - 展开动画：高度过渡 300ms ease
  - 媒体信息区域内边距：`--space-4`（16px）
  - 媒体信息背景：`--background-secondary`

#### 右栏：转换配置

**配置面板容器：**
- 内边距：`--space-6`（24px）
- 圆角：`--radius-lg`（12px）
- 背景：`--surface-raised`
- 边框：1px solid `--border-light`
- 阴影：Level 1

**表单字段：**

- **字段间距：**`--space-5`（20px）

- **标签（Label）：**
  - 字体大小：14px
  - 字重：500
  - 颜色：`--text-primary`
  - 底部间距：`--space-2`（8px）

- **输出格式下拉菜单：**
  - 高度：40px
  - 内边距：`--space-2 --space-3`（8px 12px）
  - 圆角：`--radius-md`（8px）
  - 边框：1px solid `--border-medium`
  - 背景：`--surface-base`
  - 字体大小：14px
  - 过渡：border-color 150ms ease

  **聚焦状态：**
  - 边框：2px solid `--primary-500`
  - 外边框阴影：0 0 0 3px `--primary-500` 20% opacity

- **快速预设按钮组：**
  - 布局：Grid 3列
  - 列间距：`--space-3`（12px）
  - 顶部间距：`--space-5`（20px）

  **预设按钮：**
  - 高度：80px
  - 圆角：`--radius-md`（8px）
  - 边框：2px solid `--border-light`
  - 背景：`--surface-base`
  - 过渡：all 150ms ease
  - 布局：Flex 列方向，居中对齐

  **按钮内容：**
  - 图标：24px（顶部）
  - 文字：12px，font-medium，`--text-secondary`
  - 间距：`--space-2`（8px）

  **悬停状态：**
  - 边框：2px solid `--primary-500`
  - 背景：`--primary-50` (浅色) / `--primary-500` 5% (深色)
  - 阴影：Level 1

  **选中状态：**
  - 边框：2px solid `--primary-600`
  - 背景：`--primary-100` (浅色) / `--primary-500` 15% (深色)
  - 文字颜色：`--primary-700`

- **高级设置折叠面板：**
  - 标题高度：48px
  - 标题内边距：`--space-4`（16px）
  - 标题背景：`--background-secondary`
  - 标题圆角：`--radius-md`（8px）
  - 展开图标：ChevronDown，16px，旋转动画 200ms

  **展开内容：**
  - 顶部间距：`--space-4`（16px）
  - 展开动画：高度过渡 300ms ease，透明度淡入
  - 内容包含：编解码器选择、比特率、分辨率、帧率等

- **开始转换按钮：**
  - 宽度：100%
  - 高度：48px
  - 圆角：`--radius-md`（8px）
  - 背景：`--primary-600`
  - 颜色：白色
  - 字体大小：16px
  - 字重：600
  - 阴影：Level 1
  - 顶部间距：`--space-8`（32px）

  **悬停状态：**
  - 背景：`--primary-700`
  - 阴影：Level 2
  - 变换：translateY(-1px)

  **禁用状态：**
  - 背景：`--text-disabled`
  - 光标：not-allowed
  - 透明度：0.6

---

### 3. 视频压缩页面（Compress）

**设计目标：**
- 类似转换页面的左右分栏布局
- 右侧聚焦于压缩相关配置
- 提供 CRF 质量控制和目标大小两种模式

```
┌────────────────────────────────────────────────────────────────┐
│  视频压缩                                                       │
│  高效压缩视频文件，减小体积同时保持质量                         │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐ │
│  │ 📁 文件上传区            │  │ 🗜️ 压缩配置                 │ │
│  │  (同转换页面)           │  │                             │ │
│  │                         │  │  压缩模式                   │ │
│  │                         │  │  ⚪ CRF 质量控制            │ │
│  │  已选择文件 (1)         │  │  ⚪ 目标文件大小            │ │
│  │  ┌───────────────────┐  │  │                             │ │
│  │  │[🎬] video.mp4  [▾]│  │  │  压缩预设                   │ │
│  │  │     1.2 GB        │  │  │  ┌──┐ ┌──┐ ┌──┐           │ │
│  │  │                   │  │  │  │极│ │高│ │平│           │ │
│  │  │ 📊 媒体信息：      │  │  │  │致│ │质│ │衡│           │ │
│  │  │ 分辨率: 1920×1080 │  │  │  │压│ │量│ │  │           │ │
│  │  │ 时长: 10:24       │  │  │  │缩│ │  │ │  │           │ │
│  │  │ 码率: 8.5 Mbps    │  │  │  └──┘ └──┘ └──┘           │ │
│  │  │ 编解码器: H.264   │  │  │  ┌──┐ ┌──┐ ┌──┐           │ │
│  │  └───────────────────┘  │  │  │快│ │移│ │Web│          │ │
│  │                         │  │  │速│ │动│ │优│          │ │
│  │                         │  │  │  │ │端│ │化│          │ │
│  │                         │  │  └──┘ └──┘ └──┘           │ │
│  │                         │  │                             │ │
│  │                         │  │  CRF 质量 (23)              │ │
│  │                         │  │  ◀═══════●═════▶           │ │
│  │                         │  │  18      23      32         │ │
│  │                         │  │  (高质量) (推荐) (高压缩)   │ │
│  │                         │  │                             │ │
│  │                         │  │  预计大小: ~450 MB          │ │
│  │                         │  │  压缩比: 62%                │ │
│  │                         │  │                             │ │
│  │                         │  │  ┌────────────────────────┐ │ │
│  │                         │  │  │  [开始压缩]            │ │ │
│  │                         │  │  └────────────────────────┘ │ │
│  └─────────────────────────┘  └─────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**布局规范：**

- **整体布局：**与转换页面相同的两栏结构

- **左栏：**与转换页面相同，但建议只选择单个文件（压缩需要详细信息）

- **右栏：压缩配置面板**

**压缩模式选择（Radio Group）：**
- 布局：垂直堆叠
- 项目间距：`--space-3`（12px）
- 底部间距：`--space-5`（20px）

**单个 Radio 选项：**
- 高度：48px
- 内边距：`--space-4`（16px）
- 圆角：`--radius-md`（8px）
- 边框：2px solid `--border-light`
- 布局：Flex 横向，居中对齐
- 过渡：all 150ms ease

**选中状态：**
- 边框：2px solid `--primary-600`
- 背景：`--primary-50` (浅色) / `--primary-500` 10% (深色)

**Radio 按钮：**
- 尺寸：20px × 20px
- 边框：2px solid `--border-medium`
- 圆形：border-radius: 50%
- 选中时：内部填充 `--primary-600` (10px 圆点)

**压缩预设按钮组：**
- 布局：Grid 3×2（6个预设）
- 列间距：`--space-3`（12px）
- 行间距：`--space-3`（12px）
- 顶部间距：`--space-5`（20px）

**预设按钮样式：**与转换页面相同

**CRF 质量滑块：**

- **滑块容器：**
  - 顶部间距：`--space-5`（20px）
  - 底部间距：`--space-6`（24px）

- **标签行：**
  - 布局：Flex，space-between
  - 标签字体：14px，font-medium
  - 当前值：16px，font-semibold，`--primary-600`

- **滑块轨道：**
  - 高度：6px
  - 宽度：100%
  - 圆角：`--radius-full`
  - 背景：`--border-light`
  - 顶部间距：`--space-3`（12px）

- **滑块填充（已滑动部分）：**
  - 背景：渐变色 `--primary-500` 到 `--primary-600`
  - 高度：6px
  - 圆角：`--radius-full`

- **滑块手柄（Thumb）：**
  - 尺寸：20px × 20px
  - 圆形：border-radius: 50%
  - 背景：`--primary-600`
  - 边框：3px solid 白色
  - 阴影：Level 2
  - 过渡：transform 150ms ease

  **悬停/拖动状态：**
  - 尺寸：24px × 24px（scale(1.2)）
  - 阴影：Level 3
  - 光标：grab（拖动时：grabbing）

- **刻度标签：**
  - 字体大小：11px
  - 颜色：`--text-tertiary`
  - 位置：轨道下方
  - 顶部间距：`--space-2`（8px）
  - 布局：分布在 18、23、32 位置

**预估信息卡片：**

- **容器：**
  - 内边距：`--space-4`（16px）
  - 圆角：`--radius-md`（8px）
  - 背景：`--background-secondary`
  - 边框：1px solid `--border-light`
  - 顶部间距：`--space-5`（20px）

- **信息项：**
  - 布局：Flex，space-between
  - 高度：32px
  - 项目间距：`--space-2`（8px）

  **标签：**
  - 字体大小：14px
  - 颜色：`--text-secondary`

  **值：**
  - 字体大小：16px
  - 字重：600
  - 颜色：`--text-primary`
  - 预计大小使用 `--primary-600`
  - 压缩比使用 `--success-600`

---

### 4. 任务队列页面（Queue）

**设计目标：**
- 实时显示所有任务状态
- 支持筛选和批量操作
- 清晰的进度可视化

```
┌────────────────────────────────────────────────────────────────┐
│  任务队列                                                       │
│  管理和监控所有转换/压缩任务                                    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  📊 队列状态                                                │ │
│  │  运行中: 2  |  队列中: 5  |  已完成: 156  |  失败: 3       │ │
│  │  最大并发: [2 ▾]                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────┬──────────────┐ │
│  │  筛选: [全部 ▾]                              │  [🗑️ 清空]  │ │
│  └─────────────────────────────────────────────┴──────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [TaskCard] video1.mp4 → video1.webm                       │ │
│  │  ⏸️ 运行中 - 45%                          [⏸️] [×]        │ │
│  │  ████████████░░░░░░░░░░░░░░░░░                              │ │
│  │  速度: 1.8x | ETA: 5分32秒 | FPS: 54                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [TaskCard] video2.mp4 → video2.mp4                        │ │
│  │  ⏸️ 运行中 - 78%                          [⏸️] [×]        │ │
│  │  ██████████████████████████░░░░                             │ │
│  │  速度: 2.3x | ETA: 2分15秒 | FPS: 68                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [TaskCard] video3.avi → video3.mp4                        │ │
│  │  ⏳ 队列中                                [×]               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [TaskCard] video4.mkv → video4.webm                       │ │
│  │  ✅ 已完成 (用时: 8分12秒)               [🔄]              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [TaskCard] video5.mp4 → video5.mp4                        │ │
│  │  ❌ 失败: 不支持的编解码器                [🔄]              │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**布局规范：**

- **页面容器：**
  - 内边距：`--space-8`（32px）
  - 最大宽度：1200px
  - 居中对齐

**队列状态栏：**

- **容器：**
  - 内边距：`--space-6`（24px）
  - 圆角：`--radius-lg`（12px）
  - 背景：`--surface-raised`
  - 边框：1px solid `--border-light`
  - 阴影：Level 1
  - 底部间距：`--space-6`（24px）

- **统计信息行：**
  - 布局：Flex，items-center，gap `--space-6`
  - 字体大小：14px
  - 分隔符："|"，颜色 `--border-medium`

- **统计项：**
  - 标签颜色：`--text-secondary`
  - 数值字重：600
  - 数值颜色：
    - 运行中：`--primary-600`
    - 队列中：`--text-tertiary`
    - 已完成：`--success-600`
    - 失败：`--error-600`

- **最大并发控制：**
  - 位置：右对齐
  - 下拉菜单宽度：80px
  - 选项：1、2、3、4

**筛选和操作栏：**

- **容器：**
  - 高度：56px
  - 布局：Flex，space-between，items-center
  - 内边距：`--space-4`（16px）
  - 圆角：`--radius-md`（8px）
  - 背景：`--background-secondary`
  - 边框：1px solid `--border-light`
  - 底部间距：`--space-4`（16px）

- **筛选下拉菜单：**
  - 宽度：180px
  - 高度：40px
  - 选项：全部、运行中、队列中、已完成、失败、已取消

- **清空完成按钮：**
  - 样式：Ghost Button + Destructive
  - 图标：Trash2，16px
  - 文字："清空已完成"

**任务卡片列表：**

- **容器：**
  - 布局：垂直堆叠
  - 项目间距：`--space-4`（16px）

- **TaskCard 详细规范：**（见组件规范部分）
  - 宽度：100%
  - 内边距：`--space-6`（24px）
  - 圆角：`--radius-lg`（12px）
  - 高度：自适应（最小 120px）

**TaskCard 结构：**

```tsx
<div className={cn(
  "w-full p-6 rounded-lg border-2 transition-all duration-300",
  getStatusStyles(task.status) // 根据状态动态样式
)}>
  {/* 顶部：状态和操作 */}
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center gap-3">
      <StatusIcon className="w-5 h-5" />
      <div>
        <div className="text-sm font-medium">{statusLabel}</div>
        <div className="text-xs text-text-secondary">{inputFile} → {outputFile}</div>
      </div>
    </div>
    <div className="flex gap-2">
      {/* 暂停/恢复/取消/重试按钮 */}
    </div>
  </div>

  {/* 运行中任务：进度条 */}
  {status === 'running' && (
    <div className="space-y-3">
      <ProgressBar percent={progress} />
      <div className="flex justify-between text-xs text-text-secondary">
        <span>速度: {speed}x</span>
        <span>ETA: {eta}</span>
        <span>FPS: {fps}</span>
      </div>
    </div>
  )}

  {/* 已完成任务：完成信息 */}
  {status === 'completed' && (
    <div className="text-sm text-success-600">
      用时: {duration}
    </div>
  )}

  {/* 失败任务：错误信息 */}
  {status === 'failed' && (
    <div className="text-sm text-error-600">
      {errorMessage}
    </div>
  )}
</div>
```

**空状态：**

```
┌────────────────────────────────────┐
│                                    │
│          📋                        │
│      暂无任务                       │
│                                    │
│  前往"转换"或"压缩"页面添加任务     │
│                                    │
│  ┌──────────┐  ┌──────────┐       │
│  │ 去转换   │  │ 去压缩   │       │
│  └──────────┘  └──────────┘       │
└────────────────────────────────────┘
```

- **容器：**
  - 内边距：`--space-12`（48px）
  - 文本居中
  - 图标尺寸：64px
  - 图标颜色：`--text-tertiary`
  - 主文本：18px，font-semibold
  - 描述文本：14px，`--text-secondary`
  - 按钮间距：`--space-4`（16px）

---

### 5. 设置页面（Settings）

**设计目标：**
- 清晰的分组配置
- FFmpeg 路径配置
- 应用偏好设置

```
┌────────────────────────────────────────────────────────────────┐
│  设置                                                           │
│  配置 FFmpeg 和应用偏好                                         │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ⚙️ FFmpeg 配置                                             │ │
│  │                                                             │ │
│  │  FFmpeg 路径                                                │ │
│  │  ┌─────────────────────────────────────────────┬─────────┐ │ │
│  │  │ /usr/local/bin/ffmpeg                       │ [浏览]  │ │ │
│  │  └─────────────────────────────────────────────┴─────────┘ │ │
│  │  ✅ FFmpeg 已检测到 (版本: 6.0)                            │ │
│  │                                                             │ │
│  │  FFprobe 路径                                               │ │
│  │  ┌─────────────────────────────────────────────┬─────────┐ │ │
│  │  │ /usr/local/bin/ffprobe                      │ [浏览]  │ │ │
│  │  └─────────────────────────────────────────────┴─────────┘ │ │
│  │  ✅ FFprobe 已检测到 (版本: 6.0)                           │ │
│  │                                                             │ │
│  │  ┌─────────────────┐                                       │ │
│  │  │ [重新检测]      │                                       │ │
│  │  └─────────────────┘                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🎨 外观                                                    │ │
│  │                                                             │ │
│  │  主题                                                       │ │
│  │  ⚪ 浅色    ⚪ 深色    ⚪ 跟随系统                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🔧 任务设置                                                │ │
│  │                                                             │ │
│  │  最大并发任务数                                             │ │
│  │  ┌───────────────────┐                                     │ │
│  │  │ 2 ▾               │                                     │ │
│  │  └───────────────────┘                                     │ │
│  │                                                             │ │
│  │  □ 任务完成后自动开始下一个                                │ │
│  │  □ 任务完成后发送系统通知                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  📁 文件设置                                                │ │
│  │                                                             │ │
│  │  默认输出目录                                               │ │
│  │  ┌─────────────────────────────────────────────┬─────────┐ │ │
│  │  │ ~/Videos/FFmpeg-Output                      │ [浏览]  │ │ │
│  │  └─────────────────────────────────────────────┴─────────┘ │ │
│  │                                                             │ │
│  │  □ 转换后保留原文件                                        │ │
│  │  □ 文件名冲突时自动重命名                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────┐                               │
│  │  [保存设置]                 │                               │
│  └─────────────────────────────┘                               │
└────────────────────────────────────────────────────────────────┘
```

**布局规范：**

- **页面容器：**
  - 内边距：`--space-8`（32px）
  - 最大宽度：800px
  - 居中对齐

**配置分组卡片：**

- **容器：**
  - 内边距：`--space-6`（24px）
  - 圆角：`--radius-lg`（12px）
  - 背景：`--surface-raised`
  - 边框：1px solid `--border-light`
  - 阴影：Level 1
  - 底部间距：`--space-6`（24px）

- **分组标题：**
  - 字体大小：18px（H3）
  - 字重：600
  - 颜色：`--text-primary`
  - 图标尺寸：20px
  - 图标与文字间距：`--space-3`（12px）
  - 底部间距：`--space-5`（20px）

- **字段间距：**`--space-5`（20px）

**路径输入组合：**

- **标签：**
  - 字体大小：14px
  - 字重：500
  - 颜色：`--text-primary`
  - 底部间距：`--space-2`（8px）

- **输入框 + 按钮布局：**
  - 布局：Flex，gap `--space-2`（8px）
  - 输入框：flex-1
  - 按钮：固定宽度 80px

- **路径输入框：**
  - 高度：40px
  - 内边距：`--space-2 --space-3`（8px 12px）
  - 圆角：`--radius-md`（8px）
  - 边框：1px solid `--border-medium`
  - 背景：`--surface-base`
  - 字体：Monospace（JetBrains Mono）
  - 字体大小：13px

- **浏览按钮：**
  - 样式：Secondary Button
  - 高度：40px

- **验证状态指示：**
  - 顶部间距：`--space-2`（8px）
  - 字体大小：13px
  - 成功状态：
    - 图标：CheckCircle，16px
    - 颜色：`--success-600`
  - 错误状态：
    - 图标：XCircle，16px
    - 颜色：`--error-600`

**主题选择（Radio Group）：**

- **布局：**横向 Flex，gap `--space-4`（16px）

- **单个选项：**
  - 宽度：120px
  - 高度：48px
  - 内边距：`--space-4`（16px）
  - 圆角：`--radius-md`（8px）
  - 边框：2px solid `--border-light`
  - 布局：Flex 横向居中
  - 过渡：all 150ms ease

  **选中状态：**
  - 边框：2px solid `--primary-600`
  - 背景：`--primary-50` (浅色) / `--primary-500` 10% (深色)
  - 字重：600

**复选框（Checkbox）：**

- **容器：**
  - 高度：40px
  - 布局：Flex，items-center

- **复选框：**
  - 尺寸：18px × 18px
  - 圆角：`--radius-sm`（4px）
  - 边框：2px solid `--border-medium`
  - 过渡：all 150ms ease

  **选中状态：**
  - 背景：`--primary-600`
  - 边框：2px solid `--primary-600`
  - 图标：Checkmark（白色），12px

- **标签：**
  - 字体大小：14px
  - 颜色：`--text-primary`
  - 左侧间距：`--space-3`（12px）

**保存按钮：**

- **位置：**底部，左对齐
- **样式：**Primary Button
- **宽度：**200px
- **高度：**48px
- **顶部间距：**`--space-8`（32px）

---

## 响应式布局策略

### 断点定义

```css
/* Tailwind 默认断点 */
--breakpoint-sm: 640px    /* 小屏幕（手机横屏） */
--breakpoint-md: 768px    /* 平板竖屏 */
--breakpoint-lg: 1024px   /* 平板横屏/小笔记本 */
--breakpoint-xl: 1280px   /* 桌面 */
--breakpoint-2xl: 1536px  /* 大桌面 */
```

### 响应式规则

**< 1024px（平板）：**
- 转换/压缩页面：两栏变为单列堆叠
- 左栏（文件区）在上，右栏（配置）在下
- 侧边栏宽度缩减为 200px
- 快速预设按钮组：3列变为 2列

**< 768px（手机）：**
- 侧边栏变为覆盖层（Overlay），默认隐藏
- 添加汉堡菜单按钮（左上角）
- 快速预设按钮组：2列变为 1列
- 统计卡片：4列变为 2×2 网格
- 任务卡片操作按钮变为下拉菜单

**< 640px（小手机）：**
- 所有内边距减半（`--space-8` → `--space-4`）
- 字体大小适度缩小
- 统计卡片：2×2 变为 单列堆叠

---

## 布局通用规则

### 间距规则

- **页面级内边距：**`--space-8`（32px）
- **分组内边距：**`--space-6`（24px）
- **组件间距（大）：**`--space-6`（24px）
- **组件间距（中）：**`--space-4`（16px）
- **元素间距（小）：**`--space-2`（8px）

### 最大宽度规则

- **单列内容（设置页）：**800px
- **双列内容（队列页）：**1200px
- **三列内容（首页）：**1400px
- **无限制（转换/压缩）：**100%

### 滚动规则

- **侧边栏：**overflow-y: auto（如果内容过多）
- **主内容区：**overflow-y: auto
- **文件列表：**最大高度 500px，overflow-y: auto
- **任务列表：**无限制，允许页面滚动

### 滚动条样式

```css
/* Webkit 滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-secondary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--border-dark);
}
```

---

## 代码实现参考

### 页面容器组件

```tsx
interface PageContainerProps {
  title: string;
  description?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export function PageContainer({
  title,
  description,
  maxWidth = 'full',
  children
}: PageContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-3xl',    // 800px
    md: 'max-w-5xl',    // 1200px
    lg: 'max-w-6xl',    // 1400px
    xl: 'max-w-7xl',    // 1536px
    full: 'max-w-none'
  }[maxWidth];

  return (
    <div className={cn('p-8 mx-auto', maxWidthClass)}>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text-secondary">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
```

### 两栏布局组件

```tsx
export function TwoColumnLayout({
  left,
  right
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">{left}</div>
      <div>{right}</div>
    </div>
  );
}
```

### 配置卡片容器

```tsx
export function ConfigCard({
  title,
  icon: Icon,
  children
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-lg bg-surface-raised border border-border-light shadow-sm">
      {title && (
        <div className="flex items-center gap-3 mb-5">
          {Icon && <Icon className="w-5 h-5 text-text-secondary" />}
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </div>
  );
}
```

---

## 设计检查清单

在实施页面布局时，确保：

- [ ] 所有页面使用统一的页面容器（PageContainer）
- [ ] 间距使用设计标记（`--space-*`）
- [ ] 颜色使用设计标记（`--primary-*`、`--text-*`等）
- [ ] 所有交互元素有明确的悬停/聚焦状态
- [ ] 响应式布局在所有断点下正常工作
- [ ] 键盘导航可用（Tab 键顺序合理）
- [ ] 焦点指示器清晰可见
- [ ] 加载状态和空状态已设计
- [ ] 所有文本可选中和复制
- [ ] 滚动条样式已自定义

---

## 下一步

参考以下文档完成完整设计实施：

- `components-specification.md` - 详细组件规范
- `interaction-patterns.md` - 交互模式和流程
- `animation-motion.md` - 动画和动效指南
- `implementation-guide.md` - 开发实施指南
