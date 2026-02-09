import { Outlet } from 'react-router-dom'
import GameLayout from '../components/layout/GameLayout'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
        <GameLayout
        gameTitle="Temio"
        showHomeLink={false}
        titleLinkToHome={true}
        >
        <main className="flex-1">
            <Outlet />
        </main>
        </GameLayout>
    </div>
  )
}
