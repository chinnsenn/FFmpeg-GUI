import { FFmpegSetup } from '@renderer/components/FFmpegSetup/FFmpegSetup';

export function Settings() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight text-text-primary mb-2"
          style={{ letterSpacing: '-0.02em' }}
        >
          设置
        </h1>
        <p className="text-sm text-text-secondary">配置应用偏好和 FFmpeg 路径</p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <FFmpegSetup />
      </div>
    </div>
  );
}
