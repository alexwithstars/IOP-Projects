import { ReactElement } from 'react'
import { Navbar } from '@/components/Navbar'
import './CPMPage.css'
import { CPMProvider } from '@/contexts/CPM'
import { Input } from '@/components/CPM/Input'
import { GraphCanvas } from '@/components/CPM/GraphCanvas'

export function CPMPage (): ReactElement {
  return (
    <CPMProvider>
      <main className='cpm-container'>
        <Navbar
          title='Método de Ruta Crítica (CPM)'
          backgroundColor='var(--primary800)'
          color='var(--primary300)'
        />
        <section className='cpm-content'>
          <div className='cpm-input-section'>
            <Input />
          </div>
          <div className='cpm-canvas-section'>
            <GraphCanvas />
          </div>
        </section>
      </main>
    </CPMProvider>
  )
}
