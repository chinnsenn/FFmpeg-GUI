import { PageContainer } from '@renderer/components/PageContainer/PageContainer';

export function Watermark() {
  return (
    <PageContainer
      title="水印功能"
      description="添加图片或文字水印"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">水印功能开发中...</p>
      </div>
    </PageContainer>
  );
}
