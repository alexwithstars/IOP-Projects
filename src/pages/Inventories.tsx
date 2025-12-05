import { ReactElement, useState } from 'react'
import './Inventories.css'
import { Navbar } from '../components/Navbar'
import { ModeSelector, type Mode } from '@/components/Inventories/ModeSelector'
import { IconBox, IconDiscount2Off, IconStack } from '@tabler/icons-react'
import { InventoriesProvider } from '@/contexts/Inventories'
import { Output } from '@/components/Inventories/Output'
import { InputDiscount, InputEOQ, InputProduction } from '@/components/Inventories/Input'

const modes: Array<{
  element: React.FC
  mode: Mode
}> = [
  {
    element: InputEOQ,
    mode: { name: 'Lote Económico', icon: IconBox }
  },
  {
    element: InputDiscount,
    mode: { name: 'Descuento por Cantidad', icon: IconDiscount2Off }
  },
  {
    element: InputProduction,
    mode: { name: 'Lote de Producción', icon: IconStack }
  }
]

export function Inventories (): ReactElement {
  const [selectedMode, setSelectedMode] = useState(0)

  const SelectedElement = modes[selectedMode].element

  return (
    <InventoriesProvider>
      <main className='inventories-container'>
        <Navbar
          title='Inventarios'
          backgroundColor='var(--primary800)'
          color='var(--primary300)'
        />
        <section className='mode-selector-section'>
          <ModeSelector options={modes.map(mode => mode.mode)} onSelect={setSelectedMode} />
        </section>
        <section className='inventories-content-section'>
          <div className='inventories-content-card'>
            <SelectedElement />
          </div>
          <div className='inventories-content-card'>
            <Output />
          </div>
        </section>
      </main>
    </InventoriesProvider>
  )
}
