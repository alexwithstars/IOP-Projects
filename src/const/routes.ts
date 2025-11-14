import { IconChartDots3, IconChartGridDots, IconHome, IconTableDashed } from '@tabler/icons-react'
import type { Icon } from '@tabler/icons-react'

interface Route {
  name: string
  path: string
  icon: Icon
}

export const ROUTES: Record<string, Route> = {
  HOME: {
    name: 'Inicio',
    path: '/',
    icon: IconHome
  },
  SIMPLEX: {
    name: 'Simplex',
    path: '/simplex',
    icon: IconTableDashed
  },
  HUNGARIAN: {
    name: 'Hungarian',
    path: '/hungarian',
    icon: IconChartDots3
  },
  DIJKSTRA: {
    name: 'Dijkstra',
    path: '/dijkstra',
    icon: IconChartGridDots
  }
}
