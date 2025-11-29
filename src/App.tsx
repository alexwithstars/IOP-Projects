import { ReactElement } from 'react'
import { Route, Routes } from 'react-router'
import { ROUTES } from '@/const/routes'

function App (): ReactElement {
  return (
    <Routes>
      {
        Object.values(ROUTES).map(route => (
          <Route
            key={`${route.path}-route`}
            path={route.path}
            element={<route.element />}
          />
        ))
      }
    </Routes>
  )
}

export default App
