import { useRestrictions } from '@/hooks/useRestrictions'
import { PlusButton } from '../PlusButton'
import { Restriction } from './Restriction'
import './RestrictionsContainer.css'

export const RestrictionsContainer: React.FC = () => {
  const { restrictions, addRestriction } = useRestrictions()

  return (
    <section className='restrictions-container'>
      <h2 className='restrictions-title'>Restricciones</h2>
      <div className='restrictions-wrapper'>
        {restrictions.map((restriction, index) => (
          <Restriction key={restriction.id} restriction={restriction} index={index} />
        ))}
        <PlusButton onClick={() => addRestriction()} />
      </div>
    </section>
  )
}
