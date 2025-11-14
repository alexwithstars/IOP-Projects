import { ReactElement } from 'react'
import { Route, Routes } from 'react-router'
import { Home } from './pages/Home'
import { Simplex } from './pages/Simplex'
import { Dijkstra } from './pages/Dijkstra'
import { Hungarian } from './pages/Hungarian'
import { ROUTES } from './const/routes'

function App (): ReactElement {
  return (
    <Routes>
      <Route path={ROUTES.HOME.path} element={<Home />} />
      <Route path={ROUTES.SIMPLEX.path} element={<Simplex />} />
      <Route path={ROUTES.DIJKSTRA.path} element={<Dijkstra />} />
      <Route path={ROUTES.HUNGARIAN.path} element={<Hungarian />} />
    </Routes>
  )
}

export default App
