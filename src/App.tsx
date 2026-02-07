import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { REGISTERED_GAMES } from './config/games';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import HomePage from './pages/HomePage';

/**
 * 路由级懒加载占位
 */
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50" role="status" aria-label="页面加载中">
    <LoadingSpinner size="lg" label="页面加载中" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {REGISTERED_GAMES.map(({ path, component: GameComponent }) => (
            <Route
              key={path}
              path={path}
              element={<GameComponent />}
            />
          ))}
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
