# FFmpeg GUI 交互模式

本文档详细描述了 FFmpeg GUI 应用中所有用户交互模式、流程和行为规范。

---

## 目录

1. [文件处理流程](#1-文件处理流程)
2. [任务创建流程](#2-任务创建流程)
3. [任务管理交互](#3-任务管理交互)
4. [实时进度更新](#4-实时进度更新)
5. [错误处理和验证](#5-错误处理和验证)
6. [键盘快捷键](#6-键盘快捷键)
7. [无障碍访问](#7-无障碍访问)
8. [加载状态](#8-加载状态)
9. [空状态](#9-空状态)
10. [响应式行为](#10-响应式行为)

---

## 1. 文件处理流程

### 1.1 文件选择方式

#### 方式一：拖放（Drag & Drop）

**交互流程：**

1. **用户拖动文件到上传区域**
   - 上传区域边框变色：`--border-medium` → `--primary-500`
   - 背景颜色变化：`--background-secondary` → `--primary-50`
   - 过渡时间：200ms

2. **文件在上传区域上方悬停**
   - 边框样式从虚线变为实线
   - 背景颜色加深：`--primary-50` → `--primary-100`
   - 轻微缩放效果：scale(1.02)
   - 文字提示变为："释放以添加文件"

3. **用户释放文件**
   - 立即触发文件添加逻辑
   - 上传区域恢复默认状态
   - 文件列表显示新添加的文件
   - 如果需要获取媒体信息，显示加载状态

**边界情况：**
- **不支持的文件格式：**显示 Toast 错误提示："不支持的文件格式: .xyz"
- **文件过大（>10GB）：**显示警告 Toast："文件过大,可能处理时间较长"
- **重复文件：**显示确认对话框："文件已存在,是否替换?"

#### 方式二：点击选择（Click to Browse）

**交互流程：**

1. **用户点击"点击选择文件"按钮**
   - 按钮按压效果：scale(0.98)
   - 触发系统文件选择对话框

2. **系统文件选择器打开**
   - 过滤器设置为支持的文件格式
   - 允许多选（multiple: true）

3. **用户选择文件并确认**
   - 对话框关闭
   - 文件添加到列表
   - 如果需要获取媒体信息，显示加载状态

4. **用户取消选择**
   - 对话框关闭
   - 无任何变化

**代码实现：**

```tsx
const handleSelectFiles = async () => {
  try {
    // 调用 Electron API 打开文件选择器
    const result = await window.electronAPI.file.selectFiles({
      filters: [
        { name: '视频文件', extensions: ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv', 'webm'] },
        { name: '音频文件', extensions: ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'] },
        { name: '所有文件', extensions: ['*'] }
      ],
      properties: ['openFile', 'multiSelections']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      // 处理选择的文件
      handleFilesSelected(result.filePaths);
    }
  } catch (error) {
    toast.error('文件选择失败', {
      description: error instanceof Error ? error.message : '未知错误'
    });
  }
};
```

### 1.2 文件列表管理

#### 添加文件

- **单个文件：**立即添加到列表底部
- **多个文件：**按选择顺序添加
- **添加动画：**新文件从右侧滑入，淡入效果（300ms）

#### 移除文件

**交互流程：**

1. **用户点击删除按钮（X）**
   - 按钮悬停时变红色
   - 点击时无需确认（轻量操作）

2. **文件从列表移除**
   - 淡出动画（200ms）
   - 高度折叠动画（300ms ease）
   - 其他文件平滑上移填补空隙

**批量删除：**
- 当前不支持批量删除
- 未来可考虑添加多选功能（Checkbox）

#### 查看文件详情

**交互流程：**

1. **用户点击展开按钮（ChevronRight）**
   - 图标旋转 90°（ChevronRight → ChevronDown）
   - 旋转动画：200ms ease

2. **媒体信息展开**
   - 高度从 0 展开到 auto（max-height 过渡，300ms）
   - 内容淡入（opacity 0 → 1，200ms，延迟 100ms）
   - 顶部边框线淡入

3. **用户再次点击折叠**
   - 图标旋转回 0°（ChevronDown → ChevronRight）
   - 内容淡出并折叠

**获取媒体信息：**

```tsx
useEffect(() => {
  const fetchMediaInfo = async () => {
    if (!file.path) return;

    try {
      setLoading(true);
      const info = await window.electronAPI.ffmpeg.getMediaInfo(file.path);
      setMediaInfo(info);
    } catch (error) {
      console.error('获取媒体信息失败:', error);
      toast.error('无法获取文件信息', {
        description: '文件可能已损坏或格式不受支持'
      });
    } finally {
      setLoading(false);
    }
  };

  fetchMediaInfo();
}, [file.path]);
```

### 1.3 文件重新排序

**当前状态：**不支持拖放重新排序

**未来实现（可选）：**

1. **拖动手柄：**每个文件项左侧添加拖动图标（GripVertical）
2. **拖动时：**
   - 被拖动项：opacity: 0.5，跟随鼠标移动
   - 其他项：为拖动项留出空间，平滑移动
3. **释放时：**
   - 被拖动项插入新位置
   - 列表重新排序
   - 所有项平滑过渡到最终位置

---

## 2. 任务创建流程

### 2.1 格式转换流程

**完整流程：**

```
[选择文件] → [选择格式] → [配置选项] → [开始转换] → [任务加入队列]
```

#### 步骤 1：选择文件

- 通过拖放或点击选择添加文件
- 至少需要一个文件才能继续
- 文件列表显示已选择的文件

**验证：**
- 如果没有选择文件，"开始转换"按钮禁用
- 禁用状态：透明度 0.6，光标 not-allowed

#### 步骤 2：选择输出格式

**交互：**

1. **点击格式下拉菜单**
   - 下拉面板展开（300ms slide-down 动画）
   - 显示常用格式列表：MP4, WebM, AVI, MKV, MOV, FLV, WMV
   - 每个格式项悬停时高亮

2. **选择格式**
   - 格式项显示 Check 图标
   - 下拉面板关闭
   - 触发器显示选中的格式

#### 步骤 3：选择快速预设（可选）

**预设按钮组交互：**

1. **默认状态：**无预设选中（自定义配置）

2. **点击预设按钮：**
   - 按钮边框变色：`--border-light` → `--primary-600`
   - 背景变色：transparent → `--primary-50`
   - 其他预设按钮取消选中
   - 自动填充对应的编解码器、码率、分辨率

3. **预设内容：**
   - **Web 优化：**H.264 + AAC, 中等码率, 1080p
   - **高质量：**H.265 + AAC, 高码率, 原始分辨率
   - **快速转换：**H.264 (ultrafast), 原始分辨率
   - **移动设备：**H.264 + AAC, 较低码率, 720p
   - **社交媒体：**H.264 + AAC, 优化码率, 1080p

4. **修改预设参数：**
   - 如果用户手动修改任何参数，预设按钮取消选中状态

#### 步骤 4：高级设置（可选）

**折叠面板交互：**

1. **点击"高级设置"标题栏**
   - 右侧箭头图标旋转 180°（ChevronDown）
   - 内容展开（300ms ease）

2. **展开内容显示：**
   - 视频编解码器选择
   - 视频码率输入
   - 分辨率选择
   - 帧率选择
   - 音频编解码器选择
   - 音频码率选择
   - 音频采样率选择

3. **折叠：**
   - 再次点击标题栏
   - 箭头旋转回 0°
   - 内容折叠（200ms ease）

#### 步骤 5：开始转换

**交互流程：**

1. **用户点击"开始转换"按钮**
   - 按钮按压效果：scale(0.98)
   - 按钮禁用（防止重复点击）
   - 按钮文字变为"正在添加..."
   - 显示加载图标（Loader2 旋转）

2. **后台处理：**
   - 构建 FFmpeg 命令
   - 调用 IPC 添加任务
   - 任务添加到队列

3. **成功反馈：**
   - 显示 Success Toast："任务已添加到队列"
   - 按钮恢复可用状态
   - 可选：清空文件列表或保留以便批量转换
   - 可选：自动跳转到任务队列页面

4. **失败反馈：**
   - 显示 Error Toast：具体错误消息
   - 按钮恢复可用状态
   - 保留所有配置，允许用户修改后重试

**批量转换：**

- 如果选择了多个文件，为每个文件创建一个任务
- 显示进度提示："正在添加任务 (3/5)..."
- 全部添加完成后显示："已添加 5 个任务到队列"

### 2.2 视频压缩流程

**完整流程：**

```
[选择文件] → [选择压缩模式] → [选择预设/调整参数] → [开始压缩] → [任务加入队列]
```

#### 压缩模式选择

**两种模式：**

1. **CRF 质量控制**（默认）
   - 使用滑块选择 CRF 值（18-32）
   - 18：高质量，文件较大
   - 23：推荐，平衡质量和大小
   - 32：高压缩，质量较低

2. **目标文件大小**
   - 输入目标大小（10-500 MB）
   - 系统自动计算所需码率
   - 显示预估质量等级

**模式切换交互：**

1. **点击 Radio 按钮**
   - 外圆边框变色：`--border-medium` → `--primary-600`
   - 内圆淡入：scale(0) → scale(1)，150ms
   - 对应的配置区域显示/隐藏

2. **配置区域切换：**
   - 旧区域淡出并折叠（200ms）
   - 新区域淡入并展开（200ms，延迟 100ms）

#### CRF 滑块交互

**交互流程：**

1. **用户拖动滑块手柄**
   - 手柄放大：scale(1.2)
   - 阴影加深：Level 2 → Level 3
   - 光标变为 grabbing
   - 实时更新数值显示

2. **释放手柄**
   - 手柄恢复原始大小：scale(1)
   - 阴影恢复：Level 2
   - 触发预估大小计算

3. **预估信息更新：**
   - 显示加载状态（shimmer 动画）
   - 调用后台计算预估文件大小
   - 更新预估大小和压缩比
   - 更新动画：数字滚动效果（可选）

#### 压缩预设

**6 种预设：**

1. **极致压缩：**CRF 28-32，最小文件
2. **高质量：**CRF 18-20，接近无损
3. **平衡：**CRF 23，推荐
4. **快速：**使用 veryfast preset
5. **移动端：**720p + 较低码率
6. **Web 优化：**1080p + 中等码率

**预设交互：**与格式转换页面相同

---

## 3. 任务管理交互

### 3.1 任务列表显示

#### 筛选器

**交互流程：**

1. **点击筛选下拉菜单**
   - 展开选项列表
   - 当前选中项显示 Check 图标

2. **选择筛选条件**
   - 全部（默认）
   - 运行中
   - 队列中
   - 已完成
   - 失败
   - 已取消

3. **列表更新**
   - 不符合条件的任务淡出并隐藏（200ms）
   - 符合条件的任务保持显示
   - 列表重新布局（300ms smooth）

#### 排序（未来功能）

- 按添加时间（默认）
- 按文件名
- 按状态
- 按进度

### 3.2 任务操作

#### 暂停任务

**前提条件：**任务状态为 "running"

**交互流程：**

1. **用户点击暂停按钮（Pause 图标）**
   - 按钮按压效果
   - 按钮禁用（防止重复点击）

2. **后台处理：**
   - 调用 IPC 暂停任务
   - FFmpeg 进程暂停

3. **状态更新：**
   - TaskCard 边框变黄色
   - 状态文字："已暂停"
   - 图标变为 Pause（静止）
   - 进度条停止动画
   - 暂停按钮变为恢复按钮（Play 图标）

4. **失败处理：**
   - 显示 Error Toast："暂停失败: 原因"
   - 按钮恢复可用
   - 任务状态不变

#### 恢复任务

**前提条件：**任务状态为 "paused"

**交互流程：**与暂停类似，反向操作

1. 点击恢复按钮（Play 图标）
2. 任务状态变为 "running"
3. 进度条恢复动画
4. 恢复按钮变回暂停按钮

#### 取消任务

**前提条件：**任务状态为 "running"、"paused" 或 "pending"

**交互流程：**

1. **用户点击取消按钮（X 图标）**
   - 按钮悬停时变红色
   - 点击时无需确认（轻量操作）

2. **后台处理：**
   - 调用 IPC 取消任务
   - FFmpeg 进程终止

3. **状态更新：**
   - TaskCard 边框变灰色
   - 状态文字："已取消"
   - 图标变为 X（静止）
   - 进度条移除
   - 所有操作按钮隐藏

4. **任务保留：**
   - 已取消的任务保留在列表中
   - 可通过"清空已完成"批量删除（未来可能包括已取消）

#### 重试任务

**前提条件：**任务状态为 "failed"

**交互流程：**

1. **用户点击重试按钮（RotateCcw 图标）**
   - 图标顺时针旋转一圈（360°，500ms）

2. **后台处理：**
   - 获取原任务的命令和参数
   - 创建新任务（新的任务 ID）
   - 添加到队列

3. **成功反馈：**
   - 显示 Success Toast："任务已重新添加到队列"
   - 新任务出现在列表顶部（淡入动画）

#### 批量操作

**全部暂停（未来功能）：**

- 按钮位置：队列状态栏右侧
- 点击后暂停所有运行中的任务
- 显示确认对话框（如果任务数 > 3）

**清空已完成：**

**交互流程：**

1. **用户点击"清空已完成"按钮**
   - 如果已完成任务 > 10，显示确认对话框

2. **确认对话框：**
   ```
   清空已完成任务？

   将删除 15 个已完成的任务记录，此操作不可撤销。

   [取消]  [确认删除]
   ```

3. **用户确认：**
   - 对话框关闭
   - 已完成任务逐个淡出并从列表移除（stagger 动画，每个延迟 50ms）
   - 显示 Success Toast："已清空 15 个已完成任务"

4. **用户取消：**
   - 对话框关闭
   - 无任何变化

### 3.3 并发控制

**最大并发任务数调整：**

**交互流程：**

1. **点击并发数下拉菜单**
   - 展开选项：1、2、3、4

2. **选择新的并发数**
   - 立即生效
   - 如果当前运行任务数 > 新并发数，已运行任务继续，新任务等待
   - 如果当前运行任务数 < 新并发数，自动从队列启动新任务

3. **反馈：**
   - 队列状态栏实时更新
   - 如果启动了新任务，显示 Info Toast："已启动新任务"

---

## 4. 实时进度更新

### 4.1 进度信息来源

**FFmpeg stderr 输出解析：**

```
frame=  123 fps= 30 q=28.0 size=    1024kB time=00:00:05.00 bitrate=1500.0kbits/s speed= 1.5x
```

**提取的信息：**
- `frame`：当前帧数
- `fps`：实时帧率
- `size`：已输出文件大小
- `time`：已处理时长
- `bitrate`：当前码率
- `speed`：处理速度（倍速）
- `percent`：计算得出的进度百分比

### 4.2 进度显示

#### 进度条

- **更新频率：**每 500ms 更新一次（节流）
- **动画：**宽度平滑过渡（300ms ease-out）
- **光晕效果：**持续播放 shimmer 动画

#### 进度指标

**显示内容：**

```
速度: 1.8x  |  ETA: 5分32秒  |  FPS: 54
```

- **速度：**处理倍速，颜色根据速度变化
  - < 0.5x：红色（`--error-600`）
  - 0.5x - 1.0x：黄色（`--warning-600`）
  - > 1.0x：绿色（`--success-600`）

- **ETA：**预计剩余时间
  - 基于当前速度和已完成进度计算
  - 格式：秒 / 分秒 / 时分

- **FPS：**实时帧率
  - 显示当前编码帧率
  - 颜色：`--text-secondary`

**更新频率：**每 1 秒更新一次

### 4.3 进度更新机制

**IPC 事件监听：**

```tsx
useEffect(() => {
  const unsubscribe = window.electronAPI.on(
    IPC_CHANNELS.TASK_PROGRESS,
    ({ taskId, progress, progressInfo }) => {
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, progress, progressInfo }
            : task
        )
      );
    }
  );

  return () => unsubscribe();
}, []);
```

**优化策略：**

1. **节流（Throttle）：**前端节流更新，避免过于频繁的重渲染
2. **批量更新：**如果多个任务同时更新，批量处理
3. **虚拟滚动：**任务列表过长时使用虚拟滚动（未来优化）

---

## 5. 错误处理和验证

### 5.1 表单验证

#### 实时验证 vs 提交时验证

**实时验证（Blur 验证）：**

- **触发时机：**用户离开输入框（onBlur）
- **适用场景：**
  - 码率输入（必须是正整数）
  - 分辨率输入（宽度和高度）
  - 目标文件大小（范围验证）

**提交时验证：**

- **触发时机：**用户点击"开始转换/压缩"
- **适用场景：**
  - 文件是否已选择
  - 输出格式是否已选择
  - 必填字段检查

#### 验证错误显示

**输入框错误状态：**

```tsx
<Input
  error={!!error}
  value={value}
  onChange={handleChange}
  onBlur={handleBlur}
/>
{error && (
  <p className="text-xs text-error-600 mt-1 flex items-center gap-1">
    <AlertCircle className="w-3 h-3" />
    {error}
  </p>
)}
```

**错误样式：**
- 输入框边框变红：`--error-500`
- 外阴影：`--error-500` 20% opacity
- 错误消息：12px，`--error-600`，图标 AlertCircle

**错误消息示例：**
- "请输入有效的码率（1000-50000 kbps）"
- "分辨率宽度必须是 8 的倍数"
- "请选择至少一个文件"

### 5.2 任务执行错误

#### FFmpeg 错误

**常见错误类型：**

1. **不支持的编解码器**
   - 错误消息："不支持的视频编解码器: xyz"
   - 建议："请尝试使用 H.264 或 H.265"

2. **文件损坏**
   - 错误消息："无法读取输入文件"
   - 建议："文件可能已损坏，请检查源文件"

3. **磁盘空间不足**
   - 错误消息："写入输出文件失败"
   - 建议："请检查磁盘剩余空间"

4. **权限错误**
   - 错误消息："无权限访问输出目录"
   - 建议："请选择其他输出目录或授予权限"

**错误显示：**

- TaskCard 状态变为 "failed"
- 显示简短错误消息（一行）
- 点击"查看详情"展开完整错误日志

**错误日志查看：**

```
┌─────────────────────────────────────────┐
│ ❌ 任务失败                              │
│                                         │
│ 不支持的视频编解码器: xyz               │
│                                         │
│ [查看详情]                              │
└─────────────────────────────────────────┘

点击"查看详情"后展开：

┌─────────────────────────────────────────┐
│ ❌ 任务失败                              │
│                                         │
│ 不支持的视频编解码器: xyz               │
│                                         │
│ 完整日志：                              │
│ ┌─────────────────────────────────────┐ │
│ │ ffmpeg version 6.0                  │ │
│ │ Unknown encoder 'xyz'               │ │
│ │ ...                                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [重试] [复制日志]                       │
└─────────────────────────────────────────┘
```

### 5.3 网络和系统错误

**FFmpeg 未安装：**

**检测时机：**
- 应用启动时
- 用户进入设置页面时

**错误提示（Modal）：**

```
┌────────────────────────────────────────┐
│  ⚠️ FFmpeg 未检测到                    │
│                                        │
│  FFmpeg 是视频处理的核心工具，         │
│  应用无法正常工作。                    │
│                                        │
│  [自动下载] [手动配置] [了解更多]      │
└────────────────────────────────────────┘
```

**自动下载流程：**

1. 点击"自动下载"
2. 显示下载进度条
3. 下载完成后自动配置路径
4. 显示成功提示："FFmpeg 安装成功"

**手动配置流程：**

1. 点击"手动配置"
2. 跳转到设置页面
3. 用户选择 FFmpeg 可执行文件路径
4. 自动验证是否有效

---

## 6. 键盘快捷键

### 6.1 全局快捷键

| 快捷键 | 功能 | 作用域 |
|--------|------|--------|
| `Cmd/Ctrl + ,` | 打开设置 | 全局 |
| `Cmd/Ctrl + Q` | 退出应用 | 全局 |
| `Cmd/Ctrl + T` | 切换主题 | 全局 |
| `Cmd/Ctrl + 1` | 跳转到首页 | 全局 |
| `Cmd/Ctrl + 2` | 跳转到转换页 | 全局 |
| `Cmd/Ctrl + 3` | 跳转到压缩页 | 全局 |
| `Cmd/Ctrl + 4` | 跳转到队列页 | 全局 |

### 6.2 页面快捷键

**转换/压缩页面：**

| 快捷键 | 功能 |
|--------|------|
| `Cmd/Ctrl + O` | 打开文件选择器 |
| `Enter` | 开始转换/压缩（焦点在按钮上时） |
| `Escape` | 取消操作/关闭模态框 |

**队列页面：**

| 快捷键 | 功能 |
|--------|------|
| `Space` | 暂停/恢复选中的任务 |
| `Delete/Backspace` | 取消选中的任务 |
| `Cmd/Ctrl + A` | 全选任务 |
| `Cmd/Ctrl + Shift + C` | 清空已完成任务 |

### 6.3 快捷键提示

**显示方式：**
- 按下 `Cmd/Ctrl + /` 显示快捷键面板
- 面板以模态框形式显示
- 按 `Escape` 或点击遮罩层关闭

**快捷键面板内容：**

```
┌────────────────────────────────────────┐
│  ⌨️  键盘快捷键                         │
│                                        │
│  导航                                  │
│  Cmd + 1    首页                       │
│  Cmd + 2    转换                       │
│  Cmd + 3    压缩                       │
│  Cmd + 4    队列                       │
│                                        │
│  操作                                  │
│  Cmd + O    打开文件                   │
│  Enter      确认操作                   │
│  Escape     取消操作                   │
│                                        │
│  队列管理                              │
│  Space      暂停/恢复任务              │
│  Delete     取消任务                   │
│                                        │
│  其他                                  │
│  Cmd + ,    设置                       │
│  Cmd + T    切换主题                   │
└────────────────────────────────────────┘
```

---

## 7. 无障碍访问

### 7.1 键盘导航

**Tab 键顺序：**

遵循视觉阅读顺序（从上到下，从左到右）：

**转换页面 Tab 顺序示例：**
1. 文件上传区域（可点击）
2. 已选择的文件列表项（每个文件的展开和删除按钮）
3. 输出格式下拉菜单
4. 快速预设按钮组（从左到右）
5. 高级设置折叠按钮
6. 高级设置内的所有输入控件（如果展开）
7. 开始转换按钮

**焦点指示器：**

所有可交互元素必须有清晰的焦点指示：

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-primary-500
focus-visible:ring-offset-2
```

**跳过导航链接（Skip Link）：**

在页面顶部添加隐藏的"跳过导航"链接：

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md"
>
  跳到主内容
</a>
```

### 7.2 屏幕阅读器支持

**ARIA 标签：**

**按钮：**
```tsx
<button aria-label="暂停任务">
  <Pause />
</button>
```

**进度条：**
```tsx
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="任务进度"
>
  {/* 进度条内容 */}
</div>
```

**状态更新通知（Live Region）：**

```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>
```

**示例：**
- 任务开始："任务已开始，当前进度 0%"
- 任务完成："任务已完成，用时 8 分 12 秒"
- 任务失败："任务失败，错误: 不支持的编解码器"

**表单标签关联：**

```tsx
<label htmlFor="bitrate" className="text-sm font-medium">
  视频码率
</label>
<input
  id="bitrate"
  type="number"
  aria-describedby="bitrate-help"
/>
<span id="bitrate-help" className="text-xs text-text-secondary">
  推荐范围: 1000-10000 kbps
</span>
```

### 7.3 颜色对比度

**WCAG 2.1 AA 标准：**

- **正常文本（< 18px）：**对比度 ≥ 4.5:1
- **大文本（≥ 18px 或 14px bold）：**对比度 ≥ 3:1
- **UI 组件：**对比度 ≥ 3:1

**验证工具：**
- Chrome DevTools Lighthouse
- WebAIM Contrast Checker

**颜色不作为唯一信息载体：**

❌ 错误做法：
- 仅用红色表示错误，绿色表示成功

✅ 正确做法：
- 红色 + X 图标表示错误
- 绿色 + ✓ 图标表示成功
- 文字描述："任务失败" / "任务完成"

---

## 8. 加载状态

### 8.1 骨架屏（Skeleton）

**使用场景：**
- 首次加载任务列表
- 获取媒体信息时
- 加载设置页面时

**任务列表骨架屏：**

```tsx
function TaskSkeleton() {
  return (
    <div className="w-full p-6 rounded-lg bg-surface-raised border border-border-light">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="w-5 h-5 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>
      <Skeleton className="h-2 w-full" />
    </div>
  );
}
```

**骨架屏动画：**

```css
@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.skeleton {
  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background: linear-gradient(
    90deg,
    var(--background-tertiary) 0%,
    var(--background-secondary) 50%,
    var(--background-tertiary) 100%
  );
  background-size: 200% 100%;
}
```

### 8.2 加载指示器

**按钮加载状态：**

```tsx
<Button disabled={loading}>
  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
  {loading ? '正在处理...' : '开始转换'}
</Button>
```

**全页加载（初始化）：**

```tsx
{loading && (
  <div className="fixed inset-0 flex items-center justify-center bg-background-primary/80 backdrop-blur-sm z-50">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
      <p className="text-lg font-medium text-text-primary">加载中...</p>
      <p className="text-sm text-text-secondary mt-2">正在初始化应用</p>
    </div>
  </div>
)}
```

### 8.3 进度加载（确定性）

**文件上传进度：**

```tsx
{uploading && (
  <div className="fixed bottom-4 right-4 w-80 p-4 rounded-lg bg-surface-raised shadow-lg border border-border-light">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium">正在上传文件</span>
      <span className="text-xs text-text-secondary">{uploadProgress}%</span>
    </div>
    <ProgressBar percent={uploadProgress} animated />
  </div>
)}
```

---

## 9. 空状态

### 9.1 任务队列空状态

```
┌────────────────────────────────────────┐
│                                        │
│             📋                         │
│          暂无任务                       │
│                                        │
│   前往"转换"或"压缩"页面添加任务        │
│                                        │
│   ┌──────────┐  ┌──────────┐          │
│   │ 去转换   │  │ 去压缩   │          │
│   └──────────┘  └──────────┘          │
│                                        │
└────────────────────────────────────────┘
```

**样式规范：**
- 容器内边距：`--space-12`（48px）
- 图标尺寸：64px
- 图标颜色：`--text-tertiary`
- 主文本：18px，font-semibold，`--text-primary`
- 描述文本：14px，`--text-secondary`
- 按钮间距：`--space-4`（16px）

### 9.2 文件列表空状态

**状态：**未选择任何文件

**显示：**仅显示 FileUploader 组件，不显示"已选择文件"标题和列表

### 9.3 搜索无结果（未来功能）

```
┌────────────────────────────────────────┐
│           🔍                           │
│      未找到匹配的任务                   │
│                                        │
│   尝试使用其他关键词搜索                │
│   或清除筛选条件查看所有任务            │
│                                        │
│   [清除筛选]                           │
└────────────────────────────────────────┘
```

---

## 10. 响应式行为

### 10.1 窗口大小调整

**断点行为：**

**< 1024px（平板）：**
- 转换/压缩页面：两栏变单列
- 快速预设：3列变2列
- 侧边栏：宽度缩减至 200px

**< 768px（手机）：**
- 侧边栏：变为覆盖层（Overlay），默认隐藏
- 添加汉堡菜单按钮（左上角）
- 快速预设：2列变1列
- 任务卡片：操作按钮变为下拉菜单

**< 640px（小手机）：**
- 所有内边距减半
- 字体适度缩小
- 统计卡片：单列堆叠

### 10.2 鼠标 vs 触摸

**触摸设备优化：**

- **最小触摸目标：**44px × 44px（WCAG 2.1 AAA）
- **间距增加：**触摸设备上按钮间距增加至 `--space-3`（12px）
- **悬停效果：**触摸设备不显示 hover 效果（使用 @media (hover: hover)）
- **长按菜单：**触摸设备上长按显示上下文菜单

**检测触摸设备：**

```tsx
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

<button
  className={cn(
    "h-10 px-6",
    !isTouchDevice && "hover:bg-primary-700"
  )}
>
  按钮
</button>
```

---

## 总结

本文档定义了 FFmpeg GUI 应用的所有关键交互模式。实施时请确保：

- [ ] 所有交互都有明确的视觉反馈
- [ ] 错误处理友好且提供解决方案
- [ ] 键盘导航完整且顺序合理
- [ ] 符合 WCAG 2.1 AA 无障碍标准
- [ ] 加载状态清晰可见
- [ ] 空状态提供明确的指引

参考其他设计文档：
- `animation-motion.md` - 动画和动效详细规范
- `implementation-guide.md` - 开发实施指南
