import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { REGISTERED_GAMES } from './config/games'
import { LoadingSpinner } from './components/common/LoadingSpinner'
import HomePage from './pages/HomePage'
import MainLayout from './layouts/MainLayout'
import NotFound from './pages/NotFound'

const PageLoadingFallback = () => (
  <div
    className="min-h-screen flex items-center justify-center bg-slate-50"
    role="status"
    aria-label="页面加载中"
  >
    <LoadingSpinner size="lg" label="页面加载中" />
  </div>
)

function App() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* 使用统一 Layout 的页面 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          {REGISTERED_GAMES.map(({ path, component: GameComponent }) => (
            <Route
              key={path}
              path={path}
              element={<GameComponent />}
            />
          ))}
        </Route>

        {/* 以后可以在这里放不需要 layout 的页面 */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
