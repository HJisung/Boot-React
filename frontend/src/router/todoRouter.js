import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'

const loading = <div>Loading....</div>
const List = lazy(() => import('../pages/todo/ListPage'))
const Read = lazy(() => import('../pages/todo/ReadPage'))
const Add = lazy(() => import('../pages/todo/AddPage'))
const Modify = lazy(() => import('../pages/todo/ModifyPage'))

export default function todoRouter() {
  return [
    { path: 'list', element: <Suspense fallback={loading}><List /></Suspense> },
    { index: true, element: <Navigate to="list" replace /> },
    { path: 'read/:tno', element: <Suspense fallback={loading}><Read /></Suspense> },
    { path: 'add', element: <Suspense fallback={loading}><Add /></Suspense> },
    { path: 'modify/:tno', element: <Suspense fallback={loading}><Modify /></Suspense> },
  ]
}
