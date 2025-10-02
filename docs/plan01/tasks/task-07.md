# Task-07: 进度解析器

**任务ID**：Task-07
**所属阶段**：阶段二 - FFmpeg 集成
**难度**：⭐⭐ 中等
**预估时间**：2天
**优先级**：P0
**依赖任务**：Task-06

---

## 任务目标

解析 FFmpeg 输出,提取进度信息(时间、速度、百分比等)。

---

## 详细需求

- [ ] 解析 FFmpeg stderr 输出
- [ ] 提取时间信息(frame, time, speed)
- [ ] 计算进度百分比
- [ ] 解析比特率和速度
- [ ] 处理不同格式的输出

---

## 技术方案

```typescript
// src/main/ffmpeg/parser.ts
export interface FFmpegProgress {
  frame: number;
  fps: number;
  bitrate: string;
  totalSize: number;
  currentTime: number;
  speed: number;
  percent: number;
}

export class FFmpegParser {
  private totalDuration: number = 0;

  setTotalDuration(duration: number) {
    this.totalDuration = duration;
  }

  parseProgress(output: string): FFmpegProgress | null {
    // FFmpeg 输出格式:
    // frame=  123 fps= 45 q=28.0 size=1024kB time=00:00:05.12 bitrate=1638.4kbits/s speed=1.87x

    const frameMatch = output.match(/frame=\s*(\d+)/);
    const fpsMatch = output.match(/fps=\s*(\d+)/);
    const bitrateMatch = output.match(/bitrate=\s*([\d.]+\w+\/s)/);
    const sizeMatch = output.match(/size=\s*(\d+)kB/);
    const timeMatch = output.match(/time=(\d+):(\d+):(\d+\.\d+)/);
    const speedMatch = output.match(/speed=\s*([\d.]+)x/);

    if (!timeMatch) return null;

    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const seconds = parseFloat(timeMatch[3]);
    const currentTime = hours * 3600 + minutes * 60 + seconds;

    const percent = this.totalDuration > 0
      ? (currentTime / this.totalDuration) * 100
      : 0;

    return {
      frame: frameMatch ? parseInt(frameMatch[1]) : 0,
      fps: fpsMatch ? parseInt(fpsMatch[1]) : 0,
      bitrate: bitrateMatch ? bitrateMatch[1] : '0',
      totalSize: sizeMatch ? parseInt(sizeMatch[1]) : 0,
      currentTime,
      speed: speedMatch ? parseFloat(speedMatch[1]) : 1,
      percent: Math.min(percent, 100),
    };
  }

  parseDuration(output: string): number | null {
    // Duration: 00:05:30.25
    const match = output.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (!match) return null;

    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseFloat(match[3]);

    return hours * 3600 + minutes * 60 + seconds;
  }

  parseError(output: string): string | null {
    // 提取错误信息
    if (output.includes('Error') || output.includes('Invalid')) {
      return output.trim();
    }
    return null;
  }
}
```

---

## 验收标准

- [ ] 能正确解析进度信息
- [ ] 百分比计算准确
- [ ] 支持不同时长的视频
- [ ] 错误信息能正确提取

---

**任务状态**：待开始
**创建日期**：2025-10-02
