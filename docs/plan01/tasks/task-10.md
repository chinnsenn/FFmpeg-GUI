# Task-10: 文件信息读取和显示

**任务ID**：Task-10 | **阶段**：阶段三 | **难度**：⭐⭐ | **时间**：2天 | **依赖**：Task-09

## 任务目标
使用 FFprobe 读取视频文件元信息并显示。

## 详细需求
- [ ] 集成 FFprobe
- [ ] 读取视频元信息(分辨率、时长、编码等)
- [ ] 创建文件信息显示组件
- [ ] 格式化文件大小和时长

## 核心代码
```typescript
async function getFileInfo(filePath: string) {
  const { stdout } = await execAsync(
    `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`
  );
  return JSON.parse(stdout);
}
```

## 验收标准
- [ ] 能读取视频文件信息
- [ ] 显示格式清晰易读
- [ ] 支持多种视频格式

**任务状态**：待开始
