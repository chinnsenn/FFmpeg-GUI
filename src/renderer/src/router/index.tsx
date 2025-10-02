import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@renderer/components/Layout/Layout';
import { Home } from '@renderer/pages/Home';
import { Convert } from '@renderer/pages/Convert';
import { Compress } from '@renderer/pages/Compress';
import { Subtitle } from '@renderer/pages/Subtitle';
import { Watermark } from '@renderer/pages/Watermark';
import { Queue } from '@renderer/pages/Queue';
import { Settings } from '@renderer/pages/Settings';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'convert',
        element: <Convert />,
      },
      {
        path: 'compress',
        element: <Compress />,
      },
      {
        path: 'subtitle',
        element: <Subtitle />,
      },
      {
        path: 'watermark',
        element: <Watermark />,
      },
      {
        path: 'queue',
        element: <Queue />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
