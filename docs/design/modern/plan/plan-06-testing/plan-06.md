# Plan-06: Testing（测试与优化）

## 阶段概述

对整个设计系统和应用进行全面测试,包括视觉回归、功能测试、性能测试、无障碍测试和跨平台测试,确保高质量交付。

## 目标

1. 视觉回归测试（对比 HTML Demo）
2. 功能测试（转换、压缩、队列管理）
3. 性能测试（动画帧率、渲染性能）
4. 无障碍测试（键盘导航、屏幕阅读器）
5. 跨平台测试（macOS、Windows、Linux）
6. 最终优化和文档

## 参考文档

- `docs/design/modern/demo/*.html` - 视觉基准
- `docs/design/modern/guide/*.md` - 设计规范
- `docs/code-review-report.md` - 代码质量基准

## 任务清单

| 任务 | 描述 | 预计时间 | 优先级 |
|------|------|----------|--------|
| Task 01 | 视觉回归测试 | 3-4 小时 | P0 |
| Task 02 | 功能测试（转换、压缩、队列） | 4-5 小时 | P0 |
| Task 03 | 性能测试（动画帧率、渲染） | 2-3 小时 | P1 |
| Task 04 | 无障碍测试（键盘、屏幕阅读器） | 3-4 小时 | P0 |
| Task 05 | 跨平台测试（macOS/Windows/Linux） | 3-4 小时 | P0 |
| Task 06 | 最终优化和文档 | 3-4 小时 | P1 |

**总计预估时间**：18-24 小时（2.5-3 个工作日）

## 验收标准

### 1. 视觉回归测试

#### 对比工具
- [ ] 使用 Percy、Chromatic 或截图对比
- [ ] 所有组件与 HTML Demo 100% 一致
- [ ] 浅色/深色主题都正确
- [ ] 所有状态（hover、active、focus、disabled）都正确

#### 测试覆盖
- [ ] 所有核心组件（Button、Input、Card、ProgressBar、Modal、Toast）
- [ ] 所有业务组件（TaskCard、FileUploader、FileList、MediaInfo、ConvertConfig、CompressConfig）
- [ ] 所有页面（Dashboard、Convert、Compress、Queue、Settings）

### 2. 功能测试

#### 转换功能
- [ ] 文件上传成功
- [ ] 文件格式检测正确
- [ ] 配置选项保存正确
- [ ] 任务创建成功
- [ ] 进度更新正确
- [ ] 完成后文件可访问
- [ ] 错误处理正确

#### 压缩功能
- [ ] CRF 滑块交互正确
- [ ] 预估计算准确
- [ ] 压缩任务执行成功
- [ ] 输出文件大小符合预期

#### 队列管理
- [ ] 任务添加到队列
- [ ] 并发控制正确（最多 2 个）
- [ ] 暂停/恢复功能正常
- [ ] 取消功能正常
- [ ] 重试功能正常
- [ ] 任务状态同步正确

### 3. 性能测试

#### 动画帧率
- [ ] 所有动画 >= 60fps
- [ ] 无 long tasks (>50ms)
- [ ] shimmer 动画流畅
- [ ] 页面过渡流畅

#### 渲染性能
- [ ] 首次渲染 < 1s
- [ ] 组件重渲染优化（React.memo）
- [ ] 大列表虚拟滚动（如适用）
- [ ] 无内存泄漏

#### Bundle 大小
- [ ] 总 bundle < 2MB（gzip）
- [ ] Code splitting 应用正确
- [ ] Tree shaking 有效

### 4. 无障碍测试

#### 键盘导航
- [ ] Tab 顺序正确
- [ ] 焦点环清晰可见
- [ ] Enter/Space 触发按钮
- [ ] Escape 关闭 Modal/Toast
- [ ] 方向键操作 Select、Slider、Radio

#### 屏幕阅读器
- [ ] 所有交互元素有 label
- [ ] ARIA 属性正确
- [ ] 状态变化有通知
- [ ] 错误消息可读

#### 对比度
- [ ] 所有文本对比度 >= 4.5:1（WCAG AA）
- [ ] 大文本对比度 >= 3:1
- [ ] 深色模式同样符合标准

#### 工具测试
- [ ] axe DevTools 无错误
- [ ] Lighthouse Accessibility >= 90
- [ ] WAVE 无错误

### 5. 跨平台测试

#### macOS
- [ ] 视觉正确（HiDPI 支持）
- [ ] 字体渲染正确
- [ ] 快捷键正常（Cmd+...）
- [ ] 原生菜单集成

#### Windows
- [ ] 视觉正确
- [ ] 字体渲染正确（ClearType）
- [ ] 快捷键正常（Ctrl+...）
- [ ] 任务栏集成

#### Linux
- [ ] 视觉正确
- [ ] 字体渲染正确
- [ ] 快捷键正常
- [ ] 主题适配（GTK）

### 6. 最终优化和文档

#### 代码优化
- [ ] ESLint 无错误
- [ ] TypeScript 无类型错误
- [ ] 代码重复率 < 1%
- [ ] 测试覆盖率 >= 80%

#### 文档更新
- [ ] README.md 更新
- [ ] CHANGELOG.md 记录
- [ ] API 文档完整
- [ ] 组件 Storybook（可选）

## 测试步骤

### 1. 视觉回归测试

```bash
# 使用 Playwright 截图对比
npm run test:visual

# 或手动对比
1. 打开 HTML Demo
2. 打开实际应用
3. 逐一对比每个组件和页面
4. 记录差异并修复
```

### 2. 功能测试

```tsx
// src/renderer/src/__tests__/e2e/convert.test.tsx
describe('Convert workflow', () => {
  it('should complete full convert workflow', async () => {
    render(<App />);

    // 导航到转换页面
    fireEvent.click(screen.getByText('格式转换'));

    // 上传文件
    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });
    const input = screen.getByLabelText('上传文件');
    fireEvent.change(input, { target: { files: [file] } });

    // 选择输出格式
    fireEvent.change(screen.getByLabelText('输出格式'), { target: { value: 'webm' } });

    // 开始转换
    fireEvent.click(screen.getByText('开始转换'));

    // 验证任务创建
    await waitFor(() => {
      expect(screen.getByText('任务已创建')).toBeInTheDocument();
    });

    // 导航到队列页面
    fireEvent.click(screen.getByText('任务队列'));

    // 验证任务在列表中
    expect(screen.getByText('test.mp4')).toBeInTheDocument();
  });
});
```

### 3. 性能测试

```tsx
// src/renderer/src/__tests__/performance/animations.test.tsx
import { renderHook } from '@testing-library/react';

describe('Animation performance', () => {
  it('should maintain 60fps during shimmer animation', async () => {
    const frames: number[] = [];
    let lastTime = performance.now();

    const measureFrame = () => {
      const now = performance.now();
      const fps = 1000 / (now - lastTime);
      frames.push(fps);
      lastTime = now;

      if (frames.length < 60) {
        requestAnimationFrame(measureFrame);
      }
    };

    render(<ProgressBar value={50} shimmer />);
    requestAnimationFrame(measureFrame);

    await waitFor(() => frames.length >= 60, { timeout: 2000 });

    const averageFps = frames.reduce((a, b) => a + b, 0) / frames.length;
    expect(averageFps).toBeGreaterThanOrEqual(55); // 允许 5fps 误差
  });
});
```

### 4. 无障碍测试

```tsx
// src/renderer/src/__tests__/a11y/button.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard accessible', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();

    fireEvent.keyDown(button, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
```

## 输出产物

### 1. 测试报告

```
docs/testing/
├── visual-regression-report.md    # 视觉回归测试报告
├── functional-testing-report.md   # 功能测试报告
├── performance-report.md          # 性能测试报告
├── accessibility-report.md        # 无障碍测试报告
└── cross-platform-report.md       # 跨平台测试报告
```

### 2. 优化清单

```markdown
# docs/testing/optimization-checklist.md

## 代码优化
- [x] 移除未使用的依赖
- [x] Code splitting 应用
- [x] 图片优化（WebP、压缩）
- [x] 字体子集化

## 性能优化
- [x] React.memo 应用
- [x] useMemo/useCallback 优化
- [x] 虚拟滚动（如适用）
- [x] 懒加载（lazy import）

## 无障碍优化
- [x] 焦点管理
- [x] ARIA 属性
- [x] 键盘导航
- [x] 对比度修复
```

### 3. 最终文档

更新以下文档:
- `README.md` - 项目介绍、安装、使用
- `CHANGELOG.md` - 版本变更记录
- `docs/design/modern/implementation-status.md` - 实施状态

## 依赖安装

```bash
# 视觉测试
npm install -D @playwright/test

# 无障碍测试
npm install -D jest-axe @axe-core/react

# 性能测试
npm install -D lighthouse

# E2E 测试（已有 Vitest）
npm install -D @testing-library/react @testing-library/user-event
```

## 注意事项

### 1. 测试环境

确保测试在真实 Electron 环境中运行:

```js
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/renderer/src/__tests__/setup.ts'],
  },
});
```

### 2. Mock Electron API

```tsx
// src/renderer/src/__tests__/setup.ts
global.window.electronAPI = {
  task: {
    add: vi.fn(),
    getAll: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    cancel: vi.fn(),
  },
  ffmpeg: {
    getMediaInfo: vi.fn(),
    detect: vi.fn(),
  },
  // ... 其他 API
};
```

### 3. 持续集成

在 CI/CD 中自动运行测试:

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run test:e2e
```

## 下一步

完成 Plan-06 后,设计系统实施完成,准备发布 v1.0.0 版本。

---

**创建时间**：2025-10-04
**预计完成时间**：2025-10-16
**依赖**：Plan-01 到 Plan-05 完成
**负责人**：fullstack-engineer
