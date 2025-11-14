import { createContext, PropsWithChildren, useState } from 'react'
import type { FOAtomBase, FOAtom, FOContextProps } from '../types/FO'

export const FOContext = createContext<FOContextProps | null>(null)

export const FOProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const createEmptyFOAtom = (): FOAtom => {
    return {
      id: crypto.randomUUID(),
      coefficient: 0
    }
  }

  const [foAtoms, setFoAtoms] = useState<FOAtom[]>([createEmptyFOAtom()])

  const addFOAtom = (atom: FOAtomBase): void => {
    setFoAtoms(prevAtoms => [...prevAtoms, { ...atom, id: crypto.randomUUID() }])
  }

  const editCoefficient = (id: string, newCoefficient: number): void => {
    setFoAtoms(prevAtoms =>
      prevAtoms.map(atom =>
        atom.id === id ? { ...atom, coefficient: newCoefficient } : atom
      )
    )
  }

  const getFOAtom = (id: string): FOAtom | undefined => {
    return foAtoms.find(atom => atom.id === id)
  }
  const removeFOAtom = (id: string): void => {
    if (foAtoms.length <= 1) return
    setFoAtoms(prevAtoms => prevAtoms.filter(atom => atom.id !== id))
  }

  return (
    <FOContext.Provider value={{
      foAtoms,
      addFOAtom,
      editCoefficient,
      getFOAtom,
      removeFOAtom
    }}
    >
      {children}
    </FOContext.Provider>
  )
}
