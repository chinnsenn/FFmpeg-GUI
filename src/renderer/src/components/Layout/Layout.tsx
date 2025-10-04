import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-primary">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶部栏 */}
        <Header />

        {/* 主工作区 */}
        <main className="flex-1 overflow-y-auto bg-background-primary p-8">
          {/* Outlet 用于渲染子路由 */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
