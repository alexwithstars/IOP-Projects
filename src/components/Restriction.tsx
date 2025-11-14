import { useState } from 'react'
import './Restriction.css'
import type { Restriction as RestrictionType } from '../types/Restrictions'
import { FOAtom } from '../types/FO'
import { useRestrictions } from '../hooks/useRestrictions'
import { CoefficientInput } from './CoefficientInput'
import { IconCircleMinus } from '@tabler/icons-react'

interface RestrictionProps {
  restriction: RestrictionType
  index: number
}

export const Restriction: React.FC<RestrictionProps> = ({ restriction, index }) => {
  const { restrictions, editRestriction, removeRestriction } = useRestrictions()

  const [expand, setExpand] = useState(false)

  const handleCoefficientChange = (newValue: number, atomId: FOAtom['id']): void => {
    editRestriction(restriction.id, {
      atoms: restriction.atoms.map(atom =>
        atom.variableId === atomId
          ? { ...atom, coefficient: newValue }
          : atom
      ),
      value: restriction.value
    })
  }

  const handleValueChange = (newValue: number): void => {
    editRestriction(restriction.id, {
      atoms: restriction.atoms,
      value: newValue
    })
  }

  return (
    <div className='restriction-container'>
      <section
        className='restriction-label'
        onClick={() => setExpand(!expand)}
      >
        <span className='restriction-label-text'>
          {`Restricción ${index + 1}`}
        </span>
        <section className='restriction-label-indicators'>
          {
            restrictions.length > 1 && (
              <IconCircleMinus
                className='restriction-label-remove-icon'
                onClick={(e) => {
                  e.stopPropagation()
                  removeRestriction(restriction.id)
                }}
              />
            )
          }
          <span className='restriction-label-indicator'>
            {expand ? '▲' : '▼'}
          </span>
        </section>
      </section>
      {expand && (
        <div className='restriction-content'>
          {restriction.atoms.map(({ coefficient, variableId }, index) => (
            <div key={'ra' + variableId} className={`restriction-atom ${coefficient === 0 ? 'disabled' : ''}`}>
              <CoefficientInput
                onChange={newValue => handleCoefficientChange(newValue, variableId)}
                index={index}
              />
            </div>
          ))}
          <div className='restriction-atom-value'>
            <span> = </span>
            <CoefficientInput
              onChange={newValue => handleValueChange(newValue)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
