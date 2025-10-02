# Task-08: 命令构建器基础框架

**任务ID**：Task-08 | **阶段**：阶段二 | **难度**：⭐⭐ | **时间**：2天 | **依赖**：Task-06

## 任务目标
创建 FFmpeg 命令构建器,根据用户参数生成正确的 FFmpeg 命令。

## 详细需求
- [ ] 创建命令构建器类
- [ ] 支持基础参数(输入/输出文件、编解码器、比特率等)
- [ ] 参数验证
- [ ] 命令字符串生成

## 核心代码
```typescript
export class FFmpegCommandBuilder {
  build(options: ConvertOptions): string[] {
    const args: string[] = ['-i', options.input];
    
    if (options.codec) args.push('-c:v', options.codec);
    if (options.bitrate) args.push('-b:v', options.bitrate);
    
    args.push(options.output);
    return args;
  }
}
```

## 验收标准
- [ ] 能生成正确的 FFmpeg 命令
- [ ] 参数顺序正确
- [ ] 特殊字符正确转义

**任务状态**：待开始
