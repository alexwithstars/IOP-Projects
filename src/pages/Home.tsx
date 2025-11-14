import { PageCard } from '../components/PageCard'
import './Home.css'
import { ROUTES } from '../const/routes'
import { ReactElement } from 'react'

export function Home (): ReactElement {
  return (
    <section className='home-container'>
      <main className='home-content'>
        <h1 className='home-title'>Investigación de Operaciones</h1>
        <section className='home-page-cards'>
          <PageCard
            title='Simplex'
            to={ROUTES.SIMPLEX.path}
            icon={ROUTES.SIMPLEX.icon}
          />
          <PageCard
            title='Dijkstra'
            to={ROUTES.DIJKSTRA.path}
            icon={ROUTES.DIJKSTRA.icon}
          />
          <PageCard
            title='Húngaro'
            to={ROUTES.HUNGARIAN.path}
            icon={ROUTES.HUNGARIAN.icon}
          />
        </section>
      </main>
    </section>
  )
}
