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
          {
            Object.values(ROUTES).flatMap(route => {
              return route.element !== Home
                ? [<PageCard
                    key={`${route.path}-card`}
                    title={route.name}
                    to={route.path}
                    icon={route.icon}
                   />]
                : []
            })
          }
        </section>
      </main>
    </section>
  )
}
