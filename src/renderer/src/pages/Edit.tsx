import { PageContainer } from '@renderer/components/PageContainer/PageContainer';

export function Edit() {
  return (
    <PageContainer
      title="视频编辑"
      description="剪辑、裁剪、旋转、翻转等编辑功能"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">视频编辑功能开发中...</p>
      </div>
    </PageContainer>
  );
}
