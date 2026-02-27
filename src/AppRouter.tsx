import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from 'react-router-dom';
import { Loading } from '@/components/Loading/Loading';
import { AppLayout } from '@/layouts/AppLayout/AppLayout';

const HomePage = lazy(() => import('@/pages/HomePage/HomePage'));
const FreeGamePage = lazy(() => import('@/pages/FreeGamePage/FreeGamePage'));
const DailyGamePage = lazy(() => import('@/pages/DailyGamePage/DailyGamePage'));
const StatsPage = lazy(() => import('@/pages/StatsPage/StatsPage'));
const TutorialPage = lazy(() => import('@/pages/TutorialPage/TutorialPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage/PrivacyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/NotFoundPage'));

function SuspenseWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <ScrollRestoration />
      <Outlet />
    </Suspense>
  );
}

const router = createBrowserRouter(
  [
    {
      element: <SuspenseWrapper />,
      children: [
        // ゲームページは AppLayout を使わない（GameHeader が独自レイアウトを持つため）
        { path: '/games/free', element: <FreeGamePage /> },
        { path: '/games/daily', element: <DailyGamePage /> },
        // AppLayout を共通レイアウトとして使用するルート
        {
          element: <AppLayout />,
          children: [
            { path: '/', element: <HomePage /> },
            { path: '/stats', element: <StatsPage /> },
            { path: '/tutorial', element: <TutorialPage /> },
            { path: '/terms', element: <TermsPage /> },
            { path: '/privacy', element: <PrivacyPage /> },
            { path: '*', element: <NotFoundPage /> },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
