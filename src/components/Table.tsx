import { SimplexState } from '../types/SimplexResult'
import './Table.css'

interface TableProps {
  table: SimplexState['table']
  outVariables: SimplexState['outVariables']
  restrictionsSize: number
  variablesSize: number
}

export const Table: React.FC<TableProps> = ({ table, outVariables, restrictionsSize, variablesSize }) => {
  return (
    <table className='simplex-table-result'>
      <thead>
        <tr>
          <th />
          {Array.from({ length: variablesSize + 1 }, (_, i) => (
            <th key={`th${i}`}>X<sub>{i}</sub></th>
          ))}
          {Array.from({ length: restrictionsSize }, (_, i) => (
            <th key={`ths${i}`}>S<sub>{i + 1}</sub></th>
          ))}
          <th>Solución</th>
        </tr>
      </thead>
      <tbody>
        {table.map((row, rowIndex) => (
          <tr key={`trh${rowIndex}`}>
            <th>
              {
                rowIndex === 0
                  ? <>X<sub>0</sub></>
                  : outVariables[rowIndex - 1] !== null
                    ? <>X<sub>{(outVariables[rowIndex - 1] ?? 0) + 1}</sub></>
                    : <>S<sub>{rowIndex}</sub></>
              }
            </th>
            {row.map((value, colIndex) => (
              <td key={`td${rowIndex}-${colIndex}`}>{value.toLocaleString('fullwide', { maximumFractionDigits: 3 })}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
