import { PageContainer } from '@renderer/components/PageContainer/PageContainer';

export function Queue() {
  return (
    <PageContainer
      title="任务队列"
      description="查看和管理所有处理任务"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">任务队列功能开发中...</p>
      </div>
    </PageContainer>
  );
}
