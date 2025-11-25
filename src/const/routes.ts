import { IconBuildingWarehouse, IconHome, IconSitemap, IconTableDashed } from '@tabler/icons-react'
import type { Icon } from '@tabler/icons-react'
import { Inventories } from '../pages/Inventories'
import { Simplex } from '../pages/Simplex'
import { CPMPage } from '../pages/CPMPage'
import { Home } from '../pages/Home'

interface Route {
  name: string
  path: string
  icon: Icon
  element: React.FC
}

export const ROUTES: Record<string, Route> = {
  HOME: {
    name: 'Inicio',
    path: '/',
    icon: IconHome,
    element: Home
  },
  SIMPLEX: {
    name: 'Simplex',
    path: '/simplex',
    icon: IconTableDashed,
    element: Simplex
  },
  CPM: {
    name: 'CPM',
    path: '/cpm',
    icon: IconSitemap,
    element: CPMPage
  },
  INVENTORIES: {
    name: 'Inventories',
    path: '/inventories',
    icon: IconBuildingWarehouse,
    element: Inventories
  }
}
