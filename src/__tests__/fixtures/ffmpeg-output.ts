/**
 * FFmpeg 输出测试数据
 */

// 标准 FFmpeg 进度输出
export const FFMPEG_PROGRESS_OUTPUT = `
frame=  123 fps= 30 q=28.0 size=    1024kB time=00:00:05.00 bitrate=1500.0kbits/s speed= 1.5x
`;

// 完整的 FFmpeg 进度输出
export const FFMPEG_FULL_PROGRESS = `
frame=  456 fps= 60 q=22.0 size=    5120kB time=00:00:15.20 bitrate=2750.0kbits/s speed= 2.0x
`;

// FFmpeg 版本输出
export const FFMPEG_VERSION_OUTPUT = `
ffmpeg version 6.0 Copyright (c) 2000-2023 the FFmpeg developers
built with Apple clang version 14.0.0 (clang-1400.0.29.202)
`;

// FFprobe JSON 输出
export const FFPROBE_OUTPUT = `{
  "streams": [
    {
      "index": 0,
      "codec_name": "h264",
      "codec_long_name": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
      "codec_type": "video",
      "width": 1920,
      "height": 1080,
      "r_frame_rate": "30/1",
      "avg_frame_rate": "30/1",
      "bit_rate": "2500000"
    },
    {
      "index": 1,
      "codec_name": "aac",
      "codec_long_name": "AAC (Advanced Audio Coding)",
      "codec_type": "audio",
      "sample_rate": "48000",
      "channels": 2,
      "bit_rate": "128000"
    }
  ],
  "format": {
    "filename": "test.mp4",
    "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
    "format_long_name": "QuickTime / MOV",
    "duration": "125.500000",
    "size": "41943040",
    "bit_rate": "2669073"
  }
}`;

// 无效的 FFmpeg 输出
export const INVALID_FFMPEG_OUTPUT = `
Invalid data or corrupted stream
`;

// FFmpeg 错误输出
export const FFMPEG_ERROR_OUTPUT = `
Error opening input file test.mp4: No such file or directory
`;
