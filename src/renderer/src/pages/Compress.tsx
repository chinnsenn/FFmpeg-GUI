import { PageContainer } from '@renderer/components/PageContainer/PageContainer';

export function Compress() {
  return (
    <PageContainer
      title="视频压缩"
      description="智能压缩，平衡质量与文件大小"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">视频压缩功能开发中...</p>
      </div>
    </PageContainer>
  );
}
