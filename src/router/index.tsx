import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/HomePage'
import Stroop from '../pages/StroopPage'
import Schulte from '../pages/SchultePage'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/stroop',
        element: <Stroop />,
      },
      {
        path: '/schulte',
        element: <Schulte />,
      },
    ],
  },
//   {
//     path: '/login',
//     element: <Login />, // 不需要 layout 的页面
//   },
])