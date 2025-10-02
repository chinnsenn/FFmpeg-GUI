import { PageContainer } from '@renderer/components/PageContainer/PageContainer';

export function Subtitle() {
  return (
    <PageContainer
      title="字幕功能"
      description="添加、提取、编辑视频字幕"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">字幕功能开发中...</p>
      </div>
    </PageContainer>
  );
}
