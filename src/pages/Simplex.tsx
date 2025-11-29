import { ReactElement } from 'react'
import './Simplex.css'
import { Navbar } from '@/components/Navbar'
import { FOContainer } from '@/components/Simplex/FOContainer'
import { FOProvider } from '@/contexts/FO'
import { RestrictionsContainer } from '@/components/Simplex/RestrictionsContainer'
import { RestrictionsProvider } from '@/contexts/Restrictions'
import { SimplexResultProvider } from '@/contexts/SimplexResult'
import { TableContainer } from '@/components/Simplex/TableContainer'
import { Solution } from '@/components/Simplex/Solution'

export function Simplex (): ReactElement {
  return (
    <FOProvider>
      <RestrictionsProvider>
        <SimplexResultProvider>
          <main className='simplex-container'>
            <Navbar
              title='Simplex Solver'
              backgroundColor='var(--primary800)'
              color='var(--primary300)'
            />
            <section className='simplex-function'>
              <FOContainer />
            </section>
            <div className='simplex-wrapper'>
              <section className='simplex-restrictions'>
                <RestrictionsContainer />
              </section>
              <div className='simplex-results'>
                <section className='simplex-table'>
                  <TableContainer />
                </section>
                <section className='simplex-solution'>
                  <Solution />
                </section>
              </div>
            </div>
          </main>
        </SimplexResultProvider>
      </RestrictionsProvider>
    </FOProvider>
  )
}
