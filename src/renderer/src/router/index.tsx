import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@renderer/components/Layout/Layout';
import { Home } from '@renderer/pages/Home';
import { Convert } from '@renderer/pages/Convert';
import { Compress } from '@renderer/pages/Compress';
import { Queue } from '@renderer/pages/Queue';
import { Settings } from '@renderer/pages/Settings';
import { ButtonTest } from '@renderer/pages/__tests__/ButtonTest';
import FormTest from '@renderer/pages/FormTest';
import ProgressTest from '@renderer/pages/__tests__/ProgressTest';
import CardTest from '@renderer/pages/__tests__/CardTest';
import ModalTest from '@renderer/pages/__tests__/ModalTest';
import ToastTest from '@renderer/pages/__tests__/ToastTest';

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
      {
        path: '__test__/forms',
        element: <FormTest />,
      },
      {
        path: '__test__/progress',
        element: <ProgressTest />,
      },
      {
        path: '__test__/card',
        element: <CardTest />,
      },
      {
        path: '__test__/modal',
        element: <ModalTest />,
      },
      {
        path: '__test__/toast',
        element: <ToastTest />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
