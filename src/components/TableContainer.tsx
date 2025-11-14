import { ReactElement } from 'react'
import { useSimplexResult } from '../hooks/useSimplexResult'
import { Table } from './Table'
import './TableContainer.css'

export const TableContainer = (): ReactElement => {
  const { results, variablesSize, restrictionsSize } = useSimplexResult()

  return (
    <section className='table-container'>
      <h2 className='table-title'>Resultados</h2>
      <div className='table-results-container'>
        {
        results.length === 0
          ? <p className='table-container__no-data'>No hay datos para mostrar</p>
          : results.map((result, index) => (
            <Table
              key={`tb${index}`}
              table={result.table}
              outVariables={result.outVariables}
              restrictionsSize={restrictionsSize}
              variablesSize={variablesSize}
            />
          ))
      }
      </div>
    </section>
  )
}
