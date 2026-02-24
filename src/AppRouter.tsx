import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loading } from '@/components/Loading/Loading';
import { AppLayout } from '@/layouts/AppLayout/AppLayout';

const HomePage = lazy(() => import('@/pages/HomePage/HomePage'));
const GamePage = lazy(() => import('@/pages/GamePage/GamePage'));
const StatsPage = lazy(() => import('@/pages/StatsPage/StatsPage'));
const TutorialPage = lazy(() => import('@/pages/TutorialPage/TutorialPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage/PrivacyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/NotFoundPage'));

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* ゲームページは AppLayout を使わない（GameHeader が独自レイアウトを持つため） */}
          <Route path="/games/free" element={<GamePage playType="free" />} />
          <Route path="/games/daily" element={<GamePage playType="daily" />} />

          {/* AppLayout を共通レイアウトとして使用するルート */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/tutorial" element={<TutorialPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
