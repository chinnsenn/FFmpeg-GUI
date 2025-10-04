# FFmpeg GUI Design Demo Gallery

这个目录包含了基于 Modern Minimalist 设计规范创建的所有交互式 HTML Demo。

## 📁 目录结构

```
demo/
├── index.html                    # Demo 索引页面（从这里开始）
├── dashboard.html                # 首页 Demo
├── convert.html                  # 格式转换页面 Demo
├── compress.html                 # 视频压缩页面 Demo
├── queue.html                    # 任务队列页面 Demo
├── settings.html                 # 设置页面 Demo
├── component-taskcard.html       # 任务卡片组件 Demo
├── component-filelist.html       # 文件列表组件 Demo
├── component-mediainfo.html      # 媒体信息组件 Demo
├── component-progressbar.html    # 进度条组件 Demo
├── component-button.html         # 按钮组件 Demo
├── component-forms.html          # 表单组件 Demo
├── component-modal.html          # 模态框组件 Demo
└── component-toast.html          # 通知组件 Demo
```

## 🚀 快速开始

### 方法一：使用索引页面（推荐）

在浏览器中打开 `index.html`，这是一个精美的 Demo Gallery，可以快速访问所有 Demo。

```bash
# macOS
open docs/design/modern/demo/index.html

# Linux
xdg-open docs/design/modern/demo/index.html

# Windows
start docs/design/modern/demo/index.html
```

### 方法二：直接打开单个 Demo

每个 HTML 文件都是独立的，可以直接在浏览器中打开，无需构建或服务器。

```bash
# 查看首页 Demo
open docs/design/modern/demo/dashboard.html

# 查看任务卡片组件 Demo
open docs/design/modern/demo/component-taskcard.html
```

## 📄 页面 Demo (5个)

### 1. 首页 (dashboard.html)
- **内容**：任务统计卡片、快速操作入口、最近任务列表
- **交互**：主题切换、导航高亮、实时进度动画、shimmer 效果
- **文件大小**：23 KB

### 2. 格式转换 (convert.html)
- **内容**：文件上传区、文件列表（可展开 MediaInfo）、输出格式选择、快速预设、高级设置
- **交互**：拖放上传、文件展开/折叠、预设选择、折叠面板
- **文件大小**：34 KB

### 3. 视频压缩 (compress.html)
- **内容**：文件上传、压缩模式选择、6个预设按钮、CRF 滑块、预估输出信息
- **交互**：Radio 切换、滑块拖动（实时更新估算值）、预设按钮选择
- **文件大小**：30 KB

### 4. 任务队列 (queue.html)
- **内容**：队列状态栏、筛选器、5个不同状态的任务卡片
- **交互**：实时进度更新、shimmer 动画、边框脉冲、操作按钮
- **文件大小**：26 KB
- **特色**：进度条自动更新模拟

### 5. 设置 (settings.html)
- **内容**：FFmpeg 配置、主题选择、任务设置、文件设置
- **交互**：主题切换（实时生效）、复选框、下拉菜单、输入验证
- **文件大小**：25 KB

## 🧩 组件 Demo (8个)

### 1. TaskCard (component-taskcard.html)
展示 6 种任务状态：Pending、Running、Paused、Completed、Failed、Cancelled
- **动画**：旋转加载器、shimmer 进度条、边框脉冲、scale-in（完成）、shake（失败）
- **文件大小**：14 KB

### 2. FileList (component-filelist.html)
文件上传器 + 文件列表（带展开/折叠）
- **交互**：拖放上传（3种状态）、展开查看 MediaInfo、删除文件
- **文件大小**：20 KB

### 3. MediaInfo (component-mediainfo.html)
3个示例场景：1080p视频、4K 5.1音频、纯音频
- **布局**：网格布局、monospace 字体
- **文件大小**：11 KB

### 4. ProgressBar (component-progressbar.html)
静态进度条、Shimmer 动画、不确定进度条、交互式模拟
- **动画**：2s shimmer、1.5s indeterminate、300ms 宽度过渡
- **文件大小**：16 KB

### 5. Button (component-button.html)
5种变体 × 3种尺寸 = 15个组合，加上所有状态和图标按钮
- **变体**：Primary、Secondary、Ghost、Destructive、Icon
- **文件大小**：25 KB

### 6. Form Controls (component-forms.html)
Input、Select、Radio、Checkbox、Slider 全套表单组件
- **交互**：焦点状态、错误验证、滑块拖动、单选/复选
- **文件大小**：27 KB

### 7. Modal (component-modal.html)
3种对话框：确认对话框、错误对话框、表单对话框
- **动画**：scale + fade + slide (200ms 进入、150ms 退出)
- **交互**：点击遮罩/X/Escape 关闭、焦点陷阱
- **文件大小**：19 KB

### 8. Toast (component-toast.html)
4种通知类型：Success、Error、Warning、Info
- **动画**：slide-in from right (300ms)、slide-out (200ms)
- **交互**：自动消失（4s）、hover 暂停、手动关闭、堆叠
- **文件大小**：13 KB

## ✨ 设计系统特性

所有 Demo 完全遵循以下设计文档：

### 1. **颜色系统** (overview.md, implementation-guide.md)
- CSS 自定义属性（CSS Variables）
- 浅色/深色主题
- 语义化颜色（primary、success、warning、error）

### 2. **排版系统** (overview.md)
- 字体：Inter Variable、JetBrains Mono
- 字号：Display (40px)、H1-H3、Body、Caption、Micro
- 行高和字间距

### 3. **间距系统** (pages-layout.md)
- 4px 基础单位
- --space-1 (4px) 到 --space-24 (96px)

### 4. **动画系统** (animation-motion.md)
- 持续时间：instant (100ms)、fast (150ms)、normal (200ms)、medium (300ms)、slow (400ms)
- 缓动函数：ease-out、ease-in-out、bounce、smooth
- GPU 加速（transform、opacity）

### 5. **组件规范** (components-specification.md)
- 所有组件尺寸、内边距、边框、阴影严格遵循规范
- 所有状态（default、hover、active、disabled、focus）完整实现

### 6. **交互模式** (interaction-patterns.md)
- 所有用户交互都有即时视觉反馈
- 键盘导航支持
- 无障碍访问（ARIA）

## 🎯 使用场景

### 对于设计师
- **视觉参考**：查看完整的设计系统在实际应用中的效果
- **交互设计**：体验所有微交互和动画效果
- **颜色/间距验证**：确认设计标记（design tokens）的实际效果

### 对于开发者
- **实现参考**：每个 Demo 都包含完整的 HTML/CSS/JS 实现
- **组件规格**：精确的尺寸、颜色、动画参数
- **代码示例**：可以直接复制样式和结构到 React 组件中

### 对于项目经理/产品
- **功能演示**：向利益相关者展示产品的视觉设计
- **用户流程**：理解完整的用户交互流程
- **质量标准**：建立视觉和交互的质量基准

## 🛠️ 技术细节

### 技术栈
- **纯 HTML/CSS/JavaScript**：无需构建工具
- **Tailwind CSS CDN**：使用 CDN 版本，配置内联
- **Lucide Icons CDN**：图标库
- **无依赖**：每个文件完全独立

### 浏览器兼容性
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 支持深色模式（prefers-color-scheme）
- 支持减少动效模式（prefers-reduced-motion）

### 文件大小
- **总计**：约 308 KB（13个文件）
- **平均**：23.7 KB/文件
- **最大**：convert.html (34 KB)
- **最小**：component-mediainfo.html (11 KB)

## 📝 开发注意事项

### 将 Demo 转换为 React 组件

1. **提取样式**
   ```tsx
   // 将内联 Tailwind 类名转换为组件类名
   <div className="p-6 rounded-lg bg-surface-raised border border-border-light shadow-sm">
   ```

2. **使用 CSS 变量**
   ```css
   /* 所有 CSS 变量已在 index.css 中定义 */
   background: hsl(var(--background-primary));
   ```

3. **动画**
   ```tsx
   // 使用 Framer Motion 或 CSS transitions
   import { motion } from 'framer-motion';

   <motion.div
     initial={{ opacity: 0, y: 10 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
   >
   ```

4. **状态管理**
   ```tsx
   // Demo 中的交互逻辑可以直接转换为 React state
   const [isExpanded, setIsExpanded] = useState(false);
   ```

### 自定义和扩展

所有 Demo 都可以修改和扩展：

1. **修改颜色**：编辑 CSS 变量定义
2. **添加状态**：复制现有状态代码并修改
3. **调整动画**：修改 transition 和 animation 参数
4. **响应式**：已包含基本响应式支持，可进一步优化

## 🔗 相关文档

- `../overview.md` - 设计哲学和目标
- `../pages-layout.md` - 页面布局详细规范
- `../components-specification.md` - 组件详细规范
- `../interaction-patterns.md` - 交互模式和流程
- `../animation-motion.md` - 动画和动效指南
- `../implementation-guide.md` - 开发实施指南

## 📅 更新日志

### 2025-10-04
- ✅ 创建所有 13 个 Demo HTML 文件
- ✅ 创建索引页面 (index.html)
- ✅ 创建 README 文档
- ✅ 所有 Demo 完全遵循设计规范
- ✅ 所有交互和动画完整实现

## 💡 反馈和贡献

如果发现任何设计不一致或需要改进的地方，请参考设计文档并提出修改建议。

---

**总结**：这些 Demo 是设计系统的"活文档"，展示了所有设计决策在实际应用中的效果。开发时请严格按照 Demo 中的规范实现，确保最终产品与设计 100% 一致。
