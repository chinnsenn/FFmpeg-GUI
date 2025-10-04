# Task 01: 视觉回归测试

## 任务目标

对比 HTML Demo 和实际应用,确保所有组件和页面的视觉效果 100% 一致。

## 参考文档

- `docs/design/modern/demo/*.html` - 所有 HTML Demo
- 所有已实现的组件和页面

## 实施步骤

### 步骤 1: 创建视觉对比清单

```markdown
# 视觉对比清单

## 核心组件
- [ ] Button - 所有变体和尺寸
- [ ] Input - 所有状态
- [ ] Select - 下拉菜单样式
- [ ] Radio & Checkbox - 选中状态
- [ ] Slider - 滑块样式
- [ ] Card - 所有阴影变体
- [ ] ProgressBar - shimmer 动画
- [ ] Modal - 遮罩和动画
- [ ] Toast - 所有类型

## 业务组件
- [ ] TaskCard - 6 种状态
- [ ] FileUploader - 3 种状态
- [ ] FileList - 展开/折叠
- [ ] MediaInfo - 网格布局
- [ ] ConvertConfig - 表单布局
- [ ] CompressConfig - 滑块和估算

## 页面
- [ ] Dashboard - 整体布局
- [ ] Convert - 3 列布局
- [ ] Compress - 2 列布局
- [ ] Queue - 任务列表
- [ ] Settings - 表单布局

## 主题
- [ ] 浅色主题所有颜色
- [ ] 深色主题所有颜色
- [ ] 主题切换过渡
```

### 步骤 2: 逐项对比

```bash
# 对比方法
1. 打开 HTML Demo
2. 打开实际应用
3. 截图或并排对比
4. 记录差异
5. 修复差异
6. 重新验证
```

### 步骤 3: 记录差异

```markdown
# 视觉差异报告

## 组件名称
- **差异**: 描述具体差异
- **原因**: 分析原因
- **修复**: 修复方案
- **状态**: ✅ 已修复 / ⏳ 进行中 / ❌ 未修复
```

## 验收标准

- [ ] 所有组件与 HTML Demo 100% 一致
- [ ] 浅色/深色主题都正确
- [ ] 所有状态（hover、active、focus、disabled）都正确
- [ ] 动画效果一致
- [ ] 无视觉 bug

## 预计时间

3-4 小时

---

**优先级**: P0
**依赖**: Plan-01 到 Plan-05 完成
