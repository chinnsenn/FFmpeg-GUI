import { PageContainer } from '@renderer/components/PageContainer/PageContainer';
import { Card, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { RefreshCw, Scissors, Archive, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const features = [
    {
      icon: RefreshCw,
      title: '格式转换',
      description: '支持 50+ 种视频/音频格式互转',
      path: '/convert',
    },
    {
      icon: Scissors,
      title: '视频编辑',
      description: '剪辑、裁剪、旋转、翻转等功能',
      path: '/edit',
    },
    {
      icon: Archive,
      title: '视频压缩',
      description: '智能压缩，保持高质量',
      path: '/compress',
    },
    {
      icon: Zap,
      title: '批量处理',
      description: '任务队列，高效处理',
      path: '/queue',
    },
  ];

  return (
    <PageContainer
      title="欢迎使用 FFmpeg GUI"
      description="一款强大、易用的视频处理工具"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.path} to={feature.path}>
              <Card className="cursor-pointer transition-all hover:shadow-lg">
                <CardHeader>
                  <Icon className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
