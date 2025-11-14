import { ReactElement } from 'react'
import { useSimplexResult } from '../hooks/useSimplexResult'
import './Solution.css'

export const Solution = (): ReactElement => {
  const { solution } = useSimplexResult()

  return (
    <section className='solution-container'>
      {solution?.map((coefficient, index) => {
        return (
          <div key={`sa${index}`} className='solution-atom'>
            <span className='solution-atom-variable'>
              <div>X<sub>{index}</sub></div>
            </span>
            <span className='solution-atom-coefficient'>{coefficient.toLocaleString('fullwide', { maximumFractionDigits: 3 })}</span>
          </div>
        )
      })}
    </section>
  )
}
