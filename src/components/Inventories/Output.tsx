import { ReactElement } from 'react'
import './Output.css'
import { useInventoriesOutput } from '@/hooks/useInventoriesOutput'

export const Output = (): ReactElement => {
  const { output } = useInventoriesOutput()

  return (
    <article className='output-container'>
      <h2 className='output-title'>Resultados</h2>
      <div className='output-content'>
        <div className='output-item'>
          <span className='output-item-label'>Cantidad óptima de pedido (Q)</span>
          <span className='output-item-value'>
            {(isNaN(output.q) || output.q === Infinity
              ? 'Invalid values'
              : <>{output.q.toLocaleString('fullwide', { maximumFractionDigits: 3 })}<span className='output-item-value-unit'>unidades</span></>
            )}
          </span>
        </div>
        <div className='output-item'>
          <span className='output-item-label'>Costo total (CT)</span>
          <span className='output-item-value'>
            {(isNaN(output.TC) || output.TC === Infinity
              ? 'Invalid values'
              : <>${output.TC.toLocaleString('fullwide', { maximumFractionDigits: 3 })}</>
            )}
          </span>
        </div>
      </div>
    </article>
  )
}
