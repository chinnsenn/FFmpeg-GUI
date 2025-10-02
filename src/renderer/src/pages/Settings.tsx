import { PageContainer } from '@renderer/components/PageContainer/PageContainer';
import { FFmpegSetup } from '@renderer/components/FFmpegSetup/FFmpegSetup';

export function Settings() {
  return (
    <PageContainer title="设置" description="配置应用偏好和 FFmpeg 路径">
      <div className="space-y-6">
        <FFmpegSetup />
      </div>
    </PageContainer>
  );
}
