import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@renderer/components/Layout/Layout';
import { Home } from '@renderer/pages/Home';
import { Convert } from '@renderer/pages/Convert';
import { Compress } from '@renderer/pages/Compress';
import { Queue } from '@renderer/pages/Queue';
import { Settings } from '@renderer/pages/Settings';
import { ButtonTest } from '@renderer/pages/__tests__/ButtonTest';

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
        path: 'queue',
        element: <Queue />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '__test__/button',
        element: <ButtonTest />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
