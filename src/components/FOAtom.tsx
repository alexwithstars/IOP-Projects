import './FOAtom.css'
import { FOAtom as FOAtomType } from '../types/FO'
import { useFO } from '../hooks/useFO'
import { CoefficientInput } from './CoefficientInput'
import { PlusButton } from './PlusButton'

interface FOAtomProps {
  last: boolean
  index: number
  atom: FOAtomType
}

export const FOAtom: React.FC<FOAtomProps> = ({ last, index, atom }) => {
  const { addFOAtom, editCoefficient, removeFOAtom } = useFO()

  const handleClick = (): void => {
    addFOAtom({ coefficient: 0 })
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault()
    if (index === 0 && last) return
    removeFOAtom(atom.id)
  }

  return (
    <div
      className='fo-atom-container'
      onContextMenu={handleContextMenu}
    >
      <CoefficientInput
        index={index}
        onChange={(newValue) => editCoefficient(atom.id, newValue)}
      />
      <PlusButton
        onClick={handleClick}
        active={last}
      />
    </div>
  )
}
