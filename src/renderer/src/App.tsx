import { Layout } from './components/Layout/Layout';

function App() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">欢迎使用 FFmpeg GUI</h1>
          <p className="mt-2 text-muted-foreground">
            强大而易用的视频处理工具
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-lg font-semibold">格式转换</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              支持 50+ 种视频格式互转
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-lg font-semibold">视频编辑</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              剪辑、裁剪、旋转、合并
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-lg font-semibold">批量处理</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              高效的任务队列管理
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm">
            <strong>平台：</strong>{' '}
            {(window as any).electron?.platform || 'unknown'}
          </p>
          <p className="text-sm">
            <strong>环境：</strong> Development
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default App;
